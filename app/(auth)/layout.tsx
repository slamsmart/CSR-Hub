import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-50/30 to-teal-50/30 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">
              CSR<span className="text-brand-300">Hub</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 text-white">
          <h2 className="font-display text-4xl font-bold leading-tight mb-6">
            Platform CSR
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-teal-200">
              Terpercaya #1
            </span>
            di Indonesia
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Bergabung dan wujudkan dampak sosial nyata bersama ratusan mitra perusahaan
            dan ribuan organisasi sosial terbaik di Indonesia.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              "Verifikasi organisasi terstandar & terpercaya",
              "AI Smart Matching proposal-perusahaan",
              "Monitoring & pelaporan transparan real-time",
              "Co-funding multi-perusahaan",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-brand-400 flex items-center justify-center flex-shrink-0">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-sm">
            © 2025 CSR Hub. Platform Marketplace CSR Nasional.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Logo */}
        <div className="lg:hidden p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <span className="text-white font-bold text-base">C</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              CSR<span className="text-brand-600">Hub</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
