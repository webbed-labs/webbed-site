import Link from "next/link";

/**
 * Home-page FAQ teaser.
 *
 * Goal: convert "I wonder if WEBBED does X" into a click into /faq.
 * The teaser shows four real questions from the FAQ (the exact questions
 * a visitor might Google) as large editorial cards. Each card links to
 * /faq with the answer hash, so the user lands on the right section
 * directly. A final "See all 33 answers" CTA handles the rest.
 *
 * The aesthetic deliberately differs from the rest of the homepage —
 * less "showcase", more "magazine spread" — so it feels like content
 * worth reading, not a duplicate of the FAQ page.
 */
const TEASER_ITEMS: {
  question: string;
  category: "General" | "Labs" | "Solutions" | "Schools";
  answer: string;
  hash: string;
}[] = [
  {
    category: "General",
    question: "What is WEBBED?",
    answer:
      "A technology company built around three divisions — Solutions, Labs, and Schools — that together create an ecosystem focused on building software, driving innovation, and sharing knowledge.",
    hash: "general",
  },
  {
    category: "Labs",
    question: "What does WEBBED Labs do?",
    answer:
      "WEBBED Labs is the research and innovation division of WEBBED — where we explore new technologies, experiment with ideas, and build original software products for the future.",
    hash: "labs",
  },
  {
    category: "Solutions",
    question: "Who can build my website?",
    answer:
      "WEBBED Solutions builds custom websites, web applications, mobile apps, AI solutions, custom software, automation systems, UI/UX design, branding, and digital platforms tailored to your business.",
    hash: "solutions",
  },
  {
    category: "General",
    question: "Who builds AI software?",
    answer:
      "WEBBED does. We develop AI-powered tools, intelligent automation systems, AI agents, chatbots, and custom AI solutions based on your business needs — through WEBBED Labs and WEBBED Solutions.",
    hash: "general",
  },
];

export default function FaqTeaser() {
  return (
    <section
      id="faq-teaser"
      aria-labelledby="faq-teaser-heading"
      className="relative overflow-hidden border-t border-white/[0.06] bg-black text-white"
    >
      {/* Soft ambient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-glow-layer"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(99,102,241,0.10), rgba(0,0,0,0) 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(236,72,153,0.08), rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-10">
        {/* Section header */}
        <div className="mb-14 flex flex-col items-start gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 [font-family:var(--font-ui)]">
              Questions, Answered
            </p>
            <h2
              id="faq-teaser-heading"
              className="mt-5 text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.025em] [font-family:var(--font-heading)]"
            >
              The things people
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                {" "}
                keep asking us.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[15.5px] leading-[1.7] text-white/60 [font-family:var(--font-body)]">
              If you&apos;re wondering whether WEBBED does it, the answer is
              almost always yes. Here are four of the questions we get most
              often — and 29 more waiting for you.
            </p>
          </div>

          <Link
            href="/faq"
            className="group hidden shrink-0 items-center gap-2.5 self-end rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-[13.5px] font-medium text-white/85 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/[0.08] hover:text-white sm:inline-flex [font-family:var(--font-ui)]"
          >
            See all 33 answers
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Question grid */}
        <ul className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {TEASER_ITEMS.map((item, idx) => (
            <li key={`${item.question}-${idx}`}>
              <Link
                href={`/faq#${item.hash}`}
                className="group block h-full focus-visible:outline-none"
              >
                <article
                  className={[
                    "relative h-full overflow-hidden rounded-3xl border bg-white/[0.02] p-7 backdrop-blur-md transition-all duration-500 sm:p-8",
                    "border-white/10 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]",
                    "blur-isolated",
                    // First card spans 2 columns on md+ to give it visual weight
                    idx === 0 ? "md:col-span-2" : "",
                  ].join(" ")}
                  style={
                    idx === 0
                      ? undefined
                      : undefined
                  }
                >
                  {/* Decorative index number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-5 select-none text-[clamp(3rem,4vw,4.5rem)] font-bold leading-none text-white/[0.04] [font-family:var(--font-heading)]"
                  >
                    0{idx + 1}
                  </span>

                  <div className="relative flex h-full flex-col">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 [font-family:var(--font-ui)]">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-300 to-fuchsia-300"
                      />
                      {item.category}
                    </span>

                    <h3
                      className={[
                        "mt-6 font-semibold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-heading)]",
                        idx === 0
                          ? "text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)]"
                          : "text-[clamp(1.35rem,1.1rem+1vw,1.85rem)]",
                      ].join(" ")}
                    >
                      {item.question}
                    </h3>

                    <p className="mt-5 max-w-[60ch] text-[14.5px] leading-[1.7] text-white/65 [font-family:var(--font-body)]">
                      {item.answer}
                    </p>

                    <div className="mt-auto pt-7">
                      <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors duration-200 group-hover:text-white [font-family:var(--font-ui)]">
                        Read the full answer
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-[14px] font-medium text-white/85 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/[0.08] hover:text-white [font-family:var(--font-ui)]"
          >
            See all 33 answers
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
