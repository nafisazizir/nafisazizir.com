import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The eclipsed part circulates: two windows run round the overlap, down the
// near body's edge and up the far one's, crossing at the two contacts.
const overlap = { w: 28, p: 115.66, speed: 3 }

export function PatternEclipse(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M108 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M276 60H2400" stroke="currentColor" />
      <circle
        cx="164"
        cy="60"
        r="55.5"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M192 107.92A55.5 55.5 0 0 0 192 12.08"
        start={115.66}
        {...overlap}
      />
      <Flip d="M192 12.08A55.5 55.5 0 0 0 192 107.92" {...overlap} />
      <path d="M192 107.92A55.5 55.5 0 1 0 192 12.08" stroke="currentColor" />
      <circle
        cx="192"
        cy="12.08"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="107.92"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
