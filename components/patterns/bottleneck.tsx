import { PatternFrame, type PatternProps } from "./frame"

export function PatternBottleneck(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M336 60H2400" stroke="currentColor" />
      <path d="M168 60H216" stroke="currentColor" />
      <path
        d="M48 8L168 44V76L48 112Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M216 44L336 8V112L216 76Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="180"
        y="48"
        width="24"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
