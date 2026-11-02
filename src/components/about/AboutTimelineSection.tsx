"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const slides = [
  {
    id: "vision",
    eyebrow: "VISION",
    subtitle: "WE MAKE TECHNOLOGY THAT THE WORLD ISN'T PREPARED FOR, YET",
    description: "",
    imageSrc: "/about/vision.jpg",
    imageAlt: "WEBBED vision - designing the next default in software, AI, and digital experiences",
  },
  {
    id: "mission",
    eyebrow: "MISSION",
    subtitle: "BUILT FROM SCRATCH",
    description: "Every project at WEBBED is built from scratch with intention, performance, and scalability in mind. No recycled templates. No shortcuts. Just thoughtful technology built to solve real problems and create lasting value.",
    imageSrc: "/about/passion.jpg",
    imageAlt: "WEBBED mission - building custom software from scratch with intention, performance, and scalability",
  },
  {
    id: "passion",
    eyebrow: "PASSION",
    subtitle: "OBSESSED WITH CRAFT",
    description: "We are not clock-watchers. We are builders who genuinely care. Every pixel, every API call, every line of code is written with purpose because we believe great software is one of the highest forms of craft.",
    imageSrc: "/about/vision.jpg",
    imageAlt: "WEBBED passion - obsessive attention to craft in every line of code, pixel, and product decision",
  },
  {
    id: "impact",
    eyebrow: "IMPACT",
    subtitle: "EFFORTLESS RESULTS",
    description: "The best technology should feel effortless. Our goal is simple: help everyone grow faster, work smarter, and build a stronger digital presence through software that delivers real, measurable results.",
    imageSrc: "/about/impact.jpg",
    imageAlt: "WEBBED impact - measurable results, effortless technology, and lasting digital growth for clients",
  },
];

