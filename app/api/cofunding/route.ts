import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, getPaginationParams, buildPaginationMeta } from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";
import { z } from "zod";

const commitmentSchema = z.object({
  proposalId: z.string().min(1),
  amount: z.number().positive(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { searchParams } = new URL(req.url);
    const { skip, limit, page } = getPaginationParams(req);
    const status = searchParams.get("status") || undefined;

    const orgMember = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id, isActive: true },
      include: { organization: true },
    });

    if (!orgMember) {
      return errorResponse("Organisasi tidak ditemukan", 404);
    }

    const where: any = {
      companyOrgId: orgMember.organizationId,
      ...(status && { status }),
    };

    const [total, commitments] = await Promise.all([
      prisma.fundingCommitment.count({ where }),
      prisma.fundingCommitment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          proposal: {
            select: {
              id: true,
              nomor: true,
              title: true,
              category: true,
              provinsi: true,
              budgetTotal: true,
              fundingTarget: true,
              fundingSecured: true,
              organization: { select: { name: true } },
              milestones: { select: { isCompleted: true } },
            },
          },
        },
      }),
    ]);

    const serialized = commitments.map((c) => ({
      ...c,
      amount: c.amount.toString(),
      proposal: c.proposal ? {
        ...c.proposal,
        budgetTotal: c.proposal.budgetTotal.toString(),
        fundingTarget: c.proposal.fundingTarget?.toString() || null,
        fundingSecured: c.proposal.fundingSecured?.toString() || null,
      } : null,
    }));

    return successResponse(serialized, buildPaginationMeta(total, page, limit));
  } catch (err) {
    console.error("[GET /api/cofunding]", err);
    return errorResponse("Gagal memuat data co-funding", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);
    if ((session.user as any).role !== "PERUSAHAAN") return errorResponse("Akses ditolak", 403);

    const body = await req.json();
    const parsed = commitmentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Data tidak valid", 400, parsed.error.flatten().fieldErrors);
    }

    const { proposalId, amount, notes } = parsed.data;

    const orgMember = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id, isActive: true },
    });
    if (!orgMember) return errorResponse("Organisasi tidak ditemukan", 404);

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true, status: true, fundingTarget: true, fundingSecured: true },
    });
    if (!proposal) return errorResponse("Proposal tidak ditemukan", 404);

    const existing = await prisma.fundingCommitment.findFirst({
      where: { proposalId, companyOrgId: orgMember.organizationId },
    });
    if (existing) return errorResponse("Perusahaan sudah memiliki komitmen untuk proposal ini", 409);

    const commitment = await prisma.fundingCommitment.create({
      data: {
        proposalId,
        companyOrgId: orgMember.organizationId,
        amount: BigInt(amount),
        notes,
        status: "MENUNGGU_KONFIRMASI",
      },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      resource: "FundingCommitment",
      resourceId: commitment.id,
      newValue: { proposalId, amount, notes },
    });

    return successResponse({ ...commitment, amount: commitment.amount.toString() }, undefined, 201);
  } catch (err) {
    console.error("[POST /api/cofunding]", err);
    return errorResponse("Gagal membuat komitmen", 500);
  }
}
