"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const introLogoScale = 2.85;
const introTotalDuration = 2.8;

const headingWords = ["We", "build", "what", "tomorrow", "depends", "on."];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const logoStageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoSlotRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const paragraphRefs = useRef<HTMLSpanElement[]>([]);
  const buttonRefs = useRef<HTMLDivElement[]>([]);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const ambientRef = useRef<HTMLDivElement>(null);
  const finalLightRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);
  const pointerGlowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const strength = 5;
    const moveX = (x / (rect.width / 2)) * strength;
    const moveY = ((y / (rect.height / 2)) * strength) - 2;

    gsap.to(el, {
      x: moveX,
      y: moveY,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (!window.location.hash || window.location.hash === "#hero") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const hero = heroRef.current;
    const frame = frameRef.current;
    const logoStage = logoStageRef.current;
    const logo = logoRef.current;
    const logoSlot = logoSlotRef.current;
    const tagline = taglineRef.current;
    const ambient = ambientRef.current;
    const finalLight = finalLightRef.current;
    const network = networkRef.current;
    const words = wordRefs.current.filter(Boolean);
    const paragraphs = paragraphRefs.current.filter(Boolean);
    const buttons = buttonRefs.current.filter(Boolean);

    if (!hero || !frame || !logoStage || !logo || !logoSlot || !tagline || !ambient || !finalLight || !network) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileLayout = window.matchMedia("(max-width: 768px)").matches;
    const revealY = reduceMotion ? 8 : 18;
    let navVisible = false;
    const setHeroNavVisible = (visible: boolean) => {
      if (navVisible === visible) return;
      navVisible = visible;
      window.dispatchEvent(new CustomEvent("webbed:hero-nav", { detail: { visible } }));
    };

    setHeroNavVisible(false);



    const getLogoPlacement = () => {
      const stageRect = logoStage.getBoundingClientRect();
      const slotRect = logoSlot.getBoundingClientRect();

      return {
        finalX: slotRect.left + slotRect.width / 2 - (stageRect.left + stageRect.width / 2),
        finalY: slotRect.top + slotRect.height / 2 - (stageRect.top + stageRect.height / 2),
      };
    };

    gsap.set(logoStage, {
      autoAlpha: 1,
    });

    gsap.set(logo, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: isMobileLayout ? 1.6 : (reduceMotion ? 2.35 : introLogoScale),
      transformOrigin: "center center",
      force3D: true,
      autoRound: false,
      filter: "drop-shadow(0 14px 38px rgba(255,255,255,0.16))",
    });

    gsap.set([tagline, ...words, ...paragraphs, ...buttons], {
      autoAlpha: 0,
      y: revealY,
      force3D: true,
    });

    gsap.set([ambient, finalLight, network], {
      autoAlpha: 0,
    });

    const ctx = gsap.context(() => {
      const introHoldDuration = reduceMotion ? 0.2 : 0.45;
      const revealDuration = reduceMotion ? 0.2 : 0.62;
      // The final reveal overlaps the logo move by 0.08s, so this keeps the
      // complete branded intro at 2.8 seconds: quicker, while preserving the
      // smooth cinematic travel and overlapping content reveal.
      const logoMoveDuration = reduceMotion
        ? 0.2
        : introTotalDuration - introHoldDuration - revealDuration + 0.08;
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onUpdate: () => {
          hero.dataset.heroProgress = timeline.progress().toFixed(3);
          setHeroNavVisible(timeline.time() >= introHoldDuration + logoMoveDuration * 0.88);
        },
        onComplete: () => {
          hero.dataset.heroProgress = "1";
          setHeroNavVisible(true);
        },
      });

      timeline
        .to(logo, {
          x: () => getLogoPlacement().finalX,
          y: () => getLogoPlacement().finalY,
          scale: isMobileLayout ? 0.833 : 1,
          duration: logoMoveDuration,
          ease: "sine.inOut",
          force3D: true,
          autoRound: false,
        }, introHoldDuration)
        .to(
          [tagline, ...words, ...paragraphs, ...buttons],
          {
            autoAlpha: 1,
            y: 0,
            duration: revealDuration,
            ease: "power2.out",
            stagger: reduceMotion ? 0 : 0.03,
          },
          introHoldDuration + logoMoveDuration - 0.08
        )
        .to(
          [ambient, finalLight, network],
          {
            autoAlpha: 1,
            duration: reduceMotion ? 0.2 : 0.7,
            ease: "power2.out",
          },
          "<"
        );
    }, hero);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const pointerGlow = pointerGlowRef.current;
    const network = networkRef.current;
    if (!hero || !pointerGlow || !network) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarsePointer) return;

    const glowX = gsap.quickTo(pointerGlow, "x", { duration: 0.55, ease: "power3.out" });
    const glowY = gsap.quickTo(pointerGlow, "y", { duration: 0.55, ease: "power3.out" });
    const networkX = gsap.quickTo(network, "x", { duration: 0.9, ease: "power3.out" });
    const networkY = gsap.quickTo(network, "y", { duration: 0.9, ease: "power3.out" });

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centeredX = (x / rect.width - 0.5) * 18;
      const centeredY = (y / rect.height - 0.5) * 14;

      glowX(x - 180);
      glowY(y - 180);
      networkX(centeredX);
      networkY(centeredY);
    };

    const onPointerLeave = () => {
      networkX(0);
      networkY(0);
    };

    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative h-screen bg-transparent">
      <div ref={frameRef} className="hero-frame relative h-screen w-full overflow-hidden bg-transparent">
        <div className="hero-base absolute inset-0 z-0" aria-hidden />
        <div ref={ambientRef} className="hero-ambient absolute inset-0 z-[1]" style={{ opacity: 0 }} aria-hidden />
        <div ref={finalLightRef} className="hero-final-light absolute inset-0 z-[2]" style={{ opacity: 0 }} aria-hidden />
        <div ref={pointerGlowRef} className="hero-pointer-glow pointer-events-none absolute left-0 top-0 z-[2]" aria-hidden />
        <svg
          ref={networkRef}
          className="hero-network pointer-events-none absolute inset-0 z-[3] h-full w-full"
          style={{ opacity: 0 }}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="heroCoreGlow" cx="1200" cy="450" r="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(214, 232, 255, 0.45)" />
              <stop offset="25%" stopColor="rgba(90, 128, 230, 0.25)" />
              <stop offset="65%" stopColor="rgba(150, 18, 54, 0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            <linearGradient id="heroLineBlueCrimson" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(90, 128, 230, 0.45)" />
              <stop offset="60%" stopColor="rgba(110, 150, 245, 0.55)" />
              <stop offset="100%" stopColor="rgba(220, 70, 120, 0.50)" />
            </linearGradient>

            <filter id="heroCoreSoftShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.45 0"
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="hero-network-pulse">
            {/* Core positioning: dominant core at (1200, 450) */}
            <circle className="hero-core-halo" cx="1200" cy="450" r="200" stroke="rgba(147, 176, 255, 0.05)" strokeWidth="0.75" fill="none" />

            {/* Connection lines (subtle bezier curves, fading as they move away from the core) */}
            <g className="hero-network-lines" stroke="url(#heroLineBlueCrimson)" strokeWidth="0.85" fill="none">
              {/* Dense Core Cluster Connections (Brightest/Highest contrast) */}
              <path d="M 1200 450 Q 1182 432, 1160 420" opacity="0.65" />
              <path d="M 1200 450 Q 1182 468, 1170 480" opacity="0.65" />
              <path d="M 1200 450 Q 1218 432, 1230 420" opacity="0.65" />
              <path d="M 1200 450 Q 1222 462, 1240 470" opacity="0.65" />
              <path d="M 1160 420 Q 1155 450, 1170 480" opacity="0.55" />
              <path d="M 1230 420 Q 1245 445, 1240 470" opacity="0.55" />

              {/* Main Trunk branches (Foreground - medium high contrast) */}
              <path d="M 1160 420 Q 1090 395, 1020 380" opacity="0.45" />
              <path d="M 1170 480 Q 1150 500, 1050 520" opacity="0.45" />
              <path d="M 1230 420 Q 1215 355, 1120 290" opacity="0.40" />
              <path d="M 1240 470 Q 1230 540, 1140 610" opacity="0.40" />

              {/* Grid/Triangulation connections (Foreground) */}
              <path d="M 1020 380 Q 1070 335, 1120 290" opacity="0.40" />
              <path d="M 1050 520 Q 1095 565, 1140 610" opacity="0.40" />
              <path d="M 1020 380 Q 1035 450, 1050 520" opacity="0.35" />

              {/* Midground grid connections (Noticeably lower opacity to fade away) */}
              <path d="M 1020 380 Q 970 410, 920 440" opacity="0.32" />
              <path d="M 1050 520 Q 985 480, 920 440" opacity="0.32" />
              <path d="M 1120 290 Q 1040 275, 960 260" opacity="0.32" />
              <path d="M 1140 610 Q 1045 615, 950 620" opacity="0.32" />
              <path d="M 1120 290 Q 1095 230, 1070 170" opacity="0.25" />
              <path d="M 1140 610 Q 1115 660, 1090 710" opacity="0.25" />

              <path d="M 920 440 Q 940 350, 960 260" opacity="0.28" />
              <path d="M 920 440 Q 935 530, 950 620" opacity="0.28" />

              {/* Background connections (Farthest nodes, very soft) */}
              <path d="M 920 440 Q 870 455, 820 470" opacity="0.18" />
              <path d="M 960 260 Q 920 285, 880 310" opacity="0.18" />
              <path d="M 950 620 Q 950 605, 870 590" opacity="0.18" />

              <path d="M 820 470 Q 850 390, 880 310" opacity="0.12" />
              <path d="M 820 470 Q 845 530, 870 590" opacity="0.12" />

              {/* Offscreen extensions */}
              <path d="M 1200 450 Q 1330 380, 1460 320" opacity="0.45" />
              <path d="M 1200 450 Q 1330 520, 1460 580" opacity="0.45" />
              <path d="M 1200 450 H 1440" opacity="0.40" />

              {/* Secondary Cluster Connections in Upper-Right (Reduced opacity by 15-20%) */}
              <path d="M 1240 150 L 1290 130" opacity="0.36" />
              <path d="M 1290 130 L 1320 210" opacity="0.36" />
              <path d="M 1320 210 L 1260 230" opacity="0.36" />
              <path d="M 1260 230 L 1240 150" opacity="0.36" />
              <path d="M 1120 290 Q 1190 260, 1260 230" opacity="0.30" />
              <path d="M 1070 170 Q 1150 160, 1240 150" opacity="0.30" />
            </g>

            {/* Nodes */}
            <g className="hero-network-nodes" filter="url(#heroCoreSoftShadow)">
              {/* Core node (dominant focal point, strengthened visual presence) */}
              <circle className="hero-core-node" cx="1200" cy="450" r="7.5" fill="rgba(235, 245, 255, 0.92)" />
              <circle cx="1200" cy="450" r="24" fill="url(#heroCoreGlow)" opacity="0.95" />

              {/* Close-range dense cluster nodes (Very high contrast) */}
              <circle className="hero-node-blue" cx="1160" cy="420" r="2.8" opacity="0.9" />
              <circle className="hero-node-crimson" cx="1170" cy="480" r="2.8" opacity="0.9" />
              <circle className="hero-node-blue" cx="1230" cy="420" r="2.6" opacity="0.9" />
              <circle className="hero-node-crimson" cx="1240" cy="470" r="2.6" opacity="0.9" />

              {/* Secondary Cluster Nodes (Tier 1/2, reduced opacity by 15-20%) */}
              <circle className="hero-node-blue" cx="1240" cy="150" r="2.8" opacity="0.68" />
              <circle className="hero-node-blue" cx="1290" cy="130" r="2.6" opacity="0.68" />
              <circle className="hero-node-crimson" cx="1320" cy="210" r="2.8" opacity="0.68" />
              <circle className="hero-node-blue" cx="1260" cy="230" r="2.4" opacity="0.64" />

              {/* Foreground Nodes (Tier 1 - medium contrast) */}
              <circle className="hero-node-blue" cx="1020" cy="380" r="3.6" opacity="0.70" />
              <circle className="hero-node-crimson" cx="1050" cy="520" r="3.6" opacity="0.70" />
              <circle className="hero-node-blue" cx="1120" cy="290" r="3.2" opacity="0.70" />
              <circle className="hero-node-crimson" cx="1140" cy="610" r="3.2" opacity="0.70" />

              {/* Midground Nodes (Tier 2 - low contrast to fade away) */}
              <circle className="hero-node-blue" cx="920" cy="440" r="2.8" opacity="0.45" />
              <circle className="hero-node-blue" cx="960" cy="260" r="2.6" opacity="0.45" />
              <circle className="hero-node-crimson" cx="950" cy="620" r="2.6" opacity="0.45" />
              <circle className="hero-node-blue" cx="1070" cy="170" r="2.4" opacity="0.45" />
              <circle className="hero-node-crimson" cx="1090" cy="710" r="2.4" opacity="0.45" />

              {/* Background Nodes (Tier 3 - lowest contrast) */}
              <circle className="hero-node-blue" cx="820" cy="470" r="2.0" opacity="0.25" />
              <circle className="hero-node-blue" cx="880" cy="310" r="2.0" opacity="0.25" />
              <circle className="hero-node-crimson" cx="870" cy="590" r="2.0" opacity="0.25" />
            </g>
          </g>
        </svg>
        <div className="hero-spotlight absolute inset-0 z-[4]" aria-hidden />
        <div className="hero-vignette absolute inset-0 z-[5]" aria-hidden />

        <div className="hero-content-shell relative z-[35] mx-auto flex h-full max-w-6xl items-center px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="hero-copy relative mt-12 max-w-xl sm:mt-8 md:mt-6 w-full">
            <p
              ref={taglineRef}
              className="hero-reveal type-eyebrow inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.6rem] leading-none tracking-[0.24em] text-white/78 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] sm:text-[0.68rem] md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-inherit md:leading-normal md:tracking-[0.32em] md:shadow-none"
              style={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
            >
              BUILDING THE NEXT ERA OF DIGITAL EXPERIENCES
            </p>

            <h1 className="mt-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              <img
                ref={logoSlotRef}
                src="/logo.png"
                alt=""
                aria-hidden="true"
                className="invisible h-16 w-[120px] object-contain mb-4 sm:h-24 sm:w-[173px] md:h-28 md:w-[202px]"
              />
            </h1>

            <h2 className="mt-6 max-w-[20rem] sm:max-w-xl md:max-w-2xl text-[clamp(1.75rem,7vw,2.75rem)] sm:text-3xl sm:leading-[1.02] font-bold leading-[1.03] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] [font-family:var(--font-heading)] sm:text-4xl md:text-5xl">
              {headingWords.map((word, index) => (
                <span key={word}>
                  <span
                    ref={(node) => {
                      if (node) wordRefs.current[index] = node;
                    }}
                    className="hero-reveal inline-block will-change-transform"
                    style={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
                  >
                    {word}
                  </span>
                  {index < headingWords.length - 1 ? " " : null}
                  {isMobile ? (index === 2 ? <br /> : null) : index === 3 ? <br /> : null}
                </span>
              ))}
            </h2>

            <p className="type-body mt-5 max-w-[21.5rem] sm:max-w-lg md:max-w-xl leading-[1.68] text-white/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
              <span
                ref={(node) => {
                  if (node) paragraphRefs.current[0] = node;
                }}
                className="hero-reveal block will-change-transform"
                style={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
              >
                {isMobile ? "WEBBED is a technology company built on one belief: exceptional software changes everything. We create innovative products, digital solutions, and educational experiences that solve real problems and shape the future. We don't follow industry standards—we raise them." : "WEBBED is a technology ecosystem providing products, Services, Education  and digital experiences built to evolve and leave a mark"}
              </span>
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center relative z-40">
              <div
                ref={(node) => {
                  if (node) buttonRefs.current[0] = node;
                }}
                className="hero-reveal will-change-transform"
                style={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
              >
                <Link
                  href="#contact"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="type-button hero-cta-primary inline-flex items-center justify-center rounded-full px-6 py-4 text-black backdrop-blur-md sm:py-3 transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Get In Touch
                </Link>
              </div>

              <div
                ref={(node) => {
                  if (node) buttonRefs.current[1] = node;
                }}
                className="hero-reveal will-change-transform"
                style={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
              >
                <Link
                  href="#services"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="type-button hero-cta-secondary inline-flex items-center justify-center rounded-full px-6 py-4 text-white backdrop-blur-md sm:py-3 transition-all duration-300 hover:border-white/60 hover:bg-white/[0.12] hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(0, 0, 0, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  Explore WEBBED
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={logoStageRef}
          className="pointer-events-none absolute inset-0 z-[45] flex items-center justify-center logo-stage"
          style={{ transform: isMobile ? "translate3d(0, 0, 0)" : "translate3d(0, 2vh, 0)" }}
        >
          <img
            ref={logoRef}
            src="/logo.png"
            alt="WEBBED company logo — a technology company building AI software, websites, and digital products"
            className="h-20 w-[144px] hero-logo-initial origin-center transform-gpu object-contain will-change-transform sm:h-24 sm:w-[173px] md:h-28 md:w-[202px]"
            style={{
              opacity: 1,
            }}
          />
        </div>
        {/* Bottom edge gradient blend */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-[200px] section-fade-bottom-dark" aria-hidden />
      </div>

      <style jsx>{`
        .hero-reveal {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
        }

        .hero-logo-initial {
          transform: scale(2.85);
          filter: drop-shadow(0 14px 38px rgba(255,255,255,0.16));
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .logo-stage {
          opacity: 0;
        }

        @media (max-width: 768px) {
          .hero-logo-initial {
            transform: scale(1.6);
          }
        }

        .hero-base {
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.02) 48%, rgba(0, 0, 0, 0.12)),
            linear-gradient(180deg, rgba(0, 0, 0, 0.1), transparent 42%, rgba(0, 0, 0, 0.24)),
            url("/herobg.png");
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .hero-ambient {
          opacity: 0;
          mix-blend-mode: screen;
        }

        .hero-ambient::before,
        .hero-ambient::after {
          content: "";
          position: absolute;
          width: 54vw;
          height: 54vw;
          max-width: 820px;
          max-height: 820px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.32;
          transform: translate3d(0, 0, 0);
          animation: heroAmbientDrift 24s ease-in-out infinite alternate;
        }

        .hero-ambient::before {
          left: 50%;
          top: 50%;
          background: rgba(20, 55, 180, 0.18);
        }

        .hero-ambient::after {
          right: -10%;
          bottom: -18%;
          background: rgba(150, 18, 54, 0.18);
          animation-duration: 29s;
          animation-delay: -8s;
        }

        .hero-final-light {
          background:
            radial-gradient(circle at 70% 45%, rgba(210, 226, 255, 0.16), rgba(90, 128, 230, 0.07) 22%, transparent 46%),
            radial-gradient(circle at 26% 38%, rgba(34, 76, 180, 0.1), transparent 26%),
            radial-gradient(circle at 82% 62%, rgba(128, 18, 54, 0.08), transparent 34%);
        }

        .hero-pointer-glow {
          width: 360px;
          height: 360px;
          border-radius: 9999px;
          opacity: 0.34;
          background:
            radial-gradient(circle at center, rgba(255,255,255,0.18), rgba(90,128,230,0.08) 34%, rgba(220,70,120,0.06) 54%, transparent 72%);
          filter: blur(18px);
          mix-blend-mode: screen;
          transform: translate3d(62vw, 42vh, 0);
          will-change: transform;
        }

        .hero-network {
          opacity: 0;
          stroke: rgba(147, 176, 255, 0.18);
          stroke-width: 1;
          fill: rgba(207, 220, 255, 0.42);
          filter: drop-shadow(0 0 10px rgba(72, 102, 210, 0.12));
          transform: translate3d(0, 0, 0);
          will-change: transform, opacity;
        }

        .hero-network-drift {
          animation: heroNetworkDrift 34s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .hero-spotlight {
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.04) 18%, transparent 42%);
        }

        .hero-vignette {
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.08) 46%, rgba(0, 0, 0, 0.66)),
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.16) 48%, rgba(0, 0, 0, 0.74) 100%);
        }

        @keyframes heroAmbientDrift {
          from {
            transform: translate3d(-3%, 2%, 0) scale(1);
          }
          to {
            transform: translate3d(4%, -4%, 0) scale(1.08);
          }
        }

        /* Premium core pulse (replaces noticeable drift) */
        .hero-core-halo {
          fill: none;
          opacity: 0.85;
          filter: blur(0.2px);
        }

        .hero-core-node {
          opacity: 0.98;
          filter: drop-shadow(0 0 22px rgba(90, 128, 230, 0.45)) drop-shadow(0 0 44px rgba(150, 18, 54, 0.22));
        }

        .hero-node-blue {
          fill: rgba(90, 128, 230, 0.85);
          filter: drop-shadow(0 0 8px rgba(90, 128, 230, 0.6));
        }

        .hero-node-crimson {
          fill: rgba(220, 70, 120, 0.85);
          filter: drop-shadow(0 0 8px rgba(220, 70, 120, 0.6));
        }

        .hero-network-lines {
          opacity: 0.85;
        }

        .hero-network-pulse {
          /* extremely subtle breathing pulse */
          animation: heroCorePulse 7.6s ease-in-out infinite;
          transform-origin: 1200px 450px;
        }

        @keyframes heroCorePulse {
          0% {
            transform: translate3d(2px, 0px, 0) scale(1);
            filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
          }
          45% {
            transform: translate3d(-1px, 0.5px, 0) scale(1.012);
            filter: drop-shadow(0 0 18px rgba(90, 128, 230, 0.12)) drop-shadow(0 0 28px rgba(150, 18, 54, 0.06));
          }
          100% {
            transform: translate3d(2px, 0px, 0) scale(1);
            filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
          }
        }

        @media (max-width: 640px) {
          .hero-ambient::before,
          .hero-ambient::after {
            width: 92vw;
            height: 92vw;
            filter: blur(68px);
          }
        }

        @media (max-width: 768px) {
          #hero,
          .hero-frame,
          .logo-stage {
            height: 100svh !important;
            min-height: 100svh !important;
          }

          .hero-content-shell {
            height: 100svh;
            min-height: 100svh;
            align-items: center;
            justify-content: center;
            padding-top: 5.5rem;
            padding-bottom: 5rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .hero-copy {
            margin-top: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 100%;
          }

          .hero-copy h2 {
            margin-top: 2rem !important;
            margin-bottom: 1.5rem !important;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-copy p {
            margin-top: 1rem !important;
            margin-bottom: 2rem !important;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-copy h1 img {
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 1rem;
          }

          /* Keep CTA buttons side by side on mobile */
          .hero-copy .mt-7 {
            flex-direction: row !important;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem !important;
            width: 100%;
            margin-top: 0.75rem !important;
          }

          .hero-copy .mt-7 > div {
            flex: 1 1 auto;
            min-width: 130px;
          }

          .hero-copy .mt-7 a {
            width: 100%;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            font-size: 0.8rem !important;
          }



          /* Keep background visible on mobile (portrait) */
          .hero-base {
            background-position: 63% center;
          }

          .hero-ambient {
            opacity: 1;
          }

          .hero-pointer-glow {
            display: none;
          }

          .hero-ambient::before,
          .hero-ambient::after {
            filter: blur(58px);
            opacity: 0.28;
          }

          .hero-ambient::before {
            transform: translate3d(0, -2%, 0);
          }

          .hero-ambient::after {
            transform: translate3d(0, 2%, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ambient::before,
          .hero-ambient::after,
          .hero-network-pulse {
            animation: none;
          }
        }

        .hero-cta-primary,
        .hero-cta-secondary {
          transition: 
            border-color 300ms cubic-bezier(0.25, 1, 0.5, 1),
            background-color 300ms cubic-bezier(0.25, 1, 0.5, 1),
            box-shadow 300ms cubic-bezier(0.25, 1, 0.5, 1),
            color 300ms cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform, box-shadow, border-color;
        }

        .hero-cta-primary {
          background: linear-gradient(135deg, rgba(90, 128, 230, 0.18) 0%, rgba(90, 128, 230, 0.08) 100%);
          border: 1px solid rgba(90, 128, 230, 0.55);
          box-shadow: 
            0 4px 14px rgba(0, 0, 0, 0.35),
            0 0 12px rgba(90, 128, 230, 0.12),
            inset 0 1px 0 rgba(110, 150, 245, 0.20);
        }

        .hero-cta-primary:hover {
          background: linear-gradient(135deg, rgba(90, 128, 230, 0.30) 0%, rgba(90, 128, 230, 0.16) 100%);
          border-color: rgba(110, 150, 245, 0.85);
          box-shadow: 
            0 6px 22px rgba(0, 0, 0, 0.45),
            0 0 20px rgba(90, 128, 230, 0.40),
            0 0 0 1px rgba(90, 128, 230, 0.30),
            inset 0 1px 0 rgba(180, 200, 255, 0.25);
          color: #ffffff;
        }

        .hero-cta-secondary {
          background: linear-gradient(135deg, rgba(220, 70, 120, 0.12) 0%, rgba(150, 18, 54, 0.08) 100%);
          border: 1px solid rgba(220, 70, 120, 0.50);
          box-shadow: 
            0 4px 14px rgba(0, 0, 0, 0.35),
            0 0 12px rgba(220, 70, 120, 0.10),
            inset 0 1px 0 rgba(240, 100, 150, 0.15);
        }

        .hero-cta-secondary:hover {
          background: linear-gradient(135deg, rgba(220, 70, 120, 0.24) 0%, rgba(150, 18, 54, 0.16) 100%);
          border-color: rgba(240, 100, 150, 0.85);
          box-shadow: 
            0 6px 22px rgba(0, 0, 0, 0.40),
            0 0 20px rgba(220, 70, 120, 0.38),
            0 0 0 1px rgba(220, 70, 120, 0.30),
            inset 0 1px 0 rgba(255, 140, 180, 0.20);
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
