"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck, AlertTriangle, FileBarChart, CheckCircle2, ArrowRight, Calendar } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

const SCHEDULED_AUDITS = [
  { id: "1", projectName: "Beasiswa 100 Mahasiswa IT", orgName: "Yayasan Cerdas Digital", auditDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: "LAPANGAN", status: "DIJADWALKAN" },
  { id: "2", projectName: "Hutan Kota Surabaya", orgName: "Komunitas Hijau Surabaya", auditDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: "KEUANGAN", status: "DIJADWALKAN" },
  { id: "3", projectName: "Klinik Gratis Lansia", orgName: "Yayasan Sehat Sejahtera", auditDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: "DOKUMEN", status: "BERJALAN" },
];

export function AuditorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Dashboard Auditor</h1>
        <p className="section-subtitle">Monitor, audit, dan validasi proyek CSR yang berjalan.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Audit Dijadwalkan" value="7" icon={Calendar} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Audit Berjalan" value="3" icon={ClipboardCheck} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Selesai Bulan Ini" value="12" icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Temuan Aktif" value="8" icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Jadwal Audit</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {SCHEDULED_AUDITS.map((audit) => (
            <div key={audit.id} className="px-6 py-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-sm">{audit.projectName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{audit.orgName}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <Badge variant={audit.type === "LAPANGAN" ? "brand" : audit.type === "KEUANGAN" ? "teal" : "secondary"} className="text-xs">
                      {audit.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(audit.auditDate, "dd MMM yyyy")}
                    </span>
                    <Badge variant={audit.status === "BERJALAN" ? "warning" : "info"} className="text-xs">
                      {audit.status}
                    </Badge>
                  </div>
                </div>
                <Link href={`/auditor/audit/${audit.id}`}>
                  <Button variant={audit.status === "BERJALAN" ? "brand" : "outline"} size="sm" className="gap-1.5">
                    {audit.status === "BERJALAN" ? "Lanjutkan" : "Mulai"}
                    <ArrowRight className="h-3.5 w-3.5" />
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
