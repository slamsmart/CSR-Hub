import { useState } from "react";
import { Link } from "wouter";
import { useListProjects } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah, getStatusColor, getStatusLabel } from "@/lib/utils";
import { FolderKanban, ArrowRight, TrendingUp } from "lucide-react";

export default function ProjectsPage() {
  const [status, setStatus] = useState("semua");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListProjects({
    page,
    limit: 9,
    status: status === "semua" ? undefined : status,
  });

  const projects = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monitoring Proyek</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} proyek terdaftar — pantau perkembangan program CSR</p>
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="ditunda">Ditunda</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Belum ada proyek aktif</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Proyek akan muncul setelah proposal didanai dan berjalan</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj: any) => (
            <Card key={proj.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50">
                    <FolderKanban className="w-5 h-5 text-teal-600" />
                  </div>
                  <Badge className={`${getStatusColor(proj.status)} border-0 text-xs`}>{getStatusLabel(proj.status)}</Badge>
                </div>

                <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {proj.title ?? `Proyek #${proj.id}`}
                </h3>
                {proj.organizationName && <p className="text-xs text-muted-foreground mb-3 truncate">{proj.organizationName}</p>}

                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{proj.progressPercent ?? proj.progress_percent ?? 0}%</span>
                    </div>
                    <Progress value={proj.progressPercent ?? proj.progress_percent ?? 0} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Dana Digunakan</p>
                    <p className="text-xs font-semibold text-foreground">{formatRupiah(proj.budgetUsed ?? proj.budget_used ?? 0)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Total Dana</p>
                    <p className="text-xs font-semibold text-foreground">{formatRupiah(proj.budgetTotal ?? proj.budget_total ?? 0)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-teal-600">
                    <TrendingUp className="w-3 h-3" /><span>Berjalan</span>
                  </div>
                  <Link href={`/projects/${proj.id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    Detail <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
          <span className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya</Button>
        </div>
      )}
    </div>
  );
}
