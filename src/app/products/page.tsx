"use client";

import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import { useAnimate, useReveal, ensureScrollTrigger } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

interface MetaTag { name?: string; property?: string; content: string }
function injectMeta(tags: MetaTag[]): () => void {
  const created: Element[] = [];
  tags.forEach(({ name, property, content }) => {
    const attr = name ? "name" : "property";
    const val = name || property;
    let el = document.querySelector(`meta[${attr}="${val}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, val!);
      document.head.appendChild(el);
      created.push(el);
    }
    el.setAttribute("content", content);
  });
  return () => { created.forEach((el) => el.parentNode?.removeChild(el)); };
}

/* ──────────────────── Product Data ──────────────────── */

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Path to an image asset; if undefined a generative gradient is used. */
  image?: string;
  /** Generative gradient fallback when no image is supplied. */
  gradient: string;
  /** Aura / glow colour around the visual. */
  glowColor: string;
  /** Status pill shown above the heading. */
  status: string;
  /** External CTA — when undefined, no button is rendered. */
  ctaHref?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "insynk",
    name: "InSynk",
    tagline: "ERP & Job Tracking Software",
    description:
      "Run operations without the chaos. InSynk unifies your projects, jobs, and field teams into one calm, real-time workspace — built so nothing slips through the cracks.",
    image: "/insynk.webp",
    gradient: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
    glowColor: "rgba(99,102,241,0.35)",
    status: "Live",
    ctaHref: "https://insynk.net",
  },
  {
    id: "project-hive",
    name: "Project HIVE",
    tagline: "Autonomous Agentic AI",
    description:
      "A fleet of autonomous agents that take work off your plate. HIVE plans, decides, and executes multi-step workflows end to end — your digital workforce that never sleeps.",
    gradient: "linear-gradient(135deg, #059669 0%, #14b8a6 100%)",
    glowColor: "rgba(16,185,129,0.35)",
    status: "Building",
  },
  {
    id: "aida",
    name: "AIDA",
    tagline: "Autonomous AI for Data Automation",
    description:
      "AIDA turns raw data into structured, trustworthy answers. From messy spreadsheets to live dashboards — pipelines that build themselves, analytics that explain themselves.",
    gradient: "linear-gradient(135deg, #be185d 0%, #ea580c 100%)",
    glowColor: "rgba(244,63,94,0.35)",
    status: "Building",
  },
  {
    id: "grabbo",
    name: "GRABBO",
    tagline: "Seamless Rentals at your doorstep",
    description:
      "GRABBO is the rental marketplace for the way India actually lives. Cameras, consoles, gear, appliances — booked in taps, delivered to the door, returned without a phone call.",
    image: "/Grabbo.webp",
    gradient: "linear-gradient(135deg, #047857 0%, #0d9488 100%)",
    glowColor: "rgba(16,185,129,0.35)",
    status: "Waitlist Open",
    ctaHref: "https://grabbowaitlist.web.app",
  },
  {
    id: "wabi",
    name: "WABI",
    tagline: "AI Detector to know what's real",
    description:
      "WABI is a forensic-grade AI content detector. Drop in text, image, or audio — get a calm, evidence-backed verdict on what's human and what's generated.",
    gradient: "linear-gradient(135deg, #6d28d9 0%, #db2777 100%)",
    glowColor: "rgba(168,85,247,0.35)",
    status: "Building",
  },
  {
    id: "g-card",
    name: "G-Card",
    tagline: "The Future of Gifting",
    description:
      "G-Card makes gifting feel personal again. One tap sends a thoughtful, beautifully designed digital gift — across borders, across apps, across the people you actually care about.",
    gradient: "linear-gradient(135deg, #0e7490 0%, #2563eb 100%)",
    glowColor: "rgba(6,182,212,0.35)",
    status: "Building",
  },
];

/* ──────────────────── Reusable Bits ──────────────────── */

function StatusPill({ label, glow }: { label: string; glow: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]"
      style={{
        borderColor: `${glow.replace(/[\d.]+\)$/g, "0.35)")}`,
        background: `${glow.replace(/[\d.]+\)$/g, "0.08)")}`,
        color: "rgba(255,255,255,0.75)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: glow.replace(/[\d.]+\)$/g, "0.9)"),
          boxShadow: `0 0 10px ${glow}`,
        }}
      />
      {label}
    </span>
  );
}

function ProductVisual({
  product,
  compact = false,
  priority = false,
}: {
  product: Product;
  compact?: boolean;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08]"
        style={{
          // Let the image's own intrinsic ratio drive the height so graphics
          // with extra canvas space (e.g. phone mockups on a flat colour
          // background) aren't clipped to a forced container shape.
          minHeight: compact ? 220 : 280,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${product.glowColor}`,
        }}
      >
        <img
          src={product.image}
          alt={
            product.name === "InSynk"
              ? "InSynk product mockup — AI-powered ERP and job tracking software by WEBBED Labs"
              : product.name === "GRABBO"
                ? "GRABBO product mockup — on-demand rental marketplace platform by WEBBED Labs"
                : `${product.name} — ${product.tagline}, a product by WEBBED Labs`
          }
          // object-contain keeps the full image visible without cropping,
          // and we cap the height so a tall PNG doesn't push the row too far.
          className="relative h-auto max-h-[640px] w-full object-contain"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          draggable={false}
        />
        {/* Subtle gloss + vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      </div>
    );
  }
  // Generative fallback for products without an image.
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08]"
      style={{
        aspectRatio: compact ? "16 / 10" : "5 / 4",
        background: product.gradient,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${product.glowColor}`,
      }}
    >
      {/* Decorative internal pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 50%, rgba(0,0,0,0.30) 100%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="select-none font-bold text-white/90"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: compact ? "clamp(2.5rem, 6vw, 4.5rem)" : "clamp(4rem, 9vw, 7rem)",
            letterSpacing: "-0.04em",
            textShadow: "0 6px 30px rgba(0,0,0,0.4)",
          }}
        >
          {product.name}
        </span>
      </div>
    </div>
  );
}

function OpenButton({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleEnter = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translateY(-2px)";
  };
  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translateY(0)";
  };
  const handleDown = () => {
    if (!ref.current) return;
    ref.current.style.transform = "scale(0.97)";
  };
  const handleUp = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translateY(0)";
  };
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-neutral-100"
      style={{ boxShadow: "0 14px 40px rgba(255,255,255,0.18)", transition: "transform 0.2s ease" }}
    >
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/* ──────────────────── ZigZag Row ──────────────────── */

function ProductRow({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const imgRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
  });
  const textRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.17 },
  });
  return (
    <section className="relative w-full">
      <div
        className={[
          "mx-auto grid w-full max-w-[1200px] items-center gap-8 px-6 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16",
        ].join(" ")}
      >
        {/* Image */}
        <div
          ref={imgRef}
          className={["min-w-0", reverse ? "lg:order-2" : "lg:order-1"].join(" ")}
        >
          <ProductVisual product={product} priority={index < 2} />
        </div>

        {/* Text */}
        <div
          ref={textRef}
          className={[
            "flex min-w-0 flex-col items-start gap-5",
            reverse ? "lg:order-1 lg:items-start" : "lg:order-2",
          ].join(" ")}
        >
          <StatusPill label={product.status} glow={product.glowColor} />

          <h2
            className="text-[clamp(2.25rem,5.4vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </h2>
          <p
            className="text-[15px] font-semibold uppercase tracking-[0.18em] text-white/55"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.tagline}
          </p>
          <p className="max-w-[480px] text-[16px] leading-[1.75] text-white/65">
            {product.description}
          </p>

          {product.ctaHref ? (
            <div className="mt-3 flex items-center gap-4">
              <OpenButton
                href={product.ctaHref}
                label={`Open ${product.name}`}
              />
              <span className="text-[11px] uppercase tracking-[0.22em] text-white/30">
                {product.name} ↗
              </span>
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: `${product.glowColor.replace(/[\d.]+\)$/g, "0.9)")}`,
                  boxShadow: `0 0 8px ${product.glowColor}`,
                }}
              />
              No live link yet
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Page ──────────────────── */

