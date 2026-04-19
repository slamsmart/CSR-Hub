"use client";

import dynamic from "next/dynamic";

const VerifyOtpForm = dynamic(
  () => import("@/components/auth/verify-otp-form").then((mod) => mod.VerifyOtpForm),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Loading verification form...
      </div>
    ),
  }
);

type VerifyOtpFormLoaderProps = {
  email?: string;
};

export function VerifyOtpFormLoader({ email }: VerifyOtpFormLoaderProps) {
  return <VerifyOtpForm email={email} />;
}
