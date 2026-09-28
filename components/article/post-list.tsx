"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

import { PostCover } from "@/components/article/post-cover"
import { ContactFooter } from "@/components/contact-footer"
import { track } from "@/lib/analytics/events"
import { EASE_OUT } from "@/lib/motion"
import { formatDate } from "@/lib/format"

export interface PostListItem {
  slug: string
  title: string
  description?: string
  date: string
  tags: string[]
  cover?: string
  coverPoster?: string
}

const FEATURED_COUNT = 3

export function PostList({
  items,
  basePath,
}: {
  items: PostListItem[]
  basePath: string
}) {
  const reduced = useReducedMotion() ?? false
  // Which featured card is hovered or focused; drives video-cover playback.
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const featured = items.slice(0, FEATURED_COUNT)
  const rest = items.slice(FEATURED_COUNT)

  const kind = basePath === "/projects" ? "project" : "blog"
  const trackOpen = (item: PostListItem, index: number) =>
    track("post opened", {
      slug: item.slug,
      kind,
      from: basePath,
      position: index + 1,
    })

  const enter = (i: number) =>
    reduced
      ? { duration: 0 }
      : { duration: 0.28, ease: EASE_OUT, delay: 0.06 + i * 0.04 }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="mx-auto w-full max-w-336 px-6 pt-28 pb-24 sm:pt-32">
        <ul className="grid grid-cols-1 gap-x-17 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <motion.li
              key={item.slug}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(i)}
            >
              <Link
                href={`${basePath}/${item.slug}`}
                onClick={() => trackOpen(item, i)}
                onMouseEnter={() => setActiveSlug(item.slug)}
                onMouseLeave={() =>
                  setActiveSlug((s) => (s === item.slug ? null : s))
                }
                onFocus={() => setActiveSlug(item.slug)}
                onBlur={() =>
                  setActiveSlug((s) => (s === item.slug ? null : s))
                }
                className="group flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-gray-alpha-600 focus-visible:ring-offset-4 focus-visible:ring-offset-background-100"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  {item.cover ? (
                    <PostCover
                      src={item.cover}
                      poster={item.coverPoster}
                      active={activeSlug === item.slug}
                      reduced={reduced}
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

        {rest.length > 0 ? (
          <ul className="mt-20 flex flex-col border-t border-gray-alpha-400">
            {rest.map((item, i) => (
              <motion.li
                key={item.slug}
                className="border-b border-gray-alpha-400"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={enter(featured.length + i)}
              >
                <Link
                  href={`${basePath}/${item.slug}`}
                  onClick={() => trackOpen(item, featured.length + i)}
                  className="group flex items-baseline justify-between gap-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-gray-alpha-600"
                >
                  <h2 className="text-heading-16 text-gray-1000">
                    {item.title}
                  </h2>
                  <div className="flex shrink-0 items-center gap-1.5 text-label-13 text-gray-900">
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
        ) : null}

        <ContactFooter />
      </div>
    </div>
  )
}
