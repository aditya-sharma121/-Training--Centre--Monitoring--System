import React from "react";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/shared/StatCard";
import {
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CentreManagerDashboard() {
  // Use first centre (Jaipur Hub) as the Centre Manager's managed facility
  const centre = await prisma.centre.findFirst({
    where: { deletedAt: null },
    include: {
      batches: {
        include: {
          course: true,
          trainer: { include: { user: true } },
          _count: { select: { students: true } },
        },
      },
      trainers: { include: { user: true } },
      alerts: { where: { status: "OPEN" } },
      inspections: { orderBy: { conductedDate: "desc" }, take: 1 },
    },
  });

  if (!centre) {
    return <div className="p-6">No centre profile found.</div>;
  }

  const totalStudents = await prisma.student.count({ where: { centreId: centre.id } });
  const latestInspection = centre.inspections[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {centre.name}
            </h1>
            <span className="rounded bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5">
              Centre Manager
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {centre.address} • Code: <span className="font-mono font-medium">{centre.code}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/inspections"
            className="rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-sm flex items-center gap-1.5"
          >
            <ClipboardCheck className="h-4 w-4" /> Conduct Self-Assessment
          </Link>
          <Link
            href={`/centres/${centre.id}`}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            Full Profile
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Infrastructure Score"
          value={`${centre.complianceScore}%`}
          subtitle={`Rating: ${centre.complianceGrade}`}
          icon={CheckCircle2}
          variant={centre.complianceScore >= 75 ? "success" : "warning"}
        />
        <StatCard
          title="Active Batches"
          value={centre.batches.length}
          subtitle="Currently in session"
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Enrolled Trainees"
          value={totalStudents}
          subtitle={`Capacity: ${centre.capacity}`}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Open Compliance Alerts"
          value={centre.alerts.length}
          subtitle="Requires attention"
          icon={AlertTriangle}
          variant={centre.alerts.length > 0 ? "danger" : "success"}
        />
      </div>

      {/* Batches Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Training Batches</h3>
            <p className="text-xs text-slate-500">Monitor batch daily attendance and assigned master trainers</p>
          </div>
          <Link href="/attendance" className="text-xs font-semibold text-blue-600 hover:underline">
            Roster Details
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Batch Name</th>
                <th className="px-4 py-3">Course / Trade</th>
                <th className="px-4 py-3">Assigned Trainer</th>
                <th className="px-4 py-3">Timing</th>
                <th className="px-4 py-3">Enrolled</th>
                <th className="px-4 py-3 text-right">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centre.batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {b.name}
                    <div className="text-[10px] text-slate-400 font-mono">{b.code}</div>
                  </td>
                  <td className="px-4 py-3">{b.course.name}</td>
                  <td className="px-4 py-3">{b.trainer?.user.name || "Unassigned"}</td>
                  <td className="px-4 py-3">{b.timing}</td>
                  <td className="px-4 py-3 font-semibold">{b._count.students} Students</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/attendance"
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Mark / View <ArrowRight className="h-3 w-3" />
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
