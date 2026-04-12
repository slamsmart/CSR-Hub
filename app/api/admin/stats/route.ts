import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const adminRoles = ["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR", "AUDITOR"];
    if (!adminRoles.includes((session.user as any).role)) {
      return errorResponse("Akses ditolak", 403);
    }

    const [
      totalProposals,
      approvedProposals,
      pendingVerifications,
      activeProjects,
      verifiedOrgs,
      riskAlerts,
      fundingResult,
      beneficiaryResult,
    ] = await prisma.$transaction([
      prisma.proposal.count(),
      prisma.proposal.count({ where: { status: { in: ["DISETUJUI", "DIDANAI", "BERJALAN", "SELESAI"] } } }),
      prisma.organization.count({ where: { verificationStatus: "MENUNGGU_REVIEW" } }),
      prisma.project.count({ where: { status: "BERJALAN" } }),
      prisma.organization.count({ where: { verificationStatus: "TERVERIFIKASI" } }),
      prisma.fraudFlag.count({ where: { isResolved: false } }),
      prisma.fundingCommitment.aggregate({ _sum: { amount: true }, where: { status: "DIKONFIRMASI" } }),
      prisma.proposal.aggregate({ _sum: { targetBeneficiaries: true } }),
    ]);

    return successResponse({
      totalProposals,
      approvedProposals,
      pendingVerifications,
      activeProjects,
      verifiedOrgs,
      riskAlerts,
      totalFunding: fundingResult._sum.amount?.toString() || "0",
      totalBeneficiaries: beneficiaryResult._sum.targetBeneficiaries || 0,
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return errorResponse("Gagal memuat statistik", 500);
  }
}
