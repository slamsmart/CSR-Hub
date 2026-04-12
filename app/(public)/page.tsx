import React from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Star, TrendingUp, Users, DollarSign,
  Building2, ShieldCheck, BarChart3, Globe2, Zap, Award,
  FileText, Search, HandHeart, LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

// Statistik impact nasional
const STATS = [
  { label: "Proposal Aktif", value: "2.847", icon: FileText, color: "text-brand-600", bg: "bg-brand-50" },
  { label: "Dana Tersalurkan", value: "Rp 189M", icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Penerima Manfaat", value: "1,2 Juta", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Perusahaan Mitra", value: "347", icon: Building2, color: "text-amber-600", bg: "bg-amber-50" },
];

const FEATURES = [
  {
    icon: Search,
    title: "Smart Matching AI",
    description:
      "Teknologi AI kami mencocokkan proposal dengan perusahaan yang paling relevan berdasarkan fokus CSR, wilayah, SDGs, dan kapasitas pendanaan.",
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi Terstandar",
    description:
      "Semua organisasi melalui proses KYC/KYB ketat. Badge verifikasi membangun kepercayaan antara pengusul dan perusahaan.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: BarChart3,
    title: "Monitoring Real-time",
    description:
      "Pantau progres proyek, penggunaan dana, dan dampak nyata secara real-time dengan dashboard monitoring yang komprehensif.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: HandHeart,
    title: "Co-Funding",
    description:
      "Program besar bisa didanai bersama oleh multiple perusahaan. Kolaborasi CSR lintas perusahaan untuk dampak yang lebih luas.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Globe2,
    title: "SDGs Aligned",
    description:
      "Setiap program diklasifikasikan berdasarkan 17 SDGs PBB untuk memastikan kontribusi terhadap tujuan pembangunan berkelanjutan.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Award,
    title: "Sustainability Report",
    description:
      "Laporan keberlanjutan otomatis untuk perusahaan dengan visualisasi KPI CSR, dampak per kategori, dan alignment SDGs.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Daftar & Verifikasi",
    description: "Daftar sebagai perusahaan atau organisasi. Lengkapi profil dan dokumen legalitas untuk verifikasi.",
    forRole: "Semua Pengguna",
  },
  {
    step: "02",
    title: "Buat atau Temukan Proposal",
    description: "Pengusul membuat proposal terstandar. Perusahaan browsing dan temukan program CSR yang sesuai.",
    forRole: "Pengusul & Perusahaan",
  },
  {
    step: "03",
    title: "Review & Seleksi",
    description: "Perusahaan meninjau proposal, shortlist kandidat, dan memilih program yang paling impactful.",
    forRole: "Perusahaan",
  },
  {
    step: "04",
    title: "Pendanaan & Monitoring",
    description: "Dana disalurkan, proyek dimulai. Monitoring real-time memastikan transparansi dan akuntabilitas.",
    forRole: "Semua Pihak",
  },
];

const SDG_EXAMPLES = [
  { sdg: "SDG 4", label: "Pendidikan", color: "bg-red-500" },
  { sdg: "SDG 3", label: "Kesehatan", color: "bg-green-500" },
  { sdg: "SDG 8", label: "Pekerjaan Layak", color: "bg-amber-500" },
  { sdg: "SDG 13", label: "Iklim", color: "bg-teal-500" },
  { sdg: "SDG 1", label: "Tanpa Kemiskinan", color: "bg-red-600" },
  { sdg: "SDG 5", label: "Gender", color: "bg-orange-500" },
];

