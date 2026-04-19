"use client";

import React from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { useNotificationCount } from "@/hooks/use-notifications";
import { getRoleLabels } from "@/types";
import { useLanguage, useStructureCopy } from "@/components/providers/language-provider";

interface DashboardHeaderProps {
  session: Session;
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const { count: notifCount } = useNotificationCount();
  const { language, setLanguage } = useLanguage();
  const copy = useStructureCopy();
  const roleLabels = getRoleLabels(language);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/80 bg-white/90 px-6 backdrop-blur">
      <div className="hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={copy.dashboard.searchPlaceholder}
            className="h-11 w-full rounded-2xl border border-input bg-[#f4f6ef] pl-10 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center rounded-full border border-border/80 bg-white p-1 shadow-sm sm:inline-flex">
          <button
            type="button"
            aria-label={copy.language.switchLabel}
            onClick={() => setLanguage("id")}
            className={language === "id" ? "rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white" : "rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground"}
          >
            {copy.language.ind}
          </button>
          <button
            type="button"
            aria-label={copy.language.switchLabel}
            onClick={() => setLanguage("en")}
            className={language === "en" ? "rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white" : "rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground"}
          >
            {copy.language.eng}
          </button>
        </div>

        <Link href="/notifikasi">
          <button className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent">
            <Bell className="h-4 w-4" />
            {notifCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
        </Link>

        <Link href="/pengaturan" className="flex items-center gap-3 rounded-2xl px-3 py-1.5 transition-colors hover:bg-accent">
          <UserAvatar
            name={session.user.name || "User"}
            image={session.user.image}
            size="sm"
          />
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold leading-none">{session.user.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {roleLabels[session.user.role]}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
