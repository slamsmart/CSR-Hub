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

export default router;
