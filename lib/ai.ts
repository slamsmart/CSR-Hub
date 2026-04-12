/**
 * CSR Hub - AI/Smart Matching Module
 * Implementasi simulasi lokal yang realistis untuk rekomendasi dan analisis
 */

import { ProposalCategory, SDGCategory } from "@prisma/client";

// ============================================================
// SMART MATCHING ENGINE
// ============================================================

interface ProposalData {
  id: string;
  category: ProposalCategory;
  sdgTags: SDGCategory[];
  provinsi: string;
  budgetTotal: bigint | number;
  targetBeneficiaries: number;
  aiRiskScore?: number | null;
  keywords: string[];
  title: string;
  summary: string;
}

interface CompanyProfile {
  fokusCSR: ProposalCategory[];
  targetSDGs: SDGCategory[];
  wilayahFokus: string[];
  budgetMinimum?: bigint | number | null;
  budgetMaksimum?: bigint | number | null;
  targetDampakMinimum?: number | null;
}

export interface MatchResult {
  proposalId: string;
  totalScore: number; // 0-100
  breakdown: {
    categoryScore: number;
    sdgScore: number;
    regionScore: number;
    budgetScore: number;
    impactScore: number;
    riskScore: number;
  };
  reasons: string[];
  warnings: string[];
}

export function calculateMatchScore(
  proposal: ProposalData,
  company: CompanyProfile
): MatchResult {
  const breakdown = {
    categoryScore: 0,
    sdgScore: 0,
    regionScore: 0,
    budgetScore: 0,
    impactScore: 0,
    riskScore: 0,
  };
  const reasons: string[] = [];
  const warnings: string[] = [];

  // 1. Category Match (25 points)
  if (company.fokusCSR.length > 0) {
    if (company.fokusCSR.includes(proposal.category)) {
      breakdown.categoryScore = 25;
      reasons.push(`Kategori "${proposal.category}" sesuai fokus CSR perusahaan`);
    } else {
      breakdown.categoryScore = 5;
    }
  } else {
    breakdown.categoryScore = 15; // No preference - partial score
  }

  // 2. SDG Alignment (20 points)
  if (company.targetSDGs.length > 0 && proposal.sdgTags.length > 0) {
    const sdgMatches = proposal.sdgTags.filter((sdg) =>
      company.targetSDGs.includes(sdg)
    );
    breakdown.sdgScore = Math.round(
      (sdgMatches.length / Math.min(company.targetSDGs.length, proposal.sdgTags.length)) * 20
    );
    if (sdgMatches.length > 0) {
      reasons.push(`${sdgMatches.length} SDGs selaras dengan target perusahaan`);
    }
  } else {
    breakdown.sdgScore = 10;
  }

  // 3. Region Match (15 points)
  if (company.wilayahFokus.length > 0) {
    if (company.wilayahFokus.includes(proposal.provinsi) || company.wilayahFokus.includes("NASIONAL")) {
      breakdown.regionScore = 15;
      reasons.push(`Wilayah program sesuai dengan fokus wilayah perusahaan`);
    } else {
      breakdown.regionScore = 3;
      warnings.push("Wilayah program di luar fokus wilayah perusahaan");
    }
  } else {
    breakdown.regionScore = 10;
  }

  // 4. Budget Fit (20 points)
  const budget = Number(proposal.budgetTotal);
  const minBudget = company.budgetMinimum ? Number(company.budgetMinimum) : 0;
  const maxBudget = company.budgetMaksimum ? Number(company.budgetMaksimum) : Infinity;

  if (budget >= minBudget && budget <= maxBudget) {
    breakdown.budgetScore = 20;
    reasons.push("Anggaran proposal sesuai dengan kapasitas pendanaan perusahaan");
  } else if (budget < minBudget) {
    breakdown.budgetScore = 5;
    warnings.push("Anggaran proposal di bawah minimum perusahaan");
  } else {
    breakdown.budgetScore = 8;
    warnings.push("Anggaran proposal melebihi maksimum perusahaan");
  }

  // 5. Impact Potential (15 points)
  const minImpact = company.targetDampakMinimum || 0;
  if (proposal.targetBeneficiaries >= minImpact) {
    const impactRatio = Math.min(proposal.targetBeneficiaries / Math.max(minImpact, 100), 5);
    breakdown.impactScore = Math.min(Math.round(impactRatio * 3), 15);
    if (proposal.targetBeneficiaries >= 1000) {
      reasons.push(`Target ${proposal.targetBeneficiaries.toLocaleString("id-ID")} penerima manfaat menunjukkan dampak signifikan`);
    }
  } else {
    breakdown.impactScore = 2;
    warnings.push(`Target penerima manfaat di bawah ekspektasi minimum perusahaan`);
  }

  // 6. Risk Score (5 points)
  const riskScore = proposal.aiRiskScore || 0;
  if (riskScore < 0.3) {
    breakdown.riskScore = 5;
    reasons.push("Profil risiko proposal sangat baik");
  } else if (riskScore < 0.6) {
    breakdown.riskScore = 3;
  } else {
    breakdown.riskScore = 0;
    warnings.push("Proposal memiliki indikator risiko yang perlu diperhatikan");
  }

  const totalScore = Object.values(breakdown).reduce((sum, s) => sum + s, 0);

  return {
    proposalId: proposal.id,
    totalScore,
    breakdown,
    reasons,
    warnings,
  };
}

