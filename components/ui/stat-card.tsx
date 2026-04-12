import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-brand-600",
  iconBg = "bg-brand-50",
  trend,
  className,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span
                  className={cn(
                    "font-medium",
                    trend.positive ? "text-green-600" : "text-red-500"
                  )}
                >
                  {trend.positive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-xl p-3", iconBg)}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
