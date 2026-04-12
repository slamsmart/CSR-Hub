"use client";

import React, { useState } from "react";
import {
  FileBarChart, Download, Filter, CheckCircle2, AlertTriangle,
  XCircle, Clock, DollarSign, TrendingUp, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const AUDIT_REPORTS = [
  {
    id: "ar1",
    kode: "AUD-2025-001",
    projectName: "Beasiswa SMA Papua 2025",
    organization: "Yayasan Cerdas Nusantara",
    auditor: "Dr. Sri Mulyani",
    auditDate: "2025-03-31",
    period: "Q1 2025",
    status: "SELESAI",
    anggaranDialokasikan: 250000000,
    realisasi: 75000000,
    serapanRate: 30,
    temuanCount: 1,
    temuanKritis: 0,
    rating: "A",
    summary: "Realisasi anggaran sesuai rencana Q1. Tidak ada temuan kritis. Dokumentasi lengkap.",
  },
  {
    id: "ar2",
    kode: "AUD-2025-002",
    projectName: "Restorasi Mangrove Kalimantan",
    organization: "Yayasan Lingkungan Hijau",
    auditor: "Dr. Sri Mulyani",
    auditDate: "2025-03-31",
    period: "Q1 2025",
    status: "SELESAI",
    anggaranDialokasikan: 400000000,
    realisasi: 192000000,
    serapanRate: 48,
    temuanCount: 2,
    temuanKritis: 0,
    rating: "B+",
    summary: "Serapan anggaran sedikit di atas target. Dua temuan minor terkait dokumentasi pengadaan bibit.",
  },
  {
    id: "ar3",
    kode: "AUD-2025-003",
    projectName: "Air Bersih 25 Desa NTT",
    organization: "Komunitas Sehat Bersama",
    auditor: "Dr. Sri Mulyani",
    auditDate: "2025-04-05",
    period: "Q1 2025",
    status: "DALAM_REVIEW",
    anggaranDialokasikan: 800000000,
    realisasi: 150000000,
    serapanRate: 18,
    temuanCount: 3,
    temuanKritis: 1,
    rating: "C",
    summary: "Serapan rendah, terdapat 1 temuan kritis terkait ketidaksesuaian RAB aktual vs rencana.",
  },
];

const QUARTERLY_DATA = [
  { quarter: "Q1 2024", alokasi: 1200, realisasi: 980 },
  { quarter: "Q2 2024", alokasi: 1500, realisasi: 1380 },
  { quarter: "Q3 2024", alokasi: 1800, realisasi: 1750 },
  { quarter: "Q4 2024", alokasi: 2200, realisasi: 2150 },
  { quarter: "Q1 2025", alokasi: 1450, realisasi: 1170 },
];

const RATING_CONFIG: Record<string, { color: string; bg: string }> = {
  "A": { color: "text-green-700", bg: "bg-green-100" },
  "A-": { color: "text-green-600", bg: "bg-green-50" },
  "B+": { color: "text-teal-700", bg: "bg-teal-100" },
  "B": { color: "text-teal-600", bg: "bg-teal-50" },
  "C": { color: "text-yellow-700", bg: "bg-yellow-100" },
  "D": { color: "text-red-700", bg: "bg-red-100" },
};

export function LaporanAuditPage() {
  const [periodFilter, setPeriodFilter] = useState("Q1 2025");

  const filtered = AUDIT_REPORTS.filter((r) => r.period === periodFilter);
  const totalAlokasi = filtered.reduce((s, r) => s + r.anggaranDialokasikan, 0);
  const totalRealisasi = filtered.reduce((s, r) => s + r.realisasi, 0);
  const avgSerapan = filtered.length > 0 ? Math.round(filtered.reduce((s, r) => s + r.serapanRate, 0) / filtered.length) : 0;
  const totalTemuan = filtered.reduce((s, r) => s + r.temuanCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Laporan Audit</h1>
          <p className="section-subtitle">Hasil audit keuangan dan kepatuhan program CSR.</p>
        </div>
        <div className="flex gap-2">
          <select
            className="flex h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            {["Q1 2025", "Q4 2024", "Q3 2024", "Q2 2024"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Unduh Laporan
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Dialokasikan" value={formatRupiah(totalAlokasi, true)} icon={DollarSign} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Total Realisasi" value={formatRupiah(totalRealisasi, true)} icon={TrendingUp} iconColor="text-teal-600" iconBg="bg-teal-50" />
        <StatCard title="Rata-rata Serapan" value={`${avgSerapan}%`} icon={BarChart3} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Total Temuan" value={totalTemuan} icon={AlertTriangle} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Alokasi vs Realisasi Anggaran per Kuartal (Juta Rp)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={QUARTERLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `Rp ${v}M`} />
              <Legend />
              <Bar dataKey="alokasi" name="Alokasi" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="realisasi" name="Realisasi" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audit Reports List */}
      <div className="space-y-4">
        {filtered.map((report) => {
          const ratingCfg = RATING_CONFIG[report.rating] || RATING_CONFIG["B"];
          return (
            <Card key={report.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{report.kode}</span>
                      <Badge variant={report.status === "SELESAI" ? "success" : "warning"}>{report.status.replace("_", " ")}</Badge>
                      {report.temuanKritis > 0 && (
                        <Badge variant="destructive" className="text-xs">{report.temuanKritis} Temuan Kritis</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{report.projectName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{report.organization} · Auditor: {report.auditor}</p>
                    <p className="text-xs text-muted-foreground italic mt-2">{report.summary}</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black", ratingCfg.bg)}>
                      <span className={ratingCfg.color}>{report.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Rating</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Dialokasikan</p>
                    <p className="font-semibold text-sm">{formatRupiah(report.anggaranDialokasikan, true)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Realisasi</p>
                    <p className="font-semibold text-sm text-teal-600">{formatRupiah(report.realisasi, true)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Serapan</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={report.serapanRate}
                        color={report.serapanRate >= 80 ? "teal" : report.serapanRate >= 50 ? "brand" : "warning" as any}
                        className="flex-1 h-2"
                      />
                      <span className="text-xs font-bold w-8">{report.serapanRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {report.temuanCount} temuan · Audit: {formatDate(report.auditDate)}
                  </span>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <FileBarChart className="h-3.5 w-3.5" />
                    Detail Laporan
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
