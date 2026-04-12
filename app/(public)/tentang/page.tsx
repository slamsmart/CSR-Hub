import React from "react";
import Link from "next/link";
import {
  Shield, Users, TrendingUp, Award, CheckCircle2, DollarSign,
  Building2, Heart, Globe2, Target, Layers, ArrowRight,
  ClipboardCheck, Banknote, BarChart3, HandHeart, Star,
  AlertCircle, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Tentang CSR Hub",
  description: "Platform marketplace CSR nasional yang menghubungkan perusahaan dengan organisasi sosial. Kenali visi, misi, model bisnis, dan tim di balik CSR Hub.",
};

const TEAM = [
  { name: "Ahmad Fadhil", role: "Co-Founder & CEO", bg: "bg-brand-100", initial: "AF" },
  { name: "Sari Wijayanti", role: "Co-Founder & CTO", bg: "bg-teal-100", initial: "SW" },
  { name: "Rizky Pratama", role: "Head of Operations", bg: "bg-blue-100", initial: "RP" },
  { name: "Dina Kusuma", role: "Head of Verification", bg: "bg-amber-100", initial: "DK" },
  { name: "Bima Nugraha", role: "Lead Engineer", bg: "bg-purple-100", initial: "BN" },
  { name: "Fitri Handayani", role: "Community Manager", bg: "bg-rose-100", initial: "FH" },
];

