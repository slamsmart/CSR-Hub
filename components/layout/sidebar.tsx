"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import {
  LayoutDashboard, FileText, Building2, Users, ShieldCheck, BarChart3,
  Bell, Settings, ChevronRight, LogOut, FolderKanban, ClipboardCheck,
  PiggyBank, Search, AlertTriangle, BookOpen, TrendingUp, FileBarChart,
  ChevronLeft, HandCoins, Globe, Star, UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useStructureCopy } from "@/components/providers/language-provider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

function getNavItems(role: UserRole, copy: ReturnType<typeof useStructureCopy>): NavItem[] {
  const common: NavItem[] = [
    { href: "/dashboard", label: copy.dashboard.nav.home, icon: LayoutDashboard },
    { href: "/notifikasi", label: copy.dashboard.nav.notifications, icon: Bell },
    { href: "/pengaturan", label: copy.dashboard.nav.settings, icon: Settings },
  ];

  const roleItems: Record<UserRole, NavItem[]> = {
    SUPER_ADMIN: [
      { href: "/admin", label: "Admin Panel", icon: UserCog },
      { href: "/admin/pengguna", label: copy.dashboard.nav.userManagement, icon: Users },
      { href: "/admin/organisasi", label: copy.dashboard.nav.organizationManagement, icon: Building2 },
      { href: "/admin/verifikasi", label: copy.dashboard.nav.verification, icon: ShieldCheck },
      { href: "/admin/proposals", label: copy.dashboard.nav.allProposals, icon: FileText },
      { href: "/admin/proyek", label: copy.dashboard.nav.allProjects, icon: FolderKanban },
      { href: "/admin/audit", label: copy.dashboard.nav.auditLog, icon: ClipboardCheck },
      { href: "/admin/risk-alerts", label: "Risk Alerts", icon: AlertTriangle },
      { href: "/admin/settings", label: copy.dashboard.nav.platformSettings, icon: Settings },
      { href: "/admin/analytics", label: "Analytics Global", icon: BarChart3 },
    ],
    ADMIN_PLATFORM: [
      { href: "/admin", label: "Admin Panel", icon: UserCog },
      { href: "/admin/pengguna", label: "Pengguna", icon: Users },
      { href: "/admin/organisasi", label: "Organisasi", icon: Building2 },
      { href: "/admin/verifikasi", label: copy.dashboard.nav.verification, icon: ShieldCheck },
      { href: "/admin/proposals", label: "Proposal", icon: FileText },
      { href: "/admin/proyek", label: "Proyek", icon: FolderKanban },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
    VERIFIKATOR: [
      { href: "/verifikator", label: copy.dashboard.nav.verificationQueue, icon: ClipboardCheck },
      { href: "/verifikator/organisasi", label: copy.dashboard.nav.organizationVerification, icon: ShieldCheck },
      { href: "/verifikator/dokumen", label: copy.dashboard.nav.documentReview, icon: BookOpen },
    ],
    AUDITOR: [
      { href: "/auditor", label: copy.dashboard.nav.auditDashboard, icon: ClipboardCheck },
      { href: "/auditor/proyek", label: copy.dashboard.nav.activeProjects, icon: FolderKanban },
      { href: "/auditor/laporan", label: copy.dashboard.nav.auditReports, icon: FileBarChart },
      { href: "/auditor/temuan", label: copy.dashboard.nav.findings, icon: AlertTriangle },
    ],
    PERUSAHAAN: [
      { href: "/perusahaan/proposal-masuk", label: copy.dashboard.nav.incomingProposals, icon: FileText },
      { href: "/perusahaan/shortlist", label: copy.dashboard.nav.shortlist, icon: Star },
      { href: "/perusahaan/matching", label: copy.dashboard.nav.matching, icon: Search },
      { href: "/perusahaan/proyek", label: copy.dashboard.nav.myProjects, icon: FolderKanban },
      { href: "/perusahaan/cofunding", label: "Co-Funding", icon: HandCoins },
      { href: "/perusahaan/pendanaan", label: copy.dashboard.nav.fundingHistory, icon: PiggyBank },
      { href: "/perusahaan/sustainability", label: copy.dashboard.nav.sustainabilityReport, icon: FileBarChart },
      { href: "/perusahaan/profil", label: copy.dashboard.nav.companyProfile, icon: Building2 },
    ],
    PENGUSUL: [
      { href: "/pengusul/proposal", label: copy.navbar.myProposals, icon: FileText },
      { href: "/pengusul/proposal/buat", label: copy.dashboard.nav.createProposal, icon: FileText },
      { href: "/pengusul/proyek", label: copy.dashboard.nav.ongoingProjects, icon: FolderKanban },
      { href: "/pengusul/pelaporan", label: copy.dashboard.nav.reporting, icon: FileBarChart },
      { href: "/pengusul/dana", label: copy.dashboard.nav.fundHistory, icon: PiggyBank },
      { href: "/pengusul/organisasi", label: copy.dashboard.nav.organizationProfile, icon: Building2 },
      { href: "/pengusul/verifikasi", label: copy.dashboard.nav.orgVerification, icon: ShieldCheck },
    ],
    DONOR_KOLABORATOR: [
      { href: "/donor/proposal", label: copy.dashboard.nav.exploreProposals, icon: Globe },
      { href: "/donor/cofunding", label: copy.dashboard.nav.myCofunding, icon: HandCoins },
      { href: "/donor/proyek", label: copy.dashboard.nav.fundedProjects, icon: FolderKanban },
      { href: "/donor/dampak", label: copy.dashboard.nav.myImpact, icon: TrendingUp },
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
  const copy = useStructureCopy();
  const navItems = getNavItems(role, copy);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border/80 bg-white/88 backdrop-blur transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-4">
        {!collapsed ? (
          <Link href="/" className="flex flex-1 items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg gradient-brand">
              <span className="text-base font-bold text-white">C</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              CSR<span className="text-brand-600">Hub</span>
            </span>
          </Link>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
            <span className="text-base font-bold text-white">C</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? copy.dashboard.expandSidebar : copy.dashboard.collapseSidebar}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

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
              {!collapsed && <span className="flex-1 text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "sidebar-link sidebar-link-inactive w-full text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? copy.dashboard.logout : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">{copy.dashboard.logout}</span>}
        </button>
      </div>
    </aside>
  );
}
