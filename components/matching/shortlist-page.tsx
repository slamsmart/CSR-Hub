"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Trash2, FileText, DollarSign, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/types";
import { ProposalCategory } from "@prisma/client";

const DUMMY_SHORTLIST = [
  {
    id: "s1",
    proposalId: "p1",
    nomor: "CSR-2025-00045",
    title: "Beasiswa SMA untuk 500 Pelajar di Wilayah 3T Papua",
    organization: "Yayasan Pendidikan Timur Indonesia",
    orgVerified: "TERVERIFIKASI",
    province: "Papua",
    category: "PENDIDIKAN",
    budgetTotal: 1200000000,
    targetBeneficiaries: 500,
    matchScore: 94,
    status: "DIKIRIM",
    savedAt: "2025-04-08",
    notes: "Sangat sesuai dengan fokus CSR pendidikan di Papua",
  },
  {
    id: "s2",
    proposalId: "p3",
    nomor: "CSR-2025-00089",
    title: "Pelatihan Teknologi Digital untuk 1.000 Pemuda Kalimantan",
    organization: "Komunitas Coding Borneo",
    orgVerified: "TERVERIFIKASI",
    province: "Kalimantan Timur",
    category: "TEKNOLOGI",
    budgetTotal: 600000000,
    targetBeneficiaries: 1000,
    matchScore: 82,
    status: "DIKIRIM",
    savedAt: "2025-04-07",
    notes: "",
  },
];

export function ShortlistPage() {
  const [shortlist, setShortlist] = useState(DUMMY_SHORTLIST);

  function removeFromShortlist(id: string) {
    setShortlist((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-400" />
            Shortlist Proposal
          </h1>
          <p className="section-subtitle">{shortlist.length} proposal yang telah Anda simpan.</p>
        </div>
        <Link href="/perusahaan/matching">
          <Button variant="brand" className="gap-2">
            Temukan Lebih Banyak
          </Button>
        </Link>
      </div>

      {shortlist.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
          <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Shortlist kosong</p>
          <p className="text-sm mt-1">Simpan proposal dari halaman AI Matching untuk membandingkan.</p>
          <Link href="/perusahaan/matching">
            <Button variant="brand" className="mt-4">Jelajahi AI Matching</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {shortlist.map((item) => (
            <Card key={item.id} hover className="overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{item.nomor}</span>
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      item.matchScore >= 85 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {item.matchScore}% Match
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.organization}</span>
                    <VerificationBadge status={item.orgVerified as any} showLabel={false} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />{formatRupiah(item.budgetTotal, true)}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />{item.targetBeneficiaries.toLocaleString("id-ID")} orang
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />{item.province}
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-[10px]">
                      {CATEGORY_LABELS[item.category as ProposalCategory] || item.category}
                    </Badge>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-muted-foreground italic bg-muted/40 rounded-lg px-3 py-2">
                    Catatan: {item.notes}
                  </p>
                )}

                <div className="flex gap-2 pt-1 border-t items-center justify-between">
                  <span className="text-xs text-muted-foreground">Disimpan {formatDate(item.savedAt)}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeFromShortlist(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Link href={`/proposals/${item.proposalId}`}>
                      <Button variant="brand" size="sm" className="h-8 gap-1 text-xs">
                        Detail <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
