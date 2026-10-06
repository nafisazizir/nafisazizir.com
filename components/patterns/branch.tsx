import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// History walked from the left. At the fork the work splits: one line of
// commits goes out along the branch, main carries on, and the two meet at
// the merge commit together and go on as one; the next commit forks the
// dashed branch to come. Each commit lights as the walk passes it.
// Positions are along M-40 96.5H600, through the branch between fork and
// merge; main's middle is timed to reach the merge with it.
const walk = { length: 700.18, w: 24 }

const commit = (cx: number, cy: number, at: number) => (
  <circle
    cx={cx}
    cy={cy}
    r="4"
    fill="currentColor"
    stroke="currentColor"
    {...on(walk, at, 4)}
  />
)

const ring = (cx: number, cy: number) => (
  <circle
    cx={cx}
    cy={cy}
    r="4"
    fill="var(--ds-background-100)"
    stroke="currentColor"
  />
)

export function PatternBranch(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <Flip d="M-2000 96.5H88.5" start={-1960} {...walk} />
      <Flip d="M88.5 96.5H280.5" start={188.68} {...walk} />
      <Flip d="M280.5 96.5H2400" start={380.68} {...walk} />
      <path
        d="M88.5 96.5C112.5 96.5 112.5 40.5 136.5 40.5H232.5C256.5 40.5 256.5 96.5 280.5 96.5Z"
        fill="var(--ds-background-100)"
      />
      <Flip
        d="M88.5 96.5C112.5 96.5 112.5 40.5 136.5 40.5H232.5C256.5 40.5 256.5 96.5 280.5 96.5"
        start={128.5}
        {...walk}
      />
      <path
        d="M328.5 96.5C344.5 96.5 344.5 8.5 360.5 8.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M328.5 96.5C344.5 96.5 344.5 8.5 360.5 8.5H600"
        start={428.68}
        {...walk}
      />
      {ring(40.5, 96.5)}
      {commit(40.5, 96.5, 80.5)}
      {ring(88.5, 96.5)}
      {commit(88.5, 96.5, 128.5)}
      {ring(168.5, 40.5)}
      {commit(168.5, 40.5, 238.59)}
      {ring(200.5, 40.5)}
      {commit(200.5, 40.5, 270.59)}
      {ring(280.5, 96.5)}
      {commit(280.5, 96.5, 380.68)}
      {ring(328.5, 96.5)}
      {commit(328.5, 96.5, 428.68)}
    </PatternFrame>
  )
}
