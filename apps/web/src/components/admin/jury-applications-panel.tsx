"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveJuryApplication,
  listJuryApplications,
  rejectJuryApplication,
} from "@/lib/auth-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAddress } from "@/lib/utils";
import { Gavel } from "lucide-react";

type AppRow = {
  id: string;
  wallet: string;
  status: string;
  statement: string;
  experience: string | null;
  createdAt: string;
  user: { id: string; displayName: string | null };
};

export function JuryApplicationsPanel() {
  const { addToast } = useToast();
  const [items, setItems] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: rows } = await listJuryApplications("pending");
      setItems(rows as AppRow[]);
    } catch (err) {
      addToast({
        title: "Could not load jury applications",
        description: err instanceof Error ? err.message : String(err),
        variant: "error",
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      await approveJuryApplication(id);
      addToast({
        title: "Promoted to jury",
        description: "User role set to jury and application approved.",
        variant: "success",
      });
      load();
    } catch (err) {
      addToast({
        title: "Approve failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "error",
      });
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    setBusyId(id);
    try {
      await rejectJuryApplication(id, "Rejected by admin");
      addToast({
        title: "Application rejected",
        variant: "warning",
      });
      load();
    } catch (err) {
      addToast({
        title: "Reject failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "error",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Pending jury applications
        </CardTitle>
        <CardDescription>
          Only path to <code className="text-xs">role=jury</code>. Approval
          updates the users table server-side — never trust client role fields.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-text-muted">No pending applications.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((app) => (
              <li
                key={app.id}
                className="rounded-md border border-border p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm">
                    {formatAddress(app.wallet)}
                  </span>
                  <Badge variant="secondary">{app.status}</Badge>
                </div>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">
                  {app.statement}
                </p>
                {app.experience && (
                  <p className="text-xs text-text-muted">{app.experience}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => approve(app.id)}
                    disabled={busyId === app.id}
                  >
                    Approve → jury
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reject(app.id)}
                    disabled={busyId === app.id}
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
