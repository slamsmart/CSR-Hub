import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { kodeProyek: id }] },
      include: {
        proposal: {
          include: {
            organization: { select: { id: true, name: true, logo: true, verificationStatus: true } },
            attachments: true,
          },
        },
        milestones: { orderBy: { orderIndex: "asc" } },
        reports: { orderBy: { createdAt: "desc" } },
        auditReports: {
          orderBy: { createdAt: "desc" },
          include: { auditor: { select: { id: true, name: true } } },
        },
        impactMetrics: { orderBy: { recordedAt: "desc" } },
      },
    });

    if (!project) return errorResponse("Proyek tidak ditemukan", 404);

    return successResponse({
      ...project,
      anggaranTotal: project.anggaranTotal.toString(),
      realisasiAnggaran: project.realisasiAnggaran.toString(),
      sisaAnggaran: project.sisaAnggaran?.toString(),
    });
  } catch (error) {
    return errorResponse("Gagal memuat proyek", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { id } = await params;
    const body = await req.json();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return errorResponse("Proyek tidak ditemukan", 404);

    const updateData: Record<string, unknown> = {};
    if (body.progressFisik !== undefined) updateData.progressFisik = body.progressFisik;
    if (body.progressKeuangan !== undefined) updateData.progressKeuangan = body.progressKeuangan;
    if (body.realisasiAnggaran !== undefined) updateData.realisasiAnggaran = BigInt(body.realisasiAnggaran);
    if (body.status) updateData.status = body.status;
    if (body.picNama) updateData.picNama = body.picNama;
    if (body.nextMonitoringAt) updateData.nextMonitoringAt = new Date(body.nextMonitoringAt);
    updateData.lastMonitoringAt = new Date();

    const updated = await prisma.project.update({ where: { id }, data: updateData });

    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      resource: "projects",
      resourceId: id,
      newValue: updateData,
    });

    return successResponse({ id: updated.id });
  } catch (error) {
    return errorResponse("Gagal memperbarui proyek", 500);
  }
}
