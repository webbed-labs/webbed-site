"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type DependencyList,
} from "react";

type AnimationValues = Record<string, gsap.TweenValue | undefined>;

let scrollTriggerRegistered = false;
export function ensureScrollTrigger() {
  if (typeof window === "undefined") return;
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
}

// Run `cb` once the main thread is free. Keeps heavy GSAP/ScrollTrigger work
// off the initial layout & paint path (reduces Total Blocking Time / reflow).
type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};
function scheduleIdle(cb: () => void) {
  if (typeof window === "undefined") return;
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 500 });
  else window.setTimeout(cb, 0);
}

// Convert Framer-style ease (string name or cubic-bezier array) to GSAP ease.
export function toGsapEase(ease?: number[] | string): string {
  if (!ease) return "power1.out";
  if (Array.isArray(ease)) {
    const [x1, y1, x2, y2] = ease;
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  }
  switch (ease) {
    case "linear":
      return "none";
    case "easeIn":
      return "power1.in";
    case "easeOut":
      return "power1.out";
    case "easeInOut":
      return "power1.inOut";
    default:
      return ease;
  }
}

// Convert Framer-style animation values (x/y/scale/opacity/rotate/filter/width/...)
// into a GSAP-friendly vars object.
export function framerToGsap(values: AnimationValues | undefined | null) {
  if (!values) return null;
  const out: gsap.TweenVars = {};
  if (values.opacity !== undefined) out.opacity = values.opacity;
  if (values.x !== undefined) out.x = values.x;
  if (values.y !== undefined) out.y = values.y;
  if (values.scale !== undefined) out.scale = values.scale;
  if (values.scaleX !== undefined) out.scaleX = values.scaleX;
  if (values.scaleY !== undefined) out.scaleY = values.scaleY;
  if (values.rotate !== undefined) out.rotation = values.rotate;
  if (values.rotateX !== undefined) out.rotationX = values.rotateX;
  if (values.rotateY !== undefined) out.rotationY = values.rotateY;
  if (values.filter !== undefined) out.filter = values.filter;
  if (values.width !== undefined) out.width = values.width;
  if (values.height !== undefined) out.height = values.height;
  if (typeof values.pathLength === "number") {
    // Framer's pathLength is a 0–1 stroke progress; in GSAP we draw the SVG
    // path with strokeDasharray + strokeDashoffset instead.
    out.strokeDasharray = 1;
    out.strokeDashoffset = 1 - values.pathLength;
  }
  return out;
}

// Apply Framer-style keyframe arrays as a GSAP timeline.
export function playKeyframes(
  el: gsap.TweenTarget,
  propName: string,
  keyframes: unknown[] | undefined,
  duration: number,
  ease: string,
  delay = 0,
) {
  if (!keyframes || !Array.isArray(keyframes) || keyframes.length === 0) return null;
  const tl = gsap.timeline({ delay });
  keyframes.forEach((value, i) => {
    const t = i / Math.max(1, keyframes.length - 1);
    tl.to(el, { [propName]: value, duration: duration * 0.25, ease }, t);
  });
  return tl;
}

/**
 * useReveal — small replacement for Framer's `<motion.div whileInView={...}>`.
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>({
 *     initial: { opacity: 0, y: 24 },
 *     whileInView: { opacity: 1, y: 0 },
 *     viewport: { once: true, amount: 0.3 },
 *     transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
 *   });
 *   return <div ref={ref}>...</div>
 */
