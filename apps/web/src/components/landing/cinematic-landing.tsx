"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@/providers/wallet";
import { Logo } from "@/components/logo";
import { SPLASH_LEAVING_EVENT } from "@/components/landing/intro-splash";

const heroWords = [
  { text: "Fund", fade: false },
  { text: "the", fade: false },
  { text: "future,", fade: true },
  { text: "decentralized.", fade: true },
];

const features = [
  {
    num: "Apply",
    title: "Startup Proposals",
    desc: "Startups submit funding proposals with milestone plans. Jury reviews are blind — only commitment hashes on-chain.",
  },
  {
    num: "Review",
    title: "Jury Deliberation",
    desc: "Jurors stake real assets, vote blind against identity commitments, and trigger escrow release on majority sign-off.",
  },
  {
    num: "Fund",
    title: "Escrow & Milestones",
    desc: "Investors deposit into Soroban contracts. Each milestone releases on jury approval, gated by a dispute window.",
  },
];

const stats = [
  { number: "3", label: "Core roles — Startup, Jury, Investor" },
  { number: "100%", label: "On-chain escrow enforcement" },
  { number: "72h", label: "Dispute window per milestone" },
];

const stageData = [
  {
    badge: "01",
    badgeColor: "bg-lavender/15 text-lavender",
    title: "Startup",
    desc: "Submit a pitch, provide a KYC commitment hash, and track milestone delivery.",
    items: ["Blind identity commitment", "Milestone roadmap", "Real-time funding status"],
    color: "bg-lavender",
    corner: "cl-tl",
  },
  {
    badge: "02",
    badgeColor: "bg-coral/15 text-coral",
    title: "Jury",
    desc: "Review proposals blind, stake assets to vote, and trigger releases on majority.",
    items: ["Identity-masked review", "Stake-weighted voting", "Majority-gated release"],
    color: "bg-coral",
    corner: "cl-bl",
  },
  {
    badge: "03",
    badgeColor: "bg-amber/15 text-amber",
    title: "Investor",
    desc: "Browse approved campaigns, deposit into escrow, and track your portfolio.",
    items: ["Curated campaign feed", "Milestone-linked deposits", "Dispute window access"],
    color: "bg-amber",
    corner: "cl-br",
  },
  {
    badge: "04",
    badgeColor: "bg-mint/15 text-mint",
    title: "Escrow",
    desc: "Soroban smart contracts enforce every rule — no central authority controls funds.",
    items: ["Soroban on Stellar", "Time-locked dispute window", "Transparent on-chain ledger"],
    color: "bg-mint",
    corner: "cl-tr",
  },
];

