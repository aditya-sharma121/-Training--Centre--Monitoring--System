"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  MapPin,
  Users,
  Award,
  FileSpreadsheet,
} from "lucide-react";

export default function LandingPage() {
  const quickDemoAccounts = [
    { role: "Super Admin", email: "admin@tcms.gov.in", desc: "National Govt Authority GIS Map & KPIs", color: "bg-blue-600" },
    { role: "District Officer", email: "officer.jaipur@tcms.gov.in", desc: "Jaipur District Centres & Inspections", color: "bg-indigo-600" },
    { role: "Centre Manager", email: "manager.jaipur@tcms.gov.in", desc: "Batch & Infrastructure Self-Audit", color: "bg-emerald-600" },
    { role: "Master Trainer", email: "trainer.rajesh@tcms.gov.in", desc: "Geofenced QR Marking & Selfie In", color: "bg-amber-600" },
    { role: "Student Trainee", email: "student.rohit@tcms.gov.in", desc: "Attendance Percentage & Streak", color: "bg-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Banner */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              TC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900">TCMS</span>
                <span className="bg-orange-100 text-orange-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-orange-200">
                  SIH26245
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Ministry of Skill Development & Entrepreneurship</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Sign In to Portal <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-6">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Smart India Hackathon 2024 • Problem Statement SIH26245
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Automated Monitoring & Infrastructure Compliance for Training Centres
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
            An end-to-end governance ecosystem empowering authorities, officers, centre managers, and trainers with
            geo-fenced student attendance, 12-category weighted infrastructure inspection, 48-hour alert escalation, and AI verification.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-700">25</div>
              <div className="text-xs text-slate-500 mt-1">Live Monitored Centres</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">84.2%</div>
              <div className="text-xs text-slate-500 mt-1">Average Attendance</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-amber-600">87.5%</div>
              <div className="text-xs text-slate-500 mt-1">Infrastructure Compliance</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">760+</div>
              <div className="text-xs text-slate-500 mt-1">Enrolled Trainees</div>
            </div>
          </div>

          {/* 1-Click Demo Login Selector for 3-minute Hackathon Pitch */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">🚀 1-Click Hackathon Demo Selector</h3>
                <p className="text-xs text-slate-500">
                  Instantly explore the platform across all 5 distinct role-based access perspectives (Password for all: <code>demo123</code>).
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 self-start">
                Ready with 60 Days History
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {quickDemoAccounts.map((acc) => (
                <Link
                  key={acc.role}
                  href={`/login?email=${encodeURIComponent(acc.email)}`}
                  className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-slate-50/50 hover:bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${acc.color}`} />
                      <span className="font-semibold text-xs text-slate-900">{acc.role}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{acc.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-700 group-hover:text-blue-800">
                    <span>Demo Login</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Core Architectural Pillars */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-slate-900">Comprehensive Compliance Capabilities</h2>
              <p className="text-xs text-slate-500 mt-1">Engineered to eliminate ghost attendance and ensure infrastructure standards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Geo-Fenced & Locked Attendance</h4>
                <p className="text-xs text-slate-600 mt-2">
                  Haversine formula validates trainer presence within 250m perimeter. Attendance is permanently edit-locked after 24 hours with immutable audit trails.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Award className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">12-Category Weighted Audit</h4>
                <p className="text-xs text-slate-600 mt-2">
                  Standardized checklist covering fire safety, computer labs, power backup, Divyangjan ramps, and CCTV with dual-layer self-assessment & officer verification.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">AI Verification & Escalation</h4>
                <p className="text-xs text-slate-600 mt-2">
                  Automated vision models verify asset evidence photos, flag proxy timestamp clusters, and escalate unaddressed violations after 48 hours to district heads.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © 2026 TCMS – Smart India Hackathon Problem Statement SIH26245. Production Prototype.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-blue-600">Portal Login</Link>
            <Link href="/admin" className="hover:text-blue-600">National Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
