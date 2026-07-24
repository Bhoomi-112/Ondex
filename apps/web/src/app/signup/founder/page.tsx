"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { Loader2, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FounderSignupPage() {
  const { loginWithWallet, user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    industryTags: "",
    fundingAsk: "",
  });

  if (user?.role === "founder") {
    router.replace("/startup");
    return null;
  }

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      setError("Startup name and description are required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await loginWithWallet();
      router.push("/startup/apply");
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Register as Founder</h1>
              <p className="text-sm text-slate-500">Create your startup profile</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Startup Name *</label>
              <input className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Startup" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea className="input w-full min-h-[80px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does your startup do?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry Tags</label>
              <input className="input w-full" value={form.industryTags} onChange={(e) => setForm({ ...form, industryTags: e.target.value })} placeholder="defi, blockchain, fintech" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Funding Ask (XLM)</label>
              <input className="input w-full" type="number" value={form.fundingAsk} onChange={(e) => setForm({ ...form, fundingAsk: e.target.value })} placeholder="10000" />
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
