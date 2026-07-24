"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { useWallet } from "@/providers/wallet";
import { Loader2, Wallet } from "lucide-react";

export default function LoginPage() {
  const { loginWithWallet, user } = useAuth();
  const { isConnecting } = useWallet();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user?.role) {
    const path = user.role === "founder" ? "/startup" : "/investor";
    router.replace(path);
    return null;
  }

  const handleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await loginWithWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900">Ondex</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Authenticate with your Stellar wallet to continue.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            onClick={handleLogin}
            disabled={busy || isConnecting}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
          >
            {busy || isConnecting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Wallet className="h-5 w-5" />
            )}
            {busy || isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              New here?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
          By connecting your wallet, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