// ============================================================
// PROPOSAL COMPLETENESS ANALYZER
// ============================================================

interface CompletenessInput {
  title: string;
  summary: string;
  description: string;
  category: string;
  sdgTags: string[];
  provinsi: string;
  targetBeneficiaries: number;
  budgetTotal: number;
  budgetBreakdown: unknown[];
  startDate: string;
  endDate: string;
  milestones: unknown[];
  attachments: unknown[];
  jenisManfaat: string[];
  deskripsiPenerima?: string;
}

export interface CompletenessResult {
  score: number; // 0-100
  level: "SANGAT_RENDAH" | "RENDAH" | "CUKUP" | "BAIK" | "SANGAT_BAIK";
  items: Array<{
    field: string;
    label: string;
    passed: boolean;
    weight: number;
    suggestion?: string;
  }>;
}

export function analyzeProposalCompleteness(
  data: CompletenessInput
): CompletenessResult {
  const items = [
    {
      field: "title",
      label: "Judul Proposal",
      passed: data.title.length >= 20,
      weight: 5,
      suggestion: "Judul minimal 20 karakter yang deskriptif",
    },
    {
      field: "summary",
      label: "Ringkasan Eksekutif",
      passed: data.summary.length >= 100,
      weight: 10,
      suggestion: "Ringkasan minimal 100 karakter",
    },
    {
      field: "description",
      label: "Deskripsi Program",
      passed: data.description.length >= 300,
      weight: 15,
      suggestion: "Deskripsi program harus detail, minimal 300 karakter",
    },
    {
      field: "sdgTags",
      label: "Tag SDGs",
      passed: data.sdgTags.length >= 1,
      weight: 8,
      suggestion: "Pilih minimal 1 SDG yang relevan",
    },
    {
      field: "targetBeneficiaries",
      label: "Target Penerima Manfaat",
      passed: data.targetBeneficiaries > 0,
      weight: 8,
      suggestion: "Tentukan jumlah penerima manfaat yang realistis",
    },
    {
      field: "jenisManfaat",
      label: "Jenis Penerima",
      passed: data.jenisManfaat.length > 0,
      weight: 5,
      suggestion: "Tentukan jenis kelompok penerima manfaat",
    },
    {
      field: "deskripsiPenerima",
      label: "Deskripsi Penerima",
      passed: (data.deskripsiPenerima?.length || 0) >= 50,
      weight: 7,
      suggestion: "Jelaskan lebih detail tentang penerima manfaat",
    },
    {
      field: "budgetBreakdown",
      label: "Rincian Anggaran",
      passed: data.budgetBreakdown.length >= 3,
      weight: 15,
      suggestion: "Lengkapi rincian anggaran dengan minimal 3 komponen",
    },
    {
      field: "milestones",
      label: "Milestone / Tahapan",
      passed: data.milestones.length >= 2,
      weight: 12,
      suggestion: "Buat minimal 2 milestone/tahapan program",
    },
    {
      field: "attachments",
      label: "Dokumen Pendukung",
      passed: data.attachments.length >= 1,
      weight: 15,
      suggestion: "Upload minimal 1 dokumen pendukung (proposal lengkap, RAB, dll)",
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items
    .filter((item) => item.passed)
    .reduce((sum, item) => sum + item.weight, 0);

  const score = Math.round((earnedWeight / totalWeight) * 100);

  const level =
    score >= 90
      ? "SANGAT_BAIK"
      : score >= 70
      ? "BAIK"
      : score >= 50
      ? "CUKUP"
      : score >= 30
      ? "RENDAH"
      : "SANGAT_RENDAH";

  return { score, level, items };
}

// ============================================================
// AUTO-TAGGING
// ============================================================

const CATEGORY_KEYWORDS: Record<ProposalCategory, string[]> = {
  PENDIDIKAN: ["sekolah", "pendidikan", "beasiswa", "belajar", "guru", "siswa", "literasi", "perpustakaan", "kurikulum", "edukasi"],
  LINGKUNGAN_HIDUP: ["lingkungan", "hutan", "sampah", "daur ulang", "pohon", "hijau", "iklim", "energi", "air", "polusi", "ekosistem"],
  EKONOMI_PEMBERDAYAAN: ["ekonomi", "usaha", "modal", "koperasi", "wirausaha", "pendapatan", "lapangan kerja", "pelatihan kerja"],
  KESEHATAN_MASYARAKAT: ["kesehatan", "medis", "puskesmas", "posyandu", "gizi", "vaksin", "sanitasi", "air bersih", "stunting"],
  INFRASTRUKTUR_SOSIAL: ["jembatan", "jalan", "sanitasi", "MCK", "fasilitas", "gedung", "infrastruktur", "pembangunan"],
  PEMBERDAYAAN_PEREMPUAN: ["perempuan", "ibu", "gender", "kesetaraan", "perlindungan perempuan", "emansipasi"],
  PENGEMBANGAN_UMKM: ["UMKM", "usaha kecil", "mikro", "kerajinan", "produk lokal", "IKM", "pengrajin"],
  KEBENCANAAN_DAN_KEMANUSIAAN: ["bencana", "gempa", "banjir", "longsor", "pengungsi", "bantuan", "darurat", "rekonstruksi"],
  SENI_DAN_BUDAYA: ["seni", "budaya", "tradisi", "festival", "kesenian", "warisan budaya"],
  OLAHRAGA_DAN_KEPEMUDAAN: ["olahraga", "pemuda", "atlet", "turnamen", "generasi muda", "kepemudaan"],
  TEKNOLOGI_DAN_INOVASI: ["teknologi", "digital", "internet", "inovasi", "startup", "coding", "AI", "aplikasi"],
  PERTANIAN_DAN_PANGAN: ["pertanian", "petani", "pangan", "sawah", "ternak", "nelayan", "ketahanan pangan"],
  LAINNYA: [],
};

export function autoTagCategory(text: string): ProposalCategory {
  const lowerText = text.toLowerCase();
  let bestMatch: ProposalCategory = "LAINNYA";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => lowerText.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category as ProposalCategory;
    }
  }

  return bestMatch;
}

