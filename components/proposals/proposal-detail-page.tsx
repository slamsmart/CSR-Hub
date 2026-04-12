"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Building2, MapPin, Users, DollarSign, Calendar,
  ShieldCheck, FileText, Milestone, MessageSquare, Star,
  CheckCircle2, XCircle, AlertCircle, Download, ExternalLink,
  Sparkles, TrendingUp, Clock, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProposalStatusBadge } from "@/components/ui/proposal-status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/avatar";
import { formatRupiah, formatDate, formatRelativeTime } from "@/lib/utils";
import { CATEGORY_LABELS, SDG_LABELS } from "@/types";
import { SDGCategory, ProposalCategory } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ReviewAction {
  action: "review";
  status: string;
  notes?: string;
}

export function ProposalDetailPage({ id }: { id: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [reviewNotes, setReviewNotes] = useState("");
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["proposal", id],
    queryFn: async () => {
      const res = await fetch(`/api/proposals/${id}`);
      if (!res.ok) throw new Error("Gagal memuat proposal");
      const json = await res.json();
      return json.data;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (payload: ReviewAction) => {
      const res = await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal memproses review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      toast.success("Status proposal berhasil diperbarui");
      setShowReviewPanel(false);
      setReviewNotes("");
    },
    onError: () => toast.error("Gagal memproses review"),
  });

  const userRole = (session?.user as any)?.role as string | undefined;
  const isAdmin = session?.user && ["SUPER_ADMIN", "ADMIN_PLATFORM"].includes(userRole!);
  const isVerifikator = userRole === "VERIFIKATOR";
  const isCompany = userRole === "PERUSAHAAN";
  const isOwner = data && session?.user && data.createdById === session.user.id;

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-48 bg-muted rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="text-center py-16">
      <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
      <p className="font-medium">Proposal tidak ditemukan</p>
      <Link href="/proposals">
        <Button variant="outline" className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
      </Link>
    </div>
  );

  const p = data;
  const budgetTotal = Number(p.budgetTotal);
  const fundingTarget = Number(p.fundingTarget);
  const fundingSecured = Number(p.fundingSecured);
  const fundingPct = fundingTarget > 0 ? Math.min(100, (fundingSecured / fundingTarget) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/proposals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar proposal
      </Link>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              {/* Nomor + Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                  {p.nomor}
                </span>
                <ProposalStatusBadge status={p.status} />
                {p.isFeatured && <Badge variant="brand">Featured</Badge>}
              </div>

              <h1 className="font-display text-2xl font-bold leading-tight">{p.title}</h1>

              {/* Category + SDG */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="brand">
                  {CATEGORY_LABELS[p.category as ProposalCategory] || p.category}
                </Badge>
                {(p.sdgTags || []).map((sdg: string) => (
                  <Badge key={sdg} variant="teal" className="text-xs">
                    {SDG_LABELS[sdg as SDGCategory]?.split(": ")[0]}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">{p.summary}</p>

              {/* Org */}
              {p.organization && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border">
                  <div className="h-10 w-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {p.organization.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{p.organization.name}</span>
                      <VerificationBadge status={p.organization.verificationStatus} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>Trust Score: {p.organization.trustScore.toFixed(0)}/100</span>
                      {p.organization.provinsi && (
                        <>
                          <span>·</span>
                          <span>{p.organization.provinsi}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link href={`/organizations/${p.organization.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Side Stats */}
            <div className="lg:w-64 space-y-4">
              {/* AI Score */}
              {p.aiMatchScore && isCompany && (
                <div className="rounded-xl bg-gradient-to-br from-brand-50 to-teal-50 border border-brand-100 p-4 text-center">
                  <Sparkles className="h-5 w-5 text-brand-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-brand-700">{p.aiMatchScore}%</p>
                  <p className="text-xs text-brand-600">AI Match Score</p>
                </div>
              )}

              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-brand-600" />
                    <span className="text-xs text-muted-foreground">Total Anggaran</span>
                  </div>
                  <span className="font-semibold text-sm text-brand-600">{formatRupiah(budgetTotal, true)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-teal-600" />
                    <span className="text-xs text-muted-foreground">Penerima Manfaat</span>
                  </div>
                  <span className="font-semibold text-sm">{p.targetBeneficiaries?.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-muted-foreground">Provinsi</span>
                  </div>
                  <span className="font-semibold text-sm">{p.provinsi}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-muted-foreground">Durasi</span>
                  </div>
                  <span className="font-semibold text-sm">{p.durationMonths} bulan</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {isCompany && (
                  <>
                    <Button variant="brand" className="w-full gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Danai Proposal
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Star className="h-4 w-4" />
                      Shortlist
                    </Button>
                  </>
                )}
                {(isAdmin || isVerifikator) && p.status === "DIKIRIM" && (
                  <Button
                    variant="brand"
                    className="w-full gap-2"
                    onClick={() => setShowReviewPanel(true)}
                  >
                    <FileText className="h-4 w-4" />
                    Review Proposal
                  </Button>
                )}
                {isOwner && p.status === "DRAFT" && (
                  <Link href={`/pengusul/proposal/buat?edit=${p.id}`}>
                    <Button variant="outline" className="w-full gap-2">
                      Edit Proposal
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funding Progress */}
      {["DIDANAI", "BERJALAN", "SELESAI"].includes(p.status) && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-600" />
                Progress Pendanaan
              </h3>
              <span className="text-lg font-bold text-brand-600">{fundingPct.toFixed(1)}%</span>
            </div>
            <Progress value={fundingPct} color="brand" className="h-3 mb-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Terkumpul: <strong className="text-foreground">{formatRupiah(fundingSecured, true)}</strong>
              </span>
              <span className="text-muted-foreground">
                Target: <strong className="text-foreground">{formatRupiah(fundingTarget, true)}</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader><CardTitle className="text-base">Deskripsi Program</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {p.description}
              </p>
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          {p.budgetBreakdown && Array.isArray(p.budgetBreakdown) && p.budgetBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-brand-600" />
                  Rencana Anggaran (RAB)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 font-medium text-muted-foreground">Komponen</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Volume</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Harga/Satuan</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(p.budgetBreakdown as any[]).map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="p-3">
                          <p className="font-medium">{item.deskripsi}</p>
                          <p className="text-xs text-muted-foreground">{item.kategori}</p>
                        </td>
                        <td className="p-3 text-right">{item.volume} {item.satuan}</td>
                        <td className="p-3 text-right">{formatRupiah(item.hargaSatuan, true)}</td>
                        <td className="p-3 text-right font-semibold">{formatRupiah(item.total, true)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td colSpan={3} className="p-3 text-right">Total</td>
                      <td className="p-3 text-right text-brand-600">{formatRupiah(budgetTotal, true)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Milestones */}
          {p.milestones && p.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Milestone className="h-4 w-4 text-teal-600" />
                  Milestone Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {p.milestones.map((m: any, i: number) => (
                    <div key={m.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                          m.isCompleted ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {m.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        {i < p.milestones.length - 1 && (
                          <div className={cn("w-0.5 flex-1 mt-2", m.isCompleted ? "bg-brand-300" : "bg-muted")} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm">{m.title}</p>
                        {m.description && (
                          <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target: {formatDate(m.targetDate)}
                          {m.isCompleted && m.completedAt && (
                            <span className="text-green-600 ml-1">
                              · Selesai: {formatDate(m.completedAt)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status History */}
          {p.statusHistory && p.statusHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Riwayat Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {p.statusHistory.map((h: any, i: number) => (
                  <div key={h.id} className="flex items-start gap-3 px-5 py-3 border-b last:border-0">
                    <div className="h-2 w-2 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <ProposalStatusBadge status={h.toStatus} />
                        {h.fromStatus && (
                          <span className="text-xs text-muted-foreground">dari {h.fromStatus}</span>
                        )}
                      </div>
                      {h.notes && (
                        <p className="text-xs text-muted-foreground mt-1 bg-muted/50 rounded p-2">
                          {h.notes}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(h.changedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* AI Analysis */}
          {(p.aiCompletionScore || p.aiRiskScore) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  Analisis AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.aiCompletionScore !== null && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Kelengkapan</span>
                      <span className="font-medium">{p.aiCompletionScore?.toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={p.aiCompletionScore}
                      color={p.aiCompletionScore >= 70 ? "brand" : "warning"}
                      className="h-1.5"
                    />
                  </div>
                )}
                {p.aiRiskScore !== null && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Risiko</span>
                      <span className={cn(
                        "font-medium text-xs",
                        p.aiRiskScore < 0.3 ? "text-green-600" :
                        p.aiRiskScore < 0.6 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {p.aiRiskScore < 0.3 ? "Rendah" : p.aiRiskScore < 0.6 ? "Sedang" : "Tinggi"}
                      </span>
                    </div>
                    <Progress
                      value={p.aiRiskScore * 100}
                      color={p.aiRiskScore < 0.3 ? "brand" : p.aiRiskScore < 0.6 ? "warning" : "danger"}
                      className="h-1.5"
                    />
                  </div>
                )}
                {p.aiSummary && (
                  <p className="text-xs text-muted-foreground leading-relaxed border-t pt-2 mt-2">
                    {p.aiSummary}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {p.attachments && p.attachments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Dokumen ({p.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {p.attachments.map((att: any) => (
                  <a
                    key={att.id}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors border-b last:border-0"
                  >
                    <FileText className="h-4 w-4 text-brand-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{att.fileName}</p>
                      <p className="text-[10px] text-muted-foreground">{att.type}</p>
                    </div>
                    <Download className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tanggal Mulai</span>
                <span className="font-medium">{formatDate(p.startDate)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tanggal Selesai</span>
                <span className="font-medium">{formatDate(p.endDate)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Dikirim</span>
                <span className="font-medium">{p.submittedAt ? formatRelativeTime(p.submittedAt) : "-"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Dilihat</span>
                <span className="font-medium">{p.viewCount} kali</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Panel (Admin) */}
      {showReviewPanel && (isAdmin || isVerifikator) && (
        <Card className="border-brand-200">
          <CardHeader>
            <CardTitle className="text-base">Panel Review Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Catatan review (opsional)..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-3">
              <Button
                variant="brand"
                className="gap-2"
                loading={reviewMutation.isPending}
                onClick={() => reviewMutation.mutate({ action: "review", status: "DISETUJUI", notes: reviewNotes })}
              >
                <CheckCircle2 className="h-4 w-4" />
                Setujui
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                loading={reviewMutation.isPending}
                onClick={() => reviewMutation.mutate({ action: "review", status: "MEMBUTUHKAN_REVISI", notes: reviewNotes })}
              >
                <AlertCircle className="h-4 w-4" />
                Minta Revisi
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                loading={reviewMutation.isPending}
                onClick={() => reviewMutation.mutate({ action: "review", status: "DITOLAK", notes: reviewNotes })}
              >
                <XCircle className="h-4 w-4" />
                Tolak
              </Button>
              <Button variant="ghost" onClick={() => setShowReviewPanel(false)}>Batal</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
