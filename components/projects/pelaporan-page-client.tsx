"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PlusCircle, FileText, CheckCircle2, Clock,
  ChevronRight, BarChart3, AlertCircle, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReportFormModal } from "./report-form-modal";
import { ReportPrintView } from "./report-print-view";
import { formatRupiah, cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

interface Project {
  id: string;
  status: string;
  progressFisik: number;
  progressKeuangan: number;
  realisasiAnggaran?: string;
  proposal: { title: string; organization: { name: string } };
}

interface Report {
  id: string;
  reportType: string;
  reportingPeriod: string;
  title: string;
  summary: string;
  progressFisik: number;
  progressKeuangan: number;
  realisasiAnggaran: string;
  pencapaian?: string;
  kendala?: string;
  rencanaTindakLanjut?: string;
  attachments: string[];
  isSubmitted: boolean;
  submittedAt?: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  BULANAN: "bg-blue-100 text-blue-700",
  TRIWULAN: "bg-purple-100 text-purple-700",
  KEUANGAN: "bg-amber-100 text-amber-700",
  AKHIR: "bg-green-100 text-green-700",
};

const TYPE_LABEL = {
  id: { BULANAN: "Bulanan", TRIWULAN: "Triwulan", KEUANGAN: "Keuangan", AKHIR: "Laporan Akhir" },
  en: { BULANAN: "Monthly", TRIWULAN: "Quarterly", KEUANGAN: "Financial", AKHIR: "Final Report" },
} as const;

export function PelaporanPageClient() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const t = language === "en" ? {
    title: "Program Reporting",
    subtitle: "Create and manage monthly, financial, and impact reports for your CSR projects",
    createReport: "Create Report",
    activeProjects: "Active Projects",
    noActiveProjects: "No active projects yet",
    physical: "Physical",
    finance: "Financial",
    selectProject: "Select a project to view reports",
    clickLeft: "Click one of the projects on the left",
    reportsFor: "Reports for",
    realization: "Realization",
    history: "Report History",
    createNew: "Create New Report",
    noReports: "No reports yet",
    firstReport: "Create the first report for this project",
    createFirst: "Create First Report",
    submitted: "Submitted",
    draft: "Draft",
    view: "View",
    attachments: "attachments",
  } : {
    title: "Pelaporan Program",
    subtitle: "Buat dan kelola laporan bulanan, keuangan, dan dampak proyek CSR Anda",
    createReport: "Buat Laporan",
    activeProjects: "Proyek Aktif",
    noActiveProjects: "Belum ada proyek aktif",
    physical: "Fisik",
    finance: "Keuangan",
    selectProject: "Pilih proyek untuk melihat laporan",
    clickLeft: "Klik salah satu proyek di sebelah kiri",
    reportsFor: "Laporan untuk",
    realization: "Realisasi",
    history: "Riwayat Laporan",
    createNew: "Buat Laporan Baru",
    noReports: "Belum ada laporan",
    firstReport: "Buat laporan pertama untuk proyek ini",
    createFirst: "Buat Laporan Pertama",
    submitted: "Terkirim",
    draft: "Draf",
    view: "Lihat",
    attachments: "lampiran",
  };

  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ["my-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects?role=PENGUSUL");
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const { data: reportsData, isLoading: loadingReports } = useQuery({
    queryKey: ["project-reports", selectedProject?.id],
    queryFn: async () => {
      if (!selectedProject) return { data: [] };
      const res = await fetch(`/api/projects/${selectedProject.id}/reports`);
      if (!res.ok) throw new Error();
      return res.json();
    },
    enabled: !!selectedProject,
  });

  const projects: Project[] = projectsData?.data || [];
  const reports: Report[] = reportsData?.data || [];

  if (loadingProjects) {
    return <div className="space-y-4 animate-pulse">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        {selectedProject && (
          <Button variant="brand" className="gap-2" onClick={() => setShowForm(true)}>
            <PlusCircle className="h-4 w-4" />
            {t.createReport}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t.activeProjects} ({projects.length})</h2>
          {projects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
                {t.noActiveProjects}
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all hover:border-brand-300 hover:shadow-md",
                  selectedProject?.id === project.id ? "border-brand-500 bg-brand-50 shadow-md" : "bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium leading-snug">{project.proposal.title}</p>
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.physical}</span>
                    <span className="font-medium text-foreground">{project.progressFisik}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200"><div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${project.progressFisik}%` }} /></div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.finance}</span>
                    <span className="font-medium text-foreground">{project.progressKeuangan}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${project.progressKeuangan}%` }} /></div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedProject ? (
            <Card className="flex h-64 items-center justify-center border-dashed">
              <CardContent className="text-center text-muted-foreground">
                <BarChart3 className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p className="font-medium">{t.selectProject}</p>
                <p className="mt-1 text-sm">{t.clickLeft}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 p-5 text-white">
                <p className="mb-1 text-sm text-white/70">{t.reportsFor}</p>
                <h2 className="text-lg font-bold leading-snug">{selectedProject.proposal.title}</h2>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div><p className="text-xs text-white/60">{language === "en" ? "Physical Progress" : "Progres Fisik"}</p><p className="text-xl font-bold">{selectedProject.progressFisik}%</p></div>
                  <div><p className="text-xs text-white/60">{language === "en" ? "Financial Progress" : "Progres Keuangan"}</p><p className="text-xl font-bold">{selectedProject.progressKeuangan}%</p></div>
                  <div><p className="text-xs text-white/60">{t.realization}</p><p className="text-xl font-bold">{selectedProject.realisasiAnggaran ? formatRupiah(Number(selectedProject.realisasiAnggaran)) : "Rp 0"}</p></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t.history} ({reports.length})</h3>
                <Button variant="brand" size="sm" className="gap-2" onClick={() => setShowForm(true)}>
                  <PlusCircle className="h-4 w-4" />
                  {t.createNew}
                </Button>
              </div>

              {loadingReports ? (
                <div className="space-y-3 animate-pulse">{[1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-muted" />)}</div>
              ) : reports.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <FileText className="mx-auto mb-3 h-10 w-10 opacity-20" />
                    <p className="font-medium">{t.noReports}</p>
                    <p className="mt-1 text-sm">{t.firstReport}</p>
                    <Button variant="brand" size="sm" className="mt-4 gap-2" onClick={() => setShowForm(true)}>
                      <PlusCircle className="h-4 w-4" />
                      {t.createFirst}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id} className="border transition-shadow hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <Badge className={cn("text-xs", TYPE_COLORS[report.reportType])}>
                                {TYPE_LABEL[language][report.reportType as keyof typeof TYPE_LABEL.en]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{report.reportingPeriod}</span>
                              {report.isSubmitted ? (
                                <Badge className="gap-1 bg-green-100 text-xs text-green-700"><CheckCircle2 className="h-3 w-3" /> {t.submitted}</Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-xs"><Clock className="h-3 w-3" /> {t.draft}</Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium">{report.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{report.summary}</p>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <div className="text-right text-xs">
                              <p className="font-medium text-brand-600">{report.progressFisik}%</p>
                              <p className="text-muted-foreground">{language === "en" ? "physical" : "fisik"}</p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setViewReport(report)}>
                              <Eye className="h-3.5 w-3.5" />
                              {t.view}
                            </Button>
                          </div>
                        </div>
                        {report.attachments?.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {report.attachments.length} {t.attachments}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && selectedProject && (
        <ReportFormModal
          projectId={selectedProject.id}
          projectTitle={selectedProject.proposal.title}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["project-reports", selectedProject.id] });
          }}
        />
      )}

      {viewReport && selectedProject && (
        <ReportPrintView
          report={viewReport}
          projectTitle={selectedProject.proposal.title}
          orgName={selectedProject.proposal.organization?.name || "Organisasi"}
          onClose={() => setViewReport(null)}
        />
      )}
    </div>
  );
}
