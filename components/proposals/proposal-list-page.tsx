"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PlusCircle, Search, Filter, SlidersHorizontal,
  FileText, ArrowUpRight, Download, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProposalStatusBadge } from "@/components/ui/proposal-status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Progress } from "@/components/ui/progress";
import { formatRupiah, formatDate, buildQueryString } from "@/lib/utils";
import { ProposalStatus, ProposalCategory } from "@prisma/client";
import { CATEGORY_LABELS, PROPOSAL_STATUS_LABELS } from "@/types";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Semua Status" },
  ...Object.entries(PROPOSAL_STATUS_LABELS).map(([k, v]) => ({ value: k, label: v })),
];

const CATEGORY_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Semua Kategori" },
  ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v })),
];

interface ProposalFilters {
  search: string;
  status: string;
  category: string;
  provinsi: string;
  page: number;
}

async function fetchProposals(filters: ProposalFilters) {
  const qs = buildQueryString({ ...filters, limit: 12 });
  const res = await fetch(`/api/proposals?${qs}`);
  if (!res.ok) throw new Error("Gagal memuat proposal");
  return res.json();
}

export function ProposalListPage() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState<ProposalFilters>({
    search: "", status: "", category: "", provinsi: "", page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["proposals", filters],
    queryFn: () => fetchProposals(filters),
  });

  const proposals = data?.data || [];
  const meta = data?.meta;

  function updateFilter(key: keyof ProposalFilters, value: string | number) {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== "page" ? 1 : (value as number) }));
  }

  const userRole = (session?.user as any)?.role as string | undefined;
  const isAdmin = session?.user && ["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR", "AUDITOR"].includes(userRole!);
  const isCompany = userRole === "PERUSAHAAN";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">
            {isAdmin ? "Semua Proposal" : isCompany ? "Proposal Masuk" : "Proposal Saya"}
          </h1>
          {meta && (
            <p className="section-subtitle">
              {meta.total} proposal ditemukan
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
          {userRole === "PENGUSUL" && (
            <Link href="/pengusul/proposal/buat">
              <Button variant="brand" size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Buat Proposal
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul proposal, nomor, atau organisasi..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="gap-2 flex-shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {(filters.status || filters.category || filters.provinsi) && (
              <Badge variant="brand" className="h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl border bg-card">
            {/* Status */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            {/* Category */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
              >
                {CATEGORY_FILTERS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            {/* Provinsi */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Provinsi</label>
              <Input
                placeholder="Cari provinsi..."
                className="h-9 text-sm"
                value={filters.provinsi}
                onChange={(e) => updateFilter("provinsi", e.target.value)}
              />
            </div>
            {/* Reset */}
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setFilters({ search: "", status: "", category: "", provinsi: "", page: 1 })}
              >
                Reset Filter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Status Pills */}
      <div className="flex gap-2 flex-wrap">
        {["", "DRAFT", "DIKIRIM", "DALAM_REVIEW", "DISETUJUI", "DIDANAI", "BERJALAN"].map((s) => (
          <button
            key={s}
            onClick={() => updateFilter("status", s)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              filters.status === s
                ? "bg-brand-600 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {s === "" ? "Semua" : PROPOSAL_STATUS_LABELS[s as ProposalStatus]}
          </button>
        ))}
      </div>

      {/* Proposal Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-2 bg-muted rounded w-full mt-4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Tidak ada proposal ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter pencarian Anda</p>
          {userRole === "PENGUSUL" && (
            <Link href="/pengusul/proposal/buat">
              <Button variant="brand" className="mt-4 gap-2">
                <PlusCircle className="h-4 w-4" />
                Buat Proposal Pertama
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p: any) => (
            <ProposalCard key={p.id} proposal={p} isCompany={!!isCompany} isAdmin={!!isAdmin} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPrev}
            onClick={() => updateFilter("page", filters.page - 1)}
          >
            ← Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Halaman {meta.page} dari {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNext}
            onClick={() => updateFilter("page", filters.page + 1)}
          >
            Berikutnya →
          </Button>
        </div>
      )}
    </div>
  );
}

function ProposalCard({ proposal: p, isCompany, isAdmin }: { proposal: any; isCompany: boolean; isAdmin: boolean }) {
  const fundingPct = p.fundingTarget > 0
    ? Math.min(100, (Number(p.fundingSecured) / Number(p.fundingTarget)) * 100)
    : 0;

  return (
    <Card hover className="overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono">{p.nomor}</span>
              <ProposalStatusBadge status={p.status} />
              {p.aiMatchScore && isCompany && (
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  p.aiMatchScore >= 80 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}>
                  {p.aiMatchScore}% Match
                </span>
              )}
            </div>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2">{p.title}</h3>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {p.summary}
        </p>

        {/* Org */}
        {p.organization && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold flex-shrink-0">
              {p.organization.name.charAt(0)}
            </div>
            <span className="text-xs text-muted-foreground truncate">{p.organization.name}</span>
            {p.organization.verificationStatus === "TERVERIFIKASI" && (
              <VerificationBadge status="TERVERIFIKASI" showLabel={false} size="sm" />
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Anggaran</span>
            <p className="font-semibold text-brand-600">{formatRupiah(Number(p.budgetTotal), true)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Penerima</span>
            <p className="font-semibold">{(p.targetBeneficiaries || 0).toLocaleString("id-ID")} orang</p>
          </div>
        </div>

        {/* Provinsi + Category */}
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-[10px]">{p.provinsi}</Badge>
          <Badge variant="brand" className="text-[10px]">
            {CATEGORY_LABELS[p.category as ProposalCategory] || p.category}
          </Badge>
        </div>

        {/* Funding Progress (for funded proposals) */}
        {["DIDANAI", "BERJALAN", "SELESAI"].includes(p.status) && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Pendanaan</span>
              <span className="font-medium">{fundingPct.toFixed(0)}%</span>
            </div>
            <Progress value={fundingPct} color="brand" className="h-1.5" />
          </div>
        )}

        {/* Footer */}
        <div className="pt-1 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(p.createdAt, "dd MMM yyyy")}
          </span>
          <Link href={`/proposals/${p.id}`}>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Detail <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
