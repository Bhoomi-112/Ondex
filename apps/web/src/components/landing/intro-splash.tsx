"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const INTRO_REPLAY_EVENT = "ondex-intro-replay";
export const SPLASH_LEAVING_EVENT = "ondex-splash-leaving";
export const SPLASH_DONE_EVENT = "ondex-splash-done";

const CONTAINER_ASPECT = 890 / 684;
const X_LEFT_PERCENT = ((748 - 70) / 890) * 100;
const HOLD_MS = 2100;

export default function IntroSplash() {
  const [playId, setPlayId] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setLeaving(false);
    setHidden(false);
    const t = setTimeout(() => {
      setLeaving(true);
      window.dispatchEvent(new CustomEvent(SPLASH_LEAVING_EVENT));
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [playId]);

  useEffect(() => {
    const replay = () => setPlayId((id) => id + 1);
    window.addEventListener(INTRO_REPLAY_EVENT, replay);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, replay);
  }, []);

  const handleTransitionEnd = () => {
    if (leaving) {
      setHidden(true);
      window.dispatchEvent(new CustomEvent(SPLASH_DONE_EVENT));
    }
  };

  if (hidden) return null;

  return (
    <div
      key={playId}
      onTransitionEnd={handleTransitionEnd}
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${
        leaving ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 animate-[gridIn_1.2s_ease_forwards_0.2s]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
        }}
      />

      <div
        className="relative"
        style={{ width: "min(78vw, 890px)", aspectRatio: `${CONTAINER_ASPECT}` }}
      >
        <Image
          src="/ondex-logo-onde.png"
          alt="Ond"
          fill
          priority
          sizes="min(78vw, 890px)"
          className="!w-auto h-full object-contain object-left opacity-0 animate-[rise_0.7s_cubic-bezier(.2,.9,.2,1)_forwards_0.25s]"
          style={{ left: 0 }}
        />
        <Image
          src="/ondex-logo-x.png"
          alt="x."
          fill
          priority
          sizes="min(78vw, 890px)"
          className="!w-auto h-full object-contain opacity-0 [animation:slideX_0.85s_cubic-bezier(.16,.9,.28,1)_forwards_0.55s,settle_0.5s_ease_forwards_1.4s]"
          style={{ left: `${X_LEFT_PERCENT}%` }}
        />
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[13px] uppercase tracking-[0.14em] text-gray-400 opacity-0 animate-[rise_0.6s_ease_forwards_1.6s] whitespace-nowrap">
        Decentralized startup funding on Stellar
      </div>
    </div>
  );
}
