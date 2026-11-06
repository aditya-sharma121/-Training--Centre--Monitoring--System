import React from "react";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/shared/StatCard";
import ComplianceMap from "@/components/maps/ComplianceMap";
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const centres = await prisma.centre.findMany({
    where: { deletedAt: null },
    include: {
      _count: { select: { batches: true, students: true, trainers: true } },
    },
    orderBy: { complianceScore: "desc" },
  });

  const totalCentres = centres.length;
  const compliantCentres = centres.filter((c) => c.complianceScore >= 75).length;
  const compliantPercentage = Math.round((compliantCentres / totalCentres) * 100);

  const totalStudents = await prisma.student.count();
  const openAlertsCount = await prisma.alert.count({ where: { status: "OPEN" } });

  // Top and bottom centres
  const topCentres = centres.slice(0, 4);
  const bottomCentres = [...centres].sort((a, b) => a.complianceScore - b.complianceScore).slice(0, 4);

  // Map markers payload
  const mapData = centres.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    district: c.district,
    state: c.state,
    latitude: c.latitude,
    longitude: c.longitude,
    complianceScore: c.complianceScore,
    complianceGrade: c.complianceGrade,
    capacity: c.capacity,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              National Monitoring Command Center
            </h1>
            <span className="rounded bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 dark:bg-blue-900 dark:text-blue-200">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-state overview of training centres, biometric compliance, and inspection audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Export National Report
          </Link>
          <Link
            href="/centres"
            className="rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm"
          >
            + Register New Centre
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Training Centres"
          value={totalCentres}
          subtitle="Across 5 States & 25 Districts"
          icon={Building2}
          variant="primary"
          trend="12%"
        />
        <StatCard
          title="Infrastructure Compliance"
          value={`${compliantPercentage}%`}
          subtitle={`${compliantCentres} of ${totalCentres} meet full criteria`}
          icon={CheckCircle2}
          variant="success"
          trend="4.8%"
        />
        <StatCard
          title="Total Registered Trainees"
          value={totalStudents.toLocaleString()}
          subtitle="Active skill development candidates"
          icon={Users}
          variant="primary"
          trend="18%"
        />
        <StatCard
          title="Unresolved Compliance Alerts"
          value={openAlertsCount}
          subtitle="Requires district officer attention"
          icon={AlertTriangle}
          variant="danger"
          trend="2"
          trendUp={false}
        />
      </div>

      {/* GIS Leaflet Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              National Training Centre GIS Map
            </h2>
            <p className="text-xs text-slate-500">
              Live geo-tagged centres coloured by compliance rating (Green ≥80%, Amber 60-79%, Red &lt;60%).
            </p>
          </div>
          <span className="text-xs text-slate-500">25 GPS Pins Active</span>
        </div>

        <ComplianceMap centres={mapData} />
      </div>

      {/* Benchmark Grids: Top Performing vs Defaulter Centres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Centres */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Top Compliant Centres
              </h3>
              <p className="text-xs text-slate-500">Exemplary infrastructure & attendance records</p>
            </div>
            <Link href="/centres" className="text-xs text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {topCentres.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {c.name}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                      {c.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{c.district}, {c.state}</span>
                    <span>•</span>
                    <span>{c._count.batches} Batches</span>
                    <span>•</span>
                    <span>{c._count.students} Students</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {c.complianceScore}%
                  </span>
                  <Link
                    href={`/centres/${c.id}`}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 dark:hover:bg-slate-700"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Improvement / Action Required */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> Non-Compliant / At Risk Centres
              </h3>
              <p className="text-xs text-slate-500">Requires physical inspection and remediation order</p>
            </div>
            <Link href="/alerts" className="text-xs text-rose-600 hover:underline">
              Inspect Alerts
            </Link>
          </div>

          <div className="space-y-3">
            {bottomCentres.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-lg bg-rose-50/50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {c.name}
                    </span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-mono">
                      {c.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{c.district}, {c.state}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-medium">Critical Deficiencies</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                    {c.complianceScore}%
                  </span>
                  <Link
                    href={`/centres/${c.id}`}
                    className="p-1 rounded hover:bg-rose-200 text-rose-700 dark:hover:bg-rose-900"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
