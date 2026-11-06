"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  CheckCircle2,
  QrCode,
  Camera,
  Clock,
  ShieldCheck,
  AlertCircle,
  Save,
  Users,
} from "lucide-react";

export default function TrainerDashboardPage() {
  const [geoStatus, setGeoStatus] = useState<{
    lat: number;
    lng: number;
    distanceMeters: number;
    isValid: boolean;
  }>({
    lat: 26.9124,
    lng: 75.7873,
    distanceMeters: 45,
    isValid: true,
  });

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("BTH-SOLA-001");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock student roster for the batch
  const [students, setStudents] = useState([
    { id: "st-1", regNo: "REG-2024-00001", name: "Rohit Sharma", status: "PRESENT" },
    { id: "st-2", regNo: "REG-2024-00002", name: "Ananya Kulkarni", status: "PRESENT" },
    { id: "st-3", regNo: "REG-2024-00003", name: "Vikram Rathore", status: "LATE" },
    { id: "st-4", regNo: "REG-2024-00004", name: "Deepak Meena", status: "PRESENT" },
    { id: "st-5", regNo: "REG-2024-00005", name: "Pooja Choudhary", status: "ABSENT" },
    { id: "st-6", regNo: "REG-2024-00006", name: "Sunil Verma", status: "PRESENT" },
    { id: "st-7", regNo: "REG-2024-00007", name: "Kavita Rao", status: "PRESENT" },
    { id: "st-8", regNo: "REG-2024-00008", name: "Aman Shekhawat", status: "PRESENT" },
  ]);

  // Handle Trainer Check-In with Geofence & Selfie
  const handleTrainerCheckIn = () => {
    setCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString());
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const markAll = (status: string) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSaveAttendance = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 800);
  };

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trainer Attendance Station
            </h1>
            <span className="rounded bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5">
              Er. Rajesh Kumar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pradhan Mantri Kaushal Kendra (Jaipur Hub 1) • Solar PV Installer & Technician
          </p>
        </div>

        {/* Check-In / Out Button */}
        <div className="flex items-center gap-2">
          {!checkedIn ? (
            <button
              onClick={handleTrainerCheckIn}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
            >
              <Camera className="h-4 w-4" /> Check-In with GPS & Selfie
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Checked In at {checkInTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Geo-fence Guard Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Geo-Fence Active & Validated
              </span>
              <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.2">
                45m from Centre (Allowed: 250m)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Current GPS Coordinates: 26.9124° N, 75.7873° E • Device telemetry verified.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowQrModal(true)}
          className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm self-start sm:self-auto"
        >
          <QrCode className="h-4 w-4 text-blue-600" />
          Display Batch QR Code
        </button>
      </div>

      {/* Attendance Stats & Bulk Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700">Select Batch:</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="BTH-SOLA-001">Solar PV Installer - Batch 1 (09:00 AM - 01:00 PM)</option>
              <option value="BTH-SOLA-002">Solar PV Installer - Batch 2 (02:00 PM - 06:00 PM)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Quick Mark:</span>
            <button
              onClick={() => markAll("PRESENT")}
              className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
            >
              All Present
            </button>
            <button
              onClick={() => markAll("ABSENT")}
              className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
            >
              All Absent
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Attendance successfully marked, geo-validated, and locked for batch {selectedBatch}!
          </div>
        )}

        {/* Student Attendance List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Registration No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Attendance Status</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Lock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-medium">{st.regNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{st.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {["PRESENT", "ABSENT", "LATE", "LEAVE"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(st.id, status)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                            st.status === status
                              ? status === "PRESENT"
                                ? "bg-emerald-600 text-white"
                                : status === "ABSENT"
                                ? "bg-rose-600 text-white"
                                : status === "LATE"
                                ? "bg-amber-600 text-white"
                                : "bg-purple-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[10px] font-semibold">
                      Geo-Validated
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] text-slate-400">
                    Editable (24h window)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Attendance Rate: <span className="font-bold text-slate-900">{attendanceRate}%</span> ({presentCount}/{students.length} Present)
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Locking & Submitting..." : "Save Daily Attendance"}
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Batch Attendance QR Code</h3>
            <p className="text-xs text-slate-500 mt-1">
              Students can scan this QR using the TCMS Mobile PWA to mark self-attendance.
            </p>

            <div className="my-6 flex justify-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                {/* Simulated High-Res QR Graphic */}
                <div className="w-48 h-48 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-mono p-4 text-center">
                  [TCMS-QR-TOKEN: BTH-SOLA-001-20241106-GEOFENCE-VALID]
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Close QR Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
