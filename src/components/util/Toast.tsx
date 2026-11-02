"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, visible, onClose, duration = 4000 }: ToastProps) {
  const [rendered, setRendered] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => setAnimating(true), 0);
      const timer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => {
          setRendered(false);
          onClose();
        }, 300);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!rendered) return null;

  const bgColor = type === "success"
    ? "bg-emerald-500/90"
    : type === "error"
      ? "bg-red-500/90"
      : "bg-indigo-500/90";

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div
      className="fixed bottom-6 right-6 z-[300] max-w-sm"
      style={{
        transform: animating ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
        opacity: animating ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
      }}
    >
      <div
        className={`flex items-center gap-3 rounded-2xl border border-white/10 ${bgColor} backdrop-blur-xl px-5 py-4 shadow-2xl`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
          {icon}
        </span>
        <p className="text-sm font-medium text-white/95 [font-family:var(--font-body)]">{message}</p>
        <button
          onClick={() => {
            setAnimating(false);
            setTimeout(() => {
              setRendered(false);
              onClose();
            }, 300);
          }}
          className="ml-2 shrink-0 text-white/50 hover:text-white/90 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}