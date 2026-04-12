"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ProposalWizardData } from "./proposal-wizard";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompletenessIndicator() {
  const { watch } = useFormContext<ProposalWizardData>();
  const data = watch();

  const checks = [
    { weight: 10, passed: (data.title?.length || 0) >= 20 },
    { weight: 10, passed: (data.summary?.length || 0) >= 100 },
    { weight: 15, passed: (data.description?.length || 0) >= 300 },
    { weight: 8,  passed: !!data.category },
    { weight: 8,  passed: (data.sdgTags?.length || 0) >= 1 },
    { weight: 8,  passed: !!data.provinsi },
    { weight: 8,  passed: (data.targetBeneficiaries || 0) > 0 },
    { weight: 5,  passed: (data.jenisManfaat?.length || 0) > 0 },
    { weight: 15, passed: (data.budgetBreakdown?.length || 0) >= 1 },
    { weight: 8,  passed: !!data.startDate && !!data.endDate },
    { weight: 5,  passed: (data.milestones?.length || 0) >= 1 },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earned / totalWeight) * 100);

  const level =
    score >= 90 ? { label: "Sangat Baik", color: "text-green-600", bar: "brand" as const } :
    score >= 70 ? { label: "Baik", color: "text-teal-600", bar: "teal" as const } :
    score >= 50 ? { label: "Cukup", color: "text-amber-600", bar: "warning" as const } :
    { label: "Perlu Dilengkapi", color: "text-red-500", bar: "danger" as const };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <span className="text-sm font-medium">Kelengkapan Proposal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-bold", level.color)}>{level.label}</span>
          <span className="text-lg font-bold tabular-nums">{score}%</span>
        </div>
      </div>
      <Progress value={score} color={level.bar} className="h-2" />
      {score < 70 && (
        <p className="text-xs text-muted-foreground mt-2">
          Lengkapi proposal Anda untuk meningkatkan peluang pendanaan. Skor ≥70% sangat direkomendasikan.
        </p>
      )}
    </div>
  );
}
