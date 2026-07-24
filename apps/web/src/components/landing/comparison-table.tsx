import { Check, X } from "lucide-react";

const rows = [
  { label: "Platform fees", ondex: "0% for investors", trad: "5–15% carry", vc: "2/20 model" },
  { label: "Time to fund", ondex: "2–4 weeks", trad: "6–12 months", vc: "3–9 months" },
  { label: "AI matchmaking", ondex: <Check className="h-4 w-4 text-emerald-500" />, trad: <X className="h-4 w-4 text-red-400" />, vc: <X className="h-4 w-4 text-red-400" /> },
  { label: "On-chain escrow", ondex: <Check className="h-4 w-4 text-emerald-500" />, trad: <X className="h-4 w-4 text-red-400" />, vc: <X className="h-4 w-4 text-red-400" /> },
  { label: "Milestone-based release", ondex: <Check className="h-4 w-4 text-emerald-500" />, trad: <X className="h-4 w-4 text-red-400" />, vc: "Negotiated" },
  { label: "Blind review", ondex: <Check className="h-4 w-4 text-emerald-500" />, trad: <X className="h-4 w-4 text-red-400" />, vc: <X className="h-4 w-4 text-red-400" /> },
  { label: "Global access", ondex: <Check className="h-4 w-4 text-emerald-500" />, trad: "Regional", vc: "Network-based" },
  { label: "Investor cost", ondex: "Free", trad: "LP fees", vc: "Fund minimums" },
];

export default function ComparisonTable() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Comparison</p>
          <h2 className="section-heading mt-2">Why Ondex wins</h2>
          <p className="section-subheading">
            Traditional fundraising is slow, opaque, and expensive. Ondex is fast, transparent, and fair.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-sm font-semibold text-slate-500 pb-4 pr-6" />
                <th className="text-left text-sm font-bold text-blue-600 pb-4 pr-6">Ondex</th>
                <th className="text-left text-sm font-semibold text-slate-500 pb-4 pr-6">Traditional</th>
                <th className="text-left text-sm font-semibold text-slate-500 pb-4">Venture Capital</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-slate-200">
                  <td className="py-4 pr-6 text-sm font-medium text-slate-900">{row.label}</td>
                  <td className="py-4 pr-6 text-sm text-slate-700">{row.ondex}</td>
                  <td className="py-4 pr-6 text-sm text-slate-500">{row.trad}</td>
                  <td className="py-4 text-sm text-slate-500">{row.vc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm text-blue-700">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Every comparison based on public market data. Your results may vary.
          </div>
        </div>
      </div>
    </section>
  );
}
