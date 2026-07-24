import Link from "next/link";
import { Building2, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Building2,
    title: "For Startups",
    description:
      "Raise capital via milestone-based escrow. AI matches you with aligned investors. Blind review protects your idea.",
    href: "/for/startups",
    cta: "Learn more",
    accent: "text-blue-600 bg-blue-100",
  },
  {
    icon: TrendingUp,
    title: "For Investors",
    description:
      "Browse AI-matched startups for free. Deposit into Soroban escrow. Participate in dispute resolution when needed.",
    href: "/for/investors",
    cta: "Learn more",
    accent: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Sparkles,
    title: "AI Jury",
    description:
      "Our AI agent evaluates startup applications — scoring pitch quality, team strength, and market opportunity. No human bias.",
    href: "/how-it-works",
    cta: "Learn more",
    accent: "text-amber-600 bg-amber-100",
  },
];

export default function PillarsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Who It's For</p>
          <h2 className="section-heading mt-2">One platform, three perspectives</h2>
          <p className="section-subheading">
            Whether you&apos;re raising, investing, or evaluating — Ondex works differently for each role.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group rounded-xl border border-slate-200 bg-white p-8 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${pillar.accent}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  {pillar.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
                  {pillar.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
