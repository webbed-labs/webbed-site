"use client";

import { useMemo, useState } from "react";

type LinkCell = {
  href: string;
  label: string;
  kind: "email" | "instagram" | "linkedin" | "x" | "github";
};

function Icon({ kind }: { kind: LinkCell["kind"] }) {
  // Simple minimalist SVG/text icons (no external assets).
  switch (kind) {
    case "email":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M4 6h16v12H4V6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="m4 7 8 6 8-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M17.5 6.5h.01"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M4 9h4v11H4V9Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M6 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 20V9h4v2c.8-1.3 2.1-2 3.7-2 2.3 0 4.3 1.6 4.3 5v6h-4v-5c0-1.4-.5-2.3-1.7-2.3-1 0-1.8.7-2 1.7-.1.3-.1.7-.1 1v4.6h-4Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M5 19 19 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M5 5l14 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M9 19c-4 1.5-4-2-5-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M14 22v-3.2c0-.9.3-1.6.8-2-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.2 1.2.9-.2 1.9-.3 2.9-.3s2 .1 2.9.3c2.2-1.5 3.2-1.2 3.2-1.2.6 1.7.2 2.9.1 3.2.7.9 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .5.4.9 1.2.9 2.4V22"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function SocialBentoGrid() {
  const cells = useMemo<LinkCell[]>(
    () => [
      { href: "mailto:contact@webbed.com", label: "EMAIL", kind: "email" },
      { href: "https://www.instagram.com/webbed_official", label: "INSTAGRAM", kind: "instagram" },
      {
        href: "https://www.linkedin.com/company/webbed-official/posts/?feedView=all",
        label: "LINKEDIN",
        kind: "linkedin",
      },
      { href: "https://x.com/Webbed_Official", label: "X", kind: "x" },
      { href: "https://github.com/webbed-labs", label: "GITHUB", kind: "github" },
    ],
    [],
  );

  // Track pointer for each cell to drive clip-path polygon slashing.
  // We store the hovered index + pointer position within that cell.
  const [hovered, setHovered] = useState<{
    idx: number;
    xPct: number;
    yPct: number;
  } | null>(null);

  return (
    <section className="mt-10 px-6 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="social-bento-grid" role="navigation" aria-label="Social links">
          {cells.map((c, idx) => {
            const row = idx < 2 ? 1 : 2;
            const cellClass = `social-bento-cell social-bento-cell--${row}-${idx}`;

            // grid placement using CSS classes
            return (
              <a
                key={c.href}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className={cellClass}
                onMouseEnter={(e) => {
                  const rect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
                  const xPct = ((e.clientX - rect.left) / rect.width) * 100;
                  const yPct = ((e.clientY - rect.top) / rect.height) * 100;
                  setHovered({ idx, xPct, yPct });
                }}
                onMouseMove={(e) => {
                  if (!hovered || hovered.idx !== idx) return;
                  const rect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
                  const xPct = ((e.clientX - rect.left) / rect.width) * 100;
                  const yPct = ((e.clientY - rect.top) / rect.height) * 100;
                  setHovered({ idx, xPct, yPct });
                }}
                onMouseLeave={() => setHovered(null)}
                style={
                  hovered?.idx === idx
                    ? ({
                        ["--sx" as any]: `${hovered.xPct}%`,
                        ["--sy" as any]: `${hovered.yPct}%`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <span className="social-bento-cell__inner">
                  <span className="social-bento-cell__icon">
                    <Icon kind={c.kind} />
                  </span>
                  <span className="social-bento-cell__label">{c.label}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
