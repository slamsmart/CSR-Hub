import React from "react";
import Link from "next/link";
import {
  UserPlus, FileText, Search, Handshake, ClipboardCheck,
  Banknote, BarChart3, Award, ArrowRight, CheckCircle2,
  Shield, Lock, AlertCircle, Building2, HandHeart,
  ChevronRight, DollarSign, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Cara Kerja CSR Hub",
  description: "Pelajari alur lengkap platform CSR Hub — dari pendaftaran, pengajuan proposal, matching AI, hingga pencairan dana yang aman via escrow.",
};

const STEPS_NGO = [
  { no: "01", icon: UserPlus, title: "Daftar & Verifikasi Organisasi", desc: "Daftar akun, lengkapi profil organisasi, upload dokumen legal (Akta, NPWP, SK Kemenkumham). Tim verifikator kami memvalidasi dalam 3–5 hari kerja.", color: "bg-teal-500" },
  { no: "02", icon: FileText, title: "Buat & Kirim Proposal", desc: "Isi form proposal terstruktur: deskripsi program, rincian anggaran (RAB), timeline, target penerima manfaat, dan indikator dampak.", color: "bg-brand-500" },
  { no: "03", icon: Search, title: "AI Matching & Review", desc: "AI kami mencocokkan proposal dengan perusahaan yang paling relevan. Admin platform melakukan review kelengkapan dan kelayakan.", color: "bg-blue-500" },
  { no: "04", icon: Handshake, title: "Perusahaan Menyetujui", desc: "Perusahaan yang tertarik memasukkan proposal ke shortlist, berdiskusi via platform, dan mengkonfirmasi komitmen pendanaan.", color: "bg-amber-500" },
  { no: "05", icon: ClipboardCheck, title: "Pelaksanaan & Monitoring", desc: "Proyek berjalan. Kirim laporan bulanan via dashboard. Tim verifikator lapangan memvalidasi progress fisik dan keuangan.", color: "bg-purple-500" },
  { no: "06", icon: Banknote, title: "Pencairan Dana Milestone", desc: "Dana cair per milestone yang sudah diverifikasi. Fee platform (3–5%) dipotong otomatis. Laporan akhir dan sustainability report tersedia.", color: "bg-rose-500" },
];

const STEPS_COMPANY = [
  { no: "01", icon: UserPlus, title: "Daftar & Setup Profil CSR", desc: "Daftar akun perusahaan, isi profil CSR: fokus bidang, target SDGs, wilayah prioritas, dan range anggaran.", color: "bg-brand-500" },
  { no: "02", icon: Search, title: "Terima Rekomendasi AI", desc: "Sistem mengirim rekomendasi proposal yang match secara otomatis sesuai kriteria CSR perusahaan Anda.", color: "bg-teal-500" },
  { no: "03", icon: FileText, title: "Review & Shortlist Proposal", desc: "Telusuri proposal, filter berdasarkan kategori/wilayah/SDGs, baca profil organisasi & track record, masukkan ke shortlist.", color: "bg-blue-500" },
  { no: "04", icon: Lock, title: "Transfer ke Rekening Escrow", desc: "Konfirmasi komitmen pendanaan. Transfer dana ke Virtual Account escrow CSR Hub — dana aman, tidak langsung ke NGO.", color: "bg-amber-500" },
  { no: "05", icon: BarChart3, title: "Monitor Proyek Real-time", desc: "Pantau progress proyek via dashboard: laporan bulanan, foto dokumentasi, realisasi anggaran, dan capaian milestone.", color: "bg-purple-500" },
  { no: "06", icon: Award, title: "Terima Laporan Dampak", desc: "Dapatkan laporan dampak terverifikasi, sustainability report untuk kepatuhan POJK 51/GRI, dan sertifikat kontribusi CSR.", color: "bg-rose-500" },
];

