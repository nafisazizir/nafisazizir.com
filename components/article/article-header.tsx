"use client"

import { IconChevronLeft } from "@tabler/icons-react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

import { PostCover } from "@/components/article/post-cover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { tap as tapSound } from "@/lib/audio"
import { staggerContainer, staggerItem } from "@/lib/motion"

const COVER_SIZES = "(min-width: 1024px) 400px, 100vw"

/**
 * A post's opening, on the geometry of the ziiz X clone's: a row from lg with
 * the way back and title on the left and the cover (400x244) on the right,
 * the section link level with the cover's top and the title and date sitting on
 * its bottom, then a rule. Below lg it stacks, the cover under the date at
 * 2:1. The ghost back button hangs into the gutter so the chevron's ink, not
 * its hit area, lines up with the title.
 */
export function ArticleHeader({
  title,
  date,
  displayDate,
  section,
  cover,
  coverPoster,
}: {
  title: string
  date: string
  displayDate: string
  /** The list this post belongs to, where the back button returns. */
  section: { href: string; label: string }
  cover?: string
  coverPoster?: string
}) {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem()
  // A clip cover runs only while the pointer is on it, as it does in the list.
  const [coverActive, setCoverActive] = useState(false)

  return (
    <motion.header
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : staggerContainer(0.08, 0.04)}
      className="flex flex-col border-b border-gray-alpha-400 pb-6 lg:flex-row lg:items-start lg:justify-between lg:gap-4 lg:pb-30"
    >
      <div className="flex min-w-0 flex-col lg:min-h-61 lg:max-w-180 lg:flex-1">
        <motion.div
          variants={item}
          className="flex min-w-0 shrink-0 items-center gap-4"
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

        <div className="flex flex-1 flex-col justify-end gap-4 pt-6 lg:pt-8">
          <motion.h1
            variants={item}
            className="text-heading-32 text-balance text-gray-1000 sm:text-heading-40 lg:text-heading-48"
          >
            {title}
          </motion.h1>
          <motion.p variants={item} className="text-label-13 text-gray-900">
            <time dateTime={date}>{displayDate}</time>
          </motion.p>
        </div>
      </div>

      <motion.div
        variants={item}
        aria-hidden
        onMouseEnter={() => setCoverActive(true)}
        onMouseLeave={() => setCoverActive(false)}
        className="relative mt-6 aspect-2/1 w-full shrink-0 overflow-hidden lg:mt-0 lg:aspect-auto lg:h-61 lg:w-100"
      >
        {cover ? (
          <PostCover
            src={cover}
            poster={coverPoster}
            active={coverActive}
            reduced={reduced}
            sizes={COVER_SIZES}
            priority
          />
        ) : (
          // No art yet: the slot holds its place so the row keeps its shape.
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </motion.div>
    </motion.header>
  )
}
