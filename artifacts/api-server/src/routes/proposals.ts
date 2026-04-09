import { Router, type IRouter } from "express";
import { db, proposalsTable, proposalBudgetItemsTable, proposalStatusHistoryTable, organizationsTable, usersTable } from "@workspace/db";
import { eq, sql, ilike, and } from "drizzle-orm";
import {
  CreateProposalBody,
  UpdateProposalBody,
  UpdateProposalStatusBody,
  ListProposalsQueryParams,
} from "@workspace/api-zod";
import { authenticate } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router: IRouter = Router();

async function formatProposal(proposal: typeof proposalsTable.$inferSelect) {
  const [org] = await db.select({ name: organizationsTable.name })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, proposal.organizationId));

  return {
    id: proposal.id,
    title: proposal.title,
    summary: proposal.summary,
    category: proposal.category,
    status: proposal.status,
    organizationId: proposal.organizationId,
    organizationName: org?.name ?? "Tidak diketahui",
    province: proposal.province,
    city: proposal.city,
    targetBeneficiaries: proposal.targetBeneficiaries,
    budgetTotal: proposal.budgetTotal,
    fundedAmount: proposal.fundedAmount,
    startDate: proposal.startDate,
    endDate: proposal.endDate,
    sdgGoals: proposal.sdgGoals,
    tags: proposal.tags,
    aiScore: proposal.aiScore,
    createdAt: proposal.createdAt.toISOString(),
    updatedAt: proposal.updatedAt.toISOString(),
  };
}

