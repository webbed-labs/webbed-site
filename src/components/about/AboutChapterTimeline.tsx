"use client";

import { CROSSFADE_DURATION_S, FADE_EASE } from "./about-motion";
import { ABOUT_SCENES, ABOUT_SCENE_COUNT } from "./aboutScenes";

type AboutChapterTimelineProps = {
  activeIndex: number;
  slideProgress: number;
  onSelect: (index: number) => void;
};

const SCENE_SHORT_LABELS = ["Intro", "Vision", "Passion", "Impact"];

const easeCss = `cubic-bezier(${FADE_EASE[0]}, ${FADE_EASE[1]}, ${FADE_EASE[2]}, ${FADE_EASE[3]})`;
const transitionCss = `left ${CROSSFADE_DURATION_S}s ${easeCss}, width ${CROSSFADE_DURATION_S}s ${easeCss}, opacity ${CROSSFADE_DURATION_S * 0.4}s ${easeCss}`;

export default function AboutChapterTimeline({
  activeIndex,
  slideProgress,
  onSelect,
}: AboutChapterTimelineProps) {
  const maxIndex = ABOUT_SCENE_COUNT - 1;
  const fillRatio =
    maxIndex > 0
      ? Math.min(1, (activeIndex + slideProgress) / maxIndex)
      : 0;

  return (
    <nav
      aria-label="About timeline"
      className="pointer-events-auto relative z-50 mx-auto w-full max-w-[440px] px-4"
    >
      <div className="relative overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-3.5 shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.06]"
          aria-hidden
        />

        <div
          className="absolute left-[8%] right-[8%] top-1/2 h-px -translate-y-1/2 bg-white/10"
          aria-hidden
        />
        <div
          className="absolute left-[8%] top-1/2 h-[2px] -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-white/80 via-white/50 to-white/25 shadow-[0_0_12px_rgba(255,255,255,0.25)]"
          style={{
            width: `calc(84% * ${fillRatio})`,
            transition: transitionCss,
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.08),0_0_20px_rgba(255,255,255,0.5)]"
          style={{
            left: `calc(8% + 84% * ${fillRatio})`,
            transition: transitionCss,
          }}
        />

        <div className="relative flex items-center justify-between px-[2%]">
          {ABOUT_SCENES.map((scene, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Chapter ${index + 1}: ${SCENE_SHORT_LABELS[index]}`}
                aria-current={isActive ? "step" : undefined}
                className="group relative z-10 flex h-8 w-8 items-center justify-center outline-none"
              >
                <span
                  className={`rounded-full block ${
                    isActive
                      ? "h-2 w-2 bg-white/0"
                      : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/45"
                  }`}
                  style={{
                    opacity: isActive ? 0 : 0.7,
                    transition: transitionCss,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}