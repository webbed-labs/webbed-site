"use client";

import type { AboutSceneVariant } from "./aboutScenes";

type AboutSceneBackgroundProps = {
  variant: AboutSceneVariant;
  parallaxY: number;
};

export default function AboutSceneBackground({
  variant,
  parallaxY,
}: AboutSceneBackgroundProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        style={{ transform: `translate3d(0, ${parallaxY * 0.35}px, 0)` }}
        className="absolute inset-0"
      >
        {variant === "intro" && (
          <>
            <div className="absolute -top-44 left-1/3 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0)_62%)] blur-3xl" />
            <div className="absolute -bottom-56 right-1/4 h-[760px] w-[760px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),rgba(255,255,255,0)_55%)] opacity-70" />
            <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70" />
          </>
        )}

        {variant === "visionary" && (
          <>
            <div className="absolute -top-44 right-1/4 h-[680px] w-[680px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_62%)] blur-3xl" />
            <div className="absolute -bottom-56 left-1/3 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.11),rgba(255,255,255,0)_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.06),rgba(255,255,255,0)_58%)] opacity-70" />
            <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70" />
          </>
        )}

        {variant === "passion" && (
          <>
            <div className="absolute -top-56 left-1/4 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),rgba(255,255,255,0)_62%)] blur-3xl" />
            <div className="absolute -bottom-64 right-1/3 h-[880px] w-[880px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13),rgba(255,255,255,0)_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.07),rgba(255,255,255,0)_60%)] opacity-80" />
            <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-80" />
          </>
        )}

        {variant === "impact" && (
          <>
            <div className="absolute -top-56 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0)_62%)] blur-3xl" />
            <div className="absolute -bottom-64 right-1/4 h-[900px] w-[900px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.06),rgba(255,255,255,0)_62%)] opacity-75" />
            <div className="absolute left-1/2 top-1/2 h-px w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-75" />
          </>
        )}
      </div>
    </div>
  );
}
