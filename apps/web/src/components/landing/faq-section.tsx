"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the AI matchmaking work?",
    a: "Our engine generates embeddings from startup profiles (industry tags, description, funding stage, location) and investor preferences. We compute cosine similarity to produce a match score from 0–100. The higher the score, the stronger the alignment.",
  },
  {
    q: "What does it cost to use Ondex?",
    a: "Investors browse and match for free. Startups pay meeting credits to schedule calls with investors. Credit price is set by the platform admin and stored on-chain. There are no hidden fees, no carry, and no LP commitments.",
  },
  {
    q: "How does milestone-based escrow work?",
    a: "Startups create milestones during onboarding. Investors deposit the full amount into a Soroban smart contract. When a milestone is complete, the startup requests release. The investor has a dispute window (configurable by admin) to reject. If no action is taken within the window, funds auto-release.",
  },
  {
    q: "Is my startup's idea protected?",
    a: "Yes. Startups can opt into blind review, masking their name and wallet address during evaluation. No PII is stored on-chain. KYC data is encrypted off-chain in our backend, keyed only to a hash of your wallet address.",
  },
  {
    q: "What blockchain is Ondex built on?",
    a: "Stellar Soroban. We chose Stellar for its low fees (~0.00001 XLM per tx), fast finality (~5 seconds), and the Soroban smart contract platform which gives us programmable escrow without Ethereum-level gas costs.",
  },
  {
    q: "Do investors need to pass KYC?",
    a: "Yes, once an investor decides to fund a startup. KYC is handled off-chain through our backend. Documents are encrypted at rest and never stored on-chain. Only a hash of your wallet address links your identity — your address itself is never the key.",
  },
  {
    q: "What happens if an investor disputes a milestone?",
    a: "The dispute is logged on-chain and the funds remain locked in escrow. Both parties are notified. If unresolved, the admin can intervene based on the proof submitted. This is intentionally rare — most releases are approved within hours.",
  },
  {
    q: "Can I use Ondex outside the US?",
    a: "Yes. Ondex is global by design — Stellar operates worldwide. However, compliance with local securities laws is your responsibility. We recommend consulting legal counsel before raising or investing across borders.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="section-heading mt-2">Frequently asked questions</h2>
          <p className="section-subheading">
            Everything you need to know about Ondex, escrow, and AI matchmaking.
          </p>
        </div>

        <div className="mt-14 mx-auto max-w-3xl divide-y divide-slate-200">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out-expo ${
                    isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
