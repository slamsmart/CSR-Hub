import React from "react";
import Link from "next/link";
import { ArrowRight, Users, DollarSign, MapPin, TrendingUp, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Kisah Sukses - CSR Hub",
  description: "Kisah nyata program CSR yang berdampak — dari beasiswa Papua hingga restorasi mangrove Kalimantan.",
};

const STORIES = [
  {
    id: 1,
    title: "100 Beasiswa SMA untuk Pelajar Berprestasi Papua",
    org: "Yayasan Cerdas Nusantara",
    company: "PT Pertamina (Persero) + Bank Mandiri",
    category: "Pendidikan",
    categoryColor: "bg-blue-100 text-blue-700",
    provinsi: "Papua",
    dana: "Rp 750 juta",
    penerima: "100 pelajar",
    sdg: "SDG 4 + SDG 10",
    image: "🎓",
    bg: "from-blue-600 to-blue-800",
    quote: "Beasiswa ini mengubah hidup kami. Sekarang saya bisa bermimpi kuliah dan kembali membangun Papua.",
    quoteBy: "Yohana, penerima beasiswa, Jayapura",
    dampak: [
      "100% pelajar naik kelas dengan nilai memuaskan",
      "87% pelajar meningkat prestasi akademik",
      "3 pelajar masuk 10 besar olimpiade provinsi",
      "Tingkat kehadiran 97% sepanjang program",
    ],
    tags: ["Beasiswa", "Papua", "3T", "Pendidikan"],
  },
  {
    id: 2,
    title: "Restorasi 300 Hektar Mangrove di Pesisir Kalimantan Timur",
    org: "Yayasan Lingkungan Hijau Indonesia",
    company: "PT Pertamina + PT Telkom Indonesia",
    category: "Lingkungan",
    categoryColor: "bg-green-100 text-green-700",
    provinsi: "Kalimantan Timur",
    dana: "Rp 1,2 miliar",
    penerima: "5.000 warga pesisir",
    sdg: "SDG 13 + SDG 14 + SDG 15",
    image: "🌿",
    bg: "from-teal-600 to-green-800",
    quote: "Hutan mangrove kami pulih. Hasil laut meningkat 40% dalam setahun. Anak-anak kami punya masa depan.",
    quoteBy: "Pak Rudi, nelayan, Kutai Kartanegara",
    dampak: [
      "300 hektar mangrove berhasil dipulihkan",
      "Populasi ikan meningkat 40% di area restorasi",
      "200 petani lokal mendapat penghasilan tambahan",
      "Estimasi penyerapan karbon 1.500 ton CO₂/tahun",
    ],
    tags: ["Mangrove", "Lingkungan", "Kalimantan", "Karbon"],
  },
  {
    id: 3,
    title: "500 UMKM Yogyakarta Masuk Era Digital",
    org: "Komunitas Digital Desa Indonesia",
    company: "PT Telkom Indonesia",
    category: "Ekonomi Digital",
    categoryColor: "bg-purple-100 text-purple-700",
    provinsi: "DI Yogyakarta",
    dana: "Rp 650 juta",
    penerima: "500 pelaku UMKM",
    sdg: "SDG 8 + SDG 9",
    image: "💻",
    bg: "from-purple-600 to-indigo-800",
    quote: "Omzet toko batik saya naik 3x lipat setelah punya toko online. Sekarang kirim ke seluruh Indonesia.",
    quoteBy: "Bu Sri, pengrajin batik, Kotagede Yogyakarta",
    dampak: [
      "480 dari 500 UMKM aktif berjualan online",
      "Rata-rata peningkatan omzet 185% dalam 6 bulan",
      "3.200 lapangan kerja baru tercipta",
      "Total transaksi digital Rp 12,4 miliar/bulan",
    ],
    tags: ["UMKM", "Digital", "Yogyakarta", "E-commerce"],
  },
  {
    id: 4,
    title: "25 Sumur Bor untuk 15.000 Warga Desa NTT",
    org: "Perkumpulan Komunitas Sehat Bersama",
    company: "PT Bank Mandiri (Persero)",
    category: "Air Bersih & Kesehatan",
    categoryColor: "bg-cyan-100 text-cyan-700",
    provinsi: "Nusa Tenggara Timur",
    dana: "Rp 2,5 miliar",
    penerima: "15.000 warga",
    sdg: "SDG 6 + SDG 3",
    image: "💧",
    bg: "from-cyan-600 to-blue-800",
    quote: "Dulu kami jalan 3 km buat ambil air. Sekarang ada sumur di desa. Anak-anak tidak lagi sakit diare.",
    quoteBy: "Ibu Maria, ibu rumah tangga, Kupang Barat",
    dampak: [
      "25 sumur bor aktif melayani 25 desa",
      "Kasus diare turun 78% dalam 6 bulan pertama",
      "Waktu yang dihemat: 2–3 jam/hari per keluarga",
      "Produktivitas pertanian meningkat karena irigasi",
    ],
    tags: ["Air Bersih", "NTT", "Kesehatan", "3T"],
  },
];