router.get("/proposals", async (req, res): Promise<void> => {
  const qp = ListProposalsQueryParams.safeParse(req.query);
  const page = qp.success && qp.data.page ? qp.data.page : 1;
  const limit = qp.success && qp.data.limit ? qp.data.limit : 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (qp.success && qp.data.status) conditions.push(eq(proposalsTable.status, qp.data.status));
  if (qp.success && qp.data.category) conditions.push(eq(proposalsTable.category, qp.data.category));
  if (qp.success && qp.data.province) conditions.push(eq(proposalsTable.province, qp.data.province));
  if (qp.success && qp.data.organizationId) conditions.push(eq(proposalsTable.organizationId, qp.data.organizationId));
  if (qp.success && qp.data.search) conditions.push(ilike(proposalsTable.title, `%${qp.data.search}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const proposals = await db.select().from(proposalsTable)
    .where(whereClause)
    .limit(limit).offset(offset)
    .orderBy(proposalsTable.createdAt);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(proposalsTable)
    .where(whereClause);

  const formatted = await Promise.all(proposals.map(formatProposal));

  res.json({
    data: formatted,
    total: Number(count),
    page,
    limit,
  });
});

router.post("/proposals", authenticate, async (req, res): Promise<void> => {
  const parsed = CreateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = (req as any).user;

  // Get organization for user
  let orgId = user.organizationId;
  if (!orgId) {
    // Create minimal organization if user doesn't have one
    const [org] = await db.insert(organizationsTable).values({
      name: user.name,
      type: user.role === "perusahaan" ? "perusahaan" : "ngo",
      focusAreas: [],
      sdgGoals: [],
    }).returning();
    orgId = org.id;
    await db.update(usersTable).set({ organizationId: org.id }).where(eq(usersTable.id, user.id));
  }

  const [proposal] = await db.insert(proposalsTable).values({
    ...parsed.data,
    organizationId: orgId,
    sdgGoals: parsed.data.sdgGoals ?? [],
    tags: parsed.data.tags ?? [],
    status: "draft",
  }).returning();

  // Record status history
  await db.insert(proposalStatusHistoryTable).values({
    proposalId: proposal.id,
    status: "draft",
    changedBy: user.id,
  });

  // Update org proposal count
  await db.execute(sql`UPDATE organizations SET total_proposals = total_proposals + 1 WHERE id = ${orgId}`);

  await logAudit({ userId: user.id, action: "CREATE_PROPOSAL", entityType: "proposal", entityId: proposal.id, ipAddress: req.ip });

  const formatted = await formatProposal(proposal);
  res.status(201).json(formatted);
});

router.get("/proposals/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, id));
  if (!proposal) {
    res.status(404).json({ error: "Proposal tidak ditemukan" });
    return;
  }

  const [org] = await db.select().from(organizationsTable).where(eq(organizationsTable.id, proposal.organizationId));
  const budgetItems = await db.select().from(proposalBudgetItemsTable).where(eq(proposalBudgetItemsTable.proposalId, id));
  const statusHistory = await db.select().from(proposalStatusHistoryTable).where(eq(proposalStatusHistoryTable.proposalId, id)).orderBy(proposalStatusHistoryTable.createdAt);

  const historyFormatted = await Promise.all(statusHistory.map(async (h) => {
    const [actor] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, h.changedBy));
    return {
      id: h.id,
      status: h.status,
      notes: h.notes,
      changedBy: actor?.name ?? "Sistem",
      createdAt: h.createdAt.toISOString(),
    };
  }));

  res.json({
    id: proposal.id,
    title: proposal.title,
    summary: proposal.summary,
    description: proposal.description,
    category: proposal.category,
    status: proposal.status,
    organizationId: proposal.organizationId,
    organizationName: org?.name ?? "Tidak diketahui",
    province: proposal.province,
    city: proposal.city,
    targetBeneficiaries: proposal.targetBeneficiaries,
    budgetTotal: proposal.budgetTotal,
    fundedAmount: proposal.fundedAmount,
    budgetBreakdown: budgetItems.map(b => ({
      id: b.id,
      description: b.description,
      amount: b.amount,
      category: b.category,
    })),
    startDate: proposal.startDate,
    endDate: proposal.endDate,
    sdgGoals: proposal.sdgGoals,
    tags: proposal.tags,
    aiScore: proposal.aiScore,
    aiSummary: proposal.aiSummary,
    statusHistory: historyFormatted,
    cofunding: [],
    createdAt: proposal.createdAt.toISOString(),
    updatedAt: proposal.updatedAt.toISOString(),
  });
});

router.patch("/proposals/:id", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title != null) updateData.title = parsed.data.title;
  if (parsed.data.summary != null) updateData.summary = parsed.data.summary;
  if (parsed.data.description != null) updateData.description = parsed.data.description;
  if (parsed.data.category != null) updateData.category = parsed.data.category;
  if (parsed.data.province != null) updateData.province = parsed.data.province;
  if (parsed.data.city != null) updateData.city = parsed.data.city;
  if (parsed.data.targetBeneficiaries != null) updateData.targetBeneficiaries = parsed.data.targetBeneficiaries;
  if (parsed.data.budgetTotal != null) updateData.budgetTotal = parsed.data.budgetTotal;
  if (parsed.data.startDate != null) updateData.startDate = parsed.data.startDate;
  if (parsed.data.endDate != null) updateData.endDate = parsed.data.endDate;
  if (parsed.data.sdgGoals != null) updateData.sdgGoals = parsed.data.sdgGoals;
  if (parsed.data.tags != null) updateData.tags = parsed.data.tags;

  const [proposal] = await db.update(proposalsTable).set(updateData).where(eq(proposalsTable.id, id)).returning();
  if (!proposal) {
    res.status(404).json({ error: "Proposal tidak ditemukan" });
    return;
  }

  const user = (req as any).user;
  await logAudit({ userId: user.id, action: "UPDATE_PROPOSAL", entityType: "proposal", entityId: id, ipAddress: req.ip });

  const formatted = await formatProposal(proposal);
  res.json(formatted);
});

router.patch("/proposals/:id/status", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateProposalStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = (req as any).user;
  const [proposal] = await db.update(proposalsTable)
    .set({ status: parsed.data.status })
    .where(eq(proposalsTable.id, id))
    .returning();

  if (!proposal) {
    res.status(404).json({ error: "Proposal tidak ditemukan" });
    return;
  }

  await db.insert(proposalStatusHistoryTable).values({
    proposalId: id,
    status: parsed.data.status,
    notes: parsed.data.notes ?? null,
    changedBy: user.id,
  });

  await logAudit({ userId: user.id, action: `PROPOSAL_STATUS_${parsed.data.status.toUpperCase()}`, entityType: "proposal", entityId: id, ipAddress: req.ip });

  const formatted = await formatProposal(proposal);
  res.json(formatted);
});

router.get("/proposals/:id/ai-score", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, id));
  if (!proposal) {
    res.status(404).json({ error: "Proposal tidak ditemukan" });
    return;
  }

  // AI scoring simulation
  const titleLength = proposal.title.length;
  const descLength = proposal.description.length;
  const hasBudget = proposal.budgetTotal > 0;
  const hasDates = !!(proposal.startDate && proposal.endDate);
  const hasSdg = proposal.sdgGoals.length > 0;
  const hasTags = proposal.tags.length > 0;

  const completeness = Math.min(100, Math.round(
    (titleLength > 10 ? 15 : 5) +
    (descLength > 100 ? 25 : descLength > 50 ? 15 : 5) +
    (hasBudget ? 20 : 0) +
    (hasDates ? 15 : 0) +
    (hasSdg ? 15 : 0) +
    (hasTags ? 10 : 0)
  ));

  const categoryRelevance: Record<string, number> = {
    pendidikan: 90, lingkungan: 88, kesehatan: 87, ekonomi: 85,
    perempuan: 83, umkm: 80, infrastruktur: 78, kebencanaan: 75,
  };
  const relevance = categoryRelevance[proposal.category] ?? 75;

  const impactScore = Math.min(100, Math.round(
    (proposal.targetBeneficiaries > 1000 ? 50 : proposal.targetBeneficiaries > 100 ? 30 : 15) +
    (proposal.sdgGoals.length * 8)
  ));

  const score = Math.round((completeness * 0.35 + relevance * 0.35 + impactScore * 0.30));

  const riskLevel = score >= 75 ? "rendah" : score >= 55 ? "sedang" : "tinggi";

  const recommendations: string[] = [];
  if (descLength < 200) recommendations.push("Perluas deskripsi program dengan lebih detail");
  if (!hasDates) recommendations.push("Tambahkan tanggal mulai dan akhir program");
  if (!hasSdg) recommendations.push("Hubungkan proposal dengan tujuan SDGs yang relevan");
  if (proposal.targetBeneficiaries < 50) recommendations.push("Pertimbangkan memperluas jangkauan penerima manfaat");
  if (!hasTags) recommendations.push("Tambahkan kata kunci agar lebih mudah ditemukan");
  if (recommendations.length === 0) recommendations.push("Proposal sudah cukup lengkap dan berkualitas baik");

  const suggestedTags = [
    proposal.category,
    proposal.province,
    ...proposal.sdgGoals.map(g => `SDG-${g}`),
  ].filter(Boolean);

  // Update proposal with AI score
  await db.update(proposalsTable).set({
    aiScore: score,
    aiSummary: `Proposal ini mendapat skor ${score}/100. ${riskLevel === "rendah" ? "Proposal layak untuk dipertimbangkan" : "Perlu perbaikan sebelum diajukan"}.`,
  }).where(eq(proposalsTable.id, id));

  res.json({
    score,
    completeness,
    relevance,
    impact: impactScore,
    riskLevel,
    summary: `Proposal "${proposal.title}" mendapat skor keseluruhan ${score}/100 dengan tingkat risiko ${riskLevel}.`,
    recommendations,
    tags: suggestedTags,
    sdgAlignment: proposal.sdgGoals,
  });
});

export default router;
