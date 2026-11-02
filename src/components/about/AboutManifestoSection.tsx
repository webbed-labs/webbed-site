"use client";

import React, { useRef, useState, useEffect } from "react";
import { ensureScrollTrigger } from "@/lib/motion";
import gsap from "gsap";

export default function AboutManifestoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP-based pinned scroll-driven column reveals (replaces the manual
  // scroll-lock + motion-value pattern from Framer Motion).
  useEffect(() => {
    ensureScrollTrigger();
    const section = sectionRef.current;
    const grid = gridRef.current;
    const left = leftColRef.current;
    const right = rightColRef.current;
    if (!section || !grid || !left || !right) return;

    let ctx: gsap.Context | null = null;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (isMobile) {
        // Mobile: simple fade-in on entry. Play once; do not reverse on scroll-up.
        ctx = gsap.context(() => {
          gsap.fromTo(
            [left, right],
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }, section);
        return;
      }
      // Desktop: reveal the columns once when scrolling down into the section.
      // Play on enter; do NOT reverse on scroll-up (columns just stay in place),
      // matching the deployed site's behavior.
      ctx = gsap.context(() => {
        gsap.set(left, { y: 500 });
        gsap.set(right, { y: -500 });
        gsap.to([left, right], {
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
        ScrollTrigger.refresh();
      }, section);
    });

    return () => {
      ctx?.revert();
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{
        height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "100vh" : undefined,
        paddingBlock: isMobile ? "100px 80px" : undefined,
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-44 left-1/4 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(255,255,255,0)_62%)] blur-3xl" />
        <div className="absolute -bottom-56 right-1/3 h-[760px] w-[760px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),rgba(255,255,255,0)_60%)] blur-3xl" />
      </div>

      <div
        ref={gridRef}
        className="manifesto-grid relative z-10 mx-auto w-full flex items-center overflow-hidden"
        style={{
          paddingInline: "5vw",
          height: "100%",
          maxWidth: 1400,
        }}
      >
        {/* Left column: heading centered */}
        <div
          ref={leftColRef}
          className="manifesto-left flex-1 flex items-center justify-center h-full"
          style={{ paddingRight: 80, willChange: "transform" }}
        >
          <h2
            style={{
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              textAlign: "center",
            }}
          >
            <span style={{ display: "block", color: "#ffffff" }}>The future is</span>
            <span style={{ display: "block", color: "rgba(255,255,255,0.8)" }}>built,</span>
            <span style={{ display: "block", color: "rgba(255,255,255,0.5)" }}>not predicted.</span>
          </h2>
        </div>

        <div
          ref={rightColRef}
          className="manifesto-right flex-1 flex flex-col justify-start space-y-12 h-full py-20"
          style={{ maxWidth: 680, paddingLeft: 40, willChange: "transform" }}
        >
          <p
            style={{
              textAlign: "left",
              fontSize: 18,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.85,
            }}
          >
            At WEBBED, we do not build technology for today and hope it survives tomorrow. Every software system, AI
            solution, web application, and digital product we create is engineered with longevity, scalability, and
            adaptability as core requirements. Not afterthoughts.
          </p>

          <div className="space-y-6">
            <div
              style={{
                borderLeft: "2px solid rgba(255,255,255,0.4)",
                paddingLeft: 20,
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              technology will change.
            </div>

            <div
              style={{
                borderLeft: "2px solid rgba(255,255,255,0.4)",
                paddingLeft: 20,
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Markets will change.
            </div>

            <div
              style={{
                borderLeft: "2px solid rgba(255,255,255,0.4)",
                paddingLeft: 20,
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Expectations will change.
            </div>

            <div
              style={{
                borderLeft: "2px solid rgba(255,255,255,0.4)",
                paddingLeft: 20,
                fontSize: 18,
                color: "#ffffff",
              }}
            >
              The systems that survive are the systems built to evolve.
            </div>
          </div>

          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            That is what we build at WEBBED.
          </p>
        </div>
      </div>
    </section>
  );
}