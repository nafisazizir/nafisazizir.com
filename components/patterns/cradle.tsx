import { PatternFrame, type PatternProps } from "./frame"
import { during, except, sway } from "./motion"

// A Newton's cradle on one sine. The raised ball falls and strikes at the
// bottom of its swing; the momentum passes through the still balls and
// the far ball swings out by the same angle, falls back, strikes, and the
// raised ball goes out again. Each ball is drawn hanging and swung from
// its pivot; the one at rest takes over at the moment of the strike. The
// dashed rest pose and swing arc explain the still drawing and are hidden
// while it moves.
const swing = (x: number) => (
  <g {...sway(x, 8.5, -32, { phase: 0.25 })}>
    <path d={`M${x} 8.5V82.5`} stroke="currentColor" />
    <circle
      cx={x}
      cy="96.5"
      r="14"
      fill="var(--ds-background-100)"
      stroke="currentColor"
    />
  </g>
)

export function PatternCradle(props: PatternProps) {
  return (
    <PatternFrame loop={4} {...props}>
      <path d="M-2000 8.5H2400" stroke="currentColor" />
      <path d="M120 8.5V82.5" stroke="currentColor" {...except(0.25, 0.5)} />
      <path d="M148 8.5V82.5" stroke="currentColor" />
      <path d="M176 8.5V82.5" stroke="currentColor" />
      <path d="M204 8.5V82.5" stroke="currentColor" />
      <path
        d="M232 8.5V82.5"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...except(0, 1)}
      />
      <circle
        cx="232"
        cy="96.5"
        r="14"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...except(0, 1)}
      />
      <path
        d="M180.27 79.69A88 88 0 0 0 283.73 79.69"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...except(0, 1)}
      />
      <path d="M232 8.5L271.21 71.26" stroke="currentColor" {...except(0, 1)} />
      <circle
        cx="120"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        {...except(0.25, 0.5)}
      />
      <circle
        cx="148"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="176"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="204"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="278.63"
        cy="83.13"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        {...except(0, 1)}
      />
      <g {...during(0.25, 0.5)}>{swing(120)}</g>
      <g {...during(0.75, 0.5)}>{swing(232)}</g>
      <g {...during(0.25, 0.5)}>
        <path d="M232 8.5V82.5" stroke="currentColor" />
        <circle
          cx="232"
          cy="96.5"
          r="14"
          fill="var(--ds-background-100)"
          stroke="currentColor"
        />
      </g>
    </PatternFrame>
  )
}
