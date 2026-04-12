"use client";

import React from "react";
import {
  FileText, Building2, Users, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, BarChart3, ShieldCheck,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProposalStatusBadge } from "@/components/ui/proposal-status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { formatRupiah, formatRelativeTime } from "@/lib/utils";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

// Dummy data untuk tampilan langsung hidup
const MONTHLY_FUNDING = [
  { bulan: "Jan", jumlah: 12500000000, proposal: 45 },
  { bulan: "Feb", jumlah: 18200000000, proposal: 62 },
  { bulan: "Mar", jumlah: 15800000000, proposal: 54 },
  { bulan: "Apr", jumlah: 22100000000, proposal: 78 },
  { bulan: "Mei", jumlah: 19600000000, proposal: 67 },
  { bulan: "Jun", jumlah: 28400000000, proposal: 89 },
  { bulan: "Jul", jumlah: 31200000000, proposal: 102 },
  { bulan: "Ags", jumlah: 26700000000, proposal: 94 },
];

const CATEGORY_DATA = [
  { name: "Pendidikan", value: 32, color: "#22c55e" },
  { name: "Kesehatan", value: 18, color: "#14b8a6" },
  { name: "Lingkungan", value: 22, color: "#3b82f6" },
  { name: "Ekonomi", value: 14, color: "#f59e0b" },
  { name: "Infrastruktur", value: 8, color: "#8b5cf6" },
  { name: "Lainnya", value: 6, color: "#6b7280" },
];

const RECENT_PROPOSALS = [
  { id: "1", nomor: "CSR-2025-12847", title: "Program Beasiswa Anak Pesisir", org: "Yayasan Cerdas Nusantara", status: "DIKIRIM" as const, amount: "450000000", time: "2 jam lalu" },
  { id: "2", nomor: "CSR-2025-12846", title: "Penghijauan 10.000 Mangrove", org: "Komunitas Hijau Sulawesi", status: "DALAM_REVIEW" as const, amount: "980000000", time: "4 jam lalu" },
  { id: "3", nomor: "CSR-2025-12845", title: "Posyandu Terintegrasi Digital", org: "NGO Sehat Sejahtera", status: "DISETUJUI" as const, amount: "320000000", time: "6 jam lalu" },
  { id: "4", nomor: "CSR-2025-12844", title: "Pelatihan UMKM Perempuan", org: "Komunitas Wirausaha Wanita", status: "MEMBUTUHKAN_REVISI" as const, amount: "220000000", time: "8 jam lalu" },
  { id: "5", nomor: "CSR-2025-12843", title: "Sekolah Tani Milenial", org: "Yayasan Petani Muda", status: "DIKIRIM" as const, amount: "560000000", time: "10 jam lalu" },
];

const RISK_ALERTS = [
  { id: "1", type: "PROPOSAL", message: "Anggaran per penerima sangat tinggi (Rp 8.5jt/orang)", level: "TINGGI", entity: "Proposal #CSR-2025-12840" },
  { id: "2", type: "ORG", message: "Organisasi baru (<1 tahun) dengan proposal senilai Rp 2M", level: "SEDANG", entity: "Komunitas Baru Sejahtera" },
  { id: "3", type: "PROPOSAL", message: "Kelengkapan proposal sangat rendah (32%)", level: "SEDANG", entity: "Proposal #CSR-2025-12839" },
];

const PROVINSI_DATA = [
  { provinsi: "Jawa Barat", jumlah: 342, penerima: 125000 },
  { provinsi: "Jawa Tengah", jumlah: 289, penerima: 98000 },
  { provinsi: "Jawa Timur", jumlah: 267, penerima: 112000 },
  { provinsi: "DKI Jakarta", jumlah: 198, penerima: 45000 },
  { provinsi: "Sumatera Utara", jumlah: 156, penerima: 67000 },
  { provinsi: "Sulawesi Selatan", jumlah: 134, penerima: 89000 },
];

