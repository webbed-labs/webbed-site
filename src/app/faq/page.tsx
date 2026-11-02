import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import FaqAccordion, { type FaqSection } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "EVERYTHING YOU WANT TO KNOW | WEBBED",
  description:
    "Answers to the most common questions about WEBBED — what we do, who we are, how WEBBED Labs, WEBBED Solutions, and WEBBED Schools work, who we build for, and how to get in touch.",
  keywords: [
    "WEBBED FAQ",
    "who builds AI software",
    "who can build my website",
    "what is WEBBED",
    "what does WEBBED Labs do",
    "WEBBED Solutions",
    "WEBBED Schools",
  ],
  openGraph: {
    title: "Everything You Want to Know | WEBBED",
    description:
      "Answers about WEBBED, WEBBED Labs, WEBBED Solutions, and WEBBED Schools — the technology ecosystem building software, products, and education for the future.",
    url: "https://webbed.in/faq",
    siteName: "WEBBED",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WEBBED — technology company building AI software, websites, and digital products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everything You Want to Know | WEBBED",
    description:
      "Answers about WEBBED, WEBBED Labs, WEBBED Solutions, and WEBBED Schools — the technology ecosystem building software, products, and education for the future.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/faq" },
};

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        q: "What is WEBBED?",
        a: "WEBBED is a technology company built around three divisions: WEBBED Solutions, WEBBED Labs, and WEBBED Schools. Together, they create an ecosystem focused on building software, driving innovation, and sharing knowledge.",
      },
      {
        q: "Why was WEBBED created?",
        a: "We started WEBBED because we believed technology could be built better. Too many companies settled for shortcuts, templates, and average results. We built WEBBED to prove that exceptional standards still matter.",
      },
      {
        q: "What makes WEBBED different?",
        a: "WEBBED is more than a software company. Our ecosystem brings together services, innovation, and education under one brand. Every project we build, every product we create, and every skill we teach strengthens the entire ecosystem.",
      },
      {
        q: "What does \"technology ecosystem\" mean?",
        a: "It means every part of WEBBED works together. WEBBED Solutions builds software for businesses. WEBBED Labs creates new products and explores future technologies. WEBBED Schools helps people learn the skills behind what we build.",
      },
      {
        q: "Is WEBBED an agency?",
        a: "No. While WEBBED Solutions provides software development services, WEBBED itself is a technology company with multiple divisions focused on innovation, products, education, and digital transformation.",
      },
      {
        q: "What industries does WEBBED work with?",
        a: "Technology has no limits, and neither do we. We work with startups, businesses, educational institutions, manufacturers, healthcare providers, retail brands, and organizations across many industries.",
      },
      {
        q: "Where is WEBBED based?",
        a: "WEBBED is based in India and works with clients, partners, and collaborators both locally and internationally.",
      },
      {
        q: "Does WEBBED build its own products?",
        a: "Yes. Through WEBBED Labs, we research, experiment, and develop original software products designed to solve real problems and explore what's possible.",
      },
      {
        q: "What is WEBBED's vision?",
        a: "Our vision is to build a technology ecosystem that creates meaningful software, drives innovation, and empowers people through technology. We aim to become one of the companies shaping the future of digital experiences.",
      },
      {
        q: "Who is WEBBED for?",
        a: "WEBBED is for everyone looking to grow through technology, innovators building the next big idea, and learners who want practical skills for the future.",
      },
      {
        q: "What does WEBBED believe in?",
        a: "We believe great software starts with high standards. We value craftsmanship, curiosity, honesty, continuous learning, and building technology that creates lasting impact.",
      },
      {
        q: "Why the name WEBBED?",
        a: "WEBBED represents connection. Ideas, people, technology, and innovation are strongest when they work together. That's exactly how our ecosystem is built. Every division supports the others, creating something greater than any one part could achieve alone.",
      },
      {
        q: "What is WEBBED building for?",
        a: "We're not building for what's popular today. We're building for what matters tomorrow. Whether it's software for a business, a product from our Labs, or knowledge shared through our Schools, everything we create is designed with the future in mind.",
      },
    ],
  },
  {
    id: "labs",
    label: "WEBBED Labs",
    items: [
      {
        q: "What is WEBBED Labs?",
        a: "WEBBED Labs is the research and innovation division of WEBBED. It's where we explore new technologies, experiment with ideas, and build software products for the future.",
      },
      {
        q: "Does WEBBED Labs build products for clients?",
        a: "No. WEBBED Labs focuses on creating original products and technologies developed by our team. Client projects are handled by WEBBED Solutions.",
      },
      {
        q: "What kind of products does WEBBED Labs build?",
        a: "We work on software, AI applications, productivity tools, automation platforms, and other technology products designed to solve meaningful problems.",
      },
      {
        q: "Why does WEBBED have a Labs division?",
        a: "We believe innovation should be continuous. Labs gives us the freedom to experiment, learn, and create products that go beyond traditional client work.",
      },
      {
        q: "Can I collaborate with WEBBED Labs?",
        a: "Yes. If you're a researcher, creator, startup, or organization with an exciting idea, we'd love to hear from you.",
      },
      {
        q: "Are products from WEBBED Labs available to everyone?",
        a: "Some products are publicly available, while others may still be in research, testing, or early development.",
      },
    ],
  },
  {
    id: "solutions",
    label: "WEBBED Solutions",
    items: [
      {
        q: "What services does WEBBED Solutions offer?",
        a: "We build websites, web applications, mobile apps, AI solutions, custom software, automation systems, UI/UX design, branding, and digital platforms tailored to your business.",
      },
      {
        q: "Do you build custom software?",
        a: "Yes. Every solution is built specifically around your requirements instead of using generic templates.",
      },
      {
        q: "Can you redesign my existing website?",
        a: "Absolutely. Whether you need a visual refresh or a complete rebuild, we can help create a faster, more modern experience.",
      },
      {
        q: "Do you build AI applications?",
        a: "Yes. We develop AI-powered tools, intelligent automation systems, AI agents, chatbots, and custom AI solutions based on your business needs.",
      },
      {
        q: "How long does a project take?",
        a: "It depends on the size and complexity of the project. After understanding your requirements, we'll provide a clear timeline before development begins.",
      },
      {
        q: "Do you provide support after launch?",
        a: "Yes. We offer ongoing maintenance, updates, improvements, and technical support to help your software continue performing at its best.",
      },
      {
        q: "Can you help if I only have an idea?",
        a: "Definitely. Many successful projects start with just an idea. We can help you plan, design, develop, and launch it.",
      },
    ],
  },
  {
    id: "schools",
    label: "WEBBED Schools",
    items: [
      {
        q: "What is WEBBED Schools?",
        a: "WEBBED Schools is the education division of WEBBED. We help students, professionals, and organizations learn practical technology skills through workshops, training, and real-world learning.",
      },
      {
        q: "Who can join WEBBED Schools?",
        a: "Anyone who wants to learn. Whether you're a student, beginner, developer, entrepreneur, or working professional, there's something for you.",
      },
      {
        q: "What topics do you teach?",
        a: "Our programs cover software development, artificial intelligence, web technologies, mobile app development, UI/UX design, product thinking, and other future-ready skills.",
      },
      {
        q: "Are the sessions practical?",
        a: "Yes. We focus on hands-on learning, real projects, and practical experience instead of only theory.",
      },
      {
        q: "Do you conduct workshops for colleges and companies?",
        a: "Yes. We regularly work with educational institutions and organizations to deliver customized workshops, seminars, and training programs.",
      },
      {
        q: "Can I learn even if I have no experience?",
        a: "Absolutely. Many of our programs are designed for beginners, while others are suitable for learners with previous experience.",
      },
    ],
  },
];

