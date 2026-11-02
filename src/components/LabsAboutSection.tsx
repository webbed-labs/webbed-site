"use client";

import { ensureScrollTrigger, useInView } from "@/lib/motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const MANIFESTO = [
  {
    number: "01",
    title: "Research",
    description: "Exploring emerging technologies, opportunities, and future trends.",
  },
  {
    number: "02",
    title: "Experimentation",
    description: "Turning concepts into prototypes and testing bold ideas.",
  },
  {
    number: "03",
    title: "Product Development",
    description: "Building software products designed to solve real-world problems.",
  },
  {
    number: "04",
    title: "Scale",
    description: "Transforming promising ideas into sustainable ventures.",
  },
];

export default function LabsAboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inViewRef, isInView] = useInView<HTMLElement>({ once: true, amount: 0.15 });

  // Combine the section ref and inView observer ref into one
  const setRefs = (el: HTMLElement | null) => {
    sectionRef.current = el;
    (inViewRef as any).current = el;
  };

  return (
    <section
      ref={setRefs}
      className="relative w-full bg-black py-28 lg:py-40 overflow-hidden"
    >
      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <DriftBlob
          className="absolute top-[15%] left-[25%] w-[600px] h-[600px]"
          xKeyframes={[0, 40, -20, 0]}
          yKeyframes={[0, -30, 20, 0]}
          duration={20}
          background="radial-gradient(circle at center, rgba(99,102,241,0.07) 0%, transparent 65%)"
        />
        <DriftBlob
          className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px]"
          xKeyframes={[0, -30, 25, 0]}
          yKeyframes={[0, 20, -15, 0]}
          duration={25}
          background="radial-gradient(circle at center, rgba(244,63,94,0.05) 0%, transparent 65%)"
        />
        <div
          className="absolute top-0 left-0 w-full h-40"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)" }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

          {/* LEFT COLUMN */}
          <RevealInView
            isInView={isInView}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[38%] relative"
          >
            <div
              className="absolute -top-8 -left-4 pointer-events-none select-none"
              style={{
                fontSize: "clamp(80px, 10vw, 140px)",
                fontWeight: 900,
                lineHeight: 1,
                color: "rgba(255,255,255,0.025)",
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.04em",
              }}
            >
              LABS
            </div>

            <p
              className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-6 relative z-10"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              WHAT WE DO
            </p>

            <h2
              className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.08] tracking-tight mb-6 relative z-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Not built for clients.
              <br />
              Built for possibility.
            </h2>

            <p
              className="text-[15px] font-light leading-[1.8] mb-8 relative z-10 max-w-[380px]"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.45)" }}
            >
              An independent product studio inside WEBBED. We build what others
              won&apos;t — tools, platforms, and intelligence systems for the future.
            </p>

            <HoverArrowLink href="/products">
              Explore Our Products
            </HoverArrowLink>

            <div
              className="mt-10 h-px w-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </RevealInView>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[62%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {MANIFESTO.map((item, idx) => (
                <ManifestoCard
                  key={item.number}
                  item={item}
                  index={idx}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DriftBlob({
  className,
  xKeyframes,
  yKeyframes,
  duration,
  background,
}: {
  className: string;
  xKeyframes: number[];
  yKeyframes: number[];
  duration: number;
  background: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ensureScrollTrigger();
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    xKeyframes.forEach((v, i) => {
      tl.to(el, { x: v, duration: duration / xKeyframes.length }, i / xKeyframes.length);
    });
    // Run y as parallel keyframes
    yKeyframes.forEach((v, i) => {
      gsap.to(el, {
        y: v,
        duration: duration / yKeyframes.length,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
    return () => {
      tl.kill();
      gsap.killTweensOf(el);
    };
  }, [duration, xKeyframes, yKeyframes]);
  return (
    <div
      ref={ref}
      className={className + " rounded-full"}
      style={{ background, filter: "blur(80px)" }}
    />
  );
}

function RevealInView({
  isInView,
  initial,
  animate,
  transition,
  className,
  children,
}: {
  isInView: boolean;
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition: { duration?: number; delay?: number; ease?: number[] | string };
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  useEffect(() => {
    if (!isInView || playedRef.current) return;
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      initial,
      {
        ...animate,
        duration: transition.duration ?? 0.6,
        delay: transition.delay ?? 0,
        ease: Array.isArray(transition.ease) ? `cubic-bezier(${transition.ease.join(",")})` : transition.ease ?? "power1.out",
        overwrite: "auto",
      },
    );
    playedRef.current = true;
  }, [isInView, initial, animate, transition]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function HoverArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => gsap.to(el, { x: 4, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    const onLeave = () => gsap.to(el, { x: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return (
    <a
      ref={ref}
      href={href}
      className="group inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.12em] uppercase relative z-10"
      style={{
        fontFamily: "var(--font-heading)",
        color: "rgba(99,102,241,0.8)",
        transition: "color 0.3s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(99,102,241,1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(99,102,241,0.8)"; }}
    >
      {children}
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

function ManifestoCard({
  item,
  index,
  isInView,
}: {
  item: { number: string; title: string; description: string };
  index: number;
  isInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!isInView || playedRef.current) return;
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2 + index * 0.1,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        overwrite: "auto",
      },
    );
    playedRef.current = true;
  }, [isInView, index]);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { y: -3, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)";
    e.currentTarget.style.boxShadow = "0 8px 40px rgba(99,102,241,0.08), 0 0 80px rgba(99,102,241,0.04)";
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 32px",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <div
        className="absolute -top-2 -right-1 pointer-events-none select-none"
        style={{
          fontSize: "clamp(72px, 9vw, 110px)",
          fontWeight: 900,
          lineHeight: 1,
          color: "rgba(255,255,255,0.025)",
          fontFamily: "var(--font-heading)",
          letterSpacing: "-0.04em",
        }}
      >
        {item.number}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[10px] font-semibold tracking-[0.2em] font-mono"
            style={{ color: "rgba(99,102,241,0.6)" }}
          >
            {item.number}
          </span>
          <div
            className="h-px flex-1 max-w-[40px]"
            style={{ background: "rgba(99,102,241,0.2)" }}
          />
        </div>

        <h3
          className="text-[14px] font-bold tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "rgba(255,255,255,0.92)" }}
        >
          {item.title}
        </h3>

        <p
          className="text-[14px] font-light leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.4)" }}
        >
          {item.description}
        </p>
      </div>

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.06) 0%, transparent 60%)" }}
      />
    </div>
  );
}