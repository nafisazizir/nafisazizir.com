import { PatternFrame, type PatternProps } from "./frame"

export function PatternBranch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 96.5H2400" stroke="currentColor" />
      <path
        d="M88.5 96.5C112.5 96.5 112.5 40.5 136.5 40.5H232.5C256.5 40.5 256.5 96.5 280.5 96.5Z"
        fill="var(--ds-background-100)"
      />
      <path
        d="M88.5 96.5C112.5 96.5 112.5 40.5 136.5 40.5H232.5C256.5 40.5 256.5 96.5 280.5 96.5"
        stroke="currentColor"
      />
      <path
        d="M328.5 96.5C344.5 96.5 344.5 8.5 360.5 8.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="40.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="88.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="168.5"
        cy="40.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="200.5"
        cy="40.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="280.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="328.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
