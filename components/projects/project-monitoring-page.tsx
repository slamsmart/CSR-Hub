"use client";

import React, { useState } from "react";
import {
  TrendingUp, DollarSign, AlertTriangle, CheckCircle2, FileText,
  Plus, Milestone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { formatRupiah, formatDate, cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

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
    reports: [
      { id: "r1", reportType: "BULANAN", reportingPeriod: "Maret 2025", submittedAt: "2025-03-31", isSubmitted: true },
      { id: "r2", reportType: "BULANAN", reportingPeriod: "Februari 2025", submittedAt: "2025-02-28", isSubmitted: true },
    ],
    milestones: [
      { id: "m1", title: "Rekrutmen & Seleksi Siswa", isCompleted: true, targetDate: "2025-01-31" },
      { id: "m2", title: "Penyaluran Dana Semester 1", isCompleted: true, targetDate: "2025-02-15" },
      { id: "m3", title: "Pendampingan Akademik Q1", isCompleted: false, targetDate: "2025-04-30" },
      { id: "m4", title: "Ujian Semester Genap", isCompleted: false, targetDate: "2025-06-15" },
    ],
  },
];

export function ProjectMonitoringPage() {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "reports" | "finance">("overview");
  const project = DUMMY_PROJECTS[0];
  const completedMilestones = project.milestones.filter((m) => m.isCompleted).length;
  const milestoneProgress = Math.round((completedMilestones / project.milestones.length) * 100);

  const t = language === "en" ? {
    title: "Project Monitoring",
    subtitle: "Track the progress and reporting of your CSR programs.",
    submitReport: "Submit Report",
    totalBudget: "Total Budget",
    physical: "Physical Progress",
    finance: "Fund Realization",
    next: "Next",
    overview: "Overview",
    milestones: "Milestones",
    reports: "Reports",
    financeTab: "Finance",
    milestoneDone: "Completed Milestones",
    submittedReports: "Submitted Reports",
    timeline: "Milestone Timeline",
    completed: "completed",
    target: "Target",
    markDone: "Mark Complete",
    done: "Completed",
    reportProgress: "Progress Reports",
    createReport: "Create Report",
    reportWord: "Report",
    submitted: "Submitted",
    draft: "Draft",
    financialTitle: "Financial Realization",
    used: "Budget Used",
    remaining: "Remaining Budget",
    efficiency: "Utilization Efficiency",
    alert: `Fund realization (${project.progressKeuangan}%) is lower than physical progress (${project.progressFisik}%). Please ensure financial reporting is accurate.`,
  } : {
    title: "Monitoring Proyek",
    subtitle: "Pantau progres dan laporan program CSR Anda.",
    submitReport: "Submit Laporan",
    totalBudget: "Total Anggaran",
    physical: "Progres Fisik",
    finance: "Realisasi Dana",
    next: "Next",
    overview: "Ringkasan",
    milestones: "Milestone",
    reports: "Laporan",
    financeTab: "Keuangan",
    milestoneDone: "Milestone Selesai",
    submittedReports: "Laporan Tersubmit",
    timeline: "Timeline Milestone",
    completed: "selesai",
    target: "Target",
    markDone: "Tandai Selesai",
    done: "Selesai",
    reportProgress: "Laporan Progres",
    createReport: "Buat Laporan",
    reportWord: "Laporan",
    submitted: "Tersubmit",
    draft: "Draft",
    financialTitle: "Realisasi Keuangan",
    used: "Dana Terpakai",
    remaining: "Sisa Dana",
    efficiency: "Efisiensi Penggunaan",
    alert: `Realisasi dana (${project.progressKeuangan}%) lebih rendah dari progres fisik (${project.progressFisik}%). Pastikan pelaporan keuangan akurat.`,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">{t.title}</h1>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>
        <Button variant="brand" className="gap-2">
          <FileText className="h-4 w-4" />
          {t.submitReport}
        </Button>
      </div>

      <div className="grid gap-4">
        {DUMMY_PROJECTS.map((proj) => (
          <Card
            key={proj.id}
            className={cn("cursor-pointer transition-all", selectedProject === proj.id ? "border-brand-400 shadow-md" : "hover:border-brand-200")}
            onClick={() => setSelectedProject(proj.id === selectedProject ? null : proj.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{proj.kodeProyek}</span>
                    <Badge variant="teal">{language === "en" ? "IN PROGRESS" : proj.status}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">{proj.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PIC: {proj.picNama} · {formatDate(proj.startDate, "MMM yyyy")} – {formatDate(proj.endDate, "MMM yyyy")}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-brand-600">{formatRupiah(proj.anggaranTotal, true)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.totalBudget}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{t.physical}</span>
                    <span className="font-semibold">{proj.progressFisik}%</span>
                  </div>
                  <Progress value={proj.progressFisik} color="brand" className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{t.finance}</span>
                    <span className="font-semibold">{proj.progressKeuangan}%</span>
                  </div>
                  <Progress value={proj.progressKeuangan} color="teal" className="h-2" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Milestone className="h-3.5 w-3.5 text-brand-500" />
                <span>{t.next}: <strong className="text-foreground">{proj.nextMilestone}</strong> · {formatDate(proj.nextMilestoneDate)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <div className="space-y-4">
          <div className="w-fit rounded-xl bg-muted p-1">
            {(["overview", "milestones", "reports", "finance"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn("rounded-lg px-4 py-1.5 text-sm font-medium transition-all", activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {tab === "overview" ? t.overview : tab === "milestones" ? t.milestones : tab === "reports" ? t.reports : t.financeTab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard title={t.milestoneDone} value={`${completedMilestones}/${project.milestones.length}`} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
              <StatCard title={t.finance} value={formatRupiah(project.realisasiAnggaran, true)} icon={DollarSign} iconColor="text-teal-600" iconBg="bg-teal-50" />
              <StatCard title={t.physical} value={`${project.progressFisik}%`} icon={TrendingUp} iconColor="text-brand-600" iconBg="bg-brand-50" />
              <StatCard title={t.submittedReports} value={`${project.reports.filter((r) => r.isSubmitted).length}`} icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-50" />
            </div>
          )}

          {activeTab === "milestones" && (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium">{t.timeline}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{completedMilestones}/{project.milestones.length} {t.completed}</span>
                    <Progress value={milestoneProgress} color="brand" className="h-2 w-20" />
                    <span className="font-medium">{milestoneProgress}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {project.milestones.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-4 rounded-xl border p-3 transition-colors hover:bg-muted/30">
                      <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold", m.isCompleted ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground")}>
                        {m.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", m.isCompleted && "text-muted-foreground line-through")}>{m.title}</p>
                        <p className="text-xs text-muted-foreground">{t.target}: {formatDate(m.targetDate)}</p>
                      </div>
                      {!m.isCompleted ? (
                        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          {t.markDone}
                        </Button>
                      ) : (
                        <Badge variant="success" className="text-xs">{t.done}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "reports" && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t.reportProgress}</CardTitle>
                  <Button variant="brand" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t.createReport}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {project.reports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 border-b px-5 py-3 transition-colors last:border-0 hover:bg-muted/30">
                    <FileText className="h-8 w-8 flex-shrink-0 text-brand-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.reportWord} {report.reportType} — {report.reportingPeriod}</p>
                      {report.submittedAt && <p className="text-xs text-muted-foreground">{formatDate(report.submittedAt)}</p>}
                    </div>
                    <Badge variant={report.isSubmitted ? "success" : "warning"}>{report.isSubmitted ? t.submitted : t.draft}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "finance" && (
            <Card>
              <CardHeader><CardTitle className="text-base">{t.financialTitle}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                    <span className="text-sm text-muted-foreground">{t.totalBudget}</span>
                    <span className="text-lg font-bold">{formatRupiah(project.anggaranTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50 p-4">
                    <span className="text-sm text-teal-700">{t.used}</span>
                    <span className="text-lg font-bold text-teal-700">{formatRupiah(project.realisasiAnggaran)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50 p-4">
                    <span className="text-sm text-brand-700">{t.remaining}</span>
                    <span className="text-lg font-bold text-brand-700">{formatRupiah(project.anggaranTotal - project.realisasiAnggaran)}</span>
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.efficiency}</span>
                      <span className="font-semibold">{project.progressKeuangan}%</span>
                    </div>
                    <Progress value={project.progressKeuangan} color="teal" className="h-3" />
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <p>{t.alert}</p>
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
