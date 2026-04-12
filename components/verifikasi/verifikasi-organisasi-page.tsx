"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield, CheckCircle2, XCircle, Clock, FileText, AlertTriangle,
  Building2, User, Phone, Mail, MapPin, ExternalLink, Download,
  Eye, ThumbsUp, ThumbsDown, RotateCcw, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DUMMY_ORGS = [
  {
    id: "org1",
    name: "Yayasan Cerdas Nusantara",
    type: "NGO",
    email: "admin@cerdas-nusantara.org",
    phone: "021-55512345",
    address: "Jl. Pendidikan No. 12, Jakarta Selatan",
    province: "DKI Jakarta",
    verificationStatus: "MENUNGGU_REVIEW",
    submittedAt: "2025-03-28T10:00:00Z",
    npwp: "12.345.678.9-012.345",
    akta: "AHU-2019.00012345",
    website: "https://cerdas-nusantara.org",
    contactPerson: "Dr. Siti Rahayu",
    contactRole: "Ketua Yayasan",
    description: "Yayasan yang bergerak di bidang pendidikan untuk anak-anak kurang mampu di wilayah 3T Indonesia.",
    documents: [
      { id: "d1", type: "AKTA_PENDIRIAN", name: "Akta Pendirian Yayasan.pdf", uploadedAt: "2025-03-27", verified: null },
      { id: "d2", type: "NPWP", name: "NPWP Organisasi.pdf", uploadedAt: "2025-03-27", verified: null },
      { id: "d3", type: "SK_KEMENKUMHAM", name: "SK Kemenkumham.pdf", uploadedAt: "2025-03-27", verified: null },
      { id: "d4", type: "REKENING_KORAN", name: "Rekening Koran 3 Bulan.pdf", uploadedAt: "2025-03-27", verified: null },
      { id: "d5", type: "PROFIL_ORGANISASI", name: "Company Profile.pdf", uploadedAt: "2025-03-27", verified: null },
    ],
    checklistItems: [
      { key: "akta", label: "Akta pendirian/perubahan terakhir", checked: false },
      { key: "npwp", label: "NPWP organisasi aktif", checked: false },
      { key: "sk_menkumham", label: "SK Kemenkumham atau izin operasional", checked: false },
      { key: "rekening", label: "Rekening koran 3 bulan terakhir", checked: false },
      { key: "profil", label: "Profil & portofolio program sebelumnya", checked: false },
      { key: "struktur", label: "Struktur organisasi terkini", checked: false },
      { key: "laporan", label: "Laporan keuangan tahun terakhir (opsional)", checked: false },
    ],
    previousProjects: 3,
    totalFundingHistory: 450000000,
    riskScore: 25,
  },
  {
    id: "org2",
    name: "PT Inovasi Digital Mandiri",
    type: "PERUSAHAAN",
    email: "csr@inovasi-digital.co.id",
    phone: "021-99987654",
    address: "Gedung Inovasi Lt. 5, Jl. Sudirman No. 88, Jakarta Pusat",
    province: "DKI Jakarta",
    verificationStatus: "DALAM_REVIEW",
    submittedAt: "2025-03-25T09:30:00Z",
    npwp: "98.765.432.1-001.000",
    website: "https://inovasi-digital.co.id",
    contactPerson: "Budi Hartono",
    contactRole: "Head of CSR",
    description: "Perusahaan teknologi yang berkomitmen pada pengembangan ekosistem digital inklusif di Indonesia.",
    documents: [
      { id: "d6", type: "SIUP", name: "SIUP Perusahaan.pdf", uploadedAt: "2025-03-24", verified: true },
      { id: "d7", type: "NPWP", name: "NPWP Perusahaan.pdf", uploadedAt: "2025-03-24", verified: true },
      { id: "d8", type: "TDP", name: "TDP/NIB.pdf", uploadedAt: "2025-03-24", verified: null },
      { id: "d9", type: "LAPORAN_KEUANGAN", name: "Laporan Keuangan 2024.pdf", uploadedAt: "2025-03-24", verified: null },
    ],
    checklistItems: [
      { key: "siup", label: "SIUP/TDP/NIB aktif", checked: true },
      { key: "npwp", label: "NPWP perusahaan valid", checked: true },
      { key: "akta", label: "Akta pendirian perusahaan", checked: false },
      { key: "laporan", label: "Laporan keuangan 2 tahun terakhir", checked: false },
      { key: "profil", label: "Company profile & CSR policy", checked: false },
    ],
    previousProjects: 0,
    totalFundingHistory: 0,
    riskScore: 15,
  },
];

