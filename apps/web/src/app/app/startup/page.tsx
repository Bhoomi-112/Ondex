"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api-client"
import { formatAmount, formatDate } from "@/lib/utils"
import { Plus, FileText, TrendingUp, Target } from "lucide-react"

interface Campaign {
  id: string
  title: string
  description: string
  funding_amount: string
  status: string
  milestones: { id: string; description: string; completed: boolean }[]
  created_at: string
}

export default function StartupDashboard() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    fundingAmount: "",
    milestoneDescription: "",
  })

  React.useEffect(() => {
    api
      .get<{ data: Campaign[] }>("/api/v1/campaigns")
      .then((res) => setCampaigns(res.data))
      .catch((err) => {
        toast({ title: err.message, variant: "error" })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  async function handleSubmit() {
    if (!form.name || !form.fundingAmount) return
    setSubmitting(true)
    try {
      const res = await api.post<{ data: Campaign }>("/api/v1/campaigns", {
        title: form.name,
        description: form.description,
        funding_amount: form.fundingAmount,
        milestone_description: form.milestoneDescription,
      })
      setCampaigns((prev) => [res.data, ...prev])
      setDialogOpen(false)
      setForm({ name: "", description: "", fundingAmount: "", milestoneDescription: "" })
      toast({ title: "Application submitted", variant: "success" })
    } catch (err: any) {
      toast({ title: err.message, variant: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  const activeCount = campaigns.filter((c) => c.status === "PENDING" || c.status === "APPROVED").length
  const totalFunding = campaigns.reduce((sum, c) => sum + Number(c.funding_amount), 0)
  const milestonesCompleted = campaigns.reduce(
    (sum, c) => sum + c.milestones.filter((m) => m.completed).length,
    0
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Startup Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your funding applications</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Apply for Funding
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Applications</p>
                <p className="text-2xl font-bold mt-1">{activeCount}</p>
              </div>
              <FileText className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Funding</p>
                <p className="text-2xl font-bold mt-1">{formatAmount(totalFunding)} XLM</p>
              </div>
              <TrendingUp className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Milestones Completed</p>
                <p className="text-2xl font-bold mt-1">{milestonesCompleted}</p>
              </div>
              <Target className="h-8 w-8 text-zinc-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Applications</h2>
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
              <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Create your first funding application to get started.
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <Badge variant={campaign.status === "APPROVED" ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>Funding: {formatAmount(campaign.funding_amount)} XLM</span>
                        <span>Created: {formatDate(campaign.created_at)}</span>
                        <span>Milestones: {campaign.milestones.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogClose onClick={() => setDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Apply for Funding</DialogTitle>
            <DialogDescription>Submit a new funding application for jury review.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Project Name</label>
              <Input
                placeholder="Your project name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Description</label>
              <Input
                placeholder="Brief description of your project"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Funding Amount (XLM)</label>
              <Input
                type="number"
                placeholder="10000"
                value={form.fundingAmount}
                onChange={(e) => setForm((f) => ({ ...f, fundingAmount: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Milestone Description</label>
              <Input
                placeholder="First milestone deliverable"
                value={form.milestoneDescription}
                onChange={(e) => setForm((f) => ({ ...f, milestoneDescription: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !form.name || !form.fundingAmount}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
