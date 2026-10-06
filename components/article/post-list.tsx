"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import { track } from "@/lib/analytics/events"
import { formatDate } from "@/lib/format"
import { EASE_OUT, staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface PostListItem {
  slug: string
  title: string
  description?: string
  date: string
  /** The post's pattern, already staged on the server (see lib/post-art). */
  art: ReactNode
}

// The stage a card's pattern is placed on. At 8:5 the stage's half-height
// cap doesn't bind, so the frame takes 90% of the width under a 5% margin
// and its bottom edge lands at 5% + 90% × 5/16 = 33.125% of the width,
// where the card cuts the art off.
const STAGE_RATIO = 8 / 5
const ART_HEIGHT = "33.125%"

// Past this many cards the stagger stops growing, so a long list doesn't
// keep its last cards waiting.
const MAX_STAGGER = 8

// How long a pattern's clock takes to come up to speed when a card is
// hovered, and to wind down when it's left, in ms. The rate eases rather
// than switching, so the loop starts and stops like a machine, not a video.
const SPIN_UP = 450
const SPIN_DOWN = 800
const easeOut = (t: number) => 1 - (1 - t) ** 3

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
      <ul className="group/list grid grid-cols-1 gap-x-4 gap-y-10 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
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

// A panel of the post's pattern over its title, then the date, a three-line
// description and a pill pushed to the card's bottom edge so every card in
// a row ends level. The art is cut off at the pattern's frame, which nothing
// leaves through the bottom, so the panel grows with the title rather than
// with the card's width. The title is 24px at every width in a 16px pad,
// bottom-aligned in room for three lines so last lines align across a row;
// a longer title grows the panel instead of reaching the art. Its box is
// trimmed to cap height and baseline, so the pad is measured to the ink.
// The whole card is one link. Hovering it runs its pattern and dims the
// others, as the X clone's feature grid does; the dim sits on the <li>
// because framer leaves an inline opacity on the entrance wrapper.
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
  const link = useRef<HTMLAnchorElement>(null)
  const play = usePatternPlay(link)

  return (
    <li className="transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-has-[li:hover]/list:not-hover:opacity-50 md:h-full">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT, delay }
        }
        className="md:h-full"
      >
        <Link
          ref={link}
          href={href}
          onClick={onOpen}
          onPointerEnter={play.onPointerEnter}
          onPointerLeave={play.onPointerLeave}
          onFocus={play.onFocus}
          onBlur={play.onBlur}
          data-hover-play
          className="group/card flex flex-col gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-600 md:h-full"
        >
          <div className="bg-gray-100">
            <div
              className="relative overflow-hidden"
              style={{ paddingBottom: ART_HEIGHT }}
            >
              <AspectRatio
                ratio={STAGE_RATIO}
                className="absolute inset-x-0 top-0"
              >
                {item.art}
              </AspectRatio>
            </div>
            <div className="flex min-h-[calc(2lh+1cap+2rem)] flex-col justify-end p-4 text-heading-24">
              <p className="text-balance text-gray-1000 [text-box:trim-both_cap_alphabetic]">
                {item.title}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <time
                dateTime={item.date}
                className="text-label-13 text-gray-900"
              >
                {formatDate(item.date)}
              </time>
              {item.description ? (
                <p className="line-clamp-3 text-copy-13 text-gray-900">
                  {item.description}
                </p>
              ) : null}
            </div>
            {/* A button's look, not a button: the card is the link. */}
            <span
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                  shape: "rounded",
                }),
                "mt-auto w-min group-hover/card:bg-gray-200"
              )}
            >
              Read more
            </span>
          </div>
        </Link>
      </motion.div>
    </li>
  )
}

// Runs a card's pattern while the card is hovered, or focused from the
// keyboard. The stage's clock is a CSS animation, held paused on hover
// devices by globals.css; this takes it over through the Web Animations API
// and eases its playback rate up and down. Touch screens have no hover, so
// there the stage plays while it's on screen, as ziiz stages do. Under
// reduced motion the clock doesn't exist and none of this does anything.
function usePatternPlay(ref: RefObject<HTMLElement | null>) {
  const state = useRef({ hover: false, focus: false, frame: 0 })

  useEffect(() => {
    const s = state.current
    return () => cancelAnimationFrame(s.frame)
  }, [])

  const update = useCallback(() => {
    const s = state.current
    const to = s.hover || s.focus ? 1 : 0
    const clocks = ref.current?.querySelector("svg")?.getAnimations() ?? []
    if (!clocks.length) return

    cancelAnimationFrame(s.frame)
    const from = clocks[0].playState === "running" ? clocks[0].playbackRate : 0
    if (from === to) return
    const duration = (to ? SPIN_UP : SPIN_DOWN) * Math.abs(to - from)
    const start = performance.now()
    if (to) {
      for (const clock of clocks) {
        clock.playbackRate = from
        clock.play()
      }
    }
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const rate = from + (to - from) * easeOut(t)
      for (const clock of clocks) clock.playbackRate = rate
      if (t < 1) s.frame = requestAnimationFrame(step)
      else if (!to) for (const clock of clocks) clock.pause()
    }
    s.frame = requestAnimationFrame(step)
  }, [ref])

  const onPointerEnter = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "touch" || !hovers()) return
      state.current.hover = true
      update()
    },
    [update]
  )
  const onPointerLeave = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "touch" || !hovers()) return
      state.current.hover = false
      update()
    },
    [update]
  )
  const onFocus = useCallback(
    (e: FocusEvent) => {
      if (!hovers() || !e.currentTarget.matches(":focus-visible")) return
      state.current.focus = true
      update()
    },
    [update]
  )
  const onBlur = useCallback(() => {
    if (!state.current.focus) return
    state.current.focus = false
    update()
  }, [update])

  return { onPointerEnter, onPointerLeave, onFocus, onBlur }
}

const hovers = () => window.matchMedia("(hover: hover)").matches
