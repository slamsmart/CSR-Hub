import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { UpdateUserBody, ListUsersQueryParams, GetUserParams, UpdateUserParams } from "@workspace/api-zod";
import { authenticate } from "../lib/auth";

const router: IRouter = Router();

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    organizationId: user.organizationId,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

router.get("/users", authenticate, async (req, res): Promise<void> => {
  const qp = ListUsersQueryParams.safeParse(req.query);
  const page = qp.success && qp.data.page ? qp.data.page : 1;
  const limit = qp.success && qp.data.limit ? qp.data.limit : 20;
  const offset = (page - 1) * limit;

  const users = await db.select().from(usersTable).limit(limit).offset(offset);
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);

  res.json({
    data: users.map(formatUser),
    total: Number(count),
    page,
    limit,
  });
});

router.get("/users/:id", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) {
    res.status(404).json({ error: "Pengguna tidak ditemukan" });
    return;
  }
  res.json(formatUser(user));
});

router.patch("/users/:id", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name != null) updateData.name = parsed.data.name;
  if (parsed.data.avatarUrl != null) updateData.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.isActive != null) updateData.isActive = parsed.data.isActive;

  const [user] = await db.update(usersTable).set(updateData).where(eq(usersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "Pengguna tidak ditemukan" });
    return;
  }
  res.json(formatUser(user));
});

export default router;
