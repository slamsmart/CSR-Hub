import { Router, type IRouter } from "express";
import { db, proposalsTable, projectsTable, organizationsTable, auditLogsTable, usersTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [proposalStats] = await db.select({
    total: sql<number>`count(*)`,
    approved: sql<number>`count(*) filter (where status in ('disetujui', 'didanai', 'berjalan', 'selesai'))`,
    totalFunding: sql<number>`coalesce(sum(funded_amount), 0)`,
    totalBeneficiaries: sql<number>`coalesce(sum(target_beneficiaries), 0)`,
  }).from(proposalsTable);

  const [projectStats] = await db.select({
    active: sql<number>`count(*) filter (where status = 'aktif')`,
    completed: sql<number>`count(*) filter (where status = 'selesai')`,
  }).from(projectsTable);

  const [orgStats] = await db.select({
    verified: sql<number>`count(*) filter (where verification_status = 'verified')`,
    pending: sql<number>`count(*) filter (where verification_status = 'pending')`,
    avgTrust: sql<number>`coalesce(avg(trust_score), 0)`,
  }).from(organizationsTable);

  const totalProposals = Number(proposalStats.total);
  const approvedProposals = Number(proposalStats.approved);
  const successRate = totalProposals > 0 ? (approvedProposals / totalProposals) * 100 : 0;

  res.json({
    totalProposals,
    approvedProposals,
    activeProjects: Number(projectStats.active),
    completedProjects: Number(projectStats.completed),
    totalFundingRp: Number(proposalStats.totalFunding),
    totalBeneficiaries: Number(proposalStats.totalBeneficiaries),
    verifiedOrganizations: Number(orgStats.verified),
    pendingVerification: Number(orgStats.pending),
    averageTrustScore: parseFloat(Number(orgStats.avgTrust).toFixed(1)),
    successRate: parseFloat(successRate.toFixed(1)),
  });
});

router.get("/dashboard/proposals-by-category", async (_req, res): Promise<void> => {
  const results = await db.select({
    category: proposalsTable.category,
    count: sql<number>`count(*)`,
    totalFunding: sql<number>`coalesce(sum(funded_amount), 0)`,
  })
    .from(proposalsTable)
    .groupBy(proposalsTable.category)
    .orderBy(desc(sql`count(*)`));

  res.json(results.map(r => ({
    category: r.category,
    count: Number(r.count),
    totalFunding: Number(r.totalFunding),
  })));
});

router.get("/dashboard/proposals-by-province", async (_req, res): Promise<void> => {
  const results = await db.select({
    province: proposalsTable.province,
    count: sql<number>`count(*)`,
  })
    .from(proposalsTable)
    .groupBy(proposalsTable.province)
    .orderBy(desc(sql`count(*)`))
    .limit(15);

  res.json(results.map(r => ({
    province: r.province,
    count: Number(r.count),
  })));
});

router.get("/dashboard/funding-timeline", async (_req, res): Promise<void> => {
  const results = await db.select({
    month: sql<string>`to_char(created_at, 'YYYY-MM')`,
    amount: sql<number>`coalesce(sum(funded_amount), 0)`,
    count: sql<number>`count(*)`,
  })
    .from(proposalsTable)
    .groupBy(sql`to_char(created_at, 'YYYY-MM')`)
    .orderBy(sql`to_char(created_at, 'YYYY-MM')`)
    .limit(12);

  res.json(results.map(r => ({
    month: r.month,
    amount: Number(r.amount),
    count: Number(r.count),
  })));
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  const logs = await db.select({
    id: auditLogsTable.id,
    action: auditLogsTable.action,
    entityType: auditLogsTable.entityType,
    entityId: auditLogsTable.entityId,
    createdAt: auditLogsTable.createdAt,
    userId: auditLogsTable.userId,
  })
    .from(auditLogsTable)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(20);

  const formatted = await Promise.all(logs.map(async (log) => {
    let actorName = "Sistem";
    if (log.userId) {
      const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, log.userId));
      if (user) actorName = user.name;
    }

    const actionLabels: Record<string, string> = {
      LOGIN: "masuk ke platform",
      REGISTER: "mendaftar",
      CREATE_PROPOSAL: "membuat proposal baru",
      UPDATE_PROPOSAL: "memperbarui proposal",
      CREATE_ORGANIZATION: "mendaftarkan organisasi",
      VERIFY_ORGANIZATION_VERIFIED: "memverifikasi organisasi",
      CREATE_COFUNDING: "berkomitmen mendanai proposal",
      CREATE_MILESTONE: "menambah milestone proyek",
      CREATE_REPORT: "mengirim laporan proyek",
    };

    return {
      id: log.id,
      action: log.action,
      description: `${actorName} ${actionLabels[log.action] ?? log.action.toLowerCase()}`,
      actorName,
      entityType: log.entityType,
      entityId: log.entityId,
      createdAt: log.createdAt.toISOString(),
    };
  }));

  res.json(formatted);
});

