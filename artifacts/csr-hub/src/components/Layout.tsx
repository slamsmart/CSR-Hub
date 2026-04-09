import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Building2, FolderKanban, HandCoins,
  ClipboardList, Bell, LogOut, Menu, X, ChevronDown, Users, Leaf,
  Trophy, FileBarChart, FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useListNotifications } from "@workspace/api-client-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Beranda", href: "/", icon: Leaf, roles: [] },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["super_admin","admin","verifikator","auditor","perusahaan","ngo","donor"] },
  { label: "Proposal", href: "/proposals", icon: FileText, roles: [] },
  { label: "Organisasi", href: "/organizations", icon: Building2, roles: [] },
  { label: "Proyek", href: "/projects", icon: FolderKanban, roles: [] },
  { label: "Co-Funding", href: "/cofunding", icon: HandCoins, roles: ["super_admin","admin","perusahaan","donor"] },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, roles: [] },
  { label: "Laporan GRI", href: "/sustainability", icon: FileBarChart, roles: ["super_admin","admin","perusahaan"] },
  { label: "Profil KYC", href: "/profile/kyc", icon: FileCheck, roles: ["perusahaan","ngo","komunitas","donor"] },
  { label: "Pengguna", href: "/users", icon: Users, roles: ["super_admin","admin"] },
  { label: "Audit Log", href: "/audit", icon: ClipboardList, roles: ["super_admin","admin","auditor"] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const { data: notifications } = useListNotifications(
    { unread_only: true },
    { query: { enabled: isAuthenticated } }
  );

  const unreadCount = (notifications as any[])?.length ?? 0;

  const visibleNav = navItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  const displayName = (user as any)?.name || (user as any)?.full_name || user?.email || "Pengguna";
  const initials = displayName !== user?.email
    ? displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-bold text-base leading-tight">CSR Hub</h1>
            <p className="text-sidebar-foreground/50 text-xs">Platform CSR Indonesia</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-sidebar-border pt-3">
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-sidebar-primary text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sidebar-foreground text-sm font-medium truncate">{displayName}</p>
                  <p className="text-sidebar-foreground/50 text-xs truncate">{user.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-sidebar-foreground/50 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="block w-full text-center text-sm px-3 py-2 rounded-lg bg-sidebar-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="block w-full text-center text-sm px-3 py-2 rounded-lg border border-sidebar-border text-sidebar-foreground font-medium hover:bg-sidebar-accent transition-colors"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex-1" />

          {isAuthenticated && (
            <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-accent/10 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-xs bg-destructive text-white border-0 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Link>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" asChild>
                  <span>Masuk</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" asChild>
                  <span>Daftar</span>
                </Button>
              </Link>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
