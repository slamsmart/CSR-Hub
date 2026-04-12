"use client";

import React, { useState } from "react";
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, TrendingDown,
  FileWarning, Building2, XCircle, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type RiskLevel = "KRITIS" | "TINGGI" | "SEDANG" | "RENDAH";

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string }> = {
  KRITIS: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  TINGGI: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  SEDANG: { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  RENDAH: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
};

const ALERTS = [
  {
    id: "ra1",
    level: "KRITIS" as RiskLevel,
    type: "REALISASI_RENDAH",
    title: "Serapan Dana Sangat Rendah",
    description: "Proyek 'Air Bersih NTT' baru menyerap 18% dana setelah 30 hari berjalan. Risiko ketidaktercapaian target tinggi.",
    entity: "Komunitas Sehat Bersama",
    proposalNomor: "CSR-2025-00003",
    detectedAt: "2025-04-09T14:00:00Z",
    isResolved: false,
  },
  {
    id: "ra2",
    level: "TINGGI" as RiskLevel,
    type: "LAPORAN_TERLAMBAT",
    title: "Laporan Berkala Terlambat",
    description: "Laporan bulanan Maret 2025 untuk proyek 'Beasiswa Papua' belum disubmit (jatuh tempo 31 Maret 2025, sudah 10 hari terlambat).",
    entity: "Yayasan Cerdas Nusantara",
    proposalNomor: "CSR-2025-00001",
    detectedAt: "2025-04-10T00:00:00Z",
    isResolved: false,
  },
  {
    id: "ra3",
    level: "SEDANG" as RiskLevel,
    type: "DOKUMEN_KEDALUWARSA",
    title: "Dokumen Verifikasi Hampir Kedaluwarsa",
    description: "SIUP PT Inovasi Digital Mandiri akan habis masa berlakunya dalam 30 hari (15 Mei 2025). Perlu pembaruan segera.",
    entity: "PT Inovasi Digital Mandiri",
    proposalNomor: null,
    detectedAt: "2025-04-08T09:00:00Z",
    isResolved: false,
  },
  {
    id: "ra4",
    level: "SEDANG" as RiskLevel,
    type: "VERIFIKASI_TERTUNDA",
    title: "Verifikasi Melewati SLA",
    description: "4 pengajuan verifikasi organisasi sudah melewati batas waktu 5 hari kerja. Perlu eskalasi ke verifikator.",
    entity: "Tim Verifikator",
    proposalNomor: null,
    detectedAt: "2025-04-07T10:00:00Z",
    isResolved: true,
  },
  {
    id: "ra5",
    level: "RENDAH" as RiskLevel,
    type: "MATCH_RENDAH",
    title: "Proposal Tanpa Match Perusahaan",
    description: "5 proposal aktif (>14 hari) belum mendapatkan ketertarikan dari perusahaan manapun. Pertimbangkan promosi aktif.",
    entity: "Platform CSR Hub",
    proposalNomor: null,
    detectedAt: "2025-04-06T12:00:00Z",
    isResolved: false,
  },
];

export function RiskAlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [levelFilter, setLevelFilter] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  function resolveAlert(id: string) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isResolved: true } : a));
  }

  const filtered = alerts.filter((a) => {
    if (!showResolved && a.isResolved) return false;
    if (levelFilter && a.level !== levelFilter) return false;
    return true;
  });

  const kritisCount = alerts.filter((a) => a.level === "KRITIS" && !a.isResolved).length;
  const tinggiCount = alerts.filter((a) => a.level === "TINGGI" && !a.isResolved).length;
  const openCount = alerts.filter((a) => !a.isResolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Risk Alerts</h1>
        <p className="section-subtitle">Peringatan dan anomali yang perlu tindakan segera.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Kritis" value={kritisCount} icon={ShieldAlert} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Tinggi" value={tinggiCount} icon={AlertTriangle} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Total Terbuka" value={openCount} icon={Clock} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        <StatCard title="Diselesaikan" value={alerts.filter((a) => a.isResolved).length} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-2">
          {["", "KRITIS", "TINGGI", "SEDANG", "RENDAH"].map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                levelFilter === l ? "bg-brand-600 text-white" : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {l || "Semua"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="h-3.5 w-3.5 rounded"
          />
          Tampilkan yang sudah diselesaikan
        </label>
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => {
          const cfg = RISK_CONFIG[alert.level];
          return (
            <div
              key={alert.id}
              className={cn(
                "rounded-xl border p-4 transition-opacity",
                cfg.bg, cfg.border,
                alert.isResolved && "opacity-50"
              )}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={cn("h-5 w-5 flex-shrink-0 mt-0.5", cfg.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={cn("text-[10px]", cfg.color, cfg.bg, "border-current")}
                      variant="outline"
                    >
                      {alert.level}
                    </Badge>
                    {alert.isResolved && (
                      <Badge variant="success" className="text-[10px]">Diselesaikan</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(alert.detectedAt)}</span>
                  </div>
                  <p className={cn("font-semibold text-sm", cfg.color)}>{alert.title}</p>
                  <p className="text-sm mt-0.5 text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />{alert.entity}
                    </span>
                    {alert.proposalNomor && (
                      <span className="font-mono">{alert.proposalNomor}</span>
                    )}
                  </div>
                </div>
                {!alert.isResolved && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                      <Eye className="h-3.5 w-3.5" />
                      Tinjau
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-xs text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selesai
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
