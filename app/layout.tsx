import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { Nav } from "@/components/nav"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${site.name} — Feed` },
      ],
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: site.twitterHandle,
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  jobTitle: "Software Engineer",
  description: site.description,
  sameAs: [site.github, site.twitter],
}

// InterVariable from the official rsms 4.1 release — same files satori's
// static cuts are instanced from, so site and OG images match.
const inter = localFont({
  src: [
    {
      path: "../assets/fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
