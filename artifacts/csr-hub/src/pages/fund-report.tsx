import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Upload, Download, CheckCircle, Clock, AlertCircle,
  XCircle, FileCheck, Loader2, Trash2, Eye, BookOpen, Shield,
  Receipt, Building2, Users, CalendarDays, Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

const BASE_URL = import.meta.env.BASE_URL ?? "/csr-hub/";

const STATUS_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  draft:           { label: "Draft",            icon: Clock,        className: "bg-gray-100 text-gray-700" },
  submitted:       { label: "Dikirim",          icon: Clock,        className: "bg-blue-100 text-blue-700" },
  under_review:    { label: "Sedang Diperiksa", icon: Eye,          className: "bg-amber-100 text-amber-700" },
  approved:        { label: "Disetujui",        icon: CheckCircle,  className: "bg-green-100 text-green-700" },
  revision_needed: { label: "Perlu Revisi",     icon: AlertCircle,  className: "bg-red-100 text-red-700" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function generateTemplate() {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210; const M = 20; const CW = W - M * 2;
  let y = 0;

  const checkY = (need: number) => { if (y + need > 272) { pdf.addPage(); y = 20; } };

  const sectionHeader = (title: string, color: [number,number,number] = [15, 23, 42]) => {
    checkY(14);
    pdf.setFillColor(...color);
    pdf.rect(M, y, CW, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, M + 3, y + 5.5);
    y += 12;
    pdf.setTextColor(30, 30, 30);
  };

  const fieldRow = (label: string, hint = "") => {
    checkY(14);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    pdf.text(label, M, y);
    if (hint) {
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(130, 130, 130);
      pdf.setFontSize(7);
      pdf.text(hint, M, y + 4);
    }
    pdf.setDrawColor(180, 180, 180);
    pdf.line(M + 60, y + 1, M + CW, y + 1);
    y += hint ? 9 : 7;
  };

  const tableRow = (cols: string[], widths: number[], isHeader = false, bg?: [number,number,number]) => {
    checkY(8);
    if (bg) { pdf.setFillColor(...bg); pdf.rect(M, y - 5, CW, 7, "F"); }
    let x = M;
    pdf.setFont("helvetica", isHeader ? "bold" : "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(isHeader ? 255 : 30, isHeader ? 255 : 30, isHeader ? 255 : 30);
    cols.forEach((col, i) => {
      pdf.text(col, x + 1.5, y);
      x += widths[i];
    });
    pdf.setDrawColor(210, 210, 210);
    pdf.line(M, y + 2, M + CW, y + 2);
    y += 7;
  };

  // ── COVER ──────────────────────────────────────────────────────────────
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, W, 50, "F");
  pdf.setFillColor(22, 163, 74);
  pdf.rect(0, 50, W, 4, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("CSR HUB  |  TEMPLATE RESMI  |  csrhub.id", M, 12);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("LAPORAN PERTANGGUNGJAWABAN", M, 26);
  pdf.text("PENGGUNAAN DANA CSR", M, 34);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(200, 220, 200);
  pdf.text("Sesuai Standar Pelaporan TJSL — OJK & PROPER KLHK", M, 42);

  // Meta boxes
  pdf.setFillColor(241, 245, 249);
  pdf.rect(M, 60, CW, 36, "F");
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(8);
  const metaFields = [
    ["Nama Program CSR", "_______________________________________________"],
    ["Nama Organisasi Penerima", "_______________________________________________"],
    ["Nomor Perjanjian / MoU", "_______________________________________________"],
    ["Total Dana yang Diterima", "Rp ___________________________________________"],
    ["Periode Pelaporan", "___________________ s/d ___________________"],
  ];
  y = 66;
  metaFields.forEach(([label, blank]) => {
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(60, 60, 60);
    pdf.text(label, M + 3, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(blank, M + 62, y);
    y += 6;
  });

  pdf.setFontSize(7);
  pdf.setTextColor(130, 130, 130);
  pdf.setFont("helvetica", "italic");
  y = 103;
  pdf.text("Template ini disusun mengacu pada Peraturan OJK No. 51/POJK.03/2017 tentang Keuangan Berkelanjutan,", M, y); y += 4;
  pdf.text("PROPER KLHK, dan panduan pelaporan CSR Kementerian BUMN. Isi dengan data aktual program.", M, y); y += 10;

  // ── BAB I ──────────────────────────────────────────────────────────────
  sectionHeader("BAB I  —  PROFIL ORGANISASI PENERIMA DANA");
  const orgFields: [string, string][] = [
    ["Nama Organisasi", ""],
    ["Bentuk Hukum", "Yayasan / Perkumpulan / Koperasi / Lainnya"],
    ["Nomor Registrasi / NIB", ""],
    ["SK Kemenkumham / Akta Notaris", ""],
    ["Nomor NPWP", ""],
    ["Alamat Lengkap", ""],
    ["Kota / Kabupaten", ""],
    ["Nama Ketua / Direktur", ""],
    ["Nomor Telepon / WA", ""],
    ["Email Organisasi", ""],
    ["Rekening Bank (untuk audit)", "Bank _______ No. Rek __________________ a.n. ___________"],
  ];
  orgFields.forEach(([l, h]) => fieldRow(l, h));

  // ── BAB II ─────────────────────────────────────────────────────────────
  y += 3;
  sectionHeader("BAB II  —  RINGKASAN PELAKSANAAN PROGRAM");
  const progFields: [string, string][] = [
    ["Nama Program / Kegiatan", ""],
    ["Tujuan Program", ""],
    ["Fokus SDGs", "SDG ___ : ______________________________________"],
    ["Lokasi Pelaksanaan", "Desa/Kel: _____________ Kec: _____________ Kab/Kota: _____________"],
    ["Tanggal Mulai", ""],
    ["Tanggal Selesai", ""],
    ["Jumlah Penerima Manfaat", "___________ orang  (L: _______ P: _______)"],
    ["Mitra Pelaksana (jika ada)", ""],
  ];
  progFields.forEach(([l, h]) => fieldRow(l, h));

  // ── BAB III ────────────────────────────────────────────────────────────
  y += 3;
  sectionHeader("BAB III  —  REALISASI ANGGARAN & PENGGUNAAN DANA");

  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "italic");
  pdf.text("Rincian perbandingan antara anggaran yang direncanakan dengan realisasi aktual pengeluaran.", M, y); y += 6;

  const budgetCols = ["No.", "Uraian Kegiatan / Komponen Biaya", "Anggaran (Rp)", "Realisasi (Rp)", "Selisih (Rp)"];
  const budgetW   = [10, 70, 35, 35, 30];
  tableRow(budgetCols, budgetW, true, [15, 23, 42]);
  for (let i = 1; i <= 8; i++) {
    tableRow([`${i}.`, "", "", "", ""], budgetW);
  }
  tableRow(["", "TOTAL", "", "", ""], budgetW, false, [240, 248, 240]);
  y += 3;

  checkY(16);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(30, 30, 30);
  pdf.text("Sisa Dana / Pengembalian Dana:", M, y); y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(80, 80, 80);
  pdf.text("Rp _________________________   Keterangan: ________________________________________________", M, y);
  y += 10;

  // ── BAB IV ─────────────────────────────────────────────────────────────
  sectionHeader("BAB IV  —  LAPORAN RINCIAN AKTIVITAS PELAKSANAAN");
  const actCols = ["No.", "Nama Kegiatan", "Tanggal", "Lokasi", "Peserta", "Biaya (Rp)"];
  const actW   = [10, 60, 25, 35, 20, 30];
  tableRow(actCols, actW, true, [15, 23, 42]);
  for (let i = 1; i <= 6; i++) {
    tableRow([`${i}.`, "", "", "", "", ""], actW);
  }
  y += 5;

  // ── BAB V ──────────────────────────────────────────────────────────────
  sectionHeader("BAB V  —  DATA PENERIMA MANFAAT");
  pdf.setFontSize(8); pdf.setTextColor(80,80,80);
  pdf.text("Lampirkan daftar lengkap penerima manfaat. Contoh format (isi sesuai data aktual):", M, y); y += 5;
  const benCols = ["No.", "Nama Lengkap", "L/P", "Usia", "Alamat / RT-RW", "Keterangan"];
  const benW   = [10, 52, 8, 12, 52, 36];
  tableRow(benCols, benW, true, [15, 23, 42]);
  for (let i = 1; i <= 5; i++) {
    tableRow([`${i}.`, "", "", "", "", ""], benW);
  }
  pdf.setFontSize(7.5);
  pdf.setTextColor(130,130,130);
  pdf.setFont("helvetica","italic");
  y += 2;
  pdf.text("* Lampirkan tabel lengkap sebagai lampiran terpisah jika penerima manfaat > 5 orang.", M, y);
  y += 8;

  // ── BAB VI ─────────────────────────────────────────────────────────────
  sectionHeader("BAB VI  —  CAPAIAN DAN DAMPAK PROGRAM");
  checkY(40);
  const impactCols = ["Indikator Capaian", "Target Awal", "Realisasi", "Satuan", "Keterangan"];
  const impactW   = [60, 25, 25, 25, 45];
  tableRow(impactCols, impactW, true, [15, 23, 42]);
  const sampleIndicators = [
    "Jumlah penerima manfaat langsung",
    "Jumlah penerima manfaat tidak langsung",
    "Peningkatan pengetahuan/keterampilan",
    "Jumlah kegiatan terlaksana",
    "SDG yang dituju (sebutkan)",
  ];
  sampleIndicators.forEach(ind => tableRow([ind, "", "", "", ""], impactW));
  y += 5;
  checkY(20);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(30,30,30);
  pdf.text("Narasi Dampak (jelaskan perubahan positif yang dirasakan penerima manfaat):", M, y); y += 5;
  pdf.setDrawColor(180,180,180);
  for (let i = 0; i < 4; i++) { pdf.line(M, y, M+CW, y); y += 6; }
  y += 5;

  // ── BAB VII ────────────────────────────────────────────────────────────
  sectionHeader("BAB VII  —  DAFTAR KELENGKAPAN DOKUMEN PENDUKUNG");
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(30,30,30);
  const docs = [
    ["Kuitansi / Faktur / Invoice seluruh pengeluaran", "Wajib"],
    ["Rekening koran / mutasi bank periode pelaporan", "Wajib"],
    ["Daftar hadir peserta (per kegiatan)", "Wajib"],
    ["Dokumentasi foto kegiatan (min. 3 foto per kegiatan)", "Wajib"],
    ["Laporan naratif per kegiatan", "Wajib"],
    ["Surat pernyataan penerima manfaat", "Wajib jika ada distribusi barang/uang"],
    ["BAST (Berita Acara Serah Terima) barang/jasa", "Jika ada pengadaan"],
    ["Kontrak/SPK dengan vendor pihak ketiga", "Jika ada pengadaan > Rp 10 juta"],
    ["Laporan audit internal (jika ada)", "Dianjurkan"],
    ["Surat keterangan dari kepala desa / lurah / RT", "Dianjurkan"],
  ];
  docs.forEach(([doc, req]) => {
    checkY(7);
    pdf.setFillColor(250, 250, 250);
    pdf.rect(M, y-4, CW, 6, "F");
    pdf.setDrawColor(220,220,220);
    pdf.rect(M+1, y-3.5, 4, 4);
    pdf.setFont("helvetica", "normal"); pdf.setTextColor(30,30,30);
    pdf.text(doc, M + 8, y);
    pdf.setFont("helvetica", "italic"); pdf.setTextColor(req === "Wajib" ? 220 : 150, req === "Wajib" ? 50 : 150, req === "Wajib" ? 50 : 150);
    pdf.text(`[${req}]`, M + CW - 2, y, { align: "right" });
    y += 7;
  });
  y += 5;

  // ── BAB VIII: PERNYATAAN ───────────────────────────────────────────────
  sectionHeader("BAB VIII  —  SURAT PERNYATAAN KEBENARAN LAPORAN");
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(30,30,30);
  checkY(60);
  pdf.text("Yang bertanda tangan di bawah ini:", M, y); y += 6;
  const sigFields: [string, string][] = [
    ["Nama", ""],["Jabatan", ""],["Nama Organisasi", ""],["Nomor KTP / NIK", ""],
  ];
  sigFields.forEach(([l]) => fieldRow(l));
  y += 3;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8);
  const declaration = [
    "Menyatakan dengan sesungguhnya bahwa laporan pertanggungjawaban penggunaan dana CSR ini",
    "disusun berdasarkan fakta dan data yang benar, seluruh pengeluaran telah digunakan sesuai",
    "dengan tujuan program yang telah disepakati, dan seluruh dokumen pendukung tersedia untuk",
    "keperluan audit dan verifikasi oleh pemberi dana maupun pihak yang berwenang.",
  ];
  declaration.forEach(line => { pdf.text(line, M, y); y += 5; });
  y += 8;

  const sigX = [M, M + CW / 2];
  sigX.forEach((sx, i) => {
    const label = i === 0 ? "Pimpinan Organisasi Penerima" : "Diketahui oleh: Perusahaan Pemberi Dana";
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(30, 30, 30);
    pdf.text(label, sx, y);
    pdf.setFont("helvetica", "normal"); pdf.setTextColor(100, 100, 100);
    pdf.text("___________________________", sx, y + 25);
    pdf.text(i === 0 ? "Nama & Stempel Organisasi" : "Nama, Jabatan & Stempel", sx, y + 30);
    pdf.text(`Tanggal: ___________________`, sx, y + 35);
  });
  y += 42;

  // ── FOOTER ────────────────────────────────────────────────────────────
  const pgCount = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= pgCount; i++) {
    pdf.setPage(i);
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 287, W, 10, "F");
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Halaman ${i} dari ${pgCount}   |   Template Laporan CSR — CSR Hub (csrhub.id)   |   Mengacu pada POJK 51/2017, PROPER KLHK & Permen BUMN`,
      W / 2, 293, { align: "center" }
    );
  }

  pdf.save("Template_Laporan_Penggunaan_Dana_CSR_CSRHub.pdf");
}

export default function FundReportPage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    programName: "", reportPeriodStart: "", reportPeriodEnd: "",
    totalFundReceived: "", totalFundUsed: "", notes: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingTemplate, setGeneratingTemplate] = useState(false);

  const isAdmin = ["super_admin", "admin", "auditor", "verifikator"].includes(user?.role ?? "");
  const canUpload = isAuthenticated && !["super_admin", "admin"].includes(user?.role ?? "");

  const { data: reports = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/fund-reports"],
    queryFn: () => customFetch<any[]>("/api/fund-reports"),
    enabled: isAuthenticated,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reviewNotes }: any) =>
      customFetch(`/api/fund-reports/${id}/review`, { method: "PATCH", body: JSON.stringify({ status, reviewNotes }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fund-reports"] });
      toast.success("Status laporan diperbarui");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      customFetch(`/api/fund-reports/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fund-reports"] });
      toast.success("Laporan dihapus");
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) { toast.error("Pilih file PDF terlebih dahulu"); return; }
    if (!form.programName || !form.reportPeriodStart || !form.reportPeriodEnd) {
      toast.error("Lengkapi semua field yang wajib diisi"); return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      await customFetch("/api/fund-reports", {
        method: "POST",
        body: JSON.stringify({
          programName: form.programName,
          reportPeriodStart: form.reportPeriodStart,
          reportPeriodEnd: form.reportPeriodEnd,
          totalFundReceived: Number(form.totalFundReceived.replace(/\D/g, "")) || 0,
          totalFundUsed: Number(form.totalFundUsed.replace(/\D/g, "")) || 0,
          filename: selectedFile.name,
          fileMimeType: selectedFile.type,
          fileSize: selectedFile.size,
          fileContent: base64,
          notes: form.notes,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ["/api/fund-reports"] });
      toast.success("Laporan berhasil diunggah!");
      setForm({ programName: "", reportPeriodStart: "", reportPeriodEnd: "", totalFundReceived: "", totalFundUsed: "", notes: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Gagal mengunggah laporan. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownloadReport(id: number, filename: string) {
    try {
      const apiBase = BASE_URL.replace(/\/$/, "");
      const token = localStorage.getItem("csr_hub_token");
      const res = await fetch(`${apiBase}/api/fund-reports/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Gagal mengunduh file.");
    }
  }

  async function handleTemplate() {
    setGeneratingTemplate(true);
    try {
      await generateTemplate();
      toast.success("Template berhasil diunduh!");
    } catch (e) {
      console.error(e);
      toast.error("Gagal membuat template.");
    } finally {
      setGeneratingTemplate(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <FileCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Laporan Penggunaan Dana CSR</h1>
          <p className="text-sm text-muted-foreground">Pelaporan pertanggungjawaban realisasi anggaran program CSR kepada pemberi dana</p>
        </div>

        <Button variant="outline" className="ml-auto gap-2 border-primary text-primary hover:bg-primary/5"
          onClick={handleTemplate} disabled={generatingTemplate}>
          {generatingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
          {generatingTemplate ? "Membuat..." : "Unduh Template PDF"}
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
        <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-blue-800">
          <p className="font-medium mb-1">Panduan Pelaporan Penggunaan Dana CSR</p>
          <p className="text-xs leading-relaxed">
            Laporan disusun mengacu pada <strong>POJK No. 51/POJK.03/2017</strong> (Keuangan Berkelanjutan),
            <strong> PROPER KLHK</strong>, dan panduan pelaporan CSR Kementerian BUMN. Unduh template di atas,
            isi dengan data aktual, lalu unggah laporan yang sudah ditandatangani dan distempel dalam format PDF.
            Batas ukuran file: <strong>10 MB</strong>.
          </p>
        </div>
      </div>

      <Tabs defaultValue={canUpload ? "upload" : "riwayat"}>
        <TabsList>
          {canUpload && <TabsTrigger value="upload" className="gap-2"><Upload className="w-4 h-4" />Unggah Laporan</TabsTrigger>}
          <TabsTrigger value="riwayat" className="gap-2"><FileText className="w-4 h-4" />Riwayat Laporan</TabsTrigger>
        </TabsList>

        {/* ── UPLOAD TAB ── */}
        {canUpload && (
          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Unggah Laporan Pertanggungjawaban</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Nama Program CSR <span className="text-red-500">*</span></Label>
                    <Input placeholder="cth. Program Beasiswa Anak Pesisir 2025"
                      value={form.programName}
                      onChange={e => setForm(f => ({ ...f, programName: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Periode Mulai <span className="text-red-500">*</span></Label>
                    <Input type="date" value={form.reportPeriodStart}
                      onChange={e => setForm(f => ({ ...f, reportPeriodStart: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Periode Selesai <span className="text-red-500">*</span></Label>
                    <Input type="date" value={form.reportPeriodEnd}
                      onChange={e => setForm(f => ({ ...f, reportPeriodEnd: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Total Dana Diterima (Rp)</Label>
                    <Input placeholder="cth. 150000000"
                      value={form.totalFundReceived}
                      onChange={e => setForm(f => ({ ...f, totalFundReceived: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Total Dana Terpakai (Rp)</Label>
                    <Input placeholder="cth. 148500000"
                      value={form.totalFundUsed}
                      onChange={e => setForm(f => ({ ...f, totalFundUsed: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Catatan Tambahan</Label>
                    <Textarea placeholder="Informasi tambahan, catatan sisa dana, pengembalian, dsb."
                      rows={3} value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>

                <Separator />

                {/* File upload zone */}
                <div
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      <p className="text-xs text-green-600 font-medium">File siap diunggah — klik untuk ganti</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">Klik untuk pilih file PDF</p>
                      <p className="text-sm text-muted-foreground">atau seret file ke sini</p>
                      <p className="text-xs text-muted-foreground">Format: PDF · Maks. 10 MB</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf,application/pdf"
                    className="hidden" onChange={handleFileChange} />
                </div>

                <Button className="w-full gap-2" onClick={handleUpload} disabled={uploading || !selectedFile}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Mengunggah..." : "Kirim Laporan"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* ── RIWAYAT TAB ── */}
        <TabsContent value="riwayat" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Memuat riwayat laporan...
            </div>
          ) : reports.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Belum ada laporan yang diunggah</p>
                {canUpload && <p className="text-sm text-muted-foreground mt-1">Gunakan tab "Unggah Laporan" untuk mengirimkan laporan pertama Anda</p>}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {(reports as any[]).map((r: any) => (
                <Card key={r.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <p className="font-semibold text-foreground text-sm truncate">{r.programName}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {r.reportPeriodStart} s/d {r.reportPeriodEnd}
                          </span>
                          <span className="flex items-center gap-1">
                            <Banknote className="w-3 h-3" />
                            Diterima: {formatRupiah(r.totalFundReceived)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            Terpakai: {formatRupiah(r.totalFundUsed)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {r.filename} ({formatFileSize(r.fileSize)})
                          </span>
                        </div>
                        {r.reviewNotes && (
                          <div className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
                            <strong>Catatan Reviewer:</strong> {r.reviewNotes}
                          </div>
                        )}
                        {r.notes && (
                          <p className="mt-1.5 text-xs text-muted-foreground italic">Catatan: {r.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" className="gap-1 text-xs h-8"
                          onClick={() => handleDownloadReport(r.id, r.filename)}>
                          <Download className="w-3.5 h-3.5" /> Unduh
                        </Button>
                        {isAdmin && r.status === "submitted" && (
                          <>
                            <Button size="sm" className="gap-1 text-xs h-8 bg-green-600 hover:bg-green-700"
                              onClick={() => reviewMutation.mutate({ id: r.id, status: "approved" })}>
                              <CheckCircle className="w-3.5 h-3.5" /> Setujui
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-8 border-amber-400 text-amber-700"
                              onClick={() => {
                                const note = prompt("Masukkan catatan revisi:");
                                if (note) reviewMutation.mutate({ id: r.id, status: "revision_needed", reviewNotes: note });
                              }}>
                              <AlertCircle className="w-3.5 h-3.5" /> Revisi
                            </Button>
                          </>
                        )}
                        {(!isAdmin || user?.role === "super_admin") && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("Hapus laporan ini?")) deleteMutation.mutate(r.id);
                            }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
