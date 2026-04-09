import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody, RegisterBody } from "@workspace/api-zod";
import { hashPassword, createToken, authenticate } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Email atau password salah" });
    return;
  }
  if (!user.isActive) {
    res.status(401).json({ error: "Akun tidak aktif" });
    return;
  }

  const token = createToken(user.id);
  await logAudit({ userId: user.id, action: "LOGIN", entityType: "user", entityId: user.id, ipAddress: req.ip });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      organizationId: user.organizationId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, role } = parsed.data;
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "Email sudah terdaftar" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    name,
    email,
    passwordHash: hashPassword(password),
    role,
    isActive: true,
    emailVerified: false,
  }).returning();

  const token = createToken(user.id);
  await logAudit({ userId: user.id, action: "REGISTER", entityType: "user", entityId: user.id, ipAddress: req.ip });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      organizationId: user.organizationId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

router.post("/auth/logout", authenticate, async (req, res): Promise<void> => {
  const user = (req as any).user;
  await logAudit({ userId: user.id, action: "LOGOUT", entityType: "user", entityId: user.id, ipAddress: req.ip });
  res.json({ success: true, message: "Berhasil keluar" });
});

router.get("/auth/me", authenticate, async (req, res): Promise<void> => {
  const user = (req as any).user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    organizationId: user.organizationId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

export default router;
