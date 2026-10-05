import { patterns, type PatternEntry } from "@/components/patterns"
import type { Post } from "@/lib/content"

// The frontmatter name of a pattern is its catalogue label in kebab case:
// "Binary tree" is `binary-tree`, "Fan-in" is `fan-in`.
const nameOf = (entry: PatternEntry) =>
  entry.label.toLowerCase().replace(/\s+/g, "-")

// The first eleven patterns in ziiz (#30) are redrawn from x.com's own art.
// The site only wears the ones ziiz drew itself, so these are never picked,
// even when a post names one.
const FROM_X = new Set([
  "bowl",
  "columns",
  "corner-notch",
  "lens",
  "notch",
  "quadrant",
  "slots",
  "spread",
  "steps",
  "wedge",
  "wedge-mirror",
])

const usable = patterns.filter((entry) => !FROM_X.has(nameOf(entry)))
const byName = new Map(usable.map((entry) => [nameOf(entry), entry]))

/**
 * The pattern a post wears: the one its frontmatter names, or, when it names
 * none (or one that doesn't exist or is x.com's), one picked from its slug so
 * the choice is stable between builds. Server-only: it pulls in every pattern.
 */
export function patternFor(post: Post): PatternEntry {
  const named = post.frontmatter.pattern
  const entry = named ? byName.get(named) : undefined
  if (entry) return entry
  if (named && process.env.NODE_ENV !== "production") {
    const why = FROM_X.has(named) ? "is drawn from x.com" : "doesn't exist"
    console.warn(`[post-art] ${post.slug}: pattern "${named}" ${why}`)
  }
  let hash = 0
  for (const char of post.slug) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return usable[Math.abs(hash) % usable.length]
}
