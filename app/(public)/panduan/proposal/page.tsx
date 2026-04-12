import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, AlertCircle, ArrowRight, Lightbulb, DollarSign, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Panduan Membuat Proposal CSR - CSR Hub",
  description: "Panduan lengkap cara membuat proposal CSR yang kuat, meyakinkan, dan berhasil mendapat pendanaan di CSR Hub.",
};

const SECTIONS = [
  {
    no: "1",
    title: "Persiapan Sebelum Membuat Proposal",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    content: [
      { subtitle: "Pastikan Organisasi Sudah Terverifikasi", desc: "Proposal hanya bisa dikirim setelah organisasi mendapat status terverifikasi. Selesaikan proses KYB terlebih dahulu." },
      { subtitle: "Riset Perusahaan yang Relevan", desc: "Pelajari fokus CSR dan SDGs perusahaan target. Proposal yang selaras dengan strategi CSR perusahaan memiliki peluang 3x lebih besar untuk didanai." },
      { subtitle: "Siapkan Data Baseline", desc: "Kumpulkan data kondisi saat ini (baseline) di wilayah program. Data kuantitatif sangat memperkuat argumen kebutuhan program." },
    ],
  },
  {
    no: "2",
    title: "Struktur Proposal yang Kuat",
    icon: FileText,
    color: "text-brand-600",
    bg: "bg-brand-50",
    content: [
      { subtitle: "Executive Summary (½ halaman)", desc: "Ringkasan masalah, solusi, target penerima, anggaran, dan dampak yang diharapkan. Ini bagian pertama yang dibaca reviewer." },
      { subtitle: "Latar Belakang & Analisis Masalah", desc: "Jelaskan masalah dengan data konkret. Sertakan data nasional/regional yang relevan. Hindari kalimat generik tanpa data pendukung." },
      { subtitle: "Deskripsi Program", desc: "Jelaskan aktivitas konkret, metodologi, target penerima spesifik, dan bagaimana program berjalan secara operasional." },
      { subtitle: "Rencana Anggaran (RAB)", desc: "Rincian biaya per komponen, per bulan. Sertakan justifikasi untuk setiap item besar. Pastikan wajar dan dapat dipertanggungjawabkan." },
      { subtitle: "Timeline & Milestones", desc: "Buat timeline realistis dengan milestone yang terukur. Setiap milestone harus punya output yang jelas dan dapat diverifikasi." },
      { subtitle: "Indikator Dampak (M&E Framework)", desc: "Tentukan KPI kuantitatif yang akan diukur: berapa penerima manfaat, persentase peningkatan yang ditarget, timeline pengukuran." },
    ],
  },
  {
    no: "3",
    title: "Tips Menulis RAB yang Kuat",
    icon: DollarSign,
    color: "text-teal-600",
    bg: "bg-teal-50",
    content: [
      { subtitle: "Pecah per Komponen Kegiatan", desc: "Jangan tulis 'Operasional Rp 100 juta' — pecah menjadi: transport Rp X, konsumsi Rp X, ATK Rp X, dll." },
      { subtitle: "Sertakan Harga Satuan", desc: "Tulis harga satuan dan volume: '50 kg bibit × Rp 10.000 = Rp 500.000'. Lebih dipercaya daripada angka bulat." },
      { subtitle: "Proporsi Wajar", desc: "Biaya SDM < 30% total anggaran, overhead < 10%. Proporsi terlalu besar untuk honor bisa menurunkan kepercayaan reviewer." },
      { subtitle: "Referensi Harga Pasar", desc: "Gunakan harga pasar setempat (bukan jakarta jika program di daerah). Lampirkan survey harga atau kuitansi referensi jika tersedia." },
    ],
  },
  {
    no: "4",
    title: "Dokumen Pendukung Wajib",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    content: [
      { subtitle: "Dokumen Proposal Utama (PDF)", desc: "File proposal lengkap dalam format PDF, maksimal 20 MB." },
      { subtitle: "RAB Detail (Excel/PDF)", desc: "Rincian anggaran dalam format spreadsheet atau PDF terpisah." },
      { subtitle: "Profil Organisasi", desc: "Profil singkat organisasi, struktur pengurus, dan foto-foto kegiatan sebelumnya." },
      { subtitle: "Surat Pernyataan & Rekomendasi", desc: "Surat pernyataan bermaterai dan surat rekomendasi dari tokoh/lembaga setempat (jika ada)." },
    ],
  },
  {
    no: "5",
    title: "Kesalahan Umum yang Harus Dihindari",
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    content: [
      { subtitle: "Target Terlalu Ambisius", desc: "Proposal dengan target 10.000 penerima tapi anggaran Rp 100 juta akan diragukan kapasitasnya. Lebih baik target realistis dan terlampaui." },
      { subtitle: "Tidak Ada Data Baseline", desc: "Klaim 'masalah besar' tanpa data pendukung membuat proposal terlihat tidak profesional." },
      { subtitle: "Milestone Tidak Terukur", desc: "'Melaksanakan pelatihan' bukan milestone yang baik. Gunakan: 'Melatih 50 peserta mencapai nilai ≥ 80 pada tes akhir pelatihan'." },
      { subtitle: "Copy-Paste Template", desc: "Reviewer mudah mendeteksi proposal generik. Sesuaikan setiap proposal dengan konteks spesifik wilayah dan target penerima." },
    ],
  },
];

export default function PanduanProposalPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-teal-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Panduan Pengusul</Badge>
          <h1 className="text-4xl font-bold mb-4">Panduan Membuat Proposal CSR yang Berhasil</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Proposal yang baik bukan soal panjang atau mewah — tapi soal kejelasan, data, dan kepercayaan.
            Ikuti panduan ini untuk meningkatkan peluang proposal kamu didanai.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "68%", label: "Proposal dengan data baseline lengkap berhasil didanai" },
            { value: "3–7 hari", label: "Rata-rata waktu review proposal di CSR Hub" },
            { value: "92%", label: "Proposal berperingkat AI ≥ 85 mendapat perhatian perusahaan" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-brand-600">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {SECTIONS.map((sec) => (
            <Card key={sec.no} className="border overflow-hidden">
              <div className={`${sec.bg} px-6 py-4 border-b flex items-center gap-3`}>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {sec.no}
                </div>
                <sec.icon className={`h-5 w-5 ${sec.color}`} />
                <h2 className="font-bold text-lg">{sec.title}</h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {sec.content.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">{item.subtitle}</div>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-brand-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Siap Buat Proposal?</h2>
          <p className="text-muted-foreground mb-6">Organisasi kamu sudah terverifikasi? Mulai buat proposal sekarang.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/login">
              <Button className="gap-2">Masuk & Buat Proposal <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/panduan/verifikasi">
              <Button variant="outline">Panduan Verifikasi Organisasi</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
