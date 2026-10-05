import { PatternFrame, type PatternProps } from "./frame"

export function PatternDonut(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M216.5 32L230.35 24H2400" stroke="currentColor" />
      <path
        d="M112 60a56 56 0 1 0 112 0a56 56 0 1 0 -112 0M132 60a36 36 0 1 0 72 0a36 36 0 1 0 -72 0"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M136.82 78L119.5 88M140.42 36.86L125.1 24"
        stroke="currentColor"
      />
      <path
        d="M168 4A56 56 0 0 1 216.5 88L199.18 78A36 36 0 0 0 168 24Z"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
      />
      <rect x="227.35" y="21" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
