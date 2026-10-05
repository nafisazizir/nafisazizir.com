import { PatternFrame, type PatternProps } from "./frame"

export function PatternPersistent(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M144 12.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M240 12.5V-2000" stroke="currentColor" />
      <path
        d="M144 12.5L96 60M144 12.5L192 60M96 60L96 104"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M240 12.5L192 60M240 12.5L288 60M288 60L288 104M192 60L192 104"
        stroke="currentColor"
      />
      <circle
        cx="96"
        cy="60"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="96"
        cy="104"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="192"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="104"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="288" cy="60" r="8" fill="currentColor" />
      <circle cx="288" cy="104" r="8" fill="currentColor" />
      <rect
        x="141"
        y="9.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="237" y="9.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
