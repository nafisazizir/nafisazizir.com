import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// The query sends to every key at once; when the farthest score is in
// (208), the value comes back down the strongest edge and the query takes
// it, toned. Positions count from the query along each edge.
const attend = { length: 372.7, w: 24 }

export function PatternAttention(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <path d="M48 20H-2000M336 20H2400M48 20H336" stroke="currentColor" />
      <path
        d="M48 100H-2000M336 100H2400M48 100H336"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M240 100L48 20M240 100L144 20M240 100L192 20M240 100L240 20"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M240 100L48 20" {...attend} />
      <Run d="M240 100L144 20" {...attend} />
      <Run d="M240 100L192 20" {...attend} />
      <Run d="M240 100L240 20" {...attend} />
      <Flip d="M96 20L240 100" start={208} {...attend} />
      <circle
        cx="48"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="20"
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
        cx="240"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="288"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="336"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="96" cy="20" r="8" fill="currentColor" />
      <circle
        cx="48"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="96"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="100"
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
      <circle
        cx="288"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="336"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="100"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="100"
        r="10"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(attend, 372.7 + 50, 60)}
      />
      <circle cx="240" cy="100" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
