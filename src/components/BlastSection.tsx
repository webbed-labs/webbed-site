"use client";

import { useReveal } from "@/lib/motion";

const transitionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function BlastSection() {
  const leftRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.1, ease: transitionEase },
  });
  const rightRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.1, ease: transitionEase },
  });

  return (
    <section className="relative w-full bg-black text-white py-20 sm:py-28 overflow-hidden">
      {/* Background visual touches */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06),rgba(0,0,0,0)_70%)] blur-2xl z-0" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.06),rgba(0,0,0,0)_70%)] blur-2xl z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Image Card */}
          <div
            ref={leftRef}
            className="w-full max-w-md lg:max-w-none mx-auto"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_10px_50px_rgba(0,0,0,0.85)] group">
              <img
                src="/blast_img.jpg"
                alt="Abstract futuristic 3D artwork of an exploding crystalline sphere — symbolising WEBBED's bold, next-generation software vision"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay shadow for rich depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Copywriting content */}
          <div
            ref={rightRef}
            className="flex flex-col items-end text-right"
          >
            <h2 className="text-[clamp(2.2rem,3.8vw,4.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white [font-family:var(--font-heading)]">
              We make <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">Softwares</span>
              <br />
              that the World
              <br />
              Isn't Prepared
              <br />
              for, <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-orange-500 bg-clip-text text-transparent font-black">YET !!</span>
            </h2>

            <p className="mt-8 text-base sm:text-lg leading-relaxed text-white/50 max-w-lg font-light [font-family:var(--font-body)]">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
