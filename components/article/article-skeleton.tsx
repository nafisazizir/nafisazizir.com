import {
  BODY,
  HEADER_ART,
  HEADER_DATE,
  HEADER_HEADLINE,
  HEADER_TITLE,
} from "@/components/article/article-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// A skeleton only shows once a load is slow enough to notice. A static post
// streams its content into the same document right behind the fallback, and
// a prefetched one arrives as fast, so without the delay the bars would
// flash for a frame or two before the text replaced them.
const REVEAL = "animate-in fill-mode-both fade-in delay-200 duration-300"

// Every placeholder line is a box one line-height tall in the role it stands
// in for, with the bar centred in it, so the skeleton measures what the text
// will: the bar is the ink, the box is the leading.
function Line({ className, bar }: { className?: string; bar: string }) {
  return (
    <span className={cn("flex h-[1lh] items-center", className)}>
      <Skeleton className={cn("h-[0.6em] rounded-sm", bar)} />
    </span>
  )
}

/**
 * The headline's two grid cells while the post loads, on the same boxes:
 * the title's lines in its type role, the date's line, and the art's frame
 * (whose ground is the stage's own gray-100, so the pattern draws onto it).
 */
export function ArticleHeadlineSkeleton() {
  return (
    <>
      <div className={cn(HEADER_HEADLINE, REVEAL)} aria-hidden>
        {/* The title's most common wrap across the posts: three lines in
            Heading 32 on a phone, two in Heading 40 and 48 from sm. From lg
            the art sets the header's height for up to two lines anyway. */}
        <div className={cn(HEADER_TITLE, "flex flex-col")}>
          <Line bar="w-full" />
          <Line bar="w-full sm:w-3/5" />
          <Line bar="w-2/5" className="sm:hidden" />
        </div>
        <div className={HEADER_DATE}>
          <Line bar="w-21" />
        </div>
      </div>
      <div className={cn(HEADER_ART, REVEAL)} aria-hidden>
        <Skeleton className="size-full rounded-none" />
      </div>
    </>
  )
}

// Lengths of the last line of each paragraph, so the block reads as prose.
const PARAGRAPHS = ["w-2/3", "w-1/2", "w-4/5", "w-2/5", "w-3/4", "w-3/5"]

/**
 * The body while the post loads: paragraphs of Copy 16 at the prose rhythm,
 * at least a viewport tall so nothing after it is on screen to be pushed.
 */
export function ArticleBodySkeleton() {
  return (
    <div className="relative" aria-busy aria-label="Loading post">
      <div
        className={cn(
          BODY,
          REVEAL,
          "flex min-h-svh flex-col gap-(--typeset-flow) text-copy-16"
        )}
        aria-hidden
      >
        {PARAGRAPHS.map((last, i) => (
          <div key={i} className="flex flex-col">
            <Line bar="w-full" />
            <Line bar="w-full" />
            <Line bar="w-full" />
            <Line bar={last} />
          </div>
        ))}
      </div>
    </div>
  )
}
