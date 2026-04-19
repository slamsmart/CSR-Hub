"use client";

import React, { useEffect, useState } from "react";
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
import { useLanguage, useStructureCopy } from "@/components/providers/language-provider";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count: notifCount } = useNotificationCount();
  const { language, setLanguage } = useLanguage();
  const copy = useStructureCopy();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const navLinks = [
    {
      label: copy.navbar.platform,
      children: [
        { href: "/tentang", label: copy.navbar.about },
        { href: "/cara-kerja", label: copy.navbar.howItWorks },
        { href: "/faq", label: copy.navbar.faq },
        { href: "/blog", label: copy.navbar.blog },
        { href: "/kisah-sukses", label: copy.navbar.successStories },
      ],
    },
    {
      label: copy.navbar.forApplicants,
      children: [
        { href: "/register?role=PENGUSUL", label: copy.navbar.registerApplicant },
        { href: "/panduan/proposal", label: copy.navbar.proposalGuide },
        { href: "/panduan/verifikasi", label: copy.navbar.verification },
      ],
    },
    {
      label: copy.navbar.forCompanies,
      children: [
        { href: "/register?role=PERUSAHAAN", label: copy.navbar.registerCompany },
        { href: "/panduan/perusahaan", label: copy.navbar.companyGuide },
        { href: "/cara-kerja#escrow", label: copy.navbar.cofunding },
        { href: "/tentang#fee", label: copy.navbar.businessModel },
      ],
    },
  ];

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled || !isHomePage
          ? "border-b border-border bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span
              className={cn(
                "font-display text-xl font-bold tracking-tight",
                scrolled || !isHomePage ? "text-foreground" : "text-white"
              )}
            >
              CSR<span className="text-brand-400">Hub</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <div key={item.label} className="group relative">
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    scrolled || !isHomePage
                      ? "text-foreground/70 hover:bg-accent hover:text-foreground"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-white opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="py-1.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-brand-50 hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center rounded-full border border-border/70 bg-background/80 p-1 backdrop-blur-sm sm:inline-flex">
              <button
                type="button"
                aria-label={copy.language.switchLabel}
                onClick={() => setLanguage("id")}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  language === "id" ? "bg-brand-600 text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {copy.language.ind}
              </button>
              <button
                type="button"
                aria-label={copy.language.switchLabel}
                onClick={() => setLanguage("en")}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  language === "en" ? "bg-brand-600 text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {copy.language.eng}
              </button>
            </div>

            {session?.user ? (
              <>
                <Link href="/notifikasi" aria-label={copy.navbar.notifications}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("relative", !scrolled && isHomePage && "text-white hover:bg-white/10")}
                  >
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {notifCount > 9 ? "9+" : notifCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors",
                      !scrolled && isHomePage ? "hover:bg-white/10" : "hover:bg-accent"
                    )}
                  >
                    <UserAvatar name={session.user.name || "User"} image={session.user.image} size="sm" />
                    <div className="hidden text-left md:block">
                      <p className={cn("text-sm font-medium leading-none", !scrolled && isHomePage ? "text-white" : "text-foreground")}>
                        {session.user.name}
                      </p>
                      <p className={cn("mt-0.5 text-xs", !scrolled && isHomePage ? "text-white/70" : "text-muted-foreground")}>
                        {(session.user as any).organizationName || (session.user as any).role}
                      </p>
                    </div>
                    <ChevronDown className={cn("hidden h-4 w-4 md:block", !scrolled && isHomePage ? "text-white/70" : "text-muted-foreground")} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-card py-1.5 shadow-lg">
                      <div className="border-b px-3 py-2">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="h-4 w-4" />
                          {copy.navbar.dashboard}
                        </Link>
                        <Link href="/proposals" className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                          <FileText className="h-4 w-4" />
                          {copy.navbar.myProposals}
                        </Link>
                        <Link href="/pengaturan" className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                          <Settings className="h-4 w-4" />
                          {copy.navbar.settings}
                        </Link>
                      </div>
                      <div className="border-t py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          {copy.navbar.signOut}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className={cn(!scrolled && isHomePage && "text-white hover:bg-white/10")}>
                    {copy.navbar.signIn}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="brand">
                    {copy.navbar.registerFree}
                  </Button>
                </Link>
              </>
            )}

            <button
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
              aria-label={mobileOpen ? copy.navbar.closeMenu : copy.navbar.openMenu}
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

        {mobileOpen && (
          <div className="space-y-1 border-t bg-background py-4 md:hidden">
            {navLinks.map((item) => (
              <div key={item.label}>
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </div>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded-lg px-6 py-2 text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
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

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </header>
  );
}