export function VerifikasiOrganisasiPage() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [checklists, setChecklists] = useState<Record<string, Record<string, boolean>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<string>("");

  const org = DUMMY_ORGS.find((o) => o.id === selectedOrg);

  const checkedCount = org
    ? Object.values(checklists[org.id] || {}).filter(Boolean).length +
      org.checklistItems.filter((i) => i.checked).length
    : 0;

  const totalItems = org ? org.checklistItems.length : 0;
  const reviewProgress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  function toggleCheck(orgId: string, key: string) {
    setChecklists((prev) => ({
      ...prev,
      [orgId]: {
        ...prev[orgId],
        [key]: !(prev[orgId]?.[key] ?? false),
      },
    }));
  }

  const pendingCount = DUMMY_ORGS.filter((o) => o.verificationStatus === "MENUNGGU_REVIEW").length;
  const reviewCount = DUMMY_ORGS.filter((o) => o.verificationStatus === "DALAM_REVIEW").length;

  const filtered = statusFilter
    ? DUMMY_ORGS.filter((o) => o.verificationStatus === statusFilter)
    : DUMMY_ORGS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-title">Verifikasi Organisasi</h1>
        <p className="section-subtitle">Tinjau dan verifikasi dokumen kelayakan organisasi.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Menunggu Review" value={pendingCount} icon={Clock} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        <StatCard title="Dalam Review" value={reviewCount} icon={Eye} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Terverifikasi (Bulan Ini)" value="8" icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Ditolak (Bulan Ini)" value="2" icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Org List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {["", "MENUNGGU_REVIEW", "DALAM_REVIEW", "TERVERIFIKASI", "DITOLAK"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
                  statusFilter === s
                    ? "bg-brand-600 text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {s === "" ? "Semua" : s.replace("_", " ")}
              </button>
            ))}
          </div>

          {filtered.map((o) => (
            <Card
              key={o.id}
              className={cn(
                "cursor-pointer transition-all",
                selectedOrg === o.id ? "border-brand-400 shadow-md" : "hover:border-brand-200"
              )}
              onClick={() => setSelectedOrg(o.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {o.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm truncate">{o.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{o.type} · {o.province}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <VerificationBadge status={o.verificationStatus as any} size="sm" />
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(o.submittedAt)}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-3">
          {!org ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-2xl">
              <Shield className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium">Pilih organisasi untuk direview</p>
              <p className="text-sm mt-1">Klik salah satu organisasi di panel kiri</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Org Profile */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {org.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{org.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{org.type}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{org.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{org.phone}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{org.province}</span>
                        </div>
                      </div>
                    </div>
                    <VerificationBadge status={org.verificationStatus as any} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{org.description}</p>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-lg font-bold">{org.previousProjects}</p>
                      <p className="text-xs text-muted-foreground">Proyek Sebelumnya</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-lg font-bold text-brand-600">{org.npwp}</p>
                      <p className="text-xs text-muted-foreground">NPWP</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className={cn(
                        "text-lg font-bold",
                        org.riskScore < 30 ? "text-green-600" : org.riskScore < 60 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {org.riskScore}/100
                      </p>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Checklist */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">KYC Checklist</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <Progress value={reviewProgress} color="brand" className="w-24 h-2" />
                      <span className="font-medium text-muted-foreground">{reviewProgress}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {org.checklistItems.map((item) => {
                    const isChecked = checklists[org.id]?.[item.key] ?? item.checked;
                    return (
                      <label
                        key={item.key}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                          isChecked ? "bg-green-50 border-green-200" : "hover:bg-muted/30"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(org.id, item.key)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className={cn("text-sm", isChecked && "line-through text-muted-foreground")}>
                          {item.label}
                        </span>
                        {isChecked && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
                      </label>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Dokumen Diunggah</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {org.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border">
                      <FileText className="h-8 w-8 text-brand-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} · {formatDate(doc.uploadedAt)}</p>
                      </div>
                      {doc.verified === true && <Badge variant="success">Valid</Badge>}
                      {doc.verified === false && <Badge variant="destructive">Ditolak</Badge>}
                      {doc.verified === null && <Badge variant="warning">Belum Dicek</Badge>}
                      <Button variant="ghost" size="icon-sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reviewer Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Catatan Verifikator</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Tuliskan catatan hasil review, temuan, atau alasan keputusan..."
                    className="w-full h-24 p-3 rounded-xl border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={notes[org.id] || ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [org.id]: e.target.value }))}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                  <RotateCcw className="h-4 w-4" />
                  Minta Dokumen Tambahan
                </Button>
                <Button variant="outline" className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50">
                  <ThumbsDown className="h-4 w-4" />
                  Tolak
                </Button>
                <Button variant="brand" className="flex-1 gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Verifikasi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
