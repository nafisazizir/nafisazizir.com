import type { Transition, Variants } from "framer-motion"

// Shared entrance easing — a gentle, slightly overshooting ease-out used across
// every page and component so the whole site moves with one voice.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  fast: 0.25,
  base: 0.5,
  slow: 0.7,
} as const

// A single fade-and-rise, tuned per call site via `delay` / `y` / `duration`.
export function fadeUp(
  delay = 0,
  y = 12,
  duration: number = DURATION.base
): { initial: { opacity: number; y: number }; animate: { opacity: number; y: number }; transition: Transition } {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, ease: EASE_OUT, delay },
  }
}

// Container/item variants for staggered reveals (About paragraphs, lists, etc.).
export const staggerContainer = (
  gap = 0.08,
  delayChildren = 0.06
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: gap, delayChildren },
  },
})

export const staggerItem = (y = 12): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
})
