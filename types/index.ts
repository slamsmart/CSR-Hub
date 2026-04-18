import {
  UserRole,
  OrgType,
  VerificationStatus,
  ProposalStatus,
  ProposalCategory,
  SDGCategory,
  FundingStatus,
  ProjectStatus,
  NotificationType,
  RiskLevel,
} from "@prisma/client";
import { STRUCTURE_COPY, type AppLanguage } from "@/lib/i18n";

export type {
  UserRole,
  OrgType,
  VerificationStatus,
  ProposalStatus,
  ProposalCategory,
  SDGCategory,
  FundingStatus,
  ProjectStatus,
  NotificationType,
  RiskLevel,
};

// ============================================================
// EXTENDED TYPES
// ============================================================

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  organizationId?: string;
  organizationName?: string;
  organizationType?: OrgType;
  isVerified?: boolean;
}

export interface ProposalWithRelations {
  id: string;
  nomor: string;
  title: string;
  summary: string;
  category: ProposalCategory;
  status: ProposalStatus;
  budgetTotal: bigint;
  fundingTarget: bigint;
  fundingSecured: bigint;
  fundingPercentage: number;
  provinsi: string;
  targetBeneficiaries: number;
  startDate: Date;
  endDate: Date;
  sdgTags: SDGCategory[];
  aiMatchScore?: number;
  organization: {
    id: string;
    name: string;
    logo?: string;
    verificationStatus: VerificationStatus;
    trustScore: number;
  };
  createdAt: Date;
}

export interface DashboardStats {
  totalProposals: number;
  approvedProposals: number;
  fundingTotal: bigint;
  totalBeneficiaries: number;
  activeProjects: number;
  verifiedOrganizations: number;
  pendingVerifications: number;
  riskAlerts: number;
}

export interface CompanyDashboardStats {
  proposalsMasuk: number;
  proposalsDisetujui: number;
  totalDanaTersalurkan: bigint;
  proyekBerjalan: number;
  proyekSelesai: number;
  totalPenerima: number;
}

