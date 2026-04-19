import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
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

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: email,
        },
      });

      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: email,
        },
      });

      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: {
          email,
        },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Verify OTP]", error);
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}
