import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return successResponse({ count: 0 });

    const count = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false },
    });

    return successResponse({ count });
  } catch (error) {
    return successResponse({ count: 0 });
  }
}
