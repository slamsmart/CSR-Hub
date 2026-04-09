import { Link } from "wouter";
import { useGetDashboardStats, useListProposals, useListOrganizations, customFetch } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  Leaf, TrendingUp, Users, Building2, FileText, ArrowRight, CheckCircle,
  Globe, Shield, Star, Sparkles, Trophy, FileBarChart, Receipt, Handshake,
  Zap, ChevronRight, Medal
} from "lucide-react";

const SDG_COLORS: Record<string, string> = {
  "SDG 1": "#E5243B","SDG 2": "#DDA63A","SDG 3": "#4C9F38","SDG 4": "#C5192D",
  "SDG 5": "#FF3A21","SDG 6": "#26BDE2","SDG 7": "#FCC30B","SDG 8": "#A21942",
  "SDG 9": "#FD6925","SDG 10": "#DD1367","SDG 11": "#FD9D24","SDG 12": "#BF8B2E",
  "SDG 13": "#3F7E44","SDG 14": "#0A97D9","SDG 15": "#56C02B","SDG 16": "#00689D","SDG 17": "#19486A",
};

export default function HomePage() {
  const { data: stats } = useGetDashboardStats();
  const { data: proposals } = useListProposals({ status: "berjalan", page: 1, limit: 3 });
  const { data: orgs } = useListOrganizations({ verified: true, page: 1, limit: 4 });
  const { data: leaderboard } = useQuery({
    queryKey: ["/api/dashboard/leaderboard"],
    queryFn: () => customFetch<any[]>("/api/dashboard/leaderboard"),
  });

  const highlights = [
    { label: "Total Proposal", value: stats?.totalProposals ?? 0, icon: FileText, isRupiah: false, suffix: "" },
    { label: "Dana Disalurkan", value: stats?.totalFundingRp ?? 0, icon: TrendingUp, isRupiah: true, suffix: "" },
    { label: "Penerima Manfaat", value: stats?.totalBeneficiaries ?? 0, icon: Users, isRupiah: false, suffix: " orang" },
    { label: "Mitra Terverifikasi", value: stats?.verifiedOrganizations ?? 0, icon: Building2, isRupiah: false, suffix: " org" },
  ];

  const companyFeatures = [
    {
      icon: Receipt,
      color: "bg-blue-50 text-blue-600",
      title: "Potongan Pajak Otomatis",
      desc: "Dokumen SAK dan bukti pemotongan pajak CSR sesuai PP No. 93/2010 & PMK 92/2020 diterbitkan otomatis untuk setiap program yang Anda danai.",
      tag: "Tax Deduction",
    },
    {
      icon: FileBarChart,
      color: "bg-green-50 text-green-600",
      title: "One-Click Sustainability Report",
      desc: "Laporan keberlanjutan standar GRI 2021 tersusun otomatis dari semua data kegiatan, foto, dan metrik dampak. Tidak perlu tim konsultan lagi.",
      tag: "GRI 2021 Standard",
    },
    {
      icon: Shield,
      color: "bg-purple-50 text-purple-600",
      title: "NGO Teraudit & Tervetting",
      desc: "Setiap LSM di platform kami melewati proses verifikasi legalitas berlapis — akta notaris, NIB, laporan keuangan, dan track record lapangan.",
      tag: "Peace of Mind",
    },
    {
      icon: Handshake,
      color: "bg-orange-50 text-orange-600",
      title: "Co-Funding Multi-Perusahaan",
      desc: "Proyek besar bisa dikerjakan bersama 3–5 perusahaan dalam satu wilayah. Efisiensi biaya maksimal, dampak dan eksposur publik tetap luas.",
      tag: "Cost Efficient",
    },
    {
      icon: Trophy,
      color: "bg-amber-50 text-amber-600",
      title: "Leaderboard & PR Value",
      desc: "Tampil di halaman 'Perusahaan Paling Berdampak' yang dilihat ribuan stakeholder, investor, dan media. Insentif reputasi nyata yang terukur.",
      tag: "Brand Visibility",
    },
    {
      icon: Zap,
      color: "bg-teal-50 text-teal-600",
      title: "AI Matching dalam 10 Detik",
      desc: "AI kami memfilter ratusan proposal dan menyajikan 5 terbaik yang sesuai wilayah, fokus SDG, dan budget Anda. Tidak ada lagi email proposal berantakan.",
      tag: "AI Powered",
    },
  ];

  const badgeStyle = (badge: string) => {
    if (badge === "Platinum") return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
    if (badge === "Gold") return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white";
    if (badge === "Silver") return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    return "bg-gradient-to-r from-amber-700 to-amber-800 text-white";
  };

  const top3 = (leaderboard as any[] | undefined)?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-sidebar via-sidebar/90 to-sidebar/70 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{
              width: Math.random() * 80 + 20, height: Math.random() * 80 + 20,
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
            }} />
          ))}
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 border border-white/20">
            <Leaf className="w-4 h-4" />
            <span>Platform CSR Strategis Terpercaya di Indonesia</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Dari Kewajiban CSR<br />Menjadi <span className="text-green-300">Keunggulan Kompetitif</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            CSR Hub mempertemukan perusahaan dengan NGO teraudit untuk program CSR yang terukur —
            lengkap dengan laporan GRI otomatis, dokumen pajak, dan AI matching terbaik di kelasnya.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition-colors text-sm">
              Mulai Gratis — Untuk Perusahaan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/proposals" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors text-sm">
              Jelajahi Proposal NGO
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-10 px-6 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((h) => {
            const Icon = h.icon;
            const displayValue = h.isRupiah
              ? formatRupiah(h.value)
              : `${(h.value).toLocaleString("id-ID")}${h.suffix}`;
            return (
              <div key={h.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{displayValue}</div>
                <div className="text-sm text-muted-foreground">{h.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── UNTUK PERUSAHAAN — 6 VALUE PROPS ── */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="bg-primary/10 text-primary border-0 mb-3 px-3 py-1">Khusus Perusahaan</Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">Mengapa Perusahaan Memilih CSR Hub?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Bukan sekadar tempat donasi — CSR Hub adalah mitra strategis yang membantu Anda
              memaksimalkan nilai bisnis dari setiap Rupiah CSR yang diinvestasikan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companyFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="hover:shadow-lg transition-shadow group border-border">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color} mb-4`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-sm leading-snug flex-1">{f.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{f.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-500" />{f.tag}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-opacity text-sm">
              Daftar sebagai Perusahaan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI MATCHING SHOWCASE ── */}
      <section className="py-14 px-6 bg-gradient-to-r from-primary/5 to-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="bg-primary/10 text-primary border-0 mb-3 px-3 py-1">AI Powered</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Temukan 5 Proposal Terbaik<br />untuk Perusahaan Anda dalam 10 Detik
              </h2>
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                Tim CSR Anda tidak perlu lagi membaca ratusan email proposal yang formatnya berantakan.
                AI kami menganalisis lokasi, fokus SDG, budget, dan rekam jejak NGO — lalu menyajikan
                hanya yang paling relevan untuk perusahaan Anda.
              </p>
              <div className="space-y-2.5">
                {[
                  "Analisis otomatis keselarasan wilayah & fokus SDG",
                  "Skor kredibilitas NGO berdasarkan audit berlapis",
                  "Estimasi dampak dan ROI sosial per proposal",
                  "Rekomendasi paket co-funding dengan perusahaan lain",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/proposals" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-opacity text-sm">
                  <Sparkles className="w-4 h-4" />Coba AI Matching Sekarang
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { score: 94, title: "Beasiswa 200 Siswa — Jawa Tengah", cat: "pendidikan", sdg: "SDG 4", reason: "Sesuai fokus pengembangan SDM" },
                { score: 88, title: "Penanaman Bakau Pesisir Bali", cat: "lingkungan", sdg: "SDG 13", reason: "Mendukung target dekarbonisasi" },
                { score: 81, title: "Klinik Gratis NTT — 5.000 warga", cat: "kesehatan", sdg: "SDG 3", reason: "Tingkat risiko kesehatan tinggi" },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-border rounded-xl p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">{item.score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <div style={{ backgroundColor: SDG_COLORS[item.sdg] + "20", color: SDG_COLORS[item.sdg] }} className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                    {item.sdg}
                  </div>
                </div>
              ))}
              <p className="text-xs text-center text-muted-foreground">AI menganalisis {stats?.totalProposals ?? "—"} proposal secara real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD PREVIEW ── */}
      {top3.length > 0 && (
        <section className="py-14 px-6 bg-card">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Badge className="bg-amber-50 text-amber-700 border-0 mb-2 px-3 py-1">PR Value</Badge>
                <h2 className="text-xl font-bold text-foreground">Perusahaan Paling Berdampak</h2>
                <p className="text-sm text-muted-foreground">Merek Anda dilihat oleh investor, regulator, dan media sosial</p>
              </div>
              <Link href="/leaderboard" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {top3.map((company: any) => (
                <Card key={company.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-teal-400" />
                  <CardContent className="p-5 text-center">
                    <div className="relative inline-block mb-3">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Building2 className="w-7 h-7 text-primary" />
                      </div>
                      {company.rank <= 3 && (
                        <div className="absolute -top-1 -right-1">
                          <Medal className={`w-5 h-5 ${company.rank === 1 ? "text-yellow-500" : company.rank === 2 ? "text-gray-400" : "text-amber-700"}`} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-1">{company.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{company.province}</p>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${badgeStyle(company.badge)}`}>
                      <Trophy className="w-3 h-3" />{company.badge}
                    </div>
                    <div className="text-lg font-bold text-primary">{formatRupiah(company.totalFunded)}</div>
                    <div className="text-xs text-muted-foreground">Total Dana CSR</div>
                    {company.trustScore > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-amber-600 font-medium">Skor {company.trustScore}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GRI REPORT TEASER ── */}
      <section className="py-14 px-6 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                  <FileBarChart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Laporan Keberlanjutan 2025</p>
                  <p className="text-xs text-muted-foreground">PT Pertamina (Persero) — GRI 2021</p>
                </div>
                <Badge className="ml-auto bg-green-100 text-green-700 border-0 text-xs">Otomatis</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { label: "GRI 201 – Kinerja Ekonomi", value: "Rp 285.000.000", color: "text-green-600" },
                  { label: "GRI 302 – Penggunaan Energi", value: "↓ 18% YoY", color: "text-blue-600" },
                  { label: "GRI 413 – Masyarakat Lokal", value: "18.150 orang", color: "text-purple-600" },
                  { label: "SDGs Dituju", value: "SDG 4, 3, 13, 8", color: "text-amber-600" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{row.label}</span>
                    <span className={`text-xs font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                <Receipt className="w-3.5 h-3.5 shrink-0" />
                <span>Dokumen pajak: <strong className="text-foreground">Potongan CSR Rp 142.500.000</strong> siap unduh</span>
              </div>
            </div>
            <div>
              <Badge className="bg-green-100 text-green-700 border-0 mb-3 px-3 py-1">GRI 2021 Standard</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Laporan Keberlanjutan Standar Global,<br />Selesai dalam 1 Klik
              </h2>
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                Perusahaan publik (Tbk) wajib menerbitkan laporan keberlanjutan. Daripada menyewa konsultan
                dengan biaya puluhan juta, gunakan CSR Hub dan laporan standar GRI tersusun otomatis dari
                semua aktivitas program yang Anda danai melalui platform kami.
              </p>
              <div className="space-y-2">
                {[
                  "Format GRI 2021 Universal Standards siap audit",
                  "Dokumen potongan pajak CSR otomatis (PP 93/2010)",
                  "Data foto, video, dan metrik dampak terintegrasi",
                  "Ekspor ke PDF, Word, dan Excel dalam sekejap",
                ].map((pt) => (
                  <div key={pt} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-foreground">{pt}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/sustainability" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:opacity-90 transition-opacity text-sm">
                  <FileBarChart className="w-4 h-4" />Lihat Contoh Laporan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE PROPOSALS ── */}
      {proposals && (proposals as any).data?.length > 0 && (
        <section className="py-12 px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Proposal NGO Aktif</h2>
                <p className="text-sm text-muted-foreground">Program CSR yang sedang mencari mitra perusahaan</p>
              </div>
              <Link href="/proposals" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {((proposals as any).data ?? []).map((p: any) => (
                <Card key={p.id} className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getStatusColor(p.status)} text-xs border-0`}>{getStatusLabel(p.status)}</Badge>
                      {(p.aiScore ?? p.ai_score) && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                          <Sparkles className="w-2.5 h-2.5" />AI {p.aiScore ?? p.ai_score}%
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description || p.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {formatRupiah(p.budgetTotal ?? p.budget_requested ?? p.budgetRequested)}
                      </span>
                      <Link href={`/proposals/${p.id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium">
                        Lihat Detail <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VERIFIED ORGS ── */}
      {orgs && (orgs as any).data?.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">NGO Terverifikasi</h2>
                <p className="text-sm text-muted-foreground">Lulus audit legalitas & rekam jejak lapangan</p>
              </div>
              <Link href="/organizations" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                Semua Mitra <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {((orgs as any).data ?? []).map((org: any) => (
                <Card key={org.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{org.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{getStatusLabel(org.orgType ?? org.org_type ?? org.type)}</p>
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        {org.trustScore ? `Skor ${org.trustScore}` : "Terverifikasi"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DUAL CTA ── */}
      <section className="py-14 px-6 bg-sidebar text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Siap Menciptakan Dampak Nyata?</h2>
            <p className="text-white/70 text-sm">Bergabung gratis dan mulai hari ini — tidak perlu kartu kredit</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
              <Building2 className="w-8 h-8 mx-auto mb-3 text-green-300" />
              <h3 className="font-bold text-base mb-2">Saya Perusahaan</h3>
              <p className="text-white/70 text-xs mb-4">Cari NGO teraudit, kelola CSR, dan dapatkan laporan GRI otomatis</p>
              <Link href="/register" className="block w-full py-2.5 rounded-lg bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors">
                Daftar sebagai Perusahaan
              </Link>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
              <Globe className="w-8 h-8 mx-auto mb-3 text-teal-300" />
              <h3 className="font-bold text-base mb-2">Saya NGO / Komunitas</h3>
              <p className="text-white/70 text-xs mb-4">Ajukan proposal, temukan pendana, dan kelola proyek dengan mudah</p>
              <Link href="/register" className="block w-full py-2.5 rounded-lg border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Daftar sebagai NGO
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
