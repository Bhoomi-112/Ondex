import RoleGatePage from "@/components/landing/role-gate";
import type { RoleGateConfig } from "@/components/landing/role-gate";

const investorConfig: RoleGateConfig = {
  role: "investor",
  roleLabel: "Investor",
  eyebrow: "For Investors",
  headline: "Discover vetted campaigns. Co-decide fund release. Grow.",
  description:
    "Browse jury-approved startup campaigns, deposit into Soroban escrow contracts, and participate in dispute resolution. Every release is on-chain, every milestone is transparent.",
  features: [
    "Curated campaign feed",
    "Escrow deposit controls",
    "Dispute window access",
    "Transparent on-chain ledger",
  ],
  color: "amber",
  icon: (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Rising bar chart — portfolio growth motif */}
      <rect x="8" y="36" width="8" height="12" rx="1.5" fill="#f0c96b" opacity="0.3" />
      <rect x="20" y="28" width="8" height="20" rx="1.5" fill="#f0c96b" opacity="0.5" />
      <rect x="32" y="20" width="8" height="28" rx="1.5" fill="#f0c96b" opacity="0.7" />
      <rect x="44" y="10" width="8" height="38" rx="1.5" fill="#f0c96b" opacity="0.9" />
      {/* Trend line */}
      <path
        d="M12 34L24 26L36 18L48 8"
        stroke="#f0c96b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Arrow head on trend */}
      <path
        d="M44 8L50 8M50 8L50 2"
        stroke="#f0c96b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  ),
};

export default function InvestorsLoginPage() {
  return <RoleGatePage config={investorConfig} />;
}
