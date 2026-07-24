"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@/providers/wallet";
import { SPLASH_LEAVING_EVENT } from "@/components/landing/intro-splash";

const TYPEWRITER_LINE = "700+ startups matched this month";
const STATS = [
  { end: 0, suffix: "", label: "For Investors", prefix: "$" },
  { end: 92, suffix: "%", label: "Avg. Match Precision", prefix: "" },
  { end: 100, suffix: "%", label: "On-Chain Escrow", prefix: "" },
];

function useCounter(end: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTs: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setValue(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return value;
}

function useTypewriter(text: string, speed: number, start: boolean) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { display, done };
}

export default function HeroSection() {
  const { connect, isConnecting } = useWallet();
  const [revealed, setRevealed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pulseCta, setPulseCta] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const onReveal = () => setRevealed(true);
    window.addEventListener(SPLASH_LEAVING_EVENT, onReveal);
    return () => window.removeEventListener(SPLASH_LEAVING_EVENT, onReveal);
  }, []);

  const typewriter = useTypewriter(TYPEWRITER_LINE, 45, revealed);

  useEffect(() => {
    if (!typewriter.done) return;
    const t1 = setTimeout(() => setShowToast(true), 800);
    const t2 = setTimeout(() => setPulseCta(true), 400);
    const t3 = setTimeout(() => setShowScrollHint(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [typewriter.done]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">

      {/* ─── Floating glow orb ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 h-[600px] w-[600px] opacity-20 animate-[drift_20s_ease-in-out_infinite]"
          style={{
            background: "radial-gradient(circle at center, rgba(59,130,246,0.4) 0%, transparent 70%)",
          }}
        />
        <div className="absolute -bottom-48 -right-48 h-[500px] w-[500px] opacity-15 animate-[drift_25s_ease-in-out_infinite_reverse]"
          style={{
            background: "radial-gradient(circle at center, rgba(16,185,129,0.3) 0%, transparent 70%)",
          }}
        />
        <style>{`
          @keyframes drift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(80px, -60px) scale(1.1); }
            50% { transform: translate(-40px, 40px) scale(0.9); }
            75% { transform: translate(60px, 20px) scale(1.05); }
          }
        `}</style>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

      {/* ─── Welcome toast ─── */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-500 ease-out-expo ${
          showToast ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-slate-800/90 backdrop-blur-md px-5 py-3 shadow-2xl">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm text-slate-200">
            <span className="font-semibold text-white">3 investors</span> matched to your industry
          </span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 w-full">
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-900 ease-out-expo ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm font-medium text-blue-200 mb-8">
            AI-Powered Startup Funding on Stellar
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Raise capital. Invest in startups.{' '}
            <span className="text-blue-400">Build on-chain.</span>
          </h1>

          {/* ─── Typewriter subtitle ─── */}
          <div className="mt-4 h-7 flex items-center justify-center">
            <span className="text-lg text-slate-400 font-mono">
              {typewriter.display}
              {!typewriter.done && (
                <span className="inline-block w-[2px] h-5 bg-blue-400 ml-0.5 animate-pulse align-middle" />
              )}
            </span>
          </div>

          <p className="mt-4 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
            Ondex connects founders with aligned investors through AI matchmaking
            and transparent milestone-based escrow on Stellar. No blind reviews.
            No human jury. Just smart matching and on-chain trust.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            {/* ─── Pulse ring CTA ─── */}
            <div className="relative">
              {pulseCta && (
                <span className="absolute inset-0 rounded-lg animate-ping bg-blue-500/40" />
              )}
              <button
                onClick={connect}
                disabled={isConnecting}
                className="relative rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
            <Link
              href="/how-it-works"
              className="rounded-lg border border-white/20 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* ─── Animated stat counters ─── */}
        <div
          className={`mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto transition-all duration-900 delay-400 ease-out-expo ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {STATS.map((stat) => {
            const counter = useCounter(stat.end, 1500, revealed);
            return (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white tabular-nums">
                  {stat.prefix}{counter}{stat.suffix}
                </div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Scroll-down indicator ─── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ease-out-expo ${
          showScrollHint ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center gap-1.5 text-slate-500">
          <span className="text-[11px] uppercase tracking-[0.15em]">Scroll</span>
          <svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
