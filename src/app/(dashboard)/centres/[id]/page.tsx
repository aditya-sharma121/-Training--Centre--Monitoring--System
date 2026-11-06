import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Building2,
  Users,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Camera,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CentreProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const activeTab = searchParams.tab || "overview";

  const centre = await prisma.centre.findUnique({
    where: { id: params.id },
    include: {
      trainers: { include: { user: true } },
      batches: {
        include: {
          course: true,
          trainer: { include: { user: true } },
          _count: { select: { students: true } },
        },
      },
      students: {
        take: 30,
        include: { batch: true },
      },
      inspections: {
        orderBy: { conductedDate: "desc" },
        take: 5,
        include: {
          inspector: true,
          responses: { include: { checklistItem: true } },
          evidences: true,
        },
      },
      alerts: {
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!centre) {
    notFound();
  }

  const tabs = [
    { id: "overview", label: "Overview", count: null },
    { id: "trainers", label: "Trainers", count: centre.trainers.length },
    { id: "students", label: "Students", count: centre.students.length },
    { id: "batches", label: "Batches", count: centre.batches.length },
    { id: "infrastructure", label: "Infrastructure", count: null },
    { id: "attendance", label: "Attendance", count: null },
    { id: "alerts", label: "Alerts", count: centre.alerts.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {centre.name}
              </h1>
              <span className="rounded bg-blue-100 text-blue-800 text-xs font-mono font-semibold px-2 py-0.5">
                {centre.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {centre.address}, {centre.district}, {centre.state} - {centre.pincode}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Compliance Rating</div>
              <div
                className={`text-2xl font-black ${
                  centre.complianceScore >= 80
                    ? "text-emerald-600"
                    : centre.complianceScore >= 60
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {centre.complianceScore}%
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                centre.complianceScore >= 80
                  ? "bg-emerald-100 text-emerald-800"
                  : centre.complianceScore >= 60
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {centre.complianceGrade}
            </span>
          </div>
        </div>

        {/* 7 Tab Bar */}
        <div className="mt-6 flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/centres/${centre.id}?tab=${tab.id}`}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300 dark:hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Centre Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Affiliation Number:</span>
                  <div className="font-semibold text-slate-800 font-mono mt-0.5">{centre.affiliationNumber || "NSDC-APPROVED"}</div>
                </div>
                <div>
                  <span className="text-slate-400">Total Seating Capacity:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{centre.capacity} Students</div>
                </div>
                <div>
                  <span className="text-slate-400">Geofence Radius:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{centre.geoRadiusMeters} meters perimeter</div>
                </div>
                <div>
                  <span className="text-slate-400">GPS Coordinates:</span>
                  <div className="font-semibold text-slate-800 font-mono mt-0.5">{centre.latitude.toFixed(4)}, {centre.longitude.toFixed(4)}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Verified Infrastructure Photos</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-28 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=400" alt="Building" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">Exterior</span>
                </div>
                <div className="h-28 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400" alt="Lab" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">IT Lab</span>
                </div>
                <div className="h-28 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400" alt="Safety" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">Fire Safety</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Contact Information</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{centre.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{centre.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trainers */}
      {activeTab === "trainers" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Certified Master Trainers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centre.trainers.map((t) => (
              <div key={t.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900">{t.user.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{t.employeeCode} • {t.specialization}</p>
                  <p className="text-[11px] text-slate-600 mt-1">Exp: {t.experienceYears} Years • {t.qualification}</p>
                </div>
                <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Students */}
      {activeTab === "students" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Enrolled Student Candidates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-2">Reg No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Batch</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centre.students.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2 font-mono font-medium">{s.registrationNo}</td>
                    <td className="px-4 py-2 font-semibold text-slate-900">{s.name}</td>
                    <td className="px-4 py-2">{s.batch.name}</td>
                    <td className="px-4 py-2">{s.gender}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Batches */}
      {activeTab === "batches" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Training Batches</h3>
          <div className="space-y-3">
            {centre.batches.map((b) => (
              <div key={b.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-900">{b.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{b.code} • {b.timing}</div>
                  <div className="text-[11px] text-slate-600 mt-1">Trainer: {b.trainer?.user.name} • {b._count.students} Enrolled</div>
                </div>
                <span className="rounded bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5">{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Infrastructure */}
      {activeTab === "infrastructure" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">12-Category Weighted Infrastructure Compliance</h3>
              <p className="text-xs text-slate-500">Official checklist results from latest on-site audit</p>
            </div>
            <Link
              href="/inspections"
              className="rounded bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              Start New Audit
            </Link>
          </div>

          <div className="space-y-2">
            {centre.inspections[0]?.responses.map((resp) => (
              <div key={resp.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-900">{resp.checklistItem.title}</div>
                  <div className="text-[11px] text-slate-500">{resp.checklistItem.category} • Weight: {resp.checklistItem.weight}x</div>
                  {resp.remarks && <div className="text-[11px] text-slate-600 mt-1 italic">&quot;{resp.remarks}&quot;</div>}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    resp.status === "COMPLIANT"
                      ? "bg-emerald-100 text-emerald-800"
                      : resp.status === "PARTIALLY_COMPLIANT"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {resp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Attendance */}
      {activeTab === "attendance" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Centre Attendance Summary</h3>
          <p className="text-xs text-slate-500 mb-4">
            Daily batch records and trainer biometric check-ins are logged with geo-telemetry.
          </p>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            Launch Full Attendance Roster & Export Module →
          </Link>
        </div>
      )}

      {/* Tab 7: Alerts */}
      {activeTab === "alerts" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Active Non-Compliance Alerts ({centre.alerts.length})</h3>
          {centre.alerts.length === 0 ? (
            <div className="p-4 text-xs text-emerald-600 bg-emerald-50 rounded-lg">
              No open alerts. Centre is fully compliant with standards.
            </div>
          ) : (
            centre.alerts.map((al) => (
              <div key={al.id} className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-800">{al.title}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-bold uppercase">{al.severity}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{al.description}</p>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  Triggered: {new Date(al.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
