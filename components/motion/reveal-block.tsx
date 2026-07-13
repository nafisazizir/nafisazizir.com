"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ComponentType } from "react"

import { EASE_OUT } from "@/lib/motion"

/**
 * Scroll-triggered fade-and-rise for a single block-level element, ported from
 * the avatars docs page (its `<Col>` reveal). Unlike a wrapping <div>, this
 * renders the *actual* tag (motion.h2, motion.p, …) so the typeset CSS — which
 * leans on tag adjacency (`h2 + p`), `:first-child`, and heading ids from
 * rehype-slug — keeps working untouched.
 *
 * Transform + opacity only, fired once when the block scrolls into view, so it
 * never reflows the page or disturbs the sticky TOC's scroll-spy.
 */
const reveal = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: { duration: 0.4, ease: EASE_OUT },
} as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeReveal(tag: keyof typeof motion): ComponentType<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const M = motion[tag] as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function RevealBlock(props: any) {
    const reduced = useReducedMotion() ?? false
    // Reduced motion: render the same host element, just skip the animation.
    if (reduced) return <M initial={false} {...props} />
    return <M {...reveal} {...props} />
  }
}

export const revealBlocks = {
  h2: makeReveal("h2"),
  h3: makeReveal("h3"),
  h4: makeReveal("h4"),
  p: makeReveal("p"),
  ul: makeReveal("ul"),
  ol: makeReveal("ol"),
  blockquote: makeReveal("blockquote"),
  pre: makeReveal("pre"),
  table: makeReveal("table"),
  hr: makeReveal("hr"),
}
