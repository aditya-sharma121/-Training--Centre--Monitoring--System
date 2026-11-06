import React from "react";
import prisma from "@/lib/prisma";
import { CalendarCheck, Filter, Download, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const attendanceRecords = await prisma.studentAttendance.findMany({
    take: 50,
    orderBy: { date: "desc" },
    include: {
      student: { select: { name: true, registrationNo: true } },
      batch: { select: { name: true, code: true, centre: { select: { name: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Attendance Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Batch-wise attendance records with 24-hr edit locking and GPS geo-validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="h-4 w-4" /> Export Report (PDF/Excel)
          </Link>
          <Link
            href="/trainer"
            className="rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm"
          >
            + Mark New Session
          </Link>
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800">
            Recent Attendance Telemetry ({attendanceRecords.length} records shown)
          </span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Geo-Fenced Validations Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Batch & Centre</th>
                <th className="px-4 py-3">Registration No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Lock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-medium">
                    {new Date(r.date).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{r.batch.name}</div>
                    <div className="text-[10px] text-slate-400">{r.batch.centre.name}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{r.student.registrationNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.student.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "LATE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[10px] font-medium">
                      {r.verificationMethod} (GPS OK)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.editLocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Lock className="h-3 w-3" /> Locked (&gt;24h)
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Editable
                      </span>
                    )}
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
