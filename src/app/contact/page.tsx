"use client";

import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import { useReveal } from "@/lib/motion";
import Link from "next/link";
import { useState } from "react";

function SocialIcon({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center text-white/60 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

export default function ContactPage() {
  const trust0Ref = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5 },
  });
  const trust1Ref = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, delay: 0.1 },
  });
  const trust2Ref = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, delay: 0.2 },
  });
  const trust3Ref = useReveal<HTMLDivElement>({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, delay: 0.3 },
  });
  const trustRefs = [trust0Ref, trust1Ref, trust2Ref, trust3Ref];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const to = "contact@webbed.in";
    const subject = `New project inquiry from ${name}`;

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      "",
      "Message:",
      message,
    ].filter((line) => line !== null);

    const body = lines.join("\n");

    const mailtoUrl =
      `mailto:${to}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Open the user's default mail client with the form pre-filled.
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Contact page hero (100vh, left-anchored copy + right-side visual) */}
      <section
        className="relative h-[100vh] overflow-hidden bg-black"
        style={{
          background:
            "linear-gradient(99deg, rgba(10, 1, 1, 1) 54%, rgba(52, 7, 82, 1) 100%)",
        }}
      >
        {/* Canvas / base */}
        <div className="absolute inset-0 bg-[linear-gradient(99deg,rgba(10,1,1,1)_54%,rgba(52,7,82,1)_100%)]" />

        {/* Right-side contact visual */}
        <div className="pointer-events-none absolute right-[-6vw] top-1/2 hidden h-[min(72vh,680px)] w-[min(48vw,680px)] -translate-y-1/2 items-center justify-center sm:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_60%)] opacity-70" />
          <img
            src="/contact-users.gif"
            alt="Animated users icon representing conversations and collaboration"
            className="relative h-full w-full object-contain opacity-95 drop-shadow-[0_28px_90px_rgba(255,255,255,0.08)]"
          />
        </div>

        {/* Left content */}
        <div className="relative z-10 h-full px-6 sm:px-10">
          <div className="h-full max-w-7xl mx-auto flex items-center">
            <div className="w-full max-w-[540px]">
              <p className="type-eyebrow text-[11px] tracking-[0.22em] text-white/40 mb-5">
                START A PROJECT
              </p>

              <h1
                className="text-[clamp(2.5rem,8vw,72px)] font-bold leading-[0.95] [font-family:var(--font-heading)] tracking-[-0.02em] text-white"
              >
                Every great product
                <br />
                starts with a conversation.
              </h1>

              <p className="mt-6 text-[16px] text-white/55 max-w-[420px] leading-[1.8]">
                Tell us what you're building. We'll tell you how far it can go.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-between w-[190px] h-[48px] rounded-full bg-white text-black font-ui font-semibold transition-all duration-200 ease-out hover:bg-[rgba(240,240,240,1)] px-[24px] group"
                aria-label="Get in Touch"
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-[4px]"
                  >
                    Get in Touch
                  </span>

                  <span className="contact-hero-arrow inline-flex items-center opacity-0 -translate-x-[6px] transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                    <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>

              <div className="mt-8 flex items-center gap-4 text-[12px] text-white/35">
                <span>Response within 24 hours</span>
                <span aria-hidden="true" className="w-[5px] h-[5px] rounded-full bg-white/35" />
                <span>NDA available on request</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Contact section below hero */}
      <section className="relative z-10 px-6 sm:px-10 pb-20 pt-16" id="contact">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-0 md:gap-0">
            {/* Left column */}
            <div className="px-0 md:pr-14">
              <p className="type-eyebrow text-white/70 tracking-[0.32em] text-[0.72rem] leading-none mb-6">
                GET IN TOUCH
              </p>

              <h2 className="text-[clamp(1.75rem,7vw,40px)] font-bold [font-family:var(--font-heading)] leading-[1.05]">
                Let's start the conversation.
              </h2>
              <p className="mt-4 text-[14px] text-white/50 leading-[1.8] max-w-[480px]">
                Whether you need a website, software platform, AI solution, product strategy, or something entirely new, we'd love to hear about it. Reach out and let's explore what's possible.
              </p>

              <div className="mt-10 border-t border-white/10">
                <div className="py-5 border-b border-white/10 flex items-center justify-between gap-6">
                  <span className="text-[14px] text-white/45">Email</span>
                  <span className="text-[14px] text-white text-right">
                    contact@webbed.in
                  </span>
                </div>

                <div className="py-5 border-b border-white/10 flex items-center justify-between gap-6">
                  <span className="text-[14px] text-white/45">Based in</span>
                  <span className="text-[14px] text-white text-right">
                    Chennai, India
                  </span>
                </div>

                <div className="py-5 flex items-center justify-between gap-6">
                  <span className="text-[14px] text-white/45">Response</span>
                  <span className="text-[14px] text-white text-right">
                    Within 24 hrs
                  </span>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-5">
                <SocialIcon href="https://www.instagram.com/webbed_official" label="Instagram">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.6" cy="6.6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </SocialIcon>

                <SocialIcon href="https://x.com/Webbed_Official" label="X">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.654l-5.207-6.807-5.994 6.807H2.424l7.723-8.835L1.899 2.25h6.822l4.822 6.375 5.975-6.375zM17.002 20.331h1.829L6.822 4.156H4.885l12.117 16.175z" />
                  </svg>
                </SocialIcon>

                <SocialIcon href="https://www.linkedin.com/company/webbed-official/" label="LinkedIn">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6.5 9.2V20.5" />
                    <circle cx="6.5" cy="5.5" r="1.4" fill="currentColor" stroke="none" />
                    <path d="M11 20.5V9.2M11 12.8c0-2 1.5-3.8 4-3.8 2.5 0 4 1.8 4 4.8v6.7" />
                  </svg>
                </SocialIcon>

                <SocialIcon href="https://github.com/webbed-labs" label="GitHub">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.547 2.916 1.186.092-.923.349-1.548.635-1.905-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block border-l border-white/8" />

            {/* Right column */}
            <div className="mt-14 md:mt-0 md:pl-14">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="relative w-full">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-3 pt-6 border-b border-white/20 focus:border-white transition-colors"
                      type="text"
                      id="contact-name"
                      required
                    />
                    <label
                      htmlFor="contact-name"
                      className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-[14px] text-white/55 transition-all duration-200
                                 peer-focus:top-0 peer-focus:left-0 peer-focus:-translate-y-0
                                 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-0 peer-not-placeholder-shown:-translate-y-0"
                    >
                      Name
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative w-full">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-3 pt-6 border-b border-white/20 focus:border-white transition-colors"
                      type="email"
                      id="contact-email"
                      required
                    />
                    <label
                      htmlFor="contact-email"
                      className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-[14px] text-white/55 transition-all duration-200
                                 peer-focus:top-0 peer-focus:left-0 peer-focus:-translate-y-0
                                 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-0 peer-not-placeholder-shown:-translate-y-0"
                    >
                      Email
                    </label>
                  </div>

                  {/* Company (optional) */}
                  <div className="relative w-full sm:col-span-2">
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-3 pt-6 border-b border-white/20 focus:border-white transition-colors"
                      type="text"
                      id="contact-company"
                    />
                    <label
                      htmlFor="contact-company"
                      className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-[14px] text-white/55 transition-all duration-200
                                 peer-focus:top-0 peer-focus:left-0 peer-focus:-translate-y-0
                                 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-0 peer-not-placeholder-shown:-translate-y-0"
                    >
                      Company (optional)
                    </label>
                  </div>
                </div>

                {/* Message textarea */}
                <div className="relative w-full mt-10">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent text-white placeholder-transparent outline-none pb-3 pt-8 border-b border-white/20 focus:border-white transition-colors min-h-[120px] resize-none"
                    id="contact-message"
                    required
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-0 top-3 pointer-events-none text-[14px] text-white/55 transition-all duration-200
                               peer-focus:top-0 peer-focus:left-0 peer-focus:-translate-y-0
                               peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-0 peer-not-placeholder-shown:-translate-y-0"
                  >
                    Message
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-12 w-full h-[52px] bg-white text-black font-ui font-semibold transition-all duration-200 ease-out hover:bg-[rgba(255,255,255,0.9)]"
                >
                  <span className="inline-flex items-center justify-center gap-3 h-full w-full group">
                    <span className="transition-transform duration-200 ease-out group-hover:translate-x-[4px]">
                      Send Message
                    </span>
                    <span className="opacity-0 translate-x-[-2px] transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                      <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </button>
              </form>

              {/* Trust row (full width) */}
              <div className="mt-14 w-full bg-black">
                <div className="mx-auto max-w-7xl px-6 sm:px-10">
                  <div className="flex flex-col sm:flex-row items-stretch text-center">
                    {[
                      { value: "48hr", label: "Avg response time" },
                      { value: "100%", label: "delivered on time" },
                      { value: "NDA", label: "Available on request" },
                      { value: "Global", label: "Clients" },
                    ].map((it, idx) => (
                      <div
                        key={it.value}
                        ref={trustRefs[idx]}
                        className={[
                          "flex-1 py-8",
                          idx < 3 ? "border-r border-white/8" : "",
                        ].join(" ")}
                      >
                        <div className="text-[30px] font-bold text-white leading-none">
                          {it.value}
                        </div>
                        <div className="mt-3 text-[14px] text-white/50">
                          {it.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Graceful exit / closing section */}
      <section className="relative w-full bg-[linear-gradient(180deg,#000_0%,#020617_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 text-center">
          <h2 className="text-[40px] font-bold text-white [font-family:var(--font-heading)] leading-[1.1]">
            Not ready to reach out yet?
          </h2>

          <p className="mt-6 text-[16px] text-white/55 max-w-2xl mx-auto">
            Explore what we build and come back when the time is right.
          </p>

          <div className="mt-10 flex items-center justify-center gap-8">
            <Link
              href="/solutions"
              className="inline-flex items-center text-white/85 hover:text-white transition-colors border-b border-white/15 hover:border-white/70 pb-1"
            >
              Explore Solutions
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/labs"
              className="inline-flex items-center text-white/85 hover:text-white transition-colors border-b border-white/15 hover:border-white/70 pb-1"
            >
              Visit Webbed Labs
            </Link>
          </div>
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
}
