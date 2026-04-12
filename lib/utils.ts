import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// FORMAT HELPERS
// ============================================================

export function formatRupiah(amount: number | bigint, compact = false): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;

  if (compact) {
    if (num >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toFixed(1)} M`;
    }
    if (num >= 1_000_000) {
      return `Rp ${(num / 1_000_000).toFixed(1)} jt`;
    }
    if (num >= 1_000) {
      return `Rp ${(num / 1_000).toFixed(0)} rb`;
    }
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(num: number, compact = false): string {
  if (compact) {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}jt`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}rb`;
  }
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatDate(date: Date | string, fmt = "dd MMMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt, { locale: idLocale });
}

export function formatDateShort(date: Date | string): string {
  return formatDate(date, "dd MMM yyyy");
}

export function formatDatetime(date: Date | string): string {
  return formatDate(date, "dd MMM yyyy HH:mm");
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: idLocale });
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ============================================================
// GENERATORS
// ============================================================

export function generateProposalNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `CSR-${year}-${random}`;
}

export function generateProjectCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `PRJ-${year}-${random}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function isValidNPWP(npwp: string): boolean {
  const cleaned = npwp.replace(/[.\-]/g, "");
  return /^\d{15}$/.test(cleaned);
}

export function isValidPhone(phone: string): boolean {
  return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Minimal 8 karakter");
  if (!/[A-Z]/.test(password)) errors.push("Minimal 1 huruf kapital");
  if (!/[a-z]/.test(password)) errors.push("Minimal 1 huruf kecil");
  if (!/[0-9]/.test(password)) errors.push("Minimal 1 angka");
  if (!/[!@#$%^&*]/.test(password))
    errors.push("Minimal 1 karakter spesial (!@#$%^&*)");
  return { isValid: errors.length === 0, errors };
}

// ============================================================
// STATUS HELPERS
// ============================================================

export function getProposalStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    DIKIRIM: "bg-blue-100 text-blue-700",
    DALAM_REVIEW: "bg-yellow-100 text-yellow-700",
    MEMBUTUHKAN_REVISI: "bg-orange-100 text-orange-700",
    DISETUJUI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
    DIDANAI: "bg-emerald-100 text-emerald-700",
    BERJALAN: "bg-teal-100 text-teal-700",
    SELESAI: "bg-brand-100 text-brand-700",
    DIBATALKAN: "bg-gray-100 text-gray-500",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getVerificationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    BELUM_DIAJUKAN: "bg-gray-100 text-gray-600",
    MENUNGGU_REVIEW: "bg-blue-100 text-blue-700",
    DALAM_REVIEW: "bg-yellow-100 text-yellow-700",
    MEMBUTUHKAN_DOKUMEN_TAMBAHAN: "bg-orange-100 text-orange-700",
    TERVERIFIKASI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
    DICABUT: "bg-red-100 text-red-500",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getProjectStatusColor(status: string): string {
  const colors: Record<string, string> = {
    BELUM_DIMULAI: "bg-gray-100 text-gray-700",
    BERJALAN: "bg-blue-100 text-blue-700",
    TERTUNDA: "bg-orange-100 text-orange-700",
    SELESAI: "bg-green-100 text-green-700",
    DIBATALKAN: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    RENDAH: "bg-green-100 text-green-700",
    SEDANG: "bg-yellow-100 text-yellow-700",
    TINGGI: "bg-orange-100 text-orange-700",
    KRITIS: "bg-red-100 text-red-700",
  };
  return colors[level] || "bg-gray-100 text-gray-700";
}

// ============================================================
// MISC HELPERS
// ============================================================

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function parseJsonSafe<T>(value: unknown, fallback: T): T {
  if (typeof value === "object" && value !== null) return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildQueryString(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });
  return qs.toString();
}
