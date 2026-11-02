"use client";

import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import WhyUsSection from "@/components/WhyUsSection";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ServiceCardVisuals, { SERVICE_VISUALS } from "@/components/solutions/ServiceCardVisuals";

interface MetaTag { name?: string; property?: string; content: string }
function injectMeta(tags: MetaTag[]): () => void {
  const created: Element[] = [];
  tags.forEach(({ name, property, content }) => {
    const attr = name ? "name" : "property";
    const val = name || property;
    let el = document.querySelector(`meta[${attr}="${val}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, val!);
      document.head.appendChild(el);
      created.push(el);
    }
    el.setAttribute("content", content);
  });
  // Return cleanup function that removes only the meta tags we created
  return () => { created.forEach((el) => el.parentNode?.removeChild(el)); };
}

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
              : "text-white border border-white/30 bg-black/90 hover:bg-white/[0.12] hover:border-white/60 hover:scale-105 active:scale-95 backdrop-blur-md",
          ].join(" ")}
        >
          {children}
        </Link>
      </div>
    </div>
  );
}

export default function SolutionsPage() {
  const [hoveredServiceIdx, setHoveredServiceIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const testimonials = useMemo(
    () => [
      {
        company: "The Print Specialist",
        quote:
          "WEBBED Solutions delivered exactly what our business needed with a clean design, smooth execution, and timely support. Their team was professional, responsive, and focused on creating a solution that truly reflects our brand. We highly recommend their services.",
        name: "Jeetendra J",
        title: "",
        theme: "light" as const,
      },
      {
        company: "Star Ocean Assets",
        quote:
          "WEBBED Solutions were reliable and easy to work with, from start to finish. They understood our business needs, maintained clear communication, and delivered everything as expected. We're satisfied with the final outcome and appreciate their commitment to quality.",
        name: "Jhaatin Krishan",
        title: "",
        theme: "dark" as const,
      },
      {
        company: "Lotus Exclusive Invitations",
        quote:
          "WEBBED Solutions has contributed significantly to improving our website's SEO and overall visibility. Their approach was professional, and our experience with the team was smooth.",
        name: "Jagmohan",
        title: "",
        theme: "light" as const,
      },
    ],
    [],
  );

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialTouchStartXRef = useRef<number | null>(null);

  const showPreviousTestimonial = () => {
    setTestimonialIdx((index) =>
      index === 0 ? testimonials.length - 1 : index - 1,
    );
  };

  const showNextTestimonial = () => {
    setTestimonialIdx((index) => (index + 1) % testimonials.length);
  };

  useEffect(() => {
    document.title = "SOLUTIONS | WEBBED";
    const cleanup = injectMeta([
      { name: "description", content: "WEBBED Solutions delivers custom software, AI integration, web applications, and digital strategy to help businesses move faster and build lasting competitive advantage." },
      { name: "keywords", content: "WEBBED Solutions, custom software, AI, web development, digital strategy, technology consulting" },
      { property: "og:title", content: "SOLUTIONS | WEBBED" },
      { property: "og:description", content: "WEBBED Solutions delivers custom software, AI integration, web applications, and digital strategy." },
      { property: "og:url", content: "https://webbed.in/solutions" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:title", content: "SOLUTIONS | WEBBED" },
      { name: "twitter:description", content: "WEBBED Solutions delivers custom software, AI integration, web applications, and digital strategy." },
    ]);

    const interval = window.setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 5500);

    return () => {
      window.clearInterval(interval);
      cleanup();
    };
  }, [testimonials.length]);

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="pointer-events-none absolute -right-32 top-10 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-20 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.06),transparent_70%)] blur-3xl" />

          {/* Tailored AI Systems / Enterprise Solutions (hero) */}
          <section
            className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 70% 15%, rgba(26,26,26,1) 0%, #050505 42%, #050505 100%)",
            }}
          >
            {/* Top bleed gradient to soften nav -> hero transition */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 w-full"
              style={{
                height: 80,
                background:
                  "linear-gradient(to bottom, #000000 0%, rgba(5,5,5,0) 100%)",
              }}
            />

            {/* Electric indigo atmosphere */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 top-10 h-[520px] w-[520px] rounded-full"
              style={{
                background: "radial-gradient(circle at center, rgba(99,102,241,0.18), rgba(99,102,241,0) 65%)",
                filter: "blur(24px)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-32 bottom-10 h-[380px] w-[380px] rounded-full"
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.05), rgba(255,255,255,0) 68%)",
                filter: "blur(28px)",
              }}
            />

            {/* Noise overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
                opacity: 0.08,
                mixBlendMode: "overlay",
              }}
            />

            {/* Barely-there technical grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(148,163,184,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.025) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                maskImage: "radial-gradient(ellipse 78% 68% at 58% 42%, black 8%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(ellipse 78% 68% at 58% 42%, black 8%, transparent 78%)",
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[24%] z-0 -translate-x-1/2 whitespace-nowrap text-[clamp(8.5rem,20vw,19rem)] font-bold uppercase leading-none text-white/[0.045] [font-family:var(--font-heading)]"
              style={{
                letterSpacing: "0.055em",
                maskImage: "linear-gradient(90deg, transparent 0%, black 11%, black 89%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 11%, black 89%, transparent 100%)",
              }}
            >
              Solutions
            </div>

            <div className="relative mx-auto max-w-[1440px] w-full px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-20 lg:px-16 xl:px-20">
              {/* Balanced asymmetrical composition */}
              <div className="relative flex flex-col items-start gap-14 lg:min-h-[500px] lg:flex-row lg:items-center lg:gap-0">
                {/* Directional signal path from intelligence to system */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
                  viewBox="0 0 1200 500"
                  preserveAspectRatio="none"
                  style={{ animation: "solSignalIn 1.2s ease 0.65s both" }}
                >
                  <defs>
                    <linearGradient id="heroSignalTrail" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
                      <stop offset="48%" stopColor="#93c5fd" stopOpacity="0.06" />
                      <stop offset="82%" stopColor="#a78bfa" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                    </linearGradient>
                    <filter id="heroSignalBlur" x="-20%" y="-100%" width="140%" height="300%">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                  </defs>
                  <path d="M 410 260 C 570 260 650 228 820 236 C 900 240 948 226 1018 196" fill="none" stroke="url(#heroSignalTrail)" strokeWidth="6" filter="url(#heroSignalBlur)" />
                  <path
                    d="M 410 260 C 570 260 650 228 820 236 C 900 240 948 226 1018 196"
                    fill="none"
                    stroke="url(#heroSignalTrail)"
                    strokeWidth="0.45"
                    strokeDasharray="2 14"
                    style={{ animation: "solSignalDash 10s linear infinite both" }}
                  />
                </svg>

                {/* Left */}
                <div
                  className="relative z-10 w-full lg:w-[56%]"
                  style={{ animation: "solHeroLeftIn 0.95s cubic-bezier(0.22, 1, 0.36, 1) both" }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-40 top-[48%] -z-10 h-[560px] w-[820px] -translate-y-1/2"
                    style={{
                      background:
                        "radial-gradient(ellipse 58% 54% at 40% 46%, rgba(96,165,250,0.085), rgba(99,102,241,0.038) 46%, transparent 76%), radial-gradient(ellipse 48% 44% at 58% 58%, rgba(139,92,246,0.032), transparent 72%)",
                      filter: "blur(58px)",
                      opacity: 0.86,
                    }}
                  />
                  <p
                    className="mb-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/40"
                    style={{ animation: "solHeroEyebrowIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.02s both" }}
                  >
                    ENTERPRISE SOLUTIONS
                  </p>

                  <h1
                    className="text-[clamp(2.5rem,8vw,48px)] sm:text-[clamp(3rem,8vw,64px)] lg:text-[72px] font-bold leading-[1.0] [font-family:var(--font-heading)]"
                    style={{
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {["Technology built around", "your business. Not the", "other way around."].map((line, index) => (
                      <span
                        key={line}
                        className="block text-transparent will-change-transform"
                        style={{
                          animation: `solHeroLineIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s both`,
                          backgroundImage:
                            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(200,200,200,0.95) 100%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </h1>

                  <div
                    className="mt-[40px] max-w-[580px]"
                    style={{ animation: "solHeroEyebrowIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.38s both" }}
                  >
                    <p className="text-[16px] text-white/75 leading-[1.7]">
                      From AI systems and custom software to websites, applications, and automation, we create digital solutions designed around how your business actually works.
                    </p>

                    <div className="mt-[12px]">
                      <p
                        className="text-[14px] text-white/40 leading-[1.7]"
                        style={{ animation: "solHeroLineIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both" }}
                      >
                        Fast. Reliable. Built to scale with your business.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: hyper-realistic-ish obsidian glass sphere */}
                <div
                  className="relative z-10 flex w-full justify-center lg:w-[44%] lg:justify-start"
                  style={{ animation: "solHeroRightIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both" }}
                >
                  <div className="relative pt-[22px] lg:translate-x-20 lg:translate-y-7 xl:translate-x-28 2xl:translate-x-32">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-24 translate-x-10 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 46% 50%, rgba(99,102,241,0.16), rgba(59,130,246,0.055) 42%, transparent 72%)",
                        filter: "blur(30px)",
                        animation: "solHeroGlowPulse 7.5s ease-in-out infinite",
                      }}
                    />
                    <div className="relative h-[min(84vw,390px)] w-[min(84vw,390px)] xl:h-[420px] xl:w-[420px]">
                      <svg
                        aria-hidden="true"
                        className="absolute inset-0 z-10 h-full w-full"
                        viewBox="0 0 360 360"
                        style={{
                          animation: "solSphereIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both",
                          transformOrigin: "center",
                        }}
                      >
                        <defs>
                          <linearGradient id="solutionsHeroLine" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.05" />
                            <stop offset="52%" stopColor="#bfdbfe" stopOpacity="0.58" />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.08" />
                          </linearGradient>
                          <filter id="solutionsHeroGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation="2.4" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <g
                          style={{ transformBox: "fill-box", transformOrigin: "center", animation: "solSphereRotate 36s linear infinite" }}
                        >
                          <ellipse cx="180" cy="180" rx="120" ry="88" fill="none" stroke="url(#solutionsHeroLine)" strokeWidth="0.8" />
                          <ellipse cx="180" cy="180" rx="108" ry="126" fill="none" stroke="url(#solutionsHeroLine)" strokeWidth="0.55" transform="rotate(62 180 180)" />
                          <path d="M 86 182 C 132 122 222 116 274 178 C 226 242 132 244 86 182 Z" fill="none" stroke="url(#solutionsHeroLine)" strokeWidth="0.55" />
                        </g>
                        {[
                          { cx: 92, cy: 182, delay: 0 },
                          { cx: 148, cy: 118, delay: 0.7 },
                          { cx: 242, cy: 134, delay: 1.35 },
                          { cx: 276, cy: 184, delay: 2.05 },
                          { cx: 190, cy: 270, delay: 2.7 },
                        ].map((node) => (
                          <circle
                            key={`${node.cx}-${node.cy}`}
                            cx={node.cx}
                            cy={node.cy}
                            r="1.8"
                            fill="#dbeafe"
                            filter="url(#solutionsHeroGlow)"
                            style={{
                              transformBox: "fill-box",
                              transformOrigin: "center",
                              animation: `solNodePulse 4.2s ease-in-out ${node.delay}s infinite both`,
                            }}
                          />
                        ))}
                        <path
                          d="M 88 180 C 138 116 228 122 278 184"
                          fill="none"
                          stroke="#bfdbfe"
                          strokeLinecap="round"
                          strokeWidth="0.8"
                          filter="url(#solutionsHeroGlow)"
                          pathLength={1}
                          strokeDasharray={1}
                          style={{ animation: "solPathDraw 5.4s ease-in-out infinite both" }}
                        />
                      </svg>

                      {/* Back glow */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%), radial-gradient(circle at 65% 70%, rgba(99,102,241,0.20), rgba(99,102,241,0) 55%)",
                          filter: "blur(8px)",
                        }}
                      />

                      {/* Sphere */}
                      <div
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 h-[77.8%] w-[77.8%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.20), rgba(255,255,255,0.04) 22%, rgba(0,0,0,0.85) 58%, rgba(99,102,241,0.08) 100%)",
                          boxShadow:
                            "inset 0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.65)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {/* Caustic-like internal neural fibers */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 25% 30%, rgba(99,102,241,0.65), rgba(99,102,241,0) 45%), repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0 2px, rgba(0,0,0,0) 2px 10px), repeating-linear-gradient(45deg, rgba(99,102,241,0.22) 0 2px, rgba(0,0,0,0) 2px 10px)",
                            mixBlendMode: "screen",
                            opacity: 0.65,
                            filter: "blur(0.2px)",
                          }}
                        />

                        {/* Moving highlight */}
                        <div
                          aria-hidden="true"
                          className="absolute -left-10 top-8 h-24 w-44 rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0) 100%)",
                            transform: "rotate(18deg)",
                            animation: "glassHighlight 10s ease-in-out infinite",
                          }}
                        />

                        {/* Rim light */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full"
                          style={{
                            boxShadow:
                              "inset 0 0 0 2px rgba(255,255,255,0.06), inset 0 0 24px rgba(99,102,241,0.16)",
                            opacity: 1,
                          }}
                        />
                      </div>

                      {/* Front caustic */}
                      <div
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 h-[72.2%] w-[72.2%] -translate-x-1/2 -translate-y-1/2"
                        style={{
                          borderRadius: 9999,
                          background:
                            "conic-gradient(from 210deg, rgba(255,255,255,0.0) 0deg, rgba(255,255,255,0.14) 40deg, rgba(99,102,241,0.10) 95deg, rgba(255,255,255,0.0) 160deg, rgba(255,255,255,0.12) 230deg, rgba(255,255,255,0.0) 360deg)",
                          filter: "blur(10px)",
                          opacity: 0.55,
                        }}
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* Bento Box grid */}
              <div className="mt-[72px] h-px w-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />

              <div className="mt-0 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                {[
                  {
                    n: "01",
                    name: "Instant Integration",
                    desc: "Deploy production-ready AI agents and neural networks into existing infrastructure in days, not months.",
                  },
                  {
                    n: "02",
                    name: "Zero-Trust Security",
                    desc: "Enterprise-grade compliance and security architecture built for critical operations and regulated industries.",
                  },
                  {
                    n: "03",
                    name: "Scalable Infrastructure",
                    desc: "AI inference systems that scale dynamically with your usage, your growth, and your industry demands.",
                  },
                ].map((row) => (
                  <div
                    key={row.n}
                    className="group relative overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-[10px] px-6 py-6"
                    style={{
                      boxShadow:
                        "inset 0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px rgba(0,0,0,0.35)",
                    }}
                  >
                    {/* Inner glow border */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[18px]"
                      style={{
                        boxShadow:
                          "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(99,102,241,0.06)",
                        opacity: 0.9,
                      }}
                    />

                    {/* Minimal noise */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(to bottom, rgba(255,255,255,0.02), rgba(255,255,255,0))",
                        opacity: 0.6,
                      }}
                    />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-[12px] text-white/35 tracking-[0.04em] font-semibold">
                          {row.n}
                        </span>
                        <div className="mt-4 flex items-center gap-3">
                          <span className="text-[22px] font-bold text-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[6px]">
                            {row.name}
                          </span>
                        </div>
                        <p className="mt-3 text-[14px] text-white/50 leading-[1.6]">
                          {row.desc}
                        </p>
                      </div>

                      {/* Line-art icon with subtle outer glow */}
                      <span
                        className="shrink-0 inline-flex items-center justify-center rounded-full w-10 h-10 border border-white/10 bg-[rgba(255,255,255,0.02)] text-white/35 group-hover:text-white/70 transition-colors duration-300"
                        style={{
                          boxShadow: "0 0 22px rgba(99,102,241,0.12)",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M5 12h14"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M13 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Businesses Choose WEBBED (moved directly below hero) */}
          <div className="relative mt-8">
            <WhyUsSection />
          </div>

          {/* Interactive service gallery */}
          <section id="wb-services" className="relative mt-8 w-full overflow-hidden bg-black py-24 sm:py-28 lg:py-36">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 42% 34% at 50% 46%, rgba(99,102,241,0.055), transparent 76%)" }}
            />

            <div className="relative mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
              <div className="mb-14 flex items-end justify-between gap-8 sm:mb-20">
                <div>
                  <p className="text-[11px] font-semibold uppercase text-white/35" style={{ letterSpacing: "0.22em" }}>What we build</p>
                  <h2 className="mt-4 text-[clamp(2.25rem,4vw,4rem)] font-bold leading-none [font-family:var(--font-heading)]">
                    Built for growth. Designed for impact.
                  </h2>
                </div>
                <p className="hidden text-[11px] font-semibold uppercase text-white/30 sm:block" style={{ letterSpacing: "0.22em" }}>09 services</p>
              </div>

              <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-6 xl:gap-10">
                {(
                  [
                    { n: "01", name: "Websites", desc: "Distinctive, conversion-focused websites engineered for clarity, speed, and sustainable growth.", detail: "Strategy · Design · Development" },
                    { n: "02", name: "Web Applications", desc: "Scalable digital products shaped around real workflows, complex data, and demanding users.", detail: "Product · Platforms · Portals" },
                    { n: "03", name: "AI Solutions", desc: "Practical AI systems and intelligent agents embedded directly into business operations.", detail: "Agents · Automation · Intelligence" },
                    { n: "04", name: "Custom Software", desc: "Purpose-built software engineered precisely around your organization and its ambitions.", detail: "Architecture · Engineering · Scale" },
                    { n: "05", name: "SEO Optimization", desc: "Technical and content systems designed to compound visibility, authority, and qualified demand.", detail: "Technical · Content · Performance" },
                    { n: "06", name: "UI/UX Design", desc: "Elegant product experiences that turn complex interactions into intuitive, considered journeys.", detail: "Research · Systems · Experience" },
                    { n: "07", name: "Native Apps", desc: "High-performance mobile applications built for speed, retention, and seamless user experiences.", detail: "iOS · Android · Cross-Platform" },
                    { n: "08", name: "Custom Integrations", desc: "Tailored integrations that unify tools, platforms, and data into one cohesive ecosystem.", detail: "API · Middleware · Automation" },
                    { n: "09", name: "Logo Design", desc: "Distinctive, memorable logos crafted to capture your brand's essence and stand the test of time.", detail: "Identity · Marks · Systems" },
                  ] as const
                ).map((service, idx) => {
                  const isHovered = hoveredServiceIdx === idx;
                  const isExpanded = expandedIdx === idx;
                  const showContent = isHovered || isExpanded;
                  const visuals = SERVICE_VISUALS[idx];

                  return (
                    <div
                      key={service.n}
                      className=""
                      style={{
                        opacity: 0,
                        animation: `solCardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${(idx % 3) * 0.08}s forwards`,
                      }}
                    >
                      <div>
                        <button
                          type="button"
                          aria-expanded={showContent}
                          onMouseEnter={() => setHoveredServiceIdx(idx)}
                          onMouseLeave={() => setHoveredServiceIdx(null)}
                          onClick={() => setExpandedIdx((current) => (current === idx ? null : idx))}
                          className="group relative block min-h-[220px] w-full overflow-hidden rounded-[6px] border border-white/[0.14] bg-white/[0.025] px-6 py-6 text-left backdrop-blur-xl transition-all duration-300 hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 sm:min-h-[240px]"
                          style={{
                            boxShadow: showContent
                              ? "0 28px 80px rgba(79,70,229,0.14), inset 0 1px 0 rgba(255,255,255,0.08)"
                              : "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.055)",
                            transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
                          }}
                          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.985)"; }}
                          onMouseUp={(e) => { e.currentTarget.style.transform = ""; }}
                        >
                          {visuals && (
                            <ServiceCardVisuals
                              imageUrl={visuals.imageUrl}
                              abbreviation={visuals.abbreviation}
                              opacity={visuals.opacity}
                            />
                          )}

                          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at 50% 20%, rgba(99,102,241,0.16), transparent 66%)" }} />

                          {["left-[-1px] top-[-1px] border-l border-t", "right-[-1px] top-[-1px] border-r border-t", "bottom-[-1px] left-[-1px] border-b border-l", "bottom-[-1px] right-[-1px] border-b border-r"].map((position) => (
                            <span key={position} aria-hidden="true" className={`pointer-events-none absolute h-5 w-5 border-white/60 ${position}`} />
                          ))}

                          <div className="relative flex min-h-[164px] flex-col sm:min-h-[184px] z-10">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-white/30" style={{ letterSpacing: "0.16em" }}>
                              <span>{service.n}</span>
                              <span
                                className="text-base font-light text-white/45"
                                style={{
                                  display: "inline-block",
                                  transform: showContent ? "rotate(45deg)" : "rotate(0deg)",
                                  transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                              >
                                +
                              </span>
                            </div>

                            <div className="flex flex-1 items-center justify-center">
                              <h3 className="text-center text-[clamp(1.35rem,2vw,1.8rem)] font-bold leading-tight text-white [font-family:var(--font-heading)]">{service.name}</h3>
                            </div>

                            <div
                              className="overflow-hidden"
                              style={{
                                maxHeight: showContent ? 200 : 0,
                                opacity: showContent ? 1 : 0,
                                transform: showContent ? "translateY(0)" : "translateY(8px)",
                                transition: "max-height 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.42s ease, transform 0.42s ease",
                              }}
                            >
                              <div className="border-t border-white/[0.08] pt-3 text-center">
                                <p className="text-[13px] leading-[1.6] text-white/62">{service.desc}</p>
                                {isExpanded && (
                                  <p className="mt-2 text-[9px] font-semibold uppercase text-indigo-200/45" style={{ letterSpacing: "0.14em" }}>{service.detail}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Testimonials Section (directly below WHAT WE BUILD) */}
          <section className="w-full bg-white text-black mt-10">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 py-16 sm:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* Left: static */}
                <div className="flex h-full flex-col lg:justify-center lg:py-10 lg:pr-8">
                  <h2
                    className="text-[clamp(1.75rem,8vw,44px)] sm:text-[clamp(2rem,8vw,52px)] font-bold leading-[1.05]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    What our customers think
                  </h2>

                  <p className="mt-6 text-[15px] sm:text-[16px] text-black/55 leading-relaxed max-w-[48ch]">
                    We partner with founders and teams to ship software that actually moves the
                    business forward. Here&apos;s what the people we&apos;ve worked with have to say
                    about building with WEBBED.
                  </p>

                  {/* Manual controls; autoplay continues in the background. */}
                  <div className="mt-8 flex items-center gap-2 sm:mt-10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={showPreviousTestimonial}
                        aria-label="Show previous testimonial"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-white transition hover:bg-neutral-800 active:scale-95"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={showNextTestimonial}
                        aria-label="Show next testimonial"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-white transition hover:bg-neutral-800 active:scale-95"
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: dynamic carousel */}
                <div
                  className="relative overflow-hidden rounded-[20px] border border-black/10"
                  onTouchStart={(event) => {
                    testimonialTouchStartXRef.current = event.touches[0]?.clientX ?? null;
                  }}
                  onTouchEnd={(event) => {
                    const startX = testimonialTouchStartXRef.current;
                    const endX = event.changedTouches[0]?.clientX;
                    testimonialTouchStartXRef.current = null;
                    if (startX == null || endX == null) return;
                    const distance = endX - startX;
                    if (distance > 45) showPreviousTestimonial();
                    if (distance < -45) showNextTestimonial();
                  }}
                >
                  <div
                    className="absolute inset-0 transition-colors duration-500"
                    style={{
                      backgroundColor: testimonials[testimonialIdx]?.theme === "dark" ? "#000000" : "#ffffff",
                    }}
                  />

                  <div className="relative flex min-h-[320px] items-center p-6 sm:min-h-[360px] sm:p-12">
                    <div className="w-full">
                      <div
                        key={testimonialIdx}
                        aria-live="polite"
                        style={{ animation: "solTestimonialIn 0.35s ease-out" }}
                      >
                        {/* Logo */}
                        <div
                          className="flex items-center justify-end"
                          style={{ color: testimonials[testimonialIdx]?.theme === "dark" ? "#fff" : "#000" }}
                        >
                          <div
                            className="max-w-full rounded-full border px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.1em] sm:px-4 sm:text-[12px] sm:tracking-[0.12em]"
                            style={{
                              borderColor: testimonials[testimonialIdx]?.theme === "dark" ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)",
                              background: testimonials[testimonialIdx]?.theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
                            }}
                          >
                            {testimonials[testimonialIdx]?.company}
                          </div>
                        </div>

                        {/* Quote */}
                        <p
                          className="mt-7 text-[20px] leading-[1.4] italic sm:mt-8 sm:text-[30px] sm:leading-[1.35]"
                          style={{ color: testimonials[testimonialIdx]?.theme === "dark" ? "#ffffff" : "#111827" }}
                        >
                          “{testimonials[testimonialIdx]?.quote}”
                        </p>

                        {/* Author */}
                        <div className="mt-7 sm:mt-10">
                          <p
                            className="font-bold text-[16px]"
                            style={{ color: testimonials[testimonialIdx]?.theme === "dark" ? "#ffffff" : "#111827" }}
                          >
                            {testimonials[testimonialIdx]?.name}
                          </p>
                          {testimonials[testimonialIdx]?.title ? (
                            <p
                              className="text-[14px]"
                              style={{ color: testimonials[testimonialIdx]?.theme === "dark" ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.60)" }}
                            >
                              <span className="font-medium">{testimonials[testimonialIdx]?.title}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Let's build what's next CTA Section */}
          <div
            style={{ animation: "solCtaIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) both" }}
            className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 w-full mt-20"
          >
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] backdrop-blur-3xl px-6 sm:px-[72px] py-[60px] sm:py-[80px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="relative z-10">
                {/* Eyebrow */}
                <p className="text-[12px] tracking-[0.32em] uppercase text-white/60 font-bold">
                  READY WHEN YOU ARE
                </p>

                {/* Heading (left-aligned, 64px) */}
                <h2 className="mt-6 text-[clamp(2.25rem,10vw,64px)] leading-[1] font-bold text-white [font-family:var(--font-heading)]">
                  Let&apos;s build something worth remembering.
                </h2>

                {/* Body */}
                <p className="mt-6 text-[18px] text-white/90 font-normal leading-[1.8] max-w-[56ch]">
                  Whether you&apos;re launching a new venture, modernizing operations, exploring AI,
                  or bringing a bold idea to life, we&apos;re ready to help make it real.
                </p>

                {/* Buttons (left-aligned) */}
                <div className="mt-10 flex flex-col sm:flex-row gap-5 items-start">
                  <MagneticButton href="/contact" primary>
                    Get in Touch
                  </MagneticButton>
                  <MagneticButton href="/about">
                    Explore WEBBED
                  </MagneticButton>
                </div>

                {/* Bottom rule + tiny caps line */}
                <div className="mt-14 border-t border-white/10" />
                <p className="mt-4 text-[11px] tracking-[0.22em] text-white/55 uppercase [font-family:var(--font-ui)] font-semibold">
                  NO COMMITMENT NEEDED &middot; JUST A CONVERSATION
                </p>
              </div>
            </div>
          </div>

        </main>

        <CinematicFooter />
      </div>

      <style jsx global>{`
        @keyframes glassHighlight {
          0%, 12% { transform: translateX(-58px) rotate(18deg); opacity: 0; }
          24% { opacity: 0.28; }
          48% { transform: translateX(72px) rotate(18deg); opacity: 0.14; }
          62%, 100% { transform: translateX(86px) rotate(18deg); opacity: 0; }
        }
        @keyframes solHeroLeftIn {
          from { opacity: 0; transform: translate3d(-44px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes solHeroRightIn {
          from { opacity: 0; transform: translate3d(72px, 0, 0) scale(0.92); filter: blur(10px); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
        @keyframes solHeroEyebrowIn {
          from { opacity: 0; transform: translate3d(-24px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes solHeroLineIn {
          from { opacity: 0; transform: translate3d(0, 20px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes solHeroGlowPulse {
          0%, 100% { opacity: 0.52; transform: scale(0.96); }
          50%      { opacity: 0.82; transform: scale(1.035); }
        }
        @keyframes solCardIn {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes solCtaIn {
          from { opacity: 0; transform: translate3d(0, 48px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes solTestimonialIn {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes solSignalIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes solSignalDash {
          0%   { stroke-dashoffset: 0; opacity: 0.1; }
          50%  { opacity: 0.28; }
          100% { stroke-dashoffset: -64; opacity: 0.1; }
        }
        @keyframes solSphereIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes solSphereRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes solNodePulse {
          0%   { opacity: 0.24; transform: scale(0.9); }
          50%  { opacity: 0.8; transform: scale(1.15); }
          100% { opacity: 0.24; transform: scale(0.9); }
        }
        @keyframes solPathDraw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          50%  { opacity: 0.5; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>
    </>
  );
}
