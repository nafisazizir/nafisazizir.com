import { PatternFrame, type PatternProps } from "./frame"

export function PatternDag(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M56.5 60.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M328.5 60.5H2400" stroke="currentColor" />
      <path
        d="M112.5 60.5C136.5 60.5 136.5 28.5 160.5 28.5M224.5 28.5C248.5 28.5 248.5 60.5 272.5 60.5"
        stroke="currentColor"
      />
      <path
        d="M112.5 60.5C136.5 60.5 136.5 92.5 160.5 92.5M224.5 92.5C248.5 92.5 248.5 60.5 272.5 60.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="56.5"
        y="48.5"
        width="56"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="160.5"
        y="16.5"
        width="64"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="160.5"
        y="80.5"
        width="64"
        height="24"
        rx="12"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="272.5"
        y="48.5"
        width="56"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
