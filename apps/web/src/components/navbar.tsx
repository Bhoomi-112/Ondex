"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/providers/wallet";
import { useAuth } from "@/providers/auth";
import { cn, formatAddress } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  {
    label: "For Startups",
    href: "/for/startups",
  },
  {
    label: "For Investors",
    href: "/for/investors",
  },
  { href: "/startups", label: "Explore" },
];

export function Navbar() {
  const { address, walletName } = useWallet();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2" aria-label="Ondex home">
            <Logo imgClassName="h-7 w-7" />
            <span className={cn("text-lg font-bold tracking-tight", scrolled || !isHome ? "text-slate-900" : "text-white")}>
              Ondex
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-blue-600 bg-blue-50"
                    : scrolled || !isHome
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {address ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  scrolled || !isHome
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-white/90 hover:bg-white/10"
                )}
              >
                <span className="hidden sm:inline">{walletName || "Wallet"}</span>
                <span className="font-mono text-xs">{formatAddress(address)}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50">
                  {user?.role && (
                    <>
                      <Link
                        href={user.role === "founder" ? "/startup" : "/investor"}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="border-t border-slate-100" />
                    </>
                  )}
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-all",
                scrolled || !isHome
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              )}
            >
              Log in
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden rounded-md p-2",
              scrolled || !isHome ? "text-slate-600" : "text-white"
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium",
                  pathname.startsWith(link.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            {address && (
              <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                {user?.role && (
                  <Link
                    href={user.role === "founder" ? "/startup" : "/investor"}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
