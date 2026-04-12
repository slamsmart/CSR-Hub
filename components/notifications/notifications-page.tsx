"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell, CheckCheck, Filter, Trash2, FileText, CheckCircle2,
  AlertTriangle, Info, DollarSign, Users, Megaphone, ArrowRight,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NOTIFICATION_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  PROPOSAL_DIKIRIM: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  PROPOSAL_DISETUJUI: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  PROPOSAL_DITOLAK: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  PROPOSAL_PERLU_REVISI: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  PROPOSAL_DIDANAI: { icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50" },
  LAPORAN_JATUH_TEMPO: { icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  MILESTONE_SELESAI: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  VERIFIKASI_SELESAI: { icon: CheckCircle2, color: "text-brand-600", bg: "bg-brand-50" },
  MATCH_BARU: { icon: Megaphone, color: "text-brand-600", bg: "bg-brand-50" },
  COFUNDING_UNDANGAN: { icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
  PESAN_BARU: { icon: Bell, color: "text-purple-600", bg: "bg-purple-50" },
  SISTEM: { icon: Info, color: "text-gray-600", bg: "bg-gray-50" },
};

const DUMMY_NOTIFICATIONS = [
  {
    id: "n1",
    type: "PROPOSAL_DISETUJUI",
    title: "Proposal Disetujui",
    message: "Proposal 'Beasiswa SMA untuk 50 Pelajar' (CSR-2025-00023) telah disetujui oleh admin platform. Proposal Anda akan segera dikurasi ke perusahaan mitra.",
    isRead: false,
    link: "/proposals/p1",
    createdAt: "2025-04-10T08:30:00Z",
  },
  {
    id: "n2",
    type: "LAPORAN_JATUH_TEMPO",
    title: "Laporan Bulanan Jatuh Tempo",
    message: "Laporan bulanan April 2025 untuk proyek 'Beasiswa SMA' jatuh tempo dalam 3 hari (15 April 2025). Segera submit laporan Anda.",
    isRead: false,
    link: "/pengusul/proyek",
    createdAt: "2025-04-10T07:00:00Z",
  },
  {
    id: "n3",
    type: "MATCH_BARU",
    title: "4 Proposal Baru Tercocok",
    message: "AI kami menemukan 4 proposal baru yang sesuai dengan profil CSR perusahaan Anda dengan skor di atas 80%. Lihat rekomendasi terbaru.",
    isRead: false,
    link: "/perusahaan/matching",
    createdAt: "2025-04-09T14:00:00Z",
  },
  {
    id: "n4",
    type: "COFUNDING_UNDANGAN",
    title: "Undangan Co-Funding",
    message: "PT Semen Indonesia mengundang Anda bergabung dalam co-funding program 'Revitalisasi 20 Sekolah di NTT' dengan target Rp 1,5M.",
    isRead: false,
    link: "/perusahaan/cofunding",
    createdAt: "2025-04-09T10:30:00Z",
  },
  {
    id: "n5",
    type: "VERIFIKASI_SELESAI",
    title: "Verifikasi Organisasi Selesai",
    message: "Yayasan Cerdas Nusantara telah berhasil diverifikasi. Status organisasi kini adalah TERVERIFIKASI dan dapat mengajukan proposal.",
    isRead: true,
    link: "/pengaturan",
    createdAt: "2025-04-08T16:45:00Z",
  },
  {
    id: "n6",
    type: "PROPOSAL_PERLU_REVISI",
    title: "Proposal Perlu Revisi",
    message: "Proposal 'Program Kesehatan Komunitas' memerlukan revisi dokumen. Admin: 'Mohon lampirkan surat rekomendasi dari dinas kesehatan setempat.'",
    isRead: true,
    link: "/proposals/p5",
    createdAt: "2025-04-08T11:20:00Z",
  },
  {
    id: "n7",
    type: "MILESTONE_SELESAI",
    title: "Milestone Selesai Dikonfirmasi",
    message: "Milestone 'Penyaluran Dana Semester 1' pada proyek Beasiswa SMA telah dikonfirmasi selesai oleh verifikator.",
    isRead: true,
    link: "/pengusul/proyek",
    createdAt: "2025-04-07T09:00:00Z",
  },
  {
    id: "n8",
    type: "SISTEM",
    title: "Pembaruan Kebijakan Platform",
    message: "CSR Hub v2.5 telah dirilis dengan fitur baru: laporan sustainability otomatis, peningkatan AI matching, dan dashboard impact terbaru.",
    isRead: true,
    link: "#",
    createdAt: "2025-04-05T10:00:00Z",
  },
];

type FilterType = "semua" | "belum_dibaca" | "proposal" | "proyek" | "sistem";

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "belum_dibaca", label: "Belum Dibaca" },
  { key: "proposal", label: "Proposal" },
  { key: "proyek", label: "Proyek" },
  { key: "sistem", label: "Sistem" },
];

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>("semua");
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function deleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notifications.filter((n) => {
    if (filter === "belum_dibaca") return !n.isRead;
    if (filter === "proposal") return n.type.startsWith("PROPOSAL") || n.type === "MATCH_BARU" || n.type === "COFUNDING_UNDANGAN";
    if (filter === "proyek") return n.type.startsWith("MILESTONE") || n.type === "LAPORAN_JATUH_TEMPO";
    if (filter === "sistem") return n.type === "SISTEM" || n.type === "VERIFIKASI_SELESAI";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifikasi
            {unreadCount > 0 && (
              <Badge variant="brand" className="text-xs">{unreadCount} baru</Badge>
            )}
          </h1>
          <p className="section-subtitle">Informasi terkini terkait proposal, proyek, dan aktivitas platform.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              filter === opt.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Tidak ada notifikasi</p>
            <p className="text-sm mt-1">Semua notifikasi sudah terbaca atau tidak ada notifikasi baru.</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const config = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.SISTEM;
            const Icon = config.icon;

            return (
              <Card
                key={notif.id}
                className={cn(
                  "transition-all",
                  !notif.isRead && "border-brand-200 bg-brand-50/30"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Unread indicator */}
                    <div className="flex-shrink-0 pt-1 relative">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        config.bg
                      )}>
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>
                      {!notif.isRead && (
                        <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-600 border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn("text-sm font-semibold", notif.isRead && "font-medium")}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {notif.link && notif.link !== "#" && (
                          <Link href={notif.link}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 text-xs text-brand-600 hover:text-brand-700"
                              onClick={() => markRead(notif.id)}
                            >
                              Lihat Detail <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                        {!notif.isRead && (
                          <button
                            onClick={() => markRead(notif.id)}
                            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Tandai dibaca
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(notif.id)}
                          className="ml-auto text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
