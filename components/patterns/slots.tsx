import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The profile is cut in one pass, left to right: a window runs the left
// slot, the deep one (dashed on its solid edge) and the right one, up and
// over each wall out of view.
const pass = { length: 1770, w: 32 }

export function PatternSlots(props: PatternProps) {
  return (
    <PatternFrame loop={20} {...props}>
      <path
        d="M-2000 56.5H112.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-40 56.5H112.5V-200" {...pass} />
      <path
        d="M271.5 -2000V56.5H383.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M271.5 -200V56.5H383.5V-200" start={1145} {...pass} />
      <path d="M-2000 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M136.5 -2000V88.5H247.5V-2000" fill="var(--ds-background-100)" />
      <Flip d="M136.5 -2000V88.5H247.5V-2000" start={-1367} {...pass} />
    </PatternFrame>
  )
}
