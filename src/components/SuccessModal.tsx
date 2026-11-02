"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Exit animation
  useEffect(() => {
    if (!isOpen && shouldRender) {
      const tl = gsap.timeline({
        onComplete: () => setShouldRender(false),
      });
      if (modalRef.current) {
        tl.to(modalRef.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.35, ease: "power2.in" }, 0);
      }
      if (backdropRef.current) {
        tl.to(backdropRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
      }
      return () => {
        tl.kill();
      };
    }
  }, [isOpen, shouldRender]);

  // Enter animation
  useEffect(() => {
    if (!isOpen) return;
    if (backdropRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    }
    if (circleRef.current) {
      const length = 157;
      gsap.fromTo(
        circleRef.current,
        { strokeDashoffset: length, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      );
    }
    if (checkRef.current) {
      gsap.fromTo(
        checkRef.current,
        { strokeDashoffset: 50, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.4, delay: 0.6, ease: "power2.out" },
      );
    }
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: "100%" },
        { width: "0%", duration: 4, ease: "none" },
      );
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        style={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 text-center shadow-2xl"
        style={{ opacity: 0 }}
      >
        {/* Success Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
            <svg
              viewBox="0 0 52 52"
              className="h-12 w-12 text-white"
            >
              <circle
                ref={circleRef}
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="157"
              />
              <path
                ref={checkRef}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                strokeDasharray="50"
                strokeDashoffset="50"
              />
            </svg>
          </div>
        </div>

        {/* Logo & Text */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="WEBBED — technology company logo building AI software, websites, and digital products"
              className="h-6 w-auto opacity-80"
            />
          </div>

          <h3 className="text-xl font-bold text-white [font-family:var(--font-heading)]">
            Thank You for Submitting
          </h3>

          <p className="text-sm text-white/50 [font-family:var(--font-body)]">
            We&apos;ve received your request and will get back to you soon.
          </p>
        </div>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 h-1 bg-white/20"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}