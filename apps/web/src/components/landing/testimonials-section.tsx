"use client";

import { useRef } from "react";

const testimonials = [
  {
    name: "Priya K.",
    role: "Founder, Nexus AI",
    avatar: "PK",
    text: "We closed our seed round in 3 weeks instead of 6 months. The AI matching put us in front of investors who actually understood our space.",
    type: "startup" as const,
  },
  {
    name: "Marcus L.",
    role: "Partner, a16z Ventures",
    avatar: "ML",
    text: "The quality of deal flow through Ondex is remarkable. The AI pre-filtering means every startup I review is genuinely relevant to my thesis.",
    type: "investor" as const,
  },
  {
    name: "Aisha R.",
    role: "CEO, GreenGrid",
    avatar: "AR",
    text: "Milestone-based escrow changed everything. Investors loved the transparency, and we got paid as we delivered. No more chasing wire transfers.",
    type: "startup" as const,
  },
  {
    name: "David C.",
    role: "Angel Investor",
    avatar: "DC",
    text: "Finally, a platform where I don't have to pay to see deals. The match scores are eerily accurate — 3 of my last 4 investments came from Ondex matches.",
    type: "investor" as const,
  },
  {
    name: "Sofia M.",
    role: "CTO, MedSync",
    avatar: "SM",
    text: "Blind review meant our pitch was judged on technology, not connections. We got funded by an investor 3,000 miles away who we'd never have found otherwise.",
    type: "startup" as const,
  },
  {
    name: "James W.",
    role: "GP, Pantera Capital",
    avatar: "JW",
    text: "The on-chain escrow gives us programmable control over fund releases. It's the first time I've felt truly protected in early-stage investing.",
    type: "investor" as const,
  },
];

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Testimonials</p>
          <h2 className="section-heading mt-2">Trusted by founders and investors</h2>
          <p className="section-subheading">
            Real stories from people who&apos;ve used Ondex to raise, invest, and grow.
          </p>
        </div>
      </div>

      <div className="mt-12 relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="snap-start shrink-0 w-[380px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${
                    t.type === "startup" ? "bg-blue-500" : "bg-emerald-500"
                  }`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${
                    t.type === "startup" ? "text-blue-500" : "text-emerald-500"
                  }`}>
                    {t.type === "startup" ? "Startup" : "Investor"}
                  </span>
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      <div className="mt-8 text-center">
        <span className="text-xs text-slate-400">Scroll to see more →</span>
      </div>
    </section>
  );
}
