import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// Each key in turn comes in, is sent to the bucket its hash selects and
// follows that bucket's chain to its entry. The third key collides with
// the first, so it passes the first entry on its way to its own. A key
// and every entry it reaches light as it passes.
const period = { p: 400, w: 24 }
const first = { ...period, phase: 0 }
const second = { ...period, phase: 0.25 }
const third = { ...period, phase: 0.5 }
// The shared stretch of the collided chain carries both keys' runs: half
// the period at twice the speed is the first and third together.
const collided = { p: 200, w: 24, speed: 2 }

const lit = (cx: number, cy: number, key: typeof first, at: number) => (
  <circle cx={cx} cy={cy} r="4" fill="currentColor" {...on(key, at, 4)} />
)

export function PatternHash(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path
        d="M48.5 24.5H-2000M48.5 60.5H-2000M48.5 96.5H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-60 24.5H48.5" {...first} />
      <Run d="M-60 60.5H48.5" {...second} />
      <Run d="M-60 96.5H48.5" {...third} />
      <Flip d="M48.5 24.5L152.5 60.5" start={108.5} {...first} />
      <Flip d="M48.5 60.5L152.5 20.5" start={108.5} {...second} />
      <Flip d="M48.5 96.5L152.5 60.5" start={108.5} {...third} />
      <Flip d="M176.5 20.5H216.5" start={243.92} {...second} />
      <Flip d="M176.5 60.5H216.5" start={242.55} {...collided} />
      <Flip d="M216.5 60.5H256.5" start={282.55} {...third} />
      <rect
        x="152.5"
        y="10.5"
        width="24"
        height="100"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M152.5 30.5h24M152.5 50.5h24M152.5 70.5h24M152.5 90.5h24"
        stroke="currentColor"
      />
      <circle
        cx="48.5"
        cy="24.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {lit(48.5, 24.5, first, 108.5)}
      <circle
        cx="48.5"
        cy="60.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {lit(48.5, 60.5, second, 108.5)}
      <circle
        cx="48.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {lit(48.5, 96.5, third, 108.5)}
      <circle
        cx="216.5"
        cy="20.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {lit(216.5, 20.5, second, 283.92)}
      <circle
        cx="216.5"
        cy="60.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {lit(216.5, 60.5, first, 282.55)}
      {lit(216.5, 60.5, third, 282.55)}
      <circle
        cx="256.5"
        cy="60.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {lit(256.5, 60.5, third, 322.55)}
    </PatternFrame>
  )
}
