import type { Metadata, Viewport } from "next";
import "./globals.css";

import { spaceGrotesk, satoshi, satoshiVariable } from "./fonts";
import CookieConsent from "@/components/CookieConsent";
import PageViewTracker from "@/components/util/PageViewTracker";
import PageTransition from "@/components/util/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://webbed.in"),
  icons: [{ rel: "icon", url: "/Favicon.svg", type: "image/svg+xml" }],
  title: {
    default: "WEBBED — Web, Software & AI",
    template: "%s",
  },
  description:
    "WEBBED builds future-ready websites, custom software, AI systems, automations, digital products, and practical technology education.",
  openGraph: {
    title: "WEBBED | AI, Software, Websites, and Technology Education",
    description:
      "Future-ready websites, custom software, AI systems, automations, digital products, and practical technology education from WEBBED.",
    url: "https://webbed.in",
    siteName: "WEBBED",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WEBBED — technology company building AI software, websites, and digital products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEBBED | AI, Software, Websites, and Technology Education",
    description:
      "Future-ready websites, custom software, AI systems, automations, digital products, and practical technology education from WEBBED.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WEBBED",
  url: "https://webbed.in",
  logo: "https://webbed.in/logo.png",
  description:
    "WEBBED builds future-ready websites, custom software, AI systems, automations, digital products, and practical technology education.",
  email: "contact@webbed.in",
  foundingDate: "2023",
  slogan: "Built for what's next.",
  sameAs: [
    "https://www.instagram.com/webbed_official",
    "https://www.linkedin.com/company/webbed-official/",
    "https://x.com/Webbed_Official",
    "https://github.com/webbed-labs",
  ],
  knowsAbout: [
    "Web Development",
    "Software Engineering",
    "Artificial Intelligence",
    "AI Automation",
    "UI/UX Design",
    "SEO Optimization",
    "Mobile App Development",
    "Custom Integrations",
    "Branding & Logo Design",
    "Technology Education",
  ],
  brand: {
    "@type": "Brand",
    name: "WEBBED",
    slogan: "Built for what's next.",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "WEBBED Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Websites",
          description:
            "Distinctive, conversion-focused websites engineered for clarity, speed, and sustainable growth.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Applications",
          description:
            "Scalable digital products shaped around real workflows, complex data, and demanding users.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Solutions",
          description:
            "Practical AI systems and intelligent agents embedded directly into business operations.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Software",
          description:
            "Purpose-built software engineered precisely around your organization and its ambitions.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO Optimization",
          description:
            "Technical and content systems designed to compound visibility, authority, and qualified demand.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UI/UX Design",
          description:
            "Elegant product experiences that turn complex interactions into intuitive, considered journeys.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Native Apps",
          description:
            "High-performance mobile applications built for speed, retention, and seamless user experiences.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Integrations",
          description:
            "Tailored integrations that unify tools, platforms, and data into one cohesive ecosystem.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Logo Design",
          description:
            "Distinctive, memorable logos crafted to capture your brand's essence and stand the test of time.",
        },
      },
    ],
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WEBBED",
  url: "https://webbed.in",
  description:
    "WEBBED builds future-ready websites, custom software, AI systems, automations, digital products, and practical technology education.",
  publisher: {
    "@type": "Organization",
    name: "WEBBED",
    logo: "https://webbed.in/logo.png",
  },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${satoshi.variable} ${satoshiVariable.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <PageViewTracker />
        <CookieConsent />
        <PageTransition>
          <div className="flex-1">{children}</div>
        </PageTransition>
      </body>
    </html>
  );
}
