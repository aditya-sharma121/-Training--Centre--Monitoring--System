"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
} from "lucide-react";
import { exportToExcel, exportAttendancePdf } from "@/lib/export";

export default function ReportsPage() {
  const [district, setDistrict] = useState("All");
  const [reportType, setReportType] = useState("attendance");

  // Sample realistic report data
  const reportRows = [
    { Date: "2024-11-06", Batch: "Solar PV Batch 1", RegistrationNo: "REG-2024-00001", StudentName: "Rohit Sharma", Status: "PRESENT", VerificationMethod: "QR_SCAN", GeoVerified: "YES (45m)" },
    { Date: "2024-11-06", Batch: "Solar PV Batch 1", RegistrationNo: "REG-2024-00002", StudentName: "Ananya Kulkarni", Status: "PRESENT", VerificationMethod: "QR_SCAN", GeoVerified: "YES (52m)" },
    { Date: "2024-11-06", Batch: "Solar PV Batch 1", RegistrationNo: "REG-2024-00003", StudentName: "Vikram Rathore", Status: "LATE", VerificationMethod: "MANUAL", GeoVerified: "YES (60m)" },
    { Date: "2024-11-06", Batch: "Solar PV Batch 1", RegistrationNo: "REG-2024-00004", StudentName: "Deepak Meena", Status: "PRESENT", VerificationMethod: "QR_SCAN", GeoVerified: "YES (40m)" },
    { Date: "2024-11-06", Batch: "Solar PV Batch 1", RegistrationNo: "REG-2024-00005", StudentName: "Pooja Choudhary", Status: "ABSENT", VerificationMethod: "SYSTEM", GeoVerified: "N/A" },
    { Date: "2024-11-06", Batch: "EV Service Batch 2", RegistrationNo: "REG-2024-00021", StudentName: "Karan Johar", Status: "PRESENT", VerificationMethod: "FACE_AI", GeoVerified: "YES (30m)" },
    { Date: "2024-11-06", Batch: "EV Service Batch 2", RegistrationNo: "REG-2024-00022", StudentName: "Simran Kaur", Status: "PRESENT", VerificationMethod: "FACE_AI", GeoVerified: "YES (35m)" },
  ];

  const handleExportExcel = () => {
    exportToExcel(reportRows, "TCMS_Attendance_Audit_Report");
  };

  const handleExportPdf = () => {
    exportAttendancePdf(
      reportRows,
      "Official Training Centre Attendance Report",
      { total: reportRows.length, present: 5, absent: 1, rate: "83.3%" }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Defaulter Audits
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal ministry attendance rolls, defaulter registers (&lt;75%), and infrastructure ratings.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" /> Download Excel (.xlsx)
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
          >
            <FileText className="h-4 w-4" /> Download PDF (.pdf)
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">District:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="All">All Districts</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Category:</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="attendance">Daily Attendance Log</option>
              <option value="defaulters">Candidate Defaulters (&lt;75% Attendance)</option>
              <option value="compliance">Infrastructure Compliance Breakdown</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400">
          Showing 7 Records • Filter Applied
        </span>
      </div>

      {/* Preview Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800">
            Report Data Preview
          </span>
          <span className="text-xs text-emerald-600 font-semibold">
            Ready for Print & Official Audit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Batch Name</th>
                <th className="px-4 py-3">Registration No</th>
                <th className="px-4 py-3">Candidate Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification Method</th>
                <th className="px-4 py-3">Geo Valid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono">{r.Date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.Batch}</td>
                  <td className="px-4 py-3 font-mono">{r.RegistrationNo}</td>
                  <td className="px-4 py-3">{r.StudentName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.Status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.Status === "LATE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {r.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{r.VerificationMethod}</td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">{r.GeoVerified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
