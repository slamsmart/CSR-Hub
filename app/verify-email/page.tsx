import Link from "next/link";
import { CheckCircle2, AlertCircle, MailCheck } from "lucide-react";

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
  resent: {
    title: "A new code has been sent",
    description: "Check your inbox for the latest 6-digit verification code, then enter it below.",
    icon: MailCheck,
    iconClass: "text-emerald-600",
  },
  default: {
    title: "Enter your verification code",
    description: "We have sent a 6-digit verification code to your email address. Enter it below to activate your account.",
    icon: MailCheck,
    iconClass: "text-brand-600",
  },
} as const;

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    status?: string;
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
  const rawStatus = params.status;
  const email = params.email || undefined;
  const statusKey =
    rawStatus === "success" ||
    rawStatus === "invalid" ||
    rawStatus === "error" ||
    rawStatus === "resent"
      ? rawStatus
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

        {statusKey === "default" || statusKey === "resent" ? (
          <div className="mt-8 space-y-4">
            <form action="/api/auth/verify-otp-web" method="POST" className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  name="email"
                  defaultValue={email}
                  type="email"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  placeholder="name@organization.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">6-digit verification code</label>
                <input
                  name="code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-2xl tracking-[0.35em] text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  placeholder="123456"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Verify code
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to sign in
                </Link>
              </div>
            </form>

            <form action="/api/auth/resend-verification-web" method="POST" className="flex flex-wrap gap-3">
              <input type="hidden" name="email" value={email || ""} />
              <button
                type="submit"
                disabled={!email}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Resend code
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Go to sign in
            </Link>
            <Link
              href={email ? `/verify-email?email=${encodeURIComponent(email)}` : "/register"}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {email ? "Enter another code" : "Back to register"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
