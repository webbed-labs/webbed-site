import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutFoundingStorySection from "@/components/about/AboutFoundingStorySection";
import AboutStorytelling from "@/components/about/AboutStorytelling";
import AboutGapSection from "@/components/about/AboutGapSection";
import AboutManifestoSection from "@/components/about/AboutManifestoSection";
import ServicesShowcase from "@/components/ServicesShowcase";

export const metadata: Metadata = {
  title: "ABOUT | WEBBED",
  description:
    "Discover the story behind WEBBED — a technology company building future-ready software, AI systems, and digital products that shape what's next.",
  keywords: ["WEBBED", "about", "technology company", "AI", "software", "digital agency", "future-ready"],
  openGraph: {
    title: "ABOUT | WEBBED",
    description:
      "Discover the story behind WEBBED — a technology company building future-ready software, AI systems, and digital products.",
    url: "https://webbed.in/about",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABOUT | WEBBED",
    description:
      "Discover the story behind WEBBED — a technology company building future-ready software, AI systems, and digital products.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative">
        {/* Cinematic Hero Section */}
        <AboutHeroSection />

        {/* Founding Story Section */}
        <AboutFoundingStorySection />

        {/* Premium Storytelling Section */}
        <AboutStorytelling />

        {/* Three divisions section */}
        <ServicesShowcase />

        {/* Other sections */}
        <AboutGapSection />
        <AboutManifestoSection />
      </main>

      <CinematicFooter />
    </div>
  );
}
