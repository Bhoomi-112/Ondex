"use client";

import Link from "next/link";
import { Building2, Scale, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const roles = [
  {
    key: "founder",
    label: "Founder",
    href: "/for/startups",
    icon: Building2,
    color: "lavender",
    description: "Raise capital via milestone-based escrow. Blind jury review, transparent funding.",
    features: ["Blind identity review", "Milestone-linked escrow", "72h dispute window"],
  },
  {
    key: "juror",
    label: "Juror",
    href: "/for/jury",
    icon: Scale,
    color: "coral",
    description: "Review proposals blind, stake assets to vote, earn for integrity. Slashing for dishonest votes.",
    features: ["Identity-masked reviews", "Stake-weighted voting", "Majority-gated release"],
  },
  {
    key: "investor",
    label: "Investor",
    href: "/for/investors",
    icon: TrendingUp,
    color: "amber",
    description: "Browse jury-approved campaigns, deposit into Soroban escrow, participate in dispute resolution.",
    features: ["Curated campaign feed", "Escrow deposit controls", "Dispute window access"],
  },
] as const;

const colorStyles: Record<
  (typeof roles)[number]["color"],
  { badge: string; iconBg: string; iconColor: string; border: string; hoverBorder: string }
> = {
  lavender: {
    badge: "bg-lavender/10 text-lavender border-lavender/20",
    iconBg: "bg-lavender/10",
    iconColor: "text-lavender",
    border: "border-lavender/20",
    hoverBorder: "hover:border-lavender/40",
  },
  coral: {
    badge: "bg-coral/10 text-coral border-coral/20",
    iconBg: "bg-coral/10",
    iconColor: "text-coral",
    border: "border-coral/20",
    hoverBorder: "hover:border-coral/40",
  },
  amber: {
    badge: "bg-amber/10 text-amber border-amber/20",
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    border: "border-amber/20",
    hoverBorder: "hover:border-amber/40",
  },
};

interface RolePickerProps {
  heroRevealed: boolean;
  isAuthenticated: boolean;
}

export function RolePicker({ heroRevealed, isAuthenticated }: RolePickerProps) {
  const [mounted, setMounted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!mounted || !heroRevealed || isAuthenticated) {
    return null;
  }

  return (
    <section
      id="roles"
      className="relative px-6 md:px-12 py-20"
      role="region"
      aria-label="Choose your role"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal-block text-center mb-16" style={{ transitionDelay: prefersReduced ? "0s" : "0.1s" }}>
          <div className="kicker text-mint text-xs tracking-widest uppercase mb-4">
            Who are you?
          </div>
          <h2 className="heading-display text-[clamp(28px,3.4vw,44px)] max-w-[760px] leading-tight mx-auto">
            Ondex works differently for each role. Pick yours to learn more.
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          role="list"
          aria-label="Role options"
        >
          {roles.map((role, index) => {
            const colors = colorStyles[role.color];
            const Icon = role.icon;
            const delay = prefersReduced ? 0 : 0.15 + index * 0.1;

            return (
              <Link
                key={role.key}
                href={role.href}
                className={cn(
                  "group relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 ease-[cubic-bezier(.22,.9,.3,1)]",
                  "bg-background border",
                  colors.border,
                  colors.hoverBorder,
                  "hover:shadow-xl hover:shadow-mint/5 hover:-translate-y-1",
                  "reveal-block",
                  index === 0 ? "d1" : index === 1 ? "d2" : "d3"
                )}
                style={{ transitionDelay: `${delay}s` }}
                role="listitem"
              >
                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-xl",
                    colors.iconBg
                  )}
                >
                  <Icon className={cn("h-7 w-7", colors.iconColor)} aria-hidden="true" />
                </div>

                <h3 className="font-serif text-xl font-medium text-text-primary mb-3">
                  {role.label}
                </h3>

                <p className="text-[15px] text-text-secondary leading-relaxed mb-6 flex-1">
                  {role.description}
                </p>

                <ul className="space-y-2 mb-6" role="list">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[13.5px] text-text-secondary">
                      <span className={cn("flex-shrink-0 h-1.5 w-1.5 rounded-full mt-2", colors.iconColor.replace("text-", "bg-"))} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-sm font-medium text-text-primary">
                    Learn more
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase transition-colors",
                      colors.badge
                    )}
                  >
                    {role.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
