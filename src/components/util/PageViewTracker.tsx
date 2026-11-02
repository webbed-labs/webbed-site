"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Pages to exclude from tracking (admin pages)
const EXCLUDED = ["/admin"];

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Skip admin routes and duplicate tracks
    if (EXCLUDED.some((p) => pathname.startsWith(p))) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    // Use a safe doc ID from the path (replace slashes)
    const docId = pathname === "/" ? "home" : pathname.replace(/\//g, "_").replace(/^_/, "");

    // Merge-write: increment views, update lastSeen. Creates doc if not exists.
    setDoc(
      doc(db, "page_views", docId),
      {
        path: pathname,
        views: increment(1),
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {
      // Silently ignore — tracking is non-critical
    });
  }, [pathname]);

  return null;
}
