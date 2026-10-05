import { PatternFrame, type PatternProps } from "./frame"

export function PatternAttention(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48 20H-2000M336 20H2400M48 20H336" stroke="currentColor" />
      <path
        d="M48 100H-2000M336 100H2400M48 100H336"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M240 100L48 20M240 100L144 20M240 100L192 20M240 100L240 20"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M240 100L96 20" stroke="currentColor" />
      <circle
        cx="48"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="288"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="336"
        cy="20"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="96" cy="20" r="8" fill="currentColor" />
      <circle
        cx="48"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="96"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="288"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="336"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="100"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="240" cy="100" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
