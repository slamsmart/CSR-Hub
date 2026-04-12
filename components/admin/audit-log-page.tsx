"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardCheck, Search, Download, User, Shield, FileText,
  DollarSign, Building2, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ACTION_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PROPOSAL_CREATED: { label: "Proposal Dibuat", color: "text-blue-600 bg-blue-50", icon: FileText },
  PROPOSAL_APPROVED: { label: "Proposal Disetujui", color: "text-green-600 bg-green-50", icon: FileText },
  PROPOSAL_REJECTED: { label: "Proposal Ditolak", color: "text-red-600 bg-red-50", icon: FileText },
  ORGANIZATION_VERIFIED: { label: "Org Diverifikasi", color: "text-teal-600 bg-teal-50", icon: Building2 },
  FUNDING_COMMITTED: { label: "Dana Dikucurkan", color: "text-brand-600 bg-brand-50", icon: DollarSign },
  USER_LOGIN: { label: "User Login", color: "text-gray-600 bg-gray-50", icon: User },
  USER_LOCKED: { label: "User Dikunci", color: "text-red-600 bg-red-50", icon: Shield },
  DOCUMENT_UPLOADED: { label: "Dokumen Diunggah", color: "text-purple-600 bg-purple-50", icon: FileText },
};

const DUMMY_LOGS = [
  { id: "al1", action: "PROPOSAL_APPROVED", entityType: "Proposal", entityId: "p1", description: "Admin Dewi Kurniawati menyetujui proposal 'Beasiswa SMA Papua'", userId: "u-admin", userName: "Dewi Kurniawati", ipAddress: "10.0.0.1", createdAt: "2025-04-10T08:30:00Z" },
  { id: "al2", action: "ORGANIZATION_VERIFIED", entityType: "Organization", entityId: "org1", description: "Verifikator Agus Hermawan memverifikasi Yayasan Cerdas Nusantara", userId: "u-verif", userName: "Agus Hermawan", ipAddress: "10.0.0.2", createdAt: "2025-04-08T16:45:00Z" },
  { id: "al3", action: "FUNDING_COMMITTED", entityType: "FundingCommitment", entityId: "fc1", description: "Budi Santoso (Pertamina) mengkomitmen Rp 500M untuk beasiswa Papua", userId: "u-company", userName: "Budi Santoso", ipAddress: "203.0.113.1", createdAt: "2025-04-07T14:00:00Z" },
  { id: "al4", action: "PROPOSAL_CREATED", entityType: "Proposal", entityId: "p4", description: "Rudi Prasetyo membuat proposal baru 'Pelatihan Digital UMKM Yogyakarta'", userId: "u-ngo", userName: "Rudi Prasetyo", ipAddress: "114.125.0.1", createdAt: "2025-04-06T11:30:00Z" },
  { id: "al5", action: "USER_LOGIN", entityType: "User", entityId: "u-admin", description: "Login berhasil dari Chrome/Windows", userId: "u-admin", userName: "Dewi Kurniawati", ipAddress: "10.0.0.1", createdAt: "2025-04-10T08:00:00Z" },
  { id: "al6", action: "DOCUMENT_UPLOADED", entityType: "VerificationDocument", entityId: "doc1", description: "Yayasan Cerdas Nusantara mengunggah Akta Pendirian", userId: "u-ngo1", userName: "Siti Rahayu", ipAddress: "114.122.0.5", createdAt: "2025-04-05T09:00:00Z" },
];

export function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const filtered = DUMMY_LOGS.filter((log) => {
    const matchSearch = !search || log.description.toLowerCase().includes(search.toLowerCase()) || log.userName.toLowerCase().includes(search.toLowerCase());
    const matchAction = !actionFilter || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Audit Log</h1>
          <p className="section-subtitle">Rekam jejak semua aksi penting dalam platform.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Ekspor Log
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Log Hari Ini" value={DUMMY_LOGS.length} icon={ClipboardCheck} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Aksi Sensitif" value={2} icon={Shield} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Pengguna Aktif" value={4} icon={User} iconColor="text-teal-600" iconBg="bg-teal-50" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari log..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="flex h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">Semua Aksi</option>
          {Object.entries(ACTION_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((log) => {
              const cfg = ACTION_CONFIG[log.action] || { label: log.action, color: "text-gray-600 bg-gray-50", icon: ClipboardCheck };
              const Icon = cfg.icon;
              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", cfg.color.split(" ")[1])}>
                    <Icon className={cn("h-4 w-4", cfg.color.split(" ")[0])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", cfg.color)}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-muted-foreground">by {log.userName}</span>
                    </div>
                    <p className="text-sm">{log.description}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>IP: {log.ipAddress}</span>
                      <span>{log.entityType} #{log.entityId.slice(-6)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                    {formatRelativeTime(log.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