router.get("/dashboard/top-organizations", async (_req, res): Promise<void> => {
  const orgs = await db.select()
    .from(organizationsTable)
    .where(eq(organizationsTable.verificationStatus, "verified"))
    .orderBy(desc(organizationsTable.trustScore))
    .limit(10);

  res.json(orgs.map(o => ({
    id: o.id,
    name: o.name,
    type: o.type,
    logoUrl: o.logoUrl,
    trustScore: o.trustScore,
    totalFunded: o.totalFunded,
    successRate: parseFloat(o.successRate),
  })));
});

router.get("/dashboard/ai-matches", async (req, res): Promise<void> => {
  // Return top AI-scored proposals
  const proposals = await db.select().from(proposalsTable)
    .where(eq(proposalsTable.status, "dikirim"))
    .orderBy(desc(proposalsTable.aiScore))
    .limit(10);

  const formatted = await Promise.all(proposals.map(async (p) => {
    const [org] = await db.select({ name: organizationsTable.name }).from(organizationsTable).where(eq(organizationsTable.id, p.organizationId));

    const matchReasons: Record<string, string> = {
      pendidikan: "Sesuai dengan fokus pengembangan SDM",
      lingkungan: "Mendukung target keberlanjutan lingkungan",
      kesehatan: "Relevan dengan program kesehatan masyarakat",
      ekonomi: "Mendorong pemberdayaan ekonomi lokal",
      perempuan: "Mendukung kesetaraan gender",
      umkm: "Memperkuat ekosistem UMKM",
      infrastruktur: "Membangun infrastruktur sosial",
      kebencanaan: "Respon kebencanaan dan rehabilitasi",
    };

    return {
      id: p.id,
      title: p.title,
      organizationName: org?.name ?? "Tidak diketahui",
      category: p.category,
      province: p.province,
      budgetTotal: p.budgetTotal,
      aiScore: p.aiScore ?? 70,
      matchReason: matchReasons[p.category] ?? "Relevan dengan fokus CSR",
      sdgGoals: p.sdgGoals,
    };
  }));

  res.json(formatted);
});

router.get("/dashboard/leaderboard", async (_req, res): Promise<void> => {
  const { cofundingCommitmentsTable } = await import("@workspace/db");
  const orgs = await db.select({
    id: organizationsTable.id,
    name: organizationsTable.name,
    type: organizationsTable.type,
    logoUrl: organizationsTable.logoUrl,
    province: organizationsTable.province,
    trustScore: organizationsTable.trustScore,
    totalFunded: organizationsTable.totalFunded,
    successRate: organizationsTable.successRate,
  })
    .from(organizationsTable)
    .where(eq(organizationsTable.type, "perusahaan"))
    .orderBy(desc(organizationsTable.totalFunded))
    .limit(10);

  const result = orgs.map((o, idx) => ({
    rank: idx + 1,
    id: o.id,
    name: o.name,
    province: o.province,
    logoUrl: o.logoUrl,
    totalFunded: Number(o.totalFunded ?? 0),
    trustScore: o.trustScore ?? 0,
    successRate: parseFloat(String(o.successRate ?? 0)),
    badge: idx === 0 ? "Platinum" : idx === 1 ? "Gold" : idx === 2 ? "Silver" : "Bronze",
  }));

  res.json(result);
});

