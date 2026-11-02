"use client";

import { ensureScrollTrigger, useReveal } from "@/lib/motion";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const features = [
  { text: "Strategy + Execution", x: -246, y: -206, mobileX: -98, mobileY: -240 },
  { text: "Precision in Every Detail", x: -338, y: -10, mobileX: -98, mobileY: -140 },
  { text: "Built From Scratch", x: -170, y: 228, mobileX: -98, mobileY: 225 },
  { text: "Designed to Evolve", x: 246, y: -206, mobileX: 98, mobileY: -240 },
  { text: "Built to Scale", x: 338, y: -6, mobileX: 98, mobileY: -140 },
  { text: "Fast Without Compromise", x: 170, y: 228, mobileX: 98, mobileY: 225 },
];

const transitionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

type FeatureLabelProps = {
  text: string;
  index: number;
  baseX: number;
  baseY: number;
  mobileX: number;
  mobileY: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
};

function FeatureLabel({
  text,
  index,
  baseX,
  baseY,
  mobileX,
  mobileY,
  hoveredIndex,
  setHoveredIndex,
}: FeatureLabelProps) {
  const isActive = hoveredIndex === index;
  const labelText = (mobile = false) => (
    <span
      style={{
        display: "inline-block",
        fontSize: mobile
          ? "clamp(0.62rem, 2.55vw, 0.74rem)"
          : "clamp(0.875rem, 0.65rem + 0.6vw, 1.1rem)",
        lineHeight: mobile ? 1.25 : 1.2,
        letterSpacing: "0.025em",
        color: isActive ? "#ffffff" : "rgba(255,255,255,0.88)",
        fontWeight: 600,
        transform: isActive ? "scale(1.22)" : "scale(1)",
        textShadow: isActive
          ? "0 0 24px rgba(167,139,250,0.82)"
          : "0 2px 12px rgba(0,0,0,0.72)",
        transition:
          "transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1), color 220ms ease, text-shadow 220ms ease",
      }}
    >
      {text}
    </span>
  );

  return (
    <>
      <button
        type="button"
        data-feature-label={index}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onFocus={() => setHoveredIndex(index)}
        onBlur={() => setHoveredIndex(null)}
        style={{
          position: "absolute",
          left: `calc(50% + ${baseX}px)`,
          top: `calc(50% + ${baseY}px)`,
          transform: "translate(-50%, -50%)",
          zIndex: isActive ? 30 : 10,
        }}
        className="pointer-events-auto hidden whitespace-nowrap rounded-full px-3 py-2 outline-none md:block"
      >
        {labelText()}
      </button>

      <button
        type="button"
        data-feature-label={index}
        onPointerEnter={() => setHoveredIndex(index)}
        onPointerDown={() => setHoveredIndex(index)}
        onFocus={() => setHoveredIndex(index)}
        style={{
          position: "absolute",
          left: `calc(50% + ${mobileX}px)`,
          top: `calc(50% + ${mobileY}px)`,
          transform: "translate(-50%, -50%)",
          zIndex: isActive ? 30 : 10,
        }}
        className="pointer-events-auto w-[110px] whitespace-normal rounded-full px-1 py-2 text-center outline-none sm:w-[132px] md:hidden"
      >
        {labelText(true)}
      </button>
    </>
  );
}