export interface NGODashboardStats {
  totalProposals: number;
  proposalsDiproses: number;
  proposalsDisetujui: number;
  totalDanaDiterima: bigint;
  proyekBerjalan: number;
  proyekSelesai: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface ProposalFilter {
  status?: ProposalStatus | ProposalStatus[];
  category?: ProposalCategory | ProposalCategory[];
  provinsi?: string;
  sdgTags?: SDGCategory[];
  budgetMin?: number;
  budgetMax?: number;
  search?: string;
  organizationId?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface NotificationData {
  proposalId?: string;
  proposalTitle?: string;
  organizationId?: string;
  organizationName?: string;
  projectId?: string;
  amount?: string;
}

export interface AIMatchResult {
  proposalId: string;
  score: number;
  reasons: string[];
  sdgAlignment: number;
  categoryMatch: boolean;
  regionMatch: boolean;
  budgetFit: boolean;
  impactPotential: number;
}

export interface ImpactSummary {
  totalBeneficiaries: number;
  byCategory: Record<string, number>;
  byProvince: Record<string, number>;
  sdgContributions: Record<string, number>;
  yearOverYear: Array<{ year: number; beneficiaries: number; projects: number }>;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface ProposalFormData {
  // Step 1: Informasi Dasar
  title: string;
  summary: string;
  description: string;
  category: ProposalCategory;
  subCategory?: string;
  sdgTags: SDGCategory[];
  keywords: string[];

  // Step 2: Target & Wilayah
  provinsi: string;
  kabupatenKota?: string;
  kecamatan?: string;
  targetWilayahDetail?: string;
  isNasional: boolean;
  targetBeneficiaries: number;
  jenisManfaat: string[];
  deskripsiPenerima?: string;

  // Step 3: Anggaran
  budgetTotal: number;
  budgetBreakdown: BudgetItem[];
  fundingTarget: number;

  // Step 4: Timeline
  startDate: string;
  endDate: string;
  durationMonths: number;
  milestones: MilestoneInput[];

  // Step 5: Dokumen
  attachments?: File[];
}

export interface BudgetItem {
  kategori: string;
  deskripsi: string;
  jumlah: number;
  satuan: string;
  volume: number;
  total: number;
}

export interface MilestoneInput {
  title: string;
  description?: string;
  targetDate: string;
  orderIndex: number;
}

export interface OrganizationFormData {
  name: string;
  type: OrgType;
  description?: string;
  mission?: string;
  vision?: string;
  foundedYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  provinsi?: string;
  kabupatenKota?: string;
  nomorAkta?: string;
  nomorNPWP?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
  organizationName?: string;
  organizationType?: OrgType;
  agreeTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
  totpCode?: string;
}

// ============================================================
// LABEL MAPS
// ============================================================

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_PLATFORM: "Admin Platform",
  VERIFIKATOR: "Verifikator",
  AUDITOR: "Auditor / Monitoring Officer",
  PERUSAHAAN: "Perusahaan / Industri",
  PENGUSUL: "NGO / Komunitas / Yayasan",
  DONOR_KOLABORATOR: "Donor Kolaborator",
  PUBLIC: "Pengunjung",
};

export const ORG_TYPE_LABELS: Record<OrgType, string> = {
  PERUSAHAAN: "Perusahaan / Industri",
  NGO: "LSM / NGO",
  KOMUNITAS: "Komunitas",
  SEKOLAH: "Sekolah / Lembaga Pendidikan",
  KOPERASI: "Koperasi",
  YAYASAN: "Yayasan",
  STARTUP_SOSIAL: "Startup Sosial",
  PEMERINTAH: "Instansi Pemerintah",
  LAINNYA: "Lainnya",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  DRAFT: "Draft",
  DIKIRIM: "Dikirim",
  DALAM_REVIEW: "Dalam Review",
  MEMBUTUHKAN_REVISI: "Perlu Revisi",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  DIDANAI: "Didanai",
  BERJALAN: "Berjalan",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

export const CATEGORY_LABELS: Record<ProposalCategory, string> = {
  PENDIDIKAN: "Pendidikan",
  LINGKUNGAN_HIDUP: "Lingkungan Hidup",
  EKONOMI_PEMBERDAYAAN: "Ekonomi & Pemberdayaan",
  KESEHATAN_MASYARAKAT: "Kesehatan Masyarakat",
  INFRASTRUKTUR_SOSIAL: "Infrastruktur Sosial",
  PEMBERDAYAAN_PEREMPUAN: "Pemberdayaan Perempuan",
  PENGEMBANGAN_UMKM: "Pengembangan UMKM",
  KEBENCANAAN_DAN_KEMANUSIAAN: "Kebencanaan & Kemanusiaan",
  SENI_DAN_BUDAYA: "Seni & Budaya",
  OLAHRAGA_DAN_KEPEMUDAAN: "Olahraga & Kepemudaan",
  TEKNOLOGI_DAN_INOVASI: "Teknologi & Inovasi",
  PERTANIAN_DAN_PANGAN: "Pertanian & Pangan",
  LAINNYA: "Lainnya",
};

export const SDG_LABELS: Record<SDGCategory, string> = {
  SDG1_TANPA_KEMISKINAN: "SDG 1: Tanpa Kemiskinan",
  SDG2_TANPA_KELAPARAN: "SDG 2: Tanpa Kelaparan",
  SDG3_KESEHATAN_BAIK: "SDG 3: Kesehatan yang Baik",
  SDG4_PENDIDIKAN_BERKUALITAS: "SDG 4: Pendidikan Berkualitas",
  SDG5_KESETARAAN_GENDER: "SDG 5: Kesetaraan Gender",
  SDG6_AIR_BERSIH_SANITASI: "SDG 6: Air Bersih dan Sanitasi",
  SDG7_ENERGI_BERSIH: "SDG 7: Energi Bersih dan Terjangkau",
  SDG8_PEKERJAAN_LAYAK: "SDG 8: Pekerjaan Layak",
  SDG9_INDUSTRI_INOVASI: "SDG 9: Industri & Inovasi",
  SDG10_BERKURANGNYA_KESENJANGAN: "SDG 10: Berkurangnya Kesenjangan",
  SDG11_KOTA_KOMUNITAS_BERKELANJUTAN: "SDG 11: Kota Berkelanjutan",
  SDG12_KONSUMSI_PRODUKSI_BERTANGGUNG_JAWAB: "SDG 12: Konsumsi Bertanggung Jawab",
  SDG13_PENANGANAN_PERUBAHAN_IKLIM: "SDG 13: Penanganan Perubahan Iklim",
  SDG14_KEHIDUPAN_BAWAH_LAUT: "SDG 14: Kehidupan Bawah Laut",
  SDG15_KEHIDUPAN_DI_DARAT: "SDG 15: Kehidupan di Darat",
  SDG16_PERDAMAIAN_KEADILAN: "SDG 16: Perdamaian & Keadilan",
  SDG17_KEMITRAAN_UNTUK_TUJUAN: "SDG 17: Kemitraan untuk Tujuan",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  BELUM_DIAJUKAN: "Belum Diajukan",
  MENUNGGU_REVIEW: "Menunggu Review",
  DALAM_REVIEW: "Dalam Review",
  MEMBUTUHKAN_DOKUMEN_TAMBAHAN: "Perlu Dokumen Tambahan",
  TERVERIFIKASI: "Terverifikasi",
  DITOLAK: "Ditolak",
  DICABUT: "Dicabut",
};

export function getRoleLabels(language: AppLanguage): Record<UserRole, string> {
  return STRUCTURE_COPY[language].dashboard.roles as Record<UserRole, string>;
}

export function getOrgTypeLabels(language: AppLanguage): Record<OrgType, string> {
  return STRUCTURE_COPY[language].dashboard.orgTypes as Record<OrgType, string>;
}

export function getProposalStatusLabels(language: AppLanguage): Record<ProposalStatus, string> {
  return STRUCTURE_COPY[language].dashboard.proposalStatuses as Record<ProposalStatus, string>;
}

export function getCategoryLabels(language: AppLanguage): Record<ProposalCategory, string> {
  return STRUCTURE_COPY[language].dashboard.categories as Record<ProposalCategory, string>;
}
