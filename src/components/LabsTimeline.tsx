"use client";

import { ensureScrollTrigger } from "@/lib/motion";
import { useEffect, useRef, useState } from "react";

const timelineItems = [
  { value: "05+", label: "Products in Development" },
  { value: "03", label: "Industries We're Entering" },
  { value: "01", label: "Studio. One Vision." },
  { value: "∞", label: "Problems Left To Solve" },
];

export default function LabsTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven line draw
  useEffect(() => {
    ensureScrollTrigger();
    const target = containerRef.current;
    const line = lineRef.current;
    if (!target || !line) return;
    const length = line.getTotalLength?.() ?? 1000;
    line.style.strokeDasharray = String(length);
    line.style.strokeDashoffset = String(length);
    let tween: {
      scrollTrigger?: { kill: () => void };
      kill: () => void;
    } | null = null;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!target || !line) return;
        gsap.registerPlugin(ScrollTrigger);
        tween = gsap.to(line, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: target,
            start: "top 85%",
            end: "bottom 35%",
            scrub: true,
          },
        });
      },
    );
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} data-labs-timeline className="relative w-full h-full flex flex-col justify-between">
      <div className="flex flex-col justify-between h-full relative pl-10 sm:pl-14 md:pl-16">
        <svg
          className="absolute left-[15px] sm:left-[19px] md:left-[23px] top-3"
          width="2"
          height="calc(100% - 28px)"
          aria-hidden="true"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />
          <line
            ref={lineRef}
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="url(#timelineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        {timelineItems.map((item, idx) => (
          <TimelineNode
            key={item.label}
            item={item}
            index={idx}
            isActive
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineNode({
  item,
  index,
  isActive,
  isInView,
}: {
  item: (typeof timelineItems)[number];
  index: number;
  isActive: boolean;
  isInView: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    import("gsap").then(({ default: gsap }) => {
      if (!nodeRef.current) return;
      if (isInView) {
        gsap.fromTo(
          nodeRef.current,
          { opacity: 0, x: -25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.1 + index * 0.12,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            overwrite: "auto",
          },
        );
      }
    });
  }, [isInView, index]);

  // Orb scale/glow on active state
  useEffect(() => {
    if (!orbRef.current) return;
    import("gsap").then(({ default: gsap }) => {
      if (!orbRef.current) return;
      gsap.killTweensOf(orbRef.current);
      if (isActive) {
        gsap.to(orbRef.current, {
          scale: 1,
          duration: 0.45,
          delay: 0.15 + index * 0.12,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(orbRef.current, {
          scale: 0.5,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  }, [isActive, index]);

  return (
    <div ref={nodeRef} className="relative py-1 first:pt-0 last:pb-0" style={{ opacity: 1 }}>
      <div
        ref={orbRef}
        className="absolute left-[-24px] sm:left-[-32px] md:left-[-34px] top-1.5 z-20"
        style={{
          transform: "translateX(-50%) scale(0.5)",
          boxShadow: isActive
            ? "0 0 20px rgba(129,140,248,0.4), 0 0 40px rgba(168,85,247,0.15)"
            : "0 0 0px rgba(129,140,248,0)",
          transition: "box-shadow 0.5s ease",
        }}
      >
        <div
          className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full relative"
          style={{
            background: isActive
              ? "linear-gradient(135deg, #818cf8, #a78bfa)"
              : "rgba(255,255,255,0.08)",
            border: isActive
              ? "2px solid rgba(129,140,248,0.4)"
              : "2px solid rgba(255,255,255,0.05)",
            transition: "background 0.5s ease, border-color 0.5s ease",
          }}
        />
      </div>

      <div className="grid grid-cols-[82px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-5 md:grid-cols-[110px_minmax(0,1fr)] md:gap-6">
        <div
          className="min-w-0 text-left"
          style={{
            opacity: isActive ? 1 : 0.5,
            transition: "opacity 0.6s ease",
          }}
        >
          <span
            className="block text-[36px] sm:text-[42px] md:text-[48px] font-extrabold leading-none tracking-tight tabular-nums"
            style={{
              fontFamily: "var(--font-heading)",
              background: isActive
                ? "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)"
                : "none",
              WebkitBackgroundClip: isActive ? "text" : "unset",
              WebkitTextFillColor: isActive ? "transparent" : "unset",
              color: isActive ? "transparent" : "rgba(255,255,255,0.35)",
              transition: "color 0.6s ease",
            }}
          >
            {item.value}
          </span>
        </div>
        <div
          className="min-w-0"
          style={{
            opacity: isActive ? 1 : 0.5,
            transition: "opacity 0.5s ease",
          }}
        >
          <span
            className="block text-[13px] leading-[1.25] md:text-[15px] font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.35)",
              transition: "color 0.5s ease",
            }}
          >
            {item.label}
          </span>
        </div>
      </div>
    </div>
  );
}
