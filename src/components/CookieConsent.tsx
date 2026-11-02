"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "webbed_cookie_consent";

type ConsentStatus = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored as ConsentStatus);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setConsent("rejected");
    setVisible(false);
  };

  if (!visible || consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white [font-family:var(--font-heading)]">
              🍪 We value your privacy
            </p>
            <p className="mt-1.5 text-xs text-white/55 leading-relaxed [font-family:var(--font-body)]">
              This site uses essential cookies for basic functionality. We do not use tracking or analytics cookies unless you explicitly accept them.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              Necessary Only
            </button>
            <button
              onClick={handleAccept}
              className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
