import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";

export const metadata: Metadata = {
  title: "TERMS OF SERVICE | WEBBED",
  description:
    "WEBBED Terms of Service — the terms and conditions governing your use of the WEBBED website, services, and content. Please read these terms carefully.",
  keywords: ["WEBBED", "terms of service", "terms", "conditions", "legal"],
  openGraph: {
    title: "TERMS OF SERVICE | WEBBED",
    description:
      "WEBBED Terms of Service — the terms and conditions governing your use of the WEBBED website, services, and content.",
    url: "https://webbed.in/terms-of-service",
    siteName: "WEBBED",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "WEBBED — technology company building AI software, websites, and digital products" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TERMS OF SERVICE | WEBBED",
    description:
      "WEBBED Terms of Service — the terms and conditions governing your use of the WEBBED website, services, and content.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://webbed.in/terms-of-service" },
};

export default function TermsOfServicePage() {
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
              "radial-gradient(circle at center, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0) 65%)",
            filter: "blur(120px)",
          }}
        />

        <article className="relative mx-auto max-w-[820px] px-6 sm:px-10">
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
            Terms and Conditions
          </h1>

          <p className="mt-4 text-[13px] uppercase tracking-[0.22em] text-white/45">
            Effective Date: <span className="text-white/70">01-08-2026</span>
          </p>

          <div
            className="prose-policy mt-12 space-y-10 text-[16px] leading-[1.85] text-white/75"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <p>Welcome to WEBBED.</p>
            <p>
              These Terms and Conditions govern your access to and use of the
              WEBBED website and any information, content, or services made
              available through it. By accessing or using this website, you
              agree to be bound by these Terms and Conditions. If you do not
              agree with any part of these terms, please do not use this
              website.
            </p>

            <Section title="About WEBBED">
              <p>
                WEBBED is a technology company operating through multiple
                divisions, including WEBBED Solutions, WEBBED Labs, and WEBBED
                Schools. Through these divisions, we build software, digital
                products, AI solutions, educational initiatives, and other
                technology-driven services.
              </p>
            </Section>

            <Section title="Use of the Website">
              <p>
                You agree to use this website only for lawful purposes and in a
                manner that does not interfere with the operation of the
                website or the experience of other users.
              </p>
              <p>You agree not to:</p>
              <ul>
                <li>Use the website for any unlawful or fraudulent activity.</li>
                <li>Attempt to gain unauthorized access to our systems or servers.</li>
                <li>Upload or transmit viruses, malicious code, or harmful software.</li>
                <li>
                  Copy, reproduce, distribute, or modify any website content
                  without written permission.
                </li>
                <li>Use the website in any way that may damage or impair its functionality.</li>
              </ul>
            </Section>

            <Section title="Intellectual Property">
              <p>
                Unless otherwise stated, all content on this website, including
                text, graphics, branding, logos, icons, images, videos,
                software, designs, source code, and other materials, is the
                exclusive property of WEBBED and is protected by applicable
                intellectual property laws.
              </p>
              <p>
                You may not reproduce, copy, distribute, modify, publish, or
                use any content from this website without prior written
                permission from WEBBED.
              </p>
            </Section>

            <Section title="Project Inquiries">
              <p>
                Submitting an inquiry, requesting a quotation, or contacting
                WEBBED through this website does not establish a client
                relationship or create any contractual obligation.
              </p>
              <p>
                A project is considered accepted only after both parties have
                agreed in writing to the scope, pricing, and applicable terms.
              </p>
            </Section>

            <Section title="Services">
              <p>WEBBED provides technology services including, but not limited to:</p>
              <ul>
                <li>Website Development</li>
                <li>Web Application Development</li>
                <li>Mobile Application Development</li>
                <li>Custom Software Development</li>
                <li>Artificial Intelligence Solutions</li>
                <li>AI Automation</li>
                <li>UI/UX Design</li>
                <li>Branding</li>
                <li>Search Engine Optimization</li>
                <li>Consulting and related digital services</li>
              </ul>
              <p>
                Specific deliverables, timelines, pricing, ownership, and
                responsibilities will always be governed by separate project
                agreements or proposals.
              </p>
            </Section>

            <Section title="WEBBED Labs and WEBBED Schools">
              <p>
                Products, research initiatives, educational programs, beta
                releases, and experimental technologies developed under WEBBED
                Labs or WEBBED Schools may be updated, modified, discontinued,
                or made publicly available at our discretion.
              </p>
              <p>
                Participation in beta programs or educational initiatives may
                be subject to additional terms where applicable.
              </p>
            </Section>

            <Section title="Third Party Services">
              <p>
                This website may contain links to third party websites,
                platforms, or services for your convenience.
              </p>
              <p>
                WEBBED is not responsible for the content, security,
                availability, or privacy practices of any third party websites.
              </p>
            </Section>

            <Section title="Disclaimer">
              <p>
                The information provided on this website is intended for
                general informational purposes only.
              </p>
              <p>
                While we make every effort to ensure the information is
                accurate and up to date, WEBBED makes no guarantees regarding
                the completeness, accuracy, reliability, or availability of any
                information presented on this website.
              </p>
              <p>
                The website and its content are provided on an &quot;as is&quot; and &quot;as
                available&quot; basis.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the fullest extent permitted by applicable law, WEBBED
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from or relating to
                your use of this website.
              </p>
              <p>
                This includes, but is not limited to, damages resulting from
                loss of data, interruption of business, loss of profits, or
                website unavailability.
              </p>
            </Section>

            <Section title="Privacy">
              <p>
                Your use of this website is also governed by our Privacy
                Policy, which explains how we collect, use, and protect your
                information.
              </p>
            </Section>

            <Section title="Changes to These Terms">
              <p>
                WEBBED reserves the right to modify or update these Terms and
                Conditions at any time without prior notice.
              </p>
              <p>
                Changes become effective immediately upon publication on this
                page. Continued use of the website after changes are posted
                constitutes acceptance of the updated Terms and Conditions.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These Terms and Conditions shall be governed by and interpreted
                in accordance with the laws of the Republic of India.
              </p>
              <p>
                Any disputes arising from these Terms and Conditions shall be
                subject to the exclusive jurisdiction of the competent courts
                in Chennai, Tamil Nadu, India.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have any questions regarding these Terms and Conditions,
                please contact us:
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
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-[12px] uppercase tracking-[0.22em] text-white/45">
            <a href="/" className="transition hover:text-white">
              ← Back to home
            </a>
            <a href="/privacy-policy" className="transition hover:text-white">
              Privacy Policy →
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
