import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOLUTIONS | WEBBED",
  description:
    "WEBBED Solutions delivers custom software, AI integration, web applications, and digital strategy to help businesses move faster and build lasting competitive advantage.",
  openGraph: {
    title: "SOLUTIONS | WEBBED",
    description:
      "WEBBED Solutions delivers custom software, AI integration, web applications, and digital strategy.",
    url: "https://webbed.in/solutions",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOLUTIONS | WEBBED",
    description:
      "WEBBED Solutions delivers custom software, AI integration, web applications, and digital strategy.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/solutions" },
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
