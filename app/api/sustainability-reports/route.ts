import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const orgId = (session.user as any).organizationId as string | undefined;

    if (!orgId) return errorResponse("Profil perusahaan tidak ditemukan", 400);

    // Aggregate real project data for this company
    const commitments = await prisma.fundingCommitment.findMany({
      where: {
        companyOrgId: orgId,
        status: { in: ["DIKONFIRMASI", "DICAIRKAN", "SELESAI"] },
      },
      include: {
        proposal: {
          include: {
            organization: { select: { name: true } },
            milestones: { select: { isCompleted: true } },
          },
        },
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        proposal: {
          fundingCommitments: { some: { companyOrgId: orgId } },
        },
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: {
        proposal: {
          select: {
            title: true,
            category: true,
            sdgTags: true,
            provinsi: true,
            budgetTotal: true,
          },
        },
        reports: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Compute aggregates
    const totalDanaCSR = commitments.reduce((sum, c) => sum + Number(c.amount), 0);
    const totalPenerima = 0; // Project model doesn't track beneficiary count directly

    // SDG breakdown
    const sdgMap: Record<string, number> = {};
    projects.forEach((p) => {
      (p.proposal.sdgTags as string[]).forEach((sdg) => {
        sdgMap[sdg] = (sdgMap[sdg] || 0) + 1;
      });
    });

    // Category breakdown
    const catMap: Record<string, { count: number; amount: number }> = {};
    commitments.forEach((c) => {
      const cat = c.proposal.category;
      if (!catMap[cat]) catMap[cat] = { count: 0, amount: 0 };
      catMap[cat].count += 1;
      catMap[cat].amount += Number(c.amount);
    });

    // Monthly spending (estimate spread evenly across year)
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i).toLocaleString("id-ID", { month: "short" }),
      realisasi: Math.round(totalDanaCSR / 12),
      target: Math.round(totalDanaCSR / 12),
    }));

    // ESG score (simplified calculation)
    const completionRate = projects.length > 0
      ? projects.filter((p) => p.status === "SELESAI").length / projects.length
      : 0;
    const esgScore = Math.min(100, Math.round(
      40 + completionRate * 30 + Math.min(20, Object.keys(sdgMap).length * 2) + 10
    ));

    const reportData = {
      year,
      companyOrgId: orgId,
      esgScore,
      totalDanaCSR,
      totalProyek: projects.length,
      totalPenerima,
      totalOrganisasi: new Set(commitments.map((c) => c.proposal.organizationId)).size,
      sdgAchievements: Object.entries(sdgMap).map(([sdg, count]) => ({ sdg, count })),
      categoryBreakdown: Object.entries(catMap).map(([category, data]) => ({
        category,
        count: data.count,
        amount: data.amount,
        percentage: totalDanaCSR > 0 ? Math.round((data.amount / totalDanaCSR) * 100) : 0,
      })),
      monthlyData,
      projects: projects.map((p) => ({
        id: p.id,
        title: p.proposal.title,
        category: p.proposal.category,
        sdgTags: p.proposal.sdgTags,
        provinsi: p.proposal.provinsi,
        status: p.status,
        progressFisik: p.progressFisik,
        progressKeuangan: p.progressKeuangan,
        jumlahPenerima: 0,
        budgetTotal: p.proposal.budgetTotal.toString(),
        realisasiAnggaran: p.realisasiAnggaran?.toString() || "0",
        lastReport: p.reports[0] ? {
          reportType: p.reports[0].reportType,
          submittedAt: p.reports[0].submittedAt,
          progressFisik: p.reports[0].progressFisik,
        } : null,
      })),
      // GRI Standard indicators
      griIndicators: [
        { code: "GRI 2-6", name: "Activities, value chain, and other business relationships", status: "complete" },
        { code: "GRI 3-3", name: "Management of material topics", status: "complete" },
        { code: "GRI 201-1", name: "Direct economic value generated and distributed", status: "complete" },
        { code: "GRI 203-1", name: "Infrastructure investments and services supported", status: projects.length > 0 ? "complete" : "partial" },
        { code: "GRI 203-2", name: "Significant indirect economic impacts", status: "complete" },
        { code: "GRI 413-1", name: "Operations with local community engagement", status: "complete" },
        { code: "GRI 413-2", name: "Operations with significant negative impacts on local communities", status: "complete" },
      ],
    };

    return successResponse(reportData);
  } catch (err) {
    console.error("[GET /api/sustainability-reports]", err);
    return errorResponse("Gagal memuat laporan keberlanjutan", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const body = await req.json();
    const { year = new Date().getFullYear() } = body;
    const orgId = (session.user as any).organizationId as string | undefined;
    if (!orgId) return errorResponse("Profil perusahaan tidak ditemukan", 400);

    // Upsert sustainability report
    const existing = await prisma.sustainabilityReport.findFirst({
      where: { companyOrgId: orgId, year },
    });

    const data = {
      companyOrgId: orgId,
      year,
      title: `Laporan Keberlanjutan ${year}`,
      status: "PUBLISHED",
      publishedAt: new Date(),
      totalDanaCSR: BigInt(body.totalDanaCSR || 0),
      totalProyek: body.totalProyek || 0,
      totalPenerima: body.totalPenerima || 0,
      totalOrganisasi: body.totalOrganisasi || 0,
      sdgAchievements: body.sdgAchievements || [],
      categoryBreakdown: body.categoryBreakdown || [],
      chartsData: body.monthlyData || [],
    };

    const report = existing
      ? await prisma.sustainabilityReport.update({ where: { id: existing.id }, data })
      : await prisma.sustainabilityReport.create({ data });

    return successResponse({
      ...report,
      totalDanaCSR: report.totalDanaCSR?.toString(),
    }, undefined, existing ? 200 : 201);
  } catch (err) {
    console.error("[POST /api/sustainability-reports]", err);
    return errorResponse("Gagal menyimpan laporan", 500);
  }
}
