"use client";

import React, { useEffect, useRef, useState } from "react";

interface SectionRevealProps {
  children: React.ReactNode;
  variant?: "up" | "scale";
  staggerIndex?: number;
  threshold?: number;
  rootMargin?: string;
  as?: React.ElementType;
  className?: string;
}

export default function SectionReveal({
  children,
  variant = "up",
  staggerIndex = 0,
  threshold = 0.15,
  rootMargin = "0px",
  as: Component = "div",
  className = "",
}: SectionRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  // Compute CSS custom property for transition delay (stagger: ~0.1s)
  const delay = staggerIndex > 0 ? `${staggerIndex * 0.1}s` : undefined;
  const style = delay ? ({ "--reveal-delay": delay } as React.CSSProperties) : undefined;

  const animationClass = variant === "scale" ? "reveal-scale" : "reveal-up";
  const combinedClassName = `${animationClass} ${isRevealed ? "revealed" : ""} ${className}`.trim();

  return (
    <Component ref={elementRef} className={combinedClassName} style={style}>
      {children}
    </Component>
  );
}
