"use client";

/* ─── DATA ─────────────────────────────────────────────────────── */

export type ServiceVisualDef = {
  abbreviation: string;
  imageUrl: string;
  opacity: number;
};

// 9 entries, aligned 1:1 with the "What we build" grid in solutions/page.tsx
// (Websites, Web Applications, AI Solutions, Custom Software, SEO, UI/UX,
// Native Apps, Custom Integrations, Logo Design).
//
// NOTE: cards 07 (Native Apps), 08 (Custom Integrations), and 09 (Logo Design)
// currently have NO distinct image asset in /public/cards. The old
// "digital marketing" image was reused for all three as a placeholder. Do NOT
// reuse an unrelated image — distinct assets are needed:
//   - /cards/native-apps.png      (mobile app icon/graphic)
//   - /cards/custom-integrations.png (integration/connectivity graphic)
//   - /cards/logo-design.png      (branding/logo graphic)
// Until those exist, the three trailing entries below are left pointing at the
// placeholder so the build does not break, but this must be replaced.
export const SERVICE_VISUALS: ServiceVisualDef[] = [
  { abbreviation: "WEB", imageUrl: "/cards/website.png", opacity: 0.60 },
  { abbreviation: "APP", imageUrl: "/cards/web%20application.png", opacity: 0.60 },
  { abbreviation: "AI", imageUrl: "/cards/ai%20solution.png", opacity: 0.60 },
  { abbreviation: "DEV", imageUrl: "/cards/custome%20software.png", opacity: 0.60 },
  { abbreviation: "SEO", imageUrl: "/cards/seo%20optimization.png", opacity: 0.60 },
  { abbreviation: "UX", imageUrl: "/cards/uiux.png", opacity: 0.60 },
  // TODO(assets): replace with /cards/native-apps.png once available
  { abbreviation: "NTV", imageUrl: "/cards/digital%20marketing.png", opacity: 0.60 },
  // TODO(assets): replace with /cards/custom-integrations.png once available
  { abbreviation: "INT", imageUrl: "/cards/digital%20marketing.png", opacity: 0.60 },
  // TODO(assets): replace with /cards/logo-design.png once available
  { abbreviation: "LGO", imageUrl: "/cards/digital%20marketing.png", opacity: 0.60 },
];

/* ─── BACKGROUND COMPONENT ──────────────────────────────────────── */

type Props = {
  imageUrl: string;
  abbreviation: string;
  opacity: number;
};

export default function ServiceCardVisuals({
  imageUrl,
  abbreviation,
  opacity,
}: Props) {
  return (
    <>
      {/* Background image illustration */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 -right-3 z-0 h-[88%] w-auto max-w-none select-none object-contain opacity-[var(--card-img-bp)] transition-all duration-500 ease-out group-hover:scale-[1.08] group-hover:opacity-[var(--card-img-hp)]"
        style={
          {
            filter: "blur(0.5px) brightness(0.65)",
            mixBlendMode: "screen",
            "--card-img-bp": opacity,
            "--card-img-hp": Math.min(opacity * 1.3, 0.85),
          } as React.CSSProperties
        }
        draggable={false}
        loading="lazy"
      />

      {/* Large faint abbreviation */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 right-4 z-[1] select-none font-bold leading-none tracking-[0.06em] text-white/[0.035]"
        style={{ fontSize: "clamp(3rem, 4vw, 4.5rem)", fontFamily: "var(--font-heading)" }}
      >
        {abbreviation}
      </span>
    </>
  );
}
