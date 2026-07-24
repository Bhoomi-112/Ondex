import Link from "next/link";
import { Search, MessageSquare, ShieldCheck, Sparkles, Lock, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Founders Register",
    description:
      "Startups create profiles with pitch, industry tags, funding ask, and milestones. Data is stored on-chain via the identity registry. AI embeddings are generated for matchmaking.",
  },
  {
    icon: Users,
    title: "Investors Set Preferences",
    description:
      "Investors connect their wallet, set preferred industries, ticket size range, and funding stage. One-time KYC and they're ready to browse. No cost to investors — ever.",
  },
  {
    icon: Sparkles,
    title: "AI Matchmaking",
    description:
      "Our engine computes cosine similarity between startup profiles and investor preferences using OpenAI embeddings. A match score (0-100) is displayed in both dashboards.",
  },
  {
    icon: Clock,
    title: "Startup Requests Meeting",
    description:
      "Founders spend one meeting credit to request a call with an aligned investor. Credits are bought via platform tokens or XLM. Investors accept or decline for free.",
  },
  {
    icon: ShieldCheck,
    title: "Investor Deposits into Escrow",
    description:
      "When both parties agree to proceed, the investor deposits funds into a Soroban smart contract. Funds are locked — only the contract logic can release or refund.",
  },
  {
    icon: CheckCircle,
    title: "Milestone Release",
    description:
      "Startup completes a milestone and requests release. Investor has a dispute window to reject. If no dispute within the window, funds auto-release to the startup.",
  },
];

const KEY_FEATURES = [
  {
    icon: Sparkles,
    title: "AI-powered matching",
    desc: "Smart embeddings match founders with the right investors — no blind browsing.",
  },
  {
    icon: Lock,
    title: "Non-custodial escrow",
    desc: "Funds live in Soroban contracts — Ondex never holds deposits.",
  },
  {
    icon: Users,
    title: "Startups pay, investors free",
    desc: "Meeting credits fund the platform. Investors browse, match, and connect for free.",
  },
  {
    icon: Clock,
    title: "Timelock fallback",
    desc: "If an investor doesn't dispute within the window, funds auto-release to startup.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm font-medium text-blue-200 mb-6">
              How It Works
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              AI Matchmaking &amp; On-Chain Escrow
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              Founders register, investors set preferences, AI matches them together.
              Meetings are one credit away. Escrow is on-chain and transparent.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-blue-200" />
            <div className="space-y-16">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative pl-16">
                    <div className="absolute left-0 top-0 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="pt-1">
                      <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 mb-2">
                        Step {i + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Key Features</p>
            <h2 className="section-heading mt-2">Design Principles</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KEY_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="section-heading">Ready to get started?</h2>
          <p className="mt-4 text-slate-500">Choose your role and join the platform.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/for/startups" className="btn-primary inline-flex items-center gap-2">
              For Founders <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/for/investors" className="btn-outline inline-flex items-center gap-2">
              For Investors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
