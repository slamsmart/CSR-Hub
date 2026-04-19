import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildRedirectUrl(req: NextRequest, status: "success" | "invalid" | "error") {
  const origin = req.nextUrl.origin.replace(/\/$/, "");
  return `${origin}/verify-email?status=${status}`;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(buildRedirectUrl(req, "invalid"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { emailVerifyToken: token },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.redirect(buildRedirectUrl(req, "invalid"));
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerifyToken: null,
        },
      });
    }

    return NextResponse.redirect(buildRedirectUrl(req, "success"));
  } catch (error) {
    console.error("[Verify Email]", error);
    return NextResponse.redirect(buildRedirectUrl(req, "error"));
  }
}
