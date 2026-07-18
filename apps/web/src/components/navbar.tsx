"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/providers/wallet";
import { cn, formatAddress } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/startup", label: "Startup" },
  { href: "/jury", label: "Jury" },
  { href: "/investor", label: "Investor" },
];

export function Navbar() {
  const { address, walletName, connect, disconnect, isConnecting } = useWallet();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-lg font-bold text-white">
              O
            </div>
            <span className="text-lg font-semibold text-text-primary">Ondex</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-card"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {address ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-xs text-text-secondary">{walletName}</span>
                <span className="text-sm font-mono text-text-primary">
                  {formatAddress(address)}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="rounded-md p-2 text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                title="Disconnect"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="btn-primary"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-md p-2 text-text-secondary hover:text-text-primary"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium",
                  pathname.startsWith(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            {address && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary">
                <span className="font-mono">{formatAddress(address)}</span>
                <button onClick={disconnect} className="text-danger hover:underline">
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
