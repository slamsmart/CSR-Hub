import { Link } from "wouter";
import { useGetDashboardStats, useListProposals, useListProjects } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatRupiah, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, FileText, FolderKanban, Users, ArrowRight, Plus, AlertTriangle } from "lucide-react";

const CHART_COLORS = ["#16a34a", "#2563eb", "#d97706", "#7c3aed", "#dc2626"];

const monthlyData = [
  { bulan: "Okt", proposal: 4, didanai: 1 },
  { bulan: "Nov", proposal: 6, didanai: 2 },
  { bulan: "Des", proposal: 5, didanai: 2 },
  { bulan: "Jan", proposal: 8, didanai: 3 },
  { bulan: "Feb", proposal: 7, didanai: 2 },
  { bulan: "Mar", proposal: 9, didanai: 4 },
];

const sdgData = [
  { name: "SDG 4 Pendidikan", value: 28 },
  { name: "SDG 3 Kesehatan", value: 22 },
  { name: "SDG 13 Iklim", value: 18 },
  { name: "SDG 8 Pekerjaan", value: 15 },
  { name: "Lainnya", value: 17 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: proposalsResp, isLoading: proposalsLoading } = useListProposals({ page: 1, limit: 5 });
  const { data: projectsResp } = useListProjects({ page: 1, limit: 3 });

  const proposals = (proposalsResp as any)?.data ?? [];
  const projects = (projectsResp as any)?.data ?? [];

  const statCards = [
    { label: "Total Proposal", value: stats?.totalProposals ?? 0, icon: FileText, sub: `${stats?.approvedProposals ?? 0} disetujui`, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Dana Disalurkan", value: formatRupiah(stats?.totalFundingRp ?? 0), icon: TrendingUp, sub: `Sukses ${stats?.successRate?.toFixed(0) ?? 0}%`, color: "text-green-500", bg: "bg-green-50" },
    { label: "Proyek Aktif", value: stats?.activeProjects ?? 0, icon: FolderKanban, sub: `${stats?.completedProjects ?? 0} selesai`, color: "text-teal-500", bg: "bg-teal-50" },
    { label: "Penerima Manfaat", value: (stats?.totalBeneficiaries ?? 0).toLocaleString("id-ID"), icon: Users, sub: "Warga terbantu", color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Selamat datang, {user?.full_name?.split(" ")[0] ?? "Pengguna"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Ringkasan platform CSR Hub hari ini</p>
        </div>
        {(user?.role === "ngo" || user?.role === "perusahaan") && (
          <Link href="/proposals/new" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Buat Proposal
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                {statsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ) : (
                  <>
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${s.bg} mb-3`}>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tren Proposal & Pendanaan (6 Bulan)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="proposal" stroke="#16a34a" fill="url(#propGrad)" strokeWidth={2} name="Proposal" />
                <Area type="monotone" dataKey="didanai" stroke="#2563eb" fill="url(#fundGrad)" strokeWidth={2} name="Didanai" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribusi SDGs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={sdgData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {sdgData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {sdgData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Proposal Terbaru</CardTitle>
              <Link href="/proposals" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                Semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {proposalsLoading ? (
              <div className="px-4 space-y-3 py-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12" />)}</div>
            ) : (
              <div className="divide-y divide-border">
                {proposals.map((p: any) => (
                  <Link key={p.id} href={`/proposals/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{formatRupiah(p.budget_requested)}</p>
                    </div>
                    <Badge className={`${getStatusColor(p.status)} text-xs border-0 shrink-0`}>
                      {getStatusLabel(p.status)}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Proyek Berjalan</CardTitle>
              <Link href="/projects" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                Semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada proyek aktif</p>
            )}
            {projects.map((proj: any) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">Proyek #{proj.id}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{proj.progress_percent ?? 0}%</span>
                </div>
                <Progress value={proj.progress_percent ?? 0} className="h-1.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dana: {formatRupiah(proj.budget_used ?? 0)}</span>
                  <Badge className={`${getStatusColor(proj.status)} border-0 text-xs`}>
                    {getStatusLabel(proj.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {(user?.role === "super_admin" || user?.role === "admin" || user?.role === "verifikator") && stats?.pendingVerification && stats.pendingVerification > 0 ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">{stats.pendingVerification} organisasi menunggu verifikasi</p>
              <p className="text-xs text-yellow-700">Tinjau dokumen dan verifikasi kelayakan mitra baru</p>
            </div>
            <Link href="/organizations?status=menunggu" className="px-3 py-1.5 text-xs border border-yellow-400 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors">
              Tinjau
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