// FAQPage structured data — surfaces rich results for queries like
// "Who builds AI software?", "What is WEBBED?", "What does WEBBED Labs do?".
function buildFaqJsonLd() {
  const all = FAQ_SECTIONS.flatMap((section) =>
    section.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  );
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all,
  };
}

export default function FaqPage() {
  const jsonLd = buildFaqJsonLd();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          {/* Soft glow + technical grid backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, black 10%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, black 10%, transparent 80%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(99,102,241,0.16), rgba(99,102,241,0) 65%)",
              filter: "blur(28px)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(236,72,153,0.10), rgba(236,72,153,0) 65%)",
              filter: "blur(28px)",
            }}
          />

          <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:px-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 [font-family:var(--font-ui)]">
              FAQ &middot; WEBBED
            </p>

            <h1 className="mt-6 text-[clamp(2.4rem,1.6rem+3.4vw,5rem)] font-semibold leading-[0.98] tracking-[-0.025em] text-white [font-family:var(--font-heading)]">
              Everything You Want to Know
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                {" "}
                about WEBBED.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[16px] leading-[1.7] text-white/65 [font-family:var(--font-body)]">
              Whether you&apos;re asking <span className="text-white/85">&ldquo;Who builds AI software?&rdquo;</span>,
              {" "}<span className="text-white/85">&ldquo;What is WEBBED?&rdquo;</span>, or
              {" "}<span className="text-white/85">&ldquo;What does WEBBED Labs do?&rdquo;</span> — the answers are below.
              Organized by division so you can find what you need fast.
            </p>

            {/* Quick-jump anchors */}
            <nav
              aria-label="FAQ sections"
              className="mt-10 flex flex-wrap gap-2.5"
            >
              {FAQ_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[12px] font-medium tracking-wide text-white/80 backdrop-blur-md transition-all duration-200 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-300 to-fuchsia-300"
                  />
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* FAQ body */}
        <section className="relative">
          <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 lg:px-10">
            <FaqAccordion sections={FAQ_SECTIONS} />

            {/* Got more questions? CTA */}
            <div className="mt-24 sm:mt-28">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-8 backdrop-blur-md sm:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(99,102,241,0.18), rgba(99,102,241,0) 65%)",
                    filter: "blur(30px)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-16 h-[300px] w-[300px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(236,72,153,0.14), rgba(236,72,153,0) 65%)",
                    filter: "blur(30px)",
                  }}
                />

                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 [font-family:var(--font-ui)]">
                    Still curious?
                  </p>
                  <h3 className="mt-4 text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white [font-family:var(--font-heading)]">
                    Got more questions?
                  </h3>
                  <p className="mt-4 max-w-xl text-[15.5px] leading-[1.7] text-white/65 [font-family:var(--font-body)]">
                    Tell us what you&apos;re building, exploring, or learning. We&apos;ll
                    point you to the right people inside WEBBED — no runaround.
                  </p>

                  <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-black shadow-[0_18px_50px_rgba(255,255,255,0.18)] transition-all duration-200 hover:brightness-95 active:scale-[0.99] [font-family:var(--font-ui)]"
                    >
                      Contact WEBBED
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 text-[14px] font-medium text-white/85 transition-all duration-200 hover:border-white/40 hover:bg-white/[0.08] hover:text-white [font-family:var(--font-ui)]"
                    >
                      Learn more about us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CinematicFooter />

      {/* Structured data for SEO — surfaces FAQ rich results on Google */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
