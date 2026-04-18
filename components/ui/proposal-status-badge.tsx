import React from "react";
import { cn } from "@/lib/utils";
import { ProposalStatus } from "@prisma/client";
import { getProposalStatusLabels } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";

interface ProposalStatusBadgeProps {
  status: ProposalStatus;
  className?: string;
}

const STATUS_CONFIG: Record<ProposalStatus, { bg: string; dot: string }> = {
  DRAFT: { bg: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  DIKIRIM: { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  DALAM_REVIEW: { bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  MEMBUTUHKAN_REVISI: { bg: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  DISETUJUI: { bg: "bg-green-100 text-green-700", dot: "bg-green-500" },
  DITOLAK: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  DIDANAI: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  BERJALAN: { bg: "bg-teal-100 text-teal-700", dot: "bg-teal-500" },
  SELESAI: { bg: "bg-brand-100 text-brand-700", dot: "bg-brand-500" },
  DIBATALKAN: { bg: "bg-gray-100 text-gray-700", dot: "bg-gray-500" },
};

export function ProposalStatusBadge({ status, className }: ProposalStatusBadgeProps) {
  const { language } = useLanguage();
  const labels = getProposalStatusLabels(language);
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.bg,
      className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {labels[status]}
    </span>
  );
}
