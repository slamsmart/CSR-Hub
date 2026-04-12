"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users, DollarSign, TrendingUp, ArrowRight, Plus,
  CheckCircle2, Clock, AlertTriangle, Building2, Target,
  HandshakeIcon, BarChart3, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DUMMY_COFUNDING = [
  {
    id: "cf1",
    proposalId: "p1",
    proposalTitle: "Revitalisasi 20 Sekolah Dasar Terpencil di NTT",
    proposalNomor: "CSR-2025-00021",
    category: "PENDIDIKAN",
    totalTarget: 1500000000,
    totalSecured: 950000000,
    myCommitment: 250000000,
    status: "AKTIF",
    deadline: "2025-05-30",
    participants: [
      { name: "PT Semen Indonesia", amount: 400000000, confirmed: true },
      { name: "PT Bank Mandiri", amount: 300000000, confirmed: true },
      { name: "PT Telkom Indonesia", amount: 250000000, confirmed: true },
      { name: "PT Astra International", amount: 200000000, confirmed: false },
    ],
    organization: "Yayasan Pendidikan Nusantara",
    province: "Nusa Tenggara Timur",
    sdgs: ["SDG4", "SDG10"],
    description: "Program revitalisasi fisik dan peningkatan kualitas pendidikan untuk 20 sekolah dasar di wilayah 3T (Terdepan, Terluar, Tertinggal) di Nusa Tenggara Timur.",
  },
  {
    id: "cf2",
    proposalId: "p2",
    proposalTitle: "Pemberdayaan 500 UMKM Perempuan di Jawa Tengah",
    proposalNomor: "CSR-2025-00034",
    category: "EKONOMI",
    totalTarget: 800000000,
    totalSecured: 320000000,
    myCommitment: 150000000,
    status: "MENUNGGU",
    deadline: "2025-06-15",
    participants: [
      { name: "PT Bank BRI", amount: 170000000, confirmed: true },
      { name: "PT Telkom Indonesia", amount: 150000000, confirmed: false },
    ],
    organization: "Koperasi Wanita Mandiri",
    province: "Jawa Tengah",
    sdgs: ["SDG8", "SDG5"],
    description: "Pelatihan kewirausahaan digital, akses modal, dan pendampingan bisnis bagi 500 pelaku UMKM perempuan di Jawa Tengah.",
  },
  {
    id: "cf3",
    proposalId: "p3",
    proposalTitle: "Penanaman 100.000 Mangrove di Pesisir Kalimantan",
    proposalNomor: "CSR-2025-00056",
    category: "LINGKUNGAN",
    totalTarget: 600000000,
    totalSecured: 600000000,
    myCommitment: 200000000,
    status: "SELESAI",
    deadline: "2025-02-28",
    participants: [
      { name: "PT Pertamina", amount: 200000000, confirmed: true },
      { name: "PT Telkom Indonesia", amount: 200000000, confirmed: true },
      { name: "PT PLN", amount: 200000000, confirmed: true },
    ],
    organization: "Yayasan Hijau Kalimantan",
    province: "Kalimantan Timur",
    sdgs: ["SDG13", "SDG14", "SDG15"],
    description: "Program restorasi ekosistem mangrove seluas 50 hektar di pesisir Kalimantan Timur untuk mitigasi perubahan iklim dan perlindungan biodiversitas.",
  },
];

const AVAILABLE_PROPOSALS = [
  {
    id: "ap1",
    nomor: "CSR-2025-00078",
    title: "Klinik Kesehatan Gratis untuk 10.000 Masyarakat Papua",
    category: "KESEHATAN",
    budgetTarget: 2000000000,
    currentFunding: 500000000,
    organization: "Perkumpulan Dokter Kemanusiaan",
    province: "Papua",
    matchScore: 87,
    participantCount: 3,
    deadline: "2025-07-31",
  },
  {
    id: "ap2",
    nomor: "CSR-2025-00092",
    title: "Internet Desa untuk 50 Desa di Sulawesi Tengah",
    category: "TEKNOLOGI",
    budgetTarget: 900000000,
    currentFunding: 0,
    organization: "Yayasan Digital Desa",
    province: "Sulawesi Tengah",
    matchScore: 79,
    participantCount: 0,
    deadline: "2025-08-15",
  },
];

