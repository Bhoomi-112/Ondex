"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import { useAuthContext } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api-client"
import { truncateAddress, formatDate } from "@/lib/utils"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { rpcClient, buildContractCall, NETWORK_PASSPHRASE } from "@/lib/stellar"
import { xdr, TransactionBuilder } from "@stellar/stellar-sdk"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react"

interface CaseDetail {
  id: string
  campaign_id: string
  identity_commitment: string
  milestone_description: string
  status: string
  votes_for: number
  votes_against: number
  jurors: { address: string; voted: boolean }[]
  vote_history: { voter: string; vote_for: boolean; timestamp: string }[]
  timeline: { event: string; timestamp: string }[]
  created_at: string
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast: toast } = useToast()
  const { role } = useAuthContext()
  const { signXdr } = useWalletContext()
  const caseId = params.id as string

  const [caseData, setCaseData] = React.useState<CaseDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [voting, setVoting] = React.useState(false)

  React.useEffect(() => {
    api
      .get<{ data: CaseDetail }>(`/api/v1/cases/${caseId}`)
      .then((res) => setCaseData(res.data))
      .catch((err) => {
        if (err.statusCode === 404) setNotFound(true)
        else toast({ title: err.message, variant: "error" })
      })
      .finally(() => setIsLoading(false))
  }, [caseId, toast])

  async function handleVote(voteFor: boolean) {
    setVoting(true)
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
      const signedXdr = await signXdr(builtTx.toXDR())

      const result = await rpcClient.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
      )

      toast({ title: `Vote submitted. Tx: ${result.hash}` })
      setCaseData((prev) =>
        prev
          ? {
              ...prev,
              votes_for: prev.votes_for + (voteFor ? 1 : 0),
              votes_against: prev.votes_against + (voteFor ? 0 : 1),
            }
          : prev
      )
    } catch (err: any) {
      toast({ title: err.message, variant: "error" })
    } finally {
      setVoting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Case not found</h2>
        <p className="text-zinc-400 text-sm mb-4">The case you are looking for does not exist.</p>
        <Link href="/app/jury">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  if (!caseData) return null

  const totalVotes = caseData.votes_for + caseData.votes_against
  const forPercent = totalVotes > 0 ? (caseData.votes_for / totalVotes) * 100 : 0
  const againstPercent = totalVotes > 0 ? (caseData.votes_against / totalVotes) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Case {truncateAddress(caseData.id, 8)}</h1>
          <p className="text-zinc-400 text-sm">{formatDate(caseData.created_at)}</p>
        </div>
        <Badge variant={caseData.status === "Resolved" ? "default" : "secondary"} className="ml-auto">
          {caseData.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vote Tally</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-green-400 flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" /> For
                </span>
                <span className="text-zinc-400">{caseData.votes_for} votes</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${forPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-red-400 flex items-center gap-1">
                  <ThumbsDown className="h-3 w-3" /> Against
                </span>
                <span className="text-zinc-400">{caseData.votes_against} votes</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${againstPercent}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Jurors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {caseData.jurors.map((juror) => (
              <div key={juror.address} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <span className="text-sm font-mono">{truncateAddress(juror.address, 8)}</span>
                <Badge variant={juror.voted ? "default" : "secondary"}>
                  {juror.voted ? "Voted" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {caseData.vote_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vote History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {caseData.vote_history.map((vote, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-3 rounded-lg bg-zinc-800/50">
                  <span className="font-mono">{truncateAddress(vote.voter, 8)}</span>
                  <Badge variant={vote.vote_for ? "default" : "danger"}>
                    {vote.vote_for ? "For" : "Against"}
                  </Badge>
                  <span className="text-zinc-500 text-xs">{formatDate(vote.timestamp)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caseData.timeline.map((event, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-teal-500 shrink-0 mt-2" />
                  {i < caseData.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-800" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm">{event.event}</p>
                  <p className="text-xs text-zinc-500">{formatDate(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-zinc-400 mb-1">Milestone</p>
          <p className="text-sm">{caseData.milestone_description}</p>
          <Separator className="my-4" />
          <div className="flex gap-3">
            {role === "jury" && caseData.status !== "Resolved" && (
              <>
                <Button
                  className="gap-1"
                  onClick={() => handleVote(true)}
                  disabled={voting}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {voting ? "Voting..." : "Vote For"}
                </Button>
                <Button
                  variant="destructive"
                  className="gap-1"
                  onClick={() => handleVote(false)}
                  disabled={voting}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {voting ? "Voting..." : "Vote Against"}
                </Button>
              </>
            )}
            {role === "investor" && (
              <Button variant="outline" className="gap-1">
                <AlertTriangle className="h-4 w-4" />
                Raise Dispute
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