const formatMiliar = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}jt`;
  return value.toString();
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="section-title">Dashboard Admin Platform</h1>
        <p className="section-subtitle">
          Pantau aktivitas platform, proposal, organisasi, dan dampak secara real-time.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Proposal Masuk"
          value="2,847"
          subtitle="Bulan ini: +124 proposal"
          icon={FileText}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
          trend={{ value: 12.4, label: "vs bulan lalu", positive: true }}
        />
        <StatCard
          title="Dana Tersalurkan"
          value="Rp 189M"
          subtitle="Total dari 347 perusahaan"
          icon={DollarSign}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
          trend={{ value: 18.2, label: "vs bulan lalu", positive: true }}
        />
        <StatCard
          title="Penerima Manfaat"
          value="1,24 Juta"
          subtitle="Dari 34 provinsi"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 9.7, label: "vs bulan lalu", positive: true }}
        />
        <StatCard
          title="Organisasi Terverifikasi"
          value="1,283"
          subtitle="Pending: 47 organisasi"
          icon={ShieldCheck}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          trend={{ value: 5.3, label: "vs bulan lalu", positive: true }}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Proposal Disetujui"
          value="2,104"
          subtitle="Tingkat approval: 73.9%"
          icon={CheckCircle2}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Proyek Aktif"
          value="847"
          subtitle="Selesai tahun ini: 312"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Menunggu Review"
          value="156"
          subtitle="Rata-rata waktu review: 2.3 hari"
          icon={Clock}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
        <StatCard
          title="Risk Alerts"
          value="23"
          subtitle="3 kritis, 12 tinggi, 8 sedang"
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Funding Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tren Pendanaan Bulanan (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MONTHLY_FUNDING} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatMiliar} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "jumlah" ? formatRupiah(value, true) : value,
                    name === "jumlah" ? "Dana" : "Proposal",
                  ]}
                />
                <Bar dataKey="jumlah" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribusi Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "Proporsi"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {CATEGORY_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Proposal Terbaru</CardTitle>
              <a href="/admin/proposal" className="text-xs text-brand-600 hover:underline">
                Lihat semua →
              </a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {RECENT_PROPOSALS.map((p) => (
                <div key={p.id} className="px-6 py-3.5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">{p.nomor}</span>
                        <ProposalStatusBadge status={p.status} />
                      </div>
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.org}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-brand-600">
                        {formatRupiah(parseInt(p.amount), true)}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Risk Alerts
              </CardTitle>
              <Badge variant="warning">{RISK_ALERTS.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {RISK_ALERTS.map((alert) => (
                <div key={alert.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      alert.level === "KRITIS" ? "bg-red-500" :
                      alert.level === "TINGGI" ? "bg-orange-500" : "bg-yellow-500"
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{alert.entity}</p>
                      <p className="text-xs mt-0.5 leading-relaxed">{alert.message}</p>
                      <Badge
                        variant={alert.level === "KRITIS" ? "error" : alert.level === "TINGGI" ? "warning" : "info"}
                        className="mt-1.5"
                      >
                        {alert.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <a href="/admin/risk-alerts" className="text-xs text-brand-600 hover:underline block text-center">
                Lihat semua alerts →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Province Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Distribusi Proposal per Provinsi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Provinsi</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Proposal</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Penerima</th>
                  <th className="py-2 font-medium text-muted-foreground">Proporsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PROVINSI_DATA.map((row) => {
                  const maxJumlah = Math.max(...PROVINSI_DATA.map((r) => r.jumlah));
                  const pct = (row.jumlah / maxJumlah) * 100;
                  return (
                    <tr key={row.provinsi} className="hover:bg-muted/50">
                      <td className="py-2.5 font-medium">{row.provinsi}</td>
                      <td className="py-2.5 text-right">{row.jumlah.toLocaleString("id-ID")}</td>
                      <td className="py-2.5 text-right">{row.penerima.toLocaleString("id-ID")}</td>
                      <td className="py-2.5 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
