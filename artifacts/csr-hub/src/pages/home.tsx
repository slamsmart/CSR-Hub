import { Link } from "wouter";
import { useGetDashboardStats, useListProposals, useListOrganizations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Leaf, TrendingUp, Users, Building2, FileText, ArrowRight, CheckCircle, Heart, Globe, Shield, Star } from "lucide-react";

export default function HomePage() {
  const { data: stats } = useGetDashboardStats();
  const { data: proposals } = useListProposals({ status: "berjalan", page: 1, limit: 3 });
  const { data: orgs } = useListOrganizations({ verified: true, page: 1, limit: 4 });

  const highlights = [
    { label: "Total Proposal", value: stats?.totalProposals ?? 0, icon: FileText, isRupiah: false, suffix: "" },
    { label: "Dana Disalurkan", value: stats?.totalFundingRp ?? 0, icon: TrendingUp, isRupiah: true, suffix: "" },
    { label: "Penerima Manfaat", value: stats?.totalBeneficiaries ?? 0, icon: Users, isRupiah: false, suffix: " orang" },
    { label: "Mitra Terverifikasi", value: stats?.verifiedOrganizations ?? 0, icon: Building2, isRupiah: false, suffix: " org" },
  ];

  const features = [
    { icon: Shield, title: "Terverifikasi & Transparan", desc: "Setiap organisasi mitra diverifikasi oleh tim kami untuk memastikan keabsahan dan kredibilitasnya." },
    { icon: Star, title: "AI Matching Cerdas", desc: "Teknologi AI kami mencocokkan proposal NGO dengan perusahaan berdasarkan fokus CSR, lokasi, dan dampak." },
    { icon: Heart, title: "Dampak Terukur", desc: "Pantau perkembangan proyek secara real-time dengan laporan berkala dan indikator dampak yang jelas." },
    { icon: Globe, title: "Jangkauan Nasional", desc: "Menghubungkan korporasi, NGO, dan komunitas dari Sabang sampai Merauke di seluruh Indonesia." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sidebar to-sidebar/80 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Leaf className="w-4 h-4" />
            <span>Platform CSR Terpercaya di Indonesia</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Hubungkan CSR Anda<br />dengan Dampak Nyata
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            CSR Hub mempertemukan perusahaan dengan NGO, komunitas, dan sosial startup
            untuk menciptakan program CSR yang terukur, transparan, dan berdampak.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/proposals" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition-colors text-sm">
              Jelajahi Proposal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors text-sm">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-card border-b border-border">
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

      {/* Features */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">Mengapa CSR Hub?</h2>
            <p className="text-muted-foreground">Platform terlengkap untuk mengelola program CSR dari awal hingga pelaporan</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active proposals */}
      {proposals && (proposals as any).data?.length > 0 && (
        <section className="py-12 px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Proyek Aktif</h2>
                <p className="text-sm text-muted-foreground">Program CSR yang sedang berjalan</p>
              </div>
              <Link href="/proposals" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {((proposals as any).data ?? []).map((p: any) => (
                <Card key={p.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getStatusColor(p.status)} text-xs border-0`}>
                        {getStatusLabel(p.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{p.sdg_goals?.slice(0,2).join(", ")}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {formatRupiah(p.budget_requested)}
                      </span>
                      <Link href={`/proposals/${p.id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                        Detail <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Organizations */}
      {orgs && (orgs as any).data?.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Mitra Terverifikasi</h2>
                <p className="text-sm text-muted-foreground">Organisasi tepercaya yang siap bermitra</p>
              </div>
              <Link href="/organizations" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                Semua Organisasi <ArrowRight className="w-4 h-4" />
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
                    <p className="text-xs text-muted-foreground mb-2">{getStatusLabel(org.org_type)}</p>
                    {org.trust_score !== null && org.trust_score !== undefined && (
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Skor {org.trust_score}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 px-6 bg-primary text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Siap Menciptakan Dampak?</h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto">
          Bergabunglah dengan ratusan perusahaan dan NGO yang telah menggunakan CSR Hub.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition-colors text-sm">
            Daftar Sekarang — Gratis
          </Link>
          <Link href="/organizations" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors text-sm">
            Jelajahi Mitra
          </Link>
        </div>
      </section>
    </div>
  );
}
