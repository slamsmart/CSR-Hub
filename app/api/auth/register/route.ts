import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateOTP } from "@/lib/security";
import { sendVerificationOtpEmail } from "@/lib/email";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*]/),
  confirmPassword: z.string(),
  role: z.enum(["PERUSAHAAN", "PENGUSUL", "DONOR_KOLABORATOR"]),
  phone: z.string().optional().transform((value) => value?.trim() || undefined),
  organizationName: z.string().optional().transform((value) => value?.trim() || undefined),
  organizationType: z.string().optional().transform((value) => value?.trim() || undefined),
  agreeTerms: z.boolean(),
});

const ORGANIZATION_TYPE_MAP: Record<string, string> = {
  "NGO / Nonprofit": "NGO",
  "NGO / LSM": "NGO",
  "Community Group": "KOMUNITAS",
  Komunitas: "KOMUNITAS",
  "School / Educational Institution": "SEKOLAH",
  "Sekolah / Lembaga Pendidikan": "SEKOLAH",
  Cooperative: "KOPERASI",
  Koperasi: "KOPERASI",
  Foundation: "YAYASAN",
  Yayasan: "YAYASAN",
  "Social Startup": "STARTUP_SOSIAL",
  "Startup Sosial": "STARTUP_SOSIAL",
  Pemerintah: "PEMERINTAH",
  Other: "LAINNYA",
  Lainnya: "LAINNYA",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, confirmPassword, role, phone, organizationName, organizationType, agreeTerms } = parsed.data;

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Password tidak cocok" }, { status: 400 });
    }
    if (!agreeTerms) {
      return NextResponse.json({ error: "Anda harus menyetujui syarat dan ketentuan" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyCode = generateOTP(6);

    // Determine organization type
    const orgType =
      role === "PERUSAHAAN"
        ? "PERUSAHAAN"
        : ORGANIZATION_TYPE_MAP[organizationType || ""] || "LAINNYA";

    // Call Convex mutation to register user
    let result;
    try {
      result = await convexClient.mutation(api.auth.registerUser, {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        phone,
        organizationName,
        organizationType: organizationName ? orgType : undefined,
        verifyCode,
      });
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || "";
      if (errorMessage.includes("EMAIL_EXISTS")) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." },
          { status: 409 }
        );
      }
      console.error("[Register] Convex mutation error:", error);
      return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
    }

    // Send verification email
    let emailSent = false;
    try {
      const delivery = await sendVerificationOtpEmail(
        result.email,
        result.name || result.email.split("@")[0],
        verifyCode
      );
      emailSent = !delivery.skipped;
    } catch (emailError) {
      console.error("[Register] Failed to send verification email", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        emailSent,
        requiresEmailConfig: !emailSent,
        message: emailSent
          ? "Akun berhasil dibuat. Silakan verifikasi email Anda."
          : "Akun berhasil dibuat, tetapi email OTP gagal dikirim. Silakan coba kirim ulang kode verifikasi.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
