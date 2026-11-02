import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LABS | WEBBED",
  description:
    "Explore WEBBED Labs — an independent product studio building tools, platforms, and intelligence systems for the future. Discover products like InSynk, AIDA, and more.",
  openGraph: {
    title: "LABS | WEBBED",
    description:
      "Explore WEBBED Labs — an independent product studio building tools, platforms, and intelligence systems for the future.",
    url: "https://webbed.in/labs",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LABS | WEBBED",
    description:
      "Explore WEBBED Labs — an independent product studio building tools, platforms, and intelligence systems for the future.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/labs" },
};

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
