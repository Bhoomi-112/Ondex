import Link from "next/link";
import { TrendingUp, Shield, BarChart3, Users, Coins, ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "AI-Matched Opportunities",
    description: "No more endless scrolling. Our AI matches you with startups that fit your industry preferences, ticket size, and stage criteria.",
  },
  {
    icon: Shield,
    title: "Non-Custodial Escrow",
    description: "Deposit directly into Soroban smart contracts. Ondex never holds your funds — only contract logic can release or refund.",
  },
  {
    icon: Users,
    title: "Free to Browse",
    description: "Investors pay nothing. Browse campaigns, view AI evaluations, and connect with founders at zero cost.",
  },
  {
    icon: Coins,
    title: "Milestone-Based Releases",
    description: "Funds release in stages as the startup hits milestones. You approve each release or dispute within the timelock window.",
  },
];

const stats = [
  { value: "0", label: "Cost to browse" },
  { value: "100%", label: "On-chain" },
  { value: "AI", label: "Matched opportunities" },
  { value: "72h", label: "Dispute window" },
];

export default function ForInvestorsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm font-medium text-blue-200 mb-6">
              For Investors
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Invest in the future.{' '}
              <span className="text-blue-200">For free.</span>
            </h1>
            <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
              Browse AI-matched startups, deposit into Soroban escrow, and manage
              your portfolio — all without paying a single fee to the platform.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/login" className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-all">
                Connect Wallet
              </Link>
              <Link href="/startups" className="rounded-lg border border-white/20 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all">
                Browse Startups
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Why Invest on Ondex</p>
            <h2 className="section-heading mt-2">
              Built for serious investors
            </h2>
            <p className="section-subheading">
              Smart contract escrow, AI matchmaking, and transparent milestone tracking — everything you need to invest with confidence.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex gap-5 rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">How It Works</p>
            <h2 className="section-heading mt-2">
              Start investing in 3 steps
            </h2>
          </div>
          <div className="mt-12 space-y-8 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Connect your wallet", desc: "Use Freighter or any Stellar wallet to connect. No email, no password — just your wallet." },
              { step: "2", title: "Browse AI-matched startups", desc: "View campaigns filtered by your preferences. Each startup has an AI evaluation score and detailed pitch." },
              { step: "3", title: "Deposit into escrow", desc: "Funds go directly into a Soroban smart contract. Milestones release upon approval or timelock." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/login" className="btn-primary">
              Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
