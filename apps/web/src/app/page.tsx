import Link from "next/link";
import { ArrowRight, Shield, Coins, Users } from "lucide-react";

const roles = [
  {
    icon: Coins,
    title: "Startup",
    description: "Apply for funding, track milestones, and receive payments as you deliver.",
    href: "/startup",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Jury",
    description: "Review applications, cast binding votes, and ensure quality funding decisions.",
    href: "/jury",
    color: "text-success",
  },
  {
    icon: Users,
    title: "Investor",
    description: "Browse approved campaigns, deposit funds, and track your investments.",
    href: "/investor",
    color: "text-warning",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Decentralized Startup Funding
        </h1>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Ondex connects startups with investors through transparent, milestone-based
          escrow powered by Soroban smart contracts on Stellar.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="group card hover:bg-card-hover transition-all duration-200 hover:border-accent/30"
          >
            <role.icon className={`h-10 w-10 ${role.color} mb-4`} />
            <h3 className="text-xl font-semibold text-text-primary mb-2">{role.title}</h3>
            <p className="text-sm text-text-secondary mb-4">{role.description}</p>
            <span className="inline-flex items-center gap-1 text-sm text-accent group-hover:gap-2 transition-all">
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-16 card text-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Powered by Stellar + Soroban
        </h2>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">
          All transactions are signed by your wallet and recorded on-chain.
          No central authority controls your funds — smart contracts enforce
          the rules transparently.
        </p>
      </div>
    </div>
  );
}
