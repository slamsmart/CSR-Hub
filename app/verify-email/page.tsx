import Link from "next/link";
import { CheckCircle2, AlertCircle, MailCheck } from "lucide-react";

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    status?: string;
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
    title: "Verification link is invalid",
    description: "This verification link is missing, expired, or has already been used. Request a new verification email if needed.",
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
    title: "Check your inbox",
    description: "We have prepared email verification for your account. Open the verification link from your inbox to confirm your email address.",
    icon: MailCheck,
    iconClass: "text-brand-600",
  },
} as const;

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

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Go to sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to register
          </Link>
        </div>
      </div>
    </main>
  );
}
