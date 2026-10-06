import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Backpropagation: the error comes in at the output and runs backwards,
// down every edge into the layer, and the layer passes it back to the
// inputs once its longest edge has delivered (at 416), then out along
// them. Positions count back from x 600.
const grad = { length: 667.4, w: 24 }
const H = 416
const I = 531.4

const edges = [
  ["M192 20L96 36", H],
  ["M192 60L96 36", H],
  ["M192 100L96 36", H],
  ["M192 20L96 84", H],
  ["M192 60L96 84", H],
  ["M192 100L96 84", H],
  ["M288 60L192 20", 312],
  ["M288 60L192 60", 312],
  ["M288 60L192 100", 312],
] as const

export function PatternNetwork(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path
        d="M96 36H-2000M96 84H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M96 36H-40" start={I} {...grad} />
      <Run d="M96 84H-40" start={I} {...grad} />
      <Flip d="M2400 60H288" start={-1800} {...grad} />
      <rect
        x="172"
        y="0.5"
        width="40"
        height="119"
        rx="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      {edges.map(([d, start]) => (
        <Flip key={d} d={d} start={start} {...grad} />
      ))}
      <circle
        cx="96"
        cy="36"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="96"
        cy="84"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="8" fill="currentColor" />
      <circle
        cx="288"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
