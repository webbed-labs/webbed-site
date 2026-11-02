# DONE: Homepage & CinematicFooter Fixes

## Issue 1: Home page opening isn't smooth ✅
- [x] Add `opacity: 0` to `.logo-stage` CSS in Hero.tsx (hide logo until GSAP initializes)
- [x] Add `gsap.set(logoStage, { autoAlpha: 1 })` in GSAP initialization to reveal the stage when GSAP hydrates

## Issue 2: CinematicFooter W-E-B-B-E-D animation is gone ✅
- [x] Fix `useInView` ref usage — use the returned ref (`inViewRef`) on the letters `<span>` container instead of separate unused `lettersContainerRef`
- [x] Remove unused `containerRef` from the `<p>` element
- [x] Remove unused `useRef` import
