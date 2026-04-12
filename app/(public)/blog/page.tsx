import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Blog & Berita - CSR Hub",
  description: "Artikel, panduan, dan berita terbaru seputar CSR, keberlanjutan, dan dampak sosial di Indonesia.",
};

const POSTS = [
  { slug: "fee-manajemen-csr-platform", title: "Mengapa Platform CSR Perlu Fee Manajemen?", excerpt: "Fee 3–5% bukan biaya tambahan — ini investasi untuk memastikan setiap rupiah CSR digunakan dengan bertanggung jawab.", category: "Bisnis", date: "10 Apr 2025", read: "5 menit", emoji: "💼" },
  { slug: "escrow-csr-indonesia", title: "Sistem Escrow: Cara Paling Aman Salurkan Dana CSR", excerpt: "Kenapa perusahaan tidak boleh langsung transfer dana ke NGO tanpa sistem perantara yang terpercaya.", category: "Keuangan", date: "5 Apr 2025", read: "7 menit", emoji: "🔒" },
  { slug: "sdgs-2030-peran-csr", title: "Peran CSR Korporat dalam Akselerasi SDGs Indonesia 2030", excerpt: "Indonesia perlu dana tambahan Rp 4.000 triliun untuk capai SDGs. CSR korporat bisa jadi katalis kritis.", category: "SDGs", date: "1 Apr 2025", read: "8 menit", emoji: "🌍" },
  { slug: "cara-buat-proposal-csr-berhasil", title: "7 Elemen Proposal CSR yang Selalu Berhasil Didanai", excerpt: "Proposal yang baik bukan tentang desain cantik — tapi data yang kuat dan impact yang terukur.", category: "Panduan", date: "25 Mar 2025", read: "10 menit", emoji: "📝" },
  { slug: "pojk-51-laporan-keberlanjutan", title: "POJK 51/2017: Apa yang Wajib Dilaporkan Perusahaan?", excerpt: "Panduan ringkas kewajiban laporan keuangan berkelanjutan OJK dan bagaimana CSR Hub membantu compliance.", category: "Regulasi", date: "20 Mar 2025", read: "6 menit", emoji: "📋" },
  { slug: "cofunding-csr-kolaborasi", title: "Co-Funding CSR: Kolaborasi Antar Perusahaan untuk Dampak Lebih Besar", excerpt: "Satu perusahaan tidak harus menanggung sendiri. Co-funding memungkinkan proyek besar dengan risiko terbagi.", category: "Strategi", date: "15 Mar 2025", read: "5 menit", emoji: "🤝" },
];

const CATEGORIES = ["Semua", "Panduan", "Bisnis", "Keuangan", "SDGs", "Regulasi", "Strategi"];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-brand-900 text-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Blog & Berita</Badge>
          <h1 className="text-4xl font-bold mb-4">Insights Seputar CSR Indonesia</h1>
          <p className="text-white/70">Artikel, panduan praktis, dan analisis terbaru untuk ekosistem CSR yang lebih baik.</p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b py-4 px-4 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${cat === "Semua" ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 hover:border-brand-300 hover:text-brand-600"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <Card key={post.slug} className="border hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-brand-50 to-teal-50 h-40 flex items-center justify-center text-5xl rounded-t-lg">
                  {post.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.read}
                    </span>
                  </div>
                  <h2 className="font-bold mb-2 group-hover:text-brand-600 transition-colors leading-snug">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                    <span className="text-xs text-brand-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-brand-50 border-t text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Dapatkan Update Terbaru</h2>
          <p className="text-muted-foreground mb-6">Newsletter mingguan: artikel CSR terpilih, regulasi terbaru, dan kisah sukses program.</p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="email@perusahaan.com" className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <Button className="gap-2">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
