import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CONTACT | WEBBED",
  description:
    "Start a conversation with WEBBED. Tell us what you're building — we'll tell you how far it can go. Reach out for websites, software, AI, or product strategy.",
  openGraph: {
    title: "CONTACT | WEBBED",
    description:
      "Start a conversation with WEBBED. Tell us what you're building — we'll tell you how far it can go.",
    url: "https://webbed.in/contact",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CONTACT | WEBBED",
    description:
      "Start a conversation with WEBBED. Tell us what you're building — we'll tell you how far it can go.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