export default function KisahSuksesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-teal-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Kisah Sukses</Badge>
          <h1 className="text-4xl font-bold mb-4">Dampak Nyata dari Kolaborasi CSR</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Setiap angka di balik laporan adalah cerita manusia nyata yang hidupnya berubah
            berkat program CSR yang tepat sasaran.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Program Selesai", value: "847+", icon: Award },
            { label: "Dana Tersalurkan", value: "Rp 189M+", icon: DollarSign },
            { label: "Penerima Manfaat", value: "1,2 Juta", icon: Users },
            { label: "Provinsi Terjangkau", value: "26 Provinsi", icon: MapPin },
          ].map((s) => (
            <div key={s.label}>
              <s.icon className="h-6 w-6 mx-auto mb-2 text-brand-600" />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {STORIES.map((story, i) => (
            <div key={story.id} className={`grid md:grid-cols-2 gap-8 items-start ${i % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}>
              {/* Visual */}
              <div className={`bg-gradient-to-br ${story.bg} rounded-2xl p-8 text-white ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
                <div className="text-6xl mb-4">{story.image}</div>
                <Badge className="mb-3 bg-white/20 text-white border-white/30 text-xs">{story.category}</Badge>
                <h2 className="text-xl font-bold mb-4">{story.title}</h2>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {story.provinsi}</div>
                  <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Dana: {story.dana}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {story.penerima}</div>
                  <div className="flex items-center gap-2"><Award className="h-4 w-4" /> {story.sdg}</div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 text-xs text-white/60">
                  <div className="font-medium text-white/80">Didanai oleh:</div>
                  {story.company}
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{tag}</span>
                  ))}
                </div>
                <p className="font-medium text-muted-foreground text-sm mb-2">Dilaksanakan oleh</p>
                <p className="font-bold text-lg mb-4">{story.org}</p>

                {/* Quote */}
                <blockquote className="bg-brand-50 rounded-xl p-5 border-l-4 border-brand-500 mb-6">
                  <p className="text-sm italic text-foreground mb-2">"{story.quote}"</p>
                  <footer className="text-xs text-muted-foreground font-medium">— {story.quoteBy}</footer>
                </blockquote>

                {/* Impact */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-brand-600" /> Capaian Program
                  </h3>
                  <ul className="space-y-2">
                    {story.dampak.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Heart className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-600 to-teal-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Tulis Kisah Sukses Berikutnya</h2>
          <p className="text-white/80 mb-8">
            Bergabung dan mulai program CSR yang berdampak nyata bersama ribuan organisasi terverifikasi di CSR Hub.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register?role=PERUSAHAAN">
              <Button className="bg-white text-brand-700 hover:bg-white/90 gap-2">
                Mulai Program CSR <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register?role=PENGUSUL">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                Ajukan Proposal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
