import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildRedirect(req: NextRequest, status: "success" | "invalid" | "error", email?: string) {
  const url = new URL("/verify-email", req.url);
  url.searchParams.set("status", status);
  if (email) {
    url.searchParams.set("email", email);
  }
  return NextResponse.redirect(url);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = typeof formData.get("email") === "string" ? String(formData.get("email")).trim().toLowerCase() : "";
    const code = typeof formData.get("code") === "string" ? String(formData.get("code")).trim() : "";

    if (!email || !code) {
      return buildRedirect(req, "invalid", email);
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
      },
      orderBy: {
        expires: "desc",
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: email,
        },
      });

      return buildRedirect(req, "invalid", email);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (!user) {
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: email,
        },
      });

      return buildRedirect(req, "invalid", email);
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
          emailVerifyToken: null,
        },
      });
    }

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    return buildRedirect(req, "success", email);
  } catch (error) {
    console.error("[Verify OTP Web]", error);
    return buildRedirect(req, "error");
  }
}
