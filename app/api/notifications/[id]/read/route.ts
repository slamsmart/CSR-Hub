import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { isRead: true, readAt: new Date() },
    });

    return successResponse({ read: true });
  } catch (error) {
    return errorResponse("Gagal menandai notifikasi", 500);
  }
}