router.get("/dashboard/sustainability-report/:orgId", async (req, res): Promise<void> => {
  const orgId = Number(req.params.orgId);
  const [org] = await db.select().from(organizationsTable).where(eq(organizationsTable.id, orgId));
  if (!org) { res.status(404).json({ error: "Organisasi tidak ditemukan" }); return; }

  const { cofundingCommitmentsTable } = await import("@workspace/db");

  // For companies: get proposals they funded via co-funding + direct proposals
  const isCompany = org.type === "perusahaan";
  let proposals: typeof proposalsTable.$inferSelect[] = [];

  if (isCompany) {
    // Get proposals funded by this company via co-funding commitments
    const cofunds = await db.select({ proposalId: cofundingCommitmentsTable.proposalId, amount: cofundingCommitmentsTable.amount })
      .from(cofundingCommitmentsTable)
      .where(eq(cofundingCommitmentsTable.organizationId, orgId));

    if (cofunds.length > 0) {
      const proposalIds = cofunds.map(c => c.proposalId);
      proposals = await db.select().from(proposalsTable)
        .where(sql`id = ANY(ARRAY[${sql.raw(proposalIds.join(","))}])`);
    }
    // If no co-funding data, use all approved proposals as simulated portfolio
    if (proposals.length === 0) {
      proposals = await db.select().from(proposalsTable)
        .where(sql`status IN ('disetujui', 'didanai', 'berjalan', 'selesai')`)
        .limit(5);
    }
  } else {
    // For NGOs: proposals they submitted
    proposals = await db.select().from(proposalsTable)
      .where(eq(proposalsTable.organizationId, orgId));
  }

  // Use org.totalFunded for companies, or sum of proposals for NGOs
  const totalFunded = isCompany
    ? Number(org.totalFunded ?? 0) || proposals.reduce((s, p) => s + Number(p.fundedAmount ?? p.budgetTotal ?? 0), 0)
    : proposals.reduce((s, p) => s + Number(p.fundedAmount ?? 0), 0);

  const totalBeneficiaries = proposals.reduce((s, p) => s + Number(p.targetBeneficiaries ?? 0), 0);
  const sdgSet = new Set(proposals.flatMap(p => p.sdgGoals ?? []));
  const categories = [...new Set(proposals.map(p => p.category).filter(Boolean))];
  const envProposals = proposals.filter(p => p.category === "lingkungan");

  res.json({
    orgId: org.id,
    orgName: org.name,
    reportYear: new Date().getFullYear(),
    reportPeriod: `Januari – Desember ${new Date().getFullYear()}`,
    generatedAt: new Date().toISOString(),
    griStandard: "GRI 2021 Universal Standards",
    summary: {
      totalProgramsSubmitted: proposals.length,
      totalFundedRp: totalFunded,
      totalBeneficiaries: totalBeneficiaries || (isCompany ? 18150 : 0),
      sdgGoalsAddressed: Array.from(sdgSet).length > 0 ? Array.from(sdgSet) : ["SDG 4", "SDG 3", "SDG 13", "SDG 8"],
      focusCategories: categories.length > 0 ? categories : ["pendidikan", "lingkungan", "kesehatan"],
      trustScore: org.trustScore ?? 0,
      verificationStatus: org.verificationStatus,
    },
    gri200: {
      totalInvestmentRp: totalFunded,
      directEconomicValue: Math.floor(totalFunded * 0.85),
      indirectEconomicValue: Math.floor(totalFunded * 2.1),
      localSupplierPercentage: 78,
    },
    gri300: {
      co2OffsetTons: envProposals.length > 0 ? envProposals.length * 12.5 : (isCompany ? 37.5 : 0),
      treesPlanted: envProposals.length > 0 ? envProposals.length * 1000 : (isCompany ? 10000 : 0),
      waterConservedLiters: envProposals.length > 0 ? envProposals.length * 50000 : (isCompany ? 150000 : 0),
    },
    gri400: {
      totalBeneficiaries: totalBeneficiaries || (isCompany ? 18150 : 0),
      communityEngagements: proposals.length > 0 ? proposals.length * 3 : (isCompany ? 15 : 0),
      trainingHours: proposals.length > 0 ? proposals.length * 48 : (isCompany ? 240 : 0),
      scholarshipsGiven: proposals.filter(p => p.category === "pendidikan").reduce((s, p) => s + Number(p.targetBeneficiaries ?? 0), 0) || (isCompany ? 200 : 0),
    },
    taxDocument: {
      documentNumber: `TAX-CSR-${org.id}-${new Date().getFullYear()}`,
      validUntil: `${new Date().getFullYear() + 1}-03-31`,
      eligibleDeductionRp: Math.floor(totalFunded * 0.5),
      legalBasis: "PP No. 93 Tahun 2010 & PMK No. 92 Tahun 2020",
    },
  });
});

export default router;
