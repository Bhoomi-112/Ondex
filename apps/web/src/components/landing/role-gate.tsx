"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";


export type RoleColor = "lavender" | "coral" | "amber";

export interface RoleGateConfig {
  role: "founder" | "jury" | "investor";
  roleLabel: string;
  eyebrow: string;
  headline: string;
  description: string;
  features: string[];
  color: RoleColor;
  icon: ReactNode;
}

const roleCtaMap: Record<
  RoleGateConfig["role"],
  { href: string; label: string; secondaryHref: string; secondaryLabel: string }
> = {
  founder: {
    href: "/apply-founder",
    label: "Apply as Founder",
    secondaryHref: "/login",
    secondaryLabel: "Log in",
  },
  investor: {
    href: "/apply-investor",
    label: "Apply as Investor",
    secondaryHref: "/login",
    secondaryLabel: "Log in",
  },
  jury: {
    href: "/apply-jury",
    label: "Apply as Jury",
    secondaryHref: "/login",
    secondaryLabel: "Log in (approved jurors)",
  },
};

const colorMap: Record<
  RoleColor,
  {
    accent: string;
    dim: string;
    bg: string;
    border: string;
    ring: string;
    badge: string;
  }
> = {
  lavender: {
    accent: "text-lavender",
    dim: "text-lavender-dim",
    bg: "bg-lavender",
    border: "border-lavender/20",
    ring: "ring-lavender/30",
    badge: "bg-lavender/10 text-lavender border-lavender/20",
  },
  coral: {
    accent: "text-coral",
    dim: "text-coral-dim",
    bg: "bg-coral",
    border: "border-coral/20",
    ring: "ring-coral/30",
    badge: "bg-coral/10 text-coral border-coral/20",
  },
  amber: {
    accent: "text-amber",
    dim: "text-amber-dim",
    bg: "bg-amber",
    border: "border-amber/20",
    ring: "ring-amber/30",
    badge: "bg-amber/10 text-amber border-amber/20",
  },
};

export default function RoleGatePage({ config }: { config: RoleGateConfig }) {
  const colors = colorMap[config.color];
  const cta = roleCtaMap[config.role];

  return (
    <div className="min-h-screen flex flex-col bg-background">


      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-16">
        <div className="max-w-[640px] w-full text-center">
          <div
            className={`mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-2xl border ${colors.border} bg-card`}
          >
            {config.icon}
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase mb-6 ${colors.badge}`}
          >
            {config.eyebrow}
          </div>

          <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-medium leading-[1.08] tracking-tight text-text-primary mb-5">
            {config.headline}
          </h1>

          <p className="text-[16.5px] text-text-secondary leading-relaxed max-w-[480px] mx-auto mb-10">
            {config.description}
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {config.features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-text-secondary"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={cta.href}
              className="btn-cta-primary px-8 py-3.5 text-[15px] inline-flex items-center gap-2"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={cta.secondaryHref}
              className="btn-cta-ghost px-8 py-3.5 text-[15px] inline-flex items-center gap-2"
            >
              {cta.secondaryLabel}
            </Link>
          </div>

          <div className="mt-8 mx-auto max-w-[420px] rounded-lg border border-border bg-card/50 px-4 py-3">
            <div className="flex items-start gap-2.5 text-left">
              <ShieldCheck className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <p className="text-[12.5px] leading-relaxed text-text-muted">
                Role is set once at signup and stored server-side. Access
                decisions use only the signed JWT role claim — never a client
                query param or localStorage value.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-6 md:px-12 py-6">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <span className="text-xs text-text-muted">
            © {new Date().getFullYear()} Ondex
          </span>
          <span className="text-xs text-text-muted">
            Powered by Stellar · Soroban
          </span>
        </div>
      </footer>
    </div>
  );
}
