import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SCHOOLS | WEBBED",
  description:
    "WEBBED Schools offers practical technology education — web foundations, AI, and product engineering programs designed to shape the next generation of builders.",
  openGraph: {
    title: "SCHOOLS | WEBBED",
    description:
      "WEBBED Schools offers practical technology education — web foundations, AI, and product engineering programs.",
    url: "https://webbed.in/schools",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCHOOLS | WEBBED",
    description:
      "WEBBED Schools offers practical technology education — web foundations, AI, and product engineering programs.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/schools" },
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
