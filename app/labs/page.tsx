import type { Metadata } from "next"
import Link from "next/link"

import { ContactFooter } from "@/components/contact-footer"
import { EdgeFade } from "@/components/edge-fade"
import { LabArt } from "@/components/labs/lab-art"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { formatDate } from "@/lib/format"
import { labs } from "@/lib/labs"

export const metadata: Metadata = {
  title: "Labs",
  description: "Playgrounds, toys and works in progress.",
}

// The labs index: the list pages' headline and column, with each card's art
// rendered live by the lab itself.
export default function LabsPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <EdgeFade side="top" />
      <main className="mx-auto flex w-full max-w-327.5 flex-col gap-10 px-5 pt-20 pb-32 md:px-6 lg:gap-16 lg:pt-24">
        <h1 className="text-heading-40 text-balance text-gray-1000 sm:text-heading-48 md:max-w-[75%]">
          Labs:
          <span className="block text-gray-900">
            playgrounds, toys and works in progress
          </span>
        </h1>
        <ul className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {labs.map((lab) => (
            <li key={lab.slug}>
              <Link
                href={`/labs/${lab.slug}`}
                className="group/card flex flex-col gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-600"
              >
                <div className="overflow-hidden bg-gray-100">
                  <AspectRatio ratio={16 / 9}>
                    <div className="size-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:scale-[1.03]">
                      <LabArt slug={lab.slug} />
                    </div>
                  </AspectRatio>
                  <p className="p-4 text-heading-24 text-gray-1000">
                    {lab.title}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <time
                    dateTime={lab.date}
                    className="text-label-13 text-gray-900"
                  >
                    {formatDate(lab.date)}
                  </time>
                  <p className="line-clamp-3 text-copy-13 text-gray-900">
                    {lab.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <ContactFooter className="mt-8" />
      </main>
      <EdgeFade side="bottom" />
    </div>
  )
}
