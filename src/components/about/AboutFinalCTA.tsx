"use client";

import { ensureScrollTrigger, useReveal } from "@/lib/motion";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

// ── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const xTo = gsap.quickTo(inner, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.45, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      xTo((e.clientX - rect.left - rect.width / 2) * 0.36);
      yTo((e.clientY - rect.top - rect.height / 2) * 0.36);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="inline-block">
      <div ref={innerRef} style={{ display: "inline-block" }}>
        <Link
          href={href}
          className={[
            "inline-flex items-center justify-center rounded-full px-10 py-4.5",
            "text-[0.9rem] tracking-[0.08em] font-semibold uppercase transition-all duration-300 select-none",
            primary
              ? "bg-white text-black hover:bg-neutral-100 shadow-[0_10px_35px_rgba(255,255,255,0.18)] hover:scale-105 active:scale-95"
              : "bg-black/90 text-white border border-white/30 hover:border-white/60 hover:bg-white/[0.12] hover:scale-105 active:scale-95 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.5)]",
          ].join(" ")}
        >
          {children}
        </Link>
      </div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
export default function AboutFinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);

  const contentRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 48 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  });
  const taglineRef = useReveal<HTMLParagraphElement>({
    initial: { opacity: 0 },
    whileInView: { opacity: 0.8 },
    viewport: { once: true },
    transition: { duration: 1.0, delay: 0.4 },
  });

  // Scroll-linked horizon glow (opacity + scale)
  useEffect(() => {
    ensureScrollTrigger();
    const el = horizonRef.current;
    const target = sectionRef.current;
    if (!el || !target) return;
    const trigger = gsap.to(el, {
      opacity: 1,
      scale: 1.18,
      ease: "none",
      scrollTrigger: {
        trigger: target,
        start: "start end",
        end: "end end",
        scrub: true,
      },
    });
    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="about-final-cta"
      ref={sectionRef}
      className="relative min-h-[96vh] flex items-center justify-center bg-black text-white py-40 overflow-hidden"
    >
      {/* Ambient base glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_38%_at_50%_58%,rgba(255,255,255,0.016),transparent_65%)]" />
      </div>

      {/* ── Horizon Glow — the cinematic climax light ── */}
      <div
        ref={horizonRef}
        style={{ opacity: 0, transformOrigin: "bottom center", willChange: "opacity, transform" }}
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
      >
        {/* Wide soft bloom */}
        <div className="h-[55vh] w-full bg-[radial-gradient(ellipse_90%_100%_at_50%_100%,rgba(255,255,255,0.065),transparent_68%)]" />
        {/* Tight bright core */}
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,rgba(220,230,255,0.055),transparent_72%)]" />
        {/* Very thin line at the very base */}
        <div className="absolute bottom-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black to-transparent pointer-events-none z-[2]" />

      {/* ── Content Stage ── */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 w-full"
      >
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.025] backdrop-blur-3xl px-6 py-20 sm:px-12 sm:py-24 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="absolute inset-0 rounded-[3rem] pointer-events-none bg-[radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.05),transparent_60%)]" />

          <p className="text-[12px] tracking-[0.32em] uppercase text-white/60 mb-10 font-bold">
            Ready When You Are
          </p>

          <h2
            className="text-white font-bold tracking-[-0.05em] leading-[0.9] mb-8 mx-auto"
            style={{
              fontSize: "clamp(3.75rem, 9.5vw, 9.5rem)",
              background:
                "linear-gradient(180deg, #ffffff 0%, #f3f4f6 60%, #d1d5db 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Let&apos;s build<br />what&apos;s next.
          </h2>

          <p className="text-[1.125rem] sm:text-[1.25rem] text-white/90 font-normal leading-[1.8] max-w-2xl mx-auto mb-14">
            Whether you&apos;re launching a startup, scaling a business, exploring AI,
            or bringing a new idea to life — we&apos;re here to help turn ambition into reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
            <MagneticButton href="/contact" primary>
              Start a Project
            </MagneticButton>
            <MagneticButton href="/solutions">
              Explore Solutions
            </MagneticButton>
          </div>

          <p
            ref={taglineRef}
            className="text-[0.75rem] text-white/60 tracking-[0.18em] font-semibold uppercase"
          >
            No commitment needed &nbsp;·&nbsp; Just a conversation
          </p>
        </div>
      </div>
    </section>
  );
}