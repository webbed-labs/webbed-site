"use client";

import { ensureScrollTrigger, useAnimate } from "@/lib/motion";
import gsap from "gsap";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "InSynk",
    category: "ERP & OPERATIONS",
    description:
      "Advanced neural networks designed to bridge the gap between human intuition and machine precision.",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    accent: "rgba(99,102,241,0.6)",
    glowColor: "rgba(99,102,241,0.25)",
    visual: "ai",
    image: "/insynk.webp",
  },
  {
    id: 2,
    name: "GRABBO",
    category: "RENTAL MARKETPLACE",
    description:
      "Edge-deployed machine learning models that learn from local data while maintaining global coordination.",
    gradient: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    accent: "rgba(249,115,22,0.6)",
    glowColor: "rgba(249,115,22,0.25)",
    visual: "atlas",
    image: "/Grabbo.webp",
  },
  {
    id: 3,
    name: "HIVE",
    category: "AGENT SYSTEMS",
    description:
      "Autonomous multi-agent framework that transforms complex tasks into orchestrated workflows.",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    accent: "rgba(6,182,212,0.6)",
    glowColor: "rgba(6,182,212,0.25)",
    visual: "nexus",
  },
  {
    id: 4,
    name: "AIDA",
    category: "DATA INTELLIGENCE",
    description:
      "Next-generation analytics platform that turns raw data into actionable intelligence in real-time.",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    accent: "rgba(168,85,247,0.6)",
    glowColor: "rgba(168,85,247,0.25)",
    visual: "lumina",
  },
  {
    id: 5,
    name: "WABI",
    category: "AI DETECTION",
    description:
      "Forensic-grade detector that identifies synthetic media across text, image, and audio modalities.",
    gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    accent: "rgba(16,185,129,0.6)",
    glowColor: "rgba(16,185,129,0.25)",
    visual: "prism",
  },
];

function getParticles(visual: string) {
  // Deterministic particles so SSR/CSR match.
  const seed = visual.charCodeAt(0) + visual.length;
  const rand = (i: number) => ((seed * 9301 + i * 49297) % 233280) / 233280;
  return Array.from({ length: 8 }).map((_, i) => ({
    x: rand(i) * 100,
    y: rand(i + 10) * 100,
    duration: 4 + rand(i + 20) * 4,
    delay: rand(i + 30) * 2,
    yRange: 12 + rand(i + 40) * 8,
  }));
}

