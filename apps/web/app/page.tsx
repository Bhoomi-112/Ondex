"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectButton } from "@/components/wallet/connect-button"
import {
  Shield,
  Wallet,
  Vote,
  TrendingUp,
  Lock,
  Eye,
  Scale,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import * as React from "react"

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return isVisible
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isVisible = useInView(ref)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 z-50">
        <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-bold text-teal-500">Ondex</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <Badge variant="outline" className="mb-6 border-teal-500/30 text-teal-400">
              Built on Stellar
            </Badge>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Fund the Future.
              <br />
              <span className="text-teal-500">Decentralized.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
              A three-sided marketplace connecting startups, investors, and jury
              members on Stellar. Powered by Soroban smart contracts for
              transparent, trustless funding.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Learn More
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <p className="text-sm text-zinc-500">Trusted by</p>
            {["Stellar Foundation", "Soroban Labs", "Lightyear", "Stellar Dev"].map((name) => (
              <Badge key={name} variant="secondary" className="text-xs px-4 py-1.5">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Three steps to decentralized startup funding
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect",
                description: "Link your Stellar wallet via SEP-10 authentication. Choose your role as startup, investor, or jury member.",
                icon: <Wallet className="h-6 w-6 text-teal-500" />,
              },
              {
                step: "02",
                title: "Apply & Vote",
                description: "Startups submit funding proposals. Jury members review applications through blind identity-masked voting.",
                icon: <Vote className="h-6 w-6 text-teal-500" />,
              },
              {
                step: "03",
                title: "Fund",
                description: "Approved campaigns release funds through milestone-based escrow with built-in dispute resolution.",
                icon: <TrendingUp className="h-6 w-6 text-teal-500" />,
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <Card className="relative overflow-hidden hover:border-teal-500/30 transition-colors">
                  <CardContent className="p-8">
                    <span className="text-6xl font-bold text-zinc-800 absolute top-4 right-6">
                      {item.step}
                    </span>
                    <div className="relative">
                      <div className="mb-4">{item.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { label: "Contracts Deployed", value: "3" },
              { label: "Network", value: "Testnet Live" },
              { label: "License", value: "Open Source" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-teal-500">{stat.value}</p>
                <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Trust</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Every feature designed for transparent, decentralized funding
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Identity Masking",
                description: "On-chain commitments store only cryptographic hashes. Real identity lives encrypted off-chain. Jury votes blind.",
                icon: <Eye className="h-6 w-6 text-teal-500" />,
              },
              {
                title: "Jury Curation",
                description: "Jurors stake real assets to participate. Formal dispute mechanisms slash stakes for contradictory votes.",
                icon: <Scale className="h-6 w-6 text-teal-500" />,
              },
              {
                title: "Escrow Protection",
                description: "Milestone-based releases with 72-hour dispute windows. No funds move without jury sign-off as the base condition.",
                icon: <Lock className="h-6 w-6 text-teal-500" />,
              },
            ].map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.15}>
                <Card className="h-full hover:border-teal-500/30 transition-colors">
                  <CardContent className="p-8">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="font-bold text-teal-500">Ondex</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <a
              href="https://github.com/ondex"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Stellar
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-zinc-500">
            Built on Stellar Testnet
          </p>
        </div>
      </footer>
    </div>
  )
}
