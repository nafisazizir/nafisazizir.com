"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"

import { formatDate } from "@/lib/utils"

export interface PostListItem {
  slug: string
  title: string
  description?: string
  date: string
  tags: string[]
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function PostList({
  items,
  basePath,
  heading,
}: {
  items: PostListItem[]
  basePath: string
  heading: string
}) {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="mx-auto w-full max-w-160 px-6 pt-28 pb-24 sm:pt-32">
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.3, ease: EASE_OUT }
          }
        >
          <h1 className="px-4 text-2xl font-[450] tracking-tight text-foreground">
            {heading}
          </h1>
        </motion.header>

        <ul className="mt-10 flex flex-col gap-4">
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
                className="group block rounded-lg px-4 py-3 transition-all duration-200 hover:bg-muted/50"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[15px] font-[450] tracking-tight text-foreground transition-colors">
                    {item.title}
                  </h2>
                  <time
                    dateTime={item.date}
                    className="shrink-0 text-xs text-muted-foreground"
                  >
                    {formatDate(item.date)}
                  </time>
                </div>
                {item.description ? (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