const MILESTONES = [
  { year: "2022", title: "Ide & Riset", desc: "Riset mendalam tentang gap antara CSR perusahaan dan organisasi sosial di Indonesia." },
  { year: "2023", title: "Prototype & Pilot", desc: "Uji coba platform dengan 12 perusahaan dan 45 NGO di Jabodetabek." },
  { year: "2024 Q1", title: "Beta Launch", desc: "Peluncuran beta nasional. 100+ organisasi bergabung dalam 3 bulan pertama." },
  { year: "2024 Q3", title: "Scale Up", desc: "Ekspansi ke 15 provinsi. Integrasi AI matching dan dashboard analytics." },
  { year: "2025", title: "Platform Penuh", desc: "Peluncuran fitur co-funding, sustainability report otomatis, dan API publik." },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-teal-400 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
            Tentang Kami
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Menghubungkan Niat Baik<br />dengan Dampak Nyata
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            CSR Hub adalah platform marketplace CSR nasional yang mempertemukan perusahaan berkeinginan berbuat baik
            dengan organisasi sosial yang siap memberikan dampak terukur bagi masyarakat Indonesia.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/cara-kerja">
              <Button className="bg-white text-brand-800 hover:bg-white/90 gap-2">
                Cara Kerja Platform <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                Bergabung Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Perusahaan Mitra", value: "347+", icon: Building2, color: "text-brand-600" },
            { label: "Organisasi Sosial", value: "1.200+", icon: Heart, color: "text-rose-600" },
            { label: "Dana Tersalurkan", value: "Rp 189M+", icon: DollarSign, color: "text-teal-600" },
            { label: "Penerima Manfaat", value: "1,2 Juta", icon: Users, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label}>
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-50 to-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Visi</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi infrastruktur digital terdepan bagi ekosistem CSR Indonesia yang transparan, terukur,
                  dan berdampak nyata — mendorong Indonesia menuju pencapaian SDGs 2030.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                  <Globe2 className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Misi</h2>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {[
                    "Mempermudah akses pendanaan CSR bagi organisasi sosial terverifikasi",
                    "Meningkatkan transparansi dan akuntabilitas penggunaan dana CSR",
                    "Menghubungkan kebutuhan sosial dengan kapasitas korporat secara efisien",
                    "Menghasilkan data dampak sosial yang valid dan terstandar nasional",
                  ].map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Model Bisnis */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200">Model Bisnis</Badge>
            <h2 className="text-3xl font-bold mb-3">Bagaimana CSR Hub Beroperasi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform yang self-sustainable dengan model fee transparan — semua pihak mendapat nilai,
              tidak ada biaya tersembunyi.
            </p>
          </div>

          {/* Revenue Streams */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 border-brand-200 bg-brand-50/50">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center mb-3">
                  <Banknote className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-semibold mb-1">Fee Manajemen Proyek</h3>
                <div className="text-2xl font-bold text-brand-600 mb-2">3–5%</div>
                <p className="text-sm text-muted-foreground">
                  Dipotong otomatis dari total nilai proposal yang berhasil didanai.
                  Digunakan untuk biaya operasional platform, tim verifikator lapangan, dan monitoring proyek.
                </p>
                <div className="mt-3 pt-3 border-t border-brand-200">
                  <p className="text-xs text-brand-700 font-medium">Contoh: Proposal Rp 500 juta → fee Rp 15–25 juta</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-200 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-1">Langganan Premium</h3>
                <div className="text-2xl font-bold text-teal-600 mb-2">Opsional</div>
                <p className="text-sm text-muted-foreground">
                  Perusahaan bisa berlangganan paket premium untuk fitur lanjutan: AI matching prioritas,
                  dashboard analytics mendalam, dan laporan sustainability otomatis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Data & Insights</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">B2G / B2B</div>
                <p className="text-sm text-muted-foreground">
                  Agregat data dampak CSR nasional untuk kebutuhan pemerintah, lembaga riset,
                  dan konsultan keberlanjutan. Data anonim dan terstandar.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-8 border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-600" />
              Alokasi Fee Manajemen 3–5%
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { label: "Tim Verifikator Lapangan", pct: "40%", desc: "Verifikator teknis yang turun ke lokasi proyek", color: "bg-brand-500" },
                  { label: "Operasional Platform", pct: "25%", desc: "Server, keamanan data, pengembangan fitur", color: "bg-teal-500" },
                  { label: "Tim Monitoring & Audit", pct: "20%", desc: "Pemantauan progres dan audit keuangan proyek", color: "bg-blue-500" },
                  { label: "Cadangan & R&D", pct: "15%", desc: "Dana cadangan dan pengembangan platform", color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{item.label}</span>
                        <span className="text-sm font-bold text-foreground">{item.pct}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 border flex flex-col justify-center">
                <div className="text-center mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Simulasi Fee</div>
                  <div className="text-3xl font-bold text-brand-600">4% rata-rata</div>
                  <div className="text-sm text-muted-foreground">dari nilai proyek yang berhasil</div>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { nilai: "Rp 100 juta", fee: "Rp 4 juta" },
                    { nilai: "Rp 500 juta", fee: "Rp 20 juta" },
                    { nilai: "Rp 1 miliar", fee: "Rp 40 juta" },
                    { nilai: "Rp 5 miliar", fee: "Rp 200 juta" },
                  ].map((r) => (
                    <div key={r.nilai} className="flex justify-between items-center py-1 border-b last:border-0">
                      <span className="text-muted-foreground">{r.nilai}</span>
                      <span className="font-semibold text-brand-600">{r.fee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mekanisme Pencairan Dana */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">Mekanisme Pencairan Dana</Badge>
            <h2 className="text-3xl font-bold mb-3">Sistem Escrow Milestone-Based</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Dana tidak langsung diserahkan ke NGO. Platform menjadi trusted intermediary dengan
              sistem pencairan bertahap berdasarkan verifikasi milestone lapangan.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              {
                step: "1",
                title: "Dana Masuk Escrow",
                desc: "Perusahaan transfer dana ke rekening virtual escrow CSR Hub (Virtual Account BNI/Mandiri/BRI)",
                icon: Lock,
                color: "bg-blue-500",
              },
              {
                step: "2",
                title: "Verifikasi Lapangan",
                desc: "Tim verifikator teknis turun ke lokasi, memvalidasi pelaksanaan dan dokumen pendukung",
                icon: ClipboardCheck,
                color: "bg-teal-500",
              },
              {
                step: "3",
                title: "Persetujuan Berjenjang",
                desc: "Admin platform dan auditor menyetujui laporan milestone sebelum dana dicairkan",
                icon: Shield,
                color: "bg-amber-500",
              },
              {
                step: "4",
                title: "Pencairan Otomatis",
                desc: "Dana milestone dicairkan ke rekening NGO, fee platform dipotong otomatis, bukti transfer dikirim semua pihak",
                icon: Banknote,
                color: "bg-brand-500",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white/10 rounded-xl p-5 border border-white/20">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs font-semibold text-white/50 mb-1">LANGKAH {s.step}</div>
                <h3 className="font-semibold mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Virtual Account Dedicated",
                desc: "Setiap proyek mendapat VA unik. Dana terpisah antar proyek, tidak bercampur.",
                icon: Building2,
              },
              {
                title: "Milestone 20–30%",
                desc: "Pencairan per milestone, maksimal 30% per tahap. Sisa dana tetap di escrow sampai proyek selesai.",
                icon: TrendingUp,
              },
              {
                title: "Audit Trail Lengkap",
                desc: "Setiap transaksi tercatat di blockchain-lite. Perusahaan dan regulator bisa audit kapan saja.",
                icon: Shield,
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <item.icon className="h-5 w-5 text-teal-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai Platform */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-brand-50 text-brand-700 border-brand-200">Mengapa CSR Hub</Badge>
            <h2 className="text-3xl font-bold mb-3">Nilai untuk Semua Pihak</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Untuk Perusahaan",
                color: "border-t-brand-500",
                items: [
                  "Temukan NGO/komunitas terverifikasi sesuai fokus CSR",
                  "AI matching otomatis berdasarkan SDGs & wilayah",
                  "Laporan dampak real-time untuk RUPS & regulasi",
                  "Sustainability report otomatis untuk GRI/POJK 51",
                  "Co-funding dengan perusahaan lain untuk proyek besar",
                ],
              },
              {
                title: "Untuk Pengusul (NGO/Komunitas)",
                color: "border-t-teal-500",
                items: [
                  "Akses ke ratusan perusahaan CSR aktif sekaligus",
                  "Proses pengajuan proposal terstandar & mudah",
                  "Pencairan dana aman via escrow terjamin",
                  "Dashboard monitoring dan pelaporan terintegrasi",
                  "Trust score meningkatkan kredibilitas organisasi",
                ],
              },
              {
                title: "Untuk Ekosistem",
                color: "border-t-amber-500",
                items: [
                  "Data dampak CSR nasional teraggregasi & valid",
                  "Mendorong transparansi dan anti-fraud",
                  "Sinkronisasi dengan target RPJPN dan SDGs",
                  "Ekosistem CSR yang profesional dan terstandar",
                  "Multiplier effect: 1 Rp CSR → 3 Rp nilai sosial",
                ],
              },
            ].map((col) => (
              <Card key={col.title} className={`border-t-4 ${col.color}`}>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-teal-50 text-teal-700 border-teal-200">Perjalanan Kami</Badge>
            <h2 className="text-3xl font-bold">Milestone Platform</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-200" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs text-center leading-tight z-10 flex-shrink-0">
                    {m.year}
                  </div>
                  <div className="bg-white rounded-xl p-5 border flex-1 shadow-sm">
                    <h3 className="font-semibold mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-50 text-purple-700 border-purple-200">Tim Kami</Badge>
            <h2 className="text-3xl font-bold mb-3">Orang-Orang di Balik CSR Hub</h2>
            <p className="text-muted-foreground">Gabungan profesional teknologi, keuangan, dan sosial dengan misi bersama</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM.map((t) => (
              <div key={t.name} className="text-center p-6 rounded-xl border bg-gray-50 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${t.bg} rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold text-gray-700`}>
                  {t.initial}
                </div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-600 to-teal-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Siap Bergabung?</h2>
          <p className="text-white/80 mb-8">
            Jadilah bagian dari ekosistem CSR nasional yang transparan dan berdampak nyata.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register?role=PERUSAHAAN">
              <Button className="bg-white text-brand-700 hover:bg-white/90 gap-2">
                <Building2 className="h-4 w-4" /> Daftar sebagai Perusahaan
              </Button>
            </Link>
            <Link href="/register?role=PENGUSUL">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                <HandHeart className="h-4 w-4" /> Daftar sebagai Pengusul
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
