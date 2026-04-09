import { useState } from "react";
import { useListAuditLogs } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { ClipboardList, Search, User, Shield, FileText, Building2, Lock } from "lucide-react";
import { Link } from "wouter";

function ActionIcon({ action }: { action: string }) {
  if (action.includes("LOGIN") || action.includes("REGISTER")) return <User className="w-3.5 h-3.5" />;
  if (action.includes("PROPOSAL")) return <FileText className="w-3.5 h-3.5" />;
  if (action.includes("ORGANIZATION") || action.includes("ORG")) return <Building2 className="w-3.5 h-3.5" />;
  if (action.includes("VERIFY")) return <Shield className="w-3.5 h-3.5" />;
  return <ClipboardList className="w-3.5 h-3.5" />;
}

function actionColor(action: string): string {
  if (action.includes("DELETE") || action.includes("REJECT")) return "bg-red-100 text-red-700";
  if (action.includes("CREATE") || action.includes("REGISTER")) return "bg-green-100 text-green-700";
  if (action.includes("UPDATE") || action.includes("APPROVE") || action.includes("VERIFY")) return "bg-blue-100 text-blue-700";
  if (action.includes("LOGIN")) return "bg-gray-100 text-gray-700";
  return "bg-purple-100 text-purple-700";
}

export default function AuditPage() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListAuditLogs({ page, limit: 20 });

  if (!isAuthenticated || !["super_admin","admin","auditor"].includes(user?.role ?? "")) {
    return (
      <div className="p-6 text-center py-20">
        <Lock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Akses Terbatas</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Halaman ini hanya untuk Super Admin, Admin, dan Auditor</p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const logs = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const filtered = search
    ? logs.filter((l: any) => l.action?.toLowerCase().includes(search.toLowerCase()) || l.entity_type?.toLowerCase().includes(search.toLowerCase()))
    : logs;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground text-sm mt-1">Rekam jejak aktivitas sistem — {total} entri log tersimpan</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Filter berdasarkan aksi atau entitas..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Tidak ada log ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">ID</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Aksi</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Entitas</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Detail</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">User</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">IP</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((log: any) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">#{log.id}</td>
                      <td className="px-4 py-2.5">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${actionColor(log.action ?? "")}`}>
                          <ActionIcon action={log.action ?? ""} />
                          {log.action}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">
                        {log.entity_type}{log.entity_id ? ` #${log.entity_id}` : ""}
                      </td>
                      <td className="px-4 py-2.5 max-w-48">
                        <span className="text-xs text-muted-foreground truncate block">{log.details || "—"}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{log.user_id ? `#${log.user_id}` : "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">{log.ip_address || "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{log.created_at ? formatDate(log.created_at) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
          <span className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya</Button>
        </div>
      )}
    </div>
  );
}
