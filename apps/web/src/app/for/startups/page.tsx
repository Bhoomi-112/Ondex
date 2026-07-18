import RoleGatePage from "@/components/landing/role-gate";
import type { RoleGateConfig } from "@/components/landing/role-gate";

const startupConfig: RoleGateConfig = {
  role: "founder",
  roleLabel: "Startup Founder",
  eyebrow: "For Founders",
  headline: "Raise capital. Deliver milestones. Build on-chain.",
  description:
    "Submit your pitch, define milestone-based funding rounds, and let transparent escrow contracts unlock capital as you deliver — judged by a blind jury, enforced by Soroban.",
  features: [
    "Blind identity review",
    "Milestone-linked escrow",
    "On-chain funding status",
    "72h dispute window",
  ],
  color: "lavender",
  icon: (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ascending blocks — growth/building motif */}
      <rect x="8" y="38" width="12" height="12" rx="2" fill="#a3a1f2" opacity="0.25" />
      <rect x="22" y="28" width="12" height="22" rx="2" fill="#a3a1f2" opacity="0.5" />
      <rect x="36" y="16" width="12" height="34" rx="2" fill="#a3a1f2" opacity="0.85" />
      {/* Upward arrow */}
      <path
        d="M42 12L42 6M42 6L48 12M42 6L36 12"
        stroke="#a3a1f2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function StartupsLoginPage() {
  return <RoleGatePage config={startupConfig} />;
}
