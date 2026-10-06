import { PatternFrame, type PatternProps } from "./frame"
import { Flip, turn } from "./motion"

// A 16-pitch field of grains, cleared around the subject.
const grains = Array.from({ length: 24 * 7 }, (_, i) => ({
  cx: 8 + (i % 24) * 16,
  cy: 12 + Math.floor(i / 24) * 16,
})).filter(({ cx, cy }) => Math.hypot(cx - 280, cy - 60) > 44)

export function PatternField(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      {grains.map(({ cx, cy }) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" />
      ))}
      <Flip d="M320 60H2400" w={24} p={96} speed={3} />
      <circle
        cx="280"
        cy="60"
        r="52"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...turn(280, 60, { dir: -1 })}
      />
      <circle
        cx="280"
        cy="60"
        r="40"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="280" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
