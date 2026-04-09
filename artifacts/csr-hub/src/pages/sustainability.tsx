import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch, useListOrganizations } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import {
  FileBarChart, Download, Building2, CheckCircle, Globe, Users,
  Leaf, Receipt, TrendingUp, Droplets, Trees, Wind, BookOpen,
  Heart, Sparkles, Shield, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "sonner";

const SDG_COLORS: Record<string, string> = {
  "SDG 1": "#E5243B", "SDG 2": "#DDA63A", "SDG 3": "#4C9F38", "SDG 4": "#C5192D",
  "SDG 5": "#FF3A21", "SDG 6": "#26BDE2", "SDG 7": "#FCC30B", "SDG 8": "#A21942",
  "SDG 9": "#FD6925", "SDG 10": "#DD1367", "SDG 11": "#FD9D24", "SDG 12": "#BF8B2E",
  "SDG 13": "#3F7E44", "SDG 14": "#0A97D9", "SDG 15": "#56C02B", "SDG 16": "#00689D", "SDG 17": "#19486A",
};

function StatBox({ icon: Icon, iconClass, label, value }: { icon: any; iconClass: string; label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 text-center">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2 ${iconClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function GRISection({ code, title, icon: Icon, color, children }: { code: string; title: string; icon: any; color: string; children: React.ReactNode }) {
  return (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color.replace("border-l-", "bg-").replace("-500", "-100").replace("-600", "-100")} `}>
            <Icon className={`w-4 h-4 ${color.replace("border-l-", "text-")}`} />
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground">{code}</p>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-auto text-xs">GRI 2021</Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function SustainabilityPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [downloading, setDownloading] = useState(false);

  const { data: orgsData } = useListOrganizations({ org_type: "perusahaan", limit: 50 });
  const orgs = (orgsData as any)?.data ?? [];

  async function downloadPdf() {
    if (!report) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210; const M = 15; const CW = W - M * 2;
      let y = 0;

      const addPage = () => { pdf.addPage(); y = 15; };
      const checkY = (need: number) => { if (y + need > 275) addPage(); };

      // ── COVER ──────────────────────────────────────────────────────────
      pdf.setFillColor(22, 101, 52);
      pdf.rect(0, 0, W, 55, "F");
      pdf.setFillColor(255, 255, 255, 0.1);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("LAPORAN KEBERLANJUTAN — GRI 2021 UNIVERSAL STANDARDS", M, 14);

      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(report.orgName ?? "Perusahaan", M, 27);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Periode: ${report.reportPeriod ?? ""}`, M, 35);
      pdf.text(`Diterbitkan: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, M, 41);
      pdf.text(`Trust Score: ${report.summary?.trustScore ?? 0} / 100`, M, 47);

      y = 65;

      // ── RINGKASAN EKSEKUTIF ─────────────────────────────────────────────
      pdf.setTextColor(22, 101, 52);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("RINGKASAN EKSEKUTIF", M, y); y += 7;

      pdf.setDrawColor(22, 101, 52);
      pdf.line(M, y, M + CW, y); y += 5;

      const summaryRows = [
        ["Total Program CSR", `${report.summary?.totalProgramsSubmitted ?? 0} program`],
        ["Total Investasi CSR", formatRupiah(report.summary?.totalFundedRp ?? 0)],
        ["Total Penerima Manfaat", `${(report.summary?.totalBeneficiaries ?? 0).toLocaleString("id-ID")} orang`],
        ["SDGs yang Dituju", (report.summary?.sdgGoalsAddressed ?? []).join(", ") || "-"],
        ["Fokus Kategori", (report.summary?.focusCategories ?? []).join(", ") || "-"],
        ["Status Verifikasi", report.summary?.verificationStatus ?? "-"],
      ];

      pdf.setFontSize(9);
      summaryRows.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(80, 80, 80);
        pdf.text(label, M, y);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(20, 20, 20);
        pdf.text(String(value), M + 65, y);
        y += 6;
      });

      y += 5;

      // ── GRI 200 — EKONOMI ───────────────────────────────────────────────
      checkY(50);
      pdf.setFillColor(239, 246, 255);
      pdf.rect(M, y, CW, 7, "F");
      pdf.setTextColor(29, 78, 216);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("GRI 200 — PENGUNGKAPAN EKONOMI", M + 2, y + 5); y += 11;

      const ecoRows = [
        ["GRI 201-1  Total Investasi CSR", formatRupiah(report.gri200?.totalInvestmentRp ?? 0)],
        ["GRI 201-1  Nilai Ekonomi Langsung", formatRupiah(report.gri200?.directEconomicValue ?? 0)],
        ["GRI 201-1  Nilai Ekonomi Tidak Langsung", formatRupiah(report.gri200?.indirectEconomicValue ?? 0)],
        ["GRI 204-1  Pemasok Lokal", `${report.gri200?.localSupplierPercentage ?? 0}%`],
      ];
      pdf.setFontSize(9);
      ecoRows.forEach(([label, value]) => {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.text(label, M + 2, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20, 20, 20);
        pdf.text(String(value), M + 110, y, { align: "right" });
        pdf.setDrawColor(220, 220, 220);
        pdf.line(M, y + 2, M + CW, y + 2);
        y += 7;
      });

      y += 4;

      // ── GRI 300 — LINGKUNGAN ────────────────────────────────────────────
      checkY(50);
      pdf.setFillColor(236, 252, 243);
      pdf.rect(M, y, CW, 7, "F");
      pdf.setTextColor(21, 128, 61);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("GRI 300 — PENGUNGKAPAN LINGKUNGAN", M + 2, y + 5); y += 11;

      const envRows = [
        ["GRI 302 / 305  CO₂ Dikurangi", `${report.gri300?.co2OffsetTons ?? 0} ton`],
        ["GRI 304  Pohon Ditanam", `${(report.gri300?.treesPlanted ?? 0).toLocaleString("id-ID")} pohon`],
        ["GRI 303  Air Dihemat", `${((report.gri300?.waterConservedLiters ?? 0) / 1000).toFixed(0)} m³`],
      ];
      pdf.setFontSize(9);
      envRows.forEach(([label, value]) => {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.text(label, M + 2, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20, 20, 20);
        pdf.text(String(value), M + 110, y, { align: "right" });
        pdf.setDrawColor(220, 220, 220);
        pdf.line(M, y + 2, M + CW, y + 2);
        y += 7;
      });

      y += 4;

      // ── GRI 400 — SOSIAL ────────────────────────────────────────────────
      checkY(55);
      pdf.setFillColor(245, 240, 255);
      pdf.rect(M, y, CW, 7, "F");
      pdf.setTextColor(109, 40, 217);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("GRI 400 — PENGUNGKAPAN SOSIAL", M + 2, y + 5); y += 11;

      const socialRows = [
        ["GRI 413-1  Total Penerima Manfaat", `${(report.gri400?.totalBeneficiaries ?? 0).toLocaleString("id-ID")} orang`],
        ["GRI 413-1  Keterlibatan Komunitas", `${report.gri400?.communityEngagements ?? 0} kali`],
        ["GRI 404-1  Jam Pelatihan", `${report.gri400?.trainingHours ?? 0} jam`],
        ["GRI 413-1  Beasiswa Diberikan", `${(report.gri400?.scholarshipsGiven ?? 0).toLocaleString("id-ID")} penerima`],
      ];
      pdf.setFontSize(9);
      socialRows.forEach(([label, value]) => {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.text(label, M + 2, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20, 20, 20);
        pdf.text(String(value), M + 110, y, { align: "right" });
        pdf.setDrawColor(220, 220, 220);
        pdf.line(M, y + 2, M + CW, y + 2);
        y += 7;
      });

      y += 8;

      // ── FOOTER ──────────────────────────────────────────────────────────
      checkY(20);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(M, y, M + CW, y); y += 5;
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(130, 130, 130);
      pdf.text("Laporan ini disusun otomatis dari data aktivitas CSR yang tercatat di platform CSR Hub.", M, y); y += 4;
      pdf.text("Mengacu pada GRI 2021 Universal Standards yang diakui secara internasional.", M, y); y += 4;
      pdf.text(`Dokumen ini digenerate pada: ${new Date().toLocaleString("id-ID")}`, M, y);

      // ── Nomor halaman ───────────────────────────────────────────────────
      const pageCount = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(160, 160, 160);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Halaman ${i} dari ${pageCount}  |  CSR Hub — Platform CSR Indonesia`, W / 2, 290, { align: "center" });
      }

      pdf.save(`Laporan_GRI_${report.orgName?.replace(/\s+/g, "_")}_${report.reportYear}.pdf`);
      toast.success("Laporan GRI berhasil diunduh!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Gagal membuat PDF. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  }

  async function downloadTaxDocument() {
    if (!report) return;
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210; const M = 20; const CW = W - M * 2;
      let y = 20;

      // ── KOP SURAT ───────────────────────────────────────────────────────
      pdf.setFillColor(22, 101, 52);
      pdf.rect(0, 0, W, 35, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("CSR HUB", W / 2, 14, { align: "center" });
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text("Platform CSR Strategis Indonesia  |  csrhub.id", W / 2, 20, { align: "center" });
      pdf.text("Jl. Sudirman No. 1, Jakarta Pusat 10220  |  info@csrhub.id", W / 2, 26, { align: "center" });

      y = 45;

      // ── JUDUL DOKUMEN ───────────────────────────────────────────────────
      pdf.setTextColor(20, 20, 20);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("BUKTI POTONGAN PAJAK CSR", W / 2, y, { align: "center" }); y += 6;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Sesuai PP No. 93 Tahun 2010 & PMK No. 92 Tahun 2020", W / 2, y, { align: "center" }); y += 3;

      pdf.setDrawColor(22, 101, 52);
      pdf.setLineWidth(0.8);
      pdf.line(M, y, M + CW, y); y += 8;
      pdf.setLineWidth(0.3);

      // ── INFO DOKUMEN ─────────────────────────────────────────────────────
      pdf.setFontSize(9);
      const docInfo = [
        ["Nomor Dokumen", ": " + (report.taxDocument?.documentNumber ?? "-")],
        ["Tanggal Terbit", ": " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })],
        ["Berlaku Sampai", ": " + (report.taxDocument?.validUntil ?? "-")],
        ["Dasar Hukum", ": " + (report.taxDocument?.legalBasis ?? "-")],
      ];
      docInfo.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(60, 60, 60);
        pdf.text(label, M, y);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(20, 20, 20);
        pdf.text(value, M + 45, y);
        y += 7;
      });

      y += 5;

      // ── DATA PERUSAHAAN ─────────────────────────────────────────────────
      pdf.setFillColor(248, 250, 252);
      pdf.rect(M, y, CW, 7, "F");
      pdf.setTextColor(22, 101, 52);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("DATA WAJIB PAJAK / PERUSAHAAN", M + 2, y + 5); y += 12;

      const companyData = [
        ["Nama Perusahaan", report.orgName ?? "-"],
        ["Tahun Pajak", String(report.reportYear ?? new Date().getFullYear())],
        ["Periode Program CSR", report.reportPeriod ?? "-"],
        ["Jumlah Program CSR", `${report.summary?.totalProgramsSubmitted ?? 0} program`],
      ];
      pdf.setFontSize(9);
      companyData.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(80, 80, 80);
        pdf.text(label, M, y);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(20, 20, 20);
        pdf.text(value, M + 55, y);
        pdf.setDrawColor(230, 230, 230);
        pdf.line(M, y + 2, M + CW, y + 2);
        y += 8;
      });

      y += 4;

      // ── RINCIAN POTONGAN PAJAK ──────────────────────────────────────────
      pdf.setFillColor(248, 250, 252);
      pdf.rect(M, y, CW, 7, "F");
      pdf.setTextColor(22, 101, 52);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("RINCIAN POTONGAN PAJAK", M + 2, y + 5); y += 12;

      const taxRows = [
        ["Total Biaya CSR (Pengurang Penghasilan Bruto)", formatRupiah(report.summary?.totalFundedRp ?? 0)],
        ["Tarif PPh Badan yang Berlaku", "22% (sesuai UU HPP)"],
        ["Estimasi Penghematan Pajak (PPh Badan × Biaya CSR)", formatRupiah(report.taxDocument?.eligibleDeductionRp ?? 0)],
      ];

      pdf.setFontSize(9);
      taxRows.forEach(([label, value], idx) => {
        const isFinal = idx === taxRows.length - 1;
        if (isFinal) {
          pdf.setFillColor(236, 252, 243);
          pdf.rect(M, y - 4, CW, 10, "F");
          pdf.setTextColor(22, 101, 52);
        } else {
          pdf.setTextColor(60, 60, 60);
        }
        pdf.setFont("helvetica", isFinal ? "bold" : "normal");
        pdf.text(label, M + 2, y);
        pdf.setFont("helvetica", "bold");
        pdf.text(value, M + CW - 2, y, { align: "right" });
        if (!isFinal) {
          pdf.setDrawColor(220, 220, 220);
          pdf.line(M, y + 2, M + CW, y + 2);
        }
        y += 10;
      });

      y += 8;

      // ── BOX NILAI KLAIM ─────────────────────────────────────────────────
      pdf.setFillColor(22, 101, 52);
      pdf.roundedRect(M, y, CW, 22, 3, 3, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("ESTIMASI PENGHEMATAN PAJAK PPh BADAN (22%)", W / 2, y + 7, { align: "center" });
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(formatRupiah(report.taxDocument?.eligibleDeductionRp ?? 0), W / 2, y + 17, { align: "center" });
      y += 30;

      // ── CATATAN ─────────────────────────────────────────────────────────
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "italic");
      const notes = [
        "* Dokumen ini merupakan bukti potongan pajak penghasilan atas sumbangan yang dapat dikurangkan sesuai",
        "  Peraturan Pemerintah Nomor 93 Tahun 2010 tentang Sumbangan Penanggulangan Bencana Nasional.",
        "* Mekanisme: Seluruh biaya CSR menjadi pengurang penghasilan bruto (biaya fiskal), bukan kredit pajak langsung.",
        "* Estimasi penghematan = Biaya CSR × Tarif PPh Badan 22% (UU HPP). Batas maksimal: 5% dari penghasilan neto",
        "  fiskal tahun pajak sebelumnya (PP No. 93/2010). Lampirkan dokumen ini pada SPT Tahunan Badan.",
      ];
      notes.forEach(note => { pdf.text(note, M, y); y += 5; });

      y += 5;

      // ── TANDA TANGAN ─────────────────────────────────────────────────────
      pdf.setDrawColor(22, 101, 52);
      pdf.line(M, y, M + CW, y); y += 8;

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Diterbitkan oleh:", M, y); y += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text("CSR Hub — Platform CSR Strategis Indonesia", M, y); y += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Jakarta, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, M, y);

      // Cap/stempel simulasi
      pdf.setDrawColor(22, 101, 52);
      pdf.setLineWidth(0.4);
      pdf.circle(W - M - 18, y - 10, 15);
      pdf.setFontSize(6);
      pdf.setTextColor(22, 101, 52);
      pdf.text("DOKUMEN", W - M - 18, y - 12, { align: "center" });
      pdf.text("RESMI", W - M - 18, y - 8, { align: "center" });
      pdf.text("CSR HUB", W - M - 18, y - 4, { align: "center" });

      // Nomor halaman
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(160, 160, 160);
      pdf.text(`Halaman 1 dari 1  |  CSR Hub — ${report.taxDocument?.documentNumber}`, W / 2, 290, { align: "center" });

      pdf.save(`Dokumen_Pajak_CSR_${report.orgName?.replace(/\s+/g, "_")}_${report.reportYear}.pdf`);
      toast.success("Dokumen pajak berhasil diunduh!");
    } catch (err) {
      console.error("Tax PDF error:", err);
      toast.error("Gagal mengunduh dokumen pajak. Coba lagi.");
    }
  }

  async function downloadExcel() {
    if (!report) return;
    try {
      const rows = [
        ["Laporan Keberlanjutan GRI 2021", "", ""],
        ["Perusahaan", report.orgName, ""],
        ["Tahun", report.reportYear, ""],
        ["Periode", report.reportPeriod, ""],
        ["", "", ""],
        ["RINGKASAN EKSEKUTIF", "", ""],
        ["Total Program", report.summary?.totalProgramsSubmitted, ""],
        ["Total Investasi CSR (Rp)", report.summary?.totalFundedRp, ""],
        ["Total Penerima Manfaat", report.summary?.totalBeneficiaries, ""],
        ["SDGs Dituju", (report.summary?.sdgGoalsAddressed ?? []).join(", "), ""],
        ["", "", ""],
        ["GRI 200 — EKONOMI", "", ""],
        ["Total Investasi CSR", report.gri200?.totalInvestmentRp, ""],
        ["Nilai Ekonomi Langsung", report.gri200?.directEconomicValue, ""],
        ["Nilai Ekonomi Tidak Langsung", report.gri200?.indirectEconomicValue, ""],
        ["Pemasok Lokal", `${report.gri200?.localSupplierPercentage}%`, ""],
        ["", "", ""],
        ["GRI 300 — LINGKUNGAN", "", ""],
        ["CO₂ Dikurangi (ton)", report.gri300?.co2OffsetTons, ""],
        ["Pohon Ditanam", report.gri300?.treesPlanted, ""],
        ["Air Dihemat (liter)", report.gri300?.waterConservedLiters, ""],
        ["", "", ""],
        ["GRI 400 — SOSIAL", "", ""],
        ["Total Penerima Manfaat", report.gri400?.totalBeneficiaries, ""],
        ["Keterlibatan Komunitas", report.gri400?.communityEngagements, ""],
        ["Jam Pelatihan", report.gri400?.trainingHours, ""],
        ["Beasiswa Diberikan", report.gri400?.scholarshipsGiven, ""],
        ["", "", ""],
        ["DOKUMEN PAJAK", "", ""],
        ["Nomor Dokumen", report.taxDocument?.documentNumber, ""],
        ["Berlaku Sampai", report.taxDocument?.validUntil, ""],
        ["Potongan Pajak (Rp)", report.taxDocument?.eligibleDeductionRp, ""],
        ["Dasar Hukum", report.taxDocument?.legalBasis, ""],
      ];
      const csvContent = rows.map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_GRI_${report.orgName?.replace(/\s+/g, "_")}_${report.reportYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("File Excel (CSV) berhasil diunduh!");
    } catch {
      toast.error("Gagal mengekspor file.");
    }
  }

  const orgId = selectedOrgId || (orgs[0]?.id ? String(orgs[0].id) : "1");

  const { data: report, isLoading } = useQuery({
    queryKey: ["/api/dashboard/sustainability-report", orgId],
    queryFn: () => customFetch<any>(`/api/dashboard/sustainability-report/${orgId}`),
    enabled: !!orgId,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <FileBarChart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Laporan Keberlanjutan</h1>
          </div>
          <p className="text-muted-foreground text-sm">Format GRI 2021 Universal Standards — dibuat otomatis dari data platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadPdf} disabled={downloading || !report}>
            {downloading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            {downloading ? "Membuat PDF..." : "Unduh PDF"}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadExcel} disabled={!report}>
            <Download className="w-4 h-4 mr-1.5" />Ekspor CSV/Excel
          </Button>
        </div>
      </div>

      {/* Org selector */}
      <div className="mb-6">
        <Select value={selectedOrgId || String(orgs[0]?.id || "")} onValueChange={setSelectedOrgId}>
          <SelectTrigger className="w-72">
            <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Pilih perusahaan..." />
          </SelectTrigger>
          <SelectContent>
            {orgs.map((org: any) => (
              <SelectItem key={org.id} value={String(org.id)}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-40" />)}</div>
      ) : !report ? (
        <div className="text-center py-16">
          <FileBarChart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">Pilih perusahaan untuk melihat laporan</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Cover */}
          <Card className="bg-gradient-to-br from-green-700 to-teal-800 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-green-300" />
                    <span className="text-green-300 text-sm font-medium">{report.griStandard}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">{report.orgName}</h2>
                  <p className="text-white/70 text-sm mb-4">Laporan Keberlanjutan {report.reportYear}</p>
                  <p className="text-white/60 text-xs">Periode: {report.reportPeriod}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-white/20 text-white border-0 mb-3">Auto-Generated</Badge>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-300">{report.summary?.trustScore ?? 0}</p>
                    <p className="text-xs text-white/70">Trust Score</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-white/20" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{report.summary?.totalProgramsSubmitted ?? 0}</p>
                  <p className="text-xs text-white/60">Program Diajukan</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-300">{formatRupiah(report.summary?.totalFundedRp ?? 0)}</p>
                  <p className="text-xs text-white/60">Total Investasi CSR</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{(report.summary?.totalBeneficiaries ?? 0).toLocaleString("id-ID")}</p>
                  <p className="text-xs text-white/60">Penerima Manfaat</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{report.summary?.sdgGoalsAddressed?.length ?? 0}</p>
                  <p className="text-xs text-white/60">SDGs Dituju</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDG Goals */}
          {report.summary?.sdgGoalsAddressed?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Tujuan Pembangunan Berkelanjutan (SDGs)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {report.summary.sdgGoalsAddressed.map((sdg: string) => (
                    <div
                      key={sdg}
                      style={{ backgroundColor: (SDG_COLORS[sdg] ?? "#6366f1") + "20", borderColor: SDG_COLORS[sdg] ?? "#6366f1", color: SDG_COLORS[sdg] ?? "#6366f1" }}
                      className="px-3 py-1 rounded-full text-xs font-bold border-2"
                    >
                      {sdg}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* GRI 200 — Ekonomi */}
          <GRISection code="GRI 200 – Pengungkapan Ekonomi" title="Kinerja Ekonomi & Pemberdayaan" icon={TrendingUp} color="border-l-blue-500">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox icon={TrendingUp} iconClass="bg-blue-100 text-blue-600" label="Total Investasi CSR" value={formatRupiah(report.gri200?.totalInvestmentRp ?? 0)} />
              <StatBox icon={TrendingUp} iconClass="bg-green-100 text-green-600" label="Nilai Ekonomi Langsung" value={formatRupiah(report.gri200?.directEconomicValue ?? 0)} />
              <StatBox icon={Sparkles} iconClass="bg-purple-100 text-purple-600" label="Nilai Ekonomi Tidak Langsung" value={formatRupiah(report.gri200?.indirectEconomicValue ?? 0)} />
              <StatBox icon={Building2} iconClass="bg-amber-100 text-amber-600" label="Pemasok Lokal" value={`${report.gri200?.localSupplierPercentage ?? 0}%`} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">Pengungkapan GRI 201-1: Nilai ekonomi langsung yang dihasilkan dan didistribusikan sesuai GRI Standards 2021.</p>
          </GRISection>

          {/* GRI 300 — Lingkungan */}
          <GRISection code="GRI 300 – Pengungkapan Lingkungan" title="Kinerja Lingkungan" icon={Leaf} color="border-l-green-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatBox icon={Wind} iconClass="bg-green-100 text-green-600" label="CO₂ Dikurangi (ton)" value={`${report.gri300?.co2OffsetTons ?? 0} ton`} />
              <StatBox icon={Trees} iconClass="bg-teal-100 text-teal-600" label="Pohon Ditanam" value={(report.gri300?.treesPlanted ?? 0).toLocaleString("id-ID")} />
              <StatBox icon={Droplets} iconClass="bg-blue-100 text-blue-600" label="Air Dihemat" value={`${((report.gri300?.waterConservedLiters ?? 0) / 1000).toFixed(0)} m³`} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">Pengungkapan GRI 302-1 (Energi) dan GRI 305-1 (Emisi): Data dari program lingkungan yang didanai melalui platform.</p>
          </GRISection>

          {/* GRI 400 — Sosial */}
          <GRISection code="GRI 400 – Pengungkapan Sosial" title="Kinerja Sosial & Masyarakat" icon={Users} color="border-l-purple-500">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox icon={Users} iconClass="bg-purple-100 text-purple-600" label="Total Penerima Manfaat" value={(report.gri400?.totalBeneficiaries ?? 0).toLocaleString("id-ID")} />
              <StatBox icon={Heart} iconClass="bg-red-100 text-red-600" label="Keterlibatan Komunitas" value={`${report.gri400?.communityEngagements ?? 0}x`} />
              <StatBox icon={BookOpen} iconClass="bg-amber-100 text-amber-600" label="Jam Pelatihan" value={`${report.gri400?.trainingHours ?? 0} jam`} />
              <StatBox icon={CheckCircle} iconClass="bg-green-100 text-green-600" label="Beasiswa Diberikan" value={(report.gri400?.scholarshipsGiven ?? 0).toLocaleString("id-ID")} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">Pengungkapan GRI 413-1: Operasi dengan keterlibatan masyarakat lokal, penilaian dampak, dan program pengembangan.</p>
          </GRISection>

          {/* Tax Document */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dokumen Resmi</p>
                  <CardTitle className="text-sm">Bukti Potongan Pajak CSR</CardTitle>
                </div>
                <Button size="sm" variant="outline" className="ml-auto border-amber-400 text-amber-700 hover:bg-amber-100" onClick={downloadTaxDocument}>
                  <Download className="w-3.5 h-3.5 mr-1" />Unduh PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  {[
                    { label: "Nomor Dokumen", value: report.taxDocument?.documentNumber },
                    { label: "Berlaku Sampai", value: report.taxDocument?.validUntil },
                    { label: "Dasar Hukum", value: report.taxDocument?.legalBasis },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-amber-200">
                  <p className="text-xs text-muted-foreground mb-1">Estimasi Penghematan Pajak PPh Badan (22%)</p>
                  <p className="text-2xl font-bold text-amber-700">{formatRupiah(report.taxDocument?.eligibleDeductionRp ?? 0)}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">Sesuai regulasi pemerintah</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer note */}
          <div className="flex items-start gap-3 bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p>
              Laporan ini disusun secara otomatis berdasarkan data aktivitas program CSR yang tercatat di platform CSR Hub.
              Untuk keperluan audit eksternal, data dapat diverifikasi melalui fitur Audit Log platform. Standar pelaporan
              mengacu pada <strong>GRI 2021 Universal Standards</strong> yang diakui secara internasional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
