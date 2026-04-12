import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Clock, CheckCircle2, ArrowRight, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Panduan Verifikasi Organisasi - CSR Hub",
  description: "Pelajari proses verifikasi organisasi di CSR Hub — dokumen yang dibutuhkan, langkah-langkah, dan tips agar cepat terverifikasi.",
};

const DOCS = [
  { wajib: true, nama: "Akta Pendirian", detail: "Akta notaris pendirian organisasi + perubahan terakhir (jika ada)", format: "PDF, maks 5MB" },
  { wajib: true, nama: "NPWP Organisasi", detail: "NPWP atas nama organisasi (bukan pribadi pengurus)", format: "PDF/JPG" },
  { wajib: true, nama: "SK Kemenkumham", detail: "Surat Keputusan pengesahan dari Kemenkumham (untuk yayasan/perkumpulan)", format: "PDF" },
  { wajib: true, nama: "Profil Organisasi", detail: "Dokumen profil lengkap: sejarah, struktur pengurus, program yang pernah dijalankan", format: "PDF, maks 10MB" },
  { wajib: true, nama: "Rekening Bank Organisasi", detail: "Buku tabungan atau kop surat rekening atas nama organisasi", format: "PDF/JPG" },
  { wajib: false, nama: "Laporan Kegiatan 2 Tahun Terakhir", detail: "Laporan tahunan atau laporan program (sangat direkomendasikan)", format: "PDF" },
  { wajib: false, nama: "Laporan Keuangan", detail: "Laporan keuangan yang sudah diaudit atau setidaknya ditandatangani bendahara", format: "PDF" },
  { wajib: false, nama: "Sertifikat / Penghargaan", detail: "Sertifikat akreditasi, penghargaan, atau pengakuan dari lembaga terpercaya", format: "PDF/JPG" },
];

const STEPS = [
  { no: "1", title: "Daftar Akun", desc: "Buat akun di CSR Hub dengan email organisasi. Pilih tipe akun: NGO, Komunitas, Yayasan, atau Koperasi.", duration: "5 menit" },
  { no: "2", title: "Lengkapi Profil", desc: "Isi profil organisasi: nama, alamat, tahun berdiri, fokus kegiatan, wilayah operasi, dan deskripsi singkat.", duration: "15–30 menit" },
  { no: "3", title: "Upload Dokumen", desc: "Upload semua dokumen wajib dan dokumen pendukung. Pastikan file jelas terbaca dan tidak expired.", duration: "30–60 menit" },
  { no: "4", title: "Submit Pengajuan", desc: "Klik 'Ajukan Verifikasi'. Sistem akan mengecek kelengkapan dokumen secara otomatis sebelum masuk antrian review.", duration: "< 1 menit" },
  { no: "5", title: "Review Tim", desc: "Tim verifikator kami mereview dokumen. Jika ada kekurangan, kami akan menghubungi via email atau notifikasi platform.", duration: "3–7 hari kerja" },
  { no: "6", title: "Status Terverifikasi", desc: "Setelah lulus verifikasi, organisasi mendapat badge terverifikasi dan dapat langsung mengajukan proposal.", duration: "Permanen" },
];

export default function PanduanVerifikasiPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Panduan Verifikasi</Badge>
          <h1 className="text-4xl font-bold mb-4">Panduan Verifikasi Organisasi</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Verifikasi adalah langkah pertama dan terpenting. Organisasi terverifikasi mendapat kepercayaan
            lebih tinggi dari perusahaan dan peluang pendanaan yang jauh lebih besar.
          </p>
        </div>
      </section>

      {/* Why Verify */}
      <section className="bg-teal-50 py-10 px-4 border-b">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Badge Terverifikasi", desc: "Tampil di halaman profil dan proposal — meningkatkan kepercayaan perusahaan" },
            { icon: CheckCircle2, title: "Akses Penuh Platform", desc: "Bisa mengajukan proposal, menerima dana escrow, dan akses semua fitur" },
            { icon: FileText, title: "Trust Score Tinggi", desc: "Skor kepercayaan awal yang lebih tinggi meningkatkan ranking di AI matching" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <item.icon className="h-6 w-6 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Langkah-Langkah Verifikasi</h2>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={s.no} className="flex gap-5 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {s.no}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-0.5 h-8 bg-teal-200 mt-1" />}
                </div>
                <div className="bg-white rounded-xl border p-5 flex-1 mb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{s.duration}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Checklist */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Checklist Dokumen</h2>
          <p className="text-muted-foreground mb-8">Pastikan semua dokumen wajib tersedia sebelum mulai proses verifikasi.</p>
          <div className="space-y-3">
            {DOCS.map((doc, i) => (
              <div key={i} className={`rounded-xl border p-4 flex items-start gap-4 bg-white ${doc.wajib ? "" : "opacity-80"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${doc.wajib ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                  {doc.wajib ? "!" : "○"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{doc.nama}</span>
                    {doc.wajib ? (
                      <Badge className="text-xs bg-red-50 text-red-600 border-red-200">Wajib</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Direkomendasikan</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.detail}</p>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">{doc.format}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Tips Agar Cepat Diverifikasi</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Upload, title: "Upload Semua Dokumen Sekaligus", desc: "Jangan upload sebagian-sebagian. Upload semua sekaligus agar reviewer bisa memproses tuntas." },
              { icon: CheckCircle2, title: "Dokumen Harus Terbaca Jelas", desc: "Scan/foto dengan resolusi cukup. Dokumen buram atau terpotong akan memperlamban proses." },
              { icon: AlertCircle, title: "Pastikan Dokumen Belum Kedaluwarsa", desc: "NPWP dan akta harus berlaku. SK Kemenkumham harus sesuai nama dan status organisasi saat ini." },
              { icon: FileText, title: "Tambahkan Dokumen Pendukung", desc: "Laporan kegiatan dan laporan keuangan meningkatkan trust score dan mempercepat approval." },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-3 bg-brand-50 rounded-xl p-5 border border-brand-100">
                <tip.icon className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">{tip.title}</div>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-teal-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Mulai Proses Verifikasi</h2>
          <p className="text-white/80 mb-6">Proses cepat, gratis, dan membuka akses ke ratusan perusahaan CSR aktif.</p>
          <Link href="/register?role=PENGUSUL">
            <Button className="bg-white text-teal-700 hover:bg-white/90 gap-2">
              Daftar & Verifikasi Sekarang <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
