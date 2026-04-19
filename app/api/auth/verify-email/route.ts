import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildRedirectUrl(status: "success" | "invalid" | "error") {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return `${baseUrl}/verify-email?status=${status}`;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(buildRedirectUrl("invalid"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { emailVerifyToken: token },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.redirect(buildRedirectUrl("invalid"));
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

    return NextResponse.redirect(buildRedirectUrl("success"));
  } catch (error) {
    console.error("[Verify Email]", error);
    return NextResponse.redirect(buildRedirectUrl("error"));
  }
}
