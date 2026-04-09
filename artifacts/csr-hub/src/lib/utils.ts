import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number | null | undefined): string {
  if (amount == null) return "Rp 0";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    dikirim: "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    revisi: "bg-orange-100 text-orange-700",
    disetujui: "bg-green-100 text-green-700",
    ditolak: "bg-red-100 text-red-700",
    didanai: "bg-emerald-100 text-emerald-700",
    berjalan: "bg-teal-100 text-teal-700",
    selesai: "bg-slate-100 text-slate-700",
    aktif: "bg-teal-100 text-teal-700",
    terverifikasi: "bg-green-100 text-green-700",
    menunggu: "bg-yellow-100 text-yellow-700",
    ditangguhkan: "bg-red-100 text-red-700",
    belum: "bg-gray-100 text-gray-600",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Draft",
    dikirim: "Dikirim",
    review: "Dalam Review",
    revisi: "Perlu Revisi",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
    didanai: "Didanai",
    berjalan: "Berjalan",
    selesai: "Selesai",
    aktif: "Aktif",
    terverifikasi: "Terverifikasi",
    menunggu: "Menunggu",
    ditangguhkan: "Ditangguhkan",
    belum: "Belum Dimulai",
    perusahaan: "Perusahaan",
    ngo: "LSM/NGO",
    komunitas: "Komunitas",
    sekolah: "Sekolah",
    yayasan: "Yayasan",
    startup_sosial: "Startup Sosial",
    super_admin: "Super Admin",
    admin: "Admin",
    verifikator: "Verifikator",
    auditor: "Auditor",
    donor: "Donor",
    public: "Publik",
  };
  return map[status] ?? status;
}

export function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    super_admin: "bg-purple-100 text-purple-700",
    admin: "bg-blue-100 text-blue-700",
    verifikator: "bg-cyan-100 text-cyan-700",
    auditor: "bg-indigo-100 text-indigo-700",
    perusahaan: "bg-green-100 text-green-700",
    ngo: "bg-teal-100 text-teal-700",
    donor: "bg-orange-100 text-orange-700",
    public: "bg-gray-100 text-gray-700",
  };
  return map[role] ?? "bg-gray-100 text-gray-700";
}
