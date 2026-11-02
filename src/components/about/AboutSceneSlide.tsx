"use client";

import AboutSceneBackground from "./AboutSceneBackground";
import AboutSceneImagePanel from "./AboutSceneImagePanel";
import type { AboutSceneConfig } from "./aboutScenes";

type AboutSceneSlideProps = {
  scene: AboutSceneConfig;
  index: number;
};

export default function AboutSceneSlide({ scene, index }: AboutSceneSlideProps) {
  const imageOnLeft = scene.imageSide === "left";
  const showDescription =
    scene.id !== "intro" && scene.description.trim().length > 0;

  const descriptionLines = showDescription
    ? scene.description
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
    : [];

  return (
    <article
      id={`about-${scene.id}`}
      data-about-scene={index}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-black"
    >
      <AboutSceneBackground variant={scene.variant} parallaxY={0} />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-1 items-center px-5 pb-10 pt-24 sm:px-10 sm:pt-28 lg:px-12">
        <div className="grid w-full items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div
            className={`flex max-w-xl flex-col justify-center mb-10 ${imageOnLeft ? "order-1 lg:order-2" : "order-1"
              } ${index === 0 ? "mt-8" : ""}`}
          >
            <h2
              className={
                scene.id === "intro"
                  ? "text-white text-[clamp(2.2rem,1.5rem+2.8vw,4.2rem)] leading-[0.98] tracking-[-0.02em] font-semibold [font-family:var(--font-heading)]"
                  : scene.id === "passion"
                    ? "text-white text-[clamp(2.4rem,1.6rem+3vw,4.4rem)] leading-[0.96] tracking-[-0.025em] font-semibold [font-family:var(--font-heading)]"
                    : scene.id === "impact"
                      ? "text-white text-[clamp(2.6rem,1.75rem+3.2vw,4.8rem)] leading-[0.95] tracking-[-0.03em] font-semibold [font-family:var(--font-heading)]"
                      : "text-white text-[clamp(2rem,1.4rem+2.5vw,3.6rem)] leading-[0.98] tracking-[-0.02em] font-semibold [font-family:var(--font-heading)]"
              }
            >
              {scene.title}
            </h2>

            {descriptionLines.map((line, lineIndex) => (
              <p
                key={`${scene.id}-line-${lineIndex}`}
                className={`text-white/70 text-sm leading-relaxed [font-family:var(--font-body)] ${lineIndex === 0 ? "mt-6 sm:mt-8" : "mt-3 sm:mt-4"
                  }`}
              >
                {line}
              </p>
            ))}
          </div>

          <div
            className={`flex items-center justify-center ${imageOnLeft ? "order-2 lg:order-1" : "order-2"
              }`}
          >
            <AboutSceneImagePanel
              imageSrc={scene.imageSrc}
              imageAlt={scene.imageAlt}
              imageSide={scene.imageSide}
              priority={index === 0}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
