import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PRODUCTS | WEBBED",
  description:
    "Discover Products by WEBBED Labs — original software built inside WEBBED Labs including InSynk, AIDA, GRABBO, and more. Live and emerging products crafted for what's next.",
  openGraph: {
    title: "PRODUCTS | WEBBED",
    description:
      "Discover Products by WEBBED Labs — original software including InSynk, AIDA, GRABBO, and more.",
    url: "https://webbed.in/products",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRODUCTS | WEBBED",
    description:
      "Discover Products by WEBBED Labs — original software including InSynk, AIDA, GRABBO, and more.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/products" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
