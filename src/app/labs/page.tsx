"use client";

import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import LabsHero from "@/components/LabsHero";
import LabsAboutSection from "@/components/LabsAboutSection";
import LabsProductsSlider from "@/components/LabsProductsSlider";
import LabsTimeline from "@/components/LabsTimeline";
import { useEffect, useState, useRef, useCallback } from "react";
import { ensureScrollTrigger } from "@/lib/motion";
import SuccessModal from "@/components/SuccessModal";
import Toast from "@/components/util/Toast";

// Firebase is lazy-loaded only when the user submits the form.
async function writeProductUpdate(email: string) {
  const [{ db }, firestore] = await Promise.all([
    import("@/lib/firebase"),
    import("firebase/firestore"),
  ]);
  await firestore.addDoc(firestore.collection(db, "product_updates"), {
    email,
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

export default function LabsPage() {
  useEffect(() => {
    document.title = "LABS | WEBBED";
    const cleanup = injectMeta([
      { name: "description", content: "Explore WEBBED Labs — an independent product studio building tools, platforms, and intelligence systems for the future. Discover products like InSynk, AIDA, and more." },
      { name: "keywords", content: "WEBBED Labs, product studio, software products, InSynk, AIDA, AI, innovation" },
      { property: "og:title", content: "LABS | WEBBED" },
      { property: "og:description", content: "Explore WEBBED Labs — an independent product studio building tools, platforms, and intelligence systems for the future." },
      { property: "og:url", content: "https://webbed.in/labs" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:title", content: "LABS | WEBBED" },
      { name: "twitter:description", content: "Explore WEBBED Labs — an independent product studio building tools, platforms, and intelligence systems for the future." },
    ]);
    return () => cleanup();
  }, []);

  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(-1);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });

  const handleSubscribe = async () => {
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      await writeProductUpdate(email);
      setEmail("");
      setStatus("success");
      setShowSuccessModal(true);
      setToast({ visible: true, message: "You're now on the list! We'll keep you posted.", type: "success" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Labs subscription error:", error);
      setStatus("error");
      setToast({ visible: true, message: "Something went wrong. Please try again.", type: "error" });
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // ── Scroll-driven node activation ──
  useEffect(() => {
    ensureScrollTrigger();
    const target = sectionRef.current;
    if (!target) return;
    let trigger: any = null;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        trigger = ScrollTrigger.create({
          trigger: target,
          start: "top 80%",
          end: "bottom 20%",
          onUpdate: (self) => {
            const p = self.progress;
            if (p >= 0.90) {
              setActiveTimelineIndex(3);
            } else if (p >= 0.60) {
              setActiveTimelineIndex(2);
            } else if (p >= 0.30) {
              setActiveTimelineIndex(1);
            } else if (p >= 0.10) {
              setActiveTimelineIndex(0);
            } else {
              setActiveTimelineIndex(-1);
            }
          },
        });
      }
    );
    return () => {
      trigger?.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      <main className="relative">
        {/* Webbed Labs Hero */}
        <LabsHero />

        {/* Labs About Section */}
        <LabsAboutSection />

        {/* Labs Products Slider */}
        <LabsProductsSlider />

        {/* Rebuilt Labs Closing Section */}
        <section
          ref={sectionRef}
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: "#050508", paddingTop: 80, paddingBottom: 90 }}
        >
          {/* ── LABS Watermark ── */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
            style={{
              fontSize: "clamp(140px, 18vw, 300px)",
              fontWeight: 900,
              lineHeight: 1,
              color: "rgba(255,255,255,0.035)",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
            }}
          >
            LABS
          </div>

          {/* ── Ambient Glows ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-[15%] right-[30%] w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(99,102,241,0.06) 0%, transparent 65%)",
                filter: "blur(100px)",
                opacity: activeTimelineIndex >= 0 ? 1 : 0,
                transition: "opacity 0.8s ease",
              }}
            />
            <div
              className="absolute top-[40%] right-[25%] w-[350px] h-[350px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(168,85,247,0.05) 0%, transparent 65%)",
                filter: "blur(100px)",
                opacity: activeTimelineIndex >= 1 ? 1 : 0,
                transition: "opacity 0.8s ease",
              }}
            />
            <div
              className="absolute top-[65%] right-[30%] w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(99,102,241,0.06) 0%, transparent 65%)",
                filter: "blur(100px)",
                opacity: activeTimelineIndex >= 2 ? 1 : 0,
                transition: "opacity 0.8s ease",
              }}
            />
          </div>

          <div style={{ marginLeft: "clamp(1rem, 5vw, 80px)", marginRight: "clamp(0.75rem, 3vw, 24px)" }}>
            {/* Part one */}
            <div className="w-full">
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 400,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                WEBBED LABS
              </p>

              <div
                className="labs-closing-grid items-stretch"
                style={{
                  display: "grid",
                  columnGap: 0,
                  width: "100%",
                  alignItems: "stretch",
                }}
              >
                {/* Left */}
                <div className="flex flex-col justify-between pr-4">
                  <h2
                    style={{
                      fontSize: "clamp(32px, 4vw, 48px)",
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      margin: 0,
                      marginBottom: 28,
                      maxWidth: 480,
                    }}
                  >
                    WEBBED Labs is our innovation division. Built to create what the world has not seen yet.
                  </h2>

                  <p
                    style={{
                      fontSize: 16,
                      color: "rgba(255,255,255,0.55)",
                      maxWidth: 440,
                      lineHeight: 1.8,
                      margin: 0,
                    }}
                  >
                    This is where ambitious ideas become products, where experimentation becomes execution, and where future-focused thinking becomes something real.

                    We explore emerging technologies, build original software, and create products designed to reach beyond today's expectations.
                  </p>
                </div>

                {/* Right: Timeline */}
                <div className="relative pl-8 lg:pl-12 flex flex-col justify-between h-full">
                  <LabsTimeline />
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal rule separating part one and two */}
          <div style={{ marginTop: 80, marginBottom: 80, width: "100%", backgroundColor: "rgba(255,255,255,0.08)", height: 1 }} />

          {/* Part two */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 720, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 400,
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                FOLLOW THE BUILD
              </p>

              <h2
                style={{
                  fontSize: "clamp(1.75rem, 8vw, 52px)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                Be first to see what&apos;s next.
              </h2>

              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  marginBottom: 40,
                }}
              >
                New products. Early access. Behind the scenes from the lab.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 12 }} className="flex-col sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={status === "success" ? "Subscribed!" : "Enter your email"}
                    style={{
                      width: "100%",
                      height: 52,
                      borderRadius: 8,
                      padding: "0 20px",
                      fontSize: 15,
                      color: "#fff",
                      background: "rgba(255,255,255,0.04)",
                      border: status === "error" ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.12)",
                      outline: "none",
                      transition: "border-color 200ms ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={status === "loading" || status === "success"}
                    style={{
                      height: 52,
                      padding: "0 28px",
                      borderRadius: 8,
                      border: "none",
                      background: "#fff",
                      color: "#000",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: status === "loading" ? "wait" : "pointer",
                      transition: "background-color 200ms ease",
                      opacity: (status === "loading" || status === "success") ? 0.7 : 1,
                      minWidth: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (status === "idle") e.currentTarget.style.backgroundColor = "rgba(240,240,240,1)";
                    }}
                    onMouseLeave={(e) => {
                      if (status === "idle") e.currentTarget.style.backgroundColor = "#fff";
                    }}
                  >
                    {status === "loading" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </span>
                    ) : status === "success" ? "Done" : "Stay Ahead"}
                  </button>
                </div>
                {status === "error" && (
                  <div style={{ borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", padding: "10px 16px", textAlign: "center", fontSize: 13, color: "rgba(248,113,113,1)" }}>
                    Something went wrong. Please try again.
                  </div>
                )}
              </div>

              <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                NO NOISE. JUST PROGRESS.
              </div>
            </div>
          </div>
        </section>
      </main>

      <CinematicFooter />
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
