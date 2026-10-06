import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// A traversal along M-40 60.5H332: the cursor comes in from head, follows
// each pointer and stops at null, then starts again from head. The node it
// holds is toned.
const walk = { length: 372, w: 24 }

const node = (x: number) => (
  <rect
    x={x}
    y="36.5"
    width="56"
    height="48"
    fill="var(--ds-gray-300)"
    stroke="currentColor"
    {...on(walk, x + 80, 40)}
  />
)

export function PatternLinkedList(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <path d="M40.5 60.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-40 60.5H40.5" {...walk} />
      <Flip d="M104.5 60.5H152.5" start={144.5} {...walk} />
      <Flip d="M216.5 60.5H264.5" start={256.5} {...walk} />
      <rect
        x="40.5"
        y="36.5"
        width="80"
        height="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {node(40.5)}
      <path d="M96.5 36.5V84.5" stroke="currentColor" />
      <circle cx="108.5" cy="60.5" r="3" fill="currentColor" />
      <rect
        x="152.5"
        y="36.5"
        width="80"
        height="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {node(152.5)}
      <path d="M208.5 36.5V84.5" stroke="currentColor" />
      <circle cx="220.5" cy="60.5" r="3" fill="currentColor" />
      <rect
        x="264.5"
        y="36.5"
        width="80"
        height="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {node(264.5)}
      <path d="M320.5 36.5V84.5" stroke="currentColor" />
      <path d="M320.5 84.5L344.5 36.5" stroke="currentColor" />
      <rect x="37.5" y="57.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
