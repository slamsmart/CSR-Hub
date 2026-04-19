import React from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, MailCheck } from "lucide-react";

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    status?: string;
    email?: string;
  }>;
};

const CONTENT = {
  success: {
    title: "Email verified",
    description: "Your email has been verified successfully. You can now continue signing in to CSR Hub.",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  invalid: {
    title: "Verification did not match",
    description: "The verification token or code was not recognized. Request a new code and try again.",
    icon: AlertCircle,
    iconClass: "text-amber-600",
  },
  error: {
    title: "Verification failed",
    description: "We could not verify your email right now. Please try again in a moment.",
    icon: AlertCircle,
    iconClass: "text-rose-600",
  },
  default: {
    title: "Enter your verification code",
    description: "We have sent a 6-digit verification code to your email address. Enter it below to activate your account.",
    icon: MailCheck,
    iconClass: "text-brand-600",
  },
} as const;

function VerifyOtpForm({ email }: { email?: string }) {
  "use client";

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

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
  const statusKey =
    params.status === "success" || params.status === "invalid" || params.status === "error"
      ? params.status
      : "default";

  const content = CONTENT[statusKey];
  const Icon = content.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_35%),linear-gradient(180deg,#f9fbf7_0%,#f3f5ef_100%)] px-6 py-16">
      <div className="w-full max-w-xl rounded-[28px] border border-white/80 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mb-6 inline-flex rounded-2xl bg-slate-100 p-3">
          <Icon className={`h-8 w-8 ${content.iconClass}`} />
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900">{content.title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{content.description}</p>

        {statusKey === "default" ? (
          <VerifyOtpForm email={params.email} />
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Go to sign in
            </Link>
            <Link
              href={params.email ? `/verify-email?email=${encodeURIComponent(params.email)}` : "/register"}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {params.email ? "Enter another code" : "Back to register"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
