import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    try {
      await convexClient.mutation(api.auth.verifyEmail, { email, code });
      return NextResponse.json({ success: true });
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("INVALID_CODE") || msg.includes("USER_NOT_FOUND")) {
        return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
      }
      if (msg.includes("CODE_EXPIRED")) {
        return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error("[Verify OTP]", error);
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}
