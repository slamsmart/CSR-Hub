"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStructureCopy } from "@/components/providers/language-provider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const copy = useStructureCopy();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-brand-50/30 to-teal-50/30">
      <div className="relative hidden overflow-hidden gradient-hero p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-xl font-bold text-white">C</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">
              CSR<span className="text-brand-300">Hub</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 text-white">
          <h2 className="mb-6 font-display text-4xl font-bold leading-tight">
            {copy.auth.heroTitle1}
            <span className="block bg-gradient-to-r from-brand-200 to-teal-200 bg-clip-text text-transparent">
              {copy.auth.heroTitle2}
            </span>
            {copy.auth.heroTitle3}
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-white/70">
            {copy.auth.heroDescription}
          </p>

          <div className="space-y-4">
            {copy.auth.features.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-400">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-white/50">{copy.auth.copyright}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <span className="text-base font-bold text-white">C</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              CSR<span className="text-brand-600">Hub</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.auth.back}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
