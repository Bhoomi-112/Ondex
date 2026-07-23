import Link from "next/link";
import {
  Shield,
  Users,
  Coins,
  Vote,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";

const STEPS = [
  {
    icon: Coins,
    title: "Investors Deposit into Escrow",
    description:
      "When a campaign passes jury review, investors deposit XLM directly into a Soroban smart contract. Funds are locked — no one can move them except the contract logic. Each campaign gets its own escrow instance tied to its milestone plan.",
  },
  {
    icon: Shield,
    title: "Startup Delivers Milestones",
    description:
      "The startup defines milestones with clear deliverables and release amounts. When a milestone is completed, the startup submits a claim. The amount to release is set per milestone and cannot be changed after the campaign is created.",
  },
  {
    icon: Vote,
    title: "Jury Verifies & Votes",
    description:
      "Assigned jurors review the milestone claim against the deliverables. Votes are blind — jurors see only a commitment hash, never the startup's identity. Majority FOR triggers release (quorum is admin-configured per case).",
  },
  {
    icon: Clock,
    title: "Dispute Window Opens",
    description:
      "After a jury majority votes FOR, a dispute window opens (duration set by admin per case — not hardcoded). During this window, any investor in the campaign can raise a dispute if they believe the milestone was not properly delivered.",
  },
  {
    icon: AlertTriangle,
    title: "Dispute Resolution (If Raised)",
    description:
      "If a dispute is raised within the window, the release is paused. A capital-weighted investor vote determines the outcome — each investor's vote weight equals their deposited amount. Majority of participating capital decides whether funds release or revert.",
  },
  {
    icon: CheckCircle2,
    title: "Funds Release or Revert",
    description:
      "No dispute within the window → funds release to the startup automatically. Dispute resolved by investor vote → majority decides. In the rare case of a disputed milestone, jurors who voted FOR face slashing (admin-configured percentage). Partial milestones may be released proportionally.",
  },
];

const KEY_FEATURES = [
  {
    icon: Lock,
    title: "Non-custodial escrow",
    desc: "Funds live in Soroban contracts — Ondex never holds deposits. Only the contract logic can release or refund.",
  },
  {
    icon: Vote,
    title: "Blind jury review",
    desc: "Jurors evaluate against a hash commitment — no identity bias. Votes are on-chain and verifiable.",
  },
  {
    icon: Users,
    title: "Investor override",
    desc: "Capital-weighted vote gives investors the final say when a dispute is raised, overriding the jury if needed.",
  },
  {
    icon: Clock,
    title: "Configurable windows",
    desc: "Dispute window duration is set per case by the admin — no magic numbers, no hardcoded constants.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-3 py-1 text-xs font-medium text-amber">
          How It Works
        </div>
        <h1 className="font-serif text-[clamp(28px,5vw,48px)] font-medium leading-[1.08] tracking-tight text-text-primary">
          Escrow & Milestones
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] text-text-secondary leading-relaxed">
          Investors deposit into Soroban contracts. Each milestone releases on
          jury approval, gated by a dispute window. Every step is on-chain,
          transparent, and verifiable.
        </p>
      </div>

      <div className="relative mb-16">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />
        <div className="space-y-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative pl-14">
                <div className="absolute left-0 top-0 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-border bg-card">
                  <Icon className="h-5 w-5 text-amber" />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-12 rounded-xl border border-border bg-card/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-mint" />
          <h2 className="text-lg font-semibold text-text-primary">
            Key Design Principles
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {KEY_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-lg border border-border bg-background/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-mint" />
                  <h3 className="text-sm font-medium text-text-primary">{f.title}</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-gradient-to-br from-amber/5 to-transparent p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Ready to participate?
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/for/startups"
            className="btn-cta-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            Apply as Founder
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/for/investors"
            className="btn-cta-secondary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            Apply as Investor
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/for/jury"
            className="btn-cta-secondary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            Apply as Jury
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
