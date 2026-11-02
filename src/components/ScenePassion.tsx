export default function ScenePassion() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/4 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),rgba(255,255,255,0)_62%)] blur-3xl" />
        <div className="absolute -bottom-64 right-1/3 h-[880px] w-[880px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13),rgba(255,255,255,0)_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.07),rgba(255,255,255,0)_60%)] opacity-80" />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-80" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 min-h-screen flex items-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-12 rounded-[3rem] bg-gradient-to-tr from-white/12 via-white/0 to-white/18 blur-3xl opacity-80" />
            <div className="absolute -inset-14 rounded-[3.25rem] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.20),rgba(255,255,255,0)_58%)] blur-3xl opacity-70" />
            <div className="absolute -inset-14 rounded-[3.25rem] bg-[radial-gradient(circle_at_85%_55%,rgba(255,255,255,0.16),rgba(255,255,255,0)_60%)] blur-3xl opacity-70" />

            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_40px_180px_rgba(0,0,0,0.68)]">
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),rgba(255,255,255,0)_62%)]" />
                <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/12 blur-3xl" />
                <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-white/12 blur-3xl" />
                <div className="absolute left-14 bottom-12 h-56 w-56 rounded-full bg-white/12 blur-3xl" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.18]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0)_55%)] opacity-65" />
                <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.00),rgba(255,255,255,0.09),rgba(255,255,255,0.00))] opacity-40" />

                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.10),transparent)] opacity-60" />
                <div className="absolute -left-24 top-16 h-1 w-[520px] rotate-[18deg] bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-60" />
                <div className="absolute -right-28 bottom-24 h-1 w-[560px] rotate-[-14deg] bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-55" />
              </div>

              <div className="relative h-full w-full p-7 sm:p-10 flex items-end">
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
                  <p className="text-[11px] text-white/70 tracking-[0.22em] uppercase [font-family:var(--font-ui)]">
                    ABOUT / SCENE 03
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-xl order-1 lg:order-2">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_7px_rgba(255,255,255,0.07),0_0_36px_rgba(255,255,255,0.16)]" />
              <p className="text-white/60 text-xs sm:text-sm tracking-[0.28em] uppercase [font-family:var(--font-ui)]">
                Passion
              </p>
            </div>

            <h2 className="mt-7 text-[clamp(2.8rem,1.8rem+3.6vw,4.9rem)] leading-[0.96] tracking-[-0.025em] font-semibold [font-family:var(--font-heading)]">
              Passion
            </h2>

            <p className="mt-8 text-white/70 text-base sm:text-lg leading-relaxed [font-family:var(--font-body)]">
              This is obsession turned into craft. We sweat the micro-details, refine
              the system until it feels inevitable, and build with a relentless
              standard—because ambition deserves a premium execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