export function autoTagSDGs(text: string): SDGCategory[] {
  const lowerText = text.toLowerCase();
  const sdgKeywords: Record<SDGCategory, string[]> = {
    SDG1_TANPA_KEMISKINAN: ["kemiskinan", "miskin", "pengentasan kemiskinan"],
    SDG2_TANPA_KELAPARAN: ["kelaparan", "pangan", "gizi buruk", "malnutrisi"],
    SDG3_KESEHATAN_BAIK: ["kesehatan", "penyakit", "sanitasi", "air bersih", "stunting"],
    SDG4_PENDIDIKAN_BERKUALITAS: ["pendidikan", "sekolah", "literasi", "belajar"],
    SDG5_KESETARAAN_GENDER: ["gender", "perempuan", "kesetaraan", "emansipasi"],
    SDG6_AIR_BERSIH_SANITASI: ["air bersih", "sanitasi", "MCK", "toilet"],
    SDG7_ENERGI_BERSIH: ["energi terbarukan", "solar", "listrik", "energi bersih"],
    SDG8_PEKERJAAN_LAYAK: ["pekerjaan", "lapangan kerja", "wirausaha", "UMR"],
    SDG9_INDUSTRI_INOVASI: ["inovasi", "industri", "infrastruktur", "teknologi"],
    SDG10_BERKURANGNYA_KESENJANGAN: ["ketimpangan", "kesenjangan", "inklusif"],
    SDG11_KOTA_KOMUNITAS_BERKELANJUTAN: ["pemukiman", "kota layak", "perumahan"],
    SDG12_KONSUMSI_PRODUKSI_BERTANGGUNG_JAWAB: ["daur ulang", "sampah", "limbah", "konsumsi"],
    SDG13_PENANGANAN_PERUBAHAN_IKLIM: ["iklim", "emisi", "karbon", "pemanasan global"],
    SDG14_KEHIDUPAN_BAWAH_LAUT: ["laut", "terumbu karang", "nelayan", "pesisir"],
    SDG15_KEHIDUPAN_DI_DARAT: ["hutan", "keanekaragaman hayati", "lahan", "satwa"],
    SDG16_PERDAMAIAN_KEADILAN: ["perdamaian", "keadilan", "hukum", "korupsi"],
    SDG17_KEMITRAAN_UNTUK_TUJUAN: ["kemitraan", "kolaborasi", "kerjasama"],
  };

  const matches: SDGCategory[] = [];
  for (const [sdg, keywords] of Object.entries(sdgKeywords)) {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      matches.push(sdg as SDGCategory);
    }
  }

  return matches.slice(0, 5); // Max 5 SDGs
}