const ESCROW_STEPS = [
  {
    step: "1",
    title: "Komitmen Dana",
    desc: "Perusahaan mengkonfirmasi jumlah dana di platform. Sistem membuat Virtual Account unik per proyek.",
    detail: "VA BNI / Mandiri / BRI / BCA",
    color: "border-blue-500 bg-blue-50",
    badge: "bg-blue-500",
  },
  {
    step: "2",
    title: "Dana Masuk Escrow",
    desc: "Perusahaan transfer ke VA. Dana otomatis masuk ke rekening escrow terpisah — tidak bercampur dengan operasional platform.",
    detail: "Konfirmasi otomatis dalam 1x24 jam",
    color: "border-teal-500 bg-teal-50",
    badge: "bg-teal-500",
  },
  {
    step: "3",
    title: "Verifikasi Milestone",
    desc: "NGO submit laporan milestone. Verifikator lapangan turun ke lokasi. Admin platform review dan menyetujui pencairan.",
    detail: "Minimal 2 approver sebelum cair",
    color: "border-amber-500 bg-amber-50",
    badge: "bg-amber-500",
  },
  {
    step: "4",
    title: "Pencairan Otomatis",
    desc: "Dana milestone dicairkan ke rekening NGO. Fee platform dipotong. Bukti transfer dikirim ke semua pihak via email & dashboard.",
    detail: "Fee 3–5% dipotong otomatis",
    color: "border-brand-500 bg-brand-50",
    badge: "bg-brand-500",
  },
  {
    step: "5",
    title: "Pelaporan & Audit",
    desc: "Semua transaksi tercatat lengkap. Perusahaan, NGO, auditor, dan regulator bisa melihat audit trail kapan saja.",
    detail: "Audit trail tidak bisa diubah",
    color: "border-purple-500 bg-purple-50",
    badge: "bg-purple-500",
  },
];

