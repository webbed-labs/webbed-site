import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";

export const metadata: Metadata = {
  title: "PRIVACY POLICY | WEBBED",
  description:
    "WEBBED Privacy Policy — how we collect, use, and protect your information when you visit our website or interact with our services. Your privacy matters to us.",
  keywords: ["WEBBED", "privacy policy", "data protection", "privacy", "terms"],
  openGraph: {
    title: "PRIVACY POLICY | WEBBED",
    description:
      "WEBBED Privacy Policy — how we collect, use, and protect your information when you visit our website or interact with our services.",
    url: "https://webbed.in/privacy-policy",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRIVACY POLICY | WEBBED",
    description:
      "WEBBED Privacy Policy — how we collect, use, and protect your information.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Ambient backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[80vw] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 65%)",
            filter: "blur(120px)",
          }}
        />

        <article className="relative mx-auto max-w-[820px] px-6 sm:px-10">
          {/* Eyebrow */}
          <p
            className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/35"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Legal
          </p>

          <h1
            className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
          </h1>

          <p className="mt-4 text-[13px] uppercase tracking-[0.22em] text-white/45">
            Effective Date: <span className="text-white/70">01-08-2026</span>
          </p>

          {/* Body */}
          <div
            className="prose-policy mt-12 space-y-10 text-[16px] leading-[1.85] text-white/75"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <p>
              At WEBBED, we value your privacy. This Privacy Policy explains how we
              collect, use, and protect the information you share with us when you
              visit our website or interact with our services.
            </p>

            <Section title="Information We Collect">
              <p>We may collect information that you voluntarily provide, including:</p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Project details or inquiries submitted through our contact forms</li>
              </ul>
              <p>We may also collect basic technical information automatically, such as:</p>
              <ul>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Pages visited</li>
                <li>Date and time of your visit</li>
              </ul>
              <p>This information helps us improve our website and services.</p>
            </Section>

            <Section title="How We Use Your Information">
              <p>We use your information to:</p>
              <ul>
                <li>Respond to inquiries</li>
                <li>Discuss potential projects</li>
                <li>Improve our website and user experience</li>
                <li>Send important updates related to your inquiry</li>
                <li>Maintain the security of our website</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </Section>

            <Section title="Cookies">
              <p>
                Our website may use cookies and similar technologies to improve
                your browsing experience and understand website traffic.
              </p>
              <p>You can choose to disable cookies through your browser settings.</p>
            </Section>

            <Section title="Third Party Services">
              <p>
                We may use trusted third party services such as analytics
                providers, hosting providers, communication tools, and cloud
                infrastructure partners. These services may process limited
                information necessary to perform their functions.
              </p>
            </Section>

            <Section title="Data Security">
              <p>
                We take reasonable measures to protect your information against
                unauthorized access, alteration, disclosure, or destruction. While
                no system can guarantee complete security, we continuously work to
                maintain appropriate safeguards.
              </p>
            </Section>

            <Section title="External Links">
              <p>
                Our website may contain links to third party websites. We are not
                responsible for the privacy practices or content of those websites.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>Depending on your location, you may have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Request corrections</li>
                <li>Request deletion of your information</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p>To make a request, please contact us using the details below.</p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have any questions about this Privacy Policy or how your
                information is handled, please contact us.
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:contact@webbed.in"
                  className="text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                >
                  contact@webbed.in
                </a>
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be published on this page with an updated effective date.
              </p>
            </Section>
          </div>

          {/* Footer nav */}
          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-[12px] uppercase tracking-[0.22em] text-white/45">
            <a href="/" className="transition hover:text-white">
              ← Back to home
            </a>
            <a href="/terms-of-service" className="transition hover:text-white">
              Terms of Service →
            </a>
          </div>
        </article>
      </main>

      <CinematicFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold leading-[1.2] tracking-[-0.01em] text-white"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-white/70">
        {children}
      </div>
    </section>
  );
}
