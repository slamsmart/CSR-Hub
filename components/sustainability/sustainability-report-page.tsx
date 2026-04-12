"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp, Users, DollarSign, Leaf, Download,
  BarChart3, Target, Calendar, Award, Globe,
  Building2, CheckCircle2, FileText, Loader2, RefreshCw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatRupiah, cn } from "@/lib/utils";

const COLORS = ["#16a34a", "#0891b2", "#d97706", "#7c3aed", "#dc2626", "#0d9488"];

const CAT_LABELS: Record<string, string> = {
  PENDIDIKAN: "Pendidikan",
  KESEHATAN: "Kesehatan",
  LINGKUNGAN_HIDUP: "Lingkungan",
  PEMBERDAYAAN_EKONOMI: "Ekonomi",
  INFRASTRUKTUR: "Infrastruktur",
  TEKNOLOGI_DIGITAL: "Teknologi",
  BUDAYA_OLAHRAGA: "Budaya",
  KEBENCANAAN: "Kebencanaan",
};

export function SustainabilityReportPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["sustainability-report", year],
    queryFn: async () => {
      const res = await fetch(`/api/sustainability-reports?year=${year}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const report = data?.data;

  async function handleSaveReport() {
    if (!report) return;
    try {
      await fetch("/api/sustainability-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...report, year }),
      });
    } catch {}
  }

  function handlePrint() {
    handleSaveReport();
    window.print();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const sdgData = report?.sdgAchievements || [];
  const catData = (report?.categoryBreakdown || []).map((c: any) => ({
    ...c,
    label: CAT_LABELS[c.category] || c.category,
  }));
  const monthlyData = report?.monthlyData || [];
  const griIndicators = report?.griIndicators || [];

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          @page { margin: 15mm; size: A4; }
          body { font-size: 11px; }
        }
      `}</style>

      <div className="space-y-6" id="gri-report-content">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold">Laporan Keberlanjutan (GRI)</h1>
            <p className="text-muted-foreground text-sm mt-1">Laporan ESG & dampak CSR sesuai GRI Standards</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm bg-background"
            >
              {Array.from({ length: 4 }, (_, i) => currentYear - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="brand" size="sm" onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">C</div>
            <span className="text-2xl font-bold">CSR<span className="text-green-600">Hub</span></span>
          </div>
          <h1 className="text-xl font-bold uppercase">Laporan Keberlanjutan {year}</h1>
          <p className="text-sm text-gray-500">Sesuai GRI Standards & POJK 51/2017</p>
        </div>

        {/* ESG Score + Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* ESG Score */}
          <Card className="col-span-2 md:col-span-1 bg-gradient-to-br from-brand-600 to-teal-600 text-white border-0">
            <CardContent className="p-5 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <p className="text-4xl font-bold font-display">{report?.esgScore ?? "–"}</p>
              <p className="text-sm text-white/70 mt-1">Skor ESG</p>
              <div className="mt-2">
                <Badge className="bg-white/20 text-white text-xs">
                  {(report?.esgScore || 0) >= 80 ? "Sangat Baik" : (report?.esgScore || 0) >= 60 ? "Baik" : "Perlu Peningkatan"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {[
            { icon: DollarSign, label: "Total Dana CSR", value: report ? formatRupiah(report.totalDanaCSR) : "–", color: "text-brand-600", bg: "bg-brand-50" },
            { icon: Users, label: "Penerima Manfaat", value: report?.totalPenerima?.toLocaleString("id-ID") || "–", color: "text-teal-600", bg: "bg-teal-50" },
            { icon: Target, label: "Total Program", value: report?.totalProyek || "–", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Building2, label: "Organisasi Mitra", value: report?.totalOrganisasi || "–", color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => (
            <Card key={s.label} className="border">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Spending */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-600" />
                Realisasi vs Target Bulanan (Juta Rp)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(v: number) => [`Rp ${(v / 1000000).toFixed(1)}M`, ""]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="realisasi" name="Realisasi" fill="#16a34a" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#d1fae5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SDG Distribution */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-teal-600" />
                Kontribusi SDGs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sdgData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <RPieChart width={140} height={140}>
                    <Pie data={sdgData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="count" paddingAngle={2}>
                      {sdgData.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 11 }} />
                  </RPieChart>
                  <div className="flex-1 space-y-1.5">
                    {sdgData.slice(0, 5).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="flex-1 truncate">{item.sdg}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                  Belum ada data SDG
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Programs Table */}
        {report?.projects?.length > 0 && (
          <Card className="border print-break">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-600" />
                Ringkasan Dampak Program
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Program</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategori</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">SDGs</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Penerima</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Fisik</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {report.projects.map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.title}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{CAT_LABELS[p.category] || p.category}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {(p.sdgTags as string[]).slice(0, 2).map((sdg: string) => (
                              <Badge key={sdg} variant="outline" className="text-xs py-0">{sdg}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">{p.jumlahPenerima?.toLocaleString("id-ID") || "–"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${p.progressFisik}%` }} />
                            </div>
                            <span className="text-xs w-8 text-right">{p.progressFisik}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge className={cn("text-xs",
                            p.status === "SELESAI" ? "bg-green-100 text-green-700" :
                            p.status === "BERJALAN" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-600"
                          )}>
                            {p.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GRI Standards Compliance */}
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" />
              GRI Standards Compliance Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {griIndicators.length > 0 ? griIndicators.map((ind: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
                  <CheckCircle2 className={cn("h-4 w-4 mt-0.5 flex-shrink-0",
                    ind.status === "complete" ? "text-green-500" : "text-amber-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600">{ind.code}</span>
                      <Badge className={cn("text-xs", ind.status === "complete" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                        {ind.status === "complete" ? "Terpenuhi" : "Sebagian"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{ind.name}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada data proyek untuk tahun {year}</p>
              )}
            </div>

            {/* Compliance Note */}
            <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-brand-700">Catatan Kepatuhan:</strong>{" "}
              Laporan ini disusun sesuai dengan <strong>GRI Standards (Core)</strong>, <strong>UN SDGs Reporting</strong>,
              dan <strong>POJK 51/2017</strong> tentang Penerapan Keuangan Berkelanjutan bagi Lembaga Jasa Keuangan.
              Data bersumber dari platform CSR Hub yang telah diverifikasi secara independen.
              <br /><br />
              <em>This report is prepared in accordance with GRI Standards (Core option), aligned with the UN Sustainable Development Goals (SDGs) and Indonesia's OJK Regulation POJK 51/2017 on Sustainable Finance.</em>
            </div>
          </CardContent>
        </Card>

        {/* Print Footer */}
        <div className="hidden print:block mt-8 pt-4 border-t text-center text-xs text-gray-400">
          Laporan ini diterbitkan secara otomatis oleh CSR Hub Platform — csrhub.id
          <br />Periode: {year} | Dihasilkan: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>
    </>
  );
}
