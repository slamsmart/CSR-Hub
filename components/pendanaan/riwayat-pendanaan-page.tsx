"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign, TrendingUp, CheckCircle2, Clock, Download,
  ArrowUpRight, FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FUNDING_HISTORY = [
  {
    id: "f1",
    proposalNomor: "CSR-2025-00001",
    proposalTitle: "Beasiswa SMA Papua 2025",
    organization: "Yayasan Cerdas Nusantara",
    amount: 500000000,
    status: "DICAIRKAN",
    committedAt: "2025-02-01",
    disbursedAt: "2025-02-15",
    category: "PENDIDIKAN",
    province: "Papua",
    progressFisik: 30,
  },
  {
    id: "f2",
    proposalNomor: "CSR-2025-00002",
    proposalTitle: "Restorasi Mangrove Kalimantan 2025",
    organization: "Yayasan Lingkungan Hijau",
    amount: 700000000,
    status: "DISETUJUI",
    committedAt: "2025-03-01",
    disbursedAt: null,
    category: "LINGKUNGAN",
    province: "Kalimantan Timur",
    progressFisik: 40,
  },
  {
    id: "f3",
    proposalNomor: "CSR-2024-00089",
    proposalTitle: "Digitalisasi 200 UMKM Yogyakarta",
    organization: "Komunitas Digital Desa",
    amount: 300000000,
    status: "SELESAI",
    committedAt: "2024-06-01",
    disbursedAt: "2024-06-15",
    category: "TEKNOLOGI",
    province: "DI Yogyakarta",
    progressFisik: 100,
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  BERMINAT: { label: "Berminat", color: "warning" },
  DISETUJUI: { label: "Disetujui", color: "teal" },
  DICAIRKAN: { label: "Dicairkan", color: "success" },
  SELESAI: { label: "Selesai", color: "success" },
  DIBATALKAN: { label: "Dibatalkan", color: "destructive" },
};

export function RiwayatPendanaanPage() {
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = statusFilter
    ? FUNDING_HISTORY.filter((f) => f.status === statusFilter)
    : FUNDING_HISTORY;

  const totalComitted = FUNDING_HISTORY.reduce((s, f) => s + f.amount, 0);
  const totalDisbursed = FUNDING_HISTORY.filter((f) => ["DICAIRKAN", "SELESAI"].includes(f.status)).reduce((s, f) => s + f.amount, 0);
  const activeCount = FUNDING_HISTORY.filter((f) => ["DISETUJUI", "DICAIRKAN"].includes(f.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Riwayat Pendanaan</h1>
          <p className="section-subtitle">Semua komitmen dan realisasi pendanaan CSR perusahaan Anda.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Ekspor CSV
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Komitmen" value={formatRupiah(totalComitted, true)} icon={DollarSign} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Total Dicairkan" value={formatRupiah(totalDisbursed, true)} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Program Aktif" value={activeCount} icon={TrendingUp} iconColor="text-teal-600" iconBg="bg-teal-50" />
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["", "BERMINAT", "DISETUJUI", "DICAIRKAN", "SELESAI"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              statusFilter === s ? "bg-brand-600 text-white" : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {s === "" ? "Semua" : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-5 py-3 text-left font-semibold text-xs text-muted-foreground">Proposal</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Kategori</th>
                  <th className="px-4 py-3 text-right font-semibold text-xs text-muted-foreground">Jumlah</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Progres</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Tanggal</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const statusCfg = STATUS_CONFIG[f.status] || { label: f.status, color: "secondary" };
                  return (
                    <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium leading-snug">{f.proposalTitle}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{f.organization} · {f.province}</p>
                        <span className="text-[10px] font-mono text-muted-foreground">{f.proposalNomor}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="text-[10px]">{f.category}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-brand-600">
                        {formatRupiah(f.amount, true)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={statusCfg.color as any}>{statusCfg.label}</Badge>
                      </td>
                      <td className="px-4 py-4 w-32">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={f.progressFisik}
                            color={f.progressFisik === 100 ? "teal" : "brand"}
                            className="flex-1 h-1.5"
                          />
                          <span className="text-xs text-muted-foreground w-8">{f.progressFisik}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        <p>Komitmen: {formatDate(f.committedAt)}</p>
                        {f.disbursedAt && <p className="text-green-600">Cair: {formatDate(f.disbursedAt)}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <Button variant="ghost" size="icon-sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
