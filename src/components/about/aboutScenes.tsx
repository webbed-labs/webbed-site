import type { ReactNode } from "react";

export type AboutSceneVariant = "intro" | "visionary" | "passion" | "impact";

export type AboutSceneConfig = {
  id: string;
  title: ReactNode;
  description: string;
  imageSrc: string;
  imageAlt: string;
  variant: AboutSceneVariant;
  imageSide: "left" | "right";
};

export const ABOUT_SCENES: AboutSceneConfig[] = [
  {
    id: "intro",
    variant: "intro",
    imageSide: "left",
    imageSrc: "/about/we make.jpg",
    imageAlt: "Cinematic abstract artwork behind WEBBED's tagline: 'We make softwares the world is not prepared for yet'",
    title: (
      <>
        We make{" "}
        <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          <span className="bg-gradient-to-r from-fuchsia-200 via-cyan-200 to-white bg-clip-text text-transparent">
            softwares
          </span>
        </span>{" "}
        that the world isn&apos;t prepared for,{" "}
        <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          <span className="bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            YET !!
          </span>
        </span>
      </>
    ),
    description: "",
  },
  {
    id: "visionary",
    variant: "visionary",
    imageSide: "right",
    imageSrc: "/about/vision.jpg",
    imageAlt: "Visionary — futuristic product design and next-generation digital experiences by WEBBED",
    title: "Visionary",
    description:
      "We don't chase trends—we design the next default. WEBBED turns ideas into future-ready products with cinematic clarity, strong systems thinking, and a premium build quality you can feel.",
  },
  {
    id: "passion",
    variant: "passion",
    imageSide: "left",
    imageSrc: "/about/passion.jpg",
    imageAlt: "Passion — WEBBED's obsessive attention to craft, detail, and premium software engineering",
    title: "Passion",
    description:
      "This is obsession turned into craft. We sweat the micro-details, refine the system until it feels inevitable, and build with a relentless standard—because ambition deserves a premium execution.",
  },
  {
    id: "impact",
    variant: "impact",
    imageSide: "right",
    imageSrc: "/about/impact.jpg",
    imageAlt: "Impact — long-lasting, scalable WEBBED products built to shape the future of technology",
    title: "Impact",
    description:
      "We build for legacy—products that scale, endure, and shape what comes next.",
  },
];

export const ABOUT_SCENE_COUNT = ABOUT_SCENES.length;
