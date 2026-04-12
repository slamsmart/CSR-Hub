import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Data tidak valid", 400, parsed.error.flatten());

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: { id: true, name: true, email: true, image: true, phone: true },
    });

    return successResponse(updated);
  } catch (error) {
    console.error("[PATCH /api/user/profile]", error);
    return errorResponse("Gagal memperbarui profil", 500);
  }
}
