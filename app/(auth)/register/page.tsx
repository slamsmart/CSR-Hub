"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2, Users,
  CheckCircle2, AlertCircle, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada huruf kapital")
      .regex(/[a-z]/, "Harus ada huruf kecil")
      .regex(/[0-9]/, "Harus ada angka")
      .regex(/[!@#$%^&*]/, "Harus ada karakter spesial"),
    confirmPassword: z.string(),
    role: z.enum(["PERUSAHAAN", "PENGUSUL"]),
    organizationName: z.string().optional(),
    organizationType: z.string().optional(),
    agreeTerms: z.boolean().refine((v) => v === true, {
      message: "Anda harus menyetujui syarat dan ketentuan",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const ROLE_OPTIONS = [
  {
    value: "PERUSAHAAN",
    label: "Perusahaan / Industri",
    description: "Saya ingin mendanai program CSR",
    icon: Building2,
    color: "text-brand-600",
    bg: "bg-brand-50 border-brand-200",
    activeBg: "bg-brand-600",
  },
  {
    value: "PENGUSUL",
    label: "NGO / Komunitas / Yayasan",
    description: "Saya ingin mengajukan program CSR",
    icon: Users,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-200",
    activeBg: "bg-teal-600",
  },
];

const ORG_TYPES_FOR_PENGUSUL = [
  "NGO / LSM", "Komunitas", "Sekolah / Lembaga Pendidikan",
  "Koperasi", "Yayasan", "Startup Sosial", "Lainnya",
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") === "PERUSAHAAN" ? "PERUSAHAAN" : "PENGUSUL") as "PERUSAHAAN" | "PENGUSUL";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole, agreeTerms: false },
  });

  const selectedRole = watch("role");
  const password = watch("password");

  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    return score;
  }, [password]);

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Gagal mendaftar");
        return;
      }

      toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
      router.push("/login?registered=true");
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Daftar ke CSR Hub
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-brand-600 hover:underline font-medium">
            Masuk di sini
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Selection */}
        <div>
          <label className="form-label mb-3 block">
            Daftar sebagai <span className="form-required">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("role", option.value as any)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-accent"
                  )}
                >
                  <div className={cn("p-2 rounded-lg", isSelected ? option.activeBg : option.bg)}>
                    <Icon className={cn("h-4 w-4", isSelected ? "text-white" : option.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="form-group">
          <label className="form-label">
            Nama Lengkap <span className="form-required">*</span>
          </label>
          <Input
            placeholder="Masukkan nama lengkap"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        {/* Organization Name */}
        <div className="form-group">
          <label className="form-label">
            Nama {selectedRole === "PERUSAHAAN" ? "Perusahaan" : "Organisasi"}
          </label>
          <Input
            placeholder={`Nama ${selectedRole === "PERUSAHAAN" ? "perusahaan" : "organisasi"} Anda`}
            leftIcon={<Building2 className="h-4 w-4" />}
            error={errors.organizationName?.message}
            {...register("organizationName")}
          />
        </div>

        {/* Org Type for Pengusul */}
        {selectedRole === "PENGUSUL" && (
          <div className="form-group">
            <label className="form-label">Jenis Organisasi</label>
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                {...register("organizationType")}
              >
                <option value="">Pilih jenis organisasi</option>
                {ORG_TYPES_FOR_PENGUSUL.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            Email <span className="form-required">*</span>
          </label>
          <Input
            type="email"
            placeholder="nama@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">Nomor Telepon</label>
          <Input
            placeholder="08xxxxxxxxxx"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">
            Password <span className="form-required">*</span>
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Buat password kuat"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />
          {/* Password Strength */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < passwordStrength
                        ? passwordStrength <= 2 ? "bg-red-500" : passwordStrength <= 3 ? "bg-yellow-500" : "bg-green-500"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Kekuatan: {["", "Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][passwordStrength]}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label">
            Konfirmasi Password <span className="form-required">*</span>
          </label>
          <Input
            type="password"
            placeholder="Ulangi password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreeTerms"
              className="h-4 w-4 rounded border-input mt-0.5 text-primary flex-shrink-0"
              {...register("agreeTerms")}
            />
            <label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-relaxed">
              Saya menyetujui{" "}
              <Link href="/syarat-ketentuan" className="text-brand-600 hover:underline" target="_blank">
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="/kebijakan-privasi" className="text-brand-600 hover:underline" target="_blank">
                Kebijakan Privasi
              </Link>{" "}
              CSR Hub
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          Buat Akun Gratis
        </Button>
      </form>

    </div>
  );
}
