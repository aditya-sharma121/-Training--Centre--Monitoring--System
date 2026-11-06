import React from "react";
import prisma from "@/lib/prisma";
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    include: {
      centre: { select: { id: true, name: true, code: true, district: true, state: true } },
      batch: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compliance Alert Engine & Escalations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated monitoring rules detect substandard attendance, trainer absence, and 48-hour unresolved violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            48h Auto-Escalation Active
          </span>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800">
            System Alerts ({alerts.length} Total Incidents)
          </span>
          <span className="text-xs text-slate-500">Auto-Refreshed via Telemetry</span>
        </div>

        <div className="space-y-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-xl border transition-all ${
                a.severity === "CRITICAL"
                  ? "border-rose-200 bg-rose-50/40"
                  : a.severity === "HIGH"
                  ? "border-orange-200 bg-orange-50/40"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        a.severity === "CRITICAL"
                          ? "bg-rose-600 text-white"
                          : a.severity === "HIGH"
                          ? "bg-orange-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {a.severity}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{a.title}</h3>
                    {a.status === "ESCALATED" && (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Escalated to District Officer (&gt;48h)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">{a.description}</p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span>Centre: <strong className="text-slate-700">{a.centre.name}</strong></span>
                    <span>•</span>
                    <span>{a.centre.district}, {a.centre.state}</span>
                    <span>•</span>
                    <span>Reported: {new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <Link
                    href={`/centres/${a.centre.id}?tab=alerts`}
                    className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    View Centre
                  </Link>
                  <button className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
