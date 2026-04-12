import {
  PrismaClient,
  UserRole,
  OrgType,
  VerificationStatus,
  ProposalStatus,
  ProposalCategory,
  SDGCategory,
  ProjectStatus,
  FundingStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seed data...");

  // ─── Clean up ────────────────────────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.projectReport.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.impactMetric.deleteMany();
  await prisma.auditReport.deleteMany();
  await prisma.project.deleteMany();
  await prisma.fundingDisbursement.deleteMany();
  await prisma.coFundingParticipant.deleteMany();
  await prisma.fundingCommitment.deleteMany();
  await prisma.companyShortlist.deleteMany();
  await prisma.proposalStatusHistory.deleteMany();
  await prisma.proposalMilestone.deleteMany();
  await prisma.proposalAttachment.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.trustScore.deleteMany();
  await prisma.verificationReview.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.nGOProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Password123!", 12);

  // ─── Users ───────────────────────────────────────────────
  console.log("👤 Membuat pengguna...");

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin CSR Hub",
      email: "superadmin@csrhub.id",
      password,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const adminPlatform = await prisma.user.create({
    data: {
      name: "Dewi Kurniawati",
      email: "admin@csrhub.id",
      password,
      role: UserRole.ADMIN_PLATFORM,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const verifikator = await prisma.user.create({
    data: {
      name: "Agus Hermawan",
      email: "verifikator@csrhub.id",
      password,
      role: UserRole.VERIFIKATOR,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const auditor = await prisma.user.create({
    data: {
      name: "Dr. Sri Mulyani",
      email: "auditor@csrhub.id",
      password,
      role: UserRole.AUDITOR,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const companyUser1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "csr@pertamina-csr.id",
      password,
      role: UserRole.PERUSAHAAN,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const companyUser2 = await prisma.user.create({
    data: {
      name: "Ratna Dewi",
      email: "csr@mandiri-foundation.id",
      password,
      role: UserRole.PERUSAHAAN,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const companyUser3 = await prisma.user.create({
    data: {
      name: "Hendra Wijaya",
      email: "csr@telkom-peduli.id",
      password,
      role: UserRole.PERUSAHAAN,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const ngoUser1 = await prisma.user.create({
    data: {
      name: "Siti Rahayu",
      email: "ketua@yayasan-cerdas.org",
      password,
      role: UserRole.PENGUSUL,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const ngoUser2 = await prisma.user.create({
    data: {
      name: "Dr. Bambang Priyatno",
      email: "direktur@lingkunganhijau.org",
      password,
      role: UserRole.PENGUSUL,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const ngoUser3 = await prisma.user.create({
    data: {
      name: "Fatimah Azzahra",
      email: "pimpinan@komunitas-sehat.org",
      password,
      role: UserRole.PENGUSUL,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const ngoUser4 = await prisma.user.create({
    data: {
      name: "Rudi Prasetyo",
      email: "direktur@digitaldesa.id",
      password,
      role: UserRole.PENGUSUL,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  // ─── Organizations ────────────────────────────────────────
  console.log("🏢 Membuat organisasi...");

  const orgPertamina = await prisma.organization.create({
    data: {
      name: "PT Pertamina (Persero)",
      slug: "pt-pertamina",
      type: OrgType.PERUSAHAAN,
      email: "csr@pertamina.com",
      phone: "021-3815111",
      address: "Jl. Medan Merdeka Timur No. 1A, Jakarta Pusat",
      kabupatenKota: "Jakarta Pusat",
      provinsi: "DKI Jakarta",
      kodePos: "10110",
      website: "https://pertamina.com",
      description: "Perusahaan energi nasional Indonesia yang berkomitmen pada pembangunan berkelanjutan melalui program CSR terpadu.",
      nomorNPWP: "01.001.674.1-054.000",
      verificationStatus: VerificationStatus.TERVERIFIKASI,
      verifiedAt: new Date("2024-06-01"),
      members: { create: { userId: companyUser1.id, role: "ADMIN", isActive: true } },
    },
  });

  const orgMandiri = await prisma.organization.create({
    data: {
      name: "PT Bank Mandiri (Persero) Tbk",
      slug: "bank-mandiri",
      type: OrgType.PERUSAHAAN,
      email: "csr@bankmandiri.co.id",
      phone: "021-5299-7777",
      address: "Plaza Mandiri, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta",
      kabupatenKota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
      kodePos: "12190",
      website: "https://bankmandiri.co.id",
      description: "Bank terbesar di Indonesia yang memiliki program Wirausaha Muda Mandiri dan berbagai inisiatif CSR sosial-ekonomi.",
      nomorNPWP: "01.001.978.5-000.000",
      verificationStatus: VerificationStatus.TERVERIFIKASI,
      verifiedAt: new Date("2024-06-15"),
      members: { create: { userId: companyUser2.id, role: "ADMIN", isActive: true } },
    },
  });

  const orgTelkom = await prisma.organization.create({
    data: {
      name: "PT Telkom Indonesia (Persero) Tbk",
      slug: "telkom-indonesia",
      type: OrgType.PERUSAHAAN,
      email: "csrtelkom@telkom.co.id",
      phone: "021-5006-0000",
      address: "Jl. Japati No. 1, Bandung",
      kabupatenKota: "Bandung",
      provinsi: "Jawa Barat",
      kodePos: "40133",
      website: "https://telkom.co.id",
      description: "BUMN telekomunikasi yang berkomitmen mendorong inklusi digital melalui program Telkom Peduli dan berbagai CSR berkelanjutan.",
      nomorNPWP: "01.000.562.8-093.000",
      verificationStatus: VerificationStatus.TERVERIFIKASI,
      verifiedAt: new Date("2024-07-01"),
      members: { create: { userId: companyUser3.id, role: "ADMIN", isActive: true } },
    },
  });

  const orgCerdas = await prisma.organization.create({
    data: {
      name: "Yayasan Cerdas Nusantara",
      slug: "yayasan-cerdas-nusantara",
      type: OrgType.YAYASAN,
      email: "admin@cerdas-nusantara.org",
      phone: "021-55512345",
      address: "Jl. Pendidikan No. 12, Jakarta Selatan",
      kabupatenKota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
      kodePos: "12560",
      website: "https://cerdas-nusantara.org",
      description: "Yayasan pendidikan yang berfokus pada peningkatan kualitas pendidikan anak-anak di daerah 3T Indonesia sejak 2015.",
      nomorNPWP: "12.345.678.9-012.345",
      verificationStatus: VerificationStatus.TERVERIFIKASI,
      verifiedAt: new Date("2024-08-01"),
      members: { create: { userId: ngoUser1.id, role: "ADMIN", isActive: true } },
    },
  });

  const orgHijau = await prisma.organization.create({
    data: {
      name: "Yayasan Lingkungan Hijau Indonesia",
      slug: "yayasan-lingkungan-hijau",
      type: OrgType.YAYASAN,
      email: "info@lingkunganhijau.org",
      phone: "022-87654321",
      address: "Jl. Raya Bogor No. 45, Bogor",
      kabupatenKota: "Bogor",
      provinsi: "Jawa Barat",
      kodePos: "16151",
      website: "https://lingkunganhijau.org",
      description: "Organisasi lingkungan yang aktif dalam restorasi ekosistem mangrove, penghijauan urban, dan edukasi lingkungan hidup.",
      nomorNPWP: "23.456.789.0-001.000",
      verificationStatus: VerificationStatus.TERVERIFIKASI,
      verifiedAt: new Date("2024-08-15"),
      members: { create: { userId: ngoUser2.id, role: "ADMIN", isActive: true } },
    },
  });

  const orgSehat = await prisma.organization.create({
    data: {
      name: "Perkumpulan Komunitas Sehat Bersama",
      slug: "komunitas-sehat-bersama",
      type: OrgType.KOMUNITAS,
      email: "komunitas@sehatbersama.id",
      phone: "031-22334455",
      address: "Jl. Kesehatan No. 7, Surabaya",
      kabupatenKota: "Surabaya",
      provinsi: "Jawa Timur",
      kodePos: "60174",
      website: "https://sehatbersama.id",
      description: "Komunitas kesehatan masyarakat yang fokus pada peningkatan akses layanan kesehatan dasar di pedesaan Jawa Timur.",
      nomorNPWP: "34.567.890.1-002.000",
      verificationStatus: VerificationStatus.MENUNGGU_REVIEW,
      members: { create: { userId: ngoUser3.id, role: "ADMIN", isActive: true } },
    },
  });

  const orgDigital = await prisma.organization.create({
    data: {
      name: "Komunitas Digital Desa Indonesia",
      slug: "digital-desa-indonesia",
      type: OrgType.KOMUNITAS,
      email: "info@digitaldesa.id",
      phone: "0274-567890",
      address: "Jl. Teknologi No. 22, Yogyakarta",
      kabupatenKota: "Yogyakarta",
      provinsi: "DI Yogyakarta",
      kodePos: "55221",
      website: "https://digitaldesa.id",
      description: "Komunitas teknologi yang bergerak dalam literasi digital dan pemberdayaan UMKM melalui teknologi di desa-desa Indonesia.",
      nomorNPWP: "45.678.901.2-003.000",
      verificationStatus: VerificationStatus.TERVERIFIKASI,
      verifiedAt: new Date("2024-09-01"),
      members: { create: { userId: ngoUser4.id, role: "ADMIN", isActive: true } },
    },
  });

  // ─── Company Profiles ─────────────────────────────────────
  console.log("🏭 Membuat profil perusahaan...");

  await prisma.companyProfile.create({
    data: {
      organizationId: orgPertamina.id,
      industri: "Energi & Minyak & Gas",
      ukuranPerusahaan: "BESAR",
      pendapatanTahunan: "500 Triliun IDR",
      anggaranCSRTahunan: BigInt("500000000000"),
      fokusCSR: [ProposalCategory.LINGKUNGAN_HIDUP, ProposalCategory.PENDIDIKAN, ProposalCategory.KESEHATAN_MASYARAKAT],
      targetSDGs: [SDGCategory.SDG7_ENERGI_BERSIH, SDGCategory.SDG13_PENANGANAN_PERUBAHAN_IKLIM, SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS],
      wilayahFokus: ["DKI Jakarta", "Kalimantan Timur", "Papua", "Riau", "Jawa Tengah"],
      budgetMinimum: BigInt("100000000"),
      budgetMaksimum: BigInt("5000000000"),
      namaPICCSR: "Budi Santoso",
      emailPICCSR: "csr@pertamina-csr.id",
      teleponPICCSR: "0812-3456-7890",
      jabatanPICCSR: "Manager CSR",
    },
  });

  await prisma.companyProfile.create({
    data: {
      organizationId: orgMandiri.id,
      industri: "Perbankan & Keuangan",
      ukuranPerusahaan: "BESAR",
      pendapatanTahunan: "100 Triliun IDR",
      anggaranCSRTahunan: BigInt("200000000000"),
      fokusCSR: [ProposalCategory.EKONOMI_PEMBERDAYAAN, ProposalCategory.PENDIDIKAN, ProposalCategory.TEKNOLOGI_DAN_INOVASI],
      targetSDGs: [SDGCategory.SDG8_PEKERJAAN_LAYAK, SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS, SDGCategory.SDG10_BERKURANGNYA_KESENJANGAN],
      wilayahFokus: ["DKI Jakarta", "Jawa Timur", "Jawa Tengah", "Sulawesi Selatan", "Sumatera Utara"],
      budgetMinimum: BigInt("50000000"),
      budgetMaksimum: BigInt("2000000000"),
      namaPICCSR: "Ratna Dewi",
      emailPICCSR: "csr@mandiri-foundation.id",
      teleponPICCSR: "0813-4567-8901",
      jabatanPICCSR: "Kepala Divisi CSR",
    },
  });

  await prisma.companyProfile.create({
    data: {
      organizationId: orgTelkom.id,
      industri: "Telekomunikasi & Teknologi",
      ukuranPerusahaan: "BESAR",
      pendapatanTahunan: "145 Triliun IDR",
      anggaranCSRTahunan: BigInt("150000000000"),
      fokusCSR: [ProposalCategory.TEKNOLOGI_DAN_INOVASI, ProposalCategory.PENDIDIKAN, ProposalCategory.EKONOMI_PEMBERDAYAAN],
      targetSDGs: [SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS, SDGCategory.SDG8_PEKERJAAN_LAYAK, SDGCategory.SDG9_INDUSTRI_INOVASI],
      wilayahFokus: ["DKI Jakarta", "Jawa Barat", "Kalimantan Timur", "Papua", "Nusa Tenggara Timur"],
      budgetMinimum: BigInt("50000000"),
      budgetMaksimum: BigInt("3000000000"),
      namaPICCSR: "Hendra Wijaya",
      emailPICCSR: "csr@telkom-peduli.id",
      teleponPICCSR: "0814-5678-9012",
      jabatanPICCSR: "Senior Manager CSR",
    },
  });

  // ─── NGO Profiles ─────────────────────────────────────────
  console.log("📋 Membuat profil NGO...");

  await prisma.nGOProfile.create({
    data: {
      organizationId: orgCerdas.id,
      kategoriUtama: [ProposalCategory.PENDIDIKAN, ProposalCategory.KESEHATAN_MASYARAKAT],
      targetSDGs: [SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS, SDGCategory.SDG3_KESEHATAN_BAIK],
      wilayahKerja: ["DKI Jakarta", "Papua", "Nusa Tenggara Timur", "Maluku"],
      jumlahAnggota: 45,
      jumlahRelawan: 250,
      totalBeneficiaries: 25000,
      namaBank: "Bank BNI",
      nomorRekening: "0123456789",
      atasNama: "Yayasan Cerdas Nusantara",
    },
  });

  await prisma.nGOProfile.create({
    data: {
      organizationId: orgHijau.id,
      kategoriUtama: [ProposalCategory.LINGKUNGAN_HIDUP],
      targetSDGs: [SDGCategory.SDG13_PENANGANAN_PERUBAHAN_IKLIM, SDGCategory.SDG15_KEHIDUPAN_DI_DARAT, SDGCategory.SDG14_KEHIDUPAN_BAWAH_LAUT],
      wilayahKerja: ["Jawa Barat", "Jawa Timur", "Kalimantan Timur", "Sulawesi"],
      jumlahAnggota: 60,
      jumlahRelawan: 500,
      totalBeneficiaries: 50000,
      namaBank: "Bank Mandiri",
      nomorRekening: "9876543210",
      atasNama: "Yayasan Lingkungan Hijau Indonesia",
    },
  });

  await prisma.nGOProfile.create({
    data: {
      organizationId: orgDigital.id,
      kategoriUtama: [ProposalCategory.TEKNOLOGI_DAN_INOVASI, ProposalCategory.EKONOMI_PEMBERDAYAAN],
      targetSDGs: [SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS, SDGCategory.SDG8_PEKERJAAN_LAYAK, SDGCategory.SDG9_INDUSTRI_INOVASI],
      wilayahKerja: ["DI Yogyakarta", "Jawa Tengah", "Jawa Timur", "Kalimantan"],
      jumlahAnggota: 30,
      jumlahRelawan: 120,
      totalBeneficiaries: 8500,
      namaBank: "Bank BRI",
      nomorRekening: "1122334455",
      atasNama: "Komunitas Digital Desa Indonesia",
    },
  });

  await prisma.nGOProfile.create({
    data: {
      organizationId: orgSehat.id,
      kategoriUtama: [ProposalCategory.KESEHATAN_MASYARAKAT],
      targetSDGs: [SDGCategory.SDG3_KESEHATAN_BAIK, SDGCategory.SDG6_AIR_BERSIH_SANITASI],
      wilayahKerja: ["Jawa Timur", "Nusa Tenggara Timur"],
      jumlahAnggota: 25,
      jumlahRelawan: 180,
      totalBeneficiaries: 12000,
      namaBank: "Bank BCA",
      nomorRekening: "5566778899",
      atasNama: "Perkumpulan Komunitas Sehat Bersama",
    },
  });

  // ─── Proposals ────────────────────────────────────────────
  console.log("📝 Membuat proposal...");

  const proposal1 = await prisma.proposal.create({
    data: {
      nomor: "CSR-2025-00001",
      title: "Beasiswa SMA untuk 100 Pelajar Kurang Mampu di Papua",
      slug: "beasiswa-sma-papua-2025",
      summary: "Program beasiswa komprehensif mencakup biaya sekolah, buku, seragam, dan biaya hidup selama 3 tahun untuk 100 pelajar SMA berprestasi namun kurang mampu di Papua.",
      description: "Program ini dirancang untuk memberikan akses pendidikan setara kepada 100 pelajar SMA berprestasi dari keluarga prasejahtera di Papua.",
      category: ProposalCategory.PENDIDIKAN,
      sdgTags: [SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS, SDGCategory.SDG10_BERKURANGNYA_KESENJANGAN],
      keywords: ["beasiswa", "pendidikan", "papua", "3T"],
      provinsi: "Papua",
      kabupatenKota: "Jayapura",
      targetBeneficiaries: 100,
      budgetTotal: BigInt("750000000"),
      budgetBreakdown: { biayaSPP: 300000000, biayaBuku: 75000000, biayaSeragam: 50000000, tunjanganHidup: 325000000 },
      startDate: new Date("2025-02-01"),
      endDate: new Date("2027-12-31"),
      durationMonths: 35,
      status: ProposalStatus.DIDANAI,
      organizationId: orgCerdas.id,
      createdById: ngoUser1.id,
      aiCompletionScore: 92,
      aiMatchScore: 89,
      aiRiskScore: 15,
      aiSummary: "Proposal beasiswa komprehensif dengan track record organisasi yang sangat baik.",
      aiTags: ["beasiswa", "pendidikan", "papua", "3T", "pelajar kurang mampu"],
      fundingTarget: BigInt("750000000"),
      fundingSecured: BigInt("750000000"),
      fundingPercentage: 100,
      submittedAt: new Date("2025-01-15"),
      approvedAt: new Date("2025-01-25"),
    },
  });

  await prisma.proposalStatusHistory.createMany({
    data: [
      { proposalId: proposal1.id, toStatus: ProposalStatus.DRAFT, changedBy: ngoUser1.id, changedAt: new Date("2025-01-10") },
      { proposalId: proposal1.id, fromStatus: ProposalStatus.DRAFT, toStatus: ProposalStatus.DIKIRIM, changedBy: ngoUser1.id, changedAt: new Date("2025-01-15") },
      { proposalId: proposal1.id, fromStatus: ProposalStatus.DIKIRIM, toStatus: ProposalStatus.DALAM_REVIEW, changedBy: adminPlatform.id, changedAt: new Date("2025-01-20") },
      { proposalId: proposal1.id, fromStatus: ProposalStatus.DALAM_REVIEW, toStatus: ProposalStatus.DISETUJUI, changedBy: adminPlatform.id, notes: "Proposal lengkap dan layak didanai.", changedAt: new Date("2025-01-25") },
      { proposalId: proposal1.id, fromStatus: ProposalStatus.DISETUJUI, toStatus: ProposalStatus.DIDANAI, changedBy: adminPlatform.id, changedAt: new Date("2025-02-01") },
    ],
  });

  await prisma.proposalMilestone.createMany({
    data: [
      { proposalId: proposal1.id, title: "Rekrutmen & Seleksi Siswa", description: "Proses seleksi 100 pelajar penerima beasiswa", targetDate: new Date("2025-02-28"), isCompleted: true, completedAt: new Date("2025-02-25"), orderIndex: 1 },
      { proposalId: proposal1.id, title: "Penyaluran Dana Semester 1", description: "Distribusi beasiswa semester ganjil 2025", targetDate: new Date("2025-03-15"), isCompleted: true, completedAt: new Date("2025-03-10"), orderIndex: 2 },
      { proposalId: proposal1.id, title: "Monitoring Akademik Q1", description: "Evaluasi nilai dan kehadiran siswa triwulan 1", targetDate: new Date("2025-05-31"), isCompleted: false, orderIndex: 3 },
      { proposalId: proposal1.id, title: "Penyaluran Dana Semester 2", description: "Distribusi beasiswa semester genap 2025", targetDate: new Date("2025-08-01"), isCompleted: false, orderIndex: 4 },
      { proposalId: proposal1.id, title: "Evaluasi Tahunan", description: "Laporan dampak program tahun pertama", targetDate: new Date("2025-12-15"), isCompleted: false, orderIndex: 5 },
    ],
  });

  const proposal2 = await prisma.proposal.create({
    data: {
      nomor: "CSR-2025-00002",
      title: "Restorasi 300 Hektar Hutan Mangrove di Pesisir Kalimantan Timur",
      slug: "restorasi-mangrove-kaltim-2025",
      summary: "Program restorasi ekosistem mangrove skala besar di 5 titik pesisir Kalimantan Timur untuk mitigasi perubahan iklim dan perlindungan biodiversitas laut.",
      description: "Restorasi ekosistem mangrove seluas 300 hektar di Kabupaten Kutai Kartanegara, melibatkan 200 petani lokal dan komunitas pesisir.",
      category: ProposalCategory.LINGKUNGAN_HIDUP,
      sdgTags: [SDGCategory.SDG13_PENANGANAN_PERUBAHAN_IKLIM, SDGCategory.SDG14_KEHIDUPAN_BAWAH_LAUT, SDGCategory.SDG15_KEHIDUPAN_DI_DARAT],
      keywords: ["mangrove", "lingkungan", "kalimantan", "karbon"],
      provinsi: "Kalimantan Timur",
      kabupatenKota: "Samarinda",
      targetBeneficiaries: 5000,
      budgetTotal: BigInt("1200000000"),
      budgetBreakdown: { pengadaanBibit: 400000000, tenagaKerja: 350000000, peralatan: 250000000, monitoring: 200000000 },
      startDate: new Date("2025-03-01"),
      endDate: new Date("2026-02-28"),
      durationMonths: 12,
      status: ProposalStatus.BERJALAN,
      organizationId: orgHijau.id,
      createdById: ngoUser2.id,
      aiCompletionScore: 95,
      aiMatchScore: 92,
      aiRiskScore: 12,
      aiSummary: "Program lingkungan terencana sangat baik dengan metodologi proven. Carbon credit potential tinggi.",
      aiTags: ["mangrove", "lingkungan", "kalimantan", "karbon", "biodiversitas"],
      fundingTarget: BigInt("1200000000"),
      fundingSecured: BigInt("1200000000"),
      fundingPercentage: 100,
      submittedAt: new Date("2025-02-01"),
      approvedAt: new Date("2025-02-15"),
    },
  });

  await prisma.proposalMilestone.createMany({
    data: [
      { proposalId: proposal2.id, title: "Survey & Pemetaan Lahan", targetDate: new Date("2025-03-31"), isCompleted: true, completedAt: new Date("2025-03-28"), orderIndex: 1 },
      { proposalId: proposal2.id, title: "Pengadaan Bibit Mangrove", targetDate: new Date("2025-04-30"), isCompleted: true, completedAt: new Date("2025-04-25"), orderIndex: 2 },
      { proposalId: proposal2.id, title: "Penanaman Fase 1 (100 Ha)", targetDate: new Date("2025-06-30"), isCompleted: false, orderIndex: 3 },
      { proposalId: proposal2.id, title: "Monitoring Pertumbuhan", targetDate: new Date("2025-09-30"), isCompleted: false, orderIndex: 4 },
      { proposalId: proposal2.id, title: "Penanaman Fase 2 (200 Ha)", targetDate: new Date("2025-12-31"), isCompleted: false, orderIndex: 5 },
      { proposalId: proposal2.id, title: "Laporan Akhir & Impact Assessment", targetDate: new Date("2026-02-15"), isCompleted: false, orderIndex: 6 },
    ],
  });

  const proposal3 = await prisma.proposal.create({
    data: {
      nomor: "CSR-2025-00003",
      title: "Pembangunan 25 Sumur Bor & Instalasi Air Bersih di NTT",
      slug: "air-bersih-ntt-2025",
      summary: "Pembangunan infrastruktur air bersih melalui 25 sumur bor artesis dan jaringan distribusi untuk 15.000 penduduk di 25 desa terpencil NTT.",
      description: "Program akses air bersih terpadu mencakup pembangunan sumur bor, instalasi pompa tenaga surya, dan pelatihan pengelolaan air bagi masyarakat desa.",
      category: ProposalCategory.KESEHATAN_MASYARAKAT,
      sdgTags: [SDGCategory.SDG6_AIR_BERSIH_SANITASI, SDGCategory.SDG3_KESEHATAN_BAIK],
      keywords: ["air bersih", "NTT", "infrastruktur", "kesehatan"],
      provinsi: "Nusa Tenggara Timur",
      kabupatenKota: "Kupang",
      targetBeneficiaries: 15000,
      budgetTotal: BigInt("2500000000"),
      budgetBreakdown: { pembangunanSumur: 1500000000, instalasiPompa: 600000000, pelatihan: 200000000, monitoring: 200000000 },
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-03-31"),
      durationMonths: 12,
      status: ProposalStatus.DISETUJUI,
      organizationId: orgSehat.id,
      createdById: ngoUser3.id,
      aiCompletionScore: 88,
      aiMatchScore: 85,
      aiRiskScore: 20,
      aiSummary: "Program infrastruktur air bersih dengan dampak langsung sangat tinggi.",
      aiTags: ["air bersih", "NTT", "infrastruktur", "kesehatan", "3T"],
      fundingTarget: BigInt("2500000000"),
      fundingSecured: BigInt("1000000000"),
      fundingPercentage: 40,
      submittedAt: new Date("2025-03-01"),
      approvedAt: new Date("2025-03-20"),
    },
  });

  const proposal4 = await prisma.proposal.create({
    data: {
      nomor: "CSR-2025-00004",
      title: "Pelatihan Literasi Digital & E-Commerce 500 UMKM Yogyakarta",
      slug: "literasi-digital-umkm-jogja-2025",
      summary: "Program pelatihan komprehensif digital marketing, e-commerce, dan manajemen keuangan digital untuk 500 pelaku UMKM di Yogyakarta.",
      description: "Memperkuat kapasitas digital 500 UMKM melalui pelatihan intensif: pembuatan toko online, manajemen media sosial, digital payment, dan analitik bisnis.",
      category: ProposalCategory.TEKNOLOGI_DAN_INOVASI,
      sdgTags: [SDGCategory.SDG8_PEKERJAAN_LAYAK, SDGCategory.SDG9_INDUSTRI_INOVASI, SDGCategory.SDG4_PENDIDIKAN_BERKUALITAS],
      keywords: ["UMKM", "digital", "e-commerce", "Yogyakarta"],
      provinsi: "DI Yogyakarta",
      kabupatenKota: "Yogyakarta",
      targetBeneficiaries: 500,
      budgetTotal: BigInt("650000000"),
      budgetBreakdown: { fasilitatorPelatihan: 300000000, materialPeralatan: 150000000, sewa: 100000000, lainnya: 100000000 },
      startDate: new Date("2025-05-01"),
      endDate: new Date("2025-10-31"),
      durationMonths: 6,
      status: ProposalStatus.DALAM_REVIEW,
      organizationId: orgDigital.id,
      createdById: ngoUser4.id,
      aiCompletionScore: 91,
      aiMatchScore: 87,
      aiRiskScore: 10,
      aiSummary: "Proposal pelatihan digital dengan target terukur dan metodologi terbukti. ROI tinggi.",
      aiTags: ["UMKM", "digital", "e-commerce", "Yogyakarta", "pemberdayaan ekonomi"],
      fundingTarget: BigInt("650000000"),
      fundingSecured: BigInt("0"),
      fundingPercentage: 0,
      submittedAt: new Date("2025-04-01"),
    },
  });

  const proposal5 = await prisma.proposal.create({
    data: {
      nomor: "CSR-2025-00005",
      title: "Program Posyandu Terpadu 50 Desa Terpencil Jawa Timur",
      slug: "posyandu-terpadu-jatim-2025",
      summary: "Revitalisasi 50 posyandu desa dengan peralatan kesehatan modern, pelatihan kader, dan sistem pencatatan digital untuk meningkatkan layanan kesehatan ibu dan anak.",
      description: "Program revitalisasi posyandu komprehensif di 50 desa terpencil Jawa Timur mencakup pengadaan alat kesehatan, pelatihan kader posyandu, dan digitalisasi pencatatan.",
      category: ProposalCategory.KESEHATAN_MASYARAKAT,
      sdgTags: [SDGCategory.SDG3_KESEHATAN_BAIK, SDGCategory.SDG5_KESETARAAN_GENDER],
      keywords: ["posyandu", "kesehatan", "jawa timur", "ibu anak"],
      provinsi: "Jawa Timur",
      kabupatenKota: "Surabaya",
      targetBeneficiaries: 25000,
      budgetTotal: BigInt("800000000"),
      budgetBreakdown: { peralatanKesehatan: 400000000, pelatihanKader: 200000000, sistemDigital: 100000000, operasional: 100000000 },
      startDate: new Date("2025-06-01"),
      endDate: new Date("2026-05-31"),
      durationMonths: 12,
      status: ProposalStatus.DIKIRIM,
      organizationId: orgSehat.id,
      createdById: ngoUser3.id,
      aiCompletionScore: 82,
      aiMatchScore: 78,
      aiRiskScore: 22,
      aiSummary: "Program kesehatan preventif dengan jangkauan luas. Kapasitas organisasi perlu divalidasi.",
      aiTags: ["posyandu", "kesehatan ibu anak", "jawa timur", "preventif"],
      fundingTarget: BigInt("800000000"),
      fundingSecured: BigInt("0"),
      fundingPercentage: 0,
      submittedAt: new Date("2025-05-01"),
    },
  });

  // ─── Projects ─────────────────────────────────────────────
  console.log("🚀 Membuat proyek...");

  const project1 = await prisma.project.create({
    data: {
      kodeProyek: "PRJ-2025-00001",
      proposalId: proposal1.id,
      name: "Beasiswa SMA Papua 2025",
      status: ProjectStatus.BERJALAN,
      anggaranTotal: BigInt("750000000"),
      realisasiAnggaran: BigInt("225000000"),
      progressFisik: 30,
      progressKeuangan: 30,
      startDate: new Date("2025-02-01"),
      endDate: new Date("2027-12-31"),
      picNama: "Siti Rahayu",
      picEmail: "ketua@yayasan-cerdas.org",
      picTelepon: "0812-9876-5432",
      lastMonitoringAt: new Date("2025-03-31"),
    },
  });

  await prisma.projectMilestone.createMany({
    data: [
      { projectId: project1.id, title: "Rekrutmen & Seleksi Siswa", targetDate: new Date("2025-02-28"), isCompleted: true, completedAt: new Date("2025-02-25"), orderIndex: 1, progressPct: 100 },
      { projectId: project1.id, title: "Penyaluran Dana Semester 1", targetDate: new Date("2025-03-15"), isCompleted: true, completedAt: new Date("2025-03-10"), orderIndex: 2, progressPct: 100 },
      { projectId: project1.id, title: "Monitoring Akademik Q1", targetDate: new Date("2025-05-31"), isCompleted: false, orderIndex: 3, progressPct: 60 },
      { projectId: project1.id, title: "Penyaluran Dana Semester 2", targetDate: new Date("2025-08-01"), isCompleted: false, orderIndex: 4, progressPct: 0 },
      { projectId: project1.id, title: "Evaluasi Tahunan 2025", targetDate: new Date("2025-12-15"), isCompleted: false, orderIndex: 5, progressPct: 0 },
    ],
  });

  const project2 = await prisma.project.create({
    data: {
      kodeProyek: "PRJ-2025-00002",
      proposalId: proposal2.id,
      name: "Restorasi Mangrove Kalimantan 2025",
      status: ProjectStatus.BERJALAN,
      anggaranTotal: BigInt("1200000000"),
      realisasiAnggaran: BigInt("480000000"),
      progressFisik: 40,
      progressKeuangan: 40,
      startDate: new Date("2025-03-01"),
      endDate: new Date("2026-02-28"),
      picNama: "Dr. Bambang Priyatno",
      picEmail: "direktur@lingkunganhijau.org",
      picTelepon: "0811-2345-6789",
      lastMonitoringAt: new Date("2025-03-31"),
    },
  });

  await prisma.projectMilestone.createMany({
    data: [
      { projectId: project2.id, title: "Survey & Pemetaan Lahan", targetDate: new Date("2025-03-31"), isCompleted: true, completedAt: new Date("2025-03-28"), orderIndex: 1, progressPct: 100 },
      { projectId: project2.id, title: "Pengadaan Bibit Mangrove", targetDate: new Date("2025-04-30"), isCompleted: true, completedAt: new Date("2025-04-25"), orderIndex: 2, progressPct: 100 },
      { projectId: project2.id, title: "Penanaman Fase 1 (100 Ha)", targetDate: new Date("2025-06-30"), isCompleted: false, orderIndex: 3, progressPct: 45 },
      { projectId: project2.id, title: "Monitoring Pertumbuhan", targetDate: new Date("2025-09-30"), isCompleted: false, orderIndex: 4, progressPct: 0 },
      { projectId: project2.id, title: "Penanaman Fase 2 (200 Ha)", targetDate: new Date("2025-12-31"), isCompleted: false, orderIndex: 5, progressPct: 0 },
    ],
  });

  // ─── Funding Commitments ──────────────────────────────────
  console.log("💰 Membuat komitmen pendanaan...");

  await prisma.fundingCommitment.create({
    data: {
      proposalId: proposal1.id,
      companyOrgId: orgPertamina.id,
      amount: BigInt("500000000"),
      status: FundingStatus.DICAIRKAN,
      notes: "Dana beasiswa penuh untuk 100 pelajar Papua selama 3 tahun",
      confirmedAt: new Date("2025-01-28"),
      disbursedAt: new Date("2025-02-05"),
    },
  });

  await prisma.fundingCommitment.create({
    data: {
      proposalId: proposal1.id,
      companyOrgId: orgMandiri.id,
      amount: BigInt("250000000"),
      status: FundingStatus.DICAIRKAN,
      notes: "Co-funding program beasiswa Papua",
      confirmedAt: new Date("2025-01-30"),
      disbursedAt: new Date("2025-02-07"),
    },
  });

  await prisma.fundingCommitment.create({
    data: {
      proposalId: proposal2.id,
      companyOrgId: orgPertamina.id,
      amount: BigInt("700000000"),
      status: FundingStatus.DIKONFIRMASI,
      notes: "Pendanaan utama restorasi mangrove Kalimantan",
      confirmedAt: new Date("2025-02-20"),
    },
  });

  await prisma.fundingCommitment.create({
    data: {
      proposalId: proposal2.id,
      companyOrgId: orgTelkom.id,
      amount: BigInt("500000000"),
      status: FundingStatus.DIKONFIRMASI,
      notes: "Co-funding program lingkungan hidup",
      confirmedAt: new Date("2025-02-22"),
    },
  });

  await prisma.fundingCommitment.create({
    data: {
      proposalId: proposal3.id,
      companyOrgId: orgMandiri.id,
      amount: BigInt("1000000000"),
      status: FundingStatus.DIKONFIRMASI,
      notes: "Pendanaan program air bersih NTT",
      confirmedAt: new Date("2025-03-25"),
    },
  });

  // ─── Notifications ────────────────────────────────────────
  console.log("🔔 Membuat notifikasi...");

  await prisma.notification.createMany({
    data: [
      {
        userId: ngoUser1.id,
        type: "PROPOSAL_DIDANAI",
        title: "Proposal Anda Telah Didanai!",
        message: "Selamat! Proposal 'Beasiswa SMA Papua' telah mendapatkan pendanaan penuh sebesar Rp 750.000.000.",
        isRead: false,
        actionUrl: "/pengusul/proposal/CSR-2025-00001",
      },
      {
        userId: ngoUser2.id,
        type: "PROYEK_UPDATE",
        title: "Update Proyek Mangrove",
        message: "Laporan progress proyek Restorasi Mangrove Kalimantan bulan Maret telah diverifikasi.",
        isRead: true,
        readAt: new Date("2025-04-02"),
        actionUrl: "/pengusul/proyek/PRJ-2025-00002",
      },
      {
        userId: companyUser1.id,
        type: "PROPOSAL_DISETUJUI",
        title: "Proposal Mitra Disetujui",
        message: "Proposal 'Beasiswa SMA Papua' yang Anda dukung telah disetujui dan mulai berjalan.",
        isRead: false,
        actionUrl: "/perusahaan/proyek",
      },
      {
        userId: ngoUser3.id,
        type: "PROPOSAL_DISETUJUI",
        title: "Proposal Disetujui",
        message: "Proposal 'Pembangunan Sumur Bor NTT' telah disetujui oleh admin platform.",
        isRead: false,
        actionUrl: "/pengusul/proposal/CSR-2025-00003",
      },
      {
        userId: adminPlatform.id,
        type: "VERIFIKASI_DIAJUKAN",
        title: "Pengajuan Verifikasi Baru",
        message: "Komunitas Sehat Bersama mengajukan verifikasi organisasi. Segera lakukan review.",
        isRead: false,
        actionUrl: "/admin/verifikasi",
      },
    ],
  });

  // ─── Audit Logs ───────────────────────────────────────────
  console.log("📊 Membuat audit log...");

  await prisma.auditLog.createMany({
    data: [
      {
        userId: ngoUser1.id,
        action: "CREATE",
        resource: "proposals",
        resourceId: proposal1.id,
        newValue: { nomor: "CSR-2025-00001", title: "Beasiswa SMA Papua" },
        ipAddress: "180.247.100.1",
      },
      {
        userId: adminPlatform.id,
        action: "APPROVE",
        resource: "proposals",
        resourceId: proposal1.id,
        newValue: { status: "DISETUJUI" },
        ipAddress: "125.160.50.1",
      },
      {
        userId: companyUser1.id,
        action: "CREATE",
        resource: "funding_commitments",
        resourceId: orgPertamina.id,
        newValue: { amount: "500000000", proposalId: proposal1.id },
        ipAddress: "103.147.8.1",
      },
      {
        userId: superAdmin.id,
        action: "LOGIN",
        resource: "users",
        resourceId: superAdmin.id,
        ipAddress: "127.0.0.1",
      },
    ],
  });

  console.log("✅ Seed selesai!");
  console.log("\n📋 Akun demo (semua pakai password: Password123!):");
  console.log("  superadmin@csrhub.id       → Super Admin");
  console.log("  admin@csrhub.id            → Admin Platform");
  console.log("  verifikator@csrhub.id      → Verifikator");
  console.log("  auditor@csrhub.id          → Auditor");
  console.log("  csr@pertamina-csr.id       → Perusahaan (Pertamina)");
  console.log("  csr@mandiri-foundation.id  → Perusahaan (Mandiri)");
  console.log("  csr@telkom-peduli.id       → Perusahaan (Telkom)");
  console.log("  ketua@yayasan-cerdas.org   → Pengusul (NGO)");
  console.log("  direktur@lingkunganhijau.org → Pengusul (NGO)");
  console.log("  pimpinan@komunitas-sehat.org → Pengusul (Komunitas)");
  console.log("  direktur@digitaldesa.id    → Pengusul (Komunitas)");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
