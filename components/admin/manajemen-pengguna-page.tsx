"use client";

import React, { useState } from "react";
import {
  Users, Search, Shield, CheckCircle2, XCircle, MoreVertical,
  UserPlus, Filter, RefreshCw, Lock, Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DUMMY_USERS = [
  { id: "u1", name: "Siti Rahayu", email: "ketua@yayasan-cerdas.org", role: "PENGUSUL", isActive: true, emailVerified: true, createdAt: "2024-08-01", lastLogin: "2025-04-09T10:00:00Z", org: "Yayasan Cerdas Nusantara" },
  { id: "u2", name: "Budi Santoso", email: "csr@pertamina-csr.id", role: "PERUSAHAAN", isActive: true, emailVerified: true, createdAt: "2024-06-01", lastLogin: "2025-04-10T08:30:00Z", org: "PT Pertamina (Persero)" },
  { id: "u3", name: "Dr. Bambang Priyatno", email: "direktur@lingkunganhijau.org", role: "PENGUSUL", isActive: true, emailVerified: true, createdAt: "2024-08-15", lastLogin: "2025-04-08T14:00:00Z", org: "Yayasan Lingkungan Hijau" },
  { id: "u4", name: "Agus Hermawan", email: "verifikator@csrhub.id", role: "VERIFIKATOR", isActive: true, emailVerified: true, createdAt: "2024-01-01", lastLogin: "2025-04-10T09:00:00Z", org: null },
  { id: "u5", name: "Ratna Dewi", email: "csr@mandiri-foundation.id", role: "PERUSAHAAN", isActive: false, emailVerified: true, createdAt: "2024-06-15", lastLogin: "2025-03-01T11:00:00Z", org: "PT Bank Mandiri" },
  { id: "u6", name: "Rudi Prasetyo", email: "direktur@digitaldesa.id", role: "PENGUSUL", isActive: true, emailVerified: false, createdAt: "2025-01-15", lastLogin: "2025-04-07T16:00:00Z", org: "Komunitas Digital Desa" },
];

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "text-red-700 bg-red-50",
  ADMIN_PLATFORM: "text-orange-700 bg-orange-50",
  VERIFIKATOR: "text-purple-700 bg-purple-50",
  AUDITOR: "text-blue-700 bg-blue-50",
  PERUSAHAAN: "text-teal-700 bg-teal-50",
  PENGUSUL: "text-brand-700 bg-brand-50",
  DONOR_KOLABORATOR: "text-yellow-700 bg-yellow-50",
};

export function ManajemenPenggunaPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState(DUMMY_USERS);

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const activeCount = users.filter((u) => u.isActive).length;
  const unverifiedCount = users.filter((u) => !u.emailVerified).length;

  function toggleActive(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Manajemen Pengguna</h1>
          <p className="section-subtitle">Kelola akun pengguna dan hak akses platform.</p>
        </div>
        <Button variant="brand" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Pengguna" value={users.length} icon={Users} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Aktif" value={activeCount} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Nonaktif" value={users.length - activeCount} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Belum Verif Email" value={unverifiedCount} icon={Shield} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="flex h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Semua Role</option>
          {Object.keys(ROLE_COLORS).map((r) => (
            <option key={r} value={r}>{r.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-5 py-3 text-left font-semibold text-xs text-muted-foreground">Pengguna</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Organisasi</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Login Terakhir</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs text-muted-foreground">Bergabung</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium leading-none">{user.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", ROLE_COLORS[user.role] || "text-gray-700 bg-gray-50")}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {user.org || <span className="italic">Platform Staff</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <Badge variant={user.isActive ? "success" : "secondary"} className="text-[10px]">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                        {!user.emailVerified && (
                          <Badge variant="warning" className="text-[10px] block w-fit">Email Belum Verif</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {formatRelativeTime(user.lastLogin)}
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title={user.isActive ? "Nonaktifkan" : "Aktifkan"}
                        onClick={() => toggleActive(user.id)}
                        className={user.isActive ? "text-red-400 hover:text-red-600" : "text-green-500 hover:text-green-700"}
                      >
                        {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