// ============================================================
// RISK ANALYZER
// ============================================================

export interface RiskAnalysis {
  score: number; // 0-1 (higher = more risky)
  level: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS";
  flags: string[];
}

export function analyzeProposalRisk(data: {
  budgetTotal: number;
  targetBeneficiaries: number;
  durationMonths: number;
  organizationAge?: number;
  completenessScore: number;
  previousSuccessRate?: number;
}): RiskAnalysis {
  const flags: string[] = [];
  let riskScore = 0;

  // Budget per beneficiary check
  const budgetPerBeneficiary = data.budgetTotal / data.targetBeneficiaries;
  if (budgetPerBeneficiary > 10_000_000) {
    flags.push("Anggaran per penerima manfaat sangat tinggi");
    riskScore += 0.2;
  }
  if (budgetPerBeneficiary < 10_000) {
    flags.push("Anggaran per penerima manfaat sangat rendah, perlu validasi");
    riskScore += 0.1;
  }

  // Duration check
  if (data.durationMonths < 1) {
    flags.push("Durasi program terlalu singkat");
    riskScore += 0.15;
  }
  if (data.durationMonths > 36) {
    flags.push("Durasi program sangat panjang (>3 tahun)");
    riskScore += 0.1;
  }

  // Completeness
  if (data.completenessScore < 50) {
    flags.push("Kelengkapan proposal sangat rendah");
    riskScore += 0.25;
  } else if (data.completenessScore < 70) {
    flags.push("Kelengkapan proposal perlu ditingkatkan");
    riskScore += 0.1;
  }

  // Organization age
  if (data.organizationAge !== undefined && data.organizationAge < 1) {
    flags.push("Organisasi baru (<1 tahun)");
    riskScore += 0.15;
  }

  // Previous success rate
  if (data.previousSuccessRate !== undefined && data.previousSuccessRate < 0.5) {
    flags.push("Tingkat keberhasilan proyek sebelumnya rendah");
    riskScore += 0.15;
  }

  const normalizedScore = Math.min(riskScore, 1);
  const level =
    normalizedScore >= 0.7
      ? "KRITIS"
      : normalizedScore >= 0.5
      ? "TINGGI"
      : normalizedScore >= 0.3
      ? "SEDANG"
      : "RENDAH";

  return { score: normalizedScore, level, flags };
}

// ============================================================
// AI SUMMARY GENERATOR
// ============================================================

export function generateProposalSummary(data: {
  title: string;
  organizationName: string;
  category: string;
  provinsi: string;
  targetBeneficiaries: number;
  budgetTotal: number;
  durationMonths: number;
  sdgCount: number;
}): string {
  const categoryMap: Record<string, string> = {
    PENDIDIKAN: "bidang pendidikan",
    LINGKUNGAN_HIDUP: "pelestarian lingkungan hidup",
    KESEHATAN_MASYARAKAT: "peningkatan kesehatan masyarakat",
    EKONOMI_PEMBERDAYAAN: "pemberdayaan ekonomi masyarakat",
    INFRASTRUKTUR_SOSIAL: "pembangunan infrastruktur sosial",
    PEMBERDAYAAN_PEREMPUAN: "pemberdayaan perempuan",
    PENGEMBANGAN_UMKM: "pengembangan UMKM",
    LAINNYA: "program sosial",
  };

  const category = categoryMap[data.category] || "program sosial";
  const budget = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(data.budgetTotal);

  return (
    `${data.organizationName} mengajukan program CSR dalam ${category} ` +
    `di wilayah ${data.provinsi}. Program berjudul "${data.title}" ini dirancang untuk ` +
    `menyentuh ${data.targetBeneficiaries.toLocaleString("id-ID")} penerima manfaat ` +
    `dalam periode ${data.durationMonths} bulan dengan total anggaran ${budget}. ` +
    `Program ini berkontribusi pada ${data.sdgCount} Tujuan Pembangunan Berkelanjutan (SDGs).`
  );
}
