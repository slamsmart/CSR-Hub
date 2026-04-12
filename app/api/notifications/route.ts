import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, getPaginationParams, buildPaginationMeta } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const { page, limit, skip } = getPaginationParams(req);
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";

    const where: Record<string, unknown> = { userId: session.user.id };
    if (unreadOnly) where.isRead = false;

    const [notifications, total, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
    ]);

    return successResponse(
      { notifications, unreadCount },
      buildPaginationMeta(total, page, limit)
    );
  } catch (error) {
    console.error("[GET /api/notifications]", error);
    return errorResponse("Gagal memuat notifikasi", 500);
  }
}
