import { useState } from "react";
import { useListCofunding } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah, getStatusColor, getStatusLabel, formatDateShort } from "@/lib/utils";
import { HandCoins, Building2, Calendar, ArrowRight, TrendingUp } from "lucide-react";

export default function CofundingPage() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListCofunding({ page, limit: 10 });
  const commitments = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  const totalAmount = commitments.reduce((sum: number, c: any) => sum + (c.amount ?? 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Co-Funding CSR</h1>
          <p className="text-muted-foreground text-sm mt-1">Kolaborasi pendanaan multi-perusahaan untuk dampak yang lebih besar</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <HandCoins className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">{total}</div>
            <div className="text-xs text-muted-foreground">Total Komitmen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">{formatRupiah(totalAmount)}</div>
            <div className="text-xs text-muted-foreground">Total Dana (Halaman Ini)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {new Set(commitments.map((c: any) => c.organization_id)).size}
            </div>
            <div className="text-xs text-muted-foreground">Perusahaan Berkontribusi</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>
      ) : commitments.length === 0 ? (
        <div className="text-center py-16">
          <HandCoins className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Belum ada komitmen co-funding</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Jadilah yang pertama berkontribusi untuk program CSR</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daftar Komitmen Pendanaan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {commitments.map((c: any) => (
                <div key={c.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <HandCoins className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">Komitmen #{c.id}</p>
                      <Badge className={`${getStatusColor(c.status ?? "menunggu")} border-0 text-xs`}>
                        {getStatusLabel(c.status ?? "menunggu")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />Org #{c.organization_id}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />Proposal #{c.proposal_id}
                      </span>
                      {c.committed_at && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{formatDateShort(c.committed_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{formatRupiah(c.amount ?? 0)}</p>
                    {c.notes && <p className="text-xs text-muted-foreground max-w-32 truncate">{c.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
