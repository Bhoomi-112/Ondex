import RoleGatePage from "@/components/landing/role-gate";
import type { RoleGateConfig } from "@/components/landing/role-gate";

const juryConfig: RoleGateConfig = {
  role: "jury",
  roleLabel: "Jury Member",
  eyebrow: "For Jurors",
  headline: "Review blind. Stake honestly. Earn for integrity.",
  description:
    "Review startup proposals without bias — identities are masked on-chain. Stake real assets to vote, and trigger escrow releases when a majority agrees. Dissent from the majority faces slashing.",
  features: [
    "Identity-masked reviews",
    "Stake-weighted voting",
    "Majority-gated release",
    "Slashing for dishonest votes",
  ],
  color: "coral",
  icon: (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Balanced scales — evaluation motif */}
      {/* Central pillar */}
      <rect x="26.5" y="14" width="3" height="30" rx="1.5" fill="#e88a7d" opacity="0.6" />
      {/* Base */}
      <rect x="18" y="44" width="20" height="3" rx="1.5" fill="#e88a7d" opacity="0.4" />
      {/* Beam */}
      <rect x="10" y="13" width="36" height="2.5" rx="1.25" fill="#e88a7d" opacity="0.7" />
      {/* Left pan */}
      <path
        d="M10 15.5L6 32H18L14 15.5"
        fill="#e88a7d"
        opacity="0.3"
      />
      <path
        d="M10 15.5L6 32H18L14 15.5"
        stroke="#e88a7d"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Right pan */}
      <path
        d="M42 15.5L38 32H50L46 15.5"
        fill="#e88a7d"
        opacity="0.3"
      />
      <path
        d="M42 15.5L38 32H50L46 15.5"
        stroke="#e88a7d"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Top finial */}
      <circle cx="28" cy="11" r="3" fill="#e88a7d" opacity="0.8" />
    </svg>
  ),
};

export default function JuryLoginPage() {
  return <RoleGatePage config={juryConfig} />;
}