export default function WhyUsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const sphereWrapRef = useRef<HTMLDivElement>(null);
  const sphereRingRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const headingRef = useReveal<HTMLHeadingElement>({
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.8 },
    transition: { duration: 1.15, ease: transitionEase as unknown as number[] },
  });
  const paragraphRef = useReveal<HTMLParagraphElement>({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.8 },
    transition: { duration: 1.05, delay: 0.2, ease: transitionEase as unknown as number[] },
  });
  const sceneContainerRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, scale: 0.88, y: 36 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: { once: false, amount: 0.4 },
    transition: { duration: 1.25, delay: 0.18, ease: transitionEase as unknown as number[] },
  });

  // Mouse-driven 3D scene transform (replaces Framer's pointerX/Y + springs + transforms).
  useEffect(() => {
    ensureScrollTrigger();
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const sphereRing = sphereRingRef.current;
    const glow = glowRef.current;
    if (!section || !scene || !glow) return;

    const canUsePointerMotion = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Slow continuous rotation of the conic ring
    let ringTween: gsap.core.Tween | null = null;
    if (sphereRing && canUsePointerMotion) {
      ringTween = gsap.to(sphereRing, {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 48,
        repeat: -1,
        ease: "none",
      });
    }
    // Desktop pointer parallax with a light lerp. Touch devices keep a stable
    // scene and avoid a permanent requestAnimationFrame loop.
    let raf = 0;
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    const apply = () => {
      cx += (px - cx) * 0.1;
      cy += (py - cy) * 0.1;
      scene.style.transform = `translate3d(${cx * 18}px, ${cy * 14}px, 0) rotateX(${-cy * 8}deg) rotateY(${cx * 11}deg)`;
      glow.style.transform = `translate3d(calc(-50% + ${cx * 18}px), calc(-50% + ${cy * 14}px), 0)`;
      raf = requestAnimationFrame(apply);
    };
    if (canUsePointerMotion) raf = requestAnimationFrame(apply);

    const onMove = (e: PointerEvent) => {
      let nearestIndex: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      section.querySelectorAll<HTMLElement>("[data-feature-label]").forEach((label) => {
        const labelRect = label.getBoundingClientRect();
        if (labelRect.width === 0 || labelRect.height === 0) return;
        const distance = Math.hypot(
          e.clientX - (labelRect.left + labelRect.width / 2),
          e.clientY - (labelRect.top + labelRect.height / 2),
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = Number(label.dataset.featureLabel);
        }
      });
      setHoveredIndex(nearestDistance <= 170 ? nearestIndex : null);

      const rect = section.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width - 0.5;
      py = (e.clientY - rect.top) / rect.height - 0.5;
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      setHoveredIndex(null);
    };
    if (canUsePointerMotion) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ringTween?.kill();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative isolate overflow-hidden bg-black"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_50%,rgba(70,110,255,0.16),rgba(0,0,0,0)_34%),radial-gradient(circle_at_50%_44%,rgba(154,92,255,0.18),rgba(0,0,0,0)_42%),linear-gradient(180deg,#020203_0%,#030306_42%,#020204_100%)]" />
        <div className="absolute -top-48 left-1/2 h-[920px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(114,143,255,0.22),rgba(0,0,0,0)_60%)] blur-3xl opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.06),rgba(255,255,255,0)_55%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-6 sm:py-28 lg:py-32">
        <div className="grid items-start gap-7 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <h2
            ref={headingRef}
            className="max-w-[14ch] text-[clamp(2.4rem,1.7rem+3.8vw,5.5rem)] leading-[0.94] tracking-[-0.02em] font-semibold text-white [font-family:var(--font-heading)]"
          >
            Why Businesses Choose WEBBED
          </h2>

          <p
            ref={paragraphRef}
            className="justify-self-start lg:justify-self-end max-w-[46ch] text-sm sm:text-base lg:text-lg leading-relaxed text-white/72 [font-family:var(--font-body)]"
          >
            Technology should solve problems, not create them. We build software, AI systems, websites, and digital experiences designed to help businesses move faster, scale smarter, and stay ahead in a rapidly changing world.
          </p>
        </div>

        <div
          ref={sceneContainerRef}
          className="relative mt-16 h-[680px] sm:mt-14 sm:h-[700px] md:h-[680px] lg:h-[760px]"
          style={{ perspective: 1200 }}
        >
          <div
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[230px] w-[230px] sm:h-[300px] sm:w-[300px] md:h-[430px] md:w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(119,153,255,0.38),rgba(160,100,255,0.24)_36%,rgba(0,0,0,0)_72%)] blur-3xl"
            style={{ willChange: "transform" }}
          />

          <div
            ref={sceneRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            <div
              ref={sphereWrapRef}
              className="absolute left-1/2 top-1/2 h-[200px] w-[200px] sm:h-[270px] sm:w-[270px] md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[400px] -translate-x-1/2 -translate-y-1/2"
            >
              <div
                ref={sphereRingRef}
                className="absolute inset-0 rounded-full border border-white/18 bg-[conic-gradient(from_140deg_at_52%_50%,rgba(84,119,255,0.65),rgba(162,105,255,0.62),rgba(120,229,255,0.56),rgba(255,255,255,0.45),rgba(84,119,255,0.65))] shadow-[0_38px_120px_rgba(31,46,116,0.62)]"
              >
                <div className="absolute inset-[2%] rounded-full border border-white/26 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.86),rgba(220,230,255,0.24)_26%,rgba(124,152,255,0.24)_44%,rgba(184,122,255,0.34)_58%,rgba(17,23,53,0.58)_88%)] shadow-[inset_0_6px_14px_rgba(255,255,255,0.45),inset_0_-36px_58px_rgba(12,17,38,0.62)]" />
                <div className="absolute inset-[15%] rounded-full border border-white/18 bg-[radial-gradient(circle_at_35%_24%,rgba(255,255,255,0.6),rgba(255,255,255,0)_42%,rgba(147,175,255,0.28)_70%,rgba(7,11,29,0.42)_100%)]" />
                <div className="absolute left-[18%] top-[16%] h-[18%] w-[36%] -rotate-[16deg] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0)_72%)] blur-[1.4px]" />
                <div className="absolute right-[16%] bottom-[20%] h-[10%] w-[22%] rotate-[10deg] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.84),rgba(255,255,255,0)_72%)] blur-[2px]" />
              </div>
            </div>

            {features.map((feature, index) => (
              <FeatureLabel
                key={feature.text}
                text={feature.text}
                index={index}
                baseX={feature.x}
                baseY={feature.y}
                mobileX={feature.mobileX}
                mobileY={feature.mobileY}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
