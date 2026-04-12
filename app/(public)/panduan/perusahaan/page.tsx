import React from "react";
import Link from "next/link";
import { Building2, Search, DollarSign, BarChart3, Shield, Users, ArrowRight, CheckCircle2, Award, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Panduan untuk Perusahaan - CSR Hub",
  description: "Panduan lengkap cara menggunakan CSR Hub untuk menemukan program CSR yang tepat, aman, dan berdampak nyata.",
};

const BENEFITS = [
  { icon: Search, title: "AI Matching Otomatis", desc: "Sistem kami mengirim rekomendasi proposal yang sesuai fokus CSR, wilayah, dan SDGs perusahaan kamu setiap minggu." },
  { icon: Shield, title: "Semua Organisasi Terverifikasi", desc: "Tidak ada organisasi bodong. Setiap pengusul melalui proses KYB ketat sebelum bisa mengajukan proposal." },
  { icon: DollarSign, title: "Dana 100% Aman via Escrow", desc: "Dana tidak langsung ke NGO. Sistem escrow memastikan pencairan hanya setelah milestone terverifikasi lapangan." },
  { icon: BarChart3, title: "Laporan Dampak Terstandar", desc: "Laporan dampak real-time, lengkap dengan foto, data, dan narasi. Siap untuk RUPS, laporan tahunan, dan OJK." },
  { icon: Handshake, title: "Co-funding Multi-Perusahaan", desc: "Kolaborasi dengan perusahaan lain untuk mendanai proyek besar. Setiap pihak mendapat laporan proporsional." },
  { icon: Award, title: "Sustainability Report Otomatis", desc: "Platform kami menghasilkan laporan keberlanjutan sesuai standar GRI dan POJK 51 secara otomatis." },
];

const STEPS = [
  { no: "1", title: "Daftar & Setup Profil CSR", list: ["Daftar dengan email perusahaan", "Isi profil: industri, ukuran perusahaan, PIC CSR", "Tentukan fokus CSR: bidang, SDGs target, wilayah prioritas", "Set range anggaran per proyek"] },
  { no: "2", title: "Terima Rekomendasi AI", list: ["AI kami menganalisis profil dan mengirim rekomendasi mingguan", "Proposal yang match dikirim via email & notifikasi dashboard", "Skor kecocokan (0–100) tersedia untuk setiap proposal"] },
  { no: "3", title: "Review & Shortlist", list: ["Telusuri semua proposal di direktori (bisa filter kategori/wilayah/SDGs)", "Lihat profil lengkap organisasi + track record + trust score", "Masukkan proposal menarik ke shortlist", "Kirim pertanyaan atau diskusi via pesan platform"] },
  { no: "4", title: "Konfirmasi & Transfer Escrow", list: ["Konfirmasi komitmen pendanaan di platform", "Terima Virtual Account (VA) unik per proyek", "Transfer dana ke VA — dana masuk ke rekening escrow", "Konfirmasi otomatis dalam 1x24 jam kerja"] },
  { no: "5", title: "Monitor Proyek", list: ["Pantau progress via dashboard real-time", "Terima laporan bulanan dari NGO", "Lihat foto dokumentasi dan data capaian", "Notifikasi otomatis setiap milestone selesai diverifikasi"] },
  { no: "6", title: "Terima Laporan Dampak", list: ["Laporan akhir dampak dengan data kuantitatif terverifikasi", "Sertifikat kontribusi CSR dari CSR Hub", "Sustainability report format GRI/POJK 51 (opsional)", "Data siap untuk RUPS dan laporan ESG"] },
];

export default function PanduanPerusahaanPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Panduan Perusahaan</Badge>
          <h1 className="text-4xl font-bold mb-4">Panduan CSR Hub untuk Perusahaan</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Dari setup profil hingga laporan dampak — semua yang perlu kamu ketahui
            untuk memaksimalkan program CSR perusahaan melalui platform kami.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/register?role=PERUSAHAAN">
              <Button className="bg-white text-brand-700 hover:bg-white/90 gap-2">
                Mulai Gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cara-kerja">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">Lihat Cara Kerja</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Kenapa Perusahaan Memilih CSR Hub</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-3 p-5 rounded-xl border bg-gray-50 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <b.icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="font-semibold mb-1 text-sm">{b.title}</div>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Langkah demi Langkah</h2>
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <Card key={s.no} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {s.no}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-3">{s.title}</h3>
                      <ul className="space-y-1.5">
                        {s.list.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Kepatuhan Regulasi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "POJK 51/2017", desc: "Laporan keuangan berkelanjutan sesuai OJK. Data CSR Hub bisa langsung dimasukkan ke Laporan Keberlanjutan wajib." },
              { title: "UU PT No. 40/2007 Pasal 74", desc: "Pemenuhan kewajiban CSR bagi perusahaan yang bergerak di bidang SDA. Laporan CSR Hub sebagai bukti pelaksanaan." },
              { title: "GRI Standards", desc: "Laporan dampak CSR Hub memenuhi standar GRI (Global Reporting Initiative) untuk pelaporan ESG internasional." },
              { title: "SDGs Reporting", desc: "Setiap proyek dilabeli SDGs spesifik. Data kontribusi SDGs perusahaan teragregasi otomatis di dashboard." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-5 rounded-xl border bg-blue-50">
                <Award className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">{item.title}</div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-brand-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Siap Mulai Program CSR yang Berdampak?</h2>
          <p className="text-white/80 mb-6">Daftar gratis, setup profil, dan terima rekomendasi proposal pertama dalam 24 jam.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?role=PERUSAHAAN">
              <Button className="bg-white text-brand-700 hover:bg-white/90 gap-2">
                Daftar sebagai Perusahaan <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">Lihat FAQ</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
