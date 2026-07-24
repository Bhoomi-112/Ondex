"use client";

import Link from "next/link";
import { Building2, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

const roles = [
  {
    icon: Building2,
    title: "Founder",
    description: "Raise capital for your startup via milestone-based escrow. AI matches you with aligned investors.",
    href: "/signup/founder",
    color: "text-blue-600 bg-blue-100",
    badge: "bg-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Investor",
    description: "Browse AI-matched startups for free. Deposit into Soroban escrow and manage your portfolio.",
    href: "/signup/investor",
    color: "text-emerald-600 bg-emerald-100",
    badge: "bg-emerald-600",
  },
  {
    icon: Sparkles,
    title: "Jury (AI)",
    description: "Our AI agent evaluates startup applications. No human jury needed — instant, unbiased scoring.",
    href: "/how-it-works",
    color: "text-amber-600 bg-amber-100",
    badge: "bg-amber-600",
  },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Join Ondex
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Choose your role to get started. Connect your Stellar wallet after selecting.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.title}
                href={role.href}
                className="group rounded-xl border border-slate-200 bg-white p-8 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${role.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  {role.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
                  Get started <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
