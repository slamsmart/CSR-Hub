import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationStatus } from "@prisma/client";
import { VERIFICATION_STATUS_LABELS } from "@/types";

interface VerificationBadgeProps {
  status: VerificationStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerificationBadge({
  status,
  showLabel = true,
  size = "md",
  className,
}: VerificationBadgeProps) {
  const config = {
    TERVERIFIKASI: {
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      label: "Terverifikasi",
    },
    MENUNGGU_REVIEW: {
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      label: "Menunggu Review",
    },
    DALAM_REVIEW: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
      label: "Dalam Review",
    },
    MEMBUTUHKAN_DOKUMEN_TAMBAHAN: {
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
      label: "Perlu Dokumen",
    },
    DITOLAK: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      label: "Ditolak",
    },
    DICABUT: {
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50 border-red-200",
      label: "Dicabut",
    },
    BELUM_DIAJUKAN: {
      icon: AlertCircle,
      color: "text-gray-500",
      bg: "bg-gray-50 border-gray-200",
      label: "Belum Diajukan",
    },
  }[status] || {
    icon: AlertCircle,
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
    label: status,
  };

  const sizeClass = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  }[size];

  const iconSize = { sm: "h-3 w-3", md: "h-3.5 w-3.5", lg: "h-4 w-4" }[size];
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <span title={VERIFICATION_STATUS_LABELS[status]}>
        <Icon className={cn(iconSize, config.color, className)} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        sizeClass,
        config.bg,
        config.color,
        className
      )}
    >
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}
