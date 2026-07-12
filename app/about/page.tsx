import type { Metadata } from "next"

import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About",
  description:
    "Nafis Azizi Riza — a software engineer in Brisbane building at the intersection of AI and developer tooling.",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="relative mx-auto w-full max-w-160 px-6 pt-28 pb-32 sm:pt-32">
        <AboutContent />
      </div>
    </div>
  )
}
