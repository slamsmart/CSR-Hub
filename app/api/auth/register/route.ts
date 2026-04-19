import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateOTP } from "@/lib/security";
import { createAuditLog } from "@/lib/security";
import { generateSlug } from "@/lib/utils";
import { sendVerificationOtpEmail } from "@/lib/email";

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

    // Check existing email
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyCode = generateOTP(6);

    // Create user + organization in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role,
          phone,
        },
      });

      // Create organization if provided
      if (organizationName) {
        const orgType =
          role === "PERUSAHAAN"
            ? "PERUSAHAAN"
            : ORGANIZATION_TYPE_MAP[organizationType || ""] || "LAINNYA";

        const slug = generateSlug(organizationName) + "-" + Date.now();
        const org = await tx.organization.create({
          data: {
            name: organizationName,
            slug,
            type: orgType as any,
            email: email.toLowerCase(),
          },
        });

        await tx.organizationMember.create({
          data: {
            organizationId: org.id,
            userId: newUser.id,
            role: "OWNER",
          },
        });

        // Create respective profile
        if (role === "PERUSAHAAN") {
          await tx.companyProfile.create({ data: { organizationId: org.id } });
        } else {
          await tx.nGOProfile.create({ data: { organizationId: org.id } });
        }
      }

      return newUser;
    });

    try {
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

      await sendVerificationOtpEmail(user.email, user.name, verifyCode);
    } catch (emailError) {
      console.error("[Register] Failed to send verification email", emailError);
    }

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      resource: "users",
      resourceId: user.id,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
      metadata: { role, hasOrganization: !!organizationName },
    });

    return NextResponse.json(
      { success: true, message: "Akun berhasil dibuat. Silakan verifikasi email Anda." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
