"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  checkAdminStatus,
  searchUsers,
  adminAssignRole,
} from "@/lib/auth-api";
import { formatAddress } from "@/lib/utils";
import { Shield, Search, Loader2, XCircle } from "lucide-react";

export default function AdminPanel() {
  const { address, connect, isConnecting } = useWallet();
  const { addToast } = useToast();

  const [phase, setPhase] = useState<"loading" | "no-wallet" | "unauthorized" | "ready">("loading");

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string; wallet: string | null; email: string | null;
    displayName: string | null; role: string | null; onboardingStatus: string;
  }>>([]);
  const [searching, setSearching] = useState(false);
  const [assignBusy, setAssignBusy] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { isAdmin } = await checkAdminStatus();
        if (isAdmin) {
          setPhase("ready");
        } else if (!address) {
          setPhase("no-wallet");
        } else {
          setPhase("unauthorized");
        }
      } catch {
        if (!address) {
          setPhase("no-wallet");
        } else {
          setPhase("unauthorized");
        }
      }
    })();
  }, [address]);

  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 2) return;
    setSearching(true);
    try {
      const { users } = await searchUsers(q);
      setSearchResults(users);
    } catch (err) {
      addToast({ title: "Search failed", description: String(err), variant: "error" });
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async (userId: string, role: "founder" | "jury" | "investor") => {
    setAssignBusy(userId);
    try {
      await adminAssignRole(userId, role);
      addToast({
        title: "Role assigned",
        description: `User ${userId.slice(0, 8)}… is now ${role}`,
        variant: "success",
      });
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
    } catch (err) {
      addToast({ title: "Assignment failed", description: String(err), variant: "error" });
    } finally {
      setAssignBusy(null);
    }
  };

  if (phase === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  if (phase === "no-wallet") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <Shield className="mx-auto mb-4 h-12 w-12 text-text-muted" />
            <h2 className="mb-4 text-xl font-semibold text-text-primary">
              Connect Wallet
            </h2>
            <Button onClick={connect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect wallet"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "unauthorized") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-text-muted" />
            <h2 className="text-lg font-semibold text-text-primary">
              Page not found
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
            <Shield className="h-6 w-6 text-amber" />
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Wallet-gated. No public links.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {address ? formatAddress(address) : "—"}
        </Badge>
      </div>

      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-4 w-4" />
                Find User
              </CardTitle>
              <CardDescription>
                Search by wallet address, email, or display name.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="G... wallet, email, or name"
                  className="font-mono text-sm"
                />
                <Button onClick={handleSearch} disabled={query.trim().length < 2 || searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-text-muted">{searchResults.length} result(s)</p>
              {searchResults.map((u) => (
                <Card key={u.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium text-text-primary">
                          {u.displayName || "Unnamed"}
                        </p>
                        {u.wallet && (
                          <p className="truncate font-mono text-xs text-text-secondary">
                            {u.wallet}
                          </p>
                        )}
                        {u.email && (
                          <p className="text-xs text-text-muted">{u.email}</p>
                        )}
                        <div className="flex gap-2">
                          <Badge variant={u.role ? "success" : "secondary"} className="text-[10px]">
                            {u.role || "no role"}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {u.onboardingStatus}
                          </Badge>
                        </div>
                      </div>
                      {u.role !== "founder" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssign(u.id, "founder")}
                          disabled={assignBusy === u.id}
                          className="shrink-0"
                        >
                          {assignBusy === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Set Founder"
                          )}
                        </Button>
                      )}
                      {u.role !== "jury" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssign(u.id, "jury")}
                          disabled={assignBusy === u.id}
                          className="shrink-0"
                        >
                          {assignBusy === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Set Jury"
                          )}
                        </Button>
                      )}
                      {u.role !== "investor" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssign(u.id, "investor")}
                          disabled={assignBusy === u.id}
                          className="shrink-0"
                        >
                          {assignBusy === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Set Investor"
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
