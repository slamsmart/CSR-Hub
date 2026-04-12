"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Bell, LogOut, Settings, LayoutDashboard, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNotificationCount } from "@/hooks/use-notifications";

const NAV_LINKS = [
  {
    label: "Platform",
    children: [
      { href: "/tentang", label: "Tentang Kami" },
      { href: "/cara-kerja", label: "Cara Kerja" },
      { href: "/faq", label: "FAQ" },
      { href: "/blog", label: "Blog" },
      { href: "/kisah-sukses", label: "Kisah Sukses" },
    ],
  },
  {
    label: "Untuk Pengusul",
    children: [
      { href: "/register?role=PENGUSUL", label: "Daftar sebagai Pengusul" },
      { href: "/panduan/proposal", label: "Panduan Proposal" },
      { href: "/panduan/verifikasi", label: "Verifikasi Organisasi" },
    ],
  },
  {
    label: "Untuk Perusahaan",
    children: [
      { href: "/register?role=PERUSAHAAN", label: "Daftar sebagai Perusahaan" },
      { href: "/panduan/perusahaan", label: "Panduan Perusahaan" },
      { href: "/cara-kerja#escrow", label: "Co-funding & Escrow" },
      { href: "/tentang#fee", label: "Model Bisnis" },
    ],
  },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count: notifCount } = useNotificationCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHomePage
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span
              className={cn(
                "font-display font-bold text-xl tracking-tight",
                scrolled || !isHomePage ? "text-foreground" : "text-white"
              )}
            >
              CSR<span className="text-brand-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    scrolled || !isHomePage
                      ? "text-foreground/70 hover:text-foreground hover:bg-accent"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="py-1.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-brand-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                {/* Notifications */}
                <Link href="/notifikasi">
                  <Button variant="ghost" size="icon" className={cn(
                    "relative",
                    !scrolled && isHomePage && "text-white hover:bg-white/10"
                  )}>
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                        {notifCount > 9 ? "9+" : notifCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors",
                      !scrolled && isHomePage ? "hover:bg-white/10" : "hover:bg-accent"
                    )}
                  >
                    <UserAvatar
                      name={session.user.name || "User"}
                      image={session.user.image}
                      size="sm"
                    />
                    <div className="hidden md:block text-left">
                      <p className={cn(
                        "text-sm font-medium leading-none",
                        !scrolled && isHomePage ? "text-white" : "text-foreground"
                      )}>{session.user.name}</p>
                      <p className={cn(
                        "text-xs mt-0.5",
                        !scrolled && isHomePage ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {(session.user as any).organizationName || (session.user as any).role}
                      </p>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 hidden md:block",
                      !scrolled && isHomePage ? "text-white/70" : "text-muted-foreground"
                    )} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-56 rounded-xl border bg-card shadow-lg py-1.5 z-50">
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium text-sm">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/proposals"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FileText className="h-4 w-4" />
                          Proposal Saya
                        </Link>
                        <Link
                          href="/pengaturan"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Pengaturan
                        </Link>
                      </div>
                      <div className="border-t py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      !scrolled && isHomePage && "text-white hover:bg-white/10"
                    )}
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="brand">
                    Daftar Gratis
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className={cn("h-6 w-6", !scrolled && isHomePage ? "text-white" : "text-foreground")} />
              ) : (
                <Menu className={cn("h-6 w-6", !scrolled && isHomePage ? "text-white" : "text-foreground")} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background py-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <div key={item.label}>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-6 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
}
