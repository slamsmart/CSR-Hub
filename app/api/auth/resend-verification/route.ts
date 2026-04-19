import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/security";
import { sendVerificationOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    const verifyCode = generateOTP(6);

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.email,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verifyCode,
        expires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const delivery = await sendVerificationOtpEmail(
      user.email,
      user.name || user.email.split("@")[0],
      verifyCode
    );

    if (delivery.skipped) {
      return NextResponse.json(
        {
          error:
            "OTP email delivery is not configured on the server. Configure EmailJS or SMTP before requesting a new code.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("[Resend Verification]", error);
    return NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 });
  }
}
