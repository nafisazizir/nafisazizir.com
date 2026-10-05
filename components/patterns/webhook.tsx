import { PatternFrame, type PatternProps } from "./frame"

export function PatternWebhook(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M200.5 112V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M116 60.5H2400" stroke="currentColor" />
      <path
        d="M144 60.5C160 60.5 160 24.5 176 24.5H2400"
        stroke="currentColor"
      />
      <path
        d="M144 60.5C160 60.5 160 96.5 176 96.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
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
