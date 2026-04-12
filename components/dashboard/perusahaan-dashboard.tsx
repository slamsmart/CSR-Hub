"use client";

import React from "react";
import Link from "next/link";
import {
  FileText, Search, Star, DollarSign, TrendingUp, Users, BarChart3,
  ArrowRight, Sparkles, PieChart, HandCoins,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProposalStatusBadge } from "@/components/ui/proposal-status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Progress } from "@/components/ui/progress";
import { formatRupiah } from "@/lib/utils";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RPieChart, Pie, Cell,
} from "recharts";

const INCOMING_PROPOSALS = [
  {
    id: "1", nomor: "CSR-2025-12847", title: "Program Beasiswa Anak Pesisir",
    org: "Yayasan Cerdas Nusantara", status: "DIKIRIM" as const, amount: 450000000,
    category: "PENDIDIKAN", provinsi: "Jawa Timur", matchScore: 92,
    verificationStatus: "TERVERIFIKASI" as const,
  },
  {
    id: "2", nomor: "CSR-2025-12832", title: "Penghijauan Kota 5.000 Pohon",
    org: "Komunitas Hijau Jakarta", status: "DIKIRIM" as const, amount: 320000000,
    category: "LINGKUNGAN_HIDUP", provinsi: "DKI Jakarta", matchScore: 85,
    verificationStatus: "TERVERIFIKASI" as const,
  },
  {
    id: "3", nomor: "CSR-2025-12818", title: "Klinik Kesehatan Gratis Lansia",
    org: "Yayasan Sehat Sejahtera", status: "DIKIRIM" as const, amount: 280000000,
    category: "KESEHATAN_MASYARAKAT", provinsi: "Jawa Barat", matchScore: 78,
    verificationStatus: "TERVERIFIKASI" as const,
  },
];

const MY_PROJECTS = [
  {
    id: "1", name: "Beasiswa 100 Mahasiswa IT", org: "Yayasan Cerdas Digital",
    progress: 72, realisasi: 720000000, total: 1000000000,
  },
  {
    id: "2", name: "Hutan Kota Surabaya", org: "Komunitas Hijau Surabaya",
    progress: 45, realisasi: 225000000, total: 500000000,
  },
];

const SDG_CONTRIBUTIONS = [
  { sdg: "SDG 4", label: "Pendidikan", pct: 42, color: "#ef4444" },
  { sdg: "SDG 13", label: "Iklim", pct: 28, color: "#14b8a6" },
  { sdg: "SDG 3", label: "Kesehatan", pct: 18, color: "#22c55e" },
  { sdg: "SDG 8", label: "Pekerjaan", pct: 12, color: "#f59e0b" },
];

const KATEGORI_DATA = [
  { name: "Pendidikan", jumlah: 4200000000 },
  { name: "Lingkungan", jumlah: 2800000000 },
  { name: "Kesehatan", jumlah: 1800000000 },
  { name: "Ekonomi", jumlah: 1200000000 },
];

export function PerusahaanDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Dashboard CSR Perusahaan</h1>
          <p className="section-subtitle">
            Temukan, seleksi, dan kelola program CSR yang berdampak.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/perusahaan/matching">
            <Button variant="brand-outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Matching
            </Button>
          </Link>
          <Link href="/perusahaan/proposal-masuk">
            <Button variant="brand" className="gap-2">
              <Search className="h-4 w-4" />
              Jelajahi Proposal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Proposal Masuk"
          value="47"
          subtitle="3 menunggu tindakan"
          icon={FileText}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
          trend={{ value: 24, label: "bulan ini", positive: true }}
        />
        <StatCard
          title="Dana Tersalurkan"
          value="Rp 12,4M"
          subtitle="Target 2025: Rp 20M"
          icon={DollarSign}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <StatCard
          title="Proyek Aktif"
          value="8"
          subtitle="2 selesai bulan ini"
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Total Penerima"
          value="24.560"
          subtitle="Dari 12 program"
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
      </div>

      {/* AI Recommendations Banner */}
      <div className="rounded-2xl gradient-brand p-5 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Smart Matching Menemukan 12 Proposal Baru!</h3>
            <p className="text-sm text-white/80 mt-0.5">
              Berdasarkan fokus CSR Anda, kami menemukan proposal dengan match score ≥80%
            </p>
          </div>
        </div>
        <Link href="/perusahaan/matching">
          <Button
            className="bg-white text-brand-700 hover:bg-white/90 border-0 flex-shrink-0 gap-2 font-semibold"
          >
            Lihat Rekomendasi
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Incoming Proposals */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Proposal Masuk Terbaru</CardTitle>
              <Link href="/perusahaan/proposal-masuk" className="text-xs text-brand-600 hover:underline">
                Lihat semua 47 →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {INCOMING_PROPOSALS.map((p) => (
              <div key={p.id} className="px-6 py-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Match Score */}
                  <div className="flex-shrink-0 text-center">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                      p.matchScore >= 90 ? "bg-green-100 text-green-700" :
                      p.matchScore >= 75 ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {p.matchScore}%
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Match</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <ProposalStatusBadge status={p.status} />
                      <VerificationBadge status={p.verificationStatus} showLabel={false} />
                      <Badge variant="secondary" className="text-[10px]">{p.provinsi}</Badge>
                    </div>
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.org}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-brand-600">
                      {formatRupiah(p.amount, true)}
                    </p>
                    <div className="flex gap-1 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Link href={`/perusahaan/proposal/${p.id}`}>
                        <Button variant="brand" size="sm" className="h-7 text-xs gap-1">
                          Review <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SDG Contributions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4 text-teal-600" />
                Kontribusi SDGs 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SDG_CONTRIBUTIONS.map((sdg) => (
                  <div key={sdg.sdg}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{sdg.sdg}: {sdg.label}</span>
                      <span className="text-muted-foreground">{sdg.pct}%</span>
                    </div>
                    <Progress
                      value={sdg.pct}
                      className="h-2"
                      style={{ "--primary": sdg.color } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Co-Funding Opportunity */}
          <Card className="border-brand-200 bg-brand-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-brand-100 flex items-center justify-center">
                  <HandCoins className="h-4 w-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Co-Funding Tersedia</p>
                  <p className="text-xs text-muted-foreground">3 proposal mencari co-funder</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Berkolaborasi dengan perusahaan lain untuk mendanai program dampak besar.
              </p>
              <Link href="/perusahaan/cofunding">
                <Button variant="brand-outline" size="sm" className="w-full gap-2">
                  Lihat Peluang
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Proyek Aktif</CardTitle>
            <Link href="/perusahaan/proyek" className="text-xs text-brand-600 hover:underline">
              Lihat semua →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {MY_PROJECTS.map((project) => (
              <div key={project.id} className="rounded-xl border p-4 hover:border-brand-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{project.org}</p>
                  </div>
                  <Link href={`/perusahaan/proyek/${project.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progres Program</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} color="brand" className="h-1.5" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Dana terpakai: {formatRupiah(project.realisasi, true)}</span>
                    <span>dari {formatRupiah(project.total, true)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
