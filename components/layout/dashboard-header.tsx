"use client";

import React from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNotificationCount } from "@/hooks/use-notifications";
import { ROLE_LABELS } from "@/types";

interface DashboardHeaderProps {
  session: Session;
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { count: notifCount } = useNotificationCount();

  return (
    <header className="h-16 bg-white dark:bg-gray-950 border-b border-border flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari proposal, organisasi, proyek..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <Link href="/notifikasi">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <Bell className="h-4 w-4" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
        </Link>

        {/* User Info */}
        <Link href="/pengaturan" className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors">
          <UserAvatar
            name={session.user.name || "User"}
            image={session.user.image}
            size="sm"
          />
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ROLE_LABELS[session.user.role]}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
