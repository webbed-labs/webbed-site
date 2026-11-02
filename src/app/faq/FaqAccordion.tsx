"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  q: string;
  a: string;
};

export type FaqSection = {
  id: string;
  label: string;
  items: FaqItem[];
};

type Props = {
  sections: FaqSection[];
};

export default function FaqAccordion({ sections }: Props) {
  // Track open state per question: { "<sectionId>:<index>": boolean }
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = useCallback((key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-7 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 [font-family:var(--font-ui)]"
            >
              {section.label.split(" ")[0]?.slice(0, 3) ?? "FAQ"}
            </span>
            <h2
              id={`${section.id}-heading`}
              className="text-[clamp(1.6rem,1.1rem+1.4vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em] text-white [font-family:var(--font-heading)]"
            >
              {section.label}
            </h2>
            <span
              aria-hidden="true"
              className="hidden h-px flex-1 bg-gradient-to-r from-white/15 via-white/8 to-transparent sm:block"
            />
          </div>

          <ul className="space-y-3 sm:space-y-4">
            {section.items.map((item, idx) => {
              const key = `${section.id}:${idx}`;
              const isOpen = !!open[key];
              return (
                <li key={key} className="group">
                  <div
                    className={[
                      "overflow-hidden rounded-2xl border bg-white/[0.025] backdrop-blur-md transition-all duration-300",
                      isOpen
                        ? "border-white/25 bg-white/[0.05] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      aria-controls={`${key}-panel`}
                      id={`${key}-button`}
                      className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left sm:px-7 sm:py-5"
                    >
                      <span className="text-[15px] font-medium leading-snug text-white sm:text-[16px] [font-family:var(--font-body)]">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-all duration-300",
                          isOpen ? "rotate-180 border-white/40 bg-white/[0.10] text-white" : "",
                        ].join(" ")}
                      >
                        <ChevronDown className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                    </button>

                    <div
                      id={`${key}-panel`}
                      role="region"
                      aria-labelledby={`${key}-button`}
                      className={[
                        "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 pt-1 text-[14.5px] leading-[1.75] text-white/70 sm:px-7 sm:pb-6 [font-family:var(--font-body)]">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
