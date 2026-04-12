import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, getPaginationParams, buildPaginationMeta } from "@/lib/api-helpers";
import { generateProjectCode } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(req);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (session.user.role === "PENGUSUL" && session.user.organizationId) {
      where.proposal = { organizationId: session.user.organizationId };
    } else if (session.user.role === "PERUSAHAAN" && session.user.organizationId) {
      where.proposal = { fundingCommitments: { some: { companyOrgId: session.user.organizationId } } };
    }

    if (status) where.status = status;

    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          proposal: {
            select: {
              id: true, title: true, category: true,
              organization: { select: { id: true, name: true, logo: true } },
            },
          },
          milestones: { orderBy: { orderIndex: "asc" } },
          _count: { select: { reports: true, auditReports: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return successResponse(
      projects.map((p) => ({
        ...p,
        anggaranTotal: p.anggaranTotal.toString(),
        realisasiAnggaran: p.realisasiAnggaran.toString(),
        sisaAnggaran: p.sisaAnggaran?.toString(),
      })),
      buildPaginationMeta(total, page, limit)
    );
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return errorResponse("Gagal memuat proyek", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const allowedRoles = ["SUPER_ADMIN", "ADMIN_PLATFORM", "PERUSAHAAN"];
    if (!allowedRoles.includes(session.user.role)) {
      return errorResponse("Akses ditolak", 403);
    }

    const body = await req.json();
    const { proposalId, startDate, endDate, picNama, picEmail, picTelepon } = body;

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return errorResponse("Proposal tidak ditemukan", 404);
    if (proposal.status !== "DIDANAI") return errorResponse("Proposal belum berstatus 'Didanai'", 400);

    const existing = await prisma.project.findUnique({ where: { proposalId } });
    if (existing) return errorResponse("Proyek untuk proposal ini sudah ada", 409);

    const kodeProyek = generateProjectCode();

    const project = await prisma.project.create({
      data: {
        proposalId,
        kodeProyek,
        name: proposal.title,
        startDate: new Date(startDate || proposal.startDate),
        endDate: new Date(endDate || proposal.endDate),
        anggaranTotal: proposal.budgetTotal,
        picNama,
        picEmail,
        picTelepon,
      },
    });

    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "BERJALAN" },
    });

    return successResponse({ id: project.id, kodeProyek }, undefined, 201);
  } catch (error) {
    console.error("[POST /api/projects]", error);
    return errorResponse("Gagal membuat proyek", 500);
  }
}
