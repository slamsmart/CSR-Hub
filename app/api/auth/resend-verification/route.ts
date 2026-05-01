import { NextRequest, NextResponse } from "next/server";
import { generateOTP } from "@/lib/security";
import { sendVerificationOtpEmail } from "@/lib/email";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await convexClient.query(api.auth.getUserByEmail, { email });

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    const verifyCode = generateOTP(6);

    await convexClient.mutation(api.auth.createVerificationToken, {
      email,
      code: verifyCode,
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
