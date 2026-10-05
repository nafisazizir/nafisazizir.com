import { PatternFrame, type PatternProps } from "./frame"

export function PatternCradle(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 8.5H2400" stroke="currentColor" />
      <path d="M120 8.5V82.5" stroke="currentColor" />
      <path d="M148 8.5V82.5" stroke="currentColor" />
      <path d="M176 8.5V82.5" stroke="currentColor" />
      <path d="M204 8.5V82.5" stroke="currentColor" />
      <path d="M232 8.5V82.5" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="232"
        cy="96.5"
        r="14"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M180.27 79.69A88 88 0 0 0 283.73 79.69"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M232 8.5L271.21 71.26" stroke="currentColor" />
      <circle
        cx="120"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="148"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="176"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="204"
        cy="96.5"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="278.63"
        cy="83.13"
        r="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
