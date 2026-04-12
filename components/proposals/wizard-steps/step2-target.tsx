"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProposalWizardData } from "../proposal-wizard";
import { cn } from "@/lib/utils";

const PROVINSI_LIST = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Bengkulu", "Sumatera Selatan", "Kepulauan Bangka Belitung",
  "Lampung", "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah",
  "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat",
  "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat",
  "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara",
  "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan",
];

const JENIS_MANFAAT_OPTIONS = [
  "Anak-anak (0-12 tahun)",
  "Remaja (13-18 tahun)",
  "Pemuda (19-30 tahun)",
  "Dewasa Umum",
  "Lansia (>60 tahun)",
  "Ibu Hamil & Menyusui",
  "Perempuan",
  "Penyandang Disabilitas",
  "Petani / Nelayan",
  "Pelaku UMKM",
  "Siswa / Mahasiswa",
  "Guru / Tenaga Pendidik",
  "Masyarakat Adat",
  "Keluarga Miskin",
  "Korban Bencana",
];

export function ProposalStep2() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProposalWizardData>();
  const isNasional = watch("isNasional");
  const selectedProvinsi = watch("provinsi");
  const jenisManfaat = watch("jenisManfaat") || [];

  function toggleJenis(jenis: string) {
    if (jenisManfaat.includes(jenis)) {
      setValue("jenisManfaat", jenisManfaat.filter((j) => j !== jenis));
    } else {
      setValue("jenisManfaat", [...jenisManfaat, jenis]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Target Wilayah */}
      <div>
        <label className="form-label mb-3 block">
          Target Wilayah <span className="form-required">*</span>
        </label>

        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg border bg-muted/30">
          <input
            type="checkbox"
            id="isNasional"
            className="h-4 w-4 rounded"
            {...register("isNasional")}
          />
          <label htmlFor="isNasional" className="text-sm font-medium">
            Program berskala nasional (semua provinsi)
          </label>
        </div>

        {!isNasional && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Provinsi <span className="form-required">*</span></label>
              <div className="relative">
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  {...register("provinsi")}
                >
                  <option value="">Pilih provinsi...</option>
                  {PROVINSI_LIST.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              {errors.provinsi && (
                <p className="mt-1 text-xs text-destructive">{errors.provinsi.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Kabupaten / Kota</label>
              <Input
                placeholder="Nama kabupaten/kota (opsional)"
                {...register("kabupatenKota")}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kecamatan</label>
              <Input
                placeholder="Nama kecamatan (opsional)"
                {...register("kecamatan")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Target Beneficiaries */}
      <div className="form-group">
        <label className="form-label">
          Target Jumlah Penerima Manfaat <span className="form-required">*</span>
        </label>
        <Input
          type="number"
          placeholder="Contoh: 500"
          min={1}
          error={errors.targetBeneficiaries?.message}
          {...register("targetBeneficiaries")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Masukkan perkiraan jumlah orang yang akan mendapat manfaat langsung dari program ini.
        </p>
      </div>

      {/* Jenis Manfaat */}
      <div className="form-group">
        <label className="form-label">
          Jenis / Kelompok Penerima <span className="form-required">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">Pilih semua yang sesuai.</p>
        <div className="flex flex-wrap gap-2">
          {JENIS_MANFAAT_OPTIONS.map((jenis) => {
            const isSelected = jenisManfaat.includes(jenis);
            return (
              <button
                key={jenis}
                type="button"
                onClick={() => toggleJenis(jenis)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-sm transition-all",
                  isSelected
                    ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                    : "border-border hover:border-brand-200"
                )}
              >
                {jenis}
              </button>
            );
          })}
        </div>
        {errors.jenisManfaat && (
          <p className="mt-1 text-xs text-destructive">{errors.jenisManfaat.message}</p>
        )}
      </div>

      {/* Deskripsi Penerima */}
      <div className="form-group">
        <label className="form-label">
          Deskripsi Detail Penerima Manfaat
          <span className="text-xs text-muted-foreground ml-2 font-normal">(Opsional tapi disarankan)</span>
        </label>
        <Textarea
          placeholder="Jelaskan lebih detail tentang kondisi penerima manfaat, mengapa mereka membutuhkan program ini, dan bagaimana program ini akan berdampak..."
          className="min-h-[100px]"
          {...register("deskripsiPenerima")}
        />
      </div>
    </div>
  );
}
