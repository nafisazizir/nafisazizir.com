import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// The matching, pair by pair: each left vertex reaches its partner along
// the one matched edge, and both ends of the pair are toned as it does.
// The middle pair is fed from the left, the last one feeds the line out.
// The unmatched vertex on the right is never reached.
const pairing = { p: 500, w: 24 }
const top = { ...pairing, phase: 0 }
const middle = { ...pairing, phase: 0 }
const bottom = { ...pairing, phase: 0.29 }

const tone = (cx: number, cy: number, timing: typeof top, at: number) => (
  <circle
    cx={cx}
    cy={cy}
    r="10"
    fill="var(--ds-gray-300)"
    stroke="currentColor"
    {...on(timing, at, 10)}
  />
)

export function PatternBipartite(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path d="M118 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-60 60H128" {...middle} />
      <Flip d="M266 74.67H2400" start={139.77} {...bottom} />
      <path
        d="M128 24L256 16M128 60L256 45.33M128 96L256 104M128 60L256 74.67"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Flip d="M128 24L256 45.33" {...top} />
      <Flip d="M128 60L256 104" start={188} {...middle} />
      <Flip d="M128 96L256 74.67" {...bottom} />
      <circle
        cx="128"
        cy="24"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {tone(128, 24, top, 0)}
      <circle
        cx="128"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {tone(128, 60, middle, 188)}
      <circle
        cx="128"
        cy="96"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {tone(128, 96, bottom, 0)}
      <circle
        cx="256"
        cy="45.33"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {tone(256, 45.33, top, 129.77)}
      <circle
        cx="256"
        cy="74.67"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {tone(256, 74.67, bottom, 129.77)}
      <circle
        cx="256"
        cy="104"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {tone(256, 104, middle, 323.35)}
      <circle
        cx="256"
        cy="16"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
    </PatternFrame>
  )
}
