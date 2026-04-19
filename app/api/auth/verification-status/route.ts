import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    return NextResponse.json({
      exists: Boolean(user),
      emailVerified: Boolean(user?.emailVerified),
    });
  } catch (error) {
    console.error("[Verification Status]", error);
    return NextResponse.json({ error: "Failed to check verification status" }, { status: 500 });
  }
}
