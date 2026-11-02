"use client";

import { ensureScrollTrigger, useAnimate } from "@/lib/motion";
import gsap from "gsap";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

/* ──────────────────── Product Card Data ──────────────────── */

interface ProductCard {
  id: number;
  name: string;
  tagline: string;
  status: string;
  version: string;
  color: string;
  glowColor: string;
  offsetX: number;
  offsetY: number;
  zIndex: number;
  size: "sm" | "md" | "lg";
  depth: number;
  floatDuration: number;
  floatDelay: number;
  rotation: number;
  stack: { offsetX: number; offsetY: number; rotation: number; opacity: number }[];
}

const PRODUCT_CARDS: ProductCard[] = [
  {
    id: 1, name: "InSynk", tagline: "ERP & Job Tracking Software", status: "Active", version: "v0.9.2",
    color: "rgba(99,102,241,0.4)", glowColor: "rgba(99,102,241,0.15)",
    offsetX: -30, offsetY: -28, zIndex: 7, size: "lg", depth: 2,
    floatDuration: 14, floatDelay: 0, rotation: -3,
    stack: [
      { offsetX: -12, offsetY: -10, rotation: -7, opacity: 0.35 },
      { offsetX: -6, offsetY: -5, rotation: -11, opacity: 0.18 },
    ],
  },
  {
    id: 2, name: "Project HIVE", tagline: "Autonomous Agentic AI", status: "Alpha", version: "v0.4.1",
    color: "rgba(16,185,129,0.4)", glowColor: "rgba(16,185,129,0.15)",
    offsetX: 28, offsetY: -30, zIndex: 5, size: "md", depth: 1,
    floatDuration: 16, floatDelay: 2.0, rotation: 3,
    stack: [{ offsetX: 10, offsetY: -8, rotation: 7, opacity: 0.25 }],
  },
  {
    id: 3, name: "AIDA", tagline: "Autonomous AI for Data Automation", status: "Beta", version: "v1.1.0",
    color: "rgba(244,63,94,0.4)", glowColor: "rgba(244,63,94,0.15)",
    offsetX: -38, offsetY: -4, zIndex: 8, size: "md", depth: 2,
    floatDuration: 13, floatDelay: 0.8, rotation: -2,
    stack: [{ offsetX: -10, offsetY: 6, rotation: -6, opacity: 0.3 }],
  },
  {
    id: 4, name: "GRABBO", tagline: "Seamless Rentals at your doorstep", status: "Dev", version: "v0.2.0",
    color: "rgba(251,191,36,0.4)", glowColor: "rgba(251,191,36,0.15)",
    offsetX: 36, offsetY: 4, zIndex: 6, size: "sm", depth: 1,
    floatDuration: 18, floatDelay: 3.0, rotation: 4, stack: [],
  },
  {
    id: 5, name: "WABI", tagline: "AI Detector to know what's real", status: "Prototype", version: "v0.1.3",
    color: "rgba(139,92,246,0.4)", glowColor: "rgba(139,92,246,0.15)",
    offsetX: -26, offsetY: 32, zIndex: 4, size: "lg", depth: 1,
    floatDuration: 15, floatDelay: 1.5, rotation: -5,
    stack: [
      { offsetX: -8, offsetY: 10, rotation: -9, opacity: 0.3 },
      { offsetX: -4, offsetY: 5, rotation: -13, opacity: 0.15 },
    ],
  },
  {
    id: 6, name: "G-Card", tagline: "The Future of Gifting", status: "Concept", version: "v0.0.1",
    color: "rgba(6,182,212,0.4)", glowColor: "rgba(6,182,212,0.15)",
    offsetX: 26, offsetY: 30, zIndex: 3, size: "sm", depth: 0,
    floatDuration: 19, floatDelay: 2.5, rotation: 2,
    stack: [{ offsetX: 10, offsetY: 8, rotation: 6, opacity: 0.2 }],
  },
];

const CARD_SIZES: Record<"sm" | "md" | "lg", { w: number; h: number }> = {
  sm: { w: 200, h: 118 },
  md: { w: 260, h: 145 },
  lg: { w: 320, h: 165 },
};

const DEPTH_STYLES: Record<number, { opacity: number }> = {
  0: { opacity: 0.55 },
  1: { opacity: 0.8 },
  2: { opacity: 1 },
};

