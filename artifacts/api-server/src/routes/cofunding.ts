import { Router, type IRouter } from "express";
import { db, cofundingCommitmentsTable, organizationsTable, proposalsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  CreateCofundingBody,
  UpdateCofundingBody,
  ListCofundingQueryParams,
} from "@workspace/api-zod";
import { authenticate } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router: IRouter = Router();

async function formatCofunding(c: typeof cofundingCommitmentsTable.$inferSelect) {
  const [org] = await db.select({ name: organizationsTable.name }).from(organizationsTable).where(eq(organizationsTable.id, c.organizationId));
  return {
    id: c.id,
    proposalId: c.proposalId,
    organizationId: c.organizationId,
    organizationName: org?.name ?? "Tidak diketahui",
    amount: c.amount,
    percentageShare: parseFloat(c.percentageShare),
    status: c.status,
    notes: c.notes,
    committedAt: c.committedAt.toISOString(),
    confirmedAt: c.confirmedAt?.toISOString() ?? null,
  };
}

router.get("/cofunding", async (req, res): Promise<void> => {
  const qp = ListCofundingQueryParams.safeParse(req.query);

  const conditions = [];
  if (qp.success && qp.data.proposalId) conditions.push(eq(cofundingCommitmentsTable.proposalId, qp.data.proposalId));
  if (qp.success && qp.data.organizationId) conditions.push(eq(cofundingCommitmentsTable.organizationId, qp.data.organizationId));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const commitments = await db.select().from(cofundingCommitmentsTable).where(whereClause).orderBy(cofundingCommitmentsTable.committedAt);

  const formatted = await Promise.all(commitments.map(formatCofunding));
  res.json(formatted);
});

router.post("/cofunding", authenticate, async (req, res): Promise<void> => {
  const parsed = CreateCofundingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = (req as any).user;
  let orgId = user.organizationId;

  if (!orgId) {
    res.status(400).json({ error: "Anda harus memiliki organisasi untuk memberikan pendanaan" });
    return;
  }

  // Get proposal budget to calculate percentage
  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, parsed.data.proposalId));
  const percentage = proposal ? (parsed.data.amount / proposal.budgetTotal * 100).toFixed(2) : "0";

  const [commitment] = await db.insert(cofundingCommitmentsTable).values({
    proposalId: parsed.data.proposalId,
    organizationId: orgId,
    amount: parsed.data.amount,
    percentageShare: percentage,
    notes: parsed.data.notes ?? null,
    status: "committed",
  }).returning();

  // Update funded amount on proposal
  if (proposal) {
    await db.update(proposalsTable).set({
      fundedAmount: proposal.fundedAmount + parsed.data.amount,
    }).where(eq(proposalsTable.id, parsed.data.proposalId));
  }

  await logAudit({ userId: user.id, action: "CREATE_COFUNDING", entityType: "cofunding", entityId: commitment.id, ipAddress: req.ip });

  const formatted = await formatCofunding(commitment);
  res.status(201).json(formatted);
});

router.patch("/cofunding/:id", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateCofundingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status != null) updateData.status = parsed.data.status;
  if (parsed.data.amount != null) updateData.amount = parsed.data.amount;
  if (parsed.data.notes != null) updateData.notes = parsed.data.notes;
  if (parsed.data.status === "confirmed") updateData.confirmedAt = new Date();

  const [commitment] = await db.update(cofundingCommitmentsTable).set(updateData).where(eq(cofundingCommitmentsTable.id, id)).returning();
  if (!commitment) {
    res.status(404).json({ error: "Komitmen tidak ditemukan" });
    return;
  }

  const formatted = await formatCofunding(commitment);
  res.json(formatted);
});

export default router;
