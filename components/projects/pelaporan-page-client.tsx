"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  PlusCircle, FileText, Download, CheckCircle2, Clock,
  ChevronRight, BarChart3, AlertCircle, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReportFormModal } from "./report-form-modal";
import { ReportPrintView } from "./report-print-view";
import { formatRupiah, cn } from "@/lib/utils";

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

const TYPE_LABEL: Record<string, string> = {
  BULANAN: "Bulanan",
  TRIWULAN: "Triwulan",
  KEUANGAN: "Keuangan",
  AKHIR: "Laporan Akhir",
};

export function PelaporanPageClient() {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);

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
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pelaporan Program</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Buat dan kelola laporan bulanan, keuangan, dan dampak proyek CSR Anda
          </p>
        </div>
        {selectedProject && (
          <Button
            variant="brand"
            className="gap-2"
            onClick={() => setShowForm(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Buat Laporan
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Proyek Aktif ({projects.length})
          </h2>
          {projects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Belum ada proyek aktif
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "w-full text-left rounded-xl border p-4 transition-all hover:shadow-md",
                  selectedProject?.id === project.id
                    ? "border-brand-500 bg-brand-50 shadow-md"
                    : "bg-white hover:border-brand-300"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm leading-snug line-clamp-2">
                    {project.proposal.title}
                  </p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Fisik</span>
                    <span className="font-medium text-foreground">{project.progressFisik}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-brand-600 h-1.5 rounded-full"
                      style={{ width: `${project.progressFisik}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Keuangan</span>
                    <span className="font-medium text-foreground">{project.progressKeuangan}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-teal-600 h-1.5 rounded-full"
                      style={{ width: `${project.progressKeuangan}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      project.status === "BERJALAN" ? "bg-green-100 text-green-700" :
                      project.status === "SELESAI" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    )}
                  >
                    {project.status}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Reports Panel */}
        <div className="lg:col-span-2">
          {!selectedProject ? (
            <Card className="h-64 flex items-center justify-center border-dashed">
              <CardContent className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Pilih proyek untuk melihat laporan</p>
                <p className="text-sm mt-1">Klik salah satu proyek di sebelah kiri</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-brand-600 to-teal-600 rounded-xl p-5 text-white">
                <p className="text-sm text-white/70 mb-1">Laporan untuk</p>
                <h2 className="font-bold text-lg leading-snug">{selectedProject.proposal.title}</h2>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-white/60">Progres Fisik</p>
                    <p className="text-xl font-bold">{selectedProject.progressFisik}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Progres Keuangan</p>
                    <p className="text-xl font-bold">{selectedProject.progressKeuangan}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Realisasi</p>
                    <p className="text-xl font-bold">
                      {selectedProject.realisasiAnggaran
                        ? formatRupiah(Number(selectedProject.realisasiAnggaran))
                        : "Rp 0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Riwayat Laporan ({reports.length})</h3>
                <Button variant="brand" size="sm" className="gap-2" onClick={() => setShowForm(true)}>
                  <PlusCircle className="h-4 w-4" />
                  Buat Laporan Baru
                </Button>
              </div>

              {loadingReports ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map((i) => <div key={i} className="h-20 bg-muted rounded-xl" />)}
                </div>
              ) : reports.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">Belum ada laporan</p>
                    <p className="text-sm mt-1">Buat laporan pertama untuk proyek ini</p>
                    <Button
                      variant="brand"
                      size="sm"
                      className="mt-4 gap-2"
                      onClick={() => setShowForm(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Buat Laporan Pertama
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge className={cn("text-xs", TYPE_COLORS[report.reportType])}>
                                {TYPE_LABEL[report.reportType]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{report.reportingPeriod}</span>
                              {report.isSubmitted ? (
                                <Badge className="text-xs bg-green-100 text-green-700 gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Terkirim
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <Clock className="h-3 w-3" /> Draf
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium text-sm">{report.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{report.summary}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right text-xs">
                              <p className="font-medium text-brand-600">{report.progressFisik}%</p>
                              <p className="text-muted-foreground">fisik</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-xs"
                              onClick={() => setViewReport(report)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Lihat
                            </Button>
                          </div>
                        </div>
                        {report.attachments?.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {report.attachments.length} lampiran
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

      {/* Report Form Modal */}
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

      {/* Print/Download View */}
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
