import { PatternFrame, type PatternProps } from "./frame"

export function PatternCircuit(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M176.5 44.5H152.5L124.5 16.5H-2000" stroke="currentColor" />
      <path d="M176.5 60.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M176.5 76.5H152.5L124.5 104.5H-2000" stroke="currentColor" />
      <path d="M240.5 60.5H2400" stroke="currentColor" />
      <path
        d="M240.5 44.5H264.5L292.5 16.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M208.5 32.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <rect
        x="176.5"
        y="32.5"
        width="64"
        height="56"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="188.5"
        y="44.5"
        width="40"
        height="32"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle cx="124.5" cy="16.5" r="3" fill="currentColor" />
      <circle cx="124.5" cy="104.5" r="3" fill="currentColor" />
      <circle cx="292.5" cy="16.5" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
