import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  website: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  provinsi: z.string().optional(),
  kabupatenKota: z.string().optional(),
  kecamatan: z.string().optional(),
  nomorNPWP: z.string().optional(),
  nomorAkta: z.string().optional(),
  nomorIzin: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = await prisma.organization.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        companyProfile: true,
        ngoProfile: true,
        documents: {
          where: { isVerified: true },
          select: { id: true, type: true, fileName: true, isVerified: true, uploadedAt: true },
        },
        members: {
          include: { user: { select: { id: true, name: true, image: true } } },
          where: { isActive: true },
          take: 10,
        },
        _count: {
          select: { proposals: true },
        },
      },
    });

    if (!org) return errorResponse("Organisasi tidak ditemukan", 404);

    return successResponse({
      ...org,
      totalFundingReceived: org.totalFundingReceived.toString(),
    });
  } catch (error) {
    console.error("[GET /api/organizations/:id]", error);
    return errorResponse("Gagal memuat organisasi", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { id } = await params;
    const body = await req.json();

    // Check membership / admin
    const isMember = await prisma.organizationMember.findFirst({
      where: { organizationId: id, userId: session.user.id, isActive: true },
    });
    const isAdmin = ["SUPER_ADMIN", "ADMIN_PLATFORM"].includes(session.user.role);

    if (!isMember && !isAdmin) {
      return errorResponse("Akses ditolak", 403);
    }

    // Admin-only fields
    if (body.verificationStatus && !isAdmin && session.user.role !== "VERIFIKATOR") {
      return errorResponse("Anda tidak dapat mengubah status verifikasi", 403);
    }

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Data tidak valid", 400, parsed.error.flatten());
    }

    const old = await prisma.organization.findUnique({ where: { id } });
    const updated = await prisma.organization.update({
      where: { id },
      data: {
        ...parsed.data,
        // Admin-only
        ...(isAdmin || session.user.role === "VERIFIKATOR" ? {
          verificationStatus: body.verificationStatus,
          verifiedAt: body.verificationStatus === "TERVERIFIKASI" ? new Date() : undefined,
          verifiedBy: body.verificationStatus === "TERVERIFIKASI" ? session.user.id : undefined,
        } : {}),
      },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      resource: "organizations",
      resourceId: id,
      oldValue: old,
      newValue: parsed.data,
    });

    return successResponse({ id: updated.id });
  } catch (error) {
    console.error("[PATCH /api/organizations/:id]", error);
    return errorResponse("Gagal memperbarui organisasi", 500);
  }
}
