import Link from "next/link";
import { Building2, Shield, Sparkles, Lock, Globe, ArrowRight, Eye } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "AI Matchmaking",
    description: "Get matched with investors who align with your industry, stage, ticket size, and geography. No cold outreach needed.",
  },
  {
    icon: Shield,
    title: "Milestone Escrow",
    description: "Funds are locked in Soroban smart contracts. Complete milestones, get investor approval (or wait out the timelock), and funds release.",
  },
  {
    icon: Eye,
    title: "Blind Review Option",
    description: "Mask your company name and wallet address during evaluation. Your idea is judged on merit — not your identity.",
  },
  {
    icon: Lock,
    title: "Meeting Credits",
    description: "Buy credits (XLM or platform tokens) to request meetings with matched investors. One credit = one meeting request.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Built on Stellar — access investors from anywhere in the world. No geographic restrictions.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Profile",
    desc: "Register your startup with pitch, industry tags, funding ask, and milestones. AI embeddings are generated automatically.",
  },
  {
    num: "02",
    title: "Get Matched",
    desc: "Our AI matches you with aligned investors. View compatibility scores and request meetings using credits.",
  },
  {
    num: "03",
    title: "Receive Funding",
    desc: "Investors deposit into Soroban escrow. Funds release as you hit milestones. Transparent and trustless.",
  },
];

export default function ForStartupsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-200 mb-6">
              For Startups
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Raise capital.{' '}
              <span className="text-emerald-200">On your terms.</span>
            </h1>
            <p className="mt-6 text-lg text-emerald-100 max-w-2xl mx-auto">
              AI-matched investors, milestone-based escrow, and blind review options.
              Ondex connects you with the right investors — no guesswork, no bias.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/startup/apply" className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-all">
                Apply for Funding
              </Link>
              <Link href="/how-it-works" className="rounded-lg border border-white/20 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Why Raise on Ondex</p>
            <h2 className="section-heading mt-2">
              Built for founders, by builders
            </h2>
            <p className="section-subheading">
              Milestone escrow means you only give up equity as you deliver. AI matchmaking means you find the right investors faster.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
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
            <h2 className="section-heading mt-2">Three steps to funding</h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-500 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/startup/apply" className="btn-primary">
              Apply Now <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
