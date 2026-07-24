"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@/providers/wallet";
import { Logo } from "@/components/logo";

const features = [
  {
    num: "Register",
    title: "Choose Your Role",
    desc: "Founders create startup profiles with pitch, industry tags, and funding ask. Investors set preferences and KYC once.",
  },
  {
    num: "Match",
    title: "AI Matchmaking",
    desc: "Our engine matches startups with aligned investors based on industry, stage, ticket size, and geography.",
  },
  {
    num: "Connect",
    title: "Meet & Fund",
    desc: "Startups pay a credit to request a meeting. Investors review and accept. Milestone-based escrow keeps everyone honest.",
  },
];

const stageData = [
  {
    badge: "01",
    badgeColor: "bg-lavender/15 text-lavender",
    title: "Founder",
    desc: "Register your startup, describe your vision, and set your funding ask. AI finds your best-fit investors.",
    items: ["Profile creation", "Industry & stage tags", "Funding ask & equity"],
    color: "bg-lavender",
    corner: "cl-tl",
  },
  {
    badge: "02",
    badgeColor: "bg-coral/15 text-coral",
    title: "Investor",
    desc: "Set your investment preferences, verify KYC once, and browse AI-matched startups for free.",
    items: ["Preference setup", "One-time KYC", "Curated match feed"],
    color: "bg-coral",
    corner: "cl-bl",
  },
  {
    badge: "03",
    badgeColor: "bg-amber/15 text-amber",
    title: "Match",
    desc: "Our AI computes a compatibility score based on industry, stage, location, and ticket size alignment.",
    items: ["OpenAI embeddings", "Cosine similarity scoring", "Ranked 0-100"],
    color: "bg-amber",
    corner: "cl-br",
  },
  {
    badge: "04",
    badgeColor: "bg-mint/15 text-mint",
    title: "Escrow",
    desc: "Investors deposit into Soroban escrow. Milestones release via investor approval or timelock fallback.",
    items: ["Soroban on Stellar", "Timelock dispute window", "Transparent on-chain"],
    color: "bg-mint",
    corner: "cl-tr",
  },
];

