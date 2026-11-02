"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Search,
  Sparkles,
  ArrowRight,
  Compass,
  Home,
  Cpu,
  GraduationCap,
  Package,
  FlaskConical,
  UserCheck,
  Mail,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";

interface Destination {
  title: string;
  href: string;
  category: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const DESTINATIONS: Destination[] = [
{
        title: "Solutions",
        href: "/solutions",
        category: "Services & Systems",
        description:
          "Custom web apps, enterprise AI, software engineering, & digital transformations.",
        icon: Cpu,
        badge: "Core Service",
      },
      {
        title: "Schools",
        href: "/schools",
        category: "Education Tech",
        description:
          "Practical technology curriculum, AI readiness, & hands-on student workshops.",
        icon: GraduationCap,
        badge: "Programs",
      },
      {
        title: "Products",
        href: "/products",
        category: "Software Products",
        description:
          "Engineered software tools, internal systems, & ready-to-deploy platforms.",
        icon: Package,
        badge: "Software",
      },
      {
        title: "WEBBED Labs",
        href: "/labs",
        category: "R&D & Innovation",
        description:
          "Experimental AI prototypes, tech research, & next-gen creative builds.",
        icon: FlaskConical,
        badge: "R&D Hub",
      },
      {
        title: "About Us",
        href: "/about",
        category: "Company & Vision",
        description:
          "Learn about our vision, engineering methodology, and team philosophy.",
        icon: UserCheck,
        badge: "Identity",
      },
      {
        title: "Contact",
        href: "/contact",
        category: "Get in Touch",
        description:
          "Have a project in mind? Reach out to start a conversation with our team.",
        icon: Mail,
        badge: "Support",
      },
];

export default function NotFoundClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isWarping, setIsWarping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas anomaly particle & radar animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar pulse angle
      angle += 0.008;

      // Draw faint grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw animated radar sweep gradient line from center
      const centerX = width / 2;
      const centerY = height * 0.4;
      const sweepLength = Math.max(width, height);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, sweepLength, angle, angle + 0.35);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        sweepLength
      );
      sweepGrad.addColorStop(0, "rgba(99, 102, 241, 0.08)");
      sweepGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Draw floating grid particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
        ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.3"
        )
        .fromTo(
          searchRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        );

      if (cardsRef.current) {
        const cardElements = cardsRef.current.querySelectorAll(".dest-card");
        tl.fromTo(
          cardElements,
          { opacity: 0, y: 25, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Filter destinations based on search query
  const filteredDestinations = DESTINATIONS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  // Teleport / Random Warp handler
  const handleRandomWarp = () => {
    setIsWarping(true);
    const randomIndex = Math.floor(Math.random() * DESTINATIONS.length);
    const target = DESTINATIONS[randomIndex].href;

    // Trigger subtle warp effect then navigate
    gsap.to(containerRef.current, {
      opacity: 0.3,
      scale: 0.98,
      duration: 0.3,
      onComplete: () => {
        router.push(target);
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030307] px-4 py-16 text-white sm:px-6 lg:px-8"
    >
      {/* Background Interactive Radar & Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />

      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-900/10 blur-[140px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Top Status Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-xl text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
            STATUS: 404 ANOMALY DETECTED
          </span>
          <span className="h-3 w-[1px] bg-indigo-500/40" />
          <span className="text-[11px] font-mono tracking-wider text-indigo-400/80">
            SECTOR: UNMAPPED
          </span>
        </div>

        {/* Hero 404 Headline */}
        <div ref={titleRef} className="mt-8 flex flex-col items-center">
          <div className="relative">
            <h1 className="select-none text-[clamp(4.5rem,18vw,9.5rem)] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 [font-family:var(--font-heading)] filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              404
            </h1>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(4.5rem,18vw,9.5rem)] font-extrabold leading-none tracking-tight text-indigo-500/10 blur-md [font-family:var(--font-heading)]"
            >
              404
            </div>
          </div>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl [font-family:var(--font-heading)]">
            Signal Lost in the Digital Void
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            The page you're searching for doesn't exist, was relocated, or collapsed into quantum noise. Let's get you back on track.
          </p>
        </div>

        {/* Quick Actions & Search Bar */}
        <div ref={searchRef} className="mt-10 w-full max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-indigo-400/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination or service (e.g. Solutions, AI, Labs)..."
              className="w-full rounded-2xl border border-white/15 bg-white/[0.04] py-4 pl-12 pr-28 text-sm text-white placeholder-white/40 backdrop-blur-xl transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xl"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white"
              >
                Clear
              </button>
            ) : (
              <span className="absolute right-4 text-[11px] font-mono uppercase tracking-widest text-white/30">
                SEARCH
              </span>
            )}
          </div>

          {/* Action Row: Back Home + Warp Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-[0.98]"
            >
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>

            <button
              onClick={handleRandomWarp}
              disabled={isWarping}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-500/20 hover:text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] active:scale-[0.98] disabled:opacity-50"
            >
              {isWarping ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
              <span>{isWarping ? "Warping..." : "Surprise Landmark"}</span>
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="mt-14 w-full">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Popular Destinations
              </span>
            </div>
            <span className="text-[11px] font-mono text-white/40">
              {filteredDestinations.length} RESULT{filteredDestinations.length === 1 ? "" : "S"}
            </span>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="my-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <ShieldAlert className="mx-auto h-8 w-8 text-indigo-400/60" />
              <p className="mt-3 text-sm text-white/70">
                No matching page found for "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs font-semibold text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            <div
              ref={cardsRef}
              className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredDestinations.map((dest) => {
                const IconComponent = dest.icon;
                return (
                  <Link
                    key={dest.href}
                    href={dest.href}
                    className="dest-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]"
                  >
                    {/* Hover subtle glow gradient */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-300 group-hover:bg-indigo-500/25"
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 group-hover:border-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-white transition-colors duration-200">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        {dest.badge && (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                            {dest.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-white group-hover:text-indigo-200 transition-colors duration-200 [font-family:var(--font-heading)]">
                        {dest.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-white/55 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
