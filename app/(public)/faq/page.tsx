import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "FAQ - CSR Hub",
  description: "Pertanyaan yang sering ditanyakan tentang CSR Hub — pendaftaran, proposal, pencairan dana, fee, dan lainnya.",
};

const FAQS = [
  {
    category: "Umum",
    color: "text-brand-600",
    items: [
      { q: "Apa itu CSR Hub?", a: "CSR Hub adalah platform marketplace CSR nasional yang menghubungkan perusahaan yang memiliki anggaran CSR dengan NGO, komunitas, yayasan, dan organisasi sosial yang membutuhkan pendanaan. Platform kami memastikan proses yang transparan, terverifikasi, dan berdampak nyata." },
      { q: "Siapa saja yang bisa bergabung di CSR Hub?", a: "Siapa saja bisa bergabung: (1) Perusahaan yang ingin menyalurkan CSR, (2) NGO/Yayasan/Komunitas/Koperasi yang butuh dana, (3) Donatur kolaborator individu/institusi, (4) Verifikator dan auditor independen." },
      { q: "Apakah CSR Hub sudah terdaftar resmi?", a: "Ya. CSR Hub beroperasi sebagai perusahaan teknologi terdaftar di Indonesia, bermitra dengan lembaga keuangan berlisensi OJK untuk layanan escrow dana. Seluruh proses mengikuti regulasi yang berlaku." },
      { q: "Bagaimana CSR Hub berbeda dari donasi biasa?", a: "CSR Hub bukan platform donasi. Ini adalah marketplace B2B yang menghubungkan anggaran CSR korporat dengan program sosial terverifikasi. Semua organisasi harus melalui proses KYB, semua dana melalui escrow, dan semua proyek dimonitor dengan laporan dampak terstandar." },
    ],
  },
  {
    category: "Untuk Pengusul (NGO/Komunitas)",
    color: "text-teal-600",
    items: [
      { q: "Berapa biaya untuk mendaftar dan mengajukan proposal?", a: "Pendaftaran dan pengajuan proposal sepenuhnya GRATIS. CSR Hub mengambil fee manajemen 3–5% hanya dari nilai proyek yang berhasil didanai dan dicairkan. Jika proposal tidak didanai, tidak ada biaya apapun." },
      { q: "Apa saja dokumen yang dibutuhkan untuk verifikasi organisasi?", a: "Dokumen wajib: (1) Akta pendirian + perubahan terakhir, (2) NPWP organisasi, (3) SK Kemenkumham (untuk yayasan/perkumpulan), (4) Profil organisasi lengkap, (5) Laporan kegiatan 2 tahun terakhir. Dokumen pendukung: sertifikat penghargaan, laporan keuangan, foto kegiatan." },
      { q: "Berapa lama proses verifikasi organisasi?", a: "Proses verifikasi memakan waktu 3–7 hari kerja setelah dokumen lengkap diterima. Tim verifikator kami akan menghubungi jika ada dokumen yang perlu dilengkapi." },
      { q: "Bagaimana cara dana dicairkan ke organisasi kami?", a: "Dana dicairkan per milestone yang sudah diverifikasi oleh verifikator lapangan kami. Proses: (1) Submit laporan milestone, (2) Verifikator lapangan memvalidasi, (3) Admin platform approve, (4) Dana transfer ke rekening organisasi dalam 2–3 hari kerja. Fee platform dipotong otomatis sebelum pencairan." },
      { q: "Apakah satu organisasi bisa mengajukan banyak proposal sekaligus?", a: "Ya, tidak ada batasan jumlah proposal aktif. Namun setiap proposal harus memenuhi kapasitas organisasi. AI kami menganalisis track record dan kapasitas sebelum merekomendasikan ke perusahaan." },
    ],
  },
  {
    category: "Untuk Perusahaan",
    color: "text-blue-600",
    items: [
      { q: "Apakah dana yang kami transfer ke CSR Hub aman?", a: "Sangat aman. Dana masuk ke rekening escrow terpisah (Virtual Account dedicated per proyek), tidak bercampur dengan operasional platform. Dana hanya cair ke NGO setelah milestone terverifikasi. Jika proyek dibatalkan, dana dikembalikan penuh." },
      { q: "Bagaimana sistem AI matching bekerja?", a: "AI kami menganalisis profil CSR perusahaan (fokus bidang, SDGs, wilayah, budget) dan mencocokkan dengan proposal yang paling relevan. Matching score dihitung berdasarkan 12+ parameter termasuk track record organisasi, kelengkapan proposal, dan potensi dampak." },
      { q: "Apakah laporan CSR yang kami terima valid untuk kepatuhan regulasi?", a: "Ya. Laporan dampak CSR Hub memenuhi standar: GRI (Global Reporting Initiative), POJK 51/2017 tentang keuangan berkelanjutan, dan ISO 26000 CSR. Laporan bisa langsung digunakan untuk RUPS, laporan tahunan, dan pelaporan ke OJK." },
      { q: "Bisakah beberapa perusahaan mendanai satu proyek bersama (co-funding)?", a: "Ya, ini adalah fitur unggulan kami. Fitur co-funding memungkinkan 2–5 perusahaan mendanai satu proyek besar bersama. Setiap perusahaan mendapat laporan dampak proporsional sesuai kontribusi masing-masing." },
      { q: "Apakah ada minimum anggaran untuk menggunakan CSR Hub?", a: "Tidak ada minimum resmi, namun platform ini paling optimal untuk proyek dengan nilai Rp 50 juta ke atas, mengingat ada proses verifikasi lapangan yang membutuhkan biaya. Proyek di bawah Rp 50 juta bisa menggunakan alur simplified." },
    ],
  },
  {
    category: "Fee & Pembayaran",
    color: "text-amber-600",
    items: [
      { q: "Berapa persisnya fee manajemen yang dikenakan?", a: "Fee manajemen adalah 3–5% dari nilai proyek yang berhasil dicairkan: (a) Proyek < Rp 500 juta: 5%, (b) Proyek Rp 500 juta – Rp 2 miliar: 4%, (c) Proyek > Rp 2 miliar: 3%. Fee mencakup: biaya verifikator lapangan, monitoring platform, dan administrasi pencairan." },
      { q: "Siapa yang membayar fee — perusahaan atau NGO?", a: "Fee dipotong dari total dana yang masuk ke escrow sebelum dicairkan ke NGO. Artinya NGO menerima dana bersih setelah fee dipotong. Perusahaan mentransfer dana penuh sesuai proposal; platform yang memotong fee sebelum menyalurkan." },
      { q: "Apakah fee bisa dinegosiasi untuk proyek besar?", a: "Ya. Untuk proyek strategis nasional atau proyek dengan nilai > Rp 5 miliar, kami membuka negosiasi fee khusus. Hubungi tim kami di halo@csrhub.id untuk diskusi." },
    ],
  },
  {
    category: "Teknis & Keamanan",
    color: "text-purple-600",
    items: [
      { q: "Bagaimana keamanan data di CSR Hub?", a: "Platform kami menggunakan enkripsi SSL/TLS, penyimpanan data terenkripsi (AES-256), two-factor authentication, dan audit log setiap aksi. Server berada di infrastruktur berstandar ISO 27001." },
      { q: "Apakah ada aplikasi mobile CSR Hub?", a: "Saat ini platform tersedia via web browser (mobile-responsive). Aplikasi Android dan iOS sedang dalam pengembangan, dijadwalkan rilis Q3 2025." },
      { q: "Bagaimana jika terjadi sengketa antara perusahaan dan NGO?", a: "Platform menyediakan mekanisme dispute resolution: (1) Mediasi via tim platform dalam 7 hari kerja, (2) Review oleh komite independen jika mediasi gagal, (3) Dana di escrow tetap aman selama proses berlangsung." },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-slate-800 text-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">FAQ</Badge>
          <h1 className="text-4xl font-bold mb-4">Pertanyaan yang Sering Ditanyakan</h1>
          <p className="text-white/70">
            Tidak menemukan jawaban yang kamu cari? Hubungi kami di{" "}
            <a href="mailto:halo@csrhub.id" className="text-teal-300 underline">halo@csrhub.id</a>
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="space-y-12">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className={`text-xl font-bold mb-6 pb-2 border-b-2 border-current ${section.color}`}>
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <details key={i} className="group bg-white rounded-xl border overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 list-none">
                      <span className="font-medium pr-4">{item.q}</span>
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform text-lg flex-shrink-0">▾</span>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t bg-gray-50/50">
                      <p className="pt-4">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-brand-50 rounded-2xl p-8 text-center border border-brand-200">
          <MessageCircle className="h-10 w-10 text-brand-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Masih Ada Pertanyaan?</h3>
          <p className="text-muted-foreground mb-6">Tim kami siap membantu kamu 09.00–17.00 WIB, Senin–Jumat.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:halo@csrhub.id">
              <Button className="gap-2">Kirim Email <ArrowRight className="h-4 w-4" /></Button>
            </a>
            <Link href="/cara-kerja">
              <Button variant="outline" className="gap-2">Lihat Cara Kerja</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
