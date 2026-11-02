// AboutStorytelling.tsx – Premium 2×2 glassmorphic pillar showcase
"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AboutStorytelling() {
  const gridItems = [
    { subject: "Websites", subtext: "High‑performance digital experiences designed to attract, engage, and convert." },
    { subject: "Software", subtext: "Custom systems engineered to streamline operations and accelerate growth." },
    { subject: "AI", subtext: "Intelligent automation and AI solutions that transform ideas into execution." },
    { subject: "Education", subtext: "Learning ecosystems that connect knowledge with innovation." },
  ] as const;

  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // IntersectionObserver – trigger once when section scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="about-storytelling-section"
    >
      {/* Heading block */}
      <div className="section-header storytelling-header">
        <p className="storytelling-eyebrow">
          FOUR PILLARS • ONE DIGITAL FOUNDATION
        </p>
        <h2>
          Four Pillars. One Digital Foundation.
        </h2>
        <p className="storytelling-intro">
          Every solution we build is designed to help businesses connect, scale, automate, and grow.
        </p>
      </div>

      {/* 2×2 glassmorphic grid */}
      <div className={`about-storytelling-grid ${inView ? "in-view" : ""}`}>
        {gridItems.map((item, i) => (
          <div key={item.subject} className="about-storytelling-card card" data-index={i}>
            <p className="about-storytelling-card__title">{item.subject}</p>
            <p className="about-storytelling-card__subtext">
              {item.subtext}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto:wght@500;700&display=swap');

        .about-storytelling-section {
          background-color: #050508;
          padding-top: 100px;
          padding-bottom: 110px;
        }

        .storytelling-header {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 60px;
        }

        .storytelling-eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
          margin: 0 0 20px 0;
        }

        .storytelling-header h2 {
          font-size: clamp(48px, 5.5vw, 72px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 20px 0;
        }

        .storytelling-intro {
          font-size: 16px;
          color: rgba(255,255,255,0.55);
          max-width: 580px;
          line-height: 1.75;
          margin: 0 0 48px 0;
        }

        .about-storytelling-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 60px;
        }

        @media (max-width: 767px) {
          .about-storytelling-section {
            padding-top: 60px !important;
            padding-bottom: 70px !important;
          }
          .storytelling-header {
            padding: 0 20px !important;
          }
          .storytelling-header h2 {
            font-size: clamp(32px, 8vw, 48px) !important;
          }
          .storytelling-intro {
            font-size: 14px !important;
            line-height: 1.6 !important;
            margin-bottom: 32px !important;
          }
          .about-storytelling-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            padding: 0 20px !important;
          }
          .card {
            height: 140px !important;
            min-height: 140px !important;
            padding: 16px 12px !important;
            border-radius: 12px !important;
          }
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          min-height: 200px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          cursor: default;
          transition: transform 0.08s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.08s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.08s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.08s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateY(30px);
        }
        .in-view .card {
          opacity: 1;
          transform: translateY(0);
        }
        .about-storytelling-grid.in-view .card:hover {
          transition-delay: 0s;
        }
        .card[data-index='0'] { transition-delay: 0.1s; }
        .card[data-index='1'] { transition-delay: 0.2s; }
        .card[data-index='2'] { transition-delay: 0.3s; }
        .card[data-index='3'] { transition-delay: 0.4s; }
        
        .about-storytelling-card:hover {
          transform: translateY(-12px);
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.22);
        }
        .about-storytelling-card__title {
          margin: 0;
          font-size: clamp(1.75rem, 6vw, 48px);
          font-weight: 700;
          font-family: 'Roboto', sans-serif;
          color: #f5f5f5;
          text-align: center;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        @media (max-width: 767px) {
          .about-storytelling-card__title {
            font-size: 1.25rem !important;
          }
        }
        .about-storytelling-card:hover .about-storytelling-card__title {
          color: #fff;
        }
        .about-storytelling-card__subtext {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
          text-align: center;
          font-family: 'Inter', sans-serif;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          flex-shrink: 0;
          pointer-events: none;
          transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.2s ease,
                      margin-top 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(8px);
        }
        @media (max-width: 767px) {
          .about-storytelling-card__subtext {
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
        }
        .about-storytelling-card:hover .about-storytelling-card__subtext {
          max-height: 120px;
          opacity: 1;
          margin-top: 16px;
          transform: translateY(0);
        }
        @media (max-width: 767px) {
          .about-storytelling-card:hover .about-storytelling-card__subtext {
            max-height: 140px !important;
            margin-top: 8px !important;
          }
        }
        .about-storytelling-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 114, 255, 0.12), rgba(255, 0, 127, 0.12));
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-storytelling-card:hover::before {
          opacity: 0.6;
        }
      `}</style>
    </section>
  );
}
