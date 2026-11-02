"use client";

import Image from "next/image";

type AboutSceneImagePanelProps = {
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
  priority?: boolean;
};

export default function AboutSceneImagePanel({
  imageSrc,
  imageAlt,
  imageSide,
  priority = false,
}: AboutSceneImagePanelProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-6 sm:-inset-8 rounded-[2.75rem] bg-gradient-to-tr from-white/10 via-white/0 to-white/12 blur-2xl opacity-60" />
      <div className="pointer-events-none absolute -inset-8 sm:-inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),rgba(255,255,255,0)_58%)] blur-3xl opacity-50" />

      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/40 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] ring-1 ring-white/[0.06]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 92vw, 42vw"
          className="object-cover object-center"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(0,0,0,0.45),transparent_55%)]"
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 ${
            imageSide === "left"
              ? "bg-gradient-to-r from-black/35 via-transparent to-transparent"
              : "bg-gradient-to-l from-black/35 via-transparent to-transparent"
          }`}
          aria-hidden
        />
      </div>
    </div>
  );
}