function ProductVisual({ gradient, visual, image, name }: { gradient: string; visual: string; image?: string; name?: string }) {
  const [particles, setParticles] = useState<ReturnType<typeof getParticles>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParticles(getParticles(visual));
  }, [visual]);

  // Animate particles (float up/down + opacity)
  useEffect(() => {
    const root = containerRef.current;
    if (!root || particles.length === 0) return;
    const els = root.querySelectorAll<HTMLDivElement>("[data-particle]");
    const tweens: gsap.core.Tween[] = [];
    els.forEach((el, i) => {
      const p = particles[i];
      if (!p) return;
      const tween = gsap.to(el, {
        y: [0, -p.yRange, 0] as any,
        opacity: [0.2, 0.6, 0.2] as any,
        duration: p.duration,
        repeat: -1,
        ease: "sine.inOut",
        delay: p.delay,
      });
      tweens.push(tween);
    });
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [particles]);

  if (image) {
    return (
      <div className="relative w-full h-full overflow-hidden" style={{ background: gradient }}>
        <img
          src={image}
          alt={
            name
              ? `${name} — original product by WEBBED Labs (${name === "InSynk" ? "AI-powered ERP and operations platform" : name === "GRABBO" ? "rental marketplace platform" : "WEBBED Labs software product"})`
              : `${name ?? "WEBBED Labs product"} — original software product developed by WEBBED Labs`
          }
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: gradient }}
    >
      <div
        className="absolute inset-0 opacity-15 z-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.06] z-20 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-20 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center">
        {visual === "atlas" && <AtlasVisual />}
        {visual === "lumina" && <LuminaVisual />}
        {visual === "nexus" && <NexusVisual />}
        {visual === "prism" && <PrismVisual />}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            data-particle
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AtlasVisual() {
  const circleRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!circleRef.current) return;
    const tween = gsap.to(circleRef.current, {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 20,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, []);
  return (
    <svg className="w-[150px] sm:w-[220px] h-auto" viewBox="0 0 52 52" fill="none">
      <circle
        ref={circleRef}
        cx="26"
        cy="26"
        r="20"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        fill="none"
      />
      <ellipse cx="26" cy="26" rx="20" ry="8" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="6" y1="26" x2="46" y2="26" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="26" y1="6" x2="26" y2="46" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="26" cy="26" r="4" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

function LuminaVisual() {
  const gRef = useRef<SVGGElement>(null);
  const innerRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!gRef.current) return;
    const tween = gsap.to(gRef.current, {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 15,
      repeat: -1,
      ease: "none",
    });
    const pulse = innerRef.current
      ? gsap.to(innerRef.current, {
          attr: { r: 10 },
          opacity: 0.25,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      : null;
    return () => {
      tween.kill();
      pulse?.kill();
    };
  }, []);
  return (
    <svg className="w-[150px] sm:w-[220px] h-auto" viewBox="0 0 56 56" fill="none">
      <g ref={gRef}>
        <path
          d="M28 6 L30 24 L28 22 L26 24 Z"
          fill="white"
          fillOpacity="0.9"
        />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle} transform={`rotate(${angle}, 28, 28)`}>
            <line
              x1="28"
              y1="10"
              x2="28"
              y2="18"
              stroke="white"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>
      <circle
        ref={innerRef}
        cx="28"
        cy="28"
        r="8"
        fill="white"
        fillOpacity="0.15"
      />
      <circle cx="28" cy="28" r="3" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function NexusVisual() {
  const gRef = useRef<SVGGElement>(null);
  const dotsRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!gRef.current) return;
    const tween = gsap.to(gRef.current, {
      rotation: -360,
      transformOrigin: "50% 50%",
      duration: 25,
      repeat: -1,
      ease: "none",
    });
    const dotTweens = dotsRef.current
      .filter(Boolean)
      .map((el, i) =>
        gsap.to(el as Element, {
          scale: 1.4,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        }),
      );
    return () => {
      tween.kill();
      dotTweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <svg className="w-[150px] sm:w-[220px] h-auto" viewBox="0 0 54 54" fill="none">
      <g ref={gRef}>
        <circle cx="27" cy="27" r="22" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="27" cy="27" r="14" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="27" cy="27" r="6" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
      </g>
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 27 + 22 * Math.cos(rad);
        const y = 27 + 22 * Math.sin(rad);
        return (
          <circle
            key={angle}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            cx={x}
            cy={y}
            r="2.5"
            fill="white"
            fillOpacity="0.8"
          />
        );
      })}
    </svg>
  );
}

