"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionStatus } from "@/components/ui/transaction-status";
import {
  Shield,
  Users,
  Gavel,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  getJuryClient,
  getNetworkConfig,
  apiUrl,
} from "@/lib/contracts";
import { buildSignSubmit, signAndSendSorobanTx, getExplorerUrl } from "@/lib/tx";
import { formatAddress } from "@/lib/utils";
import { JuryApplicationsPanel } from "@/components/admin/jury-applications-panel";

type JurorRow = {
  address: string;
  xlmStake?: string | number | bigint;
  platformStake?: string | number | bigint;
  active?: boolean;
};

export default function AdminPage() {
  const { address, signTransaction, connect, isConnecting } = useWallet();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [onChainAdmin, setOnChainAdmin] = useState<string>("");
  const [jurySize, setJurySize] = useState(5);
  const [slashPct, setSlashPct] = useState<number | null>(null);
  const [jurors, setJurors] = useState<JurorRow[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [manualJuror, setManualJuror] = useState("");
  const [sponsorJuror, setSponsorJuror] = useState(
    "GAOX4AFHXOVTEH7FMKUDKJ5LFGDNVEET42C7N7ISL2KONGZJMGKIAOTX",
  );
  const [caseId, setCaseId] = useState("0");
  const [disputeWindowSecs, setDisputeWindowSecs] = useState("");
  const [txStatus, setTxStatus] = useState<
    "idle" | "signing" | "submitting" | "confirming" | "success" | "error"
  >("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const client = getJuryClient(address || undefined);
      try {
        const adminRes = await client.get_admin();
        const adminAddr = String(adminRes.result);
        setOnChainAdmin(adminAddr);
        setIsAdmin(!!address && address === adminAddr);
      } catch {
        setOnChainAdmin("");
        setIsAdmin(false);
      }

      try {
        const sizeRes = await client.get_jury_size();
        setJurySize(Number(sizeRes.result));
      } catch {
        /* keep default until chain ready */
      }

      try {
        const slashRes = await client.get_slash_pct();
        setSlashPct(Number(slashRes.result));
      } catch {
        setSlashPct(null);
      }

      const res = await fetch(apiUrl("/api/v1/jurors?limit=100&active=true"));
      if (res.ok) {
        const data = (await res.json()) as {
          items?: Array<{
            address?: string;
            xlmStake?: string | number;
            platformStake?: string | number;
            active?: boolean;
          }>;
        };
        setJurors(
          (data.items || [])
            .filter((j) => j.address)
            .map((j) => ({
              address: j.address as string,
              xlmStake: j.xlmStake,
              platformStake: j.platformStake,
              active: j.active,
            })),
        );
      } else {
        setJurors([]);
      }

    } catch (err) {
      console.error("Admin load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_DISPUTE_WINDOW_SECS;
    if (fromEnv) setDisputeWindowSecs(fromEnv);
  }, []);

  const toggleJuror = (addr: string) => {
    setSelected((prev) => {
      if (prev.includes(addr)) return prev.filter((a) => a !== addr);
      if (prev.length >= jurySize) {
        addToast({
          title: "Jury full",
          description: `Select exactly ${jurySize} jurors (on-chain jury_size).`,
          variant: "warning",
        });
        return prev;
      }
      return [...prev, addr];
    });
  };

  const addManual = () => {
    const a = manualJuror.trim();
    if (!a.startsWith("G") || a.length < 56) {
      addToast({
        title: "Invalid address",
        description: "Enter a Stellar public key (G...).",
        variant: "error",
      });
      return;
    }
    if (!selected.includes(a) && selected.length < jurySize) {
      setSelected((p) => [...p, a]);
    }
    if (!jurors.some((j) => j.address === a)) {
      setJurors((p) => [...p, { address: a }]);
    }
    setManualJuror("");
  };

  const handleSponsorRegister = async () => {
    if (!address || !isAdmin) return;
    const juror = sponsorJuror.trim();
    if (!juror.startsWith("G") || juror.length < 56) {
      addToast({
        title: "Invalid juror",
        description: "Enter a Stellar public key (G...).",
        variant: "error",
      });
      return;
    }

    setTxStatus("signing");
    setTxError(undefined);

    try {
      const jury = getJuryClient(address);
      const mins = await jury.get_min_stakes();
      const [minXlm, minPlatform] = mins.result as readonly [bigint, bigint];

      setTxStatus("submitting");
      const result = await signAndSendSorobanTx(
        await jury.register_sponsored({
          juror,
          xlm_stake: minXlm,
          platform_stake: minPlatform,
        }),
        signTransaction,
        address,
      );

      setTxHash(result.hash);
      setTxStatus("success");

      // Keep local list for assign UI even if indexer lags
      if (!jurors.some((j) => j.address === juror)) {
        setJurors((p) => [...p, { address: juror, active: true }]);
      }
      if (!selected.includes(juror) && selected.length < jurySize) {
        setSelected((p) => [...p, juror]);
      }

      addToast({
        title: "Juror registered (sponsored)",
        description: `${formatAddress(juror)} is on-chain. Admin paid min stake.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });
      load();
    } catch (err: unknown) {
      setTxStatus("error");
      const msg = err instanceof Error ? err.message : String(err);
      setTxError(msg);
      addToast({ title: "Sponsor register failed", description: msg, variant: "error" });
    }
  };

  const handleAssign = async () => {
    if (!address || !isAdmin) return;

    const cid = parseInt(caseId, 10);
    const windowSecs = parseInt(disputeWindowSecs, 10);
    if (Number.isNaN(cid) || cid < 0) {
      addToast({
        title: "Invalid case id",
        description: "Case id must be a non-negative integer.",
        variant: "error",
      });
      return;
    }
    if (!windowSecs || windowSecs <= 0) {
      addToast({
        title: "Dispute window required",
        description: "Set dispute_window_secs > 0 (admin-chosen, not hardcoded).",
        variant: "error",
      });
      return;
    }
    if (selected.length !== jurySize) {
      addToast({
        title: "Wrong panel size",
        description: `Select exactly ${jurySize} registered jurors.`,
        variant: "error",
      });
      return;
    }

    setTxStatus("signing");
    setTxError(undefined);

    try {
      setTxStatus("submitting");
      const result = await signAndSendSorobanTx(
        await getJuryClient(address).assign({
          case_id: cid,
          jurors: selected,
          dispute_window_secs: BigInt(windowSecs),
        }),
        signTransaction,
        address,
      );

      setTxHash(result.hash);
      setTxStatus("success");
      addToast({
        title: "Jurors assigned",
        description: `Case #${cid}: ${selected.length} jurors, window ${windowSecs}s.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });
    } catch (err: unknown) {
      setTxStatus("error");
      const msg = err instanceof Error ? err.message : String(err);
      setTxError(msg);
      addToast({
        title: "Assign failed",
        description: msg,
        variant: "error",
      });
    }
  };

  if (!address) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card className="mx-auto max-w-sm">
          <CardContent className="py-12 space-y-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Connect the admin wallet
            </h2>
            <p className="text-text-secondary text-sm">
              The admin wallet address is configured in <code className="font-mono">ADMIN_ADDRESS</code> env var.
              Required for on-chain operations.
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect wallet"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Not contract admin
            </h2>
            {address && (
              <p className="text-text-secondary mb-2">
                Connected:{" "}
                <span className="font-mono text-text-primary">
                  {formatAddress(address)}
                </span>
              </p>
            )}
            {onChainAdmin && (
              <p className="text-text-secondary text-sm">
                On-chain admin:{" "}
                <span className="font-mono">{formatAddress(onChainAdmin)}</span>
              </p>
            )}
            {!onChainAdmin && (
              <p className="text-text-muted text-sm mt-4">
                Could not read admin (contract not initialized or env IDs wrong).
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Admin — Jury Assign
        </h1>
        <p className="text-text-secondary mt-1">
          Assign registered jurors to a case with a per-case dispute window.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Admin
          </Badge>
          <Badge variant="secondary">jury_size={jurySize}</Badge>
          {slashPct != null && (
            <Badge variant="secondary">slash_pct={slashPct}%</Badge>
          )}
        </div>
      </div>

      {txStatus !== "idle" && (
        <Card className="mb-6">
          <CardContent>
            <TransactionStatus
              status={txStatus}
              txHash={txHash}
              error={txError}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <JuryApplicationsPanel />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sponsor-register juror
            </CardTitle>
            <CardDescription>
              Admin pays the on-chain min stake (XLM + platform) and registers a
              juror without their signature. Admin wallet must hold both assets
              and an ONDEX trustline if needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sponsorJuror">Juror public key</Label>
              <Input
                id="sponsorJuror"
                value={sponsorJuror}
                onChange={(e) => setSponsorJuror(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <Button
              type="button"
              onClick={handleSponsorRegister}
              disabled={txStatus !== "idle" || !address}
            >
              {txStatus !== "idle"
                ? "Submitting..."
                : !address
                  ? "Connect admin wallet first"
                  : "Register juror (sponsored)"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Case parameters
            </CardTitle>
            <CardDescription>
              All values are admin-chosen — nothing hardcoded in the contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseId">Case ID</Label>
                <Input
                  id="caseId"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="window">Dispute window (seconds)</Label>
                <Input
                  id="window"
                  value={disputeWindowSecs}
                  onChange={(e) => setDisputeWindowSecs(e.target.value)}
                  inputMode="numeric"
                  placeholder="e.g. 259200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select jurors ({selected.length}/{jurySize})
            </CardTitle>
            <CardDescription>
              Only registered on-chain jurors can be assigned.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={manualJuror}
                onChange={(e) => setManualJuror(e.target.value)}
                placeholder="G... juror public key"
                className="font-mono text-sm"
              />
              <Button type="button" variant="secondary" onClick={addManual}>
                Add
              </Button>
            </div>

            {jurors.length === 0 ? (
              <p className="text-sm text-text-muted">
                No jurors indexed yet. Register jurors first, or paste addresses
                above.
              </p>
            ) : (
              <ul className="space-y-2">
                {jurors.map((j) => {
                  const on = selected.includes(j.address);
                  return (
                    <li key={j.address}>
                      <button
                        type="button"
                        onClick={() => toggleJuror(j.address)}
                        className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          on
                            ? "border-mint bg-mint/10 text-text-primary"
                            : "border-border bg-background/50 text-text-secondary hover:border-border-strong"
                        }`}
                      >
                        <span className="font-mono">
                          {formatAddress(j.address)}
                        </span>
                        {on && <CheckCircle2 className="h-4 w-4 text-mint" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {selected.length > 0 && (
              <div className="rounded-md bg-background p-3 text-xs font-mono text-text-muted space-y-1">
                {selected.map((a) => (
                  <div key={a}>{a}</div>
                ))}
              </div>
            )}

            <Button
              onClick={handleAssign}
              disabled={
                txStatus !== "idle" || selected.length !== jurySize || !address
              }
              className="w-full sm:w-auto"
            >
              {txStatus !== "idle"
                ? "Submitting..."
                : !address
                  ? "Connect admin wallet first"
                  : `Assign ${jurySize} jurors to case #${caseId || "?"}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
