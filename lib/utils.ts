import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The ziiz type roles (`text-label-14`, `text-button-12`, `text-heading-24`, …)
 * are custom utilities, so stock tailwind-merge falls back to treating any
 * unknown `text-*` class as a text *color*. That put a role and a ramp color in
 * the same conflict group, and the color — always written last — silently
 * dropped the role. Registering the roles as font-size keeps the two orthogonal,
 * while role-vs-role (e.g. a button size overriding the base) still collapses.
 */
const isTypeRole = (value: string) =>
  /^(heading|button|label|copy)-\d+(-mono)?$/.test(value)

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [isTypeRole] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Covers are stills by default; a clip extension switches to the video path. */
export function isVideoCover(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src)
}
