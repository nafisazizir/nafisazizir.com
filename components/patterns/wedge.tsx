import { PatternFrame, type PatternProps } from "./frame"
import { Flip } from "./motion"

// Both edges carry windows the same fraction of their length along, so
// each pair sits level and they close in on the vertex together.

export function PatternWedge(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M3.5 -2000V116.5H155.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M23.6 113.5H152.5V74.2Z" fill="var(--ds-background-100)" />
      <Flip d="M3.5 116.5L383.5 0.5" w={31.78} p={198.66} speed={2} />
      <Flip d="M155.5 116.5L383.5 0.5" w={20.46} p={127.91} speed={2} />
      <rect
        x="0.5"
        y="113.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="152.5"
        y="113.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
