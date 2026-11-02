export default function SceneVisionary() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 right-1/4 h-[680px] w-[680px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_62%)] blur-3xl" />
        <div className="absolute -bottom-56 left-1/3 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.11),rgba(255,255,255,0)_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.06),rgba(255,255,255,0)_58%)] opacity-70" />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 min-h-screen flex items-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/70 shadow-[0_0_0_6px_rgba(255,255,255,0.06),0_0_28px_rgba(255,255,255,0.12)]" />
              <p className="text-white/60 text-xs sm:text-sm tracking-[0.28em] uppercase [font-family:var(--font-ui)]">
                Visionary
              </p>
            </div>

            <h2 className="mt-7 text-[clamp(2.4rem,1.6rem+3vw,4.2rem)] leading-[0.98] tracking-[-0.02em] font-semibold [font-family:var(--font-heading)]">
              Visionary
            </h2>

            <p className="mt-8 text-white/70 text-base sm:text-lg leading-relaxed [font-family:var(--font-body)]">
              We don’t chase trends—we design the next default. WEBBED turns ideas into
              future-ready products with cinematic clarity, strong systems thinking,
              and a premium build quality you can feel.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-[2.75rem] bg-gradient-to-tr from-white/10 via-white/0 to-white/15 blur-3xl opacity-70" />
            <div className="absolute -inset-12 rounded-[3rem] bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.16),rgba(255,255,255,0)_58%)] blur-3xl opacity-60" />

            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_30px_140px_rgba(0,0,0,0.62)]">
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),rgba(255,255,255,0)_62%)]" />
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute left-16 bottom-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.14]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_55%)] opacity-55" />
              </div>

              <div className="relative h-full w-full p-7 sm:p-10 flex items-end justify-end">
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
                  <p className="text-[11px] text-white/70 tracking-[0.22em] uppercase [font-family:var(--font-ui)]">
                    ABOUT / SCENE 02
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

