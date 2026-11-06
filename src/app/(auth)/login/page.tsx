"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle, Check } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("admin@tcms.gov.in");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paramEmail = searchParams.get("email");
    if (paramEmail) {
      setEmail(paramEmail);
      setPassword("demo123");
    }
  }, [searchParams]);

  const demoAccounts = [
    {
      role: "Super Admin (Govt Authority)",
      email: "admin@tcms.gov.in",
      desc: "Full national access, GIS map & analytics",
      target: "/admin",
      badge: "National",
    },
    {
      role: "District Officer (Jaipur)",
      email: "officer.jaipur@tcms.gov.in",
      desc: "District centre oversight & inspections",
      target: "/officer",
      badge: "District",
    },
    {
      role: "Centre Manager (Jaipur Hub)",
      email: "manager.jaipur@tcms.gov.in",
      desc: "Trainers, batches & self-audits",
      target: "/centre",
      badge: "Centre",
    },
    {
      role: "Master Trainer (Er. Rajesh)",
      email: "trainer.rajesh@tcms.gov.in",
      desc: "Geofenced attendance marking & check-in",
      target: "/trainer",
      badge: "Trainer",
    },
    {
      role: "Student Trainee (Rohit)",
      email: "student.rohit@tcms.gov.in",
      desc: "Personal attendance streak & timetable",
      target: "/student",
      badge: "Student",
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      const selected = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      const dest = selected ? selected.target : "/admin";
      router.push(dest);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  const selectDemoAccount = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword("demo123");
    setError(null);
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl sm:px-10">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Official Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@tcms.gov.in"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
        >
          {loading ? "Authenticating..." : "Sign In to Dashboard"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Quick 1-Click Demo Accounts Selector */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800">
            ⚡ 1-Click Demo Logins (SIH Evaluators)
          </span>
          <span className="text-[10px] text-slate-400">Password: demo123</span>
        </div>

        <div className="space-y-2">
          {demoAccounts.map((acc) => {
            const isSelected = email.toLowerCase() === acc.email.toLowerCase();
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectDemoAccount(acc)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {acc.role}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {acc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{acc.email}</p>
                </div>
                {isSelected ? (
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                ) : (
                  <span className="text-[10px] font-semibold text-blue-600 hover:underline">
                    Select
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            TC
          </div>
          <span className="font-bold text-xl text-slate-900">TCMS</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to TCMS Portal</h2>
        <p className="mt-1 text-xs text-slate-500">
          Training Centre Monitoring System • SIH26245
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Login Station...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
