"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, Filter, SlidersHorizontal, ArrowUpRight, RefreshCw,
  Target, TrendingUp, BarChart3, Info, CheckCircle2, MapPin,
  Users, DollarSign, Star, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DUMMY_MATCHES = [
  {
    id: "m1",
    proposalId: "p1",
    nomor: "CSR-2025-00045",
    title: "Beasiswa SMA untuk 500 Pelajar di Wilayah 3T Papua",
    organization: "Yayasan Pendidikan Timur Indonesia",
    orgVerified: "TERVERIFIKASI",
    province: "Papua",
    category: "PENDIDIKAN",
    budgetTotal: 1200000000,
    targetBeneficiaries: 500,
    sdgs: ["SDG4", "SDG10"],
    matchScore: 94,
    matchBreakdown: {
      kategori: 25,
      sdg: 18,
      wilayah: 15,
      anggaran: 20,
      dampak: 14,
      risiko: 2,
    },
    aiSummary: "Program beasiswa komprehensif dengan sasaran pelajar berprestasi dari keluarga kurang mampu. Selaras dengan fokus CSR pendidikan perusahaan dan wilayah operasional Papua.",
    status: "DIKIRIM",
    createdAt: "2025-03-20",
    isShortlisted: true,
  },
  {
    id: "m2",
    proposalId: "p2",
    nomor: "CSR-2025-00067",
    title: "Pembangunan Fasilitas Air Bersih 20 Desa di NTT",
    organization: "Yayasan Air untuk Semua",
    orgVerified: "TERVERIFIKASI",
    province: "Nusa Tenggara Timur",
    category: "KESEHATAN",
    budgetTotal: 850000000,
    targetBeneficiaries: 12000,
    sdgs: ["SDG6", "SDG3"],
    matchScore: 88,
    matchBreakdown: {
      kategori: 20,
      sdg: 20,
      wilayah: 15,
      anggaran: 18,
      dampak: 13,
      risiko: 2,
    },
    aiSummary: "Program infrastruktur air bersih yang terencana dengan baik, mencakup 20 desa dengan sistem berkelanjutan. Dampak tinggi dengan biaya efisien per penerima manfaat.",
    status: "DALAM_REVIEW",
    createdAt: "2025-03-18",
    isShortlisted: false,
  },
  {
    id: "m3",
    proposalId: "p3",
    nomor: "CSR-2025-00089",
    title: "Pelatihan Teknologi Digital untuk 1.000 Pemuda di Kalimantan",
    organization: "Komunitas Coding Borneo",
    orgVerified: "TERVERIFIKASI",
    province: "Kalimantan Timur",
    category: "TEKNOLOGI",
    budgetTotal: 600000000,
    targetBeneficiaries: 1000,
    sdgs: ["SDG8", "SDG4"],
    matchScore: 82,
    matchBreakdown: {
      kategori: 20,
      sdg: 16,
      wilayah: 15,
      anggaran: 15,
      dampak: 14,
      risiko: 2,
    },
    aiSummary: "Program pelatihan coding dan digital skills untuk pemuda produktif. Selaras dengan inisiatif digital transformation perusahaan dan mendukung ekosistem talenta tech Indonesia.",
    status: "DIKIRIM",
    createdAt: "2025-03-15",
    isShortlisted: false,
  },
  {
    id: "m4",
    proposalId: "p4",
    nomor: "CSR-2025-00102",
    title: "Revitalisasi Hutan Mangrove 200 Hektar di Sulawesi",
    organization: "Forum Peduli Lingkungan Sulawesi",
    orgVerified: "DALAM_PROSES",
    province: "Sulawesi Selatan",
    category: "LINGKUNGAN",
    budgetTotal: 950000000,
    targetBeneficiaries: 5000,
    sdgs: ["SDG13", "SDG14", "SDG15"],
    matchScore: 76,
    matchBreakdown: {
      kategori: 15,
      sdg: 20,
      wilayah: 10,
      anggaran: 16,
      dampak: 13,
      risiko: 2,
    },
    aiSummary: "Program restorasi ekosistem mangrove dengan metode terbukti. Kontribusi signifikan terhadap pengurangan emisi karbon sesuai target keberlanjutan perusahaan.",
    status: "DIKIRIM",
    createdAt: "2025-03-12",
    isShortlisted: false,
  },
  {
    id: "m5",
    proposalId: "p5",
    nomor: "CSR-2025-00115",
    title: "Pemberdayaan 300 Nelayan Tradisional di Pesisir Jawa",
    organization: "Koperasi Nelayan Maju Bersama",
    orgVerified: "TERVERIFIKASI",
    province: "Jawa Timur",
    category: "EKONOMI",
    budgetTotal: 420000000,
    targetBeneficiaries: 300,
    sdgs: ["SDG8", "SDG14"],
    matchScore: 71,
    matchBreakdown: {
      kategori: 10,
      sdg: 15,
      wilayah: 15,
      anggaran: 15,
      dampak: 14,
      risiko: 2,
    },
    aiSummary: "Program pemberdayaan ekonomi nelayan dengan pelatihan dan akses pasar digital. Dampak langsung pada peningkatan pendapatan komunitas pesisir.",
    status: "DALAM_REVIEW",
    createdAt: "2025-03-10",
    isShortlisted: false,
  },
];

