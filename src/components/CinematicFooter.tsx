"use client";

import { ensureScrollTrigger, useInView } from "@/lib/motion";
import { writeSubscription } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import SuccessModal from "./SuccessModal";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6.5 9.2V20.5" />
      <circle cx="6.5" cy="5.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M11 20.5V9.2M11 12.8c0-2 1.5-3.8 4-3.8 2.5 0 4 1.8 4 4.8v6.7" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.654l-5.207-6.807-5.994 6.807H2.424l7.723-8.835L1.899 2.25h6.822l4.822 6.375 5.975-6.375zM17.002 20.331h1.829L6.822 4.156H4.885l12.117 16.175z" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.547 2.916 1.186.092-.923.349-1.548.635-1.905-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export default function CinematicFooter() {
  const [inViewRef, isInView] = useInView<HTMLDivElement>({ once: true, amount: 0.15 });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      await writeSubscription(email);
      setEmail("");
      setStatus("success");
      setShowSuccessModal(true);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Per-letter keyframe paths for the WEBBED bounce-in (animated via GSAP when
  // the section enters the viewport).
  const letters = useMemo(
    () => [
      {
        char: "W",
        from: { opacity: 0, x: 0, y: -300, scaleX: 0.7, scaleY: 1.4, rotation: 0 },
        to: {
          keyframes: {
            y: [-300, 0, -45, 0, -15, 0],
            scaleX: [0.7, 1.4, 0.8, 1.15, 0.95, 1],
            scaleY: [1.4, 0.6, 1.25, 0.85, 1.05, 1],
            rotation: [0, -8, 5, -2, 0],
          },
          opacity: 1,
          x: 0,
        },
        duration: 0.7,
        delay: 0.9,
      },
      {
        char: "E",
        from: { opacity: 0, x: -400, y: 0, scaleX: 1.3, scaleY: 0.7, rotation: -15 },
        to: {
          keyframes: {
            x: [-400, 25, -10, 5, 0],
            y: [0, -60, 0, -20, 0],
            scaleX: [1.3, 0.7, 1.25, 0.9, 1.05, 1],
            scaleY: [0.7, 1.3, 0.75, 1.1, 0.95, 1],
            rotation: [-15, 10, -5, 2, 0],
          },
          opacity: 1,
        },
        duration: 0.8,
        delay: 0.3,
      },
      {
        char: "B",
        from: { opacity: 0, x: 0, y: 0, scale: 0.3 },
        to: {
          keyframes: { scale: [0.3, 1.35, 0.85, 1.05, 1] },
          opacity: 1,
          x: 0,
          y: 0,
        },
        duration: 0.6,
        delay: 0.0,
      },
      {
        char: "B",
        from: { opacity: 0, x: 0, y: 0, scale: 0.3 },
        to: {
          keyframes: { scale: [0.3, 1.35, 0.85, 1.05, 1] },
          opacity: 1,
          x: 0,
          y: 0,
        },
        duration: 0.6,
        delay: 0.0,
      },
      {
        char: "E",
        from: { opacity: 0, x: 400, y: 0, scaleX: 1.3, scaleY: 0.7, rotation: 15 },
        to: {
          keyframes: {
            x: [400, -25, 10, -5, 0],
            y: [0, -60, 0, -20, 0],
            scaleX: [1.3, 0.7, 1.25, 0.9, 1.05, 1],
            scaleY: [0.7, 1.3, 0.75, 1.1, 0.95, 1],
            rotation: [15, -10, 5, -2, 0],
          },
          opacity: 1,
        },
        duration: 0.8,
        delay: 0.6,
      },
      {
        char: "D",
        from: { opacity: 0, x: 0, y: 300, scaleX: 0.8, scaleY: 1.3, rotation: 0 },
        to: {
          keyframes: {
            y: [300, -80, 20, -15, 5, 0],
            scaleX: [0.8, 1.3, 0.8, 1.15, 0.95, 1],
            scaleY: [1.3, 0.7, 1.25, 0.85, 1.05, 1],
            rotation: [0, 12, -6, 3, 0],
          },
          opacity: 1,
          x: 0,
        },
        duration: 0.8,
        delay: 1.2,
      },
    ],
    [],
  );

  // Play WEBBED letter keyframes when the footer scrolls into view.
  useEffect(() => {
    if (!isInView) return;
    let cancelled = false;
    const tweens: gsap.core.Tween[] = [];
    import("gsap").then(({ default: gsap }) => {
      if (cancelled || !inViewRef.current) return;
      const targets = Array.from(
        inViewRef.current.querySelectorAll<HTMLElement>(".footer-letter"),
      );
      targets.forEach((el, i) => {
        const def = letters[i];
        if (!def) return;
        gsap.set(el, def.from as gsap.TweenVars);
        tweens.push(
          gsap.to(el, {
            ...def.to,
            duration: def.duration,
            delay: def.delay,
            ease: "power3.out",
          }),
        );
      });
    });
    return () => {
      cancelled = true;
      tweens.forEach((t) => t.kill());
    };
  }, [isInView, letters]);

  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 h-[120px] section-fade-top-dark" aria-hidden />

      <div className="pointer-events-none absolute top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_70%)] opacity-40 blur-3xl animate-glow-pulse z-10"></div>
      <div className="pointer-events-none absolute top-0 right-0 w-[250px] h-full bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent)] opacity-30 blur-xl animate-beam-swing z-10"></div>

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10 sm:pt-24 lg:pt-28">
        <FooterRevealHeading>
          <h2 className="text-center text-[clamp(2rem,1.5rem+1.8vw,3.1rem)] font-semibold tracking-[-0.03em] [font-family:var(--font-heading)]">
            BUILT FOR WHAT&apos;S NEXT
          </h2>
        </FooterRevealHeading>

        <p className="mt-6 pointer-events-none select-none text-center text-[clamp(2.5rem,12vw,15rem)] font-semibold leading-[0.9] tracking-[-0.03em] [font-family:var(--font-heading)] sm:mt-8">
          <span ref={inViewRef} className="inline-flex justify-center space-x-1">
            {letters.map((letter, index) => (
              <span
                key={index}
                className="footer-letter inline-block"
                style={{
                  transformOrigin: "bottom center",
                  background: "linear-gradient(to bottom, #ffffff 20%, #8c8c8c 55%, transparent 95%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {letter.char}
              </span>
            ))}
          </span>
        </p>

        <div className="relative mt-12 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-lg sm:mt-14 sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:gap-8">
            <FooterRevealColumn delay={0}>
              <div className="space-y-6 flex flex-col items-center text-center sm:items-start sm:text-left">
                <img src="/logo.png" alt="WEBBED — technology company logo building AI software, websites, and digital products" className="h-[32px] w-auto object-contain sm:h-[45px]" />
                <div className="flex items-center gap-3 text-white/80 sm:gap-4">
                  <Link href="https://www.instagram.com/webbed_official" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-white/15 p-2.5 transition hover:border-white/35 hover:bg-white/10 hover:text-white">
                    <IconInstagram />
                  </Link>
                  <Link href="https://www.linkedin.com/company/webbed-official/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full border border-white/15 p-2.5 transition hover:border-white/35 hover:bg-white/10 hover:text-white">
                    <IconLinkedIn />
                  </Link>
                  <Link href="https://x.com/Webbed_Official" target="_blank" rel="noopener noreferrer" aria-label="X" className="rounded-full border border-white/15 p-2.5 transition hover:border-white/35 hover:bg-white/10 hover:text-white">
                    <IconX />
                  </Link>
                  <Link href="https://github.com/webbed-labs" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full border border-white/15 p-2.5 transition hover:border-white/35 hover:bg-white/10 hover:text-white">
                    <IconGithub />
                  </Link>
                </div>
              </div>
            </FooterRevealColumn>

            <FooterRevealColumn delay={0.05}>
              <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-white/65 [font-family:var(--font-ui)]">
                  ECOSYSTEM
                </h3>
                <nav className="space-y-2.5 text-white/82 [font-family:var(--font-body)]">
                  <Link href="/labs" className="block transition hover:text-white">WEBBED Labs</Link>
                  <Link href="/solutions" className="block transition hover:text-white">WEBBED Solutions</Link>
                  <Link href="/schools" className="block transition hover:text-white">WEBBED Schools</Link>
                </nav>
              </div>
            </FooterRevealColumn>

            <FooterRevealColumn delay={0.1}>
              <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-white/65 [font-family:var(--font-ui)]">
                  Company
                </h3>
                <nav className="space-y-2.5 text-white/82 [font-family:var(--font-body)]">
                  <Link href="/about" className="block transition hover:text-white">About WEBBED</Link>
                  <Link href="/blogs" className="block transition hover:text-white">Blogs</Link>
                  <Link href="/contact" className="block transition hover:text-white">Contact Us</Link>
                </nav>
              </div>
            </FooterRevealColumn>

            <FooterRevealColumn delay={0.15} extraClass="sm:col-span-2 lg:col-span-1">
              <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65 [font-family:var(--font-ui)] sm:text-base">
                  STAY AHEAD OF WHAT&apos;S NEXT
                </h3>
                <p className="text-sm text-white/55 [font-family:var(--font-body)]">
                  Get updates on AI, software, innovation, and everything we&apos;re building at WEBBED.
                </p>
                <form onSubmit={handleSubscribe} className="flex w-full max-w-[420px] flex-col gap-2.5 rounded-2xl border border-white/15 bg-white/[0.05] p-2 sm:flex-row sm:items-center sm:gap-0 sm:overflow-hidden sm:rounded-full sm:bg-black/55 sm:p-0 sm:border-white/20">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={status === "success" ? "Subscribed!" : "email@example.com"}
                    className="h-11 w-full flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/35 outline-none sm:h-11 sm:w-auto"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="h-11 w-full rounded-xl border border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.2))] px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_20px_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.24))] [font-family:var(--font-ui)] sm:w-auto sm:min-w-24 sm:h-11 sm:rounded-full disabled:opacity-50"
                  >
                    {status === "loading" ? "..." : status === "success" ? "Done" : "Join"}
                  </button>
                </form>
              </div>
            </FooterRevealColumn>
          </div>
        </div>

        <div className="relative mt-8 border-t border-white/12 pt-8">
          <div className="flex flex-col items-center gap-5 text-center text-white/86 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-sm text-white/55 [font-family:var(--font-body)]">
              {`© ${new Date().getFullYear()} WEBBED. Built for what&apos;s next.`}
            </p>
            <div className="flex items-center gap-8 text-sm text-white/60 [font-family:var(--font-body)]">
              <Link href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="transition hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </footer>
  );
}

function FooterRevealHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!ref.current) return;
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      },
    );
  }, []);
  return <div ref={ref}>{children}</div>;
}

function FooterRevealColumn({
  delay,
  extraClass,
  children,
}: {
  delay?: number;
  extraClass?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!ref.current) return;
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: delay ?? 0,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 90%",
            },
          },
        );
      },
    );
  }, [delay]);
  return <div ref={ref} className={extraClass}>{children}</div>;
}
