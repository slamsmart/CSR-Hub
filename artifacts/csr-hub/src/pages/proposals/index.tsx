import { useState } from "react";
import { Link } from "wouter";
import { useListProposals } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah, getStatusColor, getStatusLabel, formatDateShort } from "@/lib/utils";
import { Search, Plus, FileText, MapPin, Calendar, Users, ArrowRight } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "semua", label: "Semua Status" },
  { value: "dikirim", label: "Dikirim" },
  { value: "review", label: "Dalam Review" },
  { value: "disetujui", label: "Disetujui" },
  { value: "didanai", label: "Didanai" },
  { value: "berjalan", label: "Berjalan" },
  { value: "selesai", label: "Selesai" },
];

export default function ProposalsPage() {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("semua");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListProposals({
    page,
    limit: 9,
    status: status === "semua" ? undefined : status,
    search: search || undefined,
  });

  const proposals = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 9);

  const canCreate = isAuthenticated && (user?.role === "ngo" || user?.role === "perusahaan" || user?.role === "super_admin" || user?.role === "admin");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proposal CSR</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} proposal ditemukan</p>
        </div>
        {canCreate && (
          <Link href="/proposals/new" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Buat Proposal
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari judul, lokasi, atau kategori..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Tidak ada proposal ditemukan</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p: any) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${getStatusColor(p.status)} text-xs border-0`}>{getStatusLabel(p.status)}</Badge>
                  {p.ai_score && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                      AI: {p.ai_score}%
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{p.description}</p>

                <div className="space-y-1.5 mb-4">
                  {p.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  )}
                  {(p.targetBeneficiaries ?? p.target_beneficiaries) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-3 h-3 shrink-0" />
                      <span>{(p.targetBeneficiaries ?? p.target_beneficiaries).toLocaleString("id-ID")} penerima manfaat</span>
                    </div>
                  )}
                  {(p.startDate ?? p.start_date) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>Mulai {formatDateShort(p.startDate ?? p.start_date)}</span>
                    </div>
                  )}
                </div>

                {((p.sdgGoals ?? p.sdg_goals) ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(p.sdgGoals ?? p.sdg_goals ?? []).slice(0, 3).map((g: string) => (
                      <span key={g} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-bold text-primary">{formatRupiah(p.budgetTotal ?? p.budget_requested ?? p.budget_total)}</span>
                  <Link href={`/proposals/${p.id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
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
