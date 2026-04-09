import { createHash, createHmac, randomBytes } from "crypto";
import { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "csr-hub-secret-key-change-in-production";

export function hashPassword(password: string): string {
  const salt = "csr-hub-salt";
  return createHmac("sha256", SECRET).update(password + salt).digest("hex");
}

export function createToken(userId: number): string {
  const payload = JSON.stringify({ userId, iat: Date.now() });
  const encoded = Buffer.from(payload).toString("base64");
  const signature = createHmac("sha256", SECRET).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expected = createHmac("sha256", SECRET).update(encoded).digest("hex");
    if (expected !== signature) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64").toString());
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Tidak terautentikasi" });
    return;
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Token tidak valid" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId));
  if (!user || !user.isActive) {
    res.status(401).json({ error: "Pengguna tidak ditemukan atau tidak aktif" });
    return;
  }
  (req as any).user = user;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload) {
      (req as any).userId = payload.userId;
    }
  }
  next();
}
