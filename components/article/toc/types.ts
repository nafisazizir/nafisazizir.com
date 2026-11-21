import type { TocItem } from "@/lib/content"

/**
 * What every contents variant is handed. A variant is mounted inside the
 * article body's `relative` wrapper (the 1120px frame, the 720px prose column
 * centred in it), so `absolute` places it against that frame and `fixed`
 * against the viewport. It owns its own breakpoints: render nothing, or a
 * different shape, where it doesn't fit.
 */
export interface TocVariantProps {
  slug: string
  /** `##` (depth 2) and `###` (depth 3) headings in document order. */
  items: TocItem[]
}
