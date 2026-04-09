import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ListNotificationsQueryParams } from "@workspace/api-zod";
import { authenticate } from "../lib/auth";

const router: IRouter = Router();

function formatNotification(n: typeof notificationsTable.$inferSelect) {
  return {
    id: n.id,
    userId: n.userId,
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.isRead,
    linkUrl: n.linkUrl,
    createdAt: n.createdAt.toISOString(),
  };
}

router.get("/notifications", authenticate, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const qp = ListNotificationsQueryParams.safeParse(req.query);

  const conditions = [eq(notificationsTable.userId, user.id)];
  if (qp.success && qp.data.unread === true) {
    conditions.push(eq(notificationsTable.isRead, false));
  }

  const notifications = await db.select().from(notificationsTable)
    .where(and(...conditions))
    .orderBy(notificationsTable.createdAt);

  res.json(notifications.map(formatNotification));
});

router.patch("/notifications/:id/read", authenticate, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [notification] = await db.update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.id, id))
    .returning();

  if (!notification) {
    res.status(404).json({ error: "Notifikasi tidak ditemukan" });
    return;
  }

  res.json(formatNotification(notification));
});

router.post("/notifications/read-all", authenticate, async (req, res): Promise<void> => {
  const user = (req as any).user;
  await db.update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.userId, user.id));

  res.json({ success: true, message: "Semua notifikasi ditandai telah dibaca" });
});

export default router;
