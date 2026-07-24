import { Eye, Lock, GitBranch, BarChart3, Brain, Coins } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Blind Review",
    description:
      "Startups can mask their name and wallet address during review — ensuring ideas are judged on merit, not identity.",
  },
  {
    icon: Lock,
    title: "Milestone Escrow",
    description:
      "Funds are locked in Soroban smart contracts. Release only happens on milestone completion with investor approval or timelock fallback.",
  },
  {
    icon: GitBranch,
    title: "Secondary Market",
    description:
      "Trade vested token positions with other accredited investors on our built-in secondary marketplace.",
  },
  {
    icon: BarChart3,
    title: "AI Matchmaking",
    description:
      "OpenAI embeddings analyze startup profiles and investor preferences — delivering match scores from 0-100.",
  },
  {
    icon: Brain,
    title: "AI Evaluation",
    description:
      "No human jury. Our AI agent scores applications on pitch quality, team strength, market opportunity, and traction.",
  },
  {
    icon: Coins,
    title: "Meeting Credits",
    description:
      "Startups buy meeting credits (XLM or platform tokens) to request calls with matched investors. Investors never pay.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Key Features</p>
          <h2 className="section-heading mt-2">
            Everything you need to fund and grow
          </h2>
          <p className="section-subheading">
            Built on Stellar for transparency, powered by AI for intelligence,
            designed for trust.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-item rounded-xl border border-slate-100 bg-white transition-all hover:shadow-md hover:border-slate-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
