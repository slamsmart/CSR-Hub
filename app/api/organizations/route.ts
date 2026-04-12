import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, getPaginationParams, buildPaginationMeta } from "@/lib/api-helpers";
import { createAuditLog } from "@/lib/security";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

const updateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  foundedYear: z.number().optional(),
  website: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  provinsi: z.string().optional(),
  kabupatenKota: z.string().optional(),
  nomorNPWP: z.string().optional(),
  nomorAkta: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(req);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const verificationStatus = searchParams.get("verificationStatus");
    const provinsi = searchParams.get("provinsi");
    const publicOnly = searchParams.get("public") === "true";

    const where: Record<string, unknown> = {};
    if (publicOnly) where.isPublic = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (type) where.type = type;
    if (verificationStatus) where.verificationStatus = verificationStatus;
    if (provinsi) where.provinsi = { contains: provinsi, mode: "insensitive" };

    const [orgs, total] = await prisma.$transaction([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { trustScore: "desc" }],
        select: {
          id: true, name: true, slug: true, type: true, logo: true,
          description: true, verificationStatus: true, trustScore: true,
          provinsi: true, totalProposals: true, approvedProposals: true,
          totalBeneficiaries: true, projectSuccessRate: true, isFeatured: true,
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return successResponse(orgs, buildPaginationMeta(total, page, limit));
  } catch (error) {
    console.error("[GET /api/organizations]", error);
    return errorResponse("Gagal memuat organisasi", 500);
  }
}
