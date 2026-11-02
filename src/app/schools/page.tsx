"use client";

import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import { useAnimate, useReveal } from "@/lib/motion";
import { useEffect, useMemo, useRef, useState } from "react";
import SuccessModal from "@/components/SuccessModal";
import Toast from "@/components/util/Toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Firebase is lazy-loaded only when the user submits the join-courses form.
async function writeCourseUpdate(payload: { name: string; email: string; course: string }) {
  const [{ db }, firestore] = await Promise.all([
    import("@/lib/firebase"),
    import("firebase/firestore"),
  ]);
  await firestore.addDoc(firestore.collection(db, "course_updates"), {
    ...payload,
    timestamp: firestore.serverTimestamp(),
  });
}

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

const transitionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const WordReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-[0.1em]">
          <RevealWord delay={delay} index={i}>{word}</RevealWord>
        </span>
      ))}
    </span>
  );
};

function RevealWord({ delay, index, children }: { delay: number; index: number; children: React.ReactNode }) {
  const ref = useAnimate<HTMLSpanElement>({
    initial: { opacity: 0, yPercent: 100 },
    animate: { opacity: 1, yPercent: 0 },
    transition: { duration: 0.8, delay: delay + index * 0.04, ease: transitionEase as unknown as number[] },
  });
  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}

function JoinCoursesModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rendered, setRendered] = useState(open);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Play exit before unmount
  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    if (!rendered) return;
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) {
      setRendered(false);
      return;
    }
    let cancelled = false;
    import("gsap").then(({ default: gsap }) => {
      const tl = gsap.timeline({ onComplete: () => { if (!cancelled) setRendered(false); } });
      tl.to(card, { opacity: 0, scale: 0.92, y: 20, duration: 0.3, ease: "power2.in" }, 0);
      tl.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
    });
    return () => {
      cancelled = true;
    };
  }, [open, rendered]);

  // Enter animation
  useEffect(() => {
    if (!open || !rendered) return;
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;
    import("gsap").then(({ default: gsap }) => {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    });
  }, [open, rendered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      await writeCourseUpdate({ name, email, course });
      setName("");
      setEmail("");
      setCourse("");
      setStatus("success");
      onSuccess();
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Course subscription error:", error);
      setStatus("error");
    }
  };

  if (!rendered) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div
        ref={cardRef}
        style={{ opacity: 0 }}
        className="relative w-full max-w-[440px] rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors text-xl leading-none">&times;</button>

        <div className="flex flex-col items-center text-center">
          <img src="/logo.png" alt="WEBBED — technology company logo building AI software, websites, and digital products" className="h-8 w-auto mb-6" />

          <h3 className="text-2xl font-bold text-white [font-family:var(--font-heading)] leading-tight">
            New Courses Dropping Soon!
          </h3>
          <p className="mt-2 text-sm text-white/55 [font-family:var(--font-body)]">
            Join us and be the first to know when they launch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-2 pt-5 border-b border-white/20 focus:border-white transition-colors text-sm"
              id="jm-name"
            />
            <label htmlFor="jm-name" className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-white/45 pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:-translate-y-0 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-0">
              Name
            </label>
          </div>

          <div className="relative">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              type="email"
              className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-2 pt-5 border-b border-white/20 focus:border-white transition-colors text-sm"
              id="jm-email"
            />
            <label htmlFor="jm-email" className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-white/45 pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:-translate-y-0 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-0">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-2 pt-5 border-b border-white/20 focus:border-white transition-colors text-sm"
              id="jm-course"
            />
            <label htmlFor="jm-course" className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-white/45 pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:-translate-y-0 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-0">
              What course are you looking for?
            </label>
          </div>

          {status === "error" && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              Something went wrong. Please try again.
            </div>
          )}
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full h-11 rounded-full bg-white text-black text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.99] mt-2 disabled:opacity-70"
          >
            {status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : status === "success" ? "Thank You!" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SchoolsPage() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });

  const testimonials = useMemo(
    () => [
      {
        company: "WEBBED Schools",
        quote:
          "WEBBED provided students with valuable exposure to real-world problems while strengthening their technical skills through practical learning. The internship offered hands-on experience with industry tools, real applications, and collaborative platforms like GitHub. It was an excellent initiative that encouraged learning and recognized students for their achievements.",
        name: "Dr. P. Suganya",
        title: "HoD, Dept. of Computer Science",
        program: "DG Vaishnav College",
        theme: "light" as const,
      },
      {
        company: "WEBBED Schools",
        quote:
          "It was a pleasure to witness the Webbed team deliver such an engaging and thought provoking session for our first year students. Their confidence, clarity and practical insights made the session highly engaging and impactful. It is inspiring to see young innovators sharing their experiences with such passion and purpose. Wishing the entire team continued success and many more milestones ahead.",
        name: "Ms. Poojitha Shree",
        title: "Professor, Dept. of Computer Science",
        program: "DG Vaishnav College",
        theme: "dark" as const,
      },
      {
        company: "WEBBED Schools",
        quote:
          "WEBBED Schools transformed the way I approach software development, from planning and UI/UX to AI, GitHub, Firebase, and deployment. The hands-on learning, real-world projects, and career guidance helped me grow from a learner into a confident builder. It was an inspiring experience that strengthened both my technical skills and problem-solving mindset.",
        name: "Ramya S",
        title: "Student",
        program: "DG Vaishnav College",
        theme: "light" as const,
      },
      {
        company: "WEBBED Schools",
        quote:
          "I initially joined the WEBBED Schools for the certificate, but it turned out to be a great learning experience. I gained hands-on exposure to Figma, Firebase, Github, AI tools, and Prompt Engineering, which completely changed the way I use AI. The practical sessions significantly improved my technical skills and confidence in software development.",
        name: "Sarathi M",
        title: "Student",
        program: "DG Vaishnav College",
        theme: "dark" as const,
      },
      {
        company: "WEBBED Schools",
        quote:
          "The WEBBED Schools gave me a strong foundation in UI/UX, Prompt Engineering, AI tools, and other essential tech skills. The sessions were practical, engaging, and helped me build confidence, especially in using AI effectively and creating a professional resume. It was a valuable learning experience, and I truly enjoyed being part of it.",
        name: "Shyam V",
        title: "Student",
        program: "DG Vaishnav College",
        theme: "light" as const,
      },
    ],
    [],
  );

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialTouchStartXRef = useRef<number | null>(null);

  const showPreviousTestimonial = () => {
    setTestimonialIdx((index) =>
      index === 0 ? testimonials.length - 1 : index - 1,
    );
  };

  const showNextTestimonial = () => {
    setTestimonialIdx((index) => (index + 1) % testimonials.length);
  };

  const glowRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.2, ease: transitionEase as unknown as number[] },
  });
  const eyebrowRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: transitionEase as unknown as number[] },
  });
  const sublineRef = useAnimate<HTMLParagraphElement>({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.05, ease: transitionEase as unknown as number[], delay: 0.75 },
  });
  const buttonsRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.05, ease: transitionEase as unknown as number[], delay: 1 },
  });
  const panelRef = useAnimate<HTMLDivElement>({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: transitionEase as unknown as number[], delay: 0.2 },
  });
  const progressRef = useAnimate<HTMLDivElement>({
    initial: { width: "0%" },
    animate: { width: "64%" },
    transition: { duration: 1.2, delay: 0.45, ease: transitionEase as unknown as number[] },
  });
  const aboutLeftRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.2, ease: transitionEase as unknown as number[] },
  });
  const aboutRightRef = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.2, ease: transitionEase as unknown as number[], delay: 0.15 },
  });

  useEffect(() => {
    document.title = "SCHOOLS | WEBBED";
    const cleanup = injectMeta([
      { name: "description", content: "WEBBED Schools offers practical technology education — web foundations, AI, and product engineering programs designed to shape the next generation of builders." },
      { name: "keywords", content: "WEBBED Schools, technology education, coding, AI, web development, product engineering, learning" },
      { property: "og:title", content: "SCHOOLS | WEBBED" },
      { property: "og:description", content: "WEBBED Schools offers practical technology education — web foundations, AI, and product engineering programs." },
      { property: "og:url", content: "https://webbed.in/schools" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:title", content: "SCHOOLS | WEBBED" },
      { name: "twitter:description", content: "WEBBED Schools offers practical technology education — web foundations, AI, and product engineering programs." },
    ]);
    const interval = window.setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 5500);

    return () => {
      window.clearInterval(interval);
      cleanup();
    };
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative h-screen overflow-hidden bg-black">
        {/* Warm education glow (lower-right quadrant) */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            ref={glowRef}
            className="absolute -right-[15%] -bottom-[18%] w-[62vw] h-[62vw] rounded-full opacity-[0.2] bg-[radial-gradient(circle_at_center,rgba(245,158,11,1)_0%,rgba(245,158,11,0.5)_25%,transparent_70%)] blur-[90px]"
          />
        </div>

        <div className="relative z-10 mx-auto h-full w-full max-w-[1400px] px-6 sm:px-10 lg:px-20 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            {/* LEFT: content anchored left */}
            <div className="flex flex-col items-start">
              <div ref={eyebrowRef} className="mb-8">
                <div className="rounded-full border border-white/40 px-5 py-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/85 font-medium">
                    WEBBED SCHOOLS
                  </span>
                </div>
              </div>

              <h1 className="text-[clamp(2rem,10vw,68px)] leading-[1.02] font-bold [font-family:var(--font-heading)] max-w-[720px]">
                <span>
                  <WordReveal text="Learn the skills that build the" delay={0.15} />
                </span>
                <br />
                <span className="inline-block">
                  <WordReveal text="future." delay={0.45} />
                </span>
              </h1>

              <p
                ref={sublineRef}
                className="mt-8 text-[18px] leading-relaxed text-white/55 max-w-[500px]"
              >
                Practical education in software development, AI, web technologies, and digital systems. Built
                for the next generation of builders.
              </p>

              <div
                ref={buttonsRef}
                className="mt-10 flex flex-col sm:flex-row gap-4 items-start"
              >
                <button onClick={() => setShowJoinModal(true)} className="rounded-full bg-white text-black font-semibold text-sm px-8 py-4 transition-all duration-200 hover:brightness-95 active:scale-[0.99]">
                  Join Courses
                </button>
                <a href="/contact" className="rounded-full border border-white/50 bg-transparent text-white font-semibold text-sm px-8 py-4 transition-all duration-200 hover:bg-white/5 active:scale-[0.99] inline-flex items-center justify-center">
                  Learn More
                </a>
              </div>

              <div className="hidden [@media(min-height:760px)]:block absolute left-6 sm:left-10 lg:left-20 bottom-8 z-10">
                <p className="text-[11px] tracking-[0.22em] uppercase text-white/60 font-semibold">
                  BEGINNER FRIENDLY &middot; INDUSTRY FOCUSED &middot; BUILT BY PRACTITIONERS
                </p>
              </div>
            </div>

            {/* RIGHT: rotated dark mock UI/panel */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div ref={panelRef} className="transform">
                <div className="relative -rotate-[15deg]">
                  <div className="w-[420px] bg-[#0a0a0a] border border-white/10 rounded-[20px] shadow-[0_25px_90px_rgba(0,0,0,0.6)] p-7">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-white/60 text-[11px] tracking-[0.25em] uppercase font-semibold">
                          Currently Enrolling
                        </p>
                        <h3 className="mt-3 text-[22px] font-bold text-white leading-tight [font-family:var(--font-heading)]">
                          Webbed Foundations
                        </h3>
                      </div>

                      <div className="h-[10px] w-[10px] rounded-full bg-white/20" />
                    </div>

                    <div className="mt-6">
                      <div className="h-[8px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          ref={progressRef}
                          className="h-full bg-white/20 rounded-full"
                          style={{ width: "0%" }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-[11px] text-white/45">
                        <span>0%</span>
                        <span>64%</span>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full border border-white/10 text-white/70 text-[11px] tracking-[0.06em] font-semibold">
                        Lesson: Layout Systems
                      </span>
                      <span className="px-3 py-1 rounded-full border border-white/10 text-white/70 text-[11px] tracking-[0.06em] font-semibold">
                        Lesson: UI Patterns
                      </span>
                      <span className="px-3 py-1 rounded-full border border-white/10 text-white/70 text-[11px] tracking-[0.06em] font-semibold">
                        Project: Launch Page
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Webbed Schools About Section (split layout) ───────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#03040a] py-24 sm:py-32 lg:py-48">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_30%,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_84%_68%,rgba(139,92,246,0.14),transparent_36%),linear-gradient(135deg,#020308_0%,#070916_52%,#03040a_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 78% 70% at 50% 50%, black 18%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 78% 70% at 50% 50%, black 18%, transparent 78%)",
            }}
          />
          <div className="absolute -left-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-blue-300/10 shadow-[0_0_90px_rgba(59,130,246,0.12)]" />
          <div className="absolute -right-36 top-[18%] h-96 w-96 rounded-full border border-violet-300/10 shadow-[0_0_110px_rgba(139,92,246,0.12)]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row items-start relative">
            <div
              ref={aboutLeftRef}
              className="w-full lg:w-[45%] pr-0 lg:pr-20 mb-16 lg:mb-0"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-semibold mb-8">
                WHY WE TEACH
              </p>

              <h2 className="text-[clamp(2rem,7vw,48px)] font-bold text-white mb-12 [font-family:var(--font-heading)] leading-tight">
                Education that actually prepares you.
              </h2>

              <div className="h-px w-full bg-white/10" />
            </div>

            <div className="hidden lg:block absolute left-[45%] top-0 bottom-0 w-px bg-white/10" />

            <div
              ref={aboutRightRef}
              className="w-full lg:w-[55%] lg:pl-20 space-y-10"
            >
              <p className="text-[17px] text-white/65 font-light leading-[1.8] [font-family:var(--font-body)]">
                Most education teaches theory. We teach what the industry actually uses.
              </p>
              <p className="text-[17px] text-white/65 font-light leading-[1.8] [font-family:var(--font-body)]">
                Every course at Webbed Schools is built around real tools, real workflows, and real outcomes. Not textbooks.
              </p>
              <p className="text-[17px] text-white/65 font-light leading-[1.8] [font-family:var(--font-body)]">
                We built the school we wished existed.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch sm:gap-0">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:pr-6">
                  <div className="text-white font-bold [font-family:var(--font-heading)]">
                    100% Practical
                  </div>
                  <div className="mt-2 text-white/60 text-[12px] leading-relaxed [font-family:var(--font-body)]">
                    Skills you apply immediately
                  </div>
                </div>

                <div className="hidden w-px bg-white/10 sm:block" />

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:px-6 sm:py-0">
                  <div className="text-white font-bold [font-family:var(--font-heading)]">
                    Industry Tools
                  </div>
                  <div className="mt-2 text-white/45 text-[12px] leading-relaxed [font-family:var(--font-body)]">
                    Built on real-world stacks
                  </div>
                </div>

                <div className="hidden w-px bg-white/10 sm:block" />

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:pl-6">
                  <div className="text-white font-bold [font-family:var(--font-heading)]">
                    Built by Builders
                  </div>
                  <div className="mt-2 text-white/45 text-[12px] leading-relaxed [font-family:var(--font-body)]">
                    Taught by practitioners
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (mirrored from the Solutions page) */}
      <section className="w-full bg-white text-black">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="flex h-full flex-col lg:justify-center lg:py-10 lg:pr-8">
              <h2
                className="text-[clamp(1.75rem,8vw,44px)] sm:text-[clamp(2rem,8vw,52px)] font-bold leading-[1.05]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What the Students and Teachers think
              </h2>

              <p className="mt-6 text-[15px] sm:text-[16px] text-black/55 leading-relaxed max-w-[48ch]">
                From first-year students to department heads, here&apos;s what the people who&apos;ve
                learned and taught with WEBBED Schools have to say about the experience.
              </p>

              <div className="mt-8 flex items-center gap-2 sm:mt-10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={showPreviousTestimonial}
                    aria-label="Show previous testimonial"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-white transition hover:bg-neutral-800 active:scale-95"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextTestimonial}
                    aria-label="Show next testimonial"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-white transition hover:bg-neutral-800 active:scale-95"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[20px] border border-black/10"
              onTouchStart={(event) => {
                testimonialTouchStartXRef.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                const startX = testimonialTouchStartXRef.current;
                const endX = event.changedTouches[0]?.clientX;
                testimonialTouchStartXRef.current = null;
                if (startX == null || endX == null) return;
                const distance = endX - startX;
                if (distance > 45) showPreviousTestimonial();
                if (distance < -45) showNextTestimonial();
              }}
            >
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{
                  backgroundColor:
                    testimonials[testimonialIdx]?.theme === "dark" ? "#000000" : "#ffffff",
                }}
              />

              <div className="relative flex min-h-[320px] items-center p-6 sm:min-h-[360px] sm:p-12">
                <div className="w-full">
                  <div
                    key={testimonialIdx}
                    aria-live="polite"
                    style={{ animation: "schoolsTestimonialIn 0.35s ease-out" }}
                  >
                    <div
                      className="flex items-center justify-end"
                      style={{ color: testimonials[testimonialIdx]?.theme === "dark" ? "#fff" : "#000" }}
                    >
                      <div
                        className="max-w-full rounded-full border px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.1em] sm:px-4 sm:text-[12px] sm:tracking-[0.12em]"
                        style={{
                          borderColor:
                            testimonials[testimonialIdx]?.theme === "dark"
                              ? "rgba(255,255,255,0.22)"
                              : "rgba(0,0,0,0.18)",
                          background:
                            testimonials[testimonialIdx]?.theme === "dark"
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.03)",
                        }}
                      >
                        {testimonials[testimonialIdx]?.company}
                      </div>
                    </div>

                    <p
                      className="mt-7 text-[20px] leading-[1.4] italic sm:mt-8 sm:text-[30px] sm:leading-[1.35]"
                      style={{
                        color:
                          testimonials[testimonialIdx]?.theme === "dark" ? "#ffffff" : "#111827",
                      }}
                    >
                      “{testimonials[testimonialIdx]?.quote}”
                    </p>

                    <div className="mt-7 sm:mt-10">
                      <p
                        className="font-bold text-[16px]"
                        style={{
                          color:
                            testimonials[testimonialIdx]?.theme === "dark"
                              ? "#ffffff"
                              : "#111827",
                        }}
                      >
                        {testimonials[testimonialIdx]?.name}
                      </p>
                      <p
                        className="text-[14px]"
                        style={{
                          color:
                            testimonials[testimonialIdx]?.theme === "dark"
                              ? "rgba(255,255,255,0.70)"
                              : "rgba(0,0,0,0.60)",
                        }}
                      >
                        {testimonials[testimonialIdx]?.title}{" "}
                        <span className="font-medium">· {testimonials[testimonialIdx]?.program}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes schoolsTestimonialIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <CinematicFooter />
      <JoinCoursesModal
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={() => {
          setShowSuccessModal(true);
          setToast({ visible: true, message: "You're on the list! We'll notify you when courses launch.", type: "success" });
        }}
      />
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
