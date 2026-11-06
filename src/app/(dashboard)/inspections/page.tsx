"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Sparkles,
  Save,
  ArrowRight,
} from "lucide-react";
import { CHECKLIST_CATEGORIES } from "@/lib/compliance";

export default function InspectionChecklistPage() {
  const [selectedCentre, setSelectedCentre] = useState("Jaipur Hub 1");
  const [inspectionType, setInspectionType] = useState("OFFICER_VERIFICATION");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initial checklist state with 12 official categories
  const [responses, setResponses] = useState(
    CHECKLIST_CATEGORIES.map((cat, idx) => ({
      id: `item-${idx + 1}`,
      category: cat.name,
      title: `${cat.name} Standards Compliance`,
      description: cat.description,
      weight: cat.weight,
      status: "COMPLIANT" as "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NON_COMPLIANT",
      remarks: "Verified on site according to standard guidelines.",
    }))
  );

  const handleStatusChange = (
    index: number,
    status: "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NON_COMPLIANT"
  ) => {
    const updated = [...responses];
    updated[index].status = status;
    setResponses(updated);
  };

  // Real-time compliance score calculation
  const totalWeightedEarned = responses.reduce((acc, r) => {
    const mult = r.status === "COMPLIANT" ? 1.0 : r.status === "PARTIALLY_COMPLIANT" ? 0.5 : 0.0;
    return acc + 10 * mult * r.weight;
  }, 0);

  const totalWeightedPossible = responses.reduce((acc, r) => acc + 10 * r.weight, 0);
  const currentScore = Math.round((totalWeightedEarned / totalWeightedPossible) * 100);

  const getGrade = (score: number) => {
    if (score >= 90) return { label: "EXCELLENT", color: "text-emerald-600 bg-emerald-100" };
    if (score >= 75) return { label: "COMPLIANT", color: "text-blue-600 bg-blue-100" };
    if (score >= 50) return { label: "PARTIAL", color: "text-amber-600 bg-amber-100" };
    return { label: "CRITICAL", color: "text-rose-600 bg-rose-100" };
  };

  const gradeInfo = getGrade(currentScore);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Infrastructure Compliance Audit Checklist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized 12-category weighted evaluation with geo-tagged photo evidence and Vision AI validation.
          </p>
        </div>

        {/* Live Score Counter Pill */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Live Score</span>
            <span className="text-xl font-black text-slate-900">{currentScore}%</span>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${gradeInfo.color}`}>
            {gradeInfo.label}
          </span>
        </div>
      </div>

      {submitSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Inspection audit saved successfully! Official centre compliance score updated to {currentScore}%.
        </div>
      )}

      {/* Meta Options */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Training Centre</label>
          <select
            value={selectedCentre}
            onChange={(e) => setSelectedCentre(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="Jaipur Hub 1">Pradhan Mantri Kaushal Kendra (Jaipur Hub 1)</option>
            <option value="Pune Tech 2">Pradhan Mantri Kaushal Kendra (Pune Hub 2)</option>
            <option value="Lucknow Skill 3">Pradhan Mantri Kaushal Kendra (Lucknow Hub 3)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Protocol</label>
          <select
            value={inspectionType}
            onChange={(e) => setInspectionType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="OFFICER_VERIFICATION">District Officer Formal Verification</option>
            <option value="SELF_ASSESSMENT">Centre Manager Monthly Self-Assessment</option>
          </select>
        </div>
      </div>

      {/* 12 Category Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          12 Infrastructure Compliance Parameters
        </h3>

        <div className="space-y-4">
          {responses.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {idx + 1}. {item.category}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      Weight: {item.weight}x
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {(["COMPLIANT", "PARTIALLY_COMPLIANT", "NON_COMPLIANT"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(idx, status)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        item.status === status
                          ? status === "COMPLIANT"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : status === "PARTIALLY_COMPLIANT"
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-rose-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {status === "COMPLIANT" ? "Compliant" : status === "PARTIALLY_COMPLIANT" ? "Partial" : "Non-Compliant"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo & Remarks Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-slate-200/60">
                <input
                  type="text"
                  placeholder="Inspector remarks & notes..."
                  value={item.remarks}
                  onChange={(e) => {
                    const updated = [...responses];
                    updated[idx].remarks = e.target.value;
                    setResponses(updated);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 focus:outline-none"
                />

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 shrink-0"
                >
                  <Camera className="h-3.5 w-3.5 text-blue-600" />
                  <span>Geo-Photo Attached</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Calculated Compliance Score: <span className="font-bold text-slate-900">{currentScore}%</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {submitting ? "Computing Score & Logging Audit..." : "Submit Formal Inspection Audit"}
          </button>
        </div>
      </div>
    </div>
  );
}
