"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import type { ReactNode } from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics/events"
import { formatDate } from "@/lib/format"
import { EASE_OUT, staggerItem } from "@/lib/motion"

export interface PostListItem {
  slug: string
  title: string
  description?: string
  date: string
  /** The post's pattern, already staged on the server (see lib/post-art). */
  art: ReactNode
}

// Card art and the article header's art share one ratio.
export const CARD_RATIO = 8 / 5

// Past this many cards the stagger stops growing, so a long list doesn't
// keep its last cards waiting.
const MAX_STAGGER = 8

/**
 * Every post at once, newest first: a two-line headline set as x.com sets
 * its section titles, the second line in the secondary grey, then the cards
 * of the ziiz X clone's blog list in a grid that stacks, goes to two columns
 * from md and three from xl, where the cards reach x.com's 410px.
 */
export function PostList({
  items,
  basePath,
  title,
  subtitle,
}: {
  items: PostListItem[]
  basePath: string
  title: ReactNode
  subtitle: ReactNode
}) {
  // The server renders the hidden state, so the headline's variants stay on
  // even when motion is reduced; reduced motion keeps the fade, drops the rise.
  const reduced = useReducedMotion() ?? false
  const kind = basePath === "/projects" ? "project" : "blog"

  return (
    <section className="flex flex-col gap-10 lg:gap-16">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={staggerItem(reduced ? 0 : 12)}
        className="text-heading-40 text-balance text-gray-1000 sm:text-heading-48 md:max-w-[75%]"
      >
        {title}
        <span className="block text-gray-900">{subtitle}</span>
      </motion.h1>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-10 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <Card
            key={item.slug}
            item={item}
            href={`${basePath}/${item.slug}`}
            reduced={reduced}
            delay={0.06 + Math.min(i, MAX_STAGGER) * 0.04}
            onOpen={() =>
              track("post opened", {
                slug: item.slug,
                kind,
                from: basePath,
                position: i + 1,
              })
            }
          />
        ))}
      </ul>
    </section>
  )
}

// The 8:5 art with the title set inside it, bottom left, then the date, a
// three-line description and a pill pushed to the card's bottom edge so
// every card in a row ends level. The pattern hangs from the top of its
// panel, which leaves the bottom clear for the title. The title steps down
// with the card (24px from 400px wide, 20px from 336px, 16px below) so three
// lines never reach the art.
function Card({
  item,
  href,
  reduced,
  delay,
  onOpen,
}: {
  item: PostListItem
  href: string
  reduced: boolean
  delay: number
  onOpen: () => void
}) {
  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT, delay }
      }
      className="flex flex-col gap-2 md:h-full"
    >
      <Link
        href={href}
        aria-hidden
        tabIndex={-1}
        onClick={onOpen}
        className="block"
      >
        <AspectRatio
          ratio={CARD_RATIO}
          className="@container w-full overflow-hidden bg-gray-100"
        >
          <div className="absolute inset-0">{item.art}</div>
          <p className="absolute inset-x-4 bottom-4 text-heading-16 text-balance text-gray-1000 @min-[21rem]:text-heading-20 @min-[25rem]:text-heading-24">
            {item.title}
          </p>
        </AspectRatio>
      </Link>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <time dateTime={item.date} className="text-label-13 text-gray-900">
            {formatDate(item.date)}
          </time>
          {item.description ? (
            <p className="line-clamp-3 text-copy-13 text-gray-900">
              {item.description}
            </p>
          ) : null}
        </div>
        <Button
          shape="rounded"
          size="sm"
          variant="secondary"
          className="mt-auto w-min"
          nativeButton={false}
          onClick={onOpen}
          render={<Link href={href} />}
        >
          Read more
        </Button>
      </div>
    </motion.li>
  )
}
