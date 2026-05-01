import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await convexClient.query(api.auth.getUserByEmail, { email });

    return NextResponse.json({
      exists: Boolean(user),
      emailVerified: Boolean(user?.emailVerified),
    });
  } catch (error) {
    console.error("[Verification Status]", error);
    return NextResponse.json({ error: "Failed to check verification status" }, { status: 500 });
  }
}
