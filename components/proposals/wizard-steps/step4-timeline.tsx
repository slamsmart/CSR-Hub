"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProposalWizardData } from "../proposal-wizard";
import { differenceInMonths, parseISO } from "date-fns";

export function ProposalStep4() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProposalWizardData>();
  const { fields, append, remove } = useFieldArray({ name: "milestones" });
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const durationMonths = React.useMemo(() => {
    if (!startDate || !endDate) return 0;
    try {
      return Math.max(1, differenceInMonths(parseISO(endDate), parseISO(startDate)));
    } catch {
      return 0;
    }
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Tanggal */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">
            Tanggal Mulai <span className="form-required">*</span>
          </label>
          <Input
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Tanggal Selesai <span className="form-required">*</span>
          </label>
          <Input
            type="date"
            error={errors.endDate?.message}
            {...register("endDate")}
          />
        </div>
      </div>

      {durationMonths > 0 && (
        <div className="rounded-lg bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-brand-700">
          Durasi program: <strong>{durationMonths} bulan</strong>
        </div>
      )}

      {/* Milestones */}
      <div>
        <label className="form-label mb-3 block">
          Milestone / Tahapan Program <span className="form-required">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Bagi program menjadi tahapan-tahapan yang terukur. Minimal 1 milestone diperlukan.
        </p>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-xl border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Milestone {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2 form-group">
                  <label className="text-xs font-medium">Judul Milestone</label>
                  <Input
                    placeholder="Contoh: Kick-off dan Persiapan"
                    className="mt-1"
                    {...register(`milestones.${index}.title`)}
                  />
                </div>
                <div className="form-group">
                  <label className="text-xs font-medium">Target Tanggal</label>
                  <Input
                    type="date"
                    className="mt-1"
                    {...register(`milestones.${index}.targetDate`)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="text-xs font-medium">Deskripsi (Opsional)</label>
                <Textarea
                  placeholder="Apa yang dicapai pada tahap ini..."
                  className="min-h-[60px] mt-1 text-sm"
                  {...register(`milestones.${index}.description`)}
                />
              </div>

              <input type="hidden" {...register(`milestones.${index}.orderIndex`)} value={index} />
            </div>
          ))}
        </div>

        {errors.milestones && !Array.isArray(errors.milestones) && (
          <p className="mt-1 text-xs text-destructive">{(errors.milestones as any).message}</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 gap-2"
          onClick={() =>
            append({
              title: "",
              description: "",
              targetDate: endDate || "",
              orderIndex: fields.length,
            })
          }
        >
          <Plus className="h-4 w-4" />
          Tambah Milestone
        </Button>
      </div>

      {/* Impact Statement */}
      <div className="form-group">
        <label className="form-label">
          Estimasi Dampak Program
          <span className="text-xs text-muted-foreground ml-2 font-normal">(Opsional)</span>
        </label>
        <Textarea
          placeholder="Jelaskan dampak jangka pendek dan jangka panjang yang diharapkan dari program ini. Contoh: Setelah 6 bulan, 100 siswa diharapkan mendapat beasiswa dan meningkatkan angka kelulusan SMA di wilayah tersebut..."
          className="min-h-[100px]"
          {...register("estimatedImpact")}
        />
      </div>
    </div>
  );
}
