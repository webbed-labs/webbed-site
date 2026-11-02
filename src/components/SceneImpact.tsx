export default function SceneImpact() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0)_62%)] blur-3xl" />
        <div className="absolute -bottom-64 right-1/4 h-[900px] w-[900px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.06),rgba(255,255,255,0)_62%)] opacity-75" />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-75" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 min-h-screen flex items-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/75 shadow-[0_0_0_7px_rgba(255,255,255,0.06),0_0_34px_rgba(255,255,255,0.14)]" />
              <p className="text-white/60 text-xs sm:text-sm tracking-[0.28em] uppercase [font-family:var(--font-ui)]">
                Impact
              </p>
            </div>

            <h2 className="mt-7 text-[clamp(3.1rem,2rem+4.2vw,5.6rem)] leading-[0.95] tracking-[-0.03em] font-semibold [font-family:var(--font-heading)]">
              Impact
            </h2>

            <p className="mt-8 text-white/70 text-base sm:text-lg leading-relaxed [font-family:var(--font-body)]">
              We build for legacy—products that scale, endure, and shape what comes next.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-[2.75rem] bg-gradient-to-tr from-white/10 via-white/0 to-white/14 blur-3xl opacity-70" />
            <div className="absolute -inset-12 rounded-[3rem] bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.16),rgba(255,255,255,0)_60%)] blur-3xl opacity-60" />

            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_34px_160px_rgba(0,0,0,0.64)]">
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),rgba(255,255,255,0)_62%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_55%)] opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)] opacity-55" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.10]" />
                <div className="absolute inset-x-10 top-12 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-50" />
                <div className="absolute inset-x-16 bottom-14 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-40" />

                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md" />
              </div>

              <div className="relative h-full w-full p-7 sm:p-10 flex items-end justify-end">
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
                  <p className="text-[11px] text-white/70 tracking-[0.22em] uppercase [font-family:var(--font-ui)]">
                    ABOUT / SCENE 04
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

