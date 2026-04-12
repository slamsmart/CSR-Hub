import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { calculateMatchScore } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);
    const userRole = (session.user as any).role as string;
    const userOrgId = (session.user as any).organizationId as string | undefined;
    if (!["PERUSAHAAN", "SUPER_ADMIN", "ADMIN_PLATFORM"].includes(userRole)) {
      return errorResponse("Fitur ini khusus untuk perusahaan", 403);
    }
    if (!userOrgId) {
      return errorResponse("Lengkapi profil perusahaan terlebih dahulu", 400);
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const minScore = parseInt(searchParams.get("minScore") || "60");

    // Get company profile
    const companyProfile = await prisma.companyProfile.findUnique({
      where: { organizationId: userOrgId },
    });

    // Get candidate proposals
    const proposals = await prisma.proposal.findMany({
      where: {
        status: { in: ["DIKIRIM", "DISETUJUI"] },
        isPublic: true,
      },
      include: {
        organization: {
          select: { id: true, name: true, logo: true, verificationStatus: true, trustScore: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const profile = {
      fokusCSR: companyProfile?.fokusCSR || [],
      targetSDGs: companyProfile?.targetSDGs || [],
      wilayahFokus: companyProfile?.wilayahFokus || [],
      budgetMinimum: companyProfile?.budgetMinimum,
      budgetMaksimum: companyProfile?.budgetMaksimum,
      targetDampakMinimum: companyProfile?.targetDampakMinimum,
    };

    // Calculate match scores
    const scored = proposals
      .map((p) => {
        const match = calculateMatchScore(
          {
            id: p.id,
            category: p.category,
            sdgTags: p.sdgTags as any,
            provinsi: p.provinsi,
            budgetTotal: p.budgetTotal,
            targetBeneficiaries: p.targetBeneficiaries,
            aiRiskScore: p.aiRiskScore,
            keywords: p.keywords,
            title: p.title,
            summary: p.summary,
          },
          profile as any
        );
        return {
          proposal: {
            id: p.id,
            nomor: p.nomor,
            title: p.title,
            summary: p.summary,
            category: p.category,
            provinsi: p.provinsi,
            targetBeneficiaries: p.targetBeneficiaries,
            budgetTotal: p.budgetTotal.toString(),
            fundingTarget: p.fundingTarget.toString(),
            sdgTags: p.sdgTags,
            status: p.status,
            organization: p.organization,
          },
          matchScore: match.totalScore,
          breakdown: match.breakdown,
          reasons: match.reasons,
          warnings: match.warnings,
        };
      })
      .filter((r) => r.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    // Update AI match scores in database (background)
    Promise.allSettled(
      scored.map((r) =>
        prisma.proposal.update({
          where: { id: r.proposal.id },
          data: { aiMatchScore: r.matchScore },
        })
      )
    );

    return successResponse({ matches: scored, total: scored.length });
  } catch (error) {
    console.error("[GET /api/ai/match]", error);
    return errorResponse("Gagal menjalankan AI matching", 500);
  }
}
