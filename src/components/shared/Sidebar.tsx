"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "./Providers";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  ClipboardList,
  AlertTriangle,
  FileSpreadsheet,
  QrCode,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  const userRole = (session?.user as any)?.role || "SUPER_ADMIN";

  const navItems = [
    {
      title: t.dashboard,
      href:
        userRole === "SUPER_ADMIN"
          ? "/admin"
          : userRole === "DISTRICT_OFFICER"
          ? "/officer"
          : userRole === "CENTRE_MANAGER"
          ? "/centre"
          : userRole === "TRAINER"
          ? "/trainer"
          : "/student",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER", "CENTRE_MANAGER", "TRAINER", "STUDENT"],
    },
    {
      title: t.centres,
      href: "/centres",
      icon: Building2,
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER"],
    },
    {
      title: t.attendance,
      href: "/attendance",
      icon: CalendarCheck,
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER", "CENTRE_MANAGER", "TRAINER"],
    },
    {
      title: t.inspections,
      href: "/inspections",
      icon: ClipboardList,
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER", "CENTRE_MANAGER"],
    },
    {
      title: t.alerts,
      href: "/alerts",
      icon: AlertTriangle,
      badge: "4 Open",
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER", "CENTRE_MANAGER"],
    },
    {
      title: t.reports,
      href: "/reports",
      icon: FileSpreadsheet,
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER", "CENTRE_MANAGER"],
    },
    {
      title: "QR Attendance",
      href: "/trainer",
      icon: QrCode,
      roles: ["TRAINER"],
    },
    {
      title: "AI Compliance Suite",
      href: "/ai-suite",
      icon: Sparkles,
      badge: "AI",
      roles: ["SUPER_ADMIN", "DISTRICT_OFFICER"],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between py-4">
      <div className="px-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation ({userRole.replace("_", " ")})
        </div>
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.title}
              href={item.href}
              className={clsx(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={clsx("h-4 w-4", isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-400")} />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Geofence & System Badge */}
      <div className="px-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Geo-Fence Guard Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Attendance valid within 250m perimeter of registered training centre GPS.
          </p>
        </div>
      </div>
    </aside>
  );
}
