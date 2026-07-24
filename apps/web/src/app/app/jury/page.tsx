"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api-client"
import { truncateAddress, explorerTxUrl } from "@/lib/utils"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { rpcClient, buildContractCall, NETWORK_PASSPHRASE } from "@/lib/stellar"
import { xdr, TransactionBuilder } from "@stellar/stellar-sdk"
import Link from "next/link"
import { Scale, ThumbsUp, ThumbsDown, Briefcase, Vote } from "lucide-react"

interface Case {
  id: string
  campaign_id: string
  identity_commitment: string
  milestone_description: string
  status: string
  votes_for: number
  votes_against: number
  created_at: string
}

export default function JuryDashboard() {
  const { addToast: toast } = useToast()
  const { signXdr } = useWalletContext()
  const [cases, setCases] = React.useState<Case[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [votingId, setVotingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    api
      .get<{ data: Case[] }>("/api/v1/cases?status=Voting")
      .then((res) => setCases(res.data))
      .catch((err) => {
        toast({ title: err.message, variant: "error" })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  async function handleVote(caseId: string, voteFor: boolean) {
    setVotingId(caseId)
    try {
      const walletAddress = await import("@/lib/wallet").then((m) => m.getWalletAddress())
      if (!walletAddress) {
        toast({ title: "Wallet not connected", variant: "error" })
        return
      }
      const voteArg = xdr.ScVal.scvBool(voteFor)

      const txBuilder = await buildContractCall(
        process.env.NEXT_PUBLIC_JURY_REGISTRY_CONTRACT_ID!,
        "vote",
        [xdr.ScVal.scvString(caseId), voteArg],
        walletAddress
      )

      const builtTx = txBuilder.build()
      const txXdr = builtTx.toXDR()
      const signedXdr = await signXdr(txXdr)

      const result = await rpcClient.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
      )

      toast({ title: `Vote submitted. Tx: ${result.hash}` })

      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, votes_for: c.votes_for + (voteFor ? 1 : 0), votes_against: c.votes_against + (voteFor ? 0 : 1) }
            : c
        )
      )
    } catch (err: any) {
      toast({ title: err.message, variant: "error" })
    } finally {
      setVotingId(null)
    }
  }

  const totalAssigned = cases.length
  const totalVotesCast = cases.reduce((sum, c) => sum + c.votes_for + c.votes_against, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Jury Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Review and vote on startup applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Assigned Cases</p>
                <p className="text-2xl font-bold mt-1">{totalAssigned}</p>
              </div>
              <Briefcase className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Votes Cast</p>
                <p className="text-2xl font-bold mt-1">{totalVotesCast}</p>
              </div>
              <Vote className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Stake</p>
                <p className="text-2xl font-bold mt-1">--</p>
              </div>
              <Scale className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Pending Cases</h2>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full max-w-md mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assigned cases</h3>
              <p className="text-zinc-400 text-sm">
                There are no pending cases for you to review at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cases.map((c) => (
              <Card key={c.id} className="hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Link href={`/app/cases/${c.id}`} className="font-semibold hover:text-teal-400 transition-colors">
                          Case {truncateAddress(c.id, 8)}
                        </Link>
                        <Badge variant="secondary">{c.status}</Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">
                        Identity: {truncateAddress(c.identity_commitment, 12)}
                      </p>
                      <p className="text-sm text-zinc-500 mb-3">{c.milestone_description}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>Votes For: {c.votes_for}</span>
                        <span>Votes Against: {c.votes_against}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-green-600 text-green-400 hover:bg-green-600/10"
                        onClick={() => handleVote(c.id, true)}
                        disabled={votingId === c.id}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {votingId === c.id ? "..." : "For"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-red-600 text-red-400 hover:bg-red-600/10"
                        onClick={() => handleVote(c.id, false)}
                        disabled={votingId === c.id}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        {votingId === c.id ? "..." : "Against"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
