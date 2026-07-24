const phases = [
  {
    phase: "Phase 1",
    title: "Core Platform",
    date: "Live now",
    color: "border-blue-500 bg-blue-50",
    dot: "bg-blue-500",
    items: [
      "AI-powered founder-investor matching",
      "Startup profile creation with milestones",
      "Investor onboarding & preferences",
      "Soroban milestone-based escrow",
      "Match score visualization (0–100)",
    ],
  },
  {
    phase: "Phase 2",
    title: "Marketplace Growth",
    date: "Q3 2026",
    color: "border-emerald-500 bg-emerald-50",
    dot: "bg-emerald-500",
    items: [
      "Meeting credit system & scheduling",
      "Whereby video integration",
      "On-chain reputation scores",
      "Advanced investor filters & alerts",
      "Batch milestone releases",
    ],
  },
  {
    phase: "Phase 3",
    title: "Token & Governance",
    date: "Q4 2026",
    color: "border-amber-500 bg-amber-50",
    dot: "bg-amber-500",
    items: [
      "Ondex platform token launch",
      "DAO governance for protocol params",
      "Staking for dispute resolution",
      "Cross-chain escrow bridges",
      "Liquidity pools for milestone funding",
    ],
  },
  {
    phase: "Phase 4",
    title: "Ecosystem",
    date: "2027",
    color: "border-violet-500 bg-violet-50",
    dot: "bg-violet-500",
    items: [
      "Mobile app (iOS & Android)",
      "API for third-party integrators",
      "Automated KYC/AML pipeline",
      "AI deal sourcing from external platforms",
      "Multi-chain support (Solana, Base)",
    ],
  },
];

export default function RoadmapSection() {
  return (
    <section className="bg-slate-900 py-20 sm:py-28 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Roadmap</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-2">What&apos;s coming next</h2>
          <p className="mt-4 text-lg text-slate-400">
            We&apos;re building in public. Here&apos;s what&apos;s on the horizon.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {phases.map((p) => (
            <div
              key={p.phase}
              className={`rounded-xl border-l-4 ${p.color.replace(/bg-\w+-50/g, "bg-white/5")} bg-slate-800/50 p-6 shadow-sm border border-white/5`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${p.dot}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {p.phase}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <span className="text-[11px] font-medium text-slate-500">{p.date}</span>
              </div>
              <ul className="mt-5 space-y-3">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
