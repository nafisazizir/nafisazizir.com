import { PatternFrame, type PatternProps } from "./frame"

export function PatternNetwork(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M96 36H-2000M96 84H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M288 60H2400" stroke="currentColor" />
      <rect
        x="172"
        y="0.5"
        width="40"
        height="119"
        rx="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M96 36L192 20M96 36L192 60M96 36L192 100M96 84L192 20M96 84L192 60M96 84L192 100M192 20L288 60M192 60L288 60M192 100L288 60"
        stroke="currentColor"
      />
      <circle
        cx="96"
        cy="36"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="96"
        cy="84"
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
        cx="192"
        cy="100"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="8" fill="currentColor" />
      <circle
        cx="288"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
