"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/providers/wallet";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  type: "startup" | "investor";
  label: string;
  connected: boolean;
  matchScore: number;
  pulse: number;
}

const STARTUP_NAMES = ["Nexus AI", "BlockPay", "DataVault", "GreenGrid", "MedSync", "CryptoLend"];
const INVESTOR_NAMES = ["a16z Ventures", "Pantera Capital", "Multicoin", "Paradigm", "Sequoia", "Coinbase"];

export default function InteractiveMatchDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredMatch, setHoveredMatch] = useState<{ startup: string; investor: string; score: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { connect, isConnecting } = useWallet();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const count = 14;

    for (let i = 0; i < count; i++) {
      const isStartup = i < count / 2;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: isStartup ? 14 + Math.random() * 4 : 12 + Math.random() * 4,
        type: isStartup ? "startup" : "investor",
        label: isStartup
          ? STARTUP_NAMES[i % STARTUP_NAMES.length]
          : INVESTOR_NAMES[i % INVESTOR_NAMES.length],
        connected: false,
        matchScore: Math.floor(Math.random() * 40) + 60,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    let mouseX = -1000, mouseY = -1000;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => { mouseX = -1000; mouseY = -1000; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = "rgba(148, 163, 184, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx + Math.sin(time + p.pulse) * 0.1;
        p.y += p.vy + Math.cos(time + p.pulse * 1.3) * 0.1;
        p.pulse += 0.02;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(10, Math.min(canvas.width - 10, p.x));
        p.y = Math.max(10, Math.min(canvas.height - 10, p.y));

        // Connection lines (startup -> investor)
        p.connected = false;
        for (const other of particles) {
          if (p.type === other.type) continue;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.connected = true;
            const alpha = (1 - dist / 200) * 0.4;
            const isHovered =
              Math.abs(mouseX - (p.x + other.x) / 2) < 80 &&
              Math.abs(mouseY - (p.y + other.y) / 2) < 80;

            if (isHovered) {
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 2})`;
              ctx.lineWidth = 2.5;
              const sName = p.type === "startup" ? p.label : other.label;
              const iName = p.type === "investor" ? p.label : other.label;
              setHoveredMatch({ startup: sName, investor: iName, score: p.matchScore });
            } else {
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        const isStartup = p.type === "startup";
        gradient.addColorStop(0, isStartup ? "rgba(37, 99, 235, 0.15)" : "rgba(16, 185, 129, 0.15)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (isStartup) {
          ctx.fillStyle = p.connected ? "rgba(37, 99, 235, 0.9)" : "rgba(37, 99, 235, 0.5)";
          ctx.strokeStyle = "rgba(37, 99, 235, 0.6)";
        } else {
          ctx.fillStyle = p.connected ? "rgba(16, 185, 129, 0.9)" : "rgba(16, 185, 129, 0.5)";
          ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
        }
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Pulse ring
        if (p.connected) {
          const pulseSize = p.radius + 4 + Math.sin(time * 3 + p.pulse) * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = isStartup
            ? `rgba(37, 99, 235, ${0.15 + Math.sin(time * 3 + p.pulse) * 0.1})`
            : `rgba(16, 185, 129, ${0.15 + Math.sin(time * 3 + p.pulse) * 0.1})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = p.connected ? "rgba(15, 23, 42, 0.9)" : "rgba(148, 163, 184, 0.6)";
        ctx.font = isStartup ? "600 10px Inter, sans-serif" : "500 9px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x, p.y + p.radius + 14);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [isVisible]);

  return (
    <section ref={containerRef} className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.3),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-6">
            Live Demo
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI matchmaking in action
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Hover the connecting lines to see match scores. Our engine computes compatibility in real-time.
          </p>
        </div>

        {/* Canvas */}
        <div className="mt-12 relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden" style={{ height: "420px" }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />

          {/* Legend */}
          <div className="absolute top-4 left-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-400">Startups</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400">Investors</span>
            </div>
          </div>

          {/* Hover tooltip */}
          {hoveredMatch && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-blue-500/30 bg-slate-900/90 backdrop-blur-md px-6 py-3 text-center shadow-2xl">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-blue-400 font-medium">{hoveredMatch.startup}</span>
                <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="text-emerald-400 font-medium">{hoveredMatch.investor}</span>
                <span className="mx-2 text-slate-600">|</span>
                <span className="text-white font-bold">{hoveredMatch.score}%</span>
                <span className="text-xs text-slate-500">match</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={connect}
            disabled={isConnecting}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet & Find Your Match"}
          </button>
          <Link
            href="/how-it-works"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all inline-flex items-center gap-1.5"
          >
            How matching works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