export default function CinematicLanding() {
  const { connect, isConnecting } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
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

  // Scroll to "what it does" after splash
  useEffect(() => {
    const scrollToWork = () => {
      const el = document.getElementById("work");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(SPLASH_LEAVING_EVENT, scrollToWork);
    return () => window.removeEventListener(SPLASH_LEAVING_EVENT, scrollToWork);
  }, []);

  // IntersectionObserver for reveal blocks
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

  // Stage panel cycling
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
      {/* Progress bar */}
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-start justify-center max-w-[1100px] mx-auto px-6 md:px-12">
        <div
          className="eyebrow"
          style={{ opacity: 0, animation: "fade-up 0.8s ease forwards 0.1s" }}
        >
          Decentralized startup funding on Stellar
        </div>

        <h1
          className="heading-display text-[clamp(40px,6vw,76px)] max-w-[900px]"
          id="heroTitle"
        >
          {heroWords.map((w, i) => (
            <span
              key={i}
              className={`word-reveal ${w.fade ? "text-text-secondary" : ""}`}
              style={{ animationDelay: `${0.25 + i * 0.07}s` }}
            >
              {w.text}
              {i < heroWords.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h1>

        <p
          className="mt-7 text-[17px] text-text-secondary max-w-[520px] leading-relaxed"
          style={{ opacity: 0, animation: "fade-up 0.8s ease forwards 0.9s" }}
        >
          Ondex connects startups with investors through transparent,
          milestone-based escrow powered by Soroban smart contracts on Stellar.
        </p>

        <div
          className="mt-10 flex gap-4 items-center"
          style={{ opacity: 0, animation: "fade-up 0.8s ease forwards 1.1s" }}
        >
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

        <div
          className="scroll-cue"
          style={{ opacity: 0, animation: "fade-up 0.8s ease forwards 1.6s" }}
        >
          <div className="scroll-cue-line" />
          Scroll
        </div>
      </section>

      {/* What it does */}
      <section id="work" className="relative px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto py-40">
          <div className="reveal-block">
            <div className="kicker text-mint text-xs tracking-widest uppercase mb-4">
              What it does
            </div>
            <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] max-w-[760px] leading-tight">
              One platform that applies, reviews, and funds — while the chain
              enforces every rule.
            </h2>
            <p className="mt-5 text-[16.5px] text-text-secondary max-w-[560px] leading-relaxed">
              No central authority, no opaque decisions. Every escrow release
              requires jury sign-off, and every vote is blind.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
            {features.map((f, i) => (
              <div
                key={f.num}
                className={`feature-card reveal-block d${i + 1}`}
              >
                <div className="card-num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-12 border-t border-border pt-12 reveal-block">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — Stage */}
      <section id="how" className="relative px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto py-32">
          <div className="reveal-block">
            <div className="kicker text-mint text-xs tracking-widest uppercase mb-4">
              How it works
            </div>
            <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] max-w-[760px] leading-tight">
              It runs on-chain, not in a back room.
            </h2>
          </div>

          <div
            ref={stageRef}
            className="relative mt-16 reveal-block"
            style={{ minHeight: "520px" }}
          >
            {/* Corner labels */}
            {stageData.map((s) => (
              <div
                key={s.corner}
                className={`corner-label ${
                  s.corner === "cl-tl"
                    ? "top-0 left-0"
                    : s.corner === "cl-tr"
                    ? "top-0 right-0 flex-row-reverse"
                    : s.corner === "cl-bl"
                    ? "bottom-0 left-0"
                    : "bottom-0 right-0 flex-row-reverse"
                }`}
              >
                <div className={`corner-square ${s.color}`} />
                {s.title}
              </div>
            ))}

            {/* Frame */}
            <div className="absolute top-3.5 left-[110px] right-[110px] bottom-3.5 border border-border" />

            {/* Panels */}
            <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-10">
              {stageData.map((s, i) => (
                <div
                  key={s.badge}
                  className={`stage-panel ${activeStage === i ? "active" : ""}`}
                >
                  <span className={`stage-badge ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                  <h4 className="mt-3.5 font-serif text-lg">{s.title}</h4>
                  <p className="mt-2.5 text-[13.5px] text-text-secondary leading-relaxed">
                    {s.desc}
                  </p>
                  <ul className="mt-3.5 list-none">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="text-[13px] py-1.5 border-t border-border first:border-t-0 first:pt-0 last:pb-0"
                      >
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

      {/* Testimonial */}
      <section id="proof">
        <div className="max-w-[820px] mx-auto text-center py-40 px-6 md:px-12 reveal-block">
          <blockquote className="text-[clamp(22px,2.8vw,32px)] font-normal leading-snug tracking-tight">
            &ldquo;Every milestone release is on-chain, every vote is blind, and
            every investor can verify the escrow balance themselves.&rdquo;
          </blockquote>
          <cite className="block mt-7 not-italic text-[13.5px] text-text-secondary">
            {/* PLACEHOLDER: replace with a real testimonial before shipping */}
            Platform design principle
          </cite>
        </div>
      </section>

      {/* CTA cream section */}
      <section className="relative px-6 md:px-12 bg-cream text-cream-text rounded-t-3xl mt-10">
        <div className="max-w-[1100px] mx-auto py-32 flex flex-col items-center text-center reveal-block">
          <div className="text-xs tracking-widest uppercase mb-4 text-[#6b6a5e]">
            Our platform
          </div>
          <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] text-cream-text">
            Everything required to fund startups, end to end.
          </h2>
          <button onClick={connect} className="btn-cta-primary mt-8">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream text-cream-text border-t border-black/10 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto pt-16 pb-10 flex flex-wrap justify-between items-end gap-6">
          <div className="reveal-block">
            <div className="text-xs tracking-widest uppercase mb-4 text-[#6b6a5e]">
              Get started
            </div>
            <h2 className="heading-display text-[clamp(26px,3vw,38px)]">
              Ready to build on-chain?
            </h2>
          </div>
          <div className="flex gap-4 flex-wrap reveal-block">
            <Link href="/for/startups" className="btn-outline border-black/20 text-[#141310] hover:border-[#141310] hover:text-[#141310]">
              For Founders
            </Link>
            <Link href="/for/jury" className="btn-outline border-black/20 text-[#141310] hover:border-[#141310] hover:text-[#141310]">
              For Jurors
            </Link>
            <Link href="/for/investors" className="btn-outline border-black/20 text-[#141310] hover:border-[#141310] hover:text-[#141310]">
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
