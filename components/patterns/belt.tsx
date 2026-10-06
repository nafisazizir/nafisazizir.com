import { PatternFrame, type PatternProps } from "./frame"
import { Flip, turn } from "./motion"

// A crossed belt: it runs down one strand, round the far side of the right
// pulley, back along the other strand and round the left pulley, so the
// pulleys turn in opposite directions, at the same speed since their radii
// match. The right pulley's dashed ring turns with it: the belt covers its
// rim three times a loop (5 periods of 137.75 over a rim of 226.2).
const belt = { w: 28, p: 137.75, speed: 5 }

export function PatternBelt(props: PatternProps) {
  return (
    <PatternFrame loop={20} {...props}>
      <path d="M84 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M300 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Flip d="M138 28.82L246 91.18" {...belt} />
      <Flip d="M246 28.82L138 91.18" start={275.51} {...belt} />
      <circle cx="120" cy="60" r="36" fill="var(--ds-background-100)" />
      <Flip d="M138 91.18A36 36 0 1 1 138 28.82" start={400.22} {...belt} />
      <path d="M138 28.82A36 36 0 0 1 138 91.18" stroke="currentColor" />
      <circle cx="264" cy="60" r="36" fill="var(--ds-background-100)" />
      <Flip d="M246 91.18A36 36 0 1 0 246 28.82" start={124.71} {...belt} />
      <path d="M246 28.82A36 36 0 0 0 246 91.18" stroke="currentColor" />
      <circle
        cx="264"
        cy="60"
        r="20"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...turn(264, 60, { speed: 3, dir: -1 })}
      />
      <circle cx="120" cy="60" r="3" fill="currentColor" />
      <circle cx="264" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
