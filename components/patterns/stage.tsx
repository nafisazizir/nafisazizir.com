import { cn } from "@/lib/utils"

import type { PatternProps } from "./frame"
import { PatternPlay } from "./play"

// Places a pattern in a container of any ratio. The frame takes 90% of the
// width, capped at half the height, and sits centred, or pinned to the top
// under a margin equal to the one at its sides. Strokes stay hairline at
// every size; outline shows the frame itself. `animate` runs the pattern's
// idle loop while the stage is on screen, unless the reader prefers reduced
// motion.
export function PatternStage({
  pattern: Pattern,
  anchor = "center",
  outline = false,
  animate = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  pattern: (props: PatternProps) => React.ReactNode
  anchor?: "center" | "top"
  outline?: boolean
  animate?: boolean
}) {
  return (
    <div
      data-animate={animate || undefined}
      className={cn(
        "[container-type:size] relative overflow-hidden bg-gray-100 text-gray-1000",
        className
      )}
      {...props}
    >
      <Pattern
        className={cn(
          "absolute left-1/2 aspect-16/5 w-[min(90cqw,160cqh)] -translate-x-1/2 **:[vector-effect:non-scaling-stroke]",
          anchor === "top" ? "top-[5cqw]" : "top-1/2 -translate-y-1/2",
          outline && "outline outline-red-700"
        )}
      />
      {animate && <PatternPlay />}
      {children}
    </div>
  )
}
