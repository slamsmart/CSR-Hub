import { useRoute, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetProposal, useGetProposalAiScore, customFetch, getListProposalsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatRupiah, getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Users, Target, CheckCircle, AlertCircle, Sparkles, Building2, Send } from "lucide-react";
import { toast } from "sonner";

export default function ProposalDetailPage() {
  const [, params] = useRoute("/proposals/:id");
  const id = Number(params?.id);
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: proposal, isLoading } = useGetProposal(id);
  const { data: aiScore } = useGetProposalAiScore(id, { query: { enabled: !!id && id > 0 } });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["/api/proposals"] });

  const submitMutation = useMutation({
    mutationFn: () => customFetch(`/api/proposals/${id}/submit`, { method: "POST" }),
    onSuccess: () => { invalidate(); toast.success("Proposal berhasil dikirim"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const approveMutation = useMutation({
    mutationFn: () => customFetch(`/api/proposals/${id}/approve`, { method: "POST", body: JSON.stringify({ notes: "Proposal disetujui" }) }),
    onSuccess: () => { invalidate(); toast.success("Proposal disetujui"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: () => customFetch(`/api/proposals/${id}/reject`, { method: "POST", body: JSON.stringify({ notes: "Tidak memenuhi kriteria" }) }),
    onSuccess: () => { invalidate(); toast.success("Proposal ditolak"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40" />
        <Skeleton className="h-60" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="p-6 text-center py-20">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Proposal tidak ditemukan</p>
        <Link href="/proposals" className="inline-block mt-4 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
          Kembali
        </Link>
      </div>
    );
  }

  const canSubmit = user && proposal.submitter_id === user.id && proposal.status === "draft";
  const canReview = user && ["verifikator","admin","super_admin"].includes(user.role) && ["dikirim","review"].includes(proposal.status);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/proposals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Proposal
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className={`${getStatusColor(proposal.status)} border-0`}>{getStatusLabel(proposal.status)}</Badge>
            {proposal.sdg_goals?.map((g) => (
              <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{proposal.title}</h1>
          {proposal.organization_id && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>Diajukan oleh Org #{proposal.organization_id}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          {canSubmit && (
            <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
              <Send className="w-4 h-4 mr-2" />
              {submitMutation.isPending ? "Mengirim..." : "Kirim Proposal"}
            </Button>
          )}
          {canReview && (
            <>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => rejectMutation.mutate()} disabled={rejectMutation.isPending}>
                Tolak
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
                <CheckCircle className="w-4 h-4 mr-2" /> Setujui
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Deskripsi Program</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{proposal.description}</p>
            </CardContent>
          </Card>

          {proposal.implementation_plan && (
            <Card>
              <CardHeader><CardTitle className="text-base">Rencana Implementasi</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{proposal.implementation_plan}</p>
              </CardContent>
            </Card>
          )}

          {aiScore && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base text-primary">Analisis AI CSR Hub</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Skor Total</span>
                  <span className="text-xl font-bold text-primary">{aiScore.total_score}/100</span>
                </div>
                <Progress value={aiScore.total_score ?? 0} className="h-2" />
                {aiScore.breakdown && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {Object.entries(aiScore.breakdown).map(([key, val]) => (
                      <div key={key} className="bg-white rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold text-foreground">{String(val)}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</div>
                      </div>
                    ))}
                  </div>
                )}
                {aiScore.recommendation && (
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <p className="text-xs font-medium text-foreground mb-1">Rekomendasi AI:</p>
                    <p className="text-xs text-muted-foreground">{aiScore.recommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Detail Anggaran</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Diajukan</p>
                <p className="text-xl font-bold text-primary">{formatRupiah(proposal.budget_requested)}</p>
              </div>
              {proposal.budget_approved && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Disetujui</p>
                    <p className="text-lg font-bold text-green-600">{formatRupiah(proposal.budget_approved)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Informasi Program</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {proposal.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">Lokasi</p><p className="font-medium">{proposal.location}</p></div>
                </div>
              )}
              {proposal.target_beneficiaries && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">Penerima Manfaat</p><p className="font-medium">{proposal.target_beneficiaries.toLocaleString("id-ID")} orang</p></div>
                </div>
              )}
              {proposal.start_date && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">Tanggal Mulai</p><p className="font-medium">{formatDate(proposal.start_date)}</p></div>
                </div>
              )}
              {proposal.end_date && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">Tanggal Selesai</p><p className="font-medium">{formatDate(proposal.end_date)}</p></div>
                </div>
              )}
              {proposal.category && (
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">Kategori</p><p className="font-medium capitalize">{proposal.category}</p></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