export function useReveal<T extends HTMLElement = HTMLElement>(opts: {
  initial?: AnimationValues;
  whileInView?: AnimationValues;
  viewport?: { once?: boolean; amount?: number };
  transition?: { duration?: number; delay?: number; ease?: number[] | string };
}) {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    ensureScrollTrigger();
    const el = ref.current;
    if (!el) return;

    const initialVars = framerToGsap(opts.initial);
    if (initialVars) gsap.set(el, initialVars as gsap.TweenVars);

    if (!opts.whileInView) return;

    const target = framerToGsap(opts.whileInView);
    if (!target) return;

    let trigger: ScrollTrigger | undefined;
    let disposed = false;

    // Defer ScrollTrigger creation off the mount path so it doesn't force a
    // synchronous layout/reflow while the page is first rendering.
    scheduleIdle(() => {
      if (disposed || !ref.current) return;
      // Framer's viewport `amount` means the proportion of the element that
      // should be visible before revealing. Offset the trigger by that share
      // of the element's own height. The previous direct viewport-percentage
      // mapping kept content transparent until it was close to leaving the
      // screen, especially for shorter product rows.
      const amount = Math.min(1, Math.max(0, opts.viewport?.amount ?? 0.1));

      trigger = ScrollTrigger.create({
        trigger: el,
        start: () => `top+=${Math.round(el.getBoundingClientRect().height * amount)}px bottom`,
        invalidateOnRefresh: true,
        once: opts.viewport?.once ?? true,
        onEnter: () => {
          gsap.to(el, {
            ...target,
            duration: opts.transition?.duration ?? 0.6,
            delay: opts.transition?.delay ?? 0,
            ease: toGsapEase(opts.transition?.ease),
            overwrite: "auto",
          });
        },
      });
    });

    return () => {
      disposed = true;
      trigger?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/**
 * useAnimate — applies `initial` synchronously then plays `animate` on mount.
 * Drop-in for Framer's `motion.div initial={...} animate={...}` (non-viewport).
 */
export function useAnimate<T extends HTMLElement = HTMLElement>(
  opts: {
    initial?: AnimationValues;
    animate?: AnimationValues;
    transition?: { duration?: number; delay?: number; ease?: number[] | string; repeat?: number };
    keyframes?: Partial<
      Record<"x" | "y" | "scale" | "scaleX" | "scaleY" | "rotate" | "opacity", unknown[]>
    >;
  },
  deps: DependencyList = [],
) {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    ensureScrollTrigger();
    const el = ref.current;
    if (!el) return;

    const initialVars = framerToGsap(opts.initial);
    if (initialVars) gsap.set(el, initialVars as gsap.TweenVars);

    const animateVars = framerToGsap(opts.animate);
    const duration = opts.transition?.duration ?? 0.6;
    const delay = opts.transition?.delay ?? 0;
    const ease = toGsapEase(opts.transition?.ease);

    const tweens: gsap.core.Animation[] = [];
    let disposed = false;

    // Build & start the entrance animations on idle so they don't block the
    // initial layout & paint (reduces Total Blocking Time on mount).
    scheduleIdle(() => {
      if (disposed || !ref.current) return;
      const elNow = ref.current;

      if (opts.keyframes) {
        for (const [prop, values] of Object.entries(opts.keyframes)) {
          if (!values || !Array.isArray(values)) continue;
          const tl = gsap.timeline({ delay, repeat: opts.transition?.repeat });
          values.forEach((value, i: number) => {
            const t = i / Math.max(1, values.length - 1);
            tl.to(elNow, { [prop]: value, duration: duration * 0.25, ease }, t);
          });
          tweens.push(tl);
        }
      }

      if (animateVars) {
        tweens.push(
          gsap.to(elNow, {
            ...animateVars,
            duration,
            delay,
            ease,
            repeat: opts.transition?.repeat,
            overwrite: "auto",
          }),
        );
      }
    });

    return () => {
      disposed = true;
      tweens.forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * useHover — when the element is hovered, tween it to `hover`; revert on leave.
 * Mimics Framer's `whileHover`.
 */
export function useHover<T extends HTMLElement = HTMLElement>(
  hover: AnimationValues,
  base: AnimationValues = {},
  duration = 0.25,
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => {
      const target = framerToGsap(hover);
      if (!target) return;
      gsap.to(el, { ...target, duration, ease: "power2.out", overwrite: "auto" });
    };
    const onLeave = () => {
      const target = framerToGsap(base);
      if (!target) return;
      gsap.to(el, { ...target, duration, ease: "power2.out", overwrite: "auto" });
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/**
 * useInView — simple IntersectionObserver hook.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  opts?: { once?: boolean; amount?: number },
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (opts?.once) obs.disconnect();
          } else if (!opts?.once) {
            setInView(false);
          }
        }
      },
      { threshold: opts?.amount ?? 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts?.once, opts?.amount]);
  return [ref, inView];
}

/**
 * useScroll — minimal Framer-like wrapper returning `{ scrollYProgress }`.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
 */
export function useScroll(opts?: { target?: React.RefObject<HTMLElement | null>; offset?: [string, string] }) {
  const progress = useMotionValue(0);
  const targetRef = opts?.target;
  const start = opts?.offset?.[0];
  const end = opts?.offset?.[1];
  useEffect(() => {
    ensureScrollTrigger();
    const target = targetRef?.current;
    if (!target) return;
    let trigger: ScrollTrigger | undefined;
    let disposed = false;
    scheduleIdle(() => {
      if (disposed || !targetRef?.current) return;
      trigger = ScrollTrigger.create({
        trigger: targetRef.current,
        start: start ?? "start start",
        end: end ?? "end end",
        onUpdate: (self) => progress.set(self.progress),
      });
    });
    return () => {
      disposed = true;
      trigger?.kill();
    };
  }, [targetRef, start, end, progress]);
  return { scrollYProgress: progress };
}

/**
 * useMotionValue / useSpring / useTransform — thin shims that satisfy the
 * Framer Motion API surface used in this codebase. Real spring physics would
 * require GSAP QuickTo; these shims return a plain getter/setter and a
 * static interpolation so visual diff stays minimal.
 *
 * Where mouse-follow spring physics really matter (3D tilt in AboutLetterSection),
 * the corresponding component file implements its own GSAP-based solution.
 */
export interface MotionValue<T> {
  get: () => T;
  set: (value: T) => void;
  on: (event: "change", callback: (value: T) => void) => () => void;
}

function createMotionValue<T>(initial: T): MotionValue<T> {
  let current = initial;
  const listeners = new Set<(value: T) => void>();

  return {
    get: () => current,
    set: (value) => {
      if (Object.is(current, value)) return;
      current = value;
      listeners.forEach((listener) => listener(value));
    },
    on: (event, callback) => {
      if (event !== "change") return () => {};
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}

export function useMotionValue<T = number>(initial: T = 0 as T): MotionValue<T> {
  const [motionValue] = useState(() => createMotionValue(initial));
  return motionValue;
}

export function useSpring<T>(
  value: MotionValue<T>,
  config?: unknown,
): MotionValue<T> {
  void config;
  return value;
}

function transformValue<T>(
  value: number,
  inputRangeOrFn: number[] | ((value: number) => T),
  outputRange?: T[],
): T {
  if (typeof inputRangeOrFn === "function") {
    return inputRangeOrFn(value);
  }

  const a = inputRangeOrFn[0];
  const b = inputRangeOrFn[1];
  const oa = outputRange?.[0];
  const ob = outputRange?.[1];
  const t = (value - a) / ((b - a) || 1);
  const clamped = Math.max(0, Math.min(1, t));
  if (typeof oa === "number" && typeof ob === "number") {
    return (oa + (ob - oa) * clamped) as T;
  }
  return (clamped < 0.5 ? oa : ob) as T;
}

export function useTransform<T>(
  input: MotionValue<number>,
  inputRangeOrFn: number[] | ((value: number) => T),
  outputRange?: T[],
): MotionValue<T> {
  const [derivedValue] = useState(() =>
    createMotionValue(
      transformValue(input.get(), inputRangeOrFn, outputRange),
    ),
  );
  useEffect(
    () =>
      input.on("change", (latest) =>
        derivedValue.set(transformValue(latest, inputRangeOrFn, outputRange)),
      ),
    [input, derivedValue, inputRangeOrFn, outputRange],
  );
  return derivedValue;
}

function readMotionTemplate(
  strings: TemplateStringsArray,
  values: Array<MotionValue<unknown> | unknown>,
) {
  return strings.reduce((acc, string, index) => {
    const value = values[index];
    const current =
      value && typeof value === "object" && "get" in value
        ? (value as MotionValue<unknown>).get()
        : value;
    return acc + string + (current ?? "");
  }, "");
}

export function useMotionTemplate(
  strings: TemplateStringsArray,
  values: Array<MotionValue<unknown> | unknown>,
): MotionValue<string> {
  const [templateValue] = useState(() =>
    createMotionValue(readMotionTemplate(strings, values)),
  );
  useEffect(() => {
    const unsubscribers = values.map((value) => {
      if (!value || typeof value !== "object" || !("on" in value)) {
        return () => {};
      }
      return (value as MotionValue<unknown>).on("change", () => {
        templateValue.set(readMotionTemplate(strings, values));
      });
    });
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [templateValue, values, strings]);
  return templateValue;
}

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}
