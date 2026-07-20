"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@/providers/wallet";
import { useAuth } from "@/providers/auth";
import type { UserRole } from "@/lib/auth-types";
import { cn, formatAddress } from "@/lib/utils";
import { fundTestnetAccount } from "@/lib/tx";
import { useToast } from "@/components/ui/toast";
import { Logo } from "@/components/logo";
import { INTRO_REPLAY_EVENT } from "@/components/landing/intro-splash";
import { LogOut, Menu, X, Droplets, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const ROLE_DASHBOARD: Record<UserRole, string> = {
  founder: "/startup",
  investor: "/investor",
  jury: "/jury",
};

const GUEST_LINKS = [
  { href: "/for/startups", label: "Startup" },
  { href: "/for/jury", label: "Jury" },
  { href: "/for/investors", label: "Investor" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const { address, walletName } = useWallet();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [funding, setFunding] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  const navLinks = useMemo(() => {
    if (!user?.role) return GUEST_LINKS;
    return [
      { href: ROLE_DASHBOARD[user.role], label: "Dashboard" },
      { href: "/admin", label: "Admin" },
    ];
  }, [user?.role]);

  const handleHomeLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new Event(INTRO_REPLAY_EVENT));
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFund = async () => {
    if (!address) return;
    setFunding(true);
    try {
      const result = await fundTestnetAccount(address);
      if (result === "already-funded") {
        addToast({
          title: "Already funded",
          description: "Your account is already funded on testnet.",
          variant: "warning",
        });
      } else {
        addToast({
          title: "Account funded",
          description: "Your testnet account has been funded successfully.",
          variant: "success",
        });
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Friendbot funding failed:", err);
      addToast({
        title: "Funding failed",
        description: err?.message || "Try again in a few seconds.",
        variant: "error",
      });
    } finally {
      setFunding(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        isHome
          ? cn(
              "backdrop-blur-md border-b",
              scrolled
                ? "border-white/[0.09] bg-background/85"
                : "border-transparent bg-background/50"
            )
          : "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={handleHomeLogoClick}
            className="flex items-center gap-2"
            aria-label="Ondex home"
          >
            <Logo priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-mint/10 text-mint"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {address ? (
            <>
              <button
                onClick={handleFund}
                disabled={funding}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-background/50 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                title="Fund testnet account via Friendbot"
              >
                {funding ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Droplets className="h-3 w-3" />
                )}
                {funding ? "Funding..." : "Fund Testnet"}
              </button>
              <div className="hidden sm:flex items-center gap-2 rounded-md border border-border-strong bg-background/50 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-mint" />
                <span className="text-xs text-text-secondary">{walletName}</span>
                <span className="text-sm font-mono text-text-primary">
                  {formatAddress(address)}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="rounded-md p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-cta-primary">
              Log in
            </Link>
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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="space-y-1 px-6 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium",
                  pathname.startsWith(link.href)
                    ? "bg-mint/10 text-mint"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            {address && (
              <div className="space-y-2 px-3 py-2 text-sm">
                <button
                  onClick={handleFund}
                  disabled={funding}
                  className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
                >
                  {funding ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Droplets className="h-3 w-3" />
                  )}
                  {funding ? "Funding..." : "Fund Testnet Account"}
                </button>
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="font-mono">{formatAddress(address)}</span>
                  <button onClick={() => logout()} className="text-danger hover:underline">
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
