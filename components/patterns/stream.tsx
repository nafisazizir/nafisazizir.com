import { PatternFrame, type PatternProps } from "./frame"

export function PatternStream(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M40.5 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M40.5 60H336.5" stroke="currentColor" />
      <rect
        x="40.5"
        y="44.5"
        width="56"
        height="32"
        rx="16"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="104.5"
        y="44.5"
        width="32"
        height="32"
        rx="16"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="144.5"
        y="44.5"
        width="72"
        height="32"
        rx="16"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="224.5"
        y="44.5"
        width="40"
        height="32"
        rx="16"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="272.5"
        y="44.5"
        width="64"
        height="32"
        rx="16"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M352.5 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="349.5" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
