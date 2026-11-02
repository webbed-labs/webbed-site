"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function AboutNeonTrailSection({
  mode = "section",
}: {
  mode?: "section" | "background";
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    let nx = 0;
    let ny = 0;
    let cx = 0;
    let cy = 0;

    const apply = () => {
      // Smooth interpolation (approximates spring physics).
      cx += (nx - cx) * 0.15;
      cy += (ny - cy) * 0.15;
      el.style.setProperty("--glowX", String(50 + cx * 22));
      el.style.setProperty("--glowY", String(50 + cy * 22));
      el.style.setProperty("--trailX", String(cx * 10));
      el.style.setProperty("--trailY", String(cy * 6));
      el.style.setProperty("--ribbonAX", String(cx));
      el.style.setProperty("--ribbonAY", String(cy));
      el.style.setProperty("--ribbonBX", String(-cx * 1.1));
      el.style.setProperty("--ribbonBY", String(cy * 0.9));
      el.style.setProperty("--ribbonCX", String(cx * 0.8));
      el.style.setProperty("--ribbonCY", String(-cy * 0.7));
      raf = window.requestAnimationFrame(apply);
    };
    raf = window.requestAnimationFrame(apply);

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      nx = Math.max(-1, Math.min(1, (x - 0.5) * 2));
      ny = Math.max(-1, Math.min(1, (y - 0.5) * 2));
    };

    const onLeave = () => {
      nx = 0;
      ny = 0;
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={(n) => {
        sectionRef.current = n;
      }}
      className="relative w-full overflow-hidden bg-black text-white"
      style={{
        paddingTop: "140px",
        paddingBottom: "160px",
      }}
    >
      {/* Base gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,0,25,1) 0%, rgba(0,0,0,1) 55%, rgba(20,0,40,1) 100%)",
        }}
      />

      {/* Cursor glow hotspot */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at var(--glowX, 50%) var(--glowY, 50%), rgba(192,132,252,0.28) 0%, rgba(59,130,246,0.16) 22%, rgba(0,0,0,0) 62%)",
          opacity: mounted ? 1 : 0.001,
          transition: "opacity 300ms ease",
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Neon ribbons */}
      <div aria-hidden className="absolute inset-0">
        {/* Ribbon 1 */}
        <div
          className="absolute -left-20 top-[-10%] h-[120%] w-[60%] blur-[18px] opacity-70"
          style={{
            transform: "translate3d(calc(var(--ribbonAX, 0) * 1px), calc(var(--ribbonAY, 0) * 1px), 0)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0) 0%, rgba(168,85,247,0.7) 18%, rgba(236,72,153,0.7) 45%, rgba(99,102,241,0) 70%)",
              maskImage:
                "radial-gradient(circle at 30% 50%, black 0%, rgba(0,0,0,0) 62%)",
              WebkitMaskImage:
                "radial-gradient(circle at 30% 50%, black 0%, rgba(0,0,0,0) 62%)",
              borderRadius: 9999,
              transform: "rotate(-14deg)",
            }}
          />
        </div>

        {/* Ribbon 2 */}
        <div
          className="absolute -right-28 top-[0%] h-[110%] w-[62%] blur-[20px] opacity-60"
          style={{
            transform: "translate3d(calc(var(--ribbonBX, 0) * 1px), calc(var(--ribbonBY, 0) * 1px), 0)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(110deg, rgba(236,72,153,0) 0%, rgba(236,72,153,0.75) 16%, rgba(99,102,241,0.65) 48%, rgba(168,85,247,0) 76%)",
              maskImage:
                "radial-gradient(circle at 70% 45%, black 0%, rgba(0,0,0,0) 62%)",
              WebkitMaskImage:
                "radial-gradient(circle at 70% 45%, black 0%, rgba(0,0,0,0) 62%)",
              borderRadius: 9999,
              transform: "rotate(18deg)",
            }}
          />
        </div>

        {/* Ribbon 3 */}
        <div
          className="absolute left-[-15%] top-[20%] h-[100%] w-[70%] blur-[22px] opacity-55"
          style={{
            transform: "translate3d(calc(var(--ribbonCX, 0) * 1px), calc(var(--ribbonCY, 0) * 1px), 0)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0) 0%, rgba(99,102,241,0.7) 25%, rgba(168,85,247,0.65) 50%, rgba(236,72,153,0) 78%)",
              maskImage:
                "radial-gradient(circle at 45% 45%, black 0%, rgba(0,0,0,0) 60%)",
              WebkitMaskImage:
                "radial-gradient(circle at 45% 45%, black 0%, rgba(0,0,0,0) 60%)",
              borderRadius: 9999,
              transform: "rotate(-6deg)",
            }}
          />
        </div>

        {/* Thin light paths */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            transform: "translate3d(calc(var(--trailX, 0) * 1px), calc(var(--trailY, 0) * 1px), 0)",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1200" y2="600">
                <stop offset="0%" stopColor="rgba(236,72,153,0)" />
                <stop offset="30%" stopColor="rgba(236,72,153,0.65)" />
                <stop offset="55%" stopColor="rgba(168,85,247,0.55)" />
                <stop offset="100%" stopColor="rgba(99,102,241,0)" />
              </linearGradient>
              <linearGradient id="g2" x1="1200" y1="0" x2="0" y2="600">
                <stop offset="0%" stopColor="rgba(168,85,247,0)" />
                <stop offset="30%" stopColor="rgba(99,102,241,0.6)" />
                <stop offset="55%" stopColor="rgba(236,72,153,0.45)" />
                <stop offset="100%" stopColor="rgba(168,85,247,0)" />
              </linearGradient>
              <filter id="blurStrong" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
            </defs>

            <path
              d="M-50 430 C 160 250, 350 520, 580 310 C 780 130, 940 220, 1260 60"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
              filter="url(#blurStrong)"
            />
            <path
              d="M-30 140 C 200 90, 360 210, 520 260 C 690 320, 820 440, 1260 520"
              fill="none"
              stroke="url(#g2)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.65"
              filter="url(#blurStrong)"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-2">
          <span className="text-[11px] tracking-[0.32em] font-semibold uppercase text-white/70">
            About Us
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.2rem,4.2vw,3.7rem)] leading-[1.05] font-semibold tracking-[-0.03em] [font-family:var(--font-heading)]">
          Connecting People With The Perfect Space
        </h2>

        <p className="mt-6 max-w-2xl text-[1.05rem] leading-[1.8] text-white/70">
          WEBBED helps you discover and book professional meeting rooms, event venues, creative spaces, and
          workspaces—so teams can focus on great work, not logistics.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex h-[46px] items-center justify-center rounded-full border border-white/25 bg-white px-7 text-sm font-semibold text-black shadow-[0_0_26px_rgba(255,255,255,0.12)] transition-all duration-200"
          >
            Explore Spaces
          </Link>

          <Link
            href="/about"
            className="inline-flex h-[46px] items-center justify-center rounded-full border border-white/20 bg-transparent px-7 text-sm font-semibold text-white shadow-[0_0_26px_rgba(168,85,247,0.10)] transition-all duration-200"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
    </section>
  );
}