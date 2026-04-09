import { Router, type IRouter } from "express";
import { db, projectsTable, projectMilestonesTable, projectReportsTable, proposalsTable, organizationsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";
import {
  CreateProjectMilestoneBody,
  CreateProjectReportBody,
  ListProjectsQueryParams,
} from "@workspace/api-zod";
import { authenticate } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router: IRouter = Router();

async function formatProject(project: typeof projectsTable.$inferSelect) {
  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, project.proposalId));
  const [org] = proposal
    ? await db.select({ name: organizationsTable.name }).from(organizationsTable).where(eq(organizationsTable.id, proposal.organizationId))
    : [null];

  return {
    id: project.id,
    proposalId: project.proposalId,
    title: proposal?.title ?? "Proyek",
    status: project.status,
    organizationId: proposal?.organizationId ?? 0,
    organizationName: org?.name ?? "Tidak diketahui",
    budgetTotal: proposal?.budgetTotal ?? 0,
    budgetUsed: project.budgetUsed,
    progressPercent: project.progressPercent,
    startDate: proposal?.startDate ?? null,
    endDate: proposal?.endDate ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

router.get("/projects", async (req, res): Promise<void> => {
  const qp = ListProjectsQueryParams.safeParse(req.query);
  const page = qp.success && qp.data.page ? qp.data.page : 1;
  const limit = qp.success && qp.data.limit ? qp.data.limit : 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (qp.success && qp.data.status) conditions.push(eq(projectsTable.status, qp.data.status));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const projects = await db.select().from(projectsTable)
    .where(whereClause)
    .limit(limit).offset(offset)
    .orderBy(projectsTable.createdAt);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(projectsTable).where(whereClause);

  const formatted = await Promise.all(projects.map(formatProject));

  res.json({
    data: formatted,
    total: Number(count),
    page,
    limit,
  });
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!project) {
    res.status(404).json({ error: "Proyek tidak ditemukan" });
    return;
  }

  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, project.proposalId));
  const [org] = proposal
    ? await db.select({ name: organizationsTable.name }).from(organizationsTable).where(eq(organizationsTable.id, proposal.organizationId))
    : [null];

  const milestones = await db.select().from(projectMilestonesTable).where(eq(projectMilestonesTable.projectId, id)).orderBy(projectMilestonesTable.createdAt);
  const reports = await db.select().from(projectReportsTable).where(eq(projectReportsTable.projectId, id)).orderBy(projectReportsTable.createdAt);

  res.json({
    id: project.id,
    proposalId: project.proposalId,
    title: proposal?.title ?? "Proyek",
    status: project.status,
    organizationId: proposal?.organizationId ?? 0,
    organizationName: org?.name ?? "Tidak diketahui",
    budgetTotal: proposal?.budgetTotal ?? 0,
    budgetUsed: project.budgetUsed,
    progressPercent: project.progressPercent,
    startDate: proposal?.startDate ?? null,
    endDate: proposal?.endDate ?? null,
    milestones: milestones.map(m => ({
      id: m.id,
      projectId: m.projectId,
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      completedAt: m.completedAt?.toISOString() ?? null,
      status: m.status,
      progressPercent: m.progressPercent,
    })),
    reports: reports.map(r => ({
      id: r.id,
      projectId: r.projectId,
      title: r.title,
      content: r.content,
      reportType: r.reportType,
      budgetUsed: r.budgetUsed,
      beneficiariesCount: r.beneficiariesCount,
      createdAt: r.createdAt.toISOString(),
    })),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  });
});

router.get("/projects/:id/milestones", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const milestones = await db.select().from(projectMilestonesTable)
    .where(eq(projectMilestonesTable.projectId, id))
    .orderBy(projectMilestonesTable.createdAt);

  res.json(milestones.map(m => ({
    id: m.id,
    projectId: m.projectId,
    title: m.title,
    description: m.description,
    dueDate: m.dueDate,
    completedAt: m.completedAt?.toISOString() ?? null,
    status: m.status,
    progressPercent: m.progressPercent,
  })));
});

router.post("/projects/:id/milestones", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = CreateProjectMilestoneBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [milestone] = await db.insert(projectMilestonesTable).values({
    projectId: id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    dueDate: parsed.data.dueDate ?? null,
    status: "belum",
    progressPercent: 0,
  }).returning();

  const user = (req as any).user;
  await logAudit({ userId: user.id, action: "CREATE_MILESTONE", entityType: "project", entityId: id, ipAddress: req.ip });

  res.status(201).json({
    id: milestone.id,
    projectId: milestone.projectId,
    title: milestone.title,
    description: milestone.description,
    dueDate: milestone.dueDate,
    completedAt: null,
    status: milestone.status,
    progressPercent: milestone.progressPercent,
  });
});

router.get("/projects/:id/reports", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const reports = await db.select().from(projectReportsTable)
    .where(eq(projectReportsTable.projectId, id))
    .orderBy(projectReportsTable.createdAt);

  res.json(reports.map(r => ({
    id: r.id,
    projectId: r.projectId,
    title: r.title,
    content: r.content,
    reportType: r.reportType,
    budgetUsed: r.budgetUsed,
    beneficiariesCount: r.beneficiariesCount,
    createdAt: r.createdAt.toISOString(),
  })));
});

router.post("/projects/:id/reports", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = CreateProjectReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [report] = await db.insert(projectReportsTable).values({
    projectId: id,
    title: parsed.data.title,
    content: parsed.data.content,
    reportType: parsed.data.reportType,
    budgetUsed: parsed.data.budgetUsed ?? null,
    beneficiariesCount: parsed.data.beneficiariesCount ?? null,
  }).returning();

  const user = (req as any).user;
  await logAudit({ userId: user.id, action: "CREATE_REPORT", entityType: "project", entityId: id, ipAddress: req.ip });

  res.status(201).json({
    id: report.id,
    projectId: report.projectId,
    title: report.title,
    content: report.content,
    reportType: report.reportType,
    budgetUsed: report.budgetUsed,
    beneficiariesCount: report.beneficiariesCount,
    createdAt: report.createdAt.toISOString(),
  });
});

export default router;
