import { PatternFrame, type PatternProps } from "./frame"

export function PatternBipartite(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M118 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M266 74.67H2400" stroke="currentColor" />
      <path
        d="M128 24L256 16M128 60L256 45.33M128 96L256 104M128 60L256 74.67"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M128 24L256 45.33M128 60L256 104M128 96L256 74.67"
        stroke="currentColor"
      />
      <circle
        cx="128"
        cy="24"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="128"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="128"
        cy="96"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="256"
        cy="45.33"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="256"
        cy="74.67"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="256"
        cy="104"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="256"
        cy="16"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
    </PatternFrame>
  )
}
