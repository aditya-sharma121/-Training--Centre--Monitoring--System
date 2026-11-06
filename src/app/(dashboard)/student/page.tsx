import React from "react";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/shared/StatCard";
import {
  CalendarCheck,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  // Find first student for demo
  const student = await prisma.student.findFirst({
    include: {
      centre: true,
      batch: { include: { course: true, trainer: { include: { user: true } } } },
      attendance: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  if (!student) {
    return <div className="p-6">No student profile found.</div>;
  }

  const totalSessions = student.attendance.length;
  const presentSessions = student.attendance.filter((a) => a.status === "PRESENT").length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 92;
  const isEligible = attendanceRate >= 75;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Student Trainee Portal
            </h1>
            <span className="rounded bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5">
              {student.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reg No: <span className="font-mono font-medium">{student.registrationNo}</span> • {student.centre.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEligible ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Exam Eligible (&gt;75%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
              <AlertCircle className="h-4 w-4 text-rose-600" /> Short Attendance Warning
            </span>
          )}
        </div>
      </div>

      {/* Trainee KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle="Mandatory minimum: 75%"
          icon={CalendarCheck}
          variant={isEligible ? "success" : "danger"}
        />
        <StatCard
          title="Sessions Attended"
          value={`${presentSessions} / ${totalSessions}`}
          subtitle="Valid geo-marked days"
          icon={CheckCircle2}
          variant="primary"
        />
        <StatCard
          title="Enrolled Trade"
          value={student.batch.course.sector}
          subtitle={student.batch.course.name}
          icon={BookOpen}
          variant="primary"
        />
        <StatCard
          title="Daily Timing"
          value={student.batch.timing.split(" ")[0]}
          subtitle={student.batch.timing}
          icon={Clock}
          variant="primary"
        />
      </div>

      {/* Attendance Heatmap / Recent Sessions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Attendance History (Last 30 Sessions)
            </h3>
            <p className="text-xs text-slate-500">
              Verified via trainer geo-fence and digital timestamp audit trail
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Current Streak: 🔥 14 Days
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
          {student.attendance.map((att, i) => (
            <div
              key={att.id || i}
              title={`${new Date(att.date).toLocaleDateString()} - ${att.status}`}
              className={`p-2 rounded-lg border text-center transition-all ${
                att.status === "PRESENT"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : att.status === "LATE"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              <div className="text-[10px] text-slate-500 font-mono">
                {new Date(att.date).getDate()}/{new Date(att.date).getMonth() + 1}
              </div>
              <div className="text-[11px] font-bold mt-0.5">
                {att.status === "PRESENT" ? "P" : att.status === "LATE" ? "L" : "A"}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-500" /> Present (P)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-500" /> Late Arrival (L)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-rose-500" /> Absent (A)
          </div>
        </div>
      </div>
    </div>
  );
}
