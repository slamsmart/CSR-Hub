import { Router, type IRouter } from "express";
import { db, organizationsTable, usersTable } from "@workspace/db";
import { eq, sql, ilike, and } from "drizzle-orm";
import {
  CreateOrganizationBody,
  UpdateOrganizationBody,
  VerifyOrganizationBody,
  ListOrganizationsQueryParams,
} from "@workspace/api-zod";
import { authenticate } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router: IRouter = Router();

function formatOrg(org: typeof organizationsTable.$inferSelect) {
  return {
    id: org.id,
    name: org.name,
    type: org.type,
    orgType: org.type,
    description: org.description,
    logoUrl: org.logoUrl,
    website: org.website,
    province: org.province,
    city: org.city,
    address: org.address,
    phone: org.phone,
    email: org.email,
    npwp: org.npwp,
    nib: org.nib,
    skKemenkumham: org.skKemenkumham,
    legalEntityType: org.legalEntityType,
    foundingYear: org.foundingYear,
    directorName: org.directorName,
    contactPersonName: org.contactPersonName,
    contactPersonPhone: org.contactPersonPhone,
    bankName: org.bankName,
    bankAccountNumber: org.bankAccountNumber,
    bankAccountName: org.bankAccountName,
    legalStatus: org.legalStatus,
    verificationStatus: org.verificationStatus,
    trustScore: org.trustScore,
    verifiedAt: org.verifiedAt?.toISOString() ?? null,
    totalProposals: org.totalProposals,
    totalFunded: org.totalFunded,
    successRate: parseFloat(org.successRate),
    focusAreas: org.focusAreas,
    sdgGoals: org.sdgGoals,
    createdAt: org.createdAt.toISOString(),
    updatedAt: org.updatedAt.toISOString(),
  };
}

router.get("/organizations", async (req, res): Promise<void> => {
  const qp = ListOrganizationsQueryParams.safeParse(req.query);
  const page = qp.success && qp.data.page ? qp.data.page : 1;
  const limit = qp.success && qp.data.limit ? qp.data.limit : 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (qp.success && qp.data.type) conditions.push(eq(organizationsTable.type, qp.data.type));
  if (qp.success && qp.data.status) conditions.push(eq(organizationsTable.verificationStatus, qp.data.status));
  if (qp.success && qp.data.search) conditions.push(ilike(organizationsTable.name, `%${qp.data.search}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orgs = await db.select().from(organizationsTable)
    .where(whereClause)
    .limit(limit).offset(offset)
    .orderBy(organizationsTable.createdAt);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(organizationsTable)
    .where(whereClause);

  res.json({
    data: orgs.map(formatOrg),
    total: Number(count),
    page,
    limit,
  });
});

router.post("/organizations", authenticate, async (req, res): Promise<void> => {
  const parsed = CreateOrganizationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = (req as any).user;
  const [org] = await db.insert(organizationsTable).values({
    ...parsed.data,
    focusAreas: parsed.data.focusAreas ?? [],
    sdgGoals: parsed.data.sdgGoals ?? [],
  }).returning();

  // link user to organization
  await db.update(usersTable).set({ organizationId: org.id }).where(eq(usersTable.id, user.id));
  await logAudit({ userId: user.id, action: "CREATE_ORGANIZATION", entityType: "organization", entityId: org.id, ipAddress: req.ip });

  res.status(201).json(formatOrg(org));
});

router.get("/organizations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [org] = await db.select().from(organizationsTable).where(eq(organizationsTable.id, id));
  if (!org) {
    res.status(404).json({ error: "Organisasi tidak ditemukan" });
    return;
  }
  res.json(formatOrg(org));
});

router.patch("/organizations/:id", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateOrganizationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name != null) updateData.name = parsed.data.name;
  if (parsed.data.description != null) updateData.description = parsed.data.description;
  if (parsed.data.logoUrl != null) updateData.logoUrl = parsed.data.logoUrl;
  if (parsed.data.website != null) updateData.website = parsed.data.website;
  if (parsed.data.province != null) updateData.province = parsed.data.province;
  if (parsed.data.city != null) updateData.city = parsed.data.city;
  if (parsed.data.address != null) updateData.address = parsed.data.address;
  if (parsed.data.phone != null) updateData.phone = parsed.data.phone;
  if (parsed.data.email != null) updateData.email = parsed.data.email;
  if (parsed.data.focusAreas != null) updateData.focusAreas = parsed.data.focusAreas;
  if (parsed.data.sdgGoals != null) updateData.sdgGoals = parsed.data.sdgGoals;
  if ((parsed.data as any).npwp != null) updateData.npwp = (parsed.data as any).npwp;
  if ((parsed.data as any).nib != null) updateData.nib = (parsed.data as any).nib;
  if ((parsed.data as any).skKemenkumham != null) updateData.skKemenkumham = (parsed.data as any).skKemenkumham;
  if ((parsed.data as any).legalEntityType != null) updateData.legalEntityType = (parsed.data as any).legalEntityType;
  if ((parsed.data as any).foundingYear != null) updateData.foundingYear = (parsed.data as any).foundingYear;
  if ((parsed.data as any).directorName != null) updateData.directorName = (parsed.data as any).directorName;
  if ((parsed.data as any).contactPersonName != null) updateData.contactPersonName = (parsed.data as any).contactPersonName;
  if ((parsed.data as any).contactPersonPhone != null) updateData.contactPersonPhone = (parsed.data as any).contactPersonPhone;
  if ((parsed.data as any).bankName != null) updateData.bankName = (parsed.data as any).bankName;
  if ((parsed.data as any).bankAccountNumber != null) updateData.bankAccountNumber = (parsed.data as any).bankAccountNumber;
  if ((parsed.data as any).bankAccountName != null) updateData.bankAccountName = (parsed.data as any).bankAccountName;

  const [org] = await db.update(organizationsTable).set(updateData).where(eq(organizationsTable.id, id)).returning();
  if (!org) {
    res.status(404).json({ error: "Organisasi tidak ditemukan" });
    return;
  }

  const user = (req as any).user;
  await logAudit({ userId: user.id, action: "UPDATE_ORGANIZATION", entityType: "organization", entityId: id, ipAddress: req.ip });
  res.json(formatOrg(org));
});

router.post("/organizations/:id/verify", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = VerifyOrganizationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const newStatus = parsed.data.action === "approve" ? "verified" : "rejected";
  const updateData: Record<string, unknown> = {
    verificationStatus: newStatus,
  };
  if (newStatus === "verified") {
    updateData.verifiedAt = new Date();
    updateData.trustScore = 80;
  }

  const [org] = await db.update(organizationsTable).set(updateData).where(eq(organizationsTable.id, id)).returning();
  if (!org) {
    res.status(404).json({ error: "Organisasi tidak ditemukan" });
    return;
  }

  const user = (req as any).user;
  await logAudit({
    userId: user.id,
    action: `VERIFY_ORGANIZATION_${newStatus.toUpperCase()}`,
    entityType: "organization",
    entityId: id,
    details: parsed.data.notes ?? undefined,
    ipAddress: req.ip,
  });
  res.json(formatOrg(org));
});

export default router;
