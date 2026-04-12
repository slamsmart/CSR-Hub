import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import {
  successResponse, errorResponse, getPaginationParams,
  buildPaginationMeta, apiRateLimit,
} from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";
import { createNotification, NotificationTemplates } from "@/lib/notifications";
import { generateProposalNumber, generateSlug } from "@/lib/utils";
import { analyzeProposalRisk, analyzeProposalCompleteness, autoTagSDGs, generateProposalSummary } from "@/lib/ai";
import { ProposalStatus, ProposalCategory } from "@prisma/client";

const proposalCreateSchema = z.object({
  title: z.string().min(10).max(200),
  summary: z.string().min(50).max(500),
  description: z.string().min(200),
  category: z.string(),
  sdgTags: z.array(z.string()).min(1),
  keywords: z.array(z.string()).default([]),
  provinsi: z.string().min(1),
  kabupatenKota: z.string().optional(),
  kecamatan: z.string().optional(),
  isNasional: z.boolean().default(false),
  targetBeneficiaries: z.coerce.number().min(1),
  jenisManfaat: z.array(z.string()).default([]),
  deskripsiPenerima: z.string().optional(),
  budgetTotal: z.coerce.number().min(1_000_000),
  fundingTarget: z.coerce.number().min(1_000_000),
  budgetBreakdown: z.array(z.object({
    kategori: z.string(),
    deskripsi: z.string(),
    volume: z.coerce.number(),
    satuan: z.string(),
    hargaSatuan: z.coerce.number(),
    total: z.coerce.number(),
  })).default([]),
  startDate: z.string(),
  endDate: z.string(),
  milestones: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    targetDate: z.string(),
    orderIndex: z.number(),
  })).default([]),
  estimatedImpact: z.string().optional(),
  status: z.enum(["DRAFT", "DIKIRIM"]).default("DRAFT"),
  id: z.string().optional(), // For updates
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(req);

    const status = searchParams.get("status") as ProposalStatus | null;
    const category = searchParams.get("category") as ProposalCategory | null;
    const provinsi = searchParams.get("provinsi");
    const search = searchParams.get("search");
    const budgetMin = searchParams.get("budgetMin");
    const budgetMax = searchParams.get("budgetMax");
    const orgId = searchParams.get("organizationId");
    const isPublic = searchParams.get("public") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Build where clause
    const where: Record<string, unknown> = {};

    // Public endpoint: only show approved/public proposals
    if (!session?.user || isPublic) {
      where.isPublic = true;
      where.status = { in: ["DISETUJUI", "DIDANAI", "BERJALAN", "SELESAI"] };
    } else if (session.user.role === "PENGUSUL") {
      // Pengusul sees their own org's proposals
      where.organizationId = session.user.organizationId;
    } else if (session.user.role === "PERUSAHAAN") {
      // Perusahaan sees submitted/approved proposals
      where.status = { in: ["DIKIRIM", "DALAM_REVIEW", "DISETUJUI", "DIDANAI", "BERJALAN", "SELESAI"] };
    }
    // Admin/verifikator/auditor sees all

    if (status) where.status = status;
    if (category) where.category = category;
    if (provinsi) where.provinsi = { contains: provinsi, mode: "insensitive" };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { nomor: { contains: search, mode: "insensitive" } },
      ];
    }
    if (budgetMin) where.budgetTotal = { ...((where.budgetTotal as object) || {}), gte: BigInt(budgetMin) };
    if (budgetMax) where.budgetTotal = { ...((where.budgetTotal as object) || {}), lte: BigInt(budgetMax) };
    if (orgId) where.organizationId = orgId;

    const [proposals, total] = await prisma.$transaction([
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
              verificationStatus: true,
              trustScore: true,
              type: true,
            },
          },
          _count: { select: { fundingCommitments: true } },
        },
      }),
      prisma.proposal.count({ where }),
    ]);

    const serialized = proposals.map((p) => ({
      ...p,
      budgetTotal: p.budgetTotal.toString(),
      fundingTarget: p.fundingTarget.toString(),
      fundingSecured: p.fundingSecured.toString(),
    }));

    return successResponse(serialized, buildPaginationMeta(total, page, limit));
  } catch (error) {
    console.error("[GET /api/proposals]", error);
    return errorResponse("Gagal memuat proposal", 500);
  }
}

