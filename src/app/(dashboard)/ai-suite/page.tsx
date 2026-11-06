"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Camera,
  BrainCircuit,
  TrendingDown,
  CheckCircle2,
  Search,
  ArrowRight,
} from "lucide-react";

export default function AiSuitePage() {
  const [nlQuery, setNlQuery] = useState(
    "Show centres in Rajasthan with attendance below 70% this month"
  );
  const [nlResult, setNlResult] = useState<string | null>(null);

  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [visionResult, setVisionResult] = useState<{
    verified: boolean;
    confidence: number;
    detected: string[];
  } | null>({
    verified: true,
    confidence: 0.96,
    detected: [
      "ABC Dry Powder Extinguisher",
      "Pressure Gauge in Safe Zone",
      "Valid Inspection Seal",
      "Emergency Evacuation Sign",
    ],
  });

  const handleRunNlQuery = () => {
    setNlResult(
      "Query Parsed: Filter applied -> State = 'Rajasthan' | Max Attendance = 70% | Date = 'Current Month'. Found 2 Centres: TC-RJ-KOT-004 (Kota), TC-RJ-JOD-002 (Jodhpur)."
    );
  };

  const handleSimulateVisionCheck = () => {
    setAnalyzingPhoto(true);
    setTimeout(() => {
      setAnalyzingPhoto(false);
      setVisionResult({
        verified: true,
        confidence: 0.94,
        detected: [
          "25 Working Desktop Terminals",
          "Ergonomic Student Seating",
          "Structured Network Cabling",
          "Online UPS Power Station",
        ],
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Intelligent Compliance Suite
            </h1>
            <span className="rounded bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Phase 2 Pluggable Module
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning models for vision-based photo verification, proxy attendance anomaly detection, and predictive risk scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Feature Flag: ENABLE_AI=true
          </span>
        </div>
      </div>

      {/* Feature 1: Natural Language Filter Query */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Natural-Language Governance Query
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Convert human queries directly into complex multi-state relational database filters.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="Ask anything..."
          />
          <button
            onClick={handleRunNlQuery}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 shrink-0"
          >
            <Search className="h-3.5 w-3.5" /> Execute Query
          </button>
        </div>

        {nlResult && (
          <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
            {nlResult}
          </div>
        )}
      </div>

      {/* Two Column Section: Vision AI vs Anomaly Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module A: Vision AI Photo Inspection */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-blue-600" /> Vision AI Infrastructure Inspector
              </h3>
              <p className="text-xs text-slate-500">
                Detects required assets and validates anti-spoofing metadata
              </p>
            </div>
            <button
              onClick={handleSimulateVisionCheck}
              disabled={analyzingPhoto}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded"
            >
              {analyzingPhoto ? "Scanning..." : "Scan IT Lab Photo"}
            </button>
          </div>

          <div className="h-40 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600"
              alt="Lab"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
              Confidence: {visionResult ? `${Math.round(visionResult.confidence * 100)}%` : "0%"}
            </div>
          </div>

          {visionResult && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Asset Requirements Confirmed
              </div>
              <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-slate-700">
                {visionResult.detected.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Module B: Attendance Anomaly Detector */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600" /> Attendance Anomaly Detection
            </h3>
            <p className="text-xs text-slate-500">
              Identifies proxy signatures, burst timestamps, and GPS spoofing
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-900">Suspicious Uniform Timestamps</span>
                <span className="text-[10px] bg-rose-200 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                  94% Confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                28 students marked within 1.4 seconds at Jaipur Hub. High probability of automated proxy marking.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900">Zero-Variance Attendance Streak</span>
                <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                  87% Confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Exact 100% attendance recorded for 21 consecutive working days with zero sick leaves or late arrivals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3: Predictive Risk Score Grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4 text-indigo-600" /> Predictive Risk Forecasting (Next 30 Days)
          </h3>
          <p className="text-xs text-slate-500">
            Early warning machine learning regression forecasting which centres will fall below 70% threshold.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-xs text-slate-900">Pradhan Mantri Kaushal Kendra (Kota Hub 4)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Rajasthan • TC-RJ-KOT-004</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-600">Predicted Score:</span>
              <span className="text-xs font-bold text-rose-600">42% (High Risk)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Factor: Fire safety violations & declining attendance</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-xs text-slate-900">Pradhan Mantri Kaushal Kendra (Nashik Hub 9)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Maharashtra • TC-MH-NAS-009</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-600">Predicted Score:</span>
              <span className="text-xs font-bold text-amber-600">58% (Medium Risk)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Factor: Power backup UPS battery failure</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-xs text-slate-900">Pradhan Mantri Kaushal Kendra (Noida Hub 14)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Uttar Pradesh • TC-UP-NOI-014</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-600">Predicted Score:</span>
              <span className="text-xs font-bold text-rose-600">46% (High Risk)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Factor: Suspended status & unverified trainer check-ins</div>
          </div>
        </div>
      </div>
    </div>
  );
}
