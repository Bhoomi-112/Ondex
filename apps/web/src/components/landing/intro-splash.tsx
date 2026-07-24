"use client";

import { useEffect, useRef, useState } from "react";

export const INTRO_REPLAY_EVENT = "ondex-intro-replay";
export const SPLASH_LEAVING_EVENT = "ondex-splash-leaving";
export const SPLASH_DONE_EVENT = "ondex-splash-done";

const INTRO_VIDEO_SRC = "/intro.mp4";

export default function IntroSplash() {
  const [playId, setPlayId] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    window.dispatchEvent(new CustomEvent(SPLASH_LEAVING_EVENT));
  };

  useEffect(() => {
    setLeaving(false);
    setHidden(false);
    videoRef.current?.play().catch(() => {});
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

  const handleVideoEnd = () => dismiss();

  if (hidden) return null;

  return (
    <div
      key={playId}
      onTransitionEnd={handleTransitionEnd}
      onClick={dismiss}
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black cursor-pointer transition-transform duration-900 ease-out-quart ${
        leaving ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <video
        ref={videoRef}
        src={INTRO_VIDEO_SRC}
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[13px] uppercase tracking-[0.14em] text-gray-400 opacity-60 whitespace-nowrap pointer-events-none select-none">
        Click anywhere to skip
      </div>
    </div>
  );
}
