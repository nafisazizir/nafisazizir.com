import { PatternFrame, type PatternProps } from "./frame"

export function PatternWedge(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M3.5 -2000V116.5H155.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M23.6 113.5H152.5V74.2Z" fill="var(--ds-background-100)" />
      <path d="M3.5 116.5L383.5 0.5" stroke="currentColor" />
      <path d="M155.5 116.5L383.5 0.5" stroke="currentColor" />
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
