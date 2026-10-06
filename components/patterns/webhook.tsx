import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Each event goes out to all three endpoints at once. The two delivered
// requests run past their endpoints and on; the undelivered one ends at
// its hollow endpoint. Positions are along each request from the source's
// centre.
const send = { length: 512, w: 28 }

export function PatternWebhook(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <path d="M200.5 112V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Flip d="M116 60.5H2400" start={28} {...send} />
      <Flip
        d="M144 60.5C160 60.5 160 24.5 176 24.5H2400"
        start={56}
        {...send}
      />
      <path
        d="M144 60.5C160 60.5 160 96.5 176 96.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M144 60.5C160 60.5 160 96.5 176 96.5H200.5"
        start={56}
        {...send}
      />
      <circle
        cx="88"
        cy="60.5"
        r="28"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="88" cy="60.5" r="3" fill="currentColor" />
      <rect x="197.5" y="21.5" width="6" height="6" fill="currentColor" />
      <rect x="197.5" y="57.5" width="6" height="6" fill="currentColor" />
      <rect
        x="197.5"
        y="93.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
