import { Router, type IRouter } from "express";
import { db, auditLogsTable, usersTable } from "@workspace/db";
import { eq, sql, desc, and } from "drizzle-orm";
import { ListAuditLogsQueryParams } from "@workspace/api-zod";
import { authenticate } from "../lib/auth";

const router: IRouter = Router();

router.get("/audit-logs", authenticate, async (req, res): Promise<void> => {
  const qp = ListAuditLogsQueryParams.safeParse(req.query);
  const page = qp.success && qp.data.page ? qp.data.page : 1;
  const limit = qp.success && qp.data.limit ? qp.data.limit : 50;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (qp.success && qp.data.userId) conditions.push(eq(auditLogsTable.userId, qp.data.userId));
  if (qp.success && qp.data.action) conditions.push(eq(auditLogsTable.action, qp.data.action));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const logs = await db.select().from(auditLogsTable)
    .where(whereClause)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(auditLogsTable).where(whereClause);

  const formatted = await Promise.all(logs.map(async (log) => {
    let userName: string | null = null;
    if (log.userId) {
      const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, log.userId));
      userName = user?.name ?? null;
    }

    return {
      id: log.id,
      userId: log.userId,
      userName,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      details: log.details,
      ipAddress: log.ipAddress,
      createdAt: log.createdAt.toISOString(),
    };
  }));

  res.json({
    data: formatted,
    total: Number(count),
    page,
    limit,
  });
});

export default router;
