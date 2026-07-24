"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Briefcase, ArrowRight, Search, Filter } from "lucide-react";

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

const CATEGORIES = [
  "All",
  "AI / ML",
  "DeFi",
  "NFT",
  "Infrastructure",
  "DAO / Governance",
  "Gaming",
  "Social",
  "DePIN",
  "Privacy",
  "Developer Tools",
  "Payments",
  "Fintech",
  "Health",
  "Other",
];

const ITEMS_PER_PAGE = 9;

export default function StartupsPage() {
  const [startups, setStartups] = useState<StartupApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api
      .get<{ data: StartupApp[]; items?: StartupApp[] }>("/api/applications")
      .then((res) => {
        const items = res.data || res.items || [];
        setStartups(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = startups.filter((s) => {
    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      (s.name?.toLowerCase().includes(query)) ||
      (s.tagline?.toLowerCase().includes(query)) ||
      (s.pitch?.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Explore Startups</h1>
              <p className="mt-2 text-slate-300">
                AI-matched investment opportunities from verified founders.
              </p>
            </div>
            <Link href="/startup/apply" className="btn-primary shrink-0">
              Raise Funds
            </Link>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-lg border border-white/10 bg-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-40 rounded-lg bg-slate-100" />
                <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 h-9 w-40 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No startups found</h3>
            <p className="mt-2 text-sm text-slate-500">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter."
                : "No startups have applied yet. Check back soon."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((startup) => (
                <Link
                  key={startup.id}
                  href={`/startups/${startup.id}`}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={startup.name || "Startup"} className="h-full w-full object-cover" />
                    ) : (
                      <Briefcase className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {startup.name || "Unnamed Startup"}
                      </h3>
                      {startup.category && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {startup.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {startup.tagline || startup.pitch || "No description available"}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-xs text-slate-400">Funding Ask</span>
                        <p className="text-sm font-semibold text-slate-900">
                          {startup.askAmount
                            ? `${(Number(startup.askAmount) / 10_000_000).toLocaleString()} XLM`
                            : "Not set"}
                        </p>
                      </div>
                      <span className="text-sm text-blue-600 group-hover:gap-2 inline-flex items-center gap-1 transition-all font-medium">
                        View Profile <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      safePage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