export async function POST(req: NextRequest) {
  // Rate limit
  const rl = apiRateLimit("proposal-create", 10, 60_000)(req);
  if (rl) return rl;

  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);
    if (!["PENGUSUL", "SUPER_ADMIN", "ADMIN_PLATFORM"].includes(session.user.role)) {
      return errorResponse("Anda tidak memiliki akses untuk membuat proposal", 403);
    }

    if (!session.user.organizationId) {
      return errorResponse("Anda belum terdaftar dalam organisasi. Lengkapi profil organisasi terlebih dahulu.", 400);
    }

    const body = await req.json();

    // PATCH (update existing)
    if (body.id) {
      return handleUpdate(req, session, body);
    }

    const parsed = proposalCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Data tidak valid", 400, parsed.error.flatten());
    }

    const data = parsed.data;
    const nomor = generateProposalNumber();
    const slug = generateSlug(data.title) + "-" + Date.now();

    // AI Analysis
    const completenessResult = analyzeProposalCompleteness({
      title: data.title,
      summary: data.summary,
      description: data.description,
      category: data.category,
      sdgTags: data.sdgTags,
      provinsi: data.provinsi,
      targetBeneficiaries: data.targetBeneficiaries,
      budgetTotal: data.budgetTotal,
      budgetBreakdown: data.budgetBreakdown,
      startDate: data.startDate,
      endDate: data.endDate,
      milestones: data.milestones,
      attachments: [],
      jenisManfaat: data.jenisManfaat,
      deskripsiPenerima: data.deskripsiPenerima,
    });

    const riskResult = analyzeProposalRisk({
      budgetTotal: data.budgetTotal,
      targetBeneficiaries: data.targetBeneficiaries,
      durationMonths: Math.max(1, Math.round(
        (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000)
      )),
      completenessScore: completenessResult.score,
    });

    const aiSummary = generateProposalSummary({
      title: data.title,
      organizationName: "Organisasi",
      category: data.category,
      provinsi: data.provinsi,
      targetBeneficiaries: data.targetBeneficiaries,
      budgetTotal: data.budgetTotal,
      durationMonths: Math.max(1, Math.round(
        (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000)
      )),
      sdgCount: data.sdgTags.length,
    });

    const proposal = await prisma.$transaction(async (tx) => {
      const p = await tx.proposal.create({
        data: {
          nomor,
          title: data.title,
          slug,
          summary: data.summary,
          description: data.description,
          category: data.category as ProposalCategory,
          sdgTags: data.sdgTags as any,
          keywords: data.keywords,
          organizationId: session.user.organizationId!,
          createdById: session.user.id,
          provinsi: data.provinsi,
          kabupatenKota: data.kabupatenKota,
          kecamatan: data.kecamatan,
          isNasional: data.isNasional,
          targetBeneficiaries: data.targetBeneficiaries,
          jenisManfaat: data.jenisManfaat,
          deskripsiPenerima: data.deskripsiPenerima,
          budgetTotal: BigInt(Math.round(data.budgetTotal)),
          budgetBreakdown: data.budgetBreakdown,
          fundingTarget: BigInt(Math.round(data.fundingTarget)),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          durationMonths: Math.max(1, Math.round(
            (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000)
          )),
          estimatedImpact: data.estimatedImpact,
          status: data.status as ProposalStatus,
          submittedAt: data.status === "DIKIRIM" ? new Date() : null,
          // AI fields
          aiCompletionScore: completenessResult.score,
          aiRiskScore: riskResult.score,
          aiSummary,
          aiAnalyzedAt: new Date(),
          aiTags: data.keywords,
        },
      });

      // Create milestones
      if (data.milestones.length > 0) {
        await tx.proposalMilestone.createMany({
          data: data.milestones.map((m) => ({
            proposalId: p.id,
            title: m.title,
            description: m.description,
            targetDate: new Date(m.targetDate),
            orderIndex: m.orderIndex,
          })),
        });
      }

      // Create status history
      await tx.proposalStatusHistory.create({
        data: {
          proposalId: p.id,
          toStatus: data.status as ProposalStatus,
          changedBy: session.user.id,
          notes: data.status === "DIKIRIM" ? "Proposal dikirim oleh pengusul" : "Draft disimpan",
        },
      });

      // Update org stats
      await tx.organization.update({
        where: { id: session.user.organizationId! },
        data: { totalProposals: { increment: 1 } },
      });

      return p;
    });

    // Send notification if submitted
    if (data.status === "DIKIRIM") {
      await createNotification({
        userId: session.user.id,
        ...NotificationTemplates.proposalDikirim(data.title, proposal.id),
      });
    }

    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      resource: "proposals",
      resourceId: proposal.id,
      newValue: { nomor, title: data.title, status: data.status },
      ipAddress: req.headers.get("x-forwarded-for") || undefined,
    });

    return successResponse(
      { id: proposal.id, nomor: proposal.nomor, slug: proposal.slug },
      undefined,
      201
    );
  } catch (error) {
    console.error("[POST /api/proposals]", error);
    return errorResponse("Gagal membuat proposal", 500);
  }
}

async function handleUpdate(req: NextRequest, session: any, body: any) {
  const { id, ...updateData } = body;

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) return errorResponse("Proposal tidak ditemukan", 404);
  if (existing.createdById !== session.user.id && !["SUPER_ADMIN", "ADMIN_PLATFORM"].includes(session.user.role)) {
    return errorResponse("Akses ditolak", 403);
  }
  if (!["DRAFT", "MEMBUTUHKAN_REVISI"].includes(existing.status)) {
    return errorResponse("Proposal ini tidak dapat diedit lagi", 400);
  }

  const updated = await prisma.proposal.update({
    where: { id },
    data: {
      title: updateData.title,
      summary: updateData.summary,
      description: updateData.description,
      category: updateData.category,
      sdgTags: updateData.sdgTags,
      keywords: updateData.keywords,
      provinsi: updateData.provinsi,
      kabupatenKota: updateData.kabupatenKota,
      targetBeneficiaries: updateData.targetBeneficiaries,
      jenisManfaat: updateData.jenisManfaat,
      budgetTotal: updateData.budgetTotal ? BigInt(Math.round(updateData.budgetTotal)) : undefined,
      budgetBreakdown: updateData.budgetBreakdown,
      fundingTarget: updateData.fundingTarget ? BigInt(Math.round(updateData.fundingTarget)) : undefined,
      startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
      endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      status: updateData.status,
      submittedAt: updateData.status === "DIKIRIM" && !existing.submittedAt ? new Date() : undefined,
      updatedAt: new Date(),
    },
  });

  if (updateData.status === "DIKIRIM" && existing.status !== "DIKIRIM") {
    await prisma.proposalStatusHistory.create({
      data: {
        proposalId: id,
        fromStatus: existing.status,
        toStatus: "DIKIRIM",
        changedBy: session.user.id,
        notes: "Proposal dikirim oleh pengusul",
      },
    });
  }

  return successResponse({ id: updated.id, nomor: updated.nomor });
}

export async function PATCH(req: NextRequest) {
  return POST(req); // PATCH also handled in POST for simplicity
}