export function CofundingPage() {
  const [activeTab, setActiveTab] = useState<"saya" | "tersedia">("saya");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const myTotal = DUMMY_COFUNDING.reduce((sum, c) => sum + c.myCommitment, 0);
  const activeCount = DUMMY_COFUNDING.filter((c) => c.status === "AKTIF").length;
  const completedCount = DUMMY_COFUNDING.filter((c) => c.status === "SELESAI").length;

  const filtered = statusFilter
    ? DUMMY_COFUNDING.filter((c) => c.status === statusFilter)
    : DUMMY_COFUNDING;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Co-Funding & Kolaborasi</h1>
          <p className="section-subtitle">Bergabung dalam pendanaan bersama untuk dampak lebih besar.</p>
        </div>
        <Button variant="brand" className="gap-2">
          <Plus className="h-4 w-4" />
          Temukan Peluang
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total Komitmen Saya"
          value={formatRupiah(myTotal, true)}
          icon={DollarSign}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
        />
        <StatCard
          title="Kolaborasi Aktif"
          value={activeCount}
          icon={HandshakeIcon}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <StatCard
          title="Program Selesai"
          value={completedCount}
          icon={CheckCircle2}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Perusahaan Bergabung"
          value="12"
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {([
          { key: "saya", label: "Kolaborasi Saya" },
          { key: "tersedia", label: "Peluang Baru" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* My Collaborations Tab */}
      {activeTab === "saya" && (
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex gap-2">
            {["", "AKTIF", "MENUNGGU", "SELESAI"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  statusFilter === s
                    ? "bg-brand-600 text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {s === "" ? "Semua" : s}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((cf) => {
              const fundingPct = Math.round((cf.totalSecured / cf.totalTarget) * 100);
              const isExpanded = expandedId === cf.id;
              const confirmedParticipants = cf.participants.filter((p) => p.confirmed).length;

              return (
                <Card key={cf.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">{cf.proposalNomor}</span>
                          <Badge
                            variant={cf.status === "AKTIF" ? "teal" : cf.status === "SELESAI" ? "success" : "warning"}
                          >
                            {cf.status}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">{cf.category}</Badge>
                        </div>
                        <h3 className="font-semibold text-sm leading-snug">{cf.proposalTitle}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cf.organization} · {cf.province}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-brand-600">{formatRupiah(cf.myCommitment, true)}</p>
                        <p className="text-xs text-muted-foreground">Komitmen Saya</p>
                      </div>
                    </div>

                    {/* Funding progress */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total Terkumpul</span>
                        <span className="font-semibold">
                          {formatRupiah(cf.totalSecured, true)} / {formatRupiah(cf.totalTarget, true)}
                        </span>
                      </div>
                      <Progress value={fundingPct} color={fundingPct >= 100 ? "teal" : "brand"} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{confirmedParticipants}/{cf.participants.length} partisipan konfirmasi</span>
                        <span>{fundingPct}% terkumpul</span>
                      </div>
                    </div>

                    {/* Deadline & expand */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Tenggat: {formatDate(cf.deadline)}</span>
                      </div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : cf.id)}
                        className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        {isExpanded ? "Sembunyikan" : "Detail Partisipan"}
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>

                    {/* Expanded participants */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Partisipan Co-Funding</p>
                        {cf.participants.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">
                                {p.name.charAt(3)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {p.confirmed ? "Terkonfirmasi" : "Menunggu konfirmasi"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{formatRupiah(p.amount, true)}</p>
                              {p.confirmed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto mt-0.5" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500 ml-auto mt-0.5" />
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            Undang Perusahaan Lain
                          </Button>
                          <Link href={`/proposals/${cf.proposalId}`}>
                            <Button variant="brand" size="sm" className="gap-1 text-xs">
                              Lihat Proposal <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Proposals Tab */}
      {activeTab === "tersedia" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 flex items-start gap-3">
            <Target className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-brand-700">Peluang Co-Funding Terkurasi AI</p>
              <p className="text-xs text-brand-600 mt-0.5">
                Daftar proposal berikut direkomendasikan berdasarkan profil CSR perusahaan Anda dan kebutuhan pendanaan bersama.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {AVAILABLE_PROPOSALS.map((ap) => {
              const pct = Math.round((ap.currentFunding / ap.budgetTarget) * 100);
              return (
                <Card key={ap.id} hover className="overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{ap.nomor}</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          ap.matchScore >= 80 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {ap.matchScore}% Match
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm leading-snug">{ap.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{ap.organization} · {ap.province}</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Terkumpul</span>
                        <span className="font-medium">{formatRupiah(ap.currentFunding, true)} / {formatRupiah(ap.budgetTarget, true)}</span>
                      </div>
                      <Progress value={pct} color="brand" className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{ap.participantCount} partisipan · Tenggat {formatDate(ap.deadline)}</span>
                      <Badge variant="secondary" className="text-[10px]">{ap.category}</Badge>
                    </div>

                    <div className="flex gap-2 pt-1 border-t">
                      <Link href={`/proposals/${ap.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Pelajari Proposal
                        </Button>
                      </Link>
                      <Button variant="brand" size="sm" className="flex-1 gap-1 text-xs">
                        <Plus className="h-3 w-3" />
                        Bergabung
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
