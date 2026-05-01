import { NextRequest, NextResponse } from "next/server";
import { generateOTP } from "@/lib/security";
import { sendVerificationOtpEmail } from "@/lib/email";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

function buildRedirect(
  req: NextRequest,
  status: "success" | "error" | "resent" | "invalid",
  email?: string
) {
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

    if (!email) {
      return buildRedirect(req, "invalid");
    }

    // Check user exists and not already verified
    const user = await convexClient.query(api.auth.getUserByEmail, { email });

    if (!user) {
      return buildRedirect(req, "invalid", email);
    }

    if (user.emailVerified) {
      return buildRedirect(req, "success", email);
    }

    const verifyCode = generateOTP(6);

    // Create verification token via Convex
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
      return buildRedirect(req, "error", email);
    }

    return buildRedirect(req, "resent", email);
  } catch (error) {
    console.error("[Resend Verification Web]", error);
    return buildRedirect(req, "error");
  }
}
