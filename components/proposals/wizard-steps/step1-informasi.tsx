"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProposalWizardData } from "../proposal-wizard";
import { CATEGORY_LABELS, SDG_LABELS } from "@/types";
import { ProposalCategory, SDGCategory } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const SDG_ITEMS = Object.entries(SDG_LABELS).map(([value, label]) => ({
  value: value as SDGCategory,
  label,
  short: label.replace(/^SDG \d+: /, ""),
}));

export function ProposalStep1() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProposalWizardData>();
  const selectedCategory = watch("category");
  const selectedSDGs = watch("sdgTags") || [];
  const keywords = watch("keywords") || [];
  const [keywordInput, setKeywordInput] = React.useState("");

  function toggleSDG(sdg: string) {
    if (selectedSDGs.includes(sdg)) {
      setValue("sdgTags", selectedSDGs.filter((s) => s !== sdg));
    } else if (selectedSDGs.length < 5) {
      setValue("sdgTags", [...selectedSDGs, sdg]);
    }
  }

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      setValue("keywords", [...keywords, kw]);
      setKeywordInput("");
    }
  }

  function removeKeyword(kw: string) {
    setValue("keywords", keywords.filter((k) => k !== kw));
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="form-group">
        <label className="form-label">
          Judul Proposal <span className="form-required">*</span>
        </label>
        <Input
          placeholder="Contoh: Program Beasiswa 100 Siswa Kurang Mampu di Pesisir Jawa Timur"
          error={errors.title?.message}
          {...register("title")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Buat judul yang informatif dan mencerminkan isi program. Minimal 10 karakter.
        </p>
      </div>

      {/* Summary */}
      <div className="form-group">
        <label className="form-label">
          Ringkasan Eksekutif <span className="form-required">*</span>
        </label>
        <Textarea
          placeholder="Tulis ringkasan singkat program Anda (50-500 karakter)..."
          className="min-h-[80px]"
          error={errors.summary?.message}
          {...register("summary")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Ringkasan ini akan ditampilkan di halaman daftar proposal. {watch("summary")?.length || 0}/500 karakter.
        </p>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">
          Deskripsi Program <span className="form-required">*</span>
        </label>
        <Textarea
          placeholder="Jelaskan secara detail: latar belakang masalah, tujuan program, metode pelaksanaan, target capaian, dan rencana keberlanjutan..."
          className="min-h-[200px]"
          error={errors.description?.message}
          {...register("description")}
        />
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">
          Kategori Program <span className="form-required">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("category", value)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm font-medium text-left transition-all",
                selectedCategory === value
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-border hover:border-brand-200 hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* SDG Tags */}
      <div className="form-group">
        <label className="form-label">
          Target SDGs <span className="form-required">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Pilih 1-5 SDGs yang paling relevan dengan program Anda.
        </p>
        <div className="flex flex-wrap gap-2">
          {SDG_ITEMS.map((sdg) => {
            const isSelected = selectedSDGs.includes(sdg.value);
            return (
              <button
                key={sdg.value}
                type="button"
                onClick={() => toggleSDG(sdg.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                  isSelected
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-border hover:border-teal-200 hover:bg-muted",
                  !isSelected && selectedSDGs.length >= 5 && "opacity-50 cursor-not-allowed"
                )}
                disabled={!isSelected && selectedSDGs.length >= 5}
              >
                {sdg.label.split(":")[0]}
              </button>
            );
          })}
        </div>
        {selectedSDGs.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selectedSDGs.map((sdg) => (
              <Badge key={sdg} variant="teal" className="text-xs gap-1">
                {SDG_LABELS[sdg as SDGCategory]?.split(": ")[1] || sdg}
                <button type="button" onClick={() => toggleSDG(sdg)} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            ))}
          </div>
        )}
        {errors.sdgTags && (
          <p className="mt-1 text-xs text-destructive">{errors.sdgTags.message}</p>
        )}
      </div>

      {/* Keywords */}
      <div className="form-group">
        <label className="form-label">
          Kata Kunci
          <span className="text-xs text-muted-foreground ml-2 font-normal">(Opsional, maks. 10)</span>
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Tambah kata kunci..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-sm"
          >
            +
          </button>
        </div>
        {keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="text-xs gap-1">
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* AI Tip */}
      <div className="rounded-xl bg-brand-50 border border-brand-100 p-4 flex gap-3">
        <Sparkles className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-brand-700">Tips untuk Skor Tinggi</p>
          <p className="text-xs text-brand-600 mt-1 leading-relaxed">
            Proposal dengan deskripsi lengkap (&gt;500 karakter), 2-3 SDGs yang relevan, dan judul spesifik
            mendapat skor kelengkapan lebih tinggi dan lebih mudah ditemukan oleh perusahaan melalui AI Matching.
          </p>
        </div>
      </div>
    </div>
  );
}
