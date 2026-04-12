import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";
import { createNotification, NotificationTemplates } from "@/lib/notifications";
import { ProposalStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();

    const proposal = await prisma.proposal.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { nomor: id }],
      },
      include: {
        organization: {
          select: {
            id: true, name: true, logo: true, type: true,
            verificationStatus: true, trustScore: true,
            provinsi: true, website: true, email: true,
          },
        },
        createdBy: { select: { id: true, name: true, image: true } },
        attachments: true,
        milestones: { orderBy: { orderIndex: "asc" } },
        statusHistory: {
          orderBy: { changedAt: "desc" },
          take: 10,
        },
        fundingCommitments: {
          include: {
            disbursements: true,
          },
        },
        coFunding: {
          include: {
            organization: { select: { id: true, name: true, logo: true } },
          },
        },
        project: {
          include: {
            milestones: { orderBy: { orderIndex: "asc" } },
            reports: { orderBy: { createdAt: "desc" }, take: 3 },
          },
        },
        impactReports: true,
        fraudFlags: session?.user && ["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR"].includes(session.user.role)
          ? true : false,
      },
    });

    if (!proposal) return errorResponse("Proposal tidak ditemukan", 404);

    // Access control
    if (!proposal.isPublic && !session?.user) {
      return errorResponse("Akses ditolak", 403);
    }

    // Update view count
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {}); // Don't fail if this fails

    if (session?.user) {
      await createAuditLog({
        userId: session.user.id,
        action: "VIEW_SENSITIVE",
        resource: "proposals",
        resourceId: proposal.id,
      });
    }

    return successResponse({
      ...proposal,
      budgetTotal: proposal.budgetTotal.toString(),
      fundingTarget: proposal.fundingTarget.toString(),
      fundingSecured: proposal.fundingSecured.toString(),
    });
  } catch (error) {
    console.error("[GET /api/proposals/:id]", error);
    return errorResponse("Gagal memuat proposal", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);
    const body = await req.json();
    const { action, notes, status } = body;

    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return errorResponse("Proposal tidak ditemukan", 404);

    // Handle admin actions
    if (action === "review") {
      if (!["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR"].includes(session.user.role)) {
        return errorResponse("Akses ditolak", 403);
      }

      const newStatus = status as ProposalStatus;
      await prisma.$transaction([
        prisma.proposal.update({
          where: { id },
          data: {
            status: newStatus,
            reviewedById: session.user.id,
            approvedAt: newStatus === "DISETUJUI" ? new Date() : undefined,
            rejectedAt: newStatus === "DITOLAK" ? new Date() : undefined,
          },
        }),
        prisma.proposalStatusHistory.create({
          data: {
            proposalId: id,
            fromStatus: proposal.status,
            toStatus: newStatus,
            changedBy: session.user.id,
            notes,
          },
        }),
      ]);

      // Notify proposal creator
      const creator = await prisma.user.findFirst({
        where: { organization: { some: { organizationId: proposal.organizationId } } },
      });
      if (creator) {
        if (newStatus === "DISETUJUI") {
          await createNotification({ userId: creator.id, ...NotificationTemplates.proposalDisetujui(proposal.title, id) });
        } else if (newStatus === "DITOLAK") {
          await createNotification({ userId: creator.id, ...NotificationTemplates.proposalDitolak(proposal.title, id, notes) });
        } else if (newStatus === "MEMBUTUHKAN_REVISI") {
          await createNotification({ userId: creator.id, ...NotificationTemplates.proposalRevisi(proposal.title, id) });
        }
      }

      await createAuditLog({
        userId: session.user.id,
        action: "APPROVE",
        resource: "proposals",
        resourceId: id,
        newValue: { status: newStatus, notes },
      });

      return successResponse({ id, status: newStatus });
    }

    // Handle owner update (partial)
    if (proposal.createdById === session.user.id || ["SUPER_ADMIN", "ADMIN_PLATFORM"].includes(session.user.role)) {
      const updateData: Record<string, unknown> = {};
      if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;
      if (body.title) updateData.title = body.title;

      await prisma.proposal.update({ where: { id }, data: updateData });
      return successResponse({ id });
    }

    return errorResponse("Akses ditolak", 403);
  } catch (error) {
    console.error("[PATCH /api/proposals/:id]", error);
    return errorResponse("Gagal memperbarui proposal", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return errorResponse("Proposal tidak ditemukan", 404);

    if (proposal.createdById !== session.user.id && session.user.role !== "SUPER_ADMIN") {
      return errorResponse("Akses ditolak", 403);
    }
    if (!["DRAFT", "DITOLAK", "DIBATALKAN"].includes(proposal.status)) {
      return errorResponse("Proposal yang sudah diproses tidak dapat dihapus", 400);
    }

    await prisma.proposal.update({ where: { id }, data: { status: "DIBATALKAN" } });

    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      resource: "proposals",
      resourceId: id,
      oldValue: { title: proposal.title, status: proposal.status },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/proposals/:id]", error);
    return errorResponse("Gagal menghapus proposal", 500);
  }
}
