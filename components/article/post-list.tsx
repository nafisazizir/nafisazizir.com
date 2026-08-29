"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

import { ContactFooter } from "@/components/contact-footer"
import { track } from "@/lib/analytics/events"
import { EASE_OUT } from "@/lib/motion"
import { formatDate } from "@/lib/utils"

export interface PostListItem {
  slug: string
  title: string
  description?: string
  date: string
  tags: string[]
  cover?: string
}

export function PostList({
  items,
  basePath,
}: {
  items: PostListItem[]
  basePath: string
}) {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="mx-auto w-full max-w-336 px-6 pt-28 pb-24 sm:pt-32">
        <ul className="grid grid-cols-1 gap-x-17 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.li
              key={item.slug}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.28, ease: EASE_OUT, delay: 0.06 + i * 0.04 }
              }
            >
              <Link
                href={`${basePath}/${item.slug}`}
                onClick={() =>
                  track("post opened", {
                    slug: item.slug,
                    kind: basePath === "/projects" ? "project" : "blog",
                    from: basePath,
                    position: i + 1,
                  })
                }
                className="group flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-gray-alpha-600 focus-visible:ring-offset-4 focus-visible:ring-offset-background-100"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  {item.cover ? (
                    <Image
                      src={item.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale"
                    />
                  ) : null}
                </div>

                <h2 className="mt-5 text-heading-20 text-balance text-gray-1000">
                  {item.title}
                </h2>

                {item.description ? (
                  <p className="mt-2 line-clamp-3 text-copy-14 text-gray-900">
                    {item.description}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center gap-1.5 pt-5 text-label-13 text-gray-900">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  <span
                    aria-hidden
                    className="-translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <ContactFooter />
      </div>
    </div>
  )
}
