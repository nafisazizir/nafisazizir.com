"use client"

import { motion, useReducedMotion } from "framer-motion"

import { DURATION, EASE_OUT } from "@/lib/motion"

/**
 * `template.tsx` re-mounts on every navigation, so this gives every route a
 * uniform, unobtrusive entrance. It stays opacity-only on purpose: pages that
 * add their own rise/stagger (lists, About, articles) compose cleanly on top
 * without fighting a second transform.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduced ? { duration: 0 } : { duration: DURATION.fast, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
