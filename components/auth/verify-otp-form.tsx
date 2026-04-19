"use client";

import React from "react";
import Link from "next/link";

type VerifyOtpFormProps = {
  email?: string;
};

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const [code, setCode] = React.useState("");
  const [inputEmail, setInputEmail] = React.useState(email || "");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputEmail,
          code,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Verification failed.");
        return;
      }

      setStatus("success");
      setMessage("Your email has been verified successfully. You can now sign in.");
      setCode("");
    } catch {
      setStatus("error");
      setMessage("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!inputEmail) return;

    setIsResending(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Failed to resend code.");
        return;
      }

      setStatus("success");
      setMessage("A new verification code has been sent to your email.");
    } catch {
      setStatus("error");
      setMessage("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
        <input
          value={inputEmail}
          onChange={(event) => setInputEmail(event.target.value)}
          type="email"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          placeholder="name@organization.com"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">6-digit verification code</label>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-2xl tracking-[0.35em] text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          placeholder="123456"
          required
        />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Verifying..." : "Verify code"}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !inputEmail}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isResending ? "Sending..." : "Resend code"}
        </button>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
