"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Wallet,
  TrendingUp,
  Clock,
  Coins,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { formatXLM, formatAddress } from "@/lib/utils";
import {
  fetchCampaigns,
  type ApiCampaign,
} from "@/lib/api";

export default function InvestorDashboard() {
  const { address } = useWallet();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetchCampaigns();
      setCampaigns(items);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!address) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connect your wallet to access the Investor Dashboard
            </h2>
            <p className="text-text-secondary">
              Browse campaigns, deposit into startups, and vote on disputes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "Active" || !c.state || c.state === "Active",
  );
  const closedCampaigns = campaigns.filter(
    (c) => c.status === "Released" || c.status === "Refunded" || c.state === "Released" || c.state === "Refunded",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Investor Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Browse campaigns, deposit into startups, and participate in dispute
          resolution.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="success" className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            Verified Investor
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-text-muted">
            <Wallet className="h-4 w-4" />
            <span className="font-mono">{formatAddress(address)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-mint/10 p-2">
              <Coins className="h-5 w-5 text-mint" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Active Campaigns</p>
              <p className="text-lg font-bold text-text-primary">
                {activeCampaigns.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-accent/10 p-2">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Closed</p>
              <p className="text-lg font-bold text-text-primary">
                {closedCampaigns.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Campaigns</p>
              <p className="text-lg font-bold text-text-primary">
                {campaigns.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Coins className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Campaigns Available
            </h3>
            <p className="text-text-secondary mb-4">
              There are no open funding campaigns at this time. Check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeCampaigns.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-text-primary">
                Open Campaigns
              </h2>
              {activeCampaigns.map((camp) => (
                <Card key={camp.id ?? camp.campaignId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{camp.name || `Campaign #${camp.campaignId ?? camp.id}`}</CardTitle>
                        <CardDescription>
                          {camp.startup ? `Startup: ${formatAddress(camp.startup)}` : `Campaign #${camp.id}`}
                        </CardDescription>
                      </div>
                      <Badge variant="warning">
                        <Clock className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {camp.pitch && (
                      <p className="text-sm text-text-secondary line-clamp-3">
                        {camp.pitch}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {camp.goal && (
                        <div>
                          <span className="text-text-muted">Goal: </span>
                          <span className="text-text-primary font-medium">
                            {formatXLM(Number(camp.goal))} XLM
                          </span>
                        </div>
                      )}
                      {(camp.totalDeposited || camp.total_deposited) && (
                        <div>
                          <span className="text-text-muted">Deposited: </span>
                          <span className="text-text-primary font-medium">
                            {formatXLM(Number(camp.totalDeposited ?? camp.total_deposited))} XLM
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-text-muted">
                        Campaign ID: {camp.campaignId ?? camp.id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {closedCampaigns.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-text-primary mt-6">
                Closed Campaigns
              </h2>
              {closedCampaigns.map((camp) => (
                <Card key={camp.id ?? camp.campaignId}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {camp.name || `Campaign #${camp.campaignId ?? camp.id}`}
                        </p>
                        <p className="text-xs text-text-muted">
                          {camp.startup ? formatAddress(camp.startup) : `#${camp.id}`}
                        </p>
                      </div>
                      <Badge variant={camp.status === "Released" || camp.state === "Released" ? "success" : "secondary"}>
                        {camp.status || camp.state}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