export default function CinematicLanding() {
  const { connect, isConnecting } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [heroRevealed, setHeroRevealed] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    setScrolled(scrollTop > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      document.querySelectorAll(".reveal-block").forEach((el) => {
        el.classList.add("in");
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal-block").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setActiveStage(0);
      return;
    }
    const updateStage = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const progressThroughStage = 1 - Math.min(Math.max((rect.top + rect.height * 0.3) / vh, 0), 1);
      const idx = Math.min(
        stageData.length - 1,
        Math.floor(progressThroughStage * stageData.length)
      );
      setActiveStage(idx);
    };
    window.addEventListener("scroll", updateStage, { passive: true });
    updateStage();
    return () => window.removeEventListener("scroll", updateStage);
  }, []);

  return (
    <>
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <section className="relative min-h-screen flex flex-col items-start justify-center max-w-[1100px] mx-auto px-6 md:px-12">
        <div className={`eyebrow transition-all duration-800 ease-out-expo translate-y-0 opacity-100`}>
          AI-powered startup funding on Stellar
        </div>

        <h1 className="heading-display text-[clamp(40px,6vw,76px)] max-w-[900px]">
          <span className="inline-block">Find your perfect</span>{" "}
          <span className="inline-block text-text-secondary">investor match.</span>
        </h1>

        <p className="mt-7 text-[17px] text-text-secondary max-w-[520px] leading-relaxed">
          Ondex connects founders with aligned investors through AI matchmaking
          and transparent milestone-based escrow on Stellar.
        </p>

        <div className="mt-10 flex gap-4 items-center">
          <button
            onClick={connect}
            disabled={isConnecting}
            className="btn-cta-primary"
          >
            {isConnecting ? "Connecting..." : "Get Started"}
          </button>
          <a href="#how" className="btn-cta-ghost">
            See how it works →
          </a>
        </div>
      </section>

      <section id="work" className="relative px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto py-40">
          <div className="reveal-block">
            <div className="kicker text-mint text-xs tracking-widest uppercase mb-4">
              What it does
            </div>
            <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] max-w-[760px] leading-tight">
              One platform that matches, connects, and funds — with AI.
            </h2>
            <p className="mt-5 text-[16.5px] text-text-secondary max-w-[560px] leading-relaxed">
              No blind reviews, no jury. Just smart matching, direct connections,
              and on-chain escrow you can trust.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
            {features.map((f, i) => (
              <div key={f.num} className={`feature-card reveal-block d${i + 1}`}>
                <div className="card-num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="relative px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto py-32">
          <div className="reveal-block">
            <div className="kicker text-mint text-xs tracking-widest uppercase mb-4">
              How it works
            </div>
            <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] max-w-[760px] leading-tight">
              Founders pay to connect. Investors browse for free.
            </h2>
          </div>

          <div ref={stageRef} className="relative mt-16 reveal-block" style={{ minHeight: "520px" }}>
            {stageData.map((s) => (
              <div
                key={s.corner}
                className={`corner-label ${
                  s.corner === "cl-tl" ? "top-0 left-0" :
                  s.corner === "cl-tr" ? "top-0 right-0 flex-row-reverse" :
                  s.corner === "cl-bl" ? "bottom-0 left-0" :
                  "bottom-0 right-0 flex-row-reverse"
                }`}
              >
                <div className={`corner-square ${s.color}`} />
                {s.title}
              </div>
            ))}

            <div className="absolute top-3.5 left-[110px] right-[110px] bottom-3.5 border border-border" />

            <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-10">
              {stageData.map((s, i) => (
                <div key={s.badge} className={`stage-panel ${activeStage === i ? "active" : ""}`}>
                  <span className={`stage-badge ${s.badgeColor}`}>{s.badge}</span>
                  <h4 className="mt-3.5 font-serif text-lg">{s.title}</h4>
                  <p className="mt-2.5 text-[13.5px] text-text-secondary leading-relaxed">{s.desc}</p>
                  <ul className="mt-3.5 list-none">
                    {s.items.map((item) => (
                      <li key={item} className="text-[13px] py-1.5 border-t border-border first:border-t-0 first:pt-0 last:pb-0">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="proof">
        <div className="max-w-[820px] mx-auto text-center py-40 px-6 md:px-12 reveal-block">
          <blockquote className="text-[clamp(22px,2.8vw,32px)] font-normal leading-snug tracking-tight">
            &ldquo;Every match is AI-powered, every meeting is one credit away,
            and every escrow is on-chain.&rdquo;
          </blockquote>
        </div>
      </section>

      <section className="relative px-6 md:px-12 bg-cream text-cream-text rounded-t-3xl mt-10">
        <div className="max-w-[1100px] mx-auto py-32 flex flex-col items-center text-center reveal-block">
          <div className="text-xs tracking-widest uppercase mb-4 text-[#6b6a5e]">
            Our platform
          </div>
          <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] text-cream-text">
            Startups pay to connect. Investors join free.
          </h2>
          <button onClick={connect} className="btn-cta-primary mt-8">
            Get Started
          </button>
        </div>
      </section>

      <footer className="bg-cream text-cream-text border-t border-black/10 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto pt-16 pb-10 flex flex-wrap justify-between items-end gap-6">
          <div className="reveal-block">
            <div className="text-xs tracking-widest uppercase mb-4 text-[#6b6a5e]">
              Get started
            </div>
            <h2 className="heading-display text-[clamp(26px,3vw,38px)]">
              Ready to find your match?
            </h2>
          </div>
          <div className="flex gap-4 flex-wrap reveal-block">
            <Link href="/signup/founder" className="btn-outline border-black/20 text-[#141310] hover:border-[#141310]">
              For Founders
            </Link>
            <Link href="/signup/investor" className="btn-outline border-black/20 text-[#141310] hover:border-[#141310]">
              For Investors
            </Link>
          </div>
          <div className="w-full mt-14 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6b6a5e] border-t border-black/10 pt-6">
            <Logo imgClassName="h-8 w-8" />
            <span>© {new Date().getFullYear()} Ondex. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}