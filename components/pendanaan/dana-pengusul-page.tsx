"use client";

import React from "react";
import { DollarSign, CheckCircle2, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate } from "@/lib/utils";

const DISBURSEMENTS = [
  {
    id: "d1",
    proposalNomor: "CSR-2025-00001",
    proposalTitle: "Papua Senior High School Scholarship 2025",
    company: "PT Pertamina (Persero)",
    totalComitment: 500000000,
    disbursed: 75000000,
    remaining: 425000000,
    nextDisbursement: 75000000,
    nextDate: "2025-05-01",
    status: "BERJALAN",
    disbursements: [
      { seq: 1, amount: 75000000, date: "2025-02-15", purpose: "Stage 1 - Recruitment & Initial Costs", status: "CAIR" },
    ],
  },
  {
    id: "d2",
    proposalNomor: "CSR-2025-00002",
    proposalTitle: "Kalimantan Mangrove Restoration",
    company: "PT Pertamina (Persero)",
    totalComitment: 700000000,
    disbursed: 280000000,
    remaining: 420000000,
    nextDisbursement: 140000000,
    nextDate: "2025-06-01",
    status: "BERJALAN",
    disbursements: [
      { seq: 1, amount: 140000000, date: "2025-03-10", purpose: "Stage 1 - Survey & Seedlings", status: "CAIR" },
      { seq: 2, amount: 140000000, date: "2025-04-20", purpose: "Stage 2 - Phase 1 Planting", status: "CAIR" },
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
          <h1 className="section-title">Funding History</h1>
          <p className="section-subtitle">Track fund disbursements across all programs you manage.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Disbursed" value={formatRupiah(totalComitted, true)} icon={DollarSign} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Released Funds" value={formatRupiah(totalDisbursed, true)} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Remaining Commitment" value={formatRupiah(totalRemaining, true)} icon={Clock} iconColor="text-teal-600" iconBg="bg-teal-50" />
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
                  <Badge variant="teal">{d.status === "BERJALAN" ? "IN PROGRESS" : d.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Disbursement Progress</span>
                    <span className="font-semibold">
                      {formatRupiah(d.disbursed, true)} / {formatRupiah(d.totalComitment, true)}
                    </span>
                  </div>
                  <Progress value={pct} color="brand" className="h-2" />
                  <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>{pct}% released</span>
                    <span>Remaining: {formatRupiah(d.remaining, true)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Disbursement History</p>
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
                        <Badge variant="success" className="text-[10px]">{item.status === "CAIR" ? "PAID" : item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50 border border-brand-100">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium text-brand-700">Next Disbursement</p>
                      <p className="text-xs text-brand-600">Estimated: {formatDate(d.nextDate)}</p>
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
