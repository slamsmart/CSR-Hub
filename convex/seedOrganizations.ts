import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const seedOrganizations = internalMutation({
  args: {
    companyUser1: v.id("users"),
    companyUser2: v.id("users"),
    companyUser3: v.id("users"),
    ngoUser1: v.id("users"),
    ngoUser2: v.id("users"),
    ngoUser3: v.id("users"),
    ngoUser4: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const orgPertamina = await ctx.db.insert("organizations", {
      name: "PT Pertamina (Persero)", slug: "pt-pertamina", type: "PERUSAHAAN",
      email: "csr@pertamina.com", phone: "021-3815111",
      address: "Jl. Medan Merdeka Timur No. 1A, Jakarta Pusat",
      kabupatenKota: "Jakarta Pusat", provinsi: "DKI Jakarta", kodePos: "10110",
      website: "https://pertamina.com",
      description: "Perusahaan energi nasional Indonesia yang berkomitmen pada pembangunan berkelanjutan melalui program CSR terpadu.",
      nomorNPWP: "01.001.674.1-054.000",
      verificationStatus: "TERVERIFIKASI", verifiedAt: now,
      trustScore: 95, isPublic: true, isFeatured: true,
      totalProposals: 0, approvedProposals: 0, totalFundingReceived: 0, totalBeneficiaries: 0, projectSuccessRate: 0,
      updatedAt: now,
    });

    const orgMandiri = await ctx.db.insert("organizations", {
      name: "PT Bank Mandiri (Persero) Tbk", slug: "bank-mandiri", type: "PERUSAHAAN",
      email: "csr@bankmandiri.co.id", phone: "021-5299-7777",
      address: "Plaza Mandiri, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta",
      kabupatenKota: "Jakarta Selatan", provinsi: "DKI Jakarta", kodePos: "12190",
      website: "https://bankmandiri.co.id",
      description: "Bank terbesar di Indonesia dengan program Wirausaha Muda Mandiri dan berbagai inisiatif CSR sosial-ekonomi.",
      nomorNPWP: "01.001.978.5-000.000",
      verificationStatus: "TERVERIFIKASI", verifiedAt: now,
      trustScore: 92, isPublic: true, isFeatured: true,
      totalProposals: 0, approvedProposals: 0, totalFundingReceived: 0, totalBeneficiaries: 0, projectSuccessRate: 0,
      updatedAt: now,
    });

    const orgTelkom = await ctx.db.insert("organizations", {
      name: "PT Telkom Indonesia (Persero) Tbk", slug: "telkom-indonesia", type: "PERUSAHAAN",
      email: "csrtelkom@telkom.co.id", phone: "021-5006-0000",
      address: "Jl. Japati No. 1, Bandung",
      kabupatenKota: "Bandung", provinsi: "Jawa Barat", kodePos: "40133",
      website: "https://telkom.co.id",
      description: "BUMN telekomunikasi yang berkomitmen mendorong inklusi digital melalui program Telkom Peduli.",
      nomorNPWP: "01.000.562.8-093.000",
      verificationStatus: "TERVERIFIKASI", verifiedAt: now,
      trustScore: 90, isPublic: true, isFeatured: true,
      totalProposals: 0, approvedProposals: 0, totalFundingReceived: 0, totalBeneficiaries: 0, projectSuccessRate: 0,
      updatedAt: now,
    });

    const orgCerdas = await ctx.db.insert("organizations", {
      name: "Yayasan Cerdas Nusantara", slug: "yayasan-cerdas-nusantara", type: "YAYASAN",
      email: "admin@cerdas-nusantara.org", phone: "021-55512345",
      address: "Jl. Pendidikan No. 12, Jakarta Selatan",
      kabupatenKota: "Jakarta Selatan", provinsi: "DKI Jakarta", kodePos: "12560",
      website: "https://cerdas-nusantara.org",
      description: "Yayasan pendidikan yang berfokus pada peningkatan kualitas pendidikan anak-anak di daerah 3T Indonesia sejak 2015.",
      nomorNPWP: "12.345.678.9-012.345",
      verificationStatus: "TERVERIFIKASI", verifiedAt: now,
      trustScore: 88, isPublic: true, isFeatured: false,
      totalProposals: 1, approvedProposals: 1, totalFundingReceived: 750000000, totalBeneficiaries: 25000, projectSuccessRate: 100,
      updatedAt: now,
    });

    const orgHijau = await ctx.db.insert("organizations", {
      name: "Yayasan Lingkungan Hijau Indonesia", slug: "yayasan-lingkungan-hijau", type: "YAYASAN",
      email: "info@lingkunganhijau.org", phone: "022-87654321",
      address: "Jl. Raya Bogor No. 45, Bogor",
      kabupatenKota: "Bogor", provinsi: "Jawa Barat", kodePos: "16151",
      website: "https://lingkunganhijau.org",
      description: "Organisasi lingkungan yang aktif dalam restorasi ekosistem mangrove dan edukasi lingkungan hidup.",
      nomorNPWP: "23.456.789.0-001.000",
      verificationStatus: "TERVERIFIKASI", verifiedAt: now,
      trustScore: 91, isPublic: true, isFeatured: true,
      totalProposals: 1, approvedProposals: 1, totalFundingReceived: 1200000000, totalBeneficiaries: 50000, projectSuccessRate: 100,
      updatedAt: now,
    });

    const orgSehat = await ctx.db.insert("organizations", {
      name: "Perkumpulan Komunitas Sehat Bersama", slug: "komunitas-sehat-bersama", type: "KOMUNITAS",
      email: "komunitas@sehatbersama.id", phone: "031-22334455",
      address: "Jl. Kesehatan No. 7, Surabaya",
      kabupatenKota: "Surabaya", provinsi: "Jawa Timur", kodePos: "60174",
      website: "https://sehatbersama.id",
      description: "Komunitas kesehatan masyarakat yang fokus pada peningkatan akses layanan kesehatan dasar di pedesaan Jawa Timur.",
      nomorNPWP: "34.567.890.1-002.000",
      verificationStatus: "MENUNGGU_REVIEW",
      trustScore: 75, isPublic: true, isFeatured: false,
      totalProposals: 2, approvedProposals: 1, totalFundingReceived: 0, totalBeneficiaries: 12000, projectSuccessRate: 0,
      updatedAt: now,
    });

    const orgDigital = await ctx.db.insert("organizations", {
      name: "Komunitas Digital Desa Indonesia", slug: "digital-desa-indonesia", type: "KOMUNITAS",
      email: "info@digitaldesa.id", phone: "0274-567890",
      address: "Jl. Teknologi No. 22, Yogyakarta",
      kabupatenKota: "Yogyakarta", provinsi: "DI Yogyakarta", kodePos: "55221",
      website: "https://digitaldesa.id",
      description: "Komunitas teknologi yang bergerak dalam literasi digital dan pemberdayaan UMKM di desa-desa Indonesia.",
      nomorNPWP: "45.678.901.2-003.000",
      verificationStatus: "TERVERIFIKASI", verifiedAt: now,
      trustScore: 85, isPublic: true, isFeatured: false,
      totalProposals: 1, approvedProposals: 0, totalFundingReceived: 0, totalBeneficiaries: 8500, projectSuccessRate: 0,
      updatedAt: now,
    });

    // Create organization members
    await ctx.db.insert("organizationMembers", { organizationId: orgPertamina, userId: args.companyUser1, role: "ADMIN", isActive: true, joinedAt: now });
    await ctx.db.insert("organizationMembers", { organizationId: orgMandiri, userId: args.companyUser2, role: "ADMIN", isActive: true, joinedAt: now });
    await ctx.db.insert("organizationMembers", { organizationId: orgTelkom, userId: args.companyUser3, role: "ADMIN", isActive: true, joinedAt: now });
    await ctx.db.insert("organizationMembers", { organizationId: orgCerdas, userId: args.ngoUser1, role: "ADMIN", isActive: true, joinedAt: now });
    await ctx.db.insert("organizationMembers", { organizationId: orgHijau, userId: args.ngoUser2, role: "ADMIN", isActive: true, joinedAt: now });
    await ctx.db.insert("organizationMembers", { organizationId: orgSehat, userId: args.ngoUser3, role: "ADMIN", isActive: true, joinedAt: now });
    await ctx.db.insert("organizationMembers", { organizationId: orgDigital, userId: args.ngoUser4, role: "ADMIN", isActive: true, joinedAt: now });

    // Company profiles
    await ctx.db.insert("companyProfiles", {
      organizationId: orgPertamina, industri: "Energi & Minyak & Gas", ukuranPerusahaan: "BESAR",
      pendapatanTahunan: "500 Triliun IDR", anggaranCSRTahunan: 500000000000,
      fokusCSR: ["LINGKUNGAN_HIDUP", "PENDIDIKAN", "KESEHATAN_MASYARAKAT"],
      targetSDGs: ["SDG7_ENERGI_BERSIH", "SDG13_PENANGANAN_PERUBAHAN_IKLIM", "SDG4_PENDIDIKAN_BERKUALITAS"],
      wilayahFokus: ["DKI Jakarta", "Kalimantan Timur", "Papua", "Riau", "Jawa Tengah"],
      budgetMinimum: 100000000, budgetMaksimum: 5000000000,
      namaPICCSR: "Budi Santoso", emailPICCSR: "csr@pertamina-csr.id", teleponPICCSR: "0812-3456-7890", jabatanPICCSR: "Manager CSR",
      updatedAt: now,
    });

    await ctx.db.insert("companyProfiles", {
      organizationId: orgMandiri, industri: "Perbankan & Keuangan", ukuranPerusahaan: "BESAR",
      pendapatanTahunan: "100 Triliun IDR", anggaranCSRTahunan: 200000000000,
      fokusCSR: ["EKONOMI_PEMBERDAYAAN", "PENDIDIKAN", "TEKNOLOGI_DAN_INOVASI"],
      targetSDGs: ["SDG8_PEKERJAAN_LAYAK", "SDG4_PENDIDIKAN_BERKUALITAS", "SDG10_BERKURANGNYA_KESENJANGAN"],
      wilayahFokus: ["DKI Jakarta", "Jawa Timur", "Jawa Tengah", "Sulawesi Selatan", "Sumatera Utara"],
      budgetMinimum: 50000000, budgetMaksimum: 2000000000,
      namaPICCSR: "Ratna Dewi", emailPICCSR: "csr@mandiri-foundation.id", teleponPICCSR: "0813-4567-8901", jabatanPICCSR: "Kepala Divisi CSR",
      updatedAt: now,
    });

    await ctx.db.insert("companyProfiles", {
      organizationId: orgTelkom, industri: "Telekomunikasi & Teknologi", ukuranPerusahaan: "BESAR",
      pendapatanTahunan: "145 Triliun IDR", anggaranCSRTahunan: 150000000000,
      fokusCSR: ["TEKNOLOGI_DAN_INOVASI", "PENDIDIKAN", "EKONOMI_PEMBERDAYAAN"],
      targetSDGs: ["SDG4_PENDIDIKAN_BERKUALITAS", "SDG8_PEKERJAAN_LAYAK", "SDG9_INDUSTRI_INOVASI"],
      wilayahFokus: ["DKI Jakarta", "Jawa Barat", "Kalimantan Timur", "Papua", "Nusa Tenggara Timur"],
      budgetMinimum: 50000000, budgetMaksimum: 3000000000,
      namaPICCSR: "Hendra Wijaya", emailPICCSR: "csr@telkom-peduli.id", teleponPICCSR: "0814-5678-9012", jabatanPICCSR: "Senior Manager CSR",
      updatedAt: now,
    });

    // NGO profiles
    await ctx.db.insert("ngoProfiles", {
      organizationId: orgCerdas, kategoriUtama: ["PENDIDIKAN", "KESEHATAN_MASYARAKAT"],
      targetSDGs: ["SDG4_PENDIDIKAN_BERKUALITAS", "SDG3_KESEHATAN_BAIK"],
      wilayahKerja: ["DKI Jakarta", "Papua", "Nusa Tenggara Timur", "Maluku"],
      jumlahAnggota: 45, jumlahRelawan: 250, totalBeneficiaries: 25000,
      namaBank: "Bank BNI", nomorRekening: "0123456789", atasNama: "Yayasan Cerdas Nusantara", updatedAt: now,
    });

    await ctx.db.insert("ngoProfiles", {
      organizationId: orgHijau, kategoriUtama: ["LINGKUNGAN_HIDUP"],
      targetSDGs: ["SDG13_PENANGANAN_PERUBAHAN_IKLIM", "SDG15_KEHIDUPAN_DI_DARAT", "SDG14_KEHIDUPAN_BAWAH_LAUT"],
      wilayahKerja: ["Jawa Barat", "Jawa Timur", "Kalimantan Timur", "Sulawesi"],
      jumlahAnggota: 60, jumlahRelawan: 500, totalBeneficiaries: 50000,
      namaBank: "Bank Mandiri", nomorRekening: "9876543210", atasNama: "Yayasan Lingkungan Hijau Indonesia", updatedAt: now,
    });

    await ctx.db.insert("ngoProfiles", {
      organizationId: orgDigital, kategoriUtama: ["TEKNOLOGI_DAN_INOVASI", "EKONOMI_PEMBERDAYAAN"],
      targetSDGs: ["SDG4_PENDIDIKAN_BERKUALITAS", "SDG8_PEKERJAAN_LAYAK", "SDG9_INDUSTRI_INOVASI"],
      wilayahKerja: ["DI Yogyakarta", "Jawa Tengah", "Jawa Timur", "Kalimantan"],
      jumlahAnggota: 30, jumlahRelawan: 120, totalBeneficiaries: 8500,
      namaBank: "Bank BRI", nomorRekening: "1122334455", atasNama: "Komunitas Digital Desa Indonesia", updatedAt: now,
    });

    await ctx.db.insert("ngoProfiles", {
      organizationId: orgSehat, kategoriUtama: ["KESEHATAN_MASYARAKAT"],
      targetSDGs: ["SDG3_KESEHATAN_BAIK", "SDG6_AIR_BERSIH_SANITASI"],
      wilayahKerja: ["Jawa Timur", "Nusa Tenggara Timur"],
      jumlahAnggota: 25, jumlahRelawan: 180, totalBeneficiaries: 12000,
      namaBank: "Bank BCA", nomorRekening: "5566778899", atasNama: "Perkumpulan Komunitas Sehat Bersama", updatedAt: now,
    });

    return { orgPertamina, orgMandiri, orgTelkom, orgCerdas, orgHijau, orgSehat, orgDigital };
  },
});
