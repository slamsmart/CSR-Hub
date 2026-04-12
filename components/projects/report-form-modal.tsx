"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const schema = z.object({
  reportType: z.enum(["BULANAN", "TRIWULAN", "AKHIR", "KEUANGAN"]),
  reportingPeriod: z.string().min(1, "Wajib diisi"),
  title: z.string().min(3, "Minimal 3 karakter"),
  summary: z.string().min(10, "Minimal 10 karakter"),
  progressFisik: z.number({ coerce: true }).min(0).max(100),
  progressKeuangan: z.number({ coerce: true }).min(0).max(100),
  realisasiAnggaran: z.number({ coerce: true }).min(0),
  pencapaian: z.string().optional(),
  kendala: z.string().optional(),
  rencanaTindakLanjut: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ReportFormModalProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const REPORT_TYPES = [
  { value: "BULANAN", label: "Laporan Bulanan" },
  { value: "TRIWULAN", label: "Laporan Triwulan" },
  { value: "KEUANGAN", label: "Laporan Keuangan" },
  { value: "AKHIR", label: "Laporan Akhir" },
];

export function ReportFormModal({ projectId, projectTitle, onClose, onSuccess }: ReportFormModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitAs, setSubmitAs] = useState<"draft" | "submit">("submit");

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      reportType: "BULANAN",
      progressFisik: 0,
      progressKeuangan: 0,
      realisasiAnggaran: 0,
      reportingPeriod: new Date().toISOString().slice(0, 7),
    },
  });

  const progressFisik = watch("progressFisik");
  const progressKeuangan = watch("progressKeuangan");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setUploadedFiles((prev) => [...prev, { name: file.name, url: data.url }]);
        }
      }
      toast.success("File berhasil diupload");
    } catch {
      toast.error("Gagal upload file");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch(`/api/projects/${projectId}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          attachments: uploadedFiles.map((f) => f.url),
          isSubmitted: submitAs === "submit",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(submitAs === "submit" ? "Laporan berhasil dikirim!" : "Draf laporan disimpan");
      onSuccess();
    } catch {
      toast.error("Gagal menyimpan laporan");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-lg">Buat Laporan Proyek</h2>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{projectTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Jenis & Periode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Jenis Laporan</label>
              <select
                {...register("reportType")}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-background"
              >
                {REPORT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Periode (Bulan/Tahun)</label>
              <Input type="month" {...register("reportingPeriod")} />
              {errors.reportingPeriod && <p className="text-xs text-red-500 mt-1">{errors.reportingPeriod.message}</p>}
            </div>
          </div>

          {/* Judul */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Judul Laporan</label>
            <Input placeholder="Contoh: Laporan Bulanan April 2025 - Beasiswa SMA" {...register("title")} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Progress */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Progres Fisik: <span className="text-brand-600 font-bold">{progressFisik}%</span>
              </label>
              <input
                type="range" min="0" max="100" step="1"
                {...register("progressFisik")}
                className="w-full accent-brand-600"
              />
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-brand-600 h-2 rounded-full transition-all" style={{ width: `${progressFisik}%` }} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Progres Keuangan: <span className="text-teal-600 font-bold">{progressKeuangan}%</span>
              </label>
              <input
                type="range" min="0" max="100" step="1"
                {...register("progressKeuangan")}
                className="w-full accent-teal-600"
              />
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${progressKeuangan}%` }} />
              </div>
            </div>
          </div>

          {/* Realisasi Anggaran */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Realisasi Anggaran (Rp)</label>
            <Input
              type="number" min="0" placeholder="0"
              {...register("realisasiAnggaran")}
            />
            {errors.realisasiAnggaran && <p className="text-xs text-red-500 mt-1">{errors.realisasiAnggaran.message}</p>}
          </div>

          {/* Ringkasan */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Ringkasan Kegiatan</label>
            <textarea
              {...register("summary")}
              rows={3}
              placeholder="Deskripsikan kegiatan yang sudah dilakukan pada periode ini..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            {errors.summary && <p className="text-xs text-red-500 mt-1">{errors.summary.message}</p>}
          </div>

          {/* Pencapaian */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Pencapaian & Dampak</label>
            <textarea
              {...register("pencapaian")}
              rows={2}
              placeholder="Apa saja yang sudah dicapai? Berapa penerima manfaat?"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Kendala & Rencana */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Kendala & Solusi</label>
              <textarea
                {...register("kendala")}
                rows={2}
                placeholder="Kendala yang dihadapi dan solusi yang diambil..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Rencana Tindak Lanjut</label>
              <textarea
                {...register("rencanaTindakLanjut")}
                rows={2}
                placeholder="Kegiatan yang direncanakan untuk periode berikutnya..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
          </div>

          {/* Lampiran */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Lampiran Dokumen (PDF, Foto, dll)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-brand-400 transition-colors">
              <input
                type="file"
                id="attachments"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="attachments" className="cursor-pointer flex flex-col items-center gap-2">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Mengupload..." : "Klik untuk upload atau drag & drop"}
                </span>
                <span className="text-xs text-muted-foreground">PDF, Word, Excel, JPG, PNG (maks 10MB)</span>
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-brand-50 rounded-lg px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-brand-600 flex-shrink-0" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <button
                      type="button"
                      onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t">
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
              onClick={() => setSubmitAs("draft")}
            >
              Simpan Draf
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="flex-1 gap-2"
              disabled={isSubmitting}
              onClick={() => setSubmitAs("submit")}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Kirim Laporan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
