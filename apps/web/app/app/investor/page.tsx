"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { api } from "@/lib/api-client"
import { formatAmount, truncateAddress } from "@/lib/utils"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { rpcClient, buildContractCall, TESTNET_NETWORK_PASSPHRASE } from "@/lib/stellar"
import { xdr, TransactionBuilder } from "@stellar/stellar-sdk"
import { Briefcase, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react"

interface Campaign {
  id: string
  identity_commitment: string
  title: string
  description: string
  funding_amount: string
  milestone_description: string
  status: string
  created_at: string
}

export default function InvestorDashboard() {
  const { toast } = useToast()
  const { signXdr } = useWalletContext()
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [depositDialog, setDepositDialog] = React.useState<{ open: boolean; campaign: Campaign | null }>({
    open: false,
    campaign: null,
  })
  const [depositAmount, setDepositAmount] = React.useState("")
  const [depositing, setDepositing] = React.useState(false)

  React.useEffect(() => {
    api
      .get<{ data: Campaign[] }>("/api/v1/campaigns?state=APPROVED")
      .then((res) => setCampaigns(res.data))
      .catch((err) => {
        toast({ title: err.message, variant: "error" })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  function denominateAmount(xlm: string): bigint {
    return BigInt(Math.round(Number(xlm) * 10_000_000))
  }

  async function handleDeposit() {
    if (!depositDialog.campaign || !depositAmount) return
    setDepositing(true)
    try {
      const walletAddress = await import("@/lib/wallet").then((m) => m.getWalletAddress())
      if (!walletAddress) {
        toast({ title: "Wallet not connected", variant: "error" })
        return
      }
      const amount = denominateAmount(depositAmount)
      const amountI128 = xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          lo: new xdr.Uint64(Number(amount & 0xFFFFFFFFFFFFFFFFn)),
          hi: new xdr.Int64(Number(amount >> 64n)),
        })
      )

      const txBuilder = await buildContractCall(
        process.env.NEXT_PUBLIC_ESCROW_CONTRACT!,
        "deposit",
        [
          xdr.ScVal.scvString(depositDialog.campaign.id),
          amountI128,
        ],
        walletAddress
      )

      const builtTx = txBuilder.build()
      const txXdr = builtTx.toXDR()
      const signedXdr = await signXdr(txXdr)

      const result = await rpcClient.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, TESTNET_NETWORK_PASSPHRASE)
      )

      toast({ title: `Deposit successful. Tx: ${result.hash}` })

      setDepositDialog({ open: false, campaign: null })
      setDepositAmount("")
    } catch (err: any) {
      toast({ title: err.message, variant: "error" })
    } finally {
      setDepositing(false)
    }
  }

  const activeInvestments = campaigns.filter((c) => c.status === "APPROVED").length
  const totalDeployed = campaigns.reduce((sum, c) => sum + Number(c.funding_amount), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Investor Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Browse and fund approved campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Investments</p>
                <p className="text-2xl font-bold mt-1">{activeInvestments}</p>
              </div>
              <Briefcase className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Deployed</p>
                <p className="text-2xl font-bold mt-1">{formatAmount(totalDeployed)} XLM</p>
              </div>
              <DollarSign className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Returns</p>
                <p className="text-2xl font-bold mt-1">--</p>
              </div>
              <TrendingUp className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Approved Campaigns</h2>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full max-w-md mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns available</h3>
              <p className="text-zinc-400 text-sm">
                There are no approved campaigns to invest in at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">
                          {campaign.title || truncateAddress(campaign.identity_commitment, 8)}
                        </h3>
                        <Badge>{campaign.status}</Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">{campaign.milestone_description}</p>
                      <p className="text-sm text-zinc-500">
                        Startup: {truncateAddress(campaign.identity_commitment, 12)}
                      </p>
                      <p className="text-xs text-zinc-500 mt-2">
                        Ask: {formatAmount(campaign.funding_amount)} XLM
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 shrink-0"
                      onClick={() => setDepositDialog({ open: true, campaign })}
                    >
                      <ArrowUpRight className="h-3 w-3" />
                      Deposit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={depositDialog.open} onOpenChange={(o) => setDepositDialog({ open: o, campaign: null })}>
        <DialogContent>
          <DialogClose onClick={() => setDepositDialog({ open: false, campaign: null })} />
          <DialogHeader>
            <DialogTitle>Deposit to Campaign</DialogTitle>
            <DialogDescription>
              Deposit XLM into the escrow contract for this campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {depositDialog.campaign && (
              <div className="p-3 rounded-lg bg-zinc-800 text-sm">
                <p className="font-medium">{depositDialog.campaign.title || truncateAddress(depositDialog.campaign.identity_commitment, 8)}</p>
                <p className="text-zinc-400 text-xs mt-1">
                  Funding target: {formatAmount(depositDialog.campaign.funding_amount)} XLM
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Amount (XLM)</label>
              <Input
                type="number"
                placeholder="1000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositDialog({ open: false, campaign: null })}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={depositing || !depositAmount}>
              {depositing ? "Depositing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
