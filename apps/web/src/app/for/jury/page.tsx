import Link from "next/link";
import { Brain, BarChart3, Shield, Zap, ArrowRight } from "lucide-react";

export default function ForJuryPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-amber-600 to-amber-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-200 mb-6">
              AI Jury
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              AI-powered evaluation.{' '}
              <span className="text-amber-200">No bias, no delays.</span>
            </h1>
            <p className="mt-6 text-lg text-amber-100 max-w-2xl mx-auto">
              Ondex replaces traditional human jury with an AI agent that evaluates
              startup applications. Faster, fairer, and available 24/7.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/how-it-works" className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-amber-700 hover:bg-amber-50 transition-all">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="section-eyebrow">AI Evaluation</p>
              <h2 className="section-heading mt-2">
                How our AI jury works
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Our AI agent evaluates every startup application across multiple dimensions,
                providing transparent scores and detailed evidence reports.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Brain, text: "Natural language analysis of pitch quality and clarity" },
                  { icon: BarChart3, text: "Market opportunity scoring based on industry data" },
                  { icon: Shield, text: "Team strength evaluation from public profiles" },
                  { icon: Zap, text: "Automated 24/7 evaluation — no waiting for human jurors" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="flex gap-3">
                      <Icon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
              <div className="text-center">
                <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  AI Evaluation Report
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Pitch Quality", score: 85, color: "bg-emerald-500" },
                  { label: "Market Opportunity", score: 72, color: "bg-amber-500" },
                  { label: "Team Strength", score: 90, color: "bg-emerald-500" },
                  { label: "Traction", score: 45, color: "bg-red-500" },
                  { label: "Overall", score: 73, color: "bg-blue-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-slate-900">{item.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-slate-400 text-center">
                Evidence report includes web presence analysis, document verification, and market data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