const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    role: "CSR Manager",
    company: "PT Maju Bersama Tbk",
    content:
      "CSR Hub memudahkan kami menemukan program CSR yang benar-benar sesuai dengan fokus perusahaan. AI matching-nya sangat akurat dan menghemat waktu seleksi kami.",
    rating: 5,
  },
  {
    name: "Siti Rahayu",
    role: "Direktur Eksekutif",
    company: "Yayasan Peduli Anak Bangsa",
    content:
      "Proses pengajuan proposal jadi jauh lebih terstruktur. Fitur monitoring real-time membuat laporan pertanggungjawaban kami lebih mudah dan transparan.",
    rating: 5,
  },
  {
    name: "Ahmad Fauzi",
    role: "Founder",
    company: "Komunitas Hijau Nusantara",
    content:
      "Badge verifikasi membuat kepercayaan perusahaan kepada kami meningkat drastis. Kami mendapat pendanaan dalam 3 minggu setelah proposal dikirim.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative gradient-hero min-h-screen flex items-center pt-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-brand-300" />
                <span>Platform CSR #1 di Indonesia</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Wujudkan
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-300">
                  Dampak Sosial
                </span>
                Nyata Bersama
              </h1>

              <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                Platform marketplace CSR terpercaya yang menghubungkan perusahaan dengan
                NGO, komunitas, dan organisasi sosial untuk kolaborasi program CSR yang
                berdampak, transparan, dan terukur.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register?role=PERUSAHAAN">
                  <Button size="lg" variant="brand" className="w-full sm:w-auto gap-2">
                    Saya Perusahaan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register?role=PENGUSUL">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/40 text-white bg-transparent hover:bg-white/15 hover:text-white gap-2"
                  >
                    Ajukan Program CSR
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-300" />
                  <span className="text-sm text-white/70">Terverifikasi & Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-300" />
                  <span className="text-sm text-white/70">Gratis untuk Pengusul</span>
                </div>
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-6 bg-white border border-white/80 shadow-lg"
                  >
                    <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold font-display text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SDG Tags */}
          <div className="mt-16 flex flex-wrap gap-3 justify-center">
            <span className="text-white/50 text-sm self-center mr-2">Berkontribusi pada:</span>
            {SDG_EXAMPLES.map((sdg) => (
              <span
                key={sdg.sdg}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm"
              >
                <span className={`h-2 w-2 rounded-full ${sdg.color}`} />
                {sdg.sdg}: {sdg.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT COUNTER SECTION */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "Rp 189M+", label: "Total Dana Tersalurkan", sub: "sejak 2022" },
              { value: "2.847", label: "Proposal Disetujui", sub: "dari 34 provinsi" },
              { value: "1,2 Juta+", label: "Penerima Manfaat", sub: "di seluruh Indonesia" },
              { value: "94%", label: "Tingkat Keberhasilan", sub: "proyek selesai" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold font-display text-brand-600">
                  {item.value}
                </p>
                <p className="font-medium text-foreground mt-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="brand" className="mb-4">Fitur Unggulan</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Platform CSR yang Lengkap & Terpercaya
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Dari pengajuan proposal hingga pelaporan dampak, semua kebutuhan CSR
              tersedia dalam satu platform terintegrasi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="teal" className="mb-4">Cara Kerja</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Mudah, Transparan, Terukur
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} className="relative">
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-200 to-teal-200 -translate-y-0.5 z-0" />
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand text-white font-bold text-xl font-display mb-4 shadow-lg">
                    {step.step}
                  </div>
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {step.forRole}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">Testimoni</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Dipercaya oleh Ratusan Mitra
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t pt-4">
                    <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                      {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Mulai Perjalanan CSR Anda Hari Ini
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Bergabung dengan 347+ perusahaan dan 2.000+ organisasi sosial yang telah
            menciptakan dampak nyata bagi jutaan masyarakat Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=PERUSAHAAN">
              <Button size="xl" variant="brand" className="gap-2 w-full sm:w-auto">
                <Building2 className="h-5 w-5" />
                Daftar sebagai Perusahaan
              </Button>
            </Link>
            <Link href="/register?role=PENGUSUL">
              <Button
                size="xl"
                className="gap-2 w-full sm:w-auto bg-white text-brand-700 hover:bg-white/90"
              >
                <Users className="h-5 w-5" />
                Ajukan Program CSR
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/60 text-sm">
            Gratis untuk semua organisasi sosial · Tidak perlu kartu kredit
          </p>
        </div>
      </section>
    </div>
  );
}
