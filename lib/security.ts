import { z } from "zod";
import { prisma } from "./prisma";
import { AuditAction } from "@prisma/client";

// ============================================================
// AUDIT LOGGING
// ============================================================

interface AuditLogParams {
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        oldValue: params.oldValue ? JSON.stringify(params.oldValue) : undefined,
        newValue: params.newValue ? JSON.stringify(params.newValue) : undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent?.slice(0, 500),
        metadata: (params.metadata ?? null) as any,
      },
    });
  } catch (error) {
    // Fail silently - don't block main operation for audit failures
    console.error("[AuditLog] Failed to create audit log:", error);
  }
}

// ============================================================
// RATE LIMITING (in-memory, for production use Redis)
// ============================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// ============================================================
// INPUT SANITIZATION
// ============================================================

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 255);
}

// ============================================================
// FILE VALIDATION
// ============================================================

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE_MB = 10;

export function validateFileUpload(
  file: File,
  allowImages = true,
  maxSizeMB = MAX_FILE_SIZE_MB
): { valid: boolean; error?: string } {
  const allowedTypes = allowImages
    ? [...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_IMAGE_TYPES]
    : ALLOWED_DOCUMENT_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipe file tidak diizinkan. Tipe yang diterima: PDF, Word, Excel${allowImages ? ", Gambar" : ""}`,
    };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  // Check for double extension attacks
  const parts = file.name.split(".");
  if (parts.length > 2) {
    const hasExecutable = parts
      .slice(0, -1)
      .some((p) =>
        ["exe", "php", "js", "sh", "bat", "cmd"].includes(p.toLowerCase())
      );
    if (hasExecutable) {
      return { valid: false, error: "Nama file tidak valid" };
    }
  }

  return { valid: true };
}

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

export const proposalSchema = z.object({
  title: z
    .string()
    .min(10, "Judul minimal 10 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  summary: z
    .string()
    .min(50, "Ringkasan minimal 50 karakter")
    .max(500, "Ringkasan maksimal 500 karakter"),
  description: z.string().min(200, "Deskripsi minimal 200 karakter"),
  category: z.string(),
  sdgTags: z.array(z.string()).min(1, "Pilih minimal 1 SDGs"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  targetBeneficiaries: z
    .number()
    .min(1, "Target penerima minimal 1 orang")
    .max(10_000_000),
  budgetTotal: z
    .number()
    .min(1_000_000, "Anggaran minimal Rp 1.000.000")
    .max(100_000_000_000, "Anggaran maksimal Rp 100 miliar"),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export const organizationSchema = z.object({
  name: z
    .string()
    .min(3, "Nama organisasi minimal 3 karakter")
    .max(200),
  type: z.enum([
    "PERUSAHAAN", "NGO", "KOMUNITAS", "SEKOLAH",
    "KOPERASI", "YAYASAN", "STARTUP_SOSIAL", "PEMERINTAH", "LAINNYA",
  ]),
  description: z.string().max(2000).optional(),
  email: z.string().email("Email tidak valid").optional(),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor telepon tidak valid").optional(),
  website: z.string().url("URL website tidak valid").optional().or(z.literal("")),
  nomorNPWP: z.string().regex(/^\d{15}$/, "NPWP harus 15 digit").optional().or(z.literal("")),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada huruf kapital")
      .regex(/[a-z]/, "Harus ada huruf kecil")
      .regex(/[0-9]/, "Harus ada angka")
      .regex(/[!@#$%^&*]/, "Harus ada karakter spesial"),
    confirmPassword: z.string(),
    role: z.enum(["PERUSAHAAN", "PENGUSUL", "DONOR_KOLABORATOR"]),
    phone: z
      .string()
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor telepon tidak valid")
      .optional(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "Anda harus menyetujui syarat dan ketentuan" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// ============================================================
// TOKEN HELPERS
// ============================================================

import crypto from "crypto";

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function generateOTP(length = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
