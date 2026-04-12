"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp, Calendar, DollarSign, Users, ArrowRight,
  AlertTriangle, CheckCircle2, Clock, BarChart3, FileText,
  Upload, Plus, Milestone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DUMMY_PROJECTS = [
  {
    id: "p1",
    kodeProyek: "PRJ-2025-1234",
    name: "Beasiswa SMA untuk 50 Pelajar Kurang Mampu di Pesisir Jawa Timur",
    status: "BERJALAN",
    progressFisik: 65,
    progressKeuangan: 58,
    anggaranTotal: 250000000,
    realisasiAnggaran: 145000000,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    picNama: "Budi Santoso",
    nextMilestone: "Ujian Semester Genap",
    nextMilestoneDate: "2025-06-15",
    lastReportDate: "2025-03-01",
    proposal: {
      title: "Beasiswa SMA untuk 50 Pelajar Kurang Mampu",
      organization: { name: "Yayasan Cerdas Nusantara" },
    },
    milestones: [
      { id: "m1", title: "Rekrutmen & Seleksi Siswa", isCompleted: true, targetDate: "2025-01-31" },
      { id: "m2", title: "Penyaluran Dana Semester 1", isCompleted: true, targetDate: "2025-02-15" },
      { id: "m3", title: "Pendampingan Akademik Q1", isCompleted: false, targetDate: "2025-04-30" },
      { id: "m4", title: "Ujian Semester Genap", isCompleted: false, targetDate: "2025-06-15" },
      { id: "m5", title: "Penyaluran Dana Semester 2", isCompleted: false, targetDate: "2025-08-01" },
      { id: "m6", title: "Evaluasi Akhir Program", isCompleted: false, targetDate: "2025-11-30" },
    ],
    reports: [
      { id: "r1", reportType: "BULANAN", reportingPeriod: "Maret 2025", submittedAt: "2025-03-31", isSubmitted: true },
      { id: "r2", reportType: "BULANAN", reportingPeriod: "Februari 2025", submittedAt: "2025-02-28", isSubmitted: true },
    ],
  },
];

export function ProjectMonitoringPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "reports" | "keuangan">("overview");

  const project = DUMMY_PROJECTS[0];
  const completedMilestones = project.milestones.filter((m) => m.isCompleted).length;
  const milestoneProgress = Math.round((completedMilestones / project.milestones.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Monitoring Proyek</h1>
          <p className="section-subtitle">Pantau progres dan laporan program CSR Anda.</p>
        </div>
        <Button variant="brand" className="gap-2">
          <FileText className="h-4 w-4" />
          Submit Laporan
        </Button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4">
        {DUMMY_PROJECTS.map((proj) => (
          <Card
            key={proj.id}
            className={cn(
              "cursor-pointer transition-all",
              selectedProject === proj.id ? "border-brand-400 shadow-md" : "hover:border-brand-200"
            )}
            onClick={() => setSelectedProject(proj.id === selectedProject ? null : proj.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{proj.kodeProyek}</span>
                    <Badge variant={proj.status === "BERJALAN" ? "teal" : proj.status === "SELESAI" ? "success" : "warning"}>
                      {proj.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug">{proj.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    PIC: {proj.picNama} · {formatDate(proj.startDate, "MMM yyyy")} – {formatDate(proj.endDate, "MMM yyyy")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-brand-600">{formatRupiah(proj.anggaranTotal, true)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Anggaran</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progres Fisik</span>
                    <span className="font-semibold">{proj.progressFisik}%</span>
                  </div>
                  <Progress value={proj.progressFisik} color="brand" className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Realisasi Dana</span>
                    <span className="font-semibold">{proj.progressKeuangan}%</span>
                  </div>
                  <Progress value={proj.progressKeuangan} color="teal" className="h-2" />
                </div>
              </div>

              {proj.nextMilestone && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Milestone className="h-3.5 w-3.5 text-brand-500" />
                  <span>Next: <strong className="text-foreground">{proj.nextMilestone}</strong> · {formatDate(proj.nextMilestoneDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedProject && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
            {(["overview", "milestones", "reports", "keuangan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all",
                  activeTab === tab ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "overview" ? "Ringkasan" :
                 tab === "milestones" ? "Milestone" :
                 tab === "reports" ? "Laporan" : "Keuangan"}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard title="Milestone Selesai" value={`${completedMilestones}/${project.milestones.length}`}
                icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
              <StatCard title="Realisasi Dana" value={formatRupiah(project.realisasiAnggaran, true)}
                icon={DollarSign} iconColor="text-teal-600" iconBg="bg-teal-50" />
              <StatCard title="Progres Fisik" value={`${project.progressFisik}%`}
                icon={TrendingUp} iconColor="text-brand-600" iconBg="bg-brand-50" />
              <StatCard title="Laporan Tersubmit" value={`${project.reports.filter(r => r.isSubmitted).length}`}
                icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-50" />
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === "milestones" && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-sm">Timeline Milestone</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{completedMilestones}/{project.milestones.length} selesai</span>
                    <Progress value={milestoneProgress} color="brand" className="w-20 h-2" />
                    <span className="font-medium">{milestoneProgress}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {project.milestones.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-4 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        m.isCompleted ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {m.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", m.isCompleted && "line-through text-muted-foreground")}>
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Target: {formatDate(m.targetDate)}
                        </p>
                      </div>
                      {!m.isCompleted && (
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Tandai Selesai
                        </Button>
                      )}
                      {m.isCompleted && (
                        <Badge variant="success" className="text-xs">Selesai</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Laporan Progres</CardTitle>
                  <Button variant="brand" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Laporan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {project.reports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 px-5 py-3 border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <FileText className="h-8 w-8 text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Laporan {report.reportType} — {report.reportingPeriod}</p>
                      {report.submittedAt && (
                        <p className="text-xs text-muted-foreground">
                          Disubmit: {formatDate(report.submittedAt)}
                        </p>
                      )}
                    </div>
                    <Badge variant={report.isSubmitted ? "success" : "warning"}>
                      {report.isSubmitted ? "Tersubmit" : "Draft"}
                    </Badge>
                    <Button variant="ghost" size="icon-sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Keuangan Tab */}
          {activeTab === "keuangan" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Realisasi Keuangan</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                    <span className="text-sm text-muted-foreground">Total Anggaran</span>
                    <span className="font-bold text-lg">{formatRupiah(project.anggaranTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-teal-50 border border-teal-100">
                    <span className="text-sm text-teal-700">Dana Terpakai</span>
                    <span className="font-bold text-lg text-teal-700">{formatRupiah(project.realisasiAnggaran)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-brand-50 border border-brand-100">
                    <span className="text-sm text-brand-700">Sisa Dana</span>
                    <span className="font-bold text-lg text-brand-700">
                      {formatRupiah(project.anggaranTotal - project.realisasiAnggaran)}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Efisiensi Penggunaan</span>
                      <span className="font-semibold">{project.progressKeuangan}%</span>
                    </div>
                    <Progress value={project.progressKeuangan} color="teal" className="h-3" />
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                  <div className="flex items-center gap-2 text-yellow-700 text-sm">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <p>Realisasi dana ({project.progressKeuangan}%) lebih rendah dari progres fisik ({project.progressFisik}%). Pastikan pelaporan keuangan akurat.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
