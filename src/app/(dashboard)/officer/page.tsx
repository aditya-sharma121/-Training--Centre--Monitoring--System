import React from "react";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/shared/StatCard";
import {
  Building2,
  ClipboardList,
  AlertOctagon,
  CheckCircle,
  Calendar,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DistrictOfficerDashboard() {
  const districtName = "Jaipur"; // Default district jurisdiction for demo officer

  const districtCentres = await prisma.centre.findMany({
    where: { district: districtName, deletedAt: null },
    include: {
      batches: true,
      alerts: { where: { status: "OPEN" } },
      _count: { select: { students: true, trainers: true } },
    },
  });

  const recentInspections = await prisma.inspection.findMany({
    where: { centre: { district: districtName } },
    include: {
      centre: { select: { name: true, code: true } },
      inspector: { select: { name: true } },
    },
    orderBy: { conductedDate: "desc" },
    take: 5,
  });

  const escalatedAlerts = await prisma.alert.findMany({
    where: {
      centre: { district: districtName },
      status: { in: ["OPEN", "ESCALATED"] },
    },
    include: { centre: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              District Officer Console – {districtName}
            </h1>
            <span className="rounded bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5">
              Regional Oversight
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervise accredited vocational training institutions and enforce standards across {districtName} district.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/inspections"
            className="rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm flex items-center gap-1.5"
          >
            <ClipboardList className="h-4 w-4" /> Start Official Centre Inspection
          </Link>
        </div>
      </div>

      {/* District KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="District Centres"
          value={districtCentres.length}
          subtitle={`Under ${districtName} jurisdiction`}
          icon={Building2}
          variant="primary"
        />
        <StatCard
          title="Completed Inspections"
          value={recentInspections.length}
          subtitle="Past 60 days"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Escalated Violations"
          value={escalatedAlerts.filter((a) => a.status === "ESCALATED").length}
          subtitle="Unresolved for >48h by centre"
          icon={ShieldAlert}
          variant="danger"
        />
        <StatCard
          title="Open Action Items"
          value={escalatedAlerts.length}
          subtitle="Pending formal resolution"
          icon={AlertOctagon}
          variant="warning"
        />
      </div>

      {/* Centres List in Jurisdiction */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Jurisdictional Training Centres
            </h3>
            <p className="text-xs text-slate-500">Live operational status and compliance audit scores</p>
          </div>
          <Link href="/centres" className="text-xs font-semibold text-blue-600 hover:underline">
            View District Directory
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Centre Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Active Batches</th>
                <th className="px-4 py-3">Compliance Score</th>
                <th className="px-4 py-3">Open Alerts</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtCentres.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    {c.name}
                    <div className="text-[11px] text-slate-400 font-normal">{c.address}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono">{c.code}</td>
                  <td className="px-4 py-3.5">{c.batches.length} Ongoing</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        c.complianceScore >= 80
                          ? "bg-emerald-100 text-emerald-800"
                          : c.complianceScore >= 60
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {c.complianceScore}% ({c.complianceGrade})
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {c.alerts.length > 0 ? (
                      <span className="text-rose-600 font-bold">{c.alerts.length} Pending</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/centres/${c.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Audit <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
