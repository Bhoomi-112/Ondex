"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { Loader2, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InvestorSignupPage() {
  const { loginWithWallet, user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    preferredIndustries: "",
    minTicket: "",
    maxTicket: "",
    preferredStage: "",
  });

  if (user?.role === "investor") {
    router.replace("/investor");
    return null;
  }

  const handleSubmit = async () => {
    if (!form.preferredIndustries) {
      setError("Preferred industries is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await loginWithWallet();
      router.push("/investor");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-lg px-4">
        <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Register as Investor</h1>
              <p className="text-sm text-slate-500">Set your investment preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Industries *</label>
              <input className="input w-full" value={form.preferredIndustries} onChange={(e) => setForm({ ...form, preferredIndustries: e.target.value })} placeholder="defi, blockchain, fintech" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Ticket (XLM)</label>
                <input className="input w-full" type="number" value={form.minTicket} onChange={(e) => setForm({ ...form, minTicket: e.target.value })} placeholder="1000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Ticket (XLM)</label>
                <input className="input w-full" type="number" value={form.maxTicket} onChange={(e) => setForm({ ...form, maxTicket: e.target.value })} placeholder="100000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Stage</label>
              <input className="input w-full" value={form.preferredStage} onChange={(e) => setForm({ ...form, preferredStage: e.target.value })} placeholder="seed, series-a, growth" />
            </div>

            <button onClick={handleSubmit} disabled={busy} className="btn-primary w-full mt-2">
              {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> : "Connect Wallet & Register"}
            </button>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
