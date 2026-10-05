import { PatternFrame, type PatternProps } from "./frame"

export function PatternWedgeMirror(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M380.5 -2000V116.5H228.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M360.4 113.5H231.5V74.2Z" fill="var(--ds-background-100)" />
      <path d="M380.5 116.5L0.5 0.5" stroke="currentColor" />
      <path d="M228.5 116.5L0.5 0.5" stroke="currentColor" />
      <rect
        x="377.5"
        y="113.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="225.5"
        y="113.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
