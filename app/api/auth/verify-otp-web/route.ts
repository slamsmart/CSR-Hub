import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

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

    try {
      await convexClient.mutation(api.auth.verifyEmail, { email, code });
      return buildRedirect(req, "success", email);
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("INVALID_CODE") || msg.includes("USER_NOT_FOUND") || msg.includes("CODE_EXPIRED")) {
        return buildRedirect(req, "invalid", email);
      }
      throw error;
    }
  } catch (error) {
    console.error("[Verify OTP Web]", error);
    return buildRedirect(req, "error");
  }
}
