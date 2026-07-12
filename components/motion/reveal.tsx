"use client"

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

import { DURATION, EASE_OUT } from "@/lib/motion"

interface RevealProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  delay?: number
  y?: number
  duration?: number
}

/**
 * A one-shot fade-and-rise on mount, respecting `prefers-reduced-motion`.
 * The default building block for page and section entrances.
 */
export function Reveal({
  delay = 0,
  y = 12,
  duration = DURATION.base,
  children,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
