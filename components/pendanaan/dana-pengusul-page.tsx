"use client";

import React from "react";
import {
  DollarSign, CheckCircle2, Clock, AlertTriangle, Download,
  TrendingUp, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DISBURSEMENTS = [
  {
    id: "d1",
    proposalNomor: "CSR-2025-00001",
    proposalTitle: "Beasiswa SMA Papua 2025",
    company: "PT Pertamina (Persero)",
    totalComitment: 500000000,
    disbursed: 75000000,
    remaining: 425000000,
    nextDisbursement: 75000000,
    nextDate: "2025-05-01",
    status: "BERJALAN",
    disbursements: [
      { seq: 1, amount: 75000000, date: "2025-02-15", purpose: "Tahap 1 - Rekrutmen & Biaya Awal", status: "CAIR" },
    ],
  },
  {
    id: "d2",
    proposalNomor: "CSR-2025-00002",
    proposalTitle: "Restorasi Mangrove Kalimantan",
    company: "PT Pertamina (Persero)",
    totalComitment: 700000000,
    disbursed: 280000000,
    remaining: 420000000,
    nextDisbursement: 140000000,
    nextDate: "2025-06-01",
    status: "BERJALAN",
    disbursements: [
      { seq: 1, amount: 140000000, date: "2025-03-10", purpose: "Tahap 1 - Survey & Bibit", status: "CAIR" },
      { seq: 2, amount: 140000000, date: "2025-04-20", purpose: "Tahap 2 - Penanaman Fase 1", status: "CAIR" },
    ],
  },
];

export function DanaPengusulPage() {
  const totalComitted = DISBURSEMENTS.reduce((s, d) => s + d.totalComitment, 0);
  const totalDisbursed = DISBURSEMENTS.reduce((s, d) => s + d.disbursed, 0);
  const totalRemaining = DISBURSEMENTS.reduce((s, d) => s + d.remaining, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Riwayat Dana</h1>
          <p className="section-subtitle">Tracking pencairan dana dari semua program yang Anda kelola.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Ekspor Laporan
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Dikucurkan" value={formatRupiah(totalComitted, true)} icon={DollarSign} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Sudah Cair" value={formatRupiah(totalDisbursed, true)} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Sisa Komitmen" value={formatRupiah(totalRemaining, true)} icon={Clock} iconColor="text-teal-600" iconBg="bg-teal-50" />
      </div>

      <div className="space-y-4">
        {DISBURSEMENTS.map((d) => {
          const pct = Math.round((d.disbursed / d.totalComitment) * 100);
          return (
            <Card key={d.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{d.proposalNomor}</span>
                    <h3 className="font-semibold text-sm mt-0.5">{d.proposalTitle}</h3>
                    <p className="text-xs text-muted-foreground">Donor: {d.company}</p>
                  </div>
                  <Badge variant={d.status === "BERJALAN" ? "teal" : "success"}>{d.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Realisasi Pencairan</span>
                    <span className="font-semibold">
                      {formatRupiah(d.disbursed, true)} / {formatRupiah(d.totalComitment, true)}
                    </span>
                  </div>
                  <Progress value={pct} color="brand" className="h-2" />
                  <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>{pct}% telah cair</span>
                    <span>Sisa: {formatRupiah(d.remaining, true)}</span>
                  </div>
                </div>

                {/* Disbursement history */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Riwayat Pencairan</p>
                  {d.disbursements.map((item) => (
                    <div key={item.seq} className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                          {item.seq}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.purpose}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-green-700">{formatRupiah(item.amount, true)}</p>
                        <Badge variant="success" className="text-[10px]">{item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next disbursement */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50 border border-brand-100">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium text-brand-700">Pencairan Berikutnya</p>
                      <p className="text-xs text-brand-600">Estimasi: {formatDate(d.nextDate)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-brand-600">{formatRupiah(d.nextDisbursement, true)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
