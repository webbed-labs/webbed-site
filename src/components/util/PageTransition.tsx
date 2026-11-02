"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
}

// Route changes stay quick; the destination begins rendering behind the cover.
const EXIT_DURATION_S = 0.8;
const ENTRANCE_DURATION_S = 0.6;
const ROUTE_COMMIT_AT_S = 0.35;

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();

  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitionStartedAtRef = useRef(0);
  const entranceTimerRef = useRef<number | null>(null);
  const failSafeTimerRef = useRef<number | null>(null);
  const isTransitioning = useRef(false);
  const isFirstRender = useRef(true);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const prefersReducedMotion = useCallback(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const killActiveTimeline = useCallback(() => {
    activeTimelineRef.current?.kill();
    activeTimelineRef.current = null;
  }, []);

  const clearFailSafeTimer = useCallback(() => {
    if (failSafeTimerRef.current !== null) {
      window.clearTimeout(failSafeTimerRef.current);
      failSafeTimerRef.current = null;
    }
  }, []);

  const runEntranceAnimation = useCallback(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;
    if (!overlay || !content) {
      isTransitioning.current = false;
      return;
    }

    killActiveTimeline();
    window.scrollTo({ top: 0, behavior: "instant" });

    if (prefersReducedMotion()) {
      gsap.set(content, { clearProps: "all", opacity: 1 });
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      isTransitioning.current = false;
      clearFailSafeTimer();
      setTargetPath(null);
      return;
    }

    gsap.set(content, {
      opacity: 0,
      y: 16,
      scale: 0.992,
      filter: "blur(3px)",
      transformOrigin: "center top",
      force3D: true,
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        gsap.set(content, { clearProps: "all" });
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        isTransitioning.current = false;
        clearFailSafeTimer();
        setTargetPath(null);
        activeTimelineRef.current = null;
      },
    });

    activeTimelineRef.current = tl;

    tl.to(content, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.45,
      ease: "power3.out",
    }).to(
      [overlay, logo].filter(Boolean),
      {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.inOut",
      },
      ENTRANCE_DURATION_S - 0.35,
    );
  }, [clearFailSafeTimer, killActiveTimeline, prefersReducedMotion]);

  const runExitAnimation = useCallback(
    (destinationHref: string) => {
      const overlay = overlayRef.current;
      const content = contentRef.current;
      const logo = logoRef.current;

      if (isTransitioning.current) return;
      isTransitioning.current = true;
      setTargetPath(destinationHref);
      transitionStartedAtRef.current = performance.now();
      router.prefetch(destinationHref);

      clearFailSafeTimer();
      failSafeTimerRef.current = window.setTimeout(() => {
        killActiveTimeline();
        if (contentRef.current) {
          gsap.set(contentRef.current, { clearProps: "all", opacity: 1 });
        }
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
        }
        isTransitioning.current = false;
        setTargetPath(null);
        failSafeTimerRef.current = null;
      }, 4000);

      if (!overlay || !content || prefersReducedMotion()) {
        router.push(destinationHref);
        return;
      }

      killActiveTimeline();

      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "auto" });
      gsap.set(logo, { autoAlpha: 0, scale: 0.96, y: 8 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          activeTimelineRef.current = null;
        },
      });

      activeTimelineRef.current = tl;

      tl.to(content, {
        opacity: 0.35,
        y: -10,
        scale: 0.992,
        filter: "blur(3px)",
        duration: 0.28,
        force3D: true,
      })
        .to(
          overlay,
          {
            autoAlpha: 1,
            duration: 0.32,
          },
          0.03,
        )
        .to(
          logo,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.34,
            ease: "power3.out",
          },
          0.12,
        )
        .call(() => router.push(destinationHref), undefined, ROUTE_COMMIT_AT_S)
        .to(
          {},
          { duration: EXIT_DURATION_S - ROUTE_COMMIT_AT_S },
          ROUTE_COMMIT_AT_S,
        );
    },
    [clearFailSafeTimer, killActiveTimeline, prefersReducedMotion, router],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(contentRef.current, { opacity: 1 });
      return;
    }

    const elapsedMs = performance.now() - transitionStartedAtRef.current;
    const remainingMs = Math.max(0, EXIT_DURATION_S * 1000 - elapsedMs);
    entranceTimerRef.current = window.setTimeout(() => {
      entranceTimerRef.current = null;
      runEntranceAnimation();
    }, remainingMs);

    return () => {
      if (entranceTimerRef.current !== null) {
        window.clearTimeout(entranceTimerRef.current);
        entranceTimerRef.current = null;
      }
    };
  }, [pathname, runEntranceAnimation]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target) return;

      const rawHref = target.getAttribute("href");
      if (!rawHref) return;

      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const destination = new URL(rawHref, window.location.origin);
      if (destination.origin !== window.location.origin) return;

      const destinationHref = `${destination.pathname}${destination.search}${destination.hash}`;
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (destinationHref === currentHref) return;

      event.preventDefault();
      runExitAnimation(destinationHref);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      if (entranceTimerRef.current !== null) {
        window.clearTimeout(entranceTimerRef.current);
      }
      clearFailSafeTimer();
      killActiveTimeline();
    };
  }, [clearFailSafeTimer, killActiveTimeline, runExitAnimation]);

  const displayRouteLabel =
    (targetPath || pathname).split("?")[0].replace("/", "").toUpperCase() || "HOME";

  return (
    <div className="relative min-h-screen bg-black">
      <div
        ref={overlayRef}
        data-page-transition-overlay
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center opacity-0"
      >
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(90,128,230,0.16),transparent_38%),radial-gradient(circle_at_70%_70%,rgba(220,70,120,0.10),transparent_42%)]" />
        <div className="relative flex flex-col items-center gap-3">
          <img
            ref={logoRef}
            src="/logo.png"
            alt=""
            className="h-12 w-auto object-contain opacity-0 drop-shadow-[0_0_18px_rgba(255,255,255,0.32)]"
            draggable={false}
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45 [font-family:var(--font-ui)]">
            {displayRouteLabel}
          </span>
        </div>
      </div>

      <div ref={contentRef} className="relative z-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
