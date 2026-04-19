"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const authError = searchParams.get("error");
  const registered = searchParams.get("registered") === "true";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    authError === "OAuthAccountNotLinked"
      ? "This email is already registered. You can now continue with Google using the same email address."
      : authError === "AccessDenied"
        ? "Access denied. Please verify your account email first or contact support if this should not happen."
        : authError
          ? "Sign-in failed. Please try again."
          : null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          try {
            const statusRes = await fetch(`/api/auth/verification-status?email=${encodeURIComponent(data.email.toLowerCase())}`);
            const statusPayload = await statusRes.json();

            if (statusRes.ok && statusPayload.exists && !statusPayload.emailVerified) {
              setPendingVerificationEmail(data.email.toLowerCase());
              setError("Your email address has not been verified yet. Enter the OTP code from your inbox, or resend a new code.");
            } else {
              setError("Incorrect email or password. Please review your credentials and try again.");
            }
          } catch {
            setError("Incorrect email or password. Please review your credentials and try again.");
          }
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      if (result?.ok) {
        toast.success("Signed in successfully");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("A server error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendVerificationEmail() {
    if (!pendingVerificationEmail) return;

    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingVerificationEmail }),
      });

      const payload = await res.json();

      if (!res.ok) {
        toast.error(payload.error || "Failed to resend verification email.");
        return;
      }

      if (payload.alreadyVerified) {
        toast.success("This account is already verified. Please try signing in again.");
        return;
      }

      toast.success("A new verification code has been sent.");
      router.push(`/verify-email?email=${encodeURIComponent(pendingVerificationEmail)}`);
    } catch {
      toast.error("Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Sign in to CSR Hub
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-brand-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>

      {registered && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>Your account has been created. Please enter the verification code sent to your email before signing in.</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-3">
            <p>{error}</p>
            {pendingVerificationEmail && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-red-200 bg-white text-red-700 hover:bg-red-50"
                loading={isResending}
                onClick={resendVerificationEmail}
              >
                Resend verification code
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="form-label">
            Email <span className="form-required">*</span>
          </label>
          <Input
            type="email"
            placeholder="name@organization.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
        </div>

        <div className="form-group">
          <div className="flex items-center justify-between mb-1.5">
            <label className="form-label">
              Password <span className="form-required">*</span>
            </label>
            <Link
              href="/lupa-password"
              className="text-xs text-brand-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password")}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 rounded border-input text-primary"
            {...register("rememberMe")}
          />
          <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Keep me signed in for 30 days
          </label>
        </div>

        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full gap-3"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
        <span>Secure connection protected with SSL/TLS encryption</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><div><h1 className="font-display text-2xl font-bold text-foreground">Sign in to CSR Hub</h1></div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
