"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { api } from "@/lib/api-client";

interface StartupApp {
  id: string;
  name?: string;
  tagline?: string;
  pitch?: string;
  category?: string;
  stage?: string;
  askAmount?: string;
  logoUrl?: string;
}

export default function StartupsCarousel() {
  const [startups, setStartups] = useState<StartupApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: StartupApp[]; items?: StartupApp[] }>("/api/applications?limit=6")
      .then((res) => {
        const items = res.data || res.items || [];
        setStartups(items);
      })
      .catch(() => {
        // silently fail — shows empty state
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Featured Opportunities</p>
            <h2 className="section-heading mt-2">
              Startups raising capital
            </h2>
            <p className="section-subheading">
              AI-matched investment opportunities from verified founders.
            </p>
          </div>
          <Link
            href="/startups"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-40 rounded-lg bg-slate-100" />
                <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 h-9 w-40 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : startups.length === 0 ? (
          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No startups yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Be the first to apply. Connect your wallet and register your startup.
            </p>
            <Link href="/startup/apply" className="btn-primary mt-6 inline-flex">
              Apply as Founder
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.id}`}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                  {startup.logoUrl ? (
                    <img
                      src={startup.logoUrl}
                      alt={startup.name || "Startup"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Briefcase className="h-12 w-12 text-slate-300" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {startup.name || "Startup"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {startup.tagline || startup.pitch || "No description"}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      {startup.askAmount
                        ? `${(Number(startup.askAmount) / 10_000_000).toLocaleString()} XLM`
                        : "Ask not set"}
                    </span>
                    <span className="text-sm text-blue-600 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                      View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/startups" className="btn-outline">
            View all startups
          </Link>
        </div>
      </div>
    </section>
  );
}
