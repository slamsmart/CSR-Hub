"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PlusCircle, Search, SlidersHorizontal,
  FileText, ArrowUpRight, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProposalStatusBadge } from "@/components/ui/proposal-status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Progress } from "@/components/ui/progress";
import { formatRupiah, formatDate, buildQueryString, cn } from "@/lib/utils";
import { ProposalStatus, ProposalCategory } from "@prisma/client";
import { getCategoryLabels, getProposalStatusLabels } from "@/types";
import { useSession } from "next-auth/react";
import { useLanguage, useStructureCopy } from "@/components/providers/language-provider";

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
  if (!res.ok) throw new Error("Failed to load proposals");
  return res.json();
}

export function ProposalListPage() {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const copy = useStructureCopy();
  const proposalStatusLabels = getProposalStatusLabels(language);
  const categoryLabels = getCategoryLabels(language);
  const statusFilters = [
    { value: "", label: copy.dashboard.allStatuses },
    ...Object.entries(proposalStatusLabels).map(([k, v]) => ({ value: k, label: v })),
  ];
  const categoryFilters = [
    { value: "", label: copy.dashboard.allCategories },
    ...Object.entries(categoryLabels).map(([k, v]) => ({ value: k, label: v })),
  ];

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
  const isAdmin = !!session?.user && ["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR", "AUDITOR"].includes(userRole!);
  const isCompany = userRole === "PERUSAHAAN";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="section-title">
            {isAdmin ? copy.dashboard.allProposalsTitle : isCompany ? copy.dashboard.incomingProposalsTitle : copy.dashboard.proposalListTitle}
          </h1>
          {meta && <p className="section-subtitle">{meta.total} {copy.dashboard.proposalsFound}</p>}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            {copy.dashboard.refresh}
          </Button>
          {userRole === "PENGUSUL" && (
            <Link href="/pengusul/proposal/buat">
              <Button variant="brand" size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {copy.dashboard.createProposal}
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={copy.dashboard.searchProposals}
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex-shrink-0 gap-2" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
            {copy.dashboard.filter}
            {(filters.status || filters.category || filters.provinsi) && (
              <Badge variant="brand" className="flex h-4 w-4 items-center justify-center p-0 text-[10px]">
                !
              </Badge>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{copy.dashboard.status}</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
              >
                {statusFilters.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{copy.dashboard.category}</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
              >
                {categoryFilters.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{copy.dashboard.province}</label>
              <Input
                placeholder={copy.dashboard.searchProvince}
                className="h-9 text-sm"
                value={filters.provinsi}
                onChange={(e) => updateFilter("provinsi", e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setFilters({ search: "", status: "", category: "", provinsi: "", page: 1 })}
              >
                {copy.dashboard.resetFilter}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {["", "DRAFT", "DIKIRIM", "DALAM_REVIEW", "DISETUJUI", "DIDANAI", "BERJALAN"].map((s) => (
          <button
            key={s}
            onClick={() => updateFilter("status", s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              filters.status === s ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {s === "" ? copy.dashboard.all : proposalStatusLabels[s as ProposalStatus]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-5 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="mt-4 h-2 w-full rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <FileText className="mx-auto mb-3 h-12 w-12 opacity-20" />
          <p className="font-medium">{copy.dashboard.noProposals}</p>
          <p className="mt-1 text-sm">{copy.dashboard.adjustSearch}</p>
          {userRole === "PENGUSUL" && (
            <Link href="/pengusul/proposal/buat">
              <Button variant="brand" className="mt-4 gap-2">
                <PlusCircle className="h-4 w-4" />
                {copy.dashboard.createFirstProposal}
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((p: any) => (
            <ProposalCard key={p.id} proposal={p} isCompany={!!isCompany} categoryLabels={categoryLabels} />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPrev}
            onClick={() => updateFilter("page", filters.page - 1)}
          >
            {copy.dashboard.previous}
          </Button>
          <span className="px-4 text-sm text-muted-foreground">
            {copy.dashboard.pageOf.replace("{page}", String(meta.page)).replace("{total}", String(meta.totalPages))}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNext}
            onClick={() => updateFilter("page", filters.page + 1)}
          >
            {copy.dashboard.next}
          </Button>
        </div>
      )}
    </div>
  );
}

function ProposalCard({
  proposal: p,
  isCompany,
  categoryLabels,
}: {
  proposal: any;
  isCompany: boolean;
  categoryLabels: Record<ProposalCategory, string>;
}) {
  const { language } = useLanguage();
  const copy = useStructureCopy();
  const fundingPct = p.fundingTarget > 0 ? Math.min(100, (Number(p.fundingSecured) / Number(p.fundingTarget)) * 100) : 0;

  return (
    <Card hover className="overflow-hidden">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{p.nomor}</span>
              <ProposalStatusBadge status={p.status} />
              {p.aiMatchScore && isCompany && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold",
                    p.aiMatchScore >= 80 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}
                >
                  {p.aiMatchScore}% {copy.dashboard.match}
                </span>
              )}
            </div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{p.title}</h3>
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.summary}</p>

        {p.organization && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {p.organization.name.charAt(0)}
            </div>
            <span className="truncate text-xs text-muted-foreground">{p.organization.name}</span>
            {p.organization.verificationStatus === "TERVERIFIKASI" && (
              <VerificationBadge status="TERVERIFIKASI" showLabel={false} size="sm" />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">{copy.dashboard.budget}</span>
            <p className="font-semibold text-brand-600">{formatRupiah(Number(p.budgetTotal), true)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{copy.dashboard.beneficiaries}</span>
            <p className="font-semibold">
              {(p.targetBeneficiaries || 0).toLocaleString("id-ID")} {language === "en" ? "people" : "orang"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px]">{p.provinsi}</Badge>
          <Badge variant="brand" className="text-[10px]">
            {categoryLabels[p.category as ProposalCategory] || p.category}
          </Badge>
        </div>

        {["DIDANAI", "BERJALAN", "SELESAI"].includes(p.status) && (
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">{copy.dashboard.funding}</span>
              <span className="font-medium">{fundingPct.toFixed(0)}%</span>
            </div>
            <Progress value={fundingPct} color="brand" className="h-1.5" />
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-1">
          <span className="text-xs text-muted-foreground">{formatDate(p.createdAt, "dd MMM yyyy")}</span>
          <Link href={`/proposals/${p.id}`}>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              {copy.dashboard.detail} <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
