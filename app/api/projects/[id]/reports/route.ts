import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { z } from "zod";

const reportSchema = z.object({
  reportType: z.enum(["BULANAN", "TRIWULAN", "AKHIR", "KEUANGAN"]),
  reportingPeriod: z.string().min(1, "Periode wajib diisi"),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  summary: z.string().min(10, "Ringkasan minimal 10 karakter"),
  progressFisik: z.number().min(0).max(100),
  progressKeuangan: z.number().min(0).max(100),
  realisasiAnggaran: z.number().min(0),
  pencapaian: z.string().optional(),
  kendala: z.string().optional(),
  rencanaTindakLanjut: z.string().optional(),
  attachments: z.array(z.string()).optional().default([]),
  isSubmitted: z.boolean().optional().default(false),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, proposalId: true },
    });
    if (!project) return errorResponse("Proyek tidak ditemukan", 404);

    const reports = await prisma.projectReport.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: "desc" },
    });

    const serialized = reports.map((r) => ({
      ...r,
      realisasiAnggaran: r.realisasiAnggaran.toString(),
    }));

    return successResponse(serialized);
  } catch (err) {
    console.error("[GET /api/projects/[id]/reports]", err);
    return errorResponse("Gagal memuat laporan", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const body = await req.json();
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Data tidak valid", 400, parsed.error.flatten().fieldErrors);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) return errorResponse("Proyek tidak ditemukan", 404);

    const { realisasiAnggaran, isSubmitted, ...rest } = parsed.data;

    const report = await prisma.projectReport.create({
      data: {
        ...rest,
        projectId,
        realisasiAnggaran: BigInt(realisasiAnggaran),
        isSubmitted,
        submittedAt: isSubmitted ? new Date() : null,
      },
    });

    // Update project progress if submitted
    if (isSubmitted) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          progressFisik: rest.progressFisik,
          progressKeuangan: rest.progressKeuangan,
          realisasiAnggaran: BigInt(realisasiAnggaran),
          lastMonitoringAt: new Date(),
        },
      });
    }

    return successResponse(
      { ...report, realisasiAnggaran: report.realisasiAnggaran.toString() },
      undefined,
      201
    );
  } catch (err) {
    console.error("[POST /api/projects/[id]/reports]", err);
    return errorResponse("Gagal membuat laporan", 500);
  }
}
