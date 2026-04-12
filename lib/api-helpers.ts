import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { checkRateLimit } from "@/lib/security";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    role: UserRole;
    organizationId?: string;
  };
}

export async function getAuthUser(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export function requireAuth(roles?: UserRole[]) {
  return async (req: NextRequest) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }
    if (roles && !roles.includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    return null; // null means authorized
  };
}

export function apiRateLimit(key: string, max = 60, windowMs = 60_000) {
  return (req: NextRequest) => {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const { allowed, remaining, resetAt } = checkRateLimit(`${key}:${ip}`, max, windowMs);
    if (!allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi nanti." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
    return null;
  };
}

export function successResponse<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json({ success: true, data, ...meta }, { status });
}

export function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function getPaginationParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
