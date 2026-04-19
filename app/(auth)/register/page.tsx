"use client";

import React, { Suspense, useState } from "react";
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
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(/[!@#$%^&*]/, "Password must include at least one special character"),
    confirmPassword: z.string(),
    role: z.enum(["PERUSAHAAN", "PENGUSUL"]),
    organizationName: z.string().optional(),
    organizationType: z.string().optional(),
    agreeTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const ROLE_OPTIONS = [
  {
    value: "PERUSAHAAN",
    label: "Company / Corporate",
    description: "I want to fund CSR programs",
    icon: Building2,
    color: "text-brand-600",
    bg: "bg-brand-50 border-brand-200",
    activeBg: "bg-brand-600",
  },
  {
    value: "PENGUSUL",
    label: "NGO / Community / Foundation",
    description: "I want to submit CSR program proposals",
    icon: Users,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-200",
    activeBg: "bg-teal-600",
  },
];

const ORG_TYPES_FOR_PENGUSUL = [
  "NGO / Nonprofit", "Community Group", "School / Educational Institution",
  "Cooperative", "Foundation", "Social Startup", "Other",
];

function RegisterPageContent() {
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
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("Your account has been created. Please check your email for the verification code.");
      router.push(`/verify-email?email=${encodeURIComponent(data.email.toLowerCase())}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Create your CSR Hub account
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Selection */}
        <div>
          <label className="form-label mb-3 block">
            Register as <span className="form-required">*</span>
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
            Full Name <span className="form-required">*</span>
          </label>
          <Input
            placeholder="Enter your full name"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        {/* Organization Name */}
        <div className="form-group">
          <label className="form-label">
            {selectedRole === "PERUSAHAAN" ? "Company Name" : "Organization Name"}
          </label>
          <Input
            placeholder={`Enter your ${selectedRole === "PERUSAHAAN" ? "company" : "organization"} name`}
            leftIcon={<Building2 className="h-4 w-4" />}
            error={errors.organizationName?.message}
            {...register("organizationName")}
          />
        </div>

        {/* Org Type for Pengusul */}
        {selectedRole === "PENGUSUL" && (
          <div className="form-group">
            <label className="form-label">Organization Type</label>
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                {...register("organizationType")}
              >
                  <option value="">Select organization type</option>
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
            <label className="form-label">Phone Number</label>
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
            placeholder="Create a strong password"
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
                 Strength: {["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"][passwordStrength]}
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
            placeholder="Re-enter your password"
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
              I agree to the{" "}
              <Link href="/syarat-ketentuan" className="text-brand-600 hover:underline" target="_blank">
                Terms & Conditions
              </Link>{" "}
              and the{" "}
              <Link href="/kebijakan-privasi" className="text-brand-600 hover:underline" target="_blank">
                Privacy Policy
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
          Create Free Account
        </Button>
      </form>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><div><h1 className="font-display text-2xl font-bold text-foreground">Create your CSR Hub account</h1></div></div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
