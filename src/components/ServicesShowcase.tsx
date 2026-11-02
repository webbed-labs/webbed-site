"use client";

import { ensureScrollTrigger, toGsapEase, useReveal } from "@/lib/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type ServiceCardProps = {
  title: string;
  description: string;
  featured?: boolean;
  variant: "schools" | "services" | "labs";
};

function ServiceCard({ title, description, featured, variant }: ServiceCardProps) {
  const base =
    "relative overflow-hidden rounded-[2.75rem] bg-black text-white shadow-[0_40px_120px_rgba(0,0,0,0.22)]";

  const size = featured
    ? "min-h-[380px] sm:min-h-[560px] lg:min-h-[620px]"
    : "min-h-[340px] sm:min-h-[500px] lg:min-h-[560px]";

  const frame = "ring-1 ring-white/10";
  const commonClasses = [
    base,
    size,
    frame,
    "group will-change-transform flex flex-col h-full",
    "hover:shadow-[0_50px_150px_rgba(0,0,0,0.28)]"
  ].join(" ");

  const heading = `Webbed ${title}`;

  const VARIANT_CONFIG: Record<
    ServiceCardProps["variant"],
    {
      src: string;
      alt: string;
      imagePosition: "top" | "bottom";
      contentPosition: "top" | "bottom";
      contentAlign: "items-start" | "items-center" | "items-end";
      contentTextAlign: "text-left" | "text-center" | "text-right";
      showButton: boolean;
    }
  > = {
    schools: {
      src: "/schools-bg.png",
      alt: "WEBBED Schools — students and professionals learning hands-on technology, AI, and software development skills",
      imagePosition: "top",
      contentPosition: "bottom",
      contentAlign: "items-end",
      contentTextAlign: "text-right",
      showButton: true,
    },
    services: {
      src: "/services-bg.jpg",
      alt: "WEBBED Solutions — custom websites, web apps, AI software, and digital platforms built for businesses",
      imagePosition: "bottom",
      contentPosition: "top",
      contentAlign: "items-center",
      contentTextAlign: "text-center",
      showButton: true,
    },
    labs: {
      src: "/labs-bg.jpg",
      alt: "WEBBED Labs — research and innovation division building original AI products and future technologies",
      imagePosition: "bottom",
      contentPosition: "top",
      contentAlign: "items-start",
      contentTextAlign: "text-left",
      showButton: true,
    },
  };

  const config = VARIANT_CONFIG[variant];

  const href =
    variant === "schools" ? "/schools" : variant === "services" ? "/solutions" : "/labs";

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      y: -12,
      scale: 1.02,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--card-x", `${x}%`);
    e.currentTarget.style.setProperty("--card-y", `${y}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <Link href={href} className="block h-full cursor-pointer">
      <article
        className={`${commonClasses} service-showcase-card`}
        onMouseEnter={handleMouseEnter}
        onPointerMove={handlePointerMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="service-card-spotlight pointer-events-none absolute inset-0 z-[2]" aria-hidden />
        {/* ── Image layer (top or bottom half) ── */}
        <div
          className={[
            "absolute inset-x-0 overflow-hidden",
            config.imagePosition === "top"
              ? "top-0 h-[65%] sm:h-[55%]"
              : "bottom-0 h-[60%] sm:h-[50%]",
          ].join(" ")}
        >
          <img
            src={config.src}
            alt={config.alt}
            className={[
              "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105",
              config.imagePosition === "bottom" ? "object-bottom" : "object-top",
            ].join(" ")}
          />
          {/* Subtle gradient so the image blends into the card body */}
          <div
            className={[
              "absolute inset-0",
              config.imagePosition === "top"
                ? "bg-gradient-to-b from-black/20 via-black/5 to-black sm:from-black/10 sm:via-transparent sm:to-black"
                : "bg-gradient-to-t from-black/20 via-black/5 to-black sm:from-black/10 sm:via-transparent sm:to-black",
            ].join(" ")}
          />
        </div>

        {/* ── Content (sits on the opposite half of the image) ── */}
        <div
          className={[
            "relative z-10 flex h-full w-full flex-col px-7 sm:px-8 md:px-10 py-10 sm:py-10 md:py-12 items-center text-center sm:items-start sm:text-left",
            variant === "services" ? "sm:items-center sm:text-center" : "",
            variant === "schools" ? "sm:items-end sm:text-right" : "",
            config.contentPosition === "top" ? "justify-start" : "justify-end",
          ].join(" ")}
        >
          {config.contentPosition === "top" ? (
            <>
              <h3 className="text-[24px] sm:text-[26px] md:text-[28px] font-semibold tracking-[-0.02em] [font-family:var(--font-heading)]">
                {heading}
              </h3>
              <p className="mt-4 sm:mt-6 text-white/70 leading-relaxed [font-family:var(--font-body)] text-[14px] sm:text-[15px] max-w-[32ch] mx-auto sm:mx-0">
                &ldquo;{description}&rdquo;
              </p>
              {config.showButton && (
                <div className="service-card-action mt-6 sm:mt-9 inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-2.5 text-sm text-white backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.24)] [font-family:var(--font-ui)] transition duration-200 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_10px_30px_rgba(255,255,255,0.12)] cursor-pointer select-none">
                  Explore
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-4 sm:mb-6 text-white/70 leading-relaxed [font-family:var(--font-body)] text-[14px] sm:text-[15px] max-w-[28ch] mx-auto sm:mx-0">
                &ldquo;{description}&rdquo;
              </p>
              <h3 className="text-[24px] sm:text-[26px] md:text-[28px] font-semibold tracking-[-0.02em] [font-family:var(--font-heading)] mb-4 sm:mb-6">
                {heading}
              </h3>
              {config.showButton && (
                <div className="service-card-action inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-2.5 text-sm text-white backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.24)] [font-family:var(--font-ui)] transition duration-200 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_10px_30px_rgba(255,255,255,0.12)] cursor-pointer select-none">
                  Explore
                </div>
              )}
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function ServicesShowcase() {
  const transitionEase = [0.22, 1, 0.36, 1] as const;

  const headingRef = useReveal<HTMLHeadingElement>({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.8 },
    transition: { duration: 0.7, ease: transitionEase as unknown as number[] },
  });
  const paragraphRef = useReveal<HTMLParagraphElement>({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.8 },
    transition: { duration: 0.7, delay: 0.1, ease: transitionEase as unknown as number[] },
  });

  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Stagger-reveal the three cards via ScrollTrigger.batch.
  useEffect(() => {
    ensureScrollTrigger();
    const cards = gsap.utils.toArray<HTMLElement>(".services-card");
    if (cards.length === 0) return;
    const initialX = isMobile ? 80 : 0;
    const initialY = isMobile ? 0 : 24;
    gsap.set(cards, { opacity: 0, x: isMobile ? -initialX : 0, y: initialY });
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: toGsapEase(transitionEase as unknown as number[]),
          stagger: 0.12,
        });
      },
    });
    return () => {
      trigger.kill();
      gsap.killTweensOf(cards);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-[150vh] overflow-hidden bg-white text-black lg:min-h-[165vh]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.94),rgba(245,245,245,0.98)_42%,rgba(232,232,232,0.96)_78%)]" />
        <div className="absolute -top-64 left-1/2 h-[980px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0)_62%)] blur-3xl opacity-45" />
        <div className="absolute -bottom-72 right-1/3 h-[1040px] w-[1040px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.07),rgba(0,0,0,0)_62%)] blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.92),rgba(255,255,255,0)_55%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_55%,rgba(255,255,255,0.90),rgba(255,255,255,0)_58%)] opacity-65" />
      </div>

      <div className="relative z-30 mx-auto max-w-6xl px-6 pt-24 pb-[34vh] sm:pt-32 sm:pb-[38vh] lg:pb-[42vh] animate-fade-in">
        <div>
          <h2
            ref={headingRef}
            className="relative mx-auto max-w-2xl text-center text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] [font-family:var(--font-heading)]"
          >
            THREE DIVISIONS. ONE VISION.
          </h2>
          <p
            ref={paragraphRef}
            className="relative mx-auto mt-7 max-w-2xl text-center text-base sm:text-lg text-black/60 leading-relaxed [font-family:var(--font-body)]"
          >
            From software and AI systems to education and product innovation, WEBBED operates across three focused divisions built to shape the future of technology
          </p>

          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <div className="mx-auto h-[520px] max-w-6xl rounded-[3.75rem] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.10),rgba(0,0,0,0)_62%)] blur-3xl opacity-70" />
          </div>

          <div className="relative mt-16 sm:mt-20 grid gap-4 sm:gap-7 lg:grid-cols-3 lg:gap-10 items-stretch">
            <div className="lg:pb-8 lg:translate-y-6 flex flex-col h-full">
              <div className="services-card h-full">
                <ServiceCard
                  title="Schools"
                  description="Learn software development, AI, automation, web technologies, and digital systems through practical, industry-focused education."
                  variant="schools"
                />
              </div>
            </div>

            <div className="lg:pb-0 lg:-translate-y-8 flex flex-col h-full">
              <div className="services-card h-full">
                <ServiceCard
                  title="Solutions"
                  description="Custom websites, AI systems, automations, apps, and scalable software solutions built for businesses ready to grow faster and operate smarter."
                  featured
                  variant="services"
                />
              </div>
            </div>

            <div className="lg:pb-8 lg:translate-y-6 flex flex-col h-full">
              <div className="services-card h-full">
                <ServiceCard
                  title="Labs"
                  description="Where ideas too ambitious for convention become products the world has not seen yet."
                  variant="labs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .service-showcase-card {
          --card-x: 50%;
          --card-y: 42%;
          transform: translate3d(0, 0, 0);
          transition:
            box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 420ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .service-showcase-card img {
          transform: translate3d(0, 0, 0) scale(1);
          will-change: transform;
        }

        .service-card-spotlight {
          opacity: 0;
          background:
            radial-gradient(circle at var(--card-x) var(--card-y), rgba(255,255,255,0.20), rgba(255,255,255,0.07) 22%, transparent 48%);
          mix-blend-mode: screen;
          transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .service-showcase-card:hover .service-card-spotlight,
        .service-showcase-card:focus-within .service-card-spotlight {
          opacity: 1;
        }

        .service-card-action span {
          display: inline-block;
          transform: translate3d(0, 0, 0);
          transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .service-showcase-card:hover .service-card-action span,
        .service-showcase-card:focus-within .service-card-action span {
          transform: translate3d(4px, 0, 0);
        }

        @media (hover: none) {
          .service-card-spotlight {
            opacity: 0.6;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.12), transparent 45%),
              radial-gradient(circle at 72% 18%, rgba(255,255,255,0.14), transparent 38%);
          }
        }
      `}</style>
    </section>
  );
}