export default function ProductsPage() {
  const heroEyebrowRef = useAnimate<HTMLParagraphElement>({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  });
  const heroHeadingRef = useAnimate<HTMLHeadingElement>({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
  });
  const heroLeadRef = useAnimate<HTMLParagraphElement>({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  });
  const heroStatsRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  });
  const heroScrollRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay: 0.6 },
  });

  useEffect(() => {
    document.title = "PRODUCTS | WEBBED";
    const cleanup = injectMeta([
      { name: "description", content: "Discover Products by WEBBED Labs — original software built inside WEBBED Labs including InSynk, AIDA, GRABBO, and more. Live and emerging products crafted for what's next." },
      { name: "keywords", content: "WEBBED Products, WEBBED Labs, InSynk, AIDA, GRABBO, software products, digital products" },
      { property: "og:title", content: "PRODUCTS | WEBBED" },
      { property: "og:description", content: "Discover Products by WEBBED Labs — original software including InSynk, AIDA, GRABBO, and more." },
      { property: "og:url", content: "https://webbed.in/products" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:title", content: "PRODUCTS | WEBBED" },
      { name: "twitter:description", content: "Discover Products by WEBBED Labs — original software including InSynk, AIDA, GRABBO, and more." },
    ]);
    return () => cleanup();
  }, []);

  // Keep scroll-reveal triggers at the correct positions. Product images can
  // change the layout height once they load, which would otherwise shift
  // ScrollTrigger start points and cause mid-scroll jumps. Refresh after they
  // (and the rest of the page) have loaded so reveals fire smoothly.
  useEffect(() => {
    ensureScrollTrigger();
    const refresh = () => ScrollTrigger.refresh();
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      <main className="relative">
        {/* ── Cinematic Hero ── */}
        <section className="relative w-full overflow-hidden">
          {/* Ambient backdrop */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-[20%] left-1/2 h-[60vh] w-[60vw] -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, rgba(30,27,75,0.08) 35%, transparent 70%)",
                filter: "blur(120px)",
              }}
            />
            <div
              className="absolute -bottom-[30%] right-[-10%] h-[50vh] w-[50vw] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(244,63,94,0.10) 0%, transparent 70%)",
                filter: "blur(120px)",
              }}
            />
            {/* Faint grid */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
                maskImage:
                  "radial-gradient(ellipse 60% 50% at center, black 30%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 50% at center, black 30%, transparent 75%)",
              }}
            />
          </div>

          <div className="relative mx-auto flex min-h-[80vh] max-w-[1320px] flex-col items-center justify-center px-6 py-32 text-center sm:px-10 lg:px-16 lg:py-44">
            <p
              ref={heroEyebrowRef}
              className="mb-6 text-[11px] font-bold uppercase tracking-[0.35em] text-white/35"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              WEBBED Products
            </p>

            <h1
              ref={heroHeadingRef}
              className="max-w-[1000px] text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Products by WEBBED.
            </h1>

            <p
              ref={heroLeadRef}
              className="mt-7 max-w-[640px] text-[17px] leading-[1.7] text-white/55"
            >
              Original software built inside WEBBED Labs. Six live and emerging
              products — engineered to solve real problems with clarity, craft,
              and intention.
            </p>

            <div
              ref={heroStatsRef}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                2 Live
              </span>
              <span className="hidden h-3 w-px bg-white/10 sm:block" />
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-indigo-400/80 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
                4 Building
              </span>
              <span className="hidden h-3 w-px bg-white/10 sm:block" />
              <span>0 Quietly</span>
            </div>

            <div
              ref={heroScrollRef}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.5em] text-white/25"
            >
              ↓ Scroll
            </div>
          </div>
        </section>

        {/* ── ZigZag Product List ── */}
        <div className="relative pb-20">
          {/* Vertical thread line connecting the products */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden -translate-x-1/2 lg:block"
            style={{
              width: 1,
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.10) 8%, rgba(255,255,255,0.10) 92%, transparent)",
            }}
          />
          <div className="flex flex-col gap-24 py-12 sm:gap-32 lg:gap-40">
            {PRODUCTS.map((p, i) => (
              <ProductRow key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Closing CTA ── */}
        <section className="relative w-full overflow-hidden border-t border-white/[0.06] py-28">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(99,102,241,0.12) 0%, transparent 70%)",
                filter: "blur(120px)",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-[820px] px-6 text-center sm:px-10">
            <p
              className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-white/35"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              FROM THE LAB
            </p>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More is shipping. Stay close.
            </h2>
            <p className="mx-auto mt-6 max-w-[520px] text-[16px] leading-[1.75] text-white/55">
              New products, early access, and behind-the-scenes builds drop
              first to the WEBBED Labs community.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
<a
             href="https://www.instagram.com/webbed_labs/"
             target="_blank"
             rel="noopener noreferrer"
             className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:brightness-110 active:scale-95"
             style={{
               background:
                 "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
               boxShadow: "0 14px 40px rgba(220,39,67,0.25)",
             }}
           >
             Follow WEBBED Labs
             <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
           </a>
              <a
                href="/labs"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
              >
                Back to Labs
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <CinematicFooter />
    </div>
  );
}
