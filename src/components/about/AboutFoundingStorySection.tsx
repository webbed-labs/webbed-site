"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const storyCards = [
  {
    code: "01 // ORIGIN",
    text: "We didn't start Webbed because it was the safe thing to do. We started it because we looked at what was out there and decided we could do it better. Every agency we saw was running the same playbook. Templates dressed up as custom work. Junior teams handed off to clients who thought they were getting the founders. Promises made in the pitch, forgotten in the build. Every company living off of AI slop, broken systems and products nobody's proud of.",
    mobileText:
      "We didn't follow the industry's playbook. While others settled for shortcuts and generic solutions, we built WEBBED to deliver software with purpose and craftsmanship.",
  },
  {
    code: "02 // MISSION",
    text: "The whole industry felt like it had given up on actually being good. We hadn't. We had the skills. We had the standards. What we didn't have was tolerance for mediocrity, and that turned out to be the most valuable thing of all. So we built Webbed. Not to be another agency. Not to be something that already exists. To prove that a team that refuses to cut corners can build things that make everyone else look like they forgot what perfect actually feels like.",
    mobileText:
      'We never accepted "good enough." WEBBED was built to challenge industry standards through software crafted without compromise.',
  },
  {
    code: "03 // FUTURE",
    text: "We're not here to be the biggest. We're here to be the one people remember. That's why Webbed exists. Not to be another AI company, but to build something actually worth remembering.",
  },
];

export default function AboutFoundingStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const cards = cardRefs.current.filter(
        (card): card is HTMLElement => card !== null,
      );

      if (!section || cards.length !== storyCards.length) return;

      gsap.registerPlugin(ScrollTrigger);
      gsap.set(cards[0], { autoAlpha: 1, yPercent: 0, scale: 1 });
      gsap.set(cards.slice(1), { autoAlpha: 0, yPercent: 12, scale: 0.97 });
      gsap.set(progressRef.current, { scaleY: 0, transformOrigin: "top" });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          id: "about-founding-story",
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to({}, { duration: 0.7 })
        .to(cards[0], { autoAlpha: 0, yPercent: -12, scale: 0.97, duration: 0.3 })
        .to(cards[1], { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.3 }, "<")
        .to(progressRef.current, { scaleY: 0.5, duration: 0.3 }, "<")
        .to({}, { duration: 0.7 })
        .to(cards[1], { autoAlpha: 0, yPercent: -12, scale: 0.97, duration: 0.3 })
        .to(cards[2], { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.3 }, "<")
        .to(progressRef.current, { scaleY: 1, duration: 0.3 }, "<")
        .to({}, { duration: 0.5 });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-about-founding-story
      className="relative h-screen min-h-[100svh] w-full overflow-hidden bg-[#050505]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[7%] top-[15%] h-[34rem] w-[34rem] rounded-full bg-[#07152f]/30 blur-[150px]" />
        <div className="absolute right-[6%] top-[38%] h-[30rem] w-[30rem] rounded-full bg-[#190711]/25 blur-[150px]" />
      </div>

      <div className="relative mx-auto grid h-full w-full max-w-[1400px] grid-rows-[auto_minmax(0,1fr)] items-start gap-5 px-4 pb-4 pt-24 sm:gap-7 sm:px-10 sm:pb-8 sm:pt-24 lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1 lg:items-center lg:gap-16 lg:px-16 lg:py-0 xl:px-20">
        <div className="relative z-10">
          <div className="mb-4 inline-flex rounded-full border border-white/15 px-4 py-2.5 font-mono text-[9px] tracking-[0.28em] text-white/55 sm:mb-6 sm:px-6 sm:py-3 sm:text-xs lg:mb-8">
            THE STORY BEHIND WEBBED.
          </div>

          <h2 className="max-w-[570px] text-[clamp(2.15rem,10vw,3.35rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#f4f2f5] lg:text-[clamp(2.65rem,6vw,5.6rem)] lg:leading-[1.02]">
            The Industry
            <br />
            Settled.
            <br />
            We Didn&apos;t<span className="text-[#d7b9ff]">.</span>
          </h2>

          <p className="mt-4 text-sm text-white/45 sm:mt-6 sm:text-base lg:mt-8 lg:text-lg">
            That&apos;s where WEBBED began.
          </p>

          <div className="mt-5 h-px max-w-[510px] bg-white/10 sm:mt-7 lg:mt-10" />
        </div>

        <div className="relative h-[clamp(220px,34svh,280px)] min-h-0 sm:h-[300px] lg:h-[500px]">
          {storyCards.map((card, index) => (
            <article
              key={card.code}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-story-card={index + 1}
              style={
                index === 0
                  ? undefined
                  : {
                      opacity: 0,
                      visibility: "hidden",
                      transform: "translateY(12%) scale(0.97)",
                    }
              }
              className="absolute inset-0 flex overflow-hidden rounded-[20px] border border-[#173565] bg-[#0c0c12]/95 p-5 shadow-[0_20px_90px_rgba(0,42,105,0.16)] sm:rounded-[24px] sm:p-8 lg:p-12"
            >
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/45 sm:text-xs">
                  <span>{card.code}</span>
                  <span>{String(index + 1).padStart(2, "0")} / 03</span>
                </div>

                <p className="my-auto text-[13px] leading-6 text-white/80 sm:text-[15px] sm:leading-7 lg:text-[18px] lg:leading-9">
                  <span className="hidden lg:inline">{card.text}</span>
                  <span className="lg:hidden">{card.mobileText ?? card.text}</span>
                </p>

                <div className="text-right font-mono text-[10px] tracking-[0.26em] text-white/35 sm:text-xs">
                  WEBBED
                </div>
              </div>
            </article>
          ))}

          <div className="absolute -right-5 top-1/2 hidden h-28 w-px -translate-y-1/2 overflow-hidden bg-white/10 xl:block">
            <div ref={progressRef} className="h-full w-full bg-[#a88cff]" />
          </div>
        </div>
      </div>
    </section>
  );
}
