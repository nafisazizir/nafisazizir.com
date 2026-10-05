import { PatternFrame, type PatternProps } from "./frame"

export function PatternContact(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M192 119.5H-2000M192 119.5H2400" stroke="currentColor" />
      <circle
        cx="105.04"
        cy="103.5"
        r="16"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="151.69"
        cy="85.5"
        r="34"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="238.96"
        cy="63.5"
        r="56"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="119.97"
        cy="97.74"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="184.66"
        cy="77.19"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
