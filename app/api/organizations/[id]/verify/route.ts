import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";
import { createNotification, NotificationTemplates } from "@/lib/notifications";
import { z } from "zod";

const verifySchema = z.object({
  status: z.enum(["TERVERIFIKASI", "DITOLAK", "MEMBUTUHKAN_DOKUMEN_TAMBAHAN", "DALAM_REVIEW"]),
  notes: z.string().optional(),
  checklistData: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const allowedRoles = ["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR"];
    if (!allowedRoles.includes(session.user.role)) {
      return errorResponse("Akses ditolak", 403);
    }

    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) return errorResponse("Data tidak valid", 400);

    const { id } = await params;
    const { status, notes, checklistData } = parsed.data;

    const org = await prisma.organization.findUnique({ where: { id } });
    if (!org) return errorResponse("Organisasi tidak ditemukan", 404);

    await prisma.$transaction([
      prisma.organization.update({
        where: { id },
        data: {
          verificationStatus: status,
          verifiedAt: status === "TERVERIFIKASI" ? new Date() : undefined,
          verifiedBy: status === "TERVERIFIKASI" ? session.user.id : undefined,
        },
      }),
      prisma.verificationReview.create({
        data: {
          organizationId: id,
          reviewerId: session.user.id,
          status,
          notes,
          checklistData,
        } as any,
      }),
    ]);

    // Notify organization owner
    const owner = await prisma.organizationMember.findFirst({
      where: { organizationId: id, role: "OWNER" },
    });
    if (owner) {
      await createNotification({
        userId: owner.userId,
        ...NotificationTemplates.verifikasiSelesai(org.name, status),
      });
    }

    await createAuditLog({
      userId: session.user.id,
      action: "VERIFY",
      resource: "organizations",
      resourceId: id,
      newValue: { status, notes },
    });

    return successResponse({ id, status });
  } catch (error) {
    console.error("[POST /api/organizations/:id/verify]", error);
    return errorResponse("Gagal memperbarui status verifikasi", 500);
  }
}