export default function CaraKerjaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-brand-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Cara Kerja</Badge>
          <h1 className="text-4xl font-bold mb-4">Dari Niat Baik ke Dampak Nyata</h1>
          <p className="text-white/70 text-lg">
            Alur lengkap platform CSR Hub — dari pendaftaran hingga pencairan dana yang aman dan terverifikasi.
          </p>
        </div>
      </section>

      {/* Tab Overview */}
      <section className="py-4 px-4 bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto flex gap-4 overflow-x-auto">
          {[
            { label: "Untuk Pengusul", href: "#pengusul" },
            { label: "Untuk Perusahaan", href: "#perusahaan" },
            { label: "Mekanisme Pencairan", href: "#escrow" },
            { label: "Biaya & Fee", href: "#fee" },
          ].map((t) => (
            <a key={t.label} href={t.href} className="flex-shrink-0 text-sm font-medium text-muted-foreground hover:text-brand-600 transition-colors py-2 border-b-2 border-transparent hover:border-brand-600">
              {t.label}
            </a>
          ))}
        </div>
      </section>

      {/* Untuk Pengusul */}
      <section id="pengusul" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <Badge className="mb-3 bg-teal-50 text-teal-700 border-teal-200">Untuk NGO / Komunitas / Yayasan</Badge>
            <h2 className="text-3xl font-bold mb-2">Alur untuk Pengusul</h2>
            <p className="text-muted-foreground">Dari verifikasi organisasi hingga pencairan dana program CSR kamu</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS_NGO.map((s) => (
              <Card key={s.no} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-black text-gray-200">{s.no}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/panduan/proposal">
              <Button className="gap-2">
                Panduan Lengkap Buat Proposal <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Untuk Perusahaan */}
      <section id="perusahaan" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <Badge className="mb-3 bg-brand-50 text-brand-700 border-brand-200">Untuk Perusahaan</Badge>
            <h2 className="text-3xl font-bold mb-2">Alur untuk Perusahaan</h2>
            <p className="text-muted-foreground">Temukan program CSR yang tepat, pendanaan aman, dan laporan dampak terverifikasi</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS_COMPANY.map((s) => (
              <Card key={s.no} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-black text-gray-200">{s.no}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/panduan/perusahaan">
              <Button className="gap-2">
                Panduan Lengkap untuk Perusahaan <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mekanisme Escrow */}
      <section id="escrow" className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200">Keamanan Dana</Badge>
            <h2 className="text-3xl font-bold mb-3">Mekanisme Escrow Milestone-Based</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Dana tidak pernah langsung ke NGO tanpa verifikasi. Sistem escrow memastikan setiap sen
              digunakan sesuai proposal yang disetujui.
            </p>
          </div>

          <div className="space-y-4">
            {ESCROW_STEPS.map((s, i) => (
              <div key={s.step} className={`rounded-xl border-l-4 p-6 ${s.color} flex gap-5 items-start`}>
                <div className={`w-10 h-10 ${s.badge} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{s.detail}</Badge>
                  </div>
                </div>
                {i < ESCROW_STEPS.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Dana 100% Aman", desc: "Rekening escrow terpisah dari operasional perusahaan" },
              { icon: CheckCircle2, title: "Verifikasi Ganda", desc: "Minimal 2 approver sebelum setiap pencairan" },
              { icon: AlertCircle, title: "Refund Jaminan", desc: "Dana dikembalikan jika proyek dibatalkan atau gagal verifikasi" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border text-center">
                <item.icon className="h-6 w-6 text-brand-600 mx-auto mb-2" />
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee & Biaya */}
      <section id="fee" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-brand-50 text-brand-700 border-brand-200">Biaya Platform</Badge>
            <h2 className="text-3xl font-bold mb-3">Transparan, Tidak Ada Biaya Tersembunyi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold border">Layanan</th>
                  <th className="text-center p-4 font-semibold border">Pengusul (NGO)</th>
                  <th className="text-center p-4 font-semibold border">Perusahaan</th>
                  <th className="text-left p-4 font-semibold border">Keterangan</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { layanan: "Pendaftaran Akun", ngo: "✅ Gratis", company: "✅ Gratis", ket: "Tidak ada biaya registrasi" },
                  { layanan: "Verifikasi Organisasi", ngo: "✅ Gratis", company: "✅ Gratis", ket: "Biaya ditanggung platform" },
                  { layanan: "Upload Proposal", ngo: "✅ Gratis", company: "—", ket: "Unlimited proposal per tahun" },
                  { layanan: "Akses Direktori Proposal", ngo: "—", company: "✅ Gratis", ket: "Lihat semua proposal publik" },
                  { layanan: "Fee Manajemen Proyek", ngo: "3–5% dari nilai", company: "—", ket: "Dipotong saat pencairan dana" },
                  { layanan: "Premium Analytics", ngo: "—", company: "Rp 2 jt/bulan", ket: "Opsional, fitur lanjutan" },
                  { layanan: "Sustainability Report PDF", ngo: "—", company: "Rp 500 rb/laporan", ket: "Opsional, untuk GRI/POJK 51" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="p-4 border font-medium">{row.layanan}</td>
                    <td className="p-4 border text-center">{row.ngo}</td>
                    <td className="p-4 border text-center">{row.company}</td>
                    <td className="p-4 border text-muted-foreground">{row.ket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-600 to-teal-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Mulai Sekarang</h2>
          <p className="text-white/80 mb-8">Bergabung dengan ratusan organisasi dan perusahaan yang sudah berdampak bersama CSR Hub.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register?role=PENGUSUL">
              <Button className="bg-white text-brand-700 hover:bg-white/90 gap-2">
                <HandHeart className="h-4 w-4" /> Daftar sebagai Pengusul
              </Button>
            </Link>
            <Link href="/register?role=PERUSAHAAN">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                <Building2 className="h-4 w-4" /> Daftar sebagai Perusahaan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