/* ──────────────────── Stacked Card ──────────────────── */

function StackedCard({
  card,
  stackLayer,
  primaryX,
  primaryY,
  primaryRotate,
}: {
  card: ProductCard;
  stackLayer: { offsetX: number; offsetY: number; rotation: number; opacity: number };
  primaryX: number;
  primaryY: number;
  primaryRotate: number;
}) {
  const size = CARD_SIZES[card.size];
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.style.transform = `translate3d(${primaryX + stackLayer.offsetX}px, ${primaryY + stackLayer.offsetY}px, 0) rotate(${primaryRotate + stackLayer.rotation}deg)`;
    };
    update();
    // Subscribe to a simple interval (cheap; primary coords update at requestAnimationFrame rate)
    let frame = 0;
    const tick = () => {
      update();
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [primaryX, primaryY, primaryRotate, stackLayer]);
  return (
    <div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        width: size.w,
        height: size.h,
        zIndex: card.zIndex - 1,
        opacity: stackLayer.opacity,
      }}
    >
      <div
        className="w-full h-full rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${card.color.replace("0.4", "0.08")}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
        }}
      />
    </div>
  );
}

/* ──────────────────── Floating Card ──────────────────── */

function FloatingCard({
  card,
  mouseXRef,
  mouseYRef,
  boundsRef,
}: {
  card: ProductCard;
  mouseXRef: React.MutableRefObject<number>;
  mouseYRef: React.MutableRefObject<number>;
  boundsRef: React.MutableRefObject<{ width: number; height: number }>;
}) {
  const size = CARD_SIZES[card.size];
  const depthStyle = DEPTH_STYLES[card.depth];

  const primaryRef = useRef<HTMLDivElement>(null);
  const cardBodyRef = useRef<HTMLDivElement>(null);

  const [primary, setPrimary] = useState({ x: 0, y: 0, rotate: card.rotation });

  useEffect(() => {
    let frame = 0;
    const startTime = performance.now();
    const tick = (time: number) => {
      const elapsed = (time - startTime) / 1000;

      const phase = ((elapsed + card.floatDelay) / card.floatDuration) * Math.PI * 2;
      const fy = Math.sin(phase) * 12;
      const fr =
        Math.sin(phase * 0.77) * card.rotation * 0.35 +
        Math.cos(phase * 0.43) * 0.8;

      const b = boundsRef.current;
      const centerX = b.width / 2;
      const centerY = b.height / 2;
      const mx = mouseXRef.current;
      const my = mouseYRef.current;
      const dx = mx - centerX;
      const dy = my - centerY;
      const proximityX = 1 - Math.min(Math.abs(card.offsetX) / 40, 1);
      const proximityY = 1 - Math.min(Math.abs(card.offsetY) / 40, 1);
      const px = dx * proximityX * 0.06;
      const py = dy * proximityY * 0.06;

      const finalX = b.width / 2 + (b.width * card.offsetX) / 100 + px - size.w / 2;
      const finalY = b.height / 2 + (b.height * card.offsetY) / 100 + fy + py - size.h / 2;
      const finalRotate = card.rotation + fr;

      setPrimary({ x: finalX, y: finalY, rotate: finalRotate });

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [card, boundsRef, mouseXRef, mouseYRef, size.w, size.h]);

  // Apply transform to primary card directly
  useEffect(() => {
    const el = primaryRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${primary.x}px, ${primary.y}px, 0) rotate(${primary.rotate}deg)`;
  }, [primary]);

  // Hover scale
  const handleEnter = () => {
    gsap.to(cardBodyRef.current, { scale: 1.05, y: -3, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  };
  const handleLeave = () => {
    gsap.to(cardBodyRef.current, { scale: 1, y: 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  };

  return (
    <>
      {card.stack.map((layer, i) => (
        <StackedCard
          key={`${card.id}-stack-${i}`}
          card={card}
          stackLayer={layer}
          primaryX={primary.x}
          primaryY={primary.y}
          primaryRotate={primary.rotate}
        />
      ))}

      <div
        ref={primaryRef}
        className="absolute pointer-events-auto"
        style={{
          width: size.w,
          height: size.h,
          zIndex: card.zIndex,
          willChange: "transform",
          opacity: depthStyle.opacity,
        }}
      >
        <div
          ref={cardBodyRef}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="w-full h-full rounded-2xl p-4 flex flex-col justify-between cursor-default"
          style={{
            background: "rgba(255,255,255,0.045)",
            backdropFilter: `blur(${20 + card.depth * 4}px) saturate(1.2)`,
            WebkitBackdropFilter: `blur(${20 + card.depth * 4}px) saturate(1.2)`,
            border: `1px solid ${card.color.replace("0.4", "0.12")}`,
            boxShadow: [
              `0 8px 32px rgba(0,0,0,0.45)`,
              `0 0 60px ${card.glowColor}`,
              `inset 0 1px 0 rgba(255,255,255,0.07)`,
              ...(card.depth >= 1 ? [`0 0 1px rgba(255,255,255,0.08)`] : []),
            ].join(", "),
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-1"
                style={{ color: card.color.replace("0.4", "0.7") }}
              >
                {card.tagline}
              </p>
              <h4
                className="text-[13px] font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {card.name}
              </h4>
            </div>
            <div
              className="w-2 h-2 rounded-full mt-1 shrink-0"
              style={{
                background: card.color.replace("0.4", "0.8"),
                boxShadow: `0 0 8px ${card.glowColor}`,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-[8px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {card.status}
            </span>
            <span className="text-[8px] text-white/25 font-mono">
              {card.version}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────────────── Card Network Connections ──────────────────── */

function CardNetwork({ boundsRef }: { boundsRef: React.MutableRefObject<{ width: number; height: number }> }) {
  const [dims, setDims] = useState({ width: 1400, height: 800 });

  useEffect(() => {
    const sync = () => setDims({ ...boundsRef.current });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [boundsRef]);

  const centers = useMemo(() => PRODUCT_CARDS.map((c) => ({ offsetX: c.offsetX, offsetY: c.offsetY })), []);

  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; opacity: number; color: string; id: string; dur: number }[] = [];
    const threshold = 400;
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const ax = dims.width / 2 + (dims.width * centers[i].offsetX) / 100;
        const ay = dims.height / 2 + (dims.height * centers[i].offsetY) / 100;
        const bx = dims.width / 2 + (dims.width * centers[j].offsetX) / 100;
        const by = dims.height / 2 + (dims.height * centers[j].offsetY) / 100;
        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
        if (dist < threshold && result.length < 8) {
          const opacity = 0.06 * (1 - dist / threshold);
          const color = (i + j) % 3 === 0 ? "rgba(99,102,241," : (i + j) % 3 === 1 ? "rgba(244,63,94," : "rgba(139,92,246,";
          result.push({ x1: ax, y1: ay, x2: bx, y2: by, opacity, color, id: `net-${i}-${j}`, dur: 12 + ((i * 7 + j * 13) % 8) });
        }
      }
    }
    return result;
  }, [centers, dims]);

  if (lines.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
      <defs>
        {lines.map((line) => (
          <linearGradient key={`lg-${line.id}`} id={`lg-${line.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`${line.color}0.5)`} />
            <stop offset="50%" stopColor={`${line.color}${(line.opacity * 6).toFixed(2)})`} />
            <stop offset="100%" stopColor={`${line.color}0.5)`} />
          </linearGradient>
        ))}
      </defs>
      {lines.map((line) => (
        <g key={line.id}>
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={`url(#lg-${line.id})`} strokeWidth="1" opacity={line.opacity} />
          <circle r="3" fill={`${line.color}0.25)`}>
            <animateMotion dur={`${line.dur}s`} repeatCount="indefinite" path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`} />
            <animate attributeName="opacity" values="0;0.6;0" dur={`${line.dur}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="2;4;2" dur={`${line.dur}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ──────────────────── Particle Field ──────────────────── */

function ParticleField() {
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; opacity: number; duration: number; delay: number; depth: number }[]
  >([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 70; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.3 + 0.03,
        duration: Math.random() * 25 + 18,
        delay: Math.random() * 12,
        depth: Math.random(),
      });
    }
    setParticles(arr);
  }, []);

  if (particles.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {particles.map((p, i) => (
        <circle
          key={`p-${i}`}
          cx={p.x}
          cy={p.y}
          r={p.size * 0.14 * (0.6 + p.depth * 0.5)}
          fill={
            p.depth > 0.7 ? "rgba(99,102,241,0.8)" : p.depth > 0.4 ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.8)"
          }
          opacity={p.opacity * (0.4 + p.depth * 0.6)}
        >
          <animate
            attributeName="opacity"
            values={`${p.opacity * (0.4 + p.depth * 0.6)};${p.opacity * 0.1};${p.opacity * (0.4 + p.depth * 0.6)}`}
            dur={`${p.duration}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${p.y};${p.y - 0.8};${p.y}`}
            dur={`${p.duration * 1.4}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

/* ──────────────────── Word Reveal ──────────────────── */

const WordReveal = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap justify-center">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-[0.1em]">
          <RevealWord delay={delay} index={i}>
            {word}
          </RevealWord>
        </span>
      ))}
    </span>
  );
};

