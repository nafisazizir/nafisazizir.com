import { PatternFrame, type PatternProps } from "./frame"
import { Flip, march, Run } from "./motion"

// Consistent hashing, along M-60 60H144, the arc and out: a key lands on
// the ring where it hashes, walks clockwise to the next node, which owns
// it, and goes out through that node. The ring itself turns slowly
// clockwise, the direction every key walks.
const key = { length: 454.27, w: 24 }

export function PatternRing(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <path d="M144 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-60 60H144" {...key} />
      <Flip d="M168 18.43L-1308 -2538.08" start={254.27} {...key} />
      <circle
        cx="192"
        cy="60"
        r="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...march({ speed: 2 })}
      />
      <Flip d="M144 60A48 48 0 0 1 168 18.43" start={204} {...key} />
      <circle
        cx="233.57"
        cy="36"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="108"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="168" cy="18.43" r="4" fill="currentColor" />
      <rect x="141" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