const SCORE_COLOR = (score: number) => {
  if (score >= 85) return "text-green-600 bg-green-50";
  if (score >= 70) return "text-blue-600 bg-blue-50";
  return "text-yellow-600 bg-yellow-50";
};

export function AIMatchingPage() {
  const [minScore, setMinScore] = useState(60);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shortlisted, setShortlisted] = useState<Set<string>>(
    new Set(DUMMY_MATCHES.filter((m) => m.isShortlisted).map((m) => m.id))
  );

  const filtered = DUMMY_MATCHES
    .filter((m) => m.matchScore >= minScore)
    .filter((m) => !categoryFilter || m.category === categoryFilter);

  const avgScore = filtered.length > 0
    ? Math.round(filtered.reduce((s, m) => s + m.matchScore, 0) / filtered.length)
    : 0;

  function toggleShortlist(id: string) {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-500" />
            AI Matching
          </h1>
          <p className="section-subtitle">Proposal CSR yang paling sesuai dengan profil dan prioritas perusahaan Anda.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Perbarui Matching
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Proposal Tercocok" value={filtered.length} icon={Target} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Rata-rata Skor" value={`${avgScore}%`} icon={TrendingUp} iconColor="text-teal-600" iconBg="bg-teal-50" />
        <StatCard title="Shortlisted" value={shortlisted.size} icon={Star} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        <StatCard title="Skor Tertinggi" value={`${filtered[0]?.matchScore || 0}%`} icon={BarChart3} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      {/* AI Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-100">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="font-semibold text-brand-700 text-sm">Cara Kerja AI Matching</p>
            <p className="text-xs text-brand-600 mt-1 leading-relaxed">
              Algoritma AI kami menganalisis 6 dimensi: <strong>Kesesuaian Kategori (25pt)</strong>,{" "}
              <strong>Penyelarasan SDG (20pt)</strong>, <strong>Kesesuaian Wilayah (15pt)</strong>,{" "}
              <strong>Kompatibilitas Anggaran (20pt)</strong>, <strong>Potensi Dampak (15pt)</strong>,{" "}
              dan <strong>Risiko Program (5pt)</strong>. Skor dihitung real-time berdasarkan profil CSR perusahaan Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center p-4 rounded-xl border bg-card">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium whitespace-nowrap">Skor Minimum:</label>
          <input
            type="range"
            min={50}
            max={90}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-32 accent-brand-600"
          />
          <span className="text-sm font-bold text-brand-600 w-10">{minScore}%</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "PENDIDIKAN", "KESEHATAN", "LINGKUNGAN", "EKONOMI", "TEKNOLOGI"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                categoryFilter === cat
                  ? "bg-brand-600 text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {cat || "Semua"}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {filtered.map((match, index) => {
          const isExpanded = expandedId === match.id;
          const isStarred = shortlisted.has(match.id);

          return (
            <Card key={match.id} className={cn("overflow-hidden", isStarred && "border-yellow-300")}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 text-center w-10">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-sm font-black",
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-gray-100 text-gray-600" :
                      index === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                    )}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">{match.nomor}</span>
                          <Badge variant="secondary" className="text-[10px]">{match.category}</Badge>
                          {match.sdgs.map((sdg) => (
                            <Badge key={sdg} variant="brand" className="text-[10px]">{sdg}</Badge>
                          ))}
                        </div>
                        <h3 className="font-semibold text-sm leading-snug">{match.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{match.organization}</span>
                          <VerificationBadge status={match.orgVerified as any} showLabel={false} size="sm" />
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{match.province}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className={cn(
                        "flex-shrink-0 text-center px-3 py-2 rounded-xl font-black text-2xl",
                        SCORE_COLOR(match.matchScore)
                      )}>
                        {match.matchScore}
                        <span className="text-xs font-normal block leading-none">%</span>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed italic">
                      "{match.aiSummary}"
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />{formatRupiah(match.budgetTotal, true)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{match.targetBeneficiaries.toLocaleString("id-ID")} penerima
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />{match.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Expand breakdown */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Breakdown Skor Matching</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(match.matchBreakdown).map(([key, val]) => {
                            const maxMap: Record<string, number> = {
                              kategori: 25, sdg: 20, wilayah: 15, anggaran: 20, dampak: 15, risiko: 5
                            };
                            const max = maxMap[key] || 25;
                            return (
                              <div key={key} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="capitalize text-muted-foreground">{key}</span>
                                  <span className="font-medium">{val}/{max}</span>
                                </div>
                                <Progress value={(val / max) * 100} color="brand" className="h-1.5" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : match.id)}
                        className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        {isExpanded ? "Sembunyikan" : "Lihat Breakdown"}
                        <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
                      </button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn("h-8 gap-1 text-xs", isStarred && "text-yellow-600")}
                          onClick={() => toggleShortlist(match.id)}
                        >
                          <Star className={cn("h-3.5 w-3.5", isStarred && "fill-yellow-500")} />
                          {isStarred ? "Disimpan" : "Simpan"}
                        </Button>
                        <Link href={`/proposals/${match.proposalId}`}>
                          <Button variant="brand" size="sm" className="h-8 gap-1 text-xs">
                            Lihat Proposal <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Tidak ada proposal yang cocok</p>
            <p className="text-sm mt-1">Coba turunkan skor minimum atau ubah filter kategori</p>
          </div>
        )}
      </div>
    </div>
  );
}
