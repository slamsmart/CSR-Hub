"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { formatRelativeTime } from "@/lib/utils";

const PENDING_VERIFICATIONS = [
  { id: "1", orgName: "Yayasan Peduli Anak Negeri", type: "YAYASAN", submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), docCount: 5, completeness: 90 },
  { id: "2", orgName: "Komunitas Tani Maju Sejahtera", type: "KOMUNITAS", submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), docCount: 3, completeness: 60 },
  { id: "3", orgName: "PT Bumi Hijau Lestari", type: "PERUSAHAAN", submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), docCount: 7, completeness: 100 },
  { id: "4", orgName: "NGO Sehat Untuk Semua", type: "NGO", submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), docCount: 4, completeness: 80 },
];

export function VerifikatorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Dashboard Verifikator</h1>
        <p className="section-subtitle">Antrian verifikasi organisasi dan dokumen legalitas.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Antrian Verifikasi" value="18" icon={Clock} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Terverifikasi Hari Ini" value="5" icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Ditolak Bulan Ini" value="3" icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Avg Waktu Review" value="1.8 hari" icon={ClipboardCheck} iconColor="text-brand-600" iconBg="bg-brand-50" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Antrian Verifikasi
            </CardTitle>
            <Badge variant="warning">{PENDING_VERIFICATIONS.length} menunggu</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {PENDING_VERIFICATIONS.map((item) => (
            <div key={item.id} className="px-6 py-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{item.orgName}</p>
                    <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.docCount} dokumen diunggah</span>
                    <span>Diajukan {formatRelativeTime(item.submittedAt)}</span>
                    <span>Kelengkapan: <strong className={item.completeness >= 80 ? "text-green-600" : "text-orange-600"}>{item.completeness}%</strong></span>
                  </div>
                </div>
                <Link href={`/verifikator/organisasi/${item.id}`}>
                  <Button variant="brand" size="sm" className="gap-1.5">
                    Review <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
