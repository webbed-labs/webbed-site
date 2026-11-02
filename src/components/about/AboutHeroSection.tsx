"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <section
      className="relative h-screen min-h-[100svh] w-full overflow-hidden bg-black text-white select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div aria-hidden="true" className="about-hero-fullscreen-bg pointer-events-none absolute inset-0 z-0" />

      <div
        className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-center justify-center px-5 pb-8 pt-24 sm:px-8 md:pb-10 md:pt-28"
      >
        <div aria-hidden="true" className="about-hero-content-glow pointer-events-none absolute inset-0" />

        <div className="about-hero-panel relative flex w-full max-w-[1240px] flex-col items-center px-4 py-9 text-center sm:px-10 sm:py-11 lg:grid lg:grid-cols-[minmax(300px,0.85fr)_1px_minmax(0,1.35fr)] lg:items-center lg:gap-x-12 lg:px-14 lg:py-14 xl:gap-x-16 xl:px-16">
          <Image
            src="/about-webbed-logo.png"
            alt="WEBBED"
            width={2172}
            height={724}
            priority
            className="relative z-10 h-auto w-[min(72vw,400px)] justify-self-center object-contain drop-shadow-[0_0_26px_rgba(255,255,255,0.08)] sm:w-[min(62vw,450px)] lg:w-[124%] lg:max-w-[500px]"
          />

          <div
            aria-hidden="true"
            className="relative z-10 my-7 h-px w-20 bg-gradient-to-r from-transparent via-white/55 to-transparent sm:my-9 sm:w-28 lg:my-0 lg:h-64 lg:w-px lg:bg-gradient-to-b"
          />

          <div className="relative z-10 flex w-full flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="max-w-[720px] text-[clamp(1.7rem,2.9vw,3.15rem)] font-normal leading-[1.16] tracking-[-0.035em] text-white/80 [font-family:var(--font-heading)] select-none">
              We build <strong className="font-bold text-white">technologies</strong>{" "}
              for a world that hasn&apos;t arrived yet,
              <br className="hidden xl:block" />{" "}
              and we&apos;re here to <strong className="font-bold text-white">shape what comes next.</strong>
            </h1>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:mt-9 lg:justify-start">
              <Link
                href="/labs"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black shadow-[0_12px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 active:translate-y-0 sm:w-auto"
              >
                Explore Products
              </Link>

              <Link
                href="/solutions"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/45 bg-white/[0.03] px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/75 hover:bg-white/[0.08] active:translate-y-0 sm:w-auto"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-hero-content-glow {
          pointer-events: none;
          z-index: 0;
          transform: translateZ(0);
        }

        .about-hero-fullscreen-bg {
          background:
            radial-gradient(ellipse 72% 120% at 24% 50%, rgba(90, 128, 230, 0.25), transparent 76%),
            radial-gradient(ellipse 70% 118% at 76% 50%, rgba(220, 70, 120, 0.18), transparent 76%),
            linear-gradient(90deg, rgba(28, 42, 82, 0.15), rgba(42, 31, 58, 0.13) 52%, rgba(72, 24, 43, 0.12));
        }

        .about-hero-content-glow::before {
          content: "";
          position: absolute;
          inset: 7% 5%;
          border-radius: 9999px;
          background:
            radial-gradient(ellipse 46% 42% at 36% 43%, rgba(90, 128, 230, 0.24), transparent 70%),
            radial-gradient(ellipse 46% 42% at 64% 43%, rgba(220, 70, 120, 0.16), transparent 70%),
            radial-gradient(ellipse 48% 35% at 50% 73%, rgba(110, 150, 245, 0.12), transparent 68%);
          filter: blur(46px);
        }

        .about-hero-content-glow::after {
          content: "";
          position: absolute;
          inset: 9% 6%;
          border: 1px solid transparent;
          border-radius: 9999px;
          background: linear-gradient(180deg, rgba(90, 128, 230, 0.38), rgba(220, 70, 120, 0.3)) border-box;
          -webkit-mask:
            linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.36;
        }

        @media (max-height: 780px) and (min-width: 768px) {
          .about-hero-panel {
            padding-top: 1.75rem;
            padding-bottom: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
}
