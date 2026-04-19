"use client";

import React from "react";
import Link from "next/link";
import {
  FileText, PlusCircle, TrendingUp, DollarSign, Clock, CheckCircle2,
  AlertCircle, ArrowRight, Users, Milestone,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProposalStatusBadge } from "@/components/ui/proposal-status-badge";
import { Progress } from "@/components/ui/progress";
import { formatRupiah, formatDate } from "@/lib/utils";

const MY_PROPOSALS = [
  {
    id: "1", nomor: "CSR-2025-11234", title: "Senior High School Scholarships for 50 Underprivileged Students",
    status: "DIDANAI" as const, amount: 250000000, funded: 250000000,
    company: "PT Sinar Nusantara", updatedAt: "2025-03-15",
  },
  {
    id: "2", nomor: "CSR-2025-11189", title: "Organic Waste Recycling Program",
    status: "DALAM_REVIEW" as const, amount: 180000000, funded: 0,
    company: null, updatedAt: "2025-03-18",
  },
  {
    id: "3", nomor: "CSR-2025-11098", title: "Digital Marketing Training for MSMEs",
    status: "MEMBUTUHKAN_REVISI" as const, amount: 120000000, funded: 0,
    company: null, updatedAt: "2025-03-20",
  },
  {
    id: "4", nomor: "CSR-2025-10987", title: "Rural Community Reading House",
    status: "SELESAI" as const, amount: 90000000, funded: 90000000,
    company: "CV Maju Jaya", updatedAt: "2024-12-01",
  },
];

const ACTIVE_PROJECTS = [
  {
    id: "1", name: "Senior High School Scholarships for 50 Underprivileged Students",
    progress: 65, progressKeuangan: 58, startDate: "2025-01-01",
    endDate: "2025-12-31", nextMilestone: "Semester Exam",
  },
];

const NOTIFICATIONS = [
  { id: "1", type: "success", message: "Proposal CSR-2025-11189 is currently under admin review." },
  { id: "2", type: "warning", message: "Proposal CSR-2025-11098 requires revision. Check the reviewer message." },
  { id: "3", type: "info", message: "The March progress report is ready to be submitted." },
];

export function PengusulDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Proposer Dashboard</h1>
          <p className="section-subtitle">Manage your proposals and track your CSR projects.</p>
        </div>
        <Link href="/pengusul/proposal/buat">
          <Button variant="brand" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Proposal
          </Button>
        </Link>
      </div>

      {NOTIFICATIONS.length > 0 && (
        <div className="space-y-2">
          {NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 rounded-lg p-3 text-sm ${
                notif.type === "success" ? "bg-green-50 text-green-700 border border-green-200" :
                notif.type === "warning" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {notif.type === "success" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" /> :
               notif.type === "warning" ? <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /> :
               <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />}
              {notif.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Proposals" value="4" icon={FileText} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Approved / Funded" value="2" icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Funds Received" value="Rp 340jt" icon={DollarSign} iconColor="text-teal-600" iconBg="bg-teal-50" />
        <StatCard title="Beneficiaries" value="2,400" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">My Proposals</CardTitle>
            <Link href="/pengusul/proposal" className="text-xs text-brand-600 hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {MY_PROPOSALS.map((p) => (
              <div key={p.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs text-muted-foreground font-mono">{p.nomor}</span>
                      <ProposalStatusBadge status={p.status} />
                    </div>
                    <p className="font-medium text-sm">{p.title}</p>
                    {p.company && (
                      <p className="text-xs text-muted-foreground mt-1">Funded by: {p.company}</p>
                    )}
                    {p.status === "MEMBUTUHKAN_REVISI" && (
                      <Link href={`/pengusul/proposal/${p.id}`}>
                        <Badge variant="warning" className="mt-2 cursor-pointer">
                          Action needed - View revisions
                        </Badge>
                      </Link>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold">{formatRupiah(p.amount, true)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated: {formatDate(p.updatedAt, "dd MMM yyyy")}
                    </p>
                    <Link href={`/pengusul/proposal/${p.id}`}>
                      <Button variant="ghost" size="sm" className="mt-1 gap-1 text-xs h-7">
                        Details <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-600" />
            Ongoing Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ACTIVE_PROJECTS.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No active projects yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {ACTIVE_PROJECTS.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{project.name}</p>
                    <Link href={`/pengusul/proyek/${project.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        Details <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Physical Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} color="brand" className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Fund Realization</span>
                        <span className="font-semibold">{project.progressKeuangan}%</span>
                      </div>
                      <Progress value={project.progressKeuangan} color="teal" className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Milestone className="h-3.5 w-3.5" />
                    <span>Next milestone: <strong>{project.nextMilestone}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
