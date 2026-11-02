"use client";

import React, { useRef, useEffect, useState } from "react";
import { ensureScrollTrigger } from "@/lib/motion";
import gsap from "gsap";

const BLOCKS = [
  {
    className: "text-[18px] leading-[1.85] font-light [font-family:var(--font-body)]",
    text: "Technology is evolving faster than at any point in history. AI, automation, cloud infrastructure, and intelligent software are creating new opportunities every single day. But most businesses are still operating on outdated systems, disconnected tools, and digital foundations that were never built to scale.",
    range: [0.15, 0.45] as [number, number],
    delay: 0,
    border: false,
  },
  {
    className: "text-[18px] leading-[1.85] font-light [font-family:var(--font-body)]",
    text: "The result is a growing gap between what technology can do and what most businesses are actually able to access, use, and benefit from.",
    range: [0.45, 0.65] as [number, number],
    delay: 0.1,
    border: false,
  },
  {
    className: "border-l-[3px] border-white/50 pl-4 py-2",
    text: "WEBBED was built to close that gap.",
    range: [0.65, 0.75] as [number, number],
    delay: 0.2,
    border: true,
  },
  {
    className: "text-[18px] leading-[1.85] font-light [font-family:var(--font-body)]",
    text: "By combining custom software development, AI integration, web application design, and digital strategy, WEBBED helps businesses move faster, operate smarter, and build the kind of digital infrastructure that creates lasting competitive advantage.",
    range: [0.75, 0.85] as [number, number],
    delay: 0.3,
    border: false,
  },
];

function renderWords(text: string) {
  const words = text.split(" ");
  return (
    <span style={{ color: "#ffffff" }}>
      {words.map((w, i) => (
        <span
          key={i}
          data-gap-word
          className="inline"
          style={{ opacity: 0 }}
        >
          {w}
          {i !== words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

export default function AboutGapSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = () => setIsMobile(window.innerWidth < 1024);
    mq();
    window.addEventListener("resize", mq);
    return () => window.removeEventListener("resize", mq);
  }, []);

  useEffect(() => {
    ensureScrollTrigger();
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    let rafId = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    // Sprung scroll-velocity values that drive the heading "catapult".
    const vel = { y: 0, skew: 0 };

    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      ctx = gsap.context(() => {
        // Word-by-word reveal tied to the section scroll progress, remapped the
        // same way the deployed site does: N = P[0.25,0.75] -> [0,1], then the
        // per-block windows [0.15,0.45] ... are applied on top of N.
        const blocks = rightColRef.current
          ? Array.from(rightColRef.current.querySelectorAll<HTMLElement>("[data-gap-block]"))
          : [];
        blocks.forEach((block) => {
          const words = Array.from(block.querySelectorAll<HTMLElement>("[data-gap-word]"));
          // Reveal the words once when the block scrolls into view. Plays only
          // on scroll-down; does NOT reverse on scroll-up (toggleActions
          // "play none none none"), matching the deployed site's behavior.
          gsap.to(words, {
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
            stagger: 0.02,
            scrollTrigger: {
              trigger: block,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        });
        ScrollTrigger.refresh();
      }, section);

      // Block fade/slide-in (in-view, once, amount .25) with per-block delay —
      // matches the deployed `g` component (duration .6, easeOut, delay).
      const observers: IntersectionObserver[] = [];
      blockRefs.current.forEach((b) => {
        if (!b) return;
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              b.classList.add("in-view");
              io.disconnect();
            }
          },
          { threshold: 0.25 }
        );
        io.observe(b);
        observers.push(io);
      });

      // Velocity "catapult" applied to the heading only (y + skewY), matching the
      // deployed site's useVelocity -> useSpring mapping (y: v/50 clamped ±60,
      // skew: v/375 clamped ±8).
      const tick = () => {
        const now = performance.now();
        const dy = window.scrollY - lastY;
        const dt = (now - lastT) / 1000;
        const v = dt > 0 ? dy / dt : 0;
        lastY = window.scrollY;
        lastT = now;

        const tY = Math.max(-60, Math.min(60, v / 50));
        const tSkew = Math.max(-8, Math.min(8, v / 375));

        vel.y += (tY - vel.y) * 0.18;
        vel.skew += (tSkew - vel.skew) * 0.18;

        if (headingRef.current) gsap.set(headingRef.current, { y: vel.y, skewY: vel.skew });
        rafId = requestAnimationFrame(tick);
      };
      if (!isMobile) rafId = requestAnimationFrame(tick);

      return () => observers.forEach((o) => o.disconnect());
    });

    return () => {
      ctx?.revert();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full text-white py-24 lg:py-32 flex items-center min-h-screen"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(2,0,24,1) 65%, rgba(6,16,60,1) 85%, rgba(12,32,100,0.6) 100%)",
      }}
    >
      <div className="relative w-full flex items-center overflow-hidden">
        <div
          style={{ maxWidth: 1400, marginLeft: "clamp(1rem, 5vw, 80px)", marginRight: 0 }}
          className="relative mx-auto w-full px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-16 items-start">
            {/* Left: sticky heading */}
            <div ref={leftColRef} className="lg:sticky lg:top-[18vh] self-start">
              <h2
                ref={headingRef}
                className="font-bold [font-family:var(--font-heading)]"
                style={{
                  fontSize: "clamp(2.25rem, 10vw, 72px)",
                  lineHeight: 1.05,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  transformOrigin: "left center",
                  transform: "none",
                }}
              >
                <span className="floating-text-line-1 block" style={{ color: "rgba(255,255,255,1)" }}>
                  Technology moves fast.
                </span>
                <span className="floating-text-line-2 block" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Most businesses don&apos;t.
                </span>
              </h2>
            </div>

            {/* Right: scrolling messaging */}
            <div ref={rightColRef} aria-label="Technology gap messaging" className="space-y-16">
              {BLOCKS.map((block, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    blockRefs.current[i] = el;
                  }}
                  data-gap-block
                  data-range={JSON.stringify(block.range)}
                  className={`gap-block ${block.className}`}
                  style={{ transitionDelay: `${block.delay}s` }}
                >
                  {block.border ? (
                    <p
                      style={{
                        fontSize: "22px",
                        margin: 0,
                        paddingLeft: "16px",
                        lineHeight: 1.45,
                        fontWeight: 500,
                        color: "#ffffff",
                      }}
                    >
                      {renderWords(block.text)}
                    </p>
                  ) : (
                    renderWords(block.text)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatLine1 {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes floatLine2 {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @media (min-width: 1024px) {
          .floating-text-line-1 {
            animation: 7s ease-in-out infinite floatLine1;
          }
          .floating-text-line-2 {
            animation: 9s ease-in-out 0.7s infinite floatLine2;
          }
        }
        .gap-block {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          will-change: transform, opacity;
        }
        .gap-block.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
