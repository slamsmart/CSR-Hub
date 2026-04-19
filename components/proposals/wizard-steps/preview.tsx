"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ProposalWizardData } from "../proposal-wizard";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, SDG_LABELS } from "@/types";
import { formatRupiah, formatDate } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { SDGCategory } from "@prisma/client";

export function ProposalPreview() {
  const { watch } = useFormContext<ProposalWizardData>();
  const data = watch();

  const breakdown = data.budgetBreakdown || [];
  const totalBudget = breakdown.reduce((sum, item) => sum + (Number(item.volume) * Number(item.hargaSatuan)), 0);

  const validations = [
    { field: "Judul", valid: (data.title?.length || 0) >= 10, msg: `${data.title?.length || 0}/10 karakter` },
    { field: "Ringkasan", valid: (data.summary?.length || 0) >= 50, msg: `${data.summary?.length || 0}/50 karakter` },
    { field: "Deskripsi", valid: (data.description?.length || 0) >= 200, msg: `${data.description?.length || 0}/200 karakter` },
    { field: "Kategori", valid: !!data.category, msg: data.category ? "Dipilih" : "Belum dipilih" },
    { field: "SDG Tags", valid: (data.sdgTags?.length || 0) >= 1, msg: `${data.sdgTags?.length || 0} SDG dipilih` },
    { field: "Provinsi", valid: !!data.provinsi, msg: data.provinsi || "Belum dipilih" },
    { field: "Target Penerima", valid: (data.targetBeneficiaries || 0) > 0, msg: `${data.targetBeneficiaries || 0} orang` },
    { field: "Anggaran", valid: (data.budgetTotal || 0) >= 1000000, msg: formatRupiah(data.budgetTotal || 0, true) },
    { field: "Rincian Anggaran", valid: breakdown.length >= 1, msg: `${breakdown.length} item` },
    { field: "Tanggal Mulai", valid: !!data.startDate, msg: data.startDate || "Belum diisi" },
    { field: "Milestone", valid: (data.milestones?.length || 0) >= 1, msg: `${data.milestones?.length || 0} milestone` },
    { field: "Dokumen", valid: (data.attachments?.length || 0) >= 1, msg: `${data.attachments?.length || 0} file` },
  ];

  const allValid = validations.every((v) => v.valid);

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <div className={`rounded-xl p-4 border ${allValid ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
        <div className="flex items-center gap-2 mb-3">
          {allValid ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          <p className={`font-semibold text-sm ${allValid ? "text-green-700" : "text-orange-700"}`}>
            {allValid ? "Semua field wajib telah diisi dengan benar" : "Ada beberapa field yang perlu diperhatikan"}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {validations.map((v) => (
            <div key={v.field} className="flex items-center gap-1.5 text-xs">
              {v.valid ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
              )}
              <span className={v.valid ? "text-green-700" : "text-orange-700"}>
                {v.field}: {v.msg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="rounded-xl border divide-y">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Informasi Dasar</h3>
          <h2 className="text-xl font-bold mb-2">{data.title || "(Judul belum diisi)"}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.category && (
              <Badge variant="brand">{CATEGORY_LABELS[data.category as keyof typeof CATEGORY_LABELS] || data.category}</Badge>
            )}
            {data.sdgTags?.map((sdg) => (
              <Badge key={sdg} variant="teal" className="text-xs">
                {SDG_LABELS[sdg as SDGCategory]?.split(": ")[0]}
              </Badge>
            ))}
          </div>
          {data.summary && <p className="text-muted-foreground text-sm">{data.summary}</p>}
        </div>

        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Provinsi</p>
            <p className="font-semibold text-sm">{data.provinsi || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Target Penerima</p>
            <p className="font-semibold text-sm">{(data.targetBeneficiaries || 0).toLocaleString("id-ID")} orang</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Anggaran</p>
            <p className="font-semibold text-sm text-brand-600">{formatRupiah(data.budgetTotal || 0, true)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Durasi</p>
            <p className="font-semibold text-sm">
              {data.startDate && data.endDate ? `${data.startDate} s/d ${data.endDate}` : "-"}
            </p>
          </div>
        </div>

        {breakdown.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Rincian Anggaran</h3>
            <div className="space-y-1">
              {breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.deskripsi || item.kategori}</span>
                  <span className="font-medium">{formatRupiah((Number(item.volume) * Number(item.hargaSatuan)) || 0, true)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-brand-600">{formatRupiah(totalBudget, true)}</span>
              </div>
            </div>
          </div>
        )}

        {(data.milestones?.length || 0) > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Timeline & Milestone</h3>
            <div className="space-y-2">
              {data.milestones?.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    {m.targetDate && <p className="text-xs text-muted-foreground">Target: {m.targetDate}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.attachments?.length || 0) > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dokumen Pendukung</h3>
            <div className="space-y-2">
              {data.attachments?.map((attachment, i) => (
                <div key={`${attachment.fileUrl}-${i}`} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">{attachment.type}</p>
                  </div>
                  <a href={attachment.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                    Lihat
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground text-center">
        Dengan mengklik "Kirim Proposal", Anda menyatakan bahwa semua informasi yang disampaikan adalah benar dan dapat dipertanggungjawabkan.
      </div>
    </div>
  );
}
