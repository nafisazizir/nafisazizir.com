import { PatternFrame, type PatternProps } from "./frame"

export function PatternNotch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M-2000 -2000H196.5V108.5H-2000Z"
        fill="var(--ds-background-100)"
      />
      <path d="M-2000 108.5H196.5V-2000" stroke="currentColor" />
      <path
        d="M-2000 116.5H204.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M204.5 56.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <rect
        x="212.5"
        y="0.5"
        width="171"
        height="48"
        rx="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="201.5" y="113.5" width="6" height="6" fill="currentColor" />
      <rect x="201.5" y="53.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
