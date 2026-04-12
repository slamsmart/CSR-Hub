"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProposalWizardData } from "../proposal-wizard";
import { formatRupiah } from "@/lib/utils";

const BUDGET_CATEGORIES = [
  "Honorarium / Upah",
  "Bahan & Material",
  "Peralatan & Aset",
  "Perjalanan Dinas",
  "Konsumsi & Akomodasi",
  "Biaya Operasional",
  "Biaya Komunikasi",
  "Biaya Dokumentasi",
  "Biaya Evaluasi & Monitoring",
  "Biaya Tak Terduga",
  "Lainnya",
];

export function ProposalStep3() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProposalWizardData>();
  const { fields, append, remove } = useFieldArray({ name: "budgetBreakdown" });
  const breakdown = watch("budgetBreakdown") || [];

  const totalFromBreakdown = breakdown.reduce((sum, item) => {
    const vol = Number(item.volume) || 0;
    const harga = Number(item.hargaSatuan) || 0;
    return sum + vol * harga;
  }, 0);

  function updateTotal(index: number) {
    const item = breakdown[index];
    if (item) {
      const total = (Number(item.volume) || 0) * (Number(item.hargaSatuan) || 0);
      setValue(`budgetBreakdown.${index}.total`, total);
    }
  }

  return (
    <div className="space-y-6">
      {/* Budget Total */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">
            Total Kebutuhan Dana <span className="form-required">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rp</span>
            <Input
              type="number"
              placeholder="0"
              className="pl-9"
              error={errors.budgetTotal?.message}
              {...register("budgetTotal", {
                onChange: (e) => setValue("fundingTarget", e.target.value),
              })}
            />
          </div>
          {watch("budgetTotal") > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              = {formatRupiah(watch("budgetTotal"))}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Target Dana yang Diminta <span className="form-required">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rp</span>
            <Input
              type="number"
              placeholder="0"
              className="pl-9"
              error={errors.fundingTarget?.message}
              {...register("fundingTarget")}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Bisa sama dengan total atau sebagian jika ada sumber dana lain.
          </p>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="form-label">
            Rincian Anggaran (RAB) <span className="form-required">*</span>
          </label>
          {totalFromBreakdown > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4 text-brand-600" />
              <span className="font-medium text-brand-600">
                Total: {formatRupiah(totalFromBreakdown, true)}
              </span>
            </div>
          )}
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-2 mb-2 text-xs font-medium text-muted-foreground px-2">
          <div className="col-span-2">Kategori</div>
          <div className="col-span-3">Deskripsi</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-1">Satuan</div>
          <div className="col-span-2 text-right">Harga/Satuan</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1" />
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-xl border p-3 md:p-2 space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-2 md:items-center">
              {/* Kategori */}
              <div className="md:col-span-2">
                <select
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register(`budgetBreakdown.${index}.kategori`)}
                >
                  <option value="">Kategori...</option>
                  {BUDGET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-3">
                <Input
                  placeholder="Deskripsi item"
                  className="h-9 text-xs"
                  {...register(`budgetBreakdown.${index}.deskripsi`)}
                />
              </div>

              {/* Volume */}
              <div className="md:col-span-2">
                <Input
                  type="number"
                  placeholder="1"
                  className="h-9 text-xs text-right"
                  {...register(`budgetBreakdown.${index}.volume`, {
                    onChange: () => updateTotal(index),
                  })}
                />
              </div>

              {/* Satuan */}
              <div className="md:col-span-1">
                <Input
                  placeholder="org/bln"
                  className="h-9 text-xs"
                  {...register(`budgetBreakdown.${index}.satuan`)}
                />
              </div>

              {/* Harga Satuan */}
              <div className="md:col-span-2">
                <Input
                  type="number"
                  placeholder="0"
                  className="h-9 text-xs text-right"
                  {...register(`budgetBreakdown.${index}.hargaSatuan`, {
                    onChange: () => updateTotal(index),
                  })}
                />
              </div>

              {/* Total */}
              <div className="md:col-span-1 text-right">
                <span className="text-xs font-medium">
                  {breakdown[index]?.total ? formatRupiah(breakdown[index].total, true) : "-"}
                </span>
              </div>

              {/* Delete */}
              <div className="md:col-span-1 flex justify-end">
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
            </div>
          ))}
        </div>

        {errors.budgetBreakdown && (
          <p className="mt-1 text-xs text-destructive">
            {Array.isArray(errors.budgetBreakdown) ? "Lengkapi semua kolom anggaran" : (errors.budgetBreakdown as any).message}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 gap-2"
          onClick={() =>
            append({
              kategori: "",
              deskripsi: "",
              volume: 1,
              satuan: "",
              hargaSatuan: 0,
              total: 0,
            })
          }
        >
          <Plus className="h-4 w-4" />
          Tambah Item Anggaran
        </Button>
      </div>

      {/* Summary */}
      {totalFromBreakdown > 0 && (
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total dari RAB:</span>
            <span className="font-semibold">{formatRupiah(totalFromBreakdown)}</span>
          </div>
          {watch("budgetTotal") > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total yang diinput:</span>
              <span className={`font-semibold ${Math.abs(totalFromBreakdown - watch("budgetTotal")) > 100000 ? "text-orange-600" : "text-green-600"}`}>
                {formatRupiah(watch("budgetTotal"))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
