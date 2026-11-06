import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Building2, Search, Filter, Plus, ArrowUpRight, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CentresDirectoryPage({
  searchParams,
}: {
  searchParams: { state?: string; district?: string; search?: string };
}) {
  const where: any = { deletedAt: null };
  if (searchParams.state) where.state = searchParams.state;
  if (searchParams.district) where.district = searchParams.district;
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { code: { contains: searchParams.search } },
      { district: { contains: searchParams.search } },
    ];
  }

  const centres = await prisma.centre.findMany({
    where,
    include: {
      _count: { select: { batches: true, trainers: true, students: true, alerts: { where: { status: "OPEN" } } } },
    },
    orderBy: { complianceScore: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Training Centre Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered accredited skill centers, infrastructure audit ratings, and geo-coordinates.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm">
          <Plus className="h-4 w-4" /> Register New Centre
        </button>
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Total Accredited Centres: {centres.length}
          </span>
          <span className="text-xs text-slate-500">Live GPS Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Centre Name & Code</th>
                <th className="px-4 py-3">Location & Coordinates</th>
                <th className="px-4 py-3">Batches</th>
                <th className="px-4 py-3">Trainees</th>
                <th className="px-4 py-3">Compliance Rating</th>
                <th className="px-4 py-3">Alerts</th>
                <th className="px-4 py-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centres.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.code}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>{c.district}, {c.state}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium">{c._count.batches} Batches</td>
                  <td className="px-4 py-3.5 font-medium">{c._count.students} Students</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-xs ${
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
                    {c._count.alerts > 0 ? (
                      <span className="text-rose-600 font-bold">{c._count.alerts} Open</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/centres/${c.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      View <ArrowUpRight className="h-3 w-3" />
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
