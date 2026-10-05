import { PatternFrame, type PatternProps } from "./frame"

export function PatternHash(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M48.5 24.5H-2000M48.5 60.5H-2000M48.5 96.5H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M48.5 24.5L152.5 60.5M48.5 60.5L152.5 20.5M48.5 96.5L152.5 60.5"
        stroke="currentColor"
      />
      <path d="M176.5 20.5H216.5M176.5 60.5H256.5" stroke="currentColor" />
      <rect
        x="152.5"
        y="10.5"
        width="24"
        height="100"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M152.5 30.5h24M152.5 50.5h24M152.5 70.5h24M152.5 90.5h24"
        stroke="currentColor"
      />
      <circle
        cx="48.5"
        cy="24.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="48.5"
        cy="60.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="48.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216.5"
        cy="20.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216.5"
        cy="60.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="256.5"
        cy="60.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
