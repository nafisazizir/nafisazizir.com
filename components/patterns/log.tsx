import { PatternFrame, type PatternProps } from "./frame"
import { Clip, except, slideIn } from "./motion"

// Append only. The log moves one record left per cycle under fixed
// offsets: the pending tail record is committed as it crosses into the
// log, a new tail opens, the oldest record falls off at retention, and the
// consumer offset, still, reads one record per append, trailing the head.
const step = slideIn(-24, 0, { speed: 3 })
const divider = (x: number) => `M${x} 48.5V72.5`
const committed = Array.from({ length: 13 }, (_, i) => divider(24.5 + i * 24))

export function PatternLog(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 48.5H312.5V72.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M288.5 48.5H-2000M288.5 72.5H-2000" stroke="currentColor" />
      <path
        d="M288.5 48.5H312.5V72.5H288.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M24.5 48.5V72.5M48.5 48.5V72.5M72.5 48.5V72.5M96.5 48.5V72.5M120.5 48.5V72.5M144.5 48.5V72.5M168.5 48.5V72.5M192.5 48.5V72.5M216.5 48.5V72.5M240.5 48.5V72.5M264.5 48.5V72.5M288.5 48.5V72.5"
        stroke="currentColor"
        {...except(0, 1)}
      />
      <Clip x={12.5} y={44} width={276.5} height={33}>
        <path d={committed.join("")} stroke="currentColor" {...step} />
      </Clip>
      <Clip x={289} y={44} width={24} height={33}>
        <path
          d={divider(312.5) + divider(336.5)}
          stroke="currentColor"
          strokeDasharray="4 4"
          {...step}
        />
      </Clip>
      <path d="M168.5 48.5V-2000" stroke="currentColor" />
      <path d="M240.5 48.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="165.5" y="45.5" width="6" height="6" fill="currentColor" />
      <rect
        x="237.5"
        y="45.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="309.5" y="57.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