export default function AboutTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const meteorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const isLockedRef = useRef(false);
  const lastTransitionTimeRef = useRef(0);

  // Establish the timeline's hidden starting position.
  useEffect(() => {
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(meteorRef.current, { x: -220 });
  }, []);

  // Animate timeline progress; slide visibility is state-driven so a scene can
  // never be left hidden after a fast wheel or touch gesture.
  useEffect(() => {
    const line = lineRef.current;
    const meteor = meteorRef.current;

    // Update horizontal line & meteor progress
    const progress = activeIndex / (slides.length - 1);
    if (line) {
      gsap.to(line, {
        scaleX: progress,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (meteor) {
      gsap.to(meteor, {
        x: window.innerWidth * progress - 220,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Handle ScrollTrigger pin and scroll gesture interception
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        id: "about-timeline-st",
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Do not override index while locked during transition
          if (isLockedRef.current) return;
          const idx = Math.min(3, Math.max(0, Math.floor(self.progress * 4)));
          if (idx !== prevIndexRef.current) {
            setActiveIndex(idx);
          }
        },
      });

      const handleWheel = (e: WheelEvent) => {
        if (!st.isActive) return;

        const now = Date.now();
        // Ignore wheel events if within 1100ms of previous transition to absorb trackpad momentum
        if (isLockedRef.current || now - lastTransitionTimeRef.current < 1100) {
          e.preventDefault();
          return;
        }

        const currentIdx = prevIndexRef.current;

        // Downward scroll (require minimum threshold of 25px deltaY)
        if (e.deltaY > 25 && currentIdx < 3) {
          e.preventDefault();
          isLockedRef.current = true;
          lastTransitionTimeRef.current = now;
          const nextIdx = currentIdx + 1;
          setActiveIndex(nextIdx);
          const targetScroll = st.start + (nextIdx / 4) * (st.end - st.start);
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          setTimeout(() => {
            isLockedRef.current = false;
          }, 1100);
        }
        // Upward scroll
        else if (e.deltaY < -25 && currentIdx > 0) {
          e.preventDefault();
          isLockedRef.current = true;
          lastTransitionTimeRef.current = now;
          const prevIdx = currentIdx - 1;
          setActiveIndex(prevIdx);
          const targetScroll = st.start + (prevIdx / 4) * (st.end - st.start);
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          setTimeout(() => {
            isLockedRef.current = false;
          }, 1100);
        }
      };

      let touchStartY = 0;
      const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!st.isActive) return;
        const now = Date.now();
        if (isLockedRef.current || now - lastTransitionTimeRef.current < 1100) {
          e.preventDefault();
          return;
        }

        const currentIdx = prevIndexRef.current;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;

        if (deltaY > 45 && currentIdx < 3) {
          e.preventDefault();
          isLockedRef.current = true;
          lastTransitionTimeRef.current = now;
          touchStartY = touchY;
          const nextIdx = currentIdx + 1;
          setActiveIndex(nextIdx);
          const targetScroll = st.start + (nextIdx / 4) * (st.end - st.start);
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          setTimeout(() => {
            isLockedRef.current = false;
          }, 1100);
        } else if (deltaY < -45 && currentIdx > 0) {
          e.preventDefault();
          isLockedRef.current = true;
          lastTransitionTimeRef.current = now;
          touchStartY = touchY;
          const prevIdx = currentIdx - 1;
          setActiveIndex(prevIdx);
          const targetScroll = st.start + (prevIdx / 4) * (st.end - st.start);
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          setTimeout(() => {
            isLockedRef.current = false;
          }, 1100);
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        st.kill();
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      data-about-timeline
      aria-label="WEBBED story canvas"
      className="relative h-screen min-h-[100svh] bg-[#050508] text-white overflow-hidden select-none"
    >
      <AmbientGlow />

      <div className="relative h-full w-full overflow-hidden">
        {/* The timeline begins with Mission; Vision remains a clean opening frame. */}
        <StoryLine
          lineRef={lineRef}
          meteorRef={meteorRef}
          isVisible={activeIndex > 0}
        />

        {/* Slide articles */}
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            data-about-timeline-slide={slide.id}
            aria-label={slide.eyebrow}
            aria-hidden={index !== activeIndex}
            style={{
              opacity: index === activeIndex ? 1 : 0,
              visibility: index === activeIndex ? "visible" : "hidden",
              transform:
                index === activeIndex
                  ? "translateX(0)"
                  : index < activeIndex
                    ? "translateX(-12%)"
                    : "translateX(12%)",
              pointerEvents: index === activeIndex ? "auto" : "none",
              transition:
                "opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear " +
                (index === activeIndex ? "0ms" : "560ms"),
            }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <SlideComposition slide={slide} />
          </article>
        ))}

        <p className="sr-only">
          Scroll down to view WEBBED&apos;s vision, mission, passion, and impact.
        </p>
      </div>
    </section>
  );
}

function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute right-[8%] top-[15%] w-[36vw] h-[36vw] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(90,100,240,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-[5%] bottom-[10%] w-[30vw] h-[30vw] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,62,140,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function SlideComposition({ slide }: { slide: (typeof slides)[number] }) {
  const isVision = slide.id === "vision";

  return (
    <div className="relative h-full w-full max-w-[1350px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16 z-10 pt-14 md:pt-0 pb-6 md:pb-0">
      {/* Left Artwork Box (z-20 with solid dark background so line passes BEHIND the image) */}
      <div className="w-[180px] sm:w-[260px] md:w-[340px] lg:w-[420px] aspect-square rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)] bg-[#050508] flex-shrink-0 z-20">
        <img
          src={slide.imageSrc}
          alt={slide.imageAlt}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Right Content Column (equal flex halves centered around 50% viewport height where timeline passes) */}
      <div className="flex-1 z-10 max-w-[650px] text-center md:text-left flex flex-col h-full justify-center">
        {isVision ? (
          <div className="h-full flex flex-col justify-center gap-3 sm:gap-4 md:gap-6">
            <h2 className="font-extrabold text-[clamp(1.75rem,4.2vw,4.5rem)] leading-[1.1] tracking-[-0.03em] text-white select-none">
              We make{" "}
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
                technology
              </span>
            </h2>
            <h2 className="font-extrabold text-[clamp(1.75rem,4.2vw,4.5rem)] leading-[1.1] tracking-[-0.03em] text-white select-none">
              that the World Isn&apos;t Prepared for,{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                YET
              </span>
            </h2>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            {/* Title positioned above the center timeline line */}
            <div className="flex-1 flex flex-col justify-end pb-5 md:pb-7">
              <h2 className="font-extrabold text-[clamp(2.5rem,6vw,7rem)] leading-none text-white tracking-[-0.03em] uppercase select-none">
                {slide.eyebrow}
              </h2>
            </div>

            {/* Subtitle & Description positioned below the center timeline line */}
            <div className="flex-1 flex flex-col justify-start pt-5 md:pt-7 space-y-2">
              <span className="block text-xs sm:text-sm font-semibold tracking-[0.22em] text-indigo-300/80 uppercase">
                {slide.subtitle}
              </span>
              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-white/60 max-w-[480px] mx-auto md:mx-0">
                {slide.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryLine({
  lineRef,
  meteorRef,
  isVisible,
}: {
  lineRef: React.RefObject<HTMLDivElement | null>;
  meteorRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      data-about-story-line
      className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background track line (z-0 so it runs behind the image and text) */}
      <div
        className="absolute inset-x-0 top-[65.5%] h-[1px] -translate-y-1/2 bg-white/10 z-0 sm:top-[65%] md:top-1/2"
      />
      {/* Active progress line */}
      <div
        ref={lineRef}
        style={{ transform: "translateY(-50%) scaleX(0)" }}
        className="absolute inset-x-0 top-[65.5%] h-[2px] -translate-y-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] z-0 origin-left sm:top-[65%] md:top-1/2 md:h-[1px]"
      />
      {/* Moving meteor head */}
      <div
        ref={meteorRef}
        className="absolute left-0 top-[65.5%] -translate-y-1/2 w-[220px] h-[2px] bg-gradient-to-r from-transparent via-purple-500/20 to-white filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] z-0 sm:top-[65%] md:top-1/2"
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_20px_5px_rgba(192,132,252,0.9),0_0_40px_10px_rgba(168,85,247,0.6)]" />
      </div>
    </div>
  );
}
