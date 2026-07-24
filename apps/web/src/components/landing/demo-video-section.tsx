export default function DemoVideoSection() {
  return (
    <section className="bg-slate-900 py-20 sm:py-28 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">See It in Action</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-2">Watch how Ondex works</h2>
          <p className="mt-4 text-lg text-slate-400">
            Two-minute walkthrough from wallet connect to funded escrow.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-5xl">
          {/* Browser mockup frame */}
          <div className="rounded-xl border border-white/10 bg-slate-800 shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-slate-800/80 px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="ml-4 flex-1 max-w-[400px] rounded-md bg-slate-900/80 border border-white/10 px-3 py-1.5 text-xs text-slate-400 truncate font-mono">
                app.ondex.io/demo
              </div>
            </div>

            {/* Video placeholder */}
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center gap-4">
                {/* Play button */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/90 shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  <svg className="h-8 w-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-sm text-slate-400">Demo video coming soon</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              AI matching demo
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Escrow walkthrough
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Investor & founder dashboards
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
