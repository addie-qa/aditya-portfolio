import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Outfit } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const description =
  "Aditya Arora is a QA automation engineer working with Playwright, TypeScript, Cypress, Selenium, Appium, API testing, JMeter, and CI. Open to SDET and senior QA automation interviews.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Aditya Arora — SDET & QA Automation",
    template: "%s — Aditya Arora",
  },
  description,
  keywords: [
    "Aditya Arora",
    "SDET",
    "QA Automation",
    "Playwright",
    "Cypress",
    "Selenium",
    "Appium",
    "JMeter",
    "API testing",
  ],
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aditya Arora — I don't just test software. I challenge it.",
    description,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Arora — I don't just test software. I challenge it.",
    description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  jobTitle: "Frontend Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Techsphere",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "RIMT University",
  },
  sameAs: [site.linkedin, site.github],
  knowsAbout: [
    "Playwright",
    "Cypress",
    "Selenium",
    "Appium",
    "API testing",
    "JMeter",
    "CI/CD",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-lilac focus:px-4 focus:py-2 focus:text-void"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
