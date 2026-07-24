"use client";

import { useEffect, useRef, useState } from "react";

const pipeline = [
  {
    id: "founder",
    label: "Founder",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M3 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M17 8l4 4m0 0l-4 4m4-4H9" />
      </svg>
    ),
    desc: "Creates a profile with pitch, funding ask, and milestones.",
    detail: "Profile + Milestones",
    color: "from-blue-500 to-blue-600",
    light: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "ai",
    label: "AI Engine",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 2a4 4 0 014 4c0 2-2 3-4 4-2-1-4-2-4-4a4 4 0 014-4z" />
        <path d="M2 22c0-4 4-6 10-6s10 2 10 6" />
        <path d="M8 12l4 2 4-2" />
        <circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    desc: "Computes match scores using OpenAI embeddings.",
    detail: "Cosine Similarity 0-100",
    color: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "investor",
    label: "Investor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    desc: "Browses matched startups and deposits into escrow.",
    detail: "Deposit + Dispute Rights",
    color: "from-amber-500 to-amber-600",
    light: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: "escrow",
    label: "Soroban Escrow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
    desc: "Funds locked in smart contract. Milestones trigger release.",
    detail: "Timelock Fallback 72h",
    color: "from-violet-500 to-violet-600",
    light: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
];

const connectors = [
  { id: "c1", from: "founder", to: "ai" },
  { id: "c2", from: "ai", to: "investor" },
  { id: "c3", from: "investor", to: "escrow" },
];

export default function HowItWorksSection() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          pipeline.forEach((_, i) => {
            setTimeout(() => setActiveIdx(i), i * 500);
          });
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">How It Works</p>
          <h2 className="section-heading mt-2">
            From founder to funded — in four moves
          </h2>
          <p className="section-subheading">
            No blind reviews. No human jury. Just AI matching and on-chain escrow.
          </p>
        </div>

        {/* ─── Pipeline Flow ─── */}
        <div className="mt-16 relative">
          {/* Background track */}
          <div className="hidden lg:block absolute top-1/2 left-[8%] right-[8%] h-0.5 -translate-y-1/2 bg-slate-200">
            <div
              className="h-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(0, (activeIdx + 0.5) / (pipeline.length - 1) * 100)}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
            {pipeline.map((item, i) => {
              const isActive = activeIdx >= i;
              const isLive = activeIdx === i;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col items-center text-center transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Mobile connector arrow */}
                  {i > 0 && (
                    <div className="lg:hidden flex justify-center py-2">
                      <svg className={`h-6 w-6 transition-colors duration-500 ${isActive ? "text-blue-500" : "text-slate-300"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}

                  {/* Node */}
                  <div className="relative">
                    {/* Pulse ring */}
                    {isLive && (
                      <span className="absolute inset-0 rounded-2xl animate-ping bg-blue-400/30" />
                    )}
                    <div
                      className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 transition-all duration-500 shadow-sm ${
                        isActive
                          ? `${item.light} ${item.color.replace("from-", "border-").replace("to-", "")} scale-100`
                          : "bg-slate-50 border-slate-200 scale-95"
                      }`}
                    >
                      <span className={isActive ? "text-slate-700" : "text-slate-400"}>
                        {item.icon}
                      </span>
                    </div>
                  </div>

                  {/* Step number */}
                  <div className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-500 ${
                    isActive ? item.badge : "bg-slate-100 text-slate-400"
                  }`}>
                    Step {i + 1}
                  </div>

                  <h3 className={`mt-3 text-lg font-semibold transition-colors duration-500 ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}>
                    {item.label}
                  </h3>

                  <p className={`mt-2 text-sm leading-relaxed max-w-[220px] transition-all duration-500 ${
                    isActive
                      ? "text-slate-600 opacity-100"
                      : "text-slate-300 opacity-0"
                  }`}
                    style={{ transitionDelay: `${i * 150 + 300}ms` }}
                  >
                    {item.desc}
                  </p>

                  {/* Detail chip */}
                  <div className={`mt-3 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-500 ${
                    isActive
                      ? "border-slate-200 bg-slate-50 text-slate-600 opacity-100"
                      : "border-transparent bg-transparent text-transparent opacity-0"
                  }`}
                    style={{ transitionDelay: `${i * 150 + 500}ms` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {item.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Live Counter ─── */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
          {[
            { value: "0", suffix: " fees", label: "For investors" },
            { value: "AI", suffix: "", label: "Powered matching" },
            { value: "72h", suffix: "", label: "Dispute window" },
            { value: "100%", suffix: "", label: "On-chain" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center rounded-xl border p-4 transition-all duration-700 ${
                activeIdx >= pipeline.length - 1
                  ? "border-blue-200 bg-blue-50/50 opacity-100"
                  : "border-slate-100 bg-white opacity-60"
              }`}
              style={{ transitionDelay: `${2000 + i * 150}ms` }}
            >
              <div className="text-xl font-bold text-slate-900">
                {stat.value}<span className="text-blue-500">{stat.suffix}</span>
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Architecture note ─── */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
            <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Built on Stellar Soroban — every transaction is verifiable on-chain
          </div>
        </div>
      </div>
    </section>
  );
}
