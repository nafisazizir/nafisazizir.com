import { PatternFrame, type PatternProps } from "./frame"

export function PatternTrigger(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M120.5 88.5H-2000M120.5 88.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
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
      <path d="M120.5 88.5V-2000" stroke="currentColor" />
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