function PrismVisual() {
  const gRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (!gRef.current) return;
    const tween = gsap.to(gRef.current, {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 18,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, []);
  return (
    <svg className="w-[150px] sm:w-[220px] h-auto" viewBox="0 0 52 52" fill="none">
      <g ref={gRef}>
        <polygon points="26,4 48,26 26,48 4,26" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" fill="none" />
        <polygon points="26,12 40,26 26,40 12,26" stroke="white" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        <polygon points="26,18 34,26 26,34 18,26" stroke="white" strokeOpacity="0.5" strokeWidth="1" fill="none" />
        <line x1="26" y1="4" x2="26" y2="48" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="4" y1="26" x2="48" y2="26" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
      </g>
      <circle cx="26" cy="26" r="3" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

/* ──────────────────── 3D Tilt Card (GSAP quickTo) ──────────────────── */

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(-y * 10);
      yTo(x * 10);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/* ──────────────────── Main Component ──────────────────── */

export default function LabsProductsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, []);

  const getCardOffset = (idx: number) => {
    let diff = idx - activeIndex;
    if (diff < -Math.floor(products.length / 2)) diff += products.length;
    if (diff > Math.floor(products.length / 2)) diff -= products.length;
    return diff;
  };

  const activeProduct = products[activeIndex];

  const ambientRef = useRef<HTMLDivElement>(null);

  // Crossfade the ambient glow when active index changes
  useEffect(() => {
    if (!ambientRef.current) return;
    gsap.fromTo(
      ambientRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" },
    );
  }, [activeIndex]);

  const eyebrowRef = useAnimate<HTMLParagraphElement>({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  });
  const headingRef = useAnimate<HTMLHeadingElement>({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="latest-from-the-lab" className="relative w-full bg-black pt-32 pb-28 lg:pt-40 lg:pb-36 overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[1200px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(99,102,241,0.03) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
        <div
          ref={ambientRef}
          className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${activeProduct.glowColor} 0%, transparent 70%)`,
            filter: "blur(100px)",
            opacity: 0,
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-16 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-48 pt-6">
            <p
              ref={eyebrowRef}
              className="text-[10px] tracking-[0.3em] uppercase font-bold mb-4"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-heading)",
              }}
            >
              LATEST FROM THE LAB
            </p>
            <h2
              ref={headingRef}
              className="text-4xl md:text-[56px] font-bold text-white leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.03em",
              }}
            >
              What we&apos;re
              <br />
              building.
            </h2>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[580px] mb-8 px-2">
              <div
                key={activeIndex}
                style={{ animation: "labsSliderFade 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
                className="w-full"
              >
                <h3
                  className="text-2xl sm:text-[28px] font-bold text-white text-center mb-3 leading-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {activeProduct.name}
                </h3>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      aria-label="Previous product"
                      onClick={prev}
                      className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/70 transition-all duration-200 hover:border-white/35 hover:bg-white/[0.08] hover:text-white active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5">
                      {products.map((p, i) => (
                        <button
                          key={p.id}
                          type="button"
                          aria-label={`Go to ${p.name}`}
                          onClick={() => setActiveIndex(i)}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === activeIndex ? 28 : 12,
                            height: i === activeIndex ? 12 : 12,
                            background: i === activeIndex ? p.accent : "rgba(255,255,255,0.2)",
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-label="Next product"
                      onClick={next}
                      className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/70 transition-all duration-200 hover:border-white/35 hover:bg-white/[0.08] hover:text-white active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
              </div>
            </div>

            {/* Coverflow carousel */}
            <div
              className="relative w-full"
              style={{ height: isMobile ? 280 : 440, perspective: "1200px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {products.map((product, idx) => {
                  const offset = getCardOffset(idx);
                  const isActive = idx === activeIndex;
                  const xOffset = offset * (isMobile ? 140 : 280);
                  const scale = isActive ? 1 : 0.85;
                  const rotateY = isActive ? 0 : offset * -8;
                  const opacity = isActive ? 1 : Math.abs(offset) > 1 ? 0 : 0.5;
                  const zIndex = isActive ? 30 : 20 - Math.abs(offset);
                  const blur = !isActive && Math.abs(offset) === 1 ? "blur(2px)" : "none";

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isActive && setActiveIndex(idx)}
                      className="absolute cursor-pointer"
                      style={{
                        width: isMobile ? "min(90vw, 360px)" : "min(50vw, 640px)",
                        height: isMobile ? 220 : 380,
                        transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`,
                        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                        opacity,
                        zIndex,
                        filter: blur,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <TiltCard className="w-full h-full">
                        <div
                          className="relative w-full h-full rounded-3xl overflow-hidden border bg-white/[0.03] backdrop-blur-xl"
                          style={{
                            borderColor: isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                            boxShadow: isActive
                              ? `0 30px 90px rgba(0,0,0,0.6), 0 0 80px ${product.glowColor}`
                              : "0 10px 40px rgba(0,0,0,0.4)",
                          }}
                        >
                          <div className="absolute inset-0">
                            <ProductVisual gradient={product.gradient} visual={product.visual} image={product.image} name={product.name} />
                          </div>
                        </div>
                      </TiltCard>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex justify-center mt-10">
              <a
                href="/products"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-bold text-white/85 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white uppercase tracking-[0.15em]"
                style={{ transition: "transform 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                EXPLORE
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes labsSliderFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}