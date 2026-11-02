import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutTimelineSection from "@/components/about/AboutTimelineSection";
import ServicesShowcase from "@/components/ServicesShowcase";
import FaqTeaser from "@/components/FaqTeaser";
import CinematicFooter from "@/components/CinematicFooter";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webbed.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HOME | WEBBED",
  description:
    "WEBBED is a future-ready digital agency that builds websites, custom software, AI systems, automations, and digital products crafted for what's next.",
  keywords: ["WEBBED", "digital agency", "web development", "AI", "software", "future-ready", "technology"],
  openGraph: {
    title: "HOME | WEBBED",
    description:
      "Future-ready websites, custom software, AI systems, automations, and digital products from WEBBED — built for what's next.",
    url: SITE_URL,
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOME | WEBBED",
    description:
      "Future-ready websites, custom software, AI systems, automations, and digital products from WEBBED.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutTimelineSection />

      <ServicesShowcase />
      <FaqTeaser />
      <CinematicFooter />
    </div>
  );
}