function RevealWord({ delay, index, children }: { delay: number; index: number; children: React.ReactNode }) {
  const ref = useAnimate<HTMLSpanElement>({
    initial: { opacity: 0, yPercent: 100 },
    animate: { opacity: 1, yPercent: 0 },
    transition: { duration: 0.8, delay: delay + index * 0.04, ease: [0.22, 1, 0.36, 1] },
  });
  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}

/* ──────────────────── Main Component ──────────────────── */

export default function LabsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const boundsRef = useRef({ width: 1400, height: 800 });
  const mouseXRef = useRef(700);
  const mouseYRef = useRef(400);

  const transitionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const badgeRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay: 0.1, ease: transitionEase as unknown as number[] },
  });
  const ctaRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay: 2.0, ease: transitionEase as unknown as number[] },
  });
  const scrollIndRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, delay: 2.8 },
  });

  const glowTopLeftRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 0.3 },
    transition: { duration: 4 },
  });
  const glowBottomRightRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 0.18 },
    transition: { duration: 4, delay: 0.5 },
  });
  const glowMidRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 0.12 },
    transition: { duration: 5, delay: 1 },
  });
  const centerGlowRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 0.1 },
    transition: { duration: 5, delay: 1.5 },
  });

  useEffect(() => {
    const update = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        boundsRef.current = { width: rect.width, height: rect.height };
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseXRef.current = e.clientX - rect.left;
    mouseYRef.current = e.clientY - rect.top;
  }, []);


  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-black text-white overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          ref={glowTopLeftRef}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(49,46,129,0.7) 0%, rgba(30,27,75,0.3) 30%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          ref={glowBottomRightRef}
          className="absolute -bottom-[15%] -right-[5%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(127,29,29,0.6) 0%, rgba(127,29,29,0.2) 30%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          ref={glowMidRef}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[45vw] h-[45vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(67,56,202,0.4) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />

        <ParticleField />
      </div>

      {/* Center Glow */}
      <div
        ref={centerGlowRef}
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: "min(1300px, 95vw)",
          height: "min(1300px, 95vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.55) 0%, rgba(244,63,94,0.25) 35%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* Card Network Connections */}
      <CardNetwork boundsRef={boundsRef} />

      {/* Floating Cards */}
      <div className="absolute inset-0 z-[1]">
        {PRODUCT_CARDS.map((card) => (
          <FloatingCard
            key={card.id}
            card={card}
            mouseXRef={mouseXRef}
            mouseYRef={mouseYRef}
            boundsRef={boundsRef}
          />
        ))}
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-[10] w-full min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20">
        {/* Badge */}
        <div ref={badgeRef} style={{ marginBottom: 40 }}>
          <div
            className="rounded-full px-5 py-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-medium">
              WEBBED LABS
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-[900px]" style={{ marginBottom: 60 }}>
          <h1
            className="text-[clamp(1.8rem,6vw,2.6rem)] sm:text-[clamp(2.2rem,6vw,3.6rem)] md:text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold tracking-tight leading-[1.08] mb-0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <WordReveal text="Where impossible" delay={0.3} />
            <br />
            <WordReveal text="ideas become real" delay={0.8} />
            <br />
            <WordReveal text="products." delay={1.3} />
          </h1>
        </div>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <a
            href="#latest-from-the-lab"
            className="type-button hero-cta-primary inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold text-black backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span>Explore Products</span>
          </a>
          <a
            href="https://www.instagram.com/webbed_labs/"
            target="_blank"
            rel="noopener noreferrer"
            className="type-button hero-cta-secondary inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/[0.12] hover:scale-105 active:scale-95"
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <span>WEBBED Labs</span>
          </a>
        </div>
      </div>
    </section>
  );
}