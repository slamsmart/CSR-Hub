import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

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
    // The token-based verification is legacy (link-based).
    // For the OTP flow, the verify-otp routes are used instead.
    // This route handles the old link-based flow by looking up by token.
    // Since Convex doesn't have emailVerifyToken field, we treat the token
    // as an OTP code and verify via the verifyEmail mutation if an email is provided.
    const email = req.nextUrl.searchParams.get("email")?.trim();

    if (email) {
      try {
        await convexClient.mutation(api.auth.verifyEmail, { email, code: token });
        return NextResponse.redirect(buildRedirectUrl(req, "success"));
      } catch {
        return NextResponse.redirect(buildRedirectUrl(req, "invalid"));
      }
    }

    // Without email, we can't look up by token alone in the new schema
    return NextResponse.redirect(buildRedirectUrl(req, "invalid"));
  } catch (error) {
    console.error("[Verify Email]", error);
    return NextResponse.redirect(buildRedirectUrl(req, "error"));
  }
}
