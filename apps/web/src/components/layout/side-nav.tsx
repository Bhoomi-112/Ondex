"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Shield,
  Bell,
  Briefcase,
  Wallet,
  Vote,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const startupNav: NavItem[] = [
  { label: "Dashboard", href: "/app/startup", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Applications", href: "/app/startup/applications", icon: <FileText className="h-4 w-4" /> },
  { label: "Identity", href: "/app/startup/identity", icon: <Shield className="h-4 w-4" /> },
  { label: "Notifications", href: "/app/startup/notifications", icon: <Bell className="h-4 w-4" /> },
]

const juryNav: NavItem[] = [
  { label: "Dashboard", href: "/app/jury", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Assigned Cases", href: "/app/jury/cases", icon: <Briefcase className="h-4 w-4" /> },
  { label: "Voting History", href: "/app/jury/history", icon: <Vote className="h-4 w-4" /> },
  { label: "Stake", href: "/app/jury/stake", icon: <Wallet className="h-4 w-4" /> },
]

const investorNav: NavItem[] = [
  { label: "Dashboard", href: "/app/investor", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Campaigns", href: "/app/investor/campaigns", icon: <FileText className="h-4 w-4" /> },
  { label: "Portfolio", href: "/app/investor/portfolio", icon: <Wallet className="h-4 w-4" /> },
  { label: "Notifications", href: "/app/investor/notifications", icon: <Bell className="h-4 w-4" /> },
]

const navMap: Record<string, NavItem[]> = {
  startup: startupNav,
  jury: juryNav,
  investor: investorNav,
}

interface SideNavProps {
  role: string
}

export function SideNav({ role }: SideNavProps) {
  const pathname = usePathname()
  const items = navMap[role] ?? []

  return (
    <nav className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto no-scrollbar">
      <div className="flex flex-col py-6">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/app/${role}` && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-blue-600 bg-blue-50 border-l-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
