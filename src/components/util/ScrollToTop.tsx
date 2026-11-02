"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SCROLL_KEY = "webbed_scroll_positions";

/**
 * Scroll restoration utility.
 *
 * Saves scroll positions per route to sessionStorage on scroll / tab-hide
 * and restores them on navigation back to a previously visited page.
 * Falls back to scroll-to-top when no saved position exists.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const restored = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser-native scroll restoration so it doesn't override us
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }

    // Respect hash-links: let the browser jump to the anchor
    if (window.location.hash) return;

    // Try to restore saved scroll position
    if (!restored.current) {
      restored.current = true;
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved) {
        try {
          const positions = JSON.parse(saved);
          const pos = positions[pathname];
          if (typeof pos === "number") {
            requestAnimationFrame(() => {
              window.scrollTo(0, pos);
            });
            return;
          }
        } catch {
          // ignore parse error
        }
      }
    }

    // Immediate scroll to top
    window.scrollTo(0, 0);

    // Second pass after the next frame to override Next.js scroll restoration
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  // Save scroll position on scroll and visibility change
  useEffect(() => {
    const savePosition = () => {
      try {
        const saved = sessionStorage.getItem(SCROLL_KEY);
        const positions = saved ? JSON.parse(saved) : {};
        positions[pathname] = window.scrollY;
        sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions));
      } catch {
        // ignore
      }
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(savePosition, 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") savePosition();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", savePosition);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  // Reset restoration flag on navigation
  useEffect(() => {
    restored.current = false;
  }, [pathname]);

  return null;
}
