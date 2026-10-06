"use client"

import { IconChevronLeft } from "@tabler/icons-react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import type { ReactNode } from "react"

import {
  HEADER,
  HEADER_ART,
  HEADER_BACK,
  HEADER_DATE,
  HEADER_HEADLINE,
  HEADER_TITLE,
} from "@/components/article/article-layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { tap as tapSound } from "@/lib/audio"
import { staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"

// The entrance is a stagger, but the way back is in the route's shell and the
// rest streams in with the post, so each piece carries its own delay rather
// than waiting on a parent to orchestrate it.
const STAGGER = { back: 0.04, title: 0.12, date: 0.2, art: 0.28 }

// The server renders the hidden state, so variants stay on even when motion
// is reduced (without them nothing animates it back in); reduced motion keeps
// the fade and drops the rise.
function useItem(delay: number) {
  const reduced = useReducedMotion() ?? false
  return staggerItem(reduced ? 0 : 12, delay)
}

/**
 * A post's opening, on the geometry of the ziiz X clone's: a row from lg with
 * the way back and title on the left and the post's pattern (400x244) on the
 * right, the section link level with the art's top and the title and date
 * sitting on its bottom, then a rule. Below lg it stacks, the art under the
 * date at 2:1. The ghost back button hangs into the gutter so the chevron's
 * ink, not its hit area, lines up with the title.
 *
 * The way back only knows the section, so it renders with the route's shell;
 * `children` is the headline, which waits on the post.
 */
export function ArticleHeader({
  section,
  children,
}: {
  /** The list this post belongs to, where the back button returns. */
  section: { href: string; label: string }
  children: ReactNode
}) {
  const item = useItem(STAGGER.back)

  return (
    <header className={HEADER}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={item}
        className={HEADER_BACK}
      >
        <Button
          variant="ghost"
          shape="rounded"
          size="icon-sm"
          aria-label={`Back to ${section.label}`}
          nativeButton={false}
          onClick={() => tapSound()}
          className="-ms-3 text-gray-900"
          render={<Link href={section.href} />}
        >
          <IconChevronLeft />
        </Button>
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="shrink-0">
              <BreadcrumbLink
                onClick={() => tapSound()}
                render={<Link href={section.href} />}
              >
                {section.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>
      {children}
    </header>
  )
}

/** The title, date and art: two cells of the header's grid. */
export function ArticleHeadline({
  title,
  date,
  displayDate,
  art,
}: {
  title: string
  date: string
  displayDate: string
  /** The post's pattern, staged on the server. */
  art: ReactNode
}) {
  const titleItem = useItem(STAGGER.title)
  const dateItem = useItem(STAGGER.date)
  const artItem = useItem(STAGGER.art)

  return (
    <>
      <div className={HEADER_HEADLINE}>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={titleItem}
          className={cn(HEADER_TITLE, "text-balance text-gray-1000")}
        >
          {title}
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={dateItem}
          className={cn(HEADER_DATE, "text-gray-900")}
        >
          <time dateTime={date}>{displayDate}</time>
        </motion.p>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={artItem}
        aria-hidden
        className={HEADER_ART}
      >
        {art}
      </motion.div>
    </>
  )
}
