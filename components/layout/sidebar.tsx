"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import {
  LayoutDashboard, FileText, Building2, Users, ShieldCheck, BarChart3,
  Bell, Settings, ChevronRight, LogOut, FolderKanban, ClipboardCheck,
  PiggyBank, Search, AlertTriangle, BookOpen, TrendingUp, FileBarChart,
  ChevronLeft, Menu, HandCoins, Globe, Star, UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  children?: NavItem[];
}

function getNavItems(role: UserRole): NavItem[] {
  const common: NavItem[] = [
    { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
    { href: "/notifikasi", label: "Notifikasi", icon: Bell },
    { href: "/pengaturan", label: "Pengaturan", icon: Settings },
  ];

  const roleItems: Record<UserRole, NavItem[]> = {
    SUPER_ADMIN: [
      { href: "/admin", label: "Admin Panel", icon: UserCog },
      { href: "/admin/pengguna", label: "Manajemen Pengguna", icon: Users },
      { href: "/admin/organisasi", label: "Manajemen Organisasi", icon: Building2 },
      { href: "/admin/verifikasi", label: "Verifikasi", icon: ShieldCheck },
      { href: "/admin/proposals", label: "Semua Proposal", icon: FileText },
      { href: "/admin/proyek", label: "Semua Proyek", icon: FolderKanban },
      { href: "/admin/audit", label: "Audit Log", icon: ClipboardCheck },
      { href: "/admin/risk-alerts", label: "Risk Alerts", icon: AlertTriangle },
      { href: "/admin/settings", label: "Pengaturan Platform", icon: Settings },
      { href: "/admin/analytics", label: "Analytics Global", icon: BarChart3 },
    ],
    ADMIN_PLATFORM: [
      { href: "/admin", label: "Admin Panel", icon: UserCog },
      { href: "/admin/pengguna", label: "Pengguna", icon: Users },
      { href: "/admin/organisasi", label: "Organisasi", icon: Building2 },
      { href: "/admin/verifikasi", label: "Verifikasi", icon: ShieldCheck },
      { href: "/admin/proposals", label: "Proposal", icon: FileText },
      { href: "/admin/proyek", label: "Proyek", icon: FolderKanban },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
    VERIFIKATOR: [
      { href: "/verifikator", label: "Antrian Verifikasi", icon: ClipboardCheck },
      { href: "/verifikator/organisasi", label: "Verifikasi Organisasi", icon: ShieldCheck },
      { href: "/verifikator/dokumen", label: "Review Dokumen", icon: BookOpen },
    ],
    AUDITOR: [
      { href: "/auditor", label: "Dashboard Audit", icon: ClipboardCheck },
      { href: "/auditor/proyek", label: "Proyek Aktif", icon: FolderKanban },
      { href: "/auditor/laporan", label: "Laporan Audit", icon: FileBarChart },
      { href: "/auditor/temuan", label: "Temuan & Rekomendasi", icon: AlertTriangle },
    ],
    PERUSAHAAN: [
      { href: "/perusahaan/proposal-masuk", label: "Proposal Masuk", icon: FileText },
      { href: "/perusahaan/shortlist", label: "Shortlist", icon: Star },
      { href: "/perusahaan/matching", label: "AI Matching", icon: Search },
      { href: "/perusahaan/proyek", label: "Proyek Saya", icon: FolderKanban },
      { href: "/perusahaan/cofunding", label: "Co-Funding", icon: HandCoins },
      { href: "/perusahaan/pendanaan", label: "Riwayat Pendanaan", icon: PiggyBank },
      { href: "/perusahaan/sustainability", label: "Sustainability Report", icon: FileBarChart },
      { href: "/perusahaan/profil", label: "Profil CSR", icon: Building2 },
    ],
    PENGUSUL: [
      { href: "/pengusul/proposal", label: "Proposal Saya", icon: FileText },
      { href: "/pengusul/proposal/buat", label: "+ Buat Proposal", icon: FileText },
      { href: "/pengusul/proyek", label: "Proyek Berjalan", icon: FolderKanban },
      { href: "/pengusul/pelaporan", label: "Pelaporan", icon: FileBarChart },
      { href: "/pengusul/dana", label: "Riwayat Dana", icon: PiggyBank },
      { href: "/pengusul/organisasi", label: "Profil Organisasi", icon: Building2 },
      { href: "/pengusul/verifikasi", label: "Verifikasi Org", icon: ShieldCheck },
    ],
    DONOR_KOLABORATOR: [
      { href: "/donor/proposal", label: "Jelajahi Proposal", icon: Globe },
      { href: "/donor/cofunding", label: "Co-Funding Saya", icon: HandCoins },
      { href: "/donor/proyek", label: "Proyek Terdanai", icon: FolderKanban },
      { href: "/donor/dampak", label: "Dampak Saya", icon: TrendingUp },
    ],
    PUBLIC: [],
  };

  return [...(roleItems[role] || []), ...common];
}

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = getNavItems(role);

  return (
    <aside
      className={cn(
        "flex flex-col bg-white dark:bg-gray-950 border-r border-border transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand flex-shrink-0">
              <span className="text-white font-bold text-base">C</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              CSR<span className="text-brand-600">Hub</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand mx-auto">
            <span className="text-white font-bold text-base">C</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          className={cn(
            "p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "sidebar-link",
                isActive ? "sidebar-link-active" : "sidebar-link-inactive",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs rounded-full bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "sidebar-link sidebar-link-inactive w-full text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
