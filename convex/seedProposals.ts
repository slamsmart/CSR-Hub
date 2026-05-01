import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedProposalsAndProjects = internalMutation({
  args: {
    orgCerdas: v.id("organizations"), orgHijau: v.id("organizations"), orgSehat: v.id("organizations"), orgDigital: v.id("organizations"),
    orgPertamina: v.id("organizations"), orgMandiri: v.id("organizations"), orgTelkom: v.id("organizations"),
    ngoUser1: v.id("users"), ngoUser2: v.id("users"), ngoUser3: v.id("users"), ngoUser4: v.id("users"),
    adminPlatform: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const d = (s: string) => new Date(s).getTime();

    // Proposal 1 - Beasiswa Papua
    const p1 = await ctx.db.insert("proposals", {
      nomor: "CSR-2025-00001", title: "Beasiswa SMA untuk 100 Pelajar Kurang Mampu di Papua",
      slug: "beasiswa-sma-papua-2025",
      summary: "Program beasiswa komprehensif mencakup biaya sekolah, buku, seragam, dan biaya hidup selama 3 tahun untuk 100 pelajar SMA berprestasi namun kurang mampu di Papua.",
      description: "Program ini dirancang untuk memberikan akses pendidikan setara kepada 100 pelajar SMA berprestasi dari keluarga prasejahtera di Papua.",
      category: "PENDIDIKAN", sdgTags: ["SDG4_PENDIDIKAN_BERKUALITAS", "SDG10_BERKURANGNYA_KESENJANGAN"],
      keywords: ["beasiswa", "pendidikan", "papua", "3T"],
      organizationId: args.orgCerdas, createdById: args.ngoUser1,
      provinsi: "Papua", kabupatenKota: "Jayapura", isNasional: false,
      targetBeneficiaries: 100, budgetTotal: 750000000,
      budgetBreakdown: { biayaSPP: 300000000, biayaBuku: 75000000, biayaSeragam: 50000000, tunjanganHidup: 325000000 },
      startDate: d("2025-02-01"), endDate: d("2027-12-31"), durationMonths: 35,
      status: "DIDANAI", isPublic: true, isFeatured: true,
      aiCompletionScore: 92, aiMatchScore: 89, aiRiskScore: 15,
      aiSummary: "Proposal beasiswa komprehensif dengan track record organisasi yang sangat baik.",
      aiTags: ["beasiswa", "pendidikan", "papua", "3T", "pelajar kurang mampu"],
      fundingTarget: 750000000, fundingSecured: 750000000, fundingPercentage: 100,
      viewCount: 245, shortlistCount: 8,
      submittedAt: d("2025-01-15"), approvedAt: d("2025-01-25"), updatedAt: now,
    });

    // Proposal 2 - Mangrove Kaltim
    const p2 = await ctx.db.insert("proposals", {
      nomor: "CSR-2025-00002", title: "Restorasi 300 Hektar Hutan Mangrove di Pesisir Kalimantan Timur",
      slug: "restorasi-mangrove-kaltim-2025",
      summary: "Program restorasi ekosistem mangrove skala besar di 5 titik pesisir Kalimantan Timur.",
      description: "Restorasi ekosistem mangrove seluas 300 hektar di Kabupaten Kutai Kartanegara.",
      category: "LINGKUNGAN_HIDUP", sdgTags: ["SDG13_PENANGANAN_PERUBAHAN_IKLIM", "SDG14_KEHIDUPAN_BAWAH_LAUT", "SDG15_KEHIDUPAN_DI_DARAT"],
      keywords: ["mangrove", "lingkungan", "kalimantan", "karbon"],
      organizationId: args.orgHijau, createdById: args.ngoUser2,
      provinsi: "Kalimantan Timur", kabupatenKota: "Samarinda", isNasional: false,
      targetBeneficiaries: 5000, budgetTotal: 1200000000,
      budgetBreakdown: { pengadaanBibit: 400000000, tenagaKerja: 350000000, peralatan: 250000000, monitoring: 200000000 },
      startDate: d("2025-03-01"), endDate: d("2026-02-28"), durationMonths: 12,
      status: "BERJALAN", isPublic: true, isFeatured: true,
      aiCompletionScore: 95, aiMatchScore: 92, aiRiskScore: 12,
      aiSummary: "Program lingkungan terencana sangat baik dengan metodologi proven.",
      aiTags: ["mangrove", "lingkungan", "kalimantan", "karbon", "biodiversitas"],
      fundingTarget: 1200000000, fundingSecured: 1200000000, fundingPercentage: 100,
      viewCount: 312, shortlistCount: 12,
      submittedAt: d("2025-02-01"), approvedAt: d("2025-02-15"), updatedAt: now,
    });

    // Proposal 3 - Air Bersih NTT
    const p3 = await ctx.db.insert("proposals", {
      nomor: "CSR-2025-00003", title: "Pembangunan 25 Sumur Bor & Instalasi Air Bersih di NTT",
      slug: "air-bersih-ntt-2025",
      summary: "Pembangunan infrastruktur air bersih melalui 25 sumur bor artesis untuk 15.000 penduduk di 25 desa terpencil NTT.",
      description: "Program akses air bersih terpadu mencakup pembangunan sumur bor, instalasi pompa tenaga surya, dan pelatihan.",
      category: "KESEHATAN_MASYARAKAT", sdgTags: ["SDG6_AIR_BERSIH_SANITASI", "SDG3_KESEHATAN_BAIK"],
      keywords: ["air bersih", "NTT", "infrastruktur", "kesehatan"],
      organizationId: args.orgSehat, createdById: args.ngoUser3,
      provinsi: "Nusa Tenggara Timur", kabupatenKota: "Kupang", isNasional: false,
      targetBeneficiaries: 15000, budgetTotal: 2500000000,
      budgetBreakdown: { pembangunanSumur: 1500000000, instalasiPompa: 600000000, pelatihan: 200000000, monitoring: 200000000 },
      startDate: d("2025-04-01"), endDate: d("2026-03-31"), durationMonths: 12,
      status: "DISETUJUI", isPublic: true, isFeatured: false,
      aiCompletionScore: 88, aiMatchScore: 85, aiRiskScore: 20,
      aiSummary: "Program infrastruktur air bersih dengan dampak langsung sangat tinggi.",
      aiTags: ["air bersih", "NTT", "infrastruktur", "kesehatan", "3T"],
      fundingTarget: 2500000000, fundingSecured: 1000000000, fundingPercentage: 40,
      viewCount: 189, shortlistCount: 5,
      submittedAt: d("2025-03-01"), approvedAt: d("2025-03-20"), updatedAt: now,
    });

    // Proposal 4 - Digital UMKM Yogya
    const p4 = await ctx.db.insert("proposals", {
      nomor: "CSR-2025-00004", title: "Pelatihan Literasi Digital & E-Commerce 500 UMKM Yogyakarta",
      slug: "literasi-digital-umkm-jogja-2025",
      summary: "Program pelatihan komprehensif digital marketing dan e-commerce untuk 500 pelaku UMKM di Yogyakarta.",
      description: "Memperkuat kapasitas digital 500 UMKM melalui pelatihan intensif.",
      category: "TEKNOLOGI_DAN_INOVASI", sdgTags: ["SDG8_PEKERJAAN_LAYAK", "SDG9_INDUSTRI_INOVASI", "SDG4_PENDIDIKAN_BERKUALITAS"],
      keywords: ["UMKM", "digital", "e-commerce", "Yogyakarta"],
      organizationId: args.orgDigital, createdById: args.ngoUser4,
      provinsi: "DI Yogyakarta", kabupatenKota: "Yogyakarta", isNasional: false,
      targetBeneficiaries: 500, budgetTotal: 650000000,
      budgetBreakdown: { fasilitatorPelatihan: 300000000, materialPeralatan: 150000000, sewa: 100000000, lainnya: 100000000 },
      startDate: d("2025-05-01"), endDate: d("2025-10-31"), durationMonths: 6,
      status: "DALAM_REVIEW", isPublic: true, isFeatured: false,
      aiCompletionScore: 91, aiMatchScore: 87, aiRiskScore: 10,
      aiSummary: "Proposal pelatihan digital dengan target terukur dan metodologi terbukti.",
      aiTags: ["UMKM", "digital", "e-commerce", "Yogyakarta", "pemberdayaan ekonomi"],
      fundingTarget: 650000000, fundingSecured: 0, fundingPercentage: 0,
      viewCount: 95, shortlistCount: 3,
      submittedAt: d("2025-04-01"), updatedAt: now,
    });

    // Proposal 5 - Posyandu Jatim
    const p5 = await ctx.db.insert("proposals", {
      nomor: "CSR-2025-00005", title: "Program Posyandu Terpadu 50 Desa Terpencil Jawa Timur",
      slug: "posyandu-terpadu-jatim-2025",
      summary: "Revitalisasi 50 posyandu desa dengan peralatan kesehatan modern dan sistem pencatatan digital.",
      description: "Program revitalisasi posyandu komprehensif di 50 desa terpencil Jawa Timur.",
      category: "KESEHATAN_MASYARAKAT", sdgTags: ["SDG3_KESEHATAN_BAIK", "SDG5_KESETARAAN_GENDER"],
      keywords: ["posyandu", "kesehatan", "jawa timur", "ibu anak"],
      organizationId: args.orgSehat, createdById: args.ngoUser3,
      provinsi: "Jawa Timur", kabupatenKota: "Surabaya", isNasional: false,
      targetBeneficiaries: 25000, budgetTotal: 800000000,
      budgetBreakdown: { peralatanKesehatan: 400000000, pelatihanKader: 200000000, sistemDigital: 100000000, operasional: 100000000 },
      startDate: d("2025-06-01"), endDate: d("2026-05-31"), durationMonths: 12,
      status: "DIKIRIM", isPublic: true, isFeatured: false,
      aiCompletionScore: 82, aiMatchScore: 78, aiRiskScore: 22,
      aiSummary: "Program kesehatan preventif dengan jangkauan luas.",
      aiTags: ["posyandu", "kesehatan ibu anak", "jawa timur", "preventif"],
      fundingTarget: 800000000, fundingSecured: 0, fundingPercentage: 0,
      viewCount: 67, shortlistCount: 1,
      submittedAt: d("2025-05-01"), updatedAt: now,
    });

    // Projects
    const proj1 = await ctx.db.insert("projects", {
      proposalId: p1, kodeProyek: "PRJ-2025-00001", name: "Beasiswa SMA Papua 2025",
      status: "BERJALAN", anggaranTotal: 750000000, realisasiAnggaran: 225000000,
      progressFisik: 30, progressKeuangan: 30,
      startDate: d("2025-02-01"), endDate: d("2027-12-31"),
      picNama: "Siti Rahayu", picEmail: "ketua@yayasan-cerdas.org", picTelepon: "0812-9876-5432",
      lastMonitoringAt: d("2025-03-31"), updatedAt: now,
    });

    const proj2 = await ctx.db.insert("projects", {
      proposalId: p2, kodeProyek: "PRJ-2025-00002", name: "Restorasi Mangrove Kalimantan 2025",
      status: "BERJALAN", anggaranTotal: 1200000000, realisasiAnggaran: 480000000,
      progressFisik: 40, progressKeuangan: 40,
      startDate: d("2025-03-01"), endDate: d("2026-02-28"),
      picNama: "Dr. Bambang Priyatno", picEmail: "direktur@lingkunganhijau.org", picTelepon: "0811-2345-6789",
      lastMonitoringAt: d("2025-03-31"), updatedAt: now,
    });

    // Project milestones
    await ctx.db.insert("projectMilestones", { projectId: proj1, title: "Rekrutmen & Seleksi Siswa", targetDate: d("2025-02-28"), isCompleted: true, completedAt: d("2025-02-25"), orderIndex: 1, progressPct: 100 });
    await ctx.db.insert("projectMilestones", { projectId: proj1, title: "Penyaluran Dana Semester 1", targetDate: d("2025-03-15"), isCompleted: true, completedAt: d("2025-03-10"), orderIndex: 2, progressPct: 100 });
    await ctx.db.insert("projectMilestones", { projectId: proj1, title: "Monitoring Akademik Q1", targetDate: d("2025-05-31"), isCompleted: false, orderIndex: 3, progressPct: 60 });
    await ctx.db.insert("projectMilestones", { projectId: proj2, title: "Survey & Pemetaan Lahan", targetDate: d("2025-03-31"), isCompleted: true, completedAt: d("2025-03-28"), orderIndex: 1, progressPct: 100 });
    await ctx.db.insert("projectMilestones", { projectId: proj2, title: "Pengadaan Bibit Mangrove", targetDate: d("2025-04-30"), isCompleted: true, completedAt: d("2025-04-25"), orderIndex: 2, progressPct: 100 });
    await ctx.db.insert("projectMilestones", { projectId: proj2, title: "Penanaman Fase 1 (100 Ha)", targetDate: d("2025-06-30"), isCompleted: false, orderIndex: 3, progressPct: 45 });

    // Funding commitments
    await ctx.db.insert("fundingCommitments", { proposalId: p1, companyOrgId: args.orgPertamina as unknown as string, amount: 500000000, status: "DICAIRKAN", isCoFunding: false, notes: "Dana beasiswa penuh untuk 100 pelajar Papua", confirmedAt: d("2025-01-28"), disbursedAt: d("2025-02-05"), updatedAt: now });
    await ctx.db.insert("fundingCommitments", { proposalId: p1, companyOrgId: args.orgMandiri as unknown as string, amount: 250000000, status: "DICAIRKAN", isCoFunding: true, notes: "Co-funding program beasiswa Papua", confirmedAt: d("2025-01-30"), disbursedAt: d("2025-02-07"), updatedAt: now });
    await ctx.db.insert("fundingCommitments", { proposalId: p2, companyOrgId: args.orgPertamina as unknown as string, amount: 700000000, status: "DIKONFIRMASI", isCoFunding: false, notes: "Pendanaan utama restorasi mangrove Kalimantan", confirmedAt: d("2025-02-20"), updatedAt: now });
    await ctx.db.insert("fundingCommitments", { proposalId: p2, companyOrgId: args.orgTelkom as unknown as string, amount: 500000000, status: "DIKONFIRMASI", isCoFunding: true, notes: "Co-funding program lingkungan hidup", confirmedAt: d("2025-02-22"), updatedAt: now });
    await ctx.db.insert("fundingCommitments", { proposalId: p3, companyOrgId: args.orgMandiri as unknown as string, amount: 1000000000, status: "DIKONFIRMASI", isCoFunding: false, notes: "Pendanaan program air bersih NTT", confirmedAt: d("2025-03-25"), updatedAt: now });

    return { p1, p2, p3, p4, p5, proj1, proj2 };
  },
});
