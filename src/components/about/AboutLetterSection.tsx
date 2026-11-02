"use client";

import { ensureScrollTrigger } from "@/lib/motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const paragraphs = [
  {
    text: "If you're building a business, launching a product, exploring a new idea, or chasing something ambitious, you're exactly why WEBBED exists.",
    className: "text-[1.12rem] sm:text-[1.2rem] text-neutral-300 font-light leading-[1.8]",
  },
  {
    text: "We believe progress belongs to the builders. The people willing to take risks, challenge assumptions, and create something that did not exist before.",
    className: "text-[1.12rem] sm:text-[1.2rem] text-neutral-300 font-light leading-[1.8]",
  },
  {
    text: "Technology should not be a barrier to those ideas.",
    className: "text-[1.15rem] sm:text-[1.25rem] text-white font-normal leading-relaxed",
  },
  {
    text: "It should be the thing that helps bring them to life.",
    className: "text-[1.15rem] sm:text-[1.25rem] text-white font-normal leading-relaxed",
  },
];

export default function AboutLetterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);

  // Scroll-linked aurora drift (replaces Framer's useScroll + useTransform).
  useEffect(() => {
    ensureScrollTrigger();
    const target = sectionRef.current;
    const aurora = auroraRef.current;
    if (!target || !aurora) return;
    const trigger = gsap.to(aurora, {
      yPercent: 20,
      xPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: target,
        start: "start end",
        end: "end start",
        scrub: true,
      },
    });
    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, []);

  // 3D tilt on the card (replaces Framer's useSpring + useTransform).
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(-y * 12);
      yTo(x * 12);
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

  // Staggered reveal for the body paragraphs (replaces variants stagger).
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ensureScrollTrigger();
    const root = bodyRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-letter-p]"));
    const trigger = gsap.fromTo(
      items,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 1.25,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        stagger: 0.24,
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
      },
    );
    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[95vh] flex items-center justify-center bg-black text-white py-36 sm:py-48 overflow-hidden"
    >
      {/* Aurora background blobs (scroll-driven) */}
      <div
        ref={auroraRef}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div
          className="absolute top-[12%] left-[18%] w-[58vw] h-[58vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "aurora-drift-1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[28%] right-[12%] w-[48vw] h-[48vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
            filter: "blur(85px)",
            animation: "aurora-drift-2 24s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[18%] left-[32%] w-[38vw] h-[38vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.055) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "aurora-drift-3 17s ease-in-out infinite",
          }}
        />
      </div>

      {/* Vignette edges */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-[2]" />

      {/* Glass card with 3D tilt */}
      <div
        ref={cardRef}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-20 rounded-[2.5rem] border border-white/[0.07] bg-white/[0.015] backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.025]"
      >
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)]" />

        <div
          style={{ transform: "translateZ(30px)" }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-9 font-medium">
            A Letter To Builders
          </p>

          <h2
            className="font-bold tracking-[-0.03em] leading-[1.1] mb-12 text-white"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.25rem)" }}
          >
            For the people creating<br />what&apos;s next.
          </h2>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-12" />
        </div>

        {/* Staggered letter body */}
        <div
          ref={bodyRef}
          className="space-y-7"
          style={{ transform: "translateZ(15px)" }}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              data-letter-p
              className={`${p.className} max-w-2xl mx-auto text-center`}
            >
              {p.text}
            </p>
          ))}

          <div
            data-letter-p
            className="pt-10 mt-2 border-t border-white/[0.08]"
            style={{ transform: "translateZ(20px)" }}
          >
            <p className="text-[1.2rem] sm:text-[1.4rem] text-white font-medium tracking-[-0.01em] leading-snug max-w-lg mx-auto text-center">
              Whether you&apos;re taking your first step or your hundredth, we&apos;re here to help build what comes next.
            </p>

            <p className="text-[0.72rem] text-neutral-300 mt-8 tracking-[0.18em] font-medium uppercase text-center">
              — The WEBBED Team
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes aurora-drift-1 {
          0%,100% { transform: translate(0%,0%) scale(1);    opacity: 0.50; }
          33%      { transform: translate(4%,-5%) scale(1.06); opacity: 0.65; }
          66%      { transform: translate(-3%,4%) scale(0.97); opacity: 0.50; }
        }
        @keyframes aurora-drift-2 {
          0%,100% { transform: translate(0%,0%) scale(1);    opacity: 0.40; }
          33%      { transform: translate(-5%,4%) scale(1.09); opacity: 0.58; }
          66%      { transform: translate(4%,-3%) scale(0.95); opacity: 0.40; }
        }
        @keyframes aurora-drift-3 {
          0%,100% { transform: translate(0%,0%) scale(1.02); opacity: 0.34; }
          50%      { transform: translate(3%,-6%) scale(0.94); opacity: 0.50; }
        }
      `}</style>
    </section>
  );
}