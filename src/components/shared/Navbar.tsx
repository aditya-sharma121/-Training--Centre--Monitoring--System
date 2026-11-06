"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "./Providers";
import {
  Bell,
  LogOut,
  User as UserIcon,
  Globe,
  ShieldCheck,
  Search,
} from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Govt Authority (National)",
    DISTRICT_OFFICER: "District Officer",
    CENTRE_MANAGER: "Centre Manager",
    TRAINER: "Master Trainer",
    STUDENT: "Student Trainee",
  };

  const userRole = (session?.user as any)?.role || "GUEST";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left: Brand & Portal title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white font-bold text-lg shadow-sm">
            TC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 dark:text-white">
                TCMS
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                SIH26245
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              {t.ministry}
            </p>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center w-1/3 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Right: Language, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Toggle Language"
        >
          <Globe className="h-3.5 w-3.5 text-blue-600" />
          <span>{t.switchLanguage}</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">Recent Compliance Alerts</span>
                <span className="text-[10px] text-blue-600">3 unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded bg-rose-50 p-2 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  <p className="font-medium">Critical: Attendance &lt; 50%</p>
                  <p className="text-[10px] text-slate-500">Batch BTH-SOLA-001 at Jaipur Hub</p>
                </div>
                <div className="rounded bg-amber-50 p-2 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  <p className="font-medium">Trainer Absent Alert</p>
                  <p className="text-[10px] text-slate-500">Er. Suresh Sen not checked-in by 09:30 AM</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Role & Profile */}
        {session?.user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {session.user.name}
              </div>
              <div className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                {roleLabels[userRole] || userRole}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1 rounded-md bg-slate-100 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
          >
            {t.login}
          </Link>
        )}
      </div>
    </header>
  );
}
