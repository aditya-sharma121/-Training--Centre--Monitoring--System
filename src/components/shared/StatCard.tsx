import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "danger";
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendUp = true,
  icon: Icon,
  variant = "primary",
}: StatCardProps) {
  const iconColors = {
    primary: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <h4 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </h4>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span
                  className={clsx(
                    "font-semibold",
                    trendUp ? "text-emerald-600" : "text-rose-600"
                  )}
                >
                  {trendUp ? "↑" : "↓"} {trend}
                </span>
                <span className="text-slate-400">vs last month</span>
              </div>
            )}
          </div>
          <div className={clsx("rounded-xl p-3", iconColors[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
