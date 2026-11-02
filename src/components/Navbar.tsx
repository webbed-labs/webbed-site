"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";


type NavItem = { label: string; href: string };

export default function Navbar() {
  const pathname = usePathname();
  const startsInsideHeroIntro = pathname === "/";
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "About", href: "/about" },
      { label: "Product", href: "/labs" },
      { label: "Solutions", href: "/solutions" },
      { label: "Education", href: "/schools" },
    ],
    [],
  );

  const contactHref = "/contact";

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href;
  };

  const activeIndex = useMemo(() => {
    if (pathname === "/") return 0;
    if (pathname === "/about") return 1;
    if (pathname === "/labs") return 2;
    if (pathname === "/solutions") return 3;
    if (pathname === "/schools") return 4;
    return -1;
  }, [pathname]);

  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    function updateIndicator() {
      const activeEl = navRefs.current[activeIndex];
      if (activeIndex !== -1 && activeIndex !== 0 && activeEl) {
        const w = activeEl.offsetWidth * 0.5;
        const l = activeEl.offsetLeft + (activeEl.offsetWidth - w) / 2;
        setIndicatorStyle({
          left: l,
          width: w,
          opacity: 1,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    }

    updateIndicator();
    const timer = setTimeout(updateIndicator, 100);

    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
      clearTimeout(timer);
    };
  }, [activeIndex]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const [isIntroUnlocked, setIsIntroUnlocked] = useState(!startsInsideHeroIntro);
  const [isVisible, setIsVisible] = useState(!startsInsideHeroIntro);
  const lastScrollYRef = useRef<number>(0);
  const isVisibleRef = useRef(isVisible);
  const isScrolledRef = useRef(isScrolled);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    isScrolledRef.current = isScrolled;
  }, [isScrolled]);

  useEffect(() => {
    if (!startsInsideHeroIntro) {
      isVisibleRef.current = true;
      return;
    }

    function onHeroNav(event: Event) {
      const visible = Boolean((event as CustomEvent<{ visible: boolean }>).detail?.visible);
      setIsIntroUnlocked(visible);
      setIsVisible(visible);
    }

    window.addEventListener("webbed:hero-nav", onHeroNav);
    return () => window.removeEventListener("webbed:hero-nav", onHeroNav);
  }, [startsInsideHeroIntro]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const threshold = 20;

    let raf = 0;
    function updateNavOnScroll() {
      raf = 0;
      const nextScrolled = window.scrollY > 20;
      if (isScrolledRef.current !== nextScrolled) {
        isScrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      if (startsInsideHeroIntro && !isIntroUnlocked) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const hero = document.getElementById("hero");
      const heroProgress = hero ? Number(hero.dataset.heroProgress ?? 0) : 1;

      if (startsInsideHeroIntro && hero && heroProgress < 0.995) {
        if (isVisibleRef.current !== isIntroUnlocked) {
          isVisibleRef.current = isIntroUnlocked;
          setIsVisible(isIntroUnlocked);
        }
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const heroScrollEnd = hero ? hero.offsetHeight - window.innerHeight + 40 : threshold;

      if (currentScrollY < threshold || currentScrollY <= heroScrollEnd) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const nextVisible =
        currentScrollY > lastScrollYRef.current
          ? false
          : currentScrollY < lastScrollYRef.current
            ? true
            : isVisibleRef.current;

      if (isVisibleRef.current !== nextVisible) {
        isVisibleRef.current = nextVisible;
        setIsVisible(nextVisible);
      }

      lastScrollYRef.current = currentScrollY;
    }

    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame(updateNavOnScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isIntroUnlocked, startsInsideHeroIntro]);
  return (
    <header
      className={[
        "fixed left-0 right-0 top-0 z-60 transition-all duration-300 will-change-transform",
        isVisible && isIntroUnlocked ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <nav className="mx-auto max-w-7xl px-3 md:px-6">
        <div
          className="hidden md:flex items-center justify-between w-full rounded-full px-4 py-1 transition-all duration-300 ease-in-out"
          style={{
            background: isScrolled
              ? "linear-gradient(rgba(10, 10, 10, 0.82), rgba(10, 10, 10, 0.82)) padding-box, linear-gradient(135deg, rgba(90, 128, 230, 0.18) 0%, rgba(220, 70, 120, 0.18) 100%) border-box"
              : "linear-gradient(rgba(8, 8, 8, 0.68), rgba(8, 8, 8, 0.68)) padding-box, linear-gradient(135deg, rgba(90, 128, 230, 0.12) 0%, rgba(220, 70, 120, 0.12) 100%) border-box",
            border: "1px solid transparent",
            boxShadow: isScrolled
              ? "0 8px 30px rgba(0, 0, 0, 0.55), 0 0 16px rgba(90, 128, 230, 0.04), 0 0 16px rgba(220, 70, 120, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.08)"
              : "0 6px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(90, 128, 230, 0.03), 0 0 12px rgba(220, 70, 120, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.06)",
            backdropFilter: isScrolled ? "blur(14px)" : "blur(10px)",
            WebkitBackdropFilter: isScrolled ? "blur(14px)" : "blur(10px)",
          }}
        >
          <div className="flex items-center mr-1 py-0.5">
            <Link
              href="/"
              className="flex items-center rounded-full px-1 transition-transform duration-300 hover:scale-105"
              aria-label="WEBBED home"
              onClick={() => setIsOpen(false)}
            >
              <img
                src="/logo.png"
                alt="WEBBED — technology company logo building AI software, websites, and digital products"
                className="h-[45px] w-auto object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.12)]"
              />
            </Link>
            <span className="h-6 w-px bg-white/10 mx-3 self-center" />
          </div>

          <div className="relative flex items-center gap-7 drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] py-0.5">
            {/* Sliding Underline Indicator */}
            <span
              className="absolute bottom-0 h-[1.5px] bg-gradient-to-r from-[#5a80e6] to-[#dc4678] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />

            <Link
              ref={(node) => {
                navRefs.current[0] = node;
              }}
              href="/"
              className={[
                "type-nav-link group relative text-[0.92rem] py-1 transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                isLinkActive("/")
                  ? "text-white font-medium"
                  : "text-white/65 hover:text-white"
              ].join(" ")}
              onClick={() => setIsOpen(false)}
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-white/30 transition-all duration-[250ms] ease-out group-hover:w-full" />
            </Link>
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                ref={(node) => {
                  navRefs.current[index + 1] = node;
                }}
                href={item.href}
                className={[
                  "type-nav-link group relative text-[0.92rem] py-1 transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isLinkActive(item.href)
                    ? "text-white font-medium"
                    : "text-white/65 hover:text-white"
                ].join(" ")}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-white/30 transition-all duration-[250ms] ease-out group-hover:w-full" />
              </Link>
            ))}

            <Link href={contactHref} aria-label="Contact">
              <button
                className="inline-flex items-center justify-center rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                type="button"
                onMouseEnter={() => setIsContactHovered(true)}
                onMouseLeave={() => setIsContactHovered(false)}
                style={{
                  background: isContactHovered
                    ? "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)) padding-box, linear-gradient(135deg, rgba(90, 128, 230, 0.45) 0%, rgba(220, 70, 120, 0.45) 100%) border-box"
                    : "linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.01)) padding-box, linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 100%) border-box",
                  border: "1px solid transparent",
                  boxShadow: isContactHovered
                    ? "0 6px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(90, 128, 230, 0.18), 0 0 12px rgba(220, 70, 120, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.12)"
                    : "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                  transform: isContactHovered ? "translateY(-1.5px)" : "translateY(0)",
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  color: isContactHovered ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
                }}
              >
                <span>Contact</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ── MOBILE BAR: premium header pill ── */}
        <div
          className="flex h-[50px] w-full items-center justify-between rounded-full px-5 transition-all duration-300 ease-in-out md:hidden"
          style={{
            background: isScrolled
              ? "rgba(10, 10, 10, 0.92)"
              : "rgba(8, 8, 8, 0.82)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 10px 40px -6px rgba(0, 0, 0, 0.6)",
            backdropFilter: isScrolled ? "blur(24px)" : "blur(14px)",
            WebkitBackdropFilter: isScrolled ? "blur(24px)" : "blur(14px)",
          }}
        >
          <div className="flex items-center h-full">
            <Link
              href="/"
              className="flex items-center"
              aria-label="WEBBED home"
              onClick={() => setIsOpen(false)}
            >
              <img
                src="/logo.png"
                alt="WEBBED — technology company logo building AI software, websites, and digital products"
                className="filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] block h-auto w-auto max-h-[27px] max-w-full"
              />
            </Link>
          </div>

          <div className="flex items-center h-full">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-end text-white transition-all duration-200 active:scale-90"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              <div className="relative h-3.5 w-6">
                <span
                  className={[
                    "absolute left-0 top-0 h-[2px] w-6 rounded-full bg-white transition-all duration-300",
                    isOpen ? "top-[6px] rotate-45" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-[6px] h-[2px] w-6 rounded-full bg-white transition-all duration-200",
                    isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-[12px] h-[2px] w-6 rounded-full bg-white transition-all duration-300",
                    isOpen ? "top-[6px] -rotate-45" : "",
                  ].join(" ")}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ── BACKDROP OVERLAY (mobile only) ── */}
        <div
          className={[
            "fixed inset-0 z-40 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          style={{
            background: isOpen
              ? "rgba(0,0,0,0.72)"
              : "rgba(0,0,0,0)",
            backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
            WebkitBackdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
          }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* ── MOBILE NAV PANEL (slide down) ── */}
        <div
          className={[
            "fixed left-3 right-3 z-50 origin-top transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
            isOpen ? "translate-y-0 scale-100 opacity-100 pointer-events-auto" : "-translate-y-2 scale-[0.97] opacity-0 pointer-events-none",
          ].join(" ")}
          style={{
            top: "62px",
            background: "linear-gradient(180deg, rgba(10,10,14,0.98) 0%, rgba(12,12,18,0.96) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(90,128,230,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(30px) saturate(1.2)",
            WebkitBackdropFilter: "blur(30px) saturate(1.2)",
          }}
          role="dialog"
          aria-modal={isOpen}
          aria-label="Navigation menu"
        >
          <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <nav className="flex max-h-[calc(100vh-8rem)] flex-col gap-1 overflow-y-auto p-2.5">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="group relative flex min-h-[50px] items-center justify-between rounded-xl px-4 transition-all duration-200 hover:bg-white/[0.05]"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                transition: `opacity 0.25s ease ${isOpen ? '0.06s' : '0s'}, transform 0.25s ease ${isOpen ? '0.06s' : '0s'}, background-color 0.2s ease`,
                background: isLinkActive("/") ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" : undefined,
              }}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.04] text-[11px] text-white/35">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <span className="text-[15px] font-medium tracking-[-0.01em]">Home</span>
              </span>
              {isLinkActive("/") && (
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#5a80e6] to-[#dc4678] shadow-[0_0_8px_rgba(90,128,230,0.6)]" />
              )}
            </Link>

            {navItems.map((item, index) => {
              const isActive = isLinkActive(item.href);
              const delay = 0.08 + index * 0.04;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group relative flex min-h-[50px] items-center justify-between rounded-xl px-4 transition-all duration-200 hover:bg-white/[0.05]"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                    transition: `opacity 0.25s ease ${isOpen ? `${delay}s` : '0s'}, transform 0.25s ease ${isOpen ? `${delay}s` : '0s'}, background-color 0.2s ease`,
                    background: isActive ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" : undefined,
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.04] text-[11px] text-white/35">
                      {index === 0 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      )}
                      {index === 3 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[15px] font-medium tracking-[-0.01em]">{item.label}</span>
                  </span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#5a80e6] to-[#dc4678] shadow-[0_0_8px_rgba(90,128,230,0.6)]" />
                  )}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            <Link
              href={contactHref}
              onClick={() => setIsOpen(false)}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                transition: `opacity 0.25s ease ${isOpen ? '0.24s' : '0s'}, transform 0.25s ease ${isOpen ? '0.24s' : '0s'}`,
              }}
            >
              <button
                className="group inline-flex min-h-[50px] w-full items-center justify-center rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-200 active:scale-[0.98]"
                type="button"
                style={{
                  background: "linear-gradient(135deg, rgba(90,128,230,0.25) 0%, rgba(220,70,120,0.2) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.92)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(90,128,230,0.35) 0%, rgba(220,70,120,0.28) 100%)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(90,128,230,0.25) 0%, rgba(220,70,120,0.2) 100%)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.92)";
                }}
              >
                <span className="flex items-center gap-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Contact
                </span>
              </button>
            </Link>
          </nav>

          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>
      </nav>
    </header>
  );
}
