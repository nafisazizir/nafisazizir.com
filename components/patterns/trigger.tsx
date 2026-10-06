import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// The trigger fires down its line and starts the run. The run is toned for
// as long as it lasts (the window crossing it, hidden), then time carries
// on along the timeline past its end. The dashed trigger never fires.
// Positions are along M120.5 -200V88.5H600.
const fire = { length: 768, w: 24 }

export function PatternTrigger(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path
        d="M120.5 88.5H-2000M120.5 88.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M296.5 88.5H600" start={464.5} {...fire} />
      <path d="M64.5 88.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <rect
        x="120.5"
        y="76.5"
        width="176"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="120.5"
        y="76.5"
        width="176"
        height="24"
        rx="12"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(fire, 376.5, 88)}
      />
      <Flip d="M120.5 -2000V88.5" start={-1800} {...fire} />
      <circle
        cx="64.5"
        cy="88.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="117.5" y="85.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
