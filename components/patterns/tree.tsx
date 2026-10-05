import { PatternFrame, type PatternProps } from "./frame"

export function PatternTree(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M192.5 8.5V-2000" stroke="currentColor" />
      <path
        d="M192.5 8.5V32.5M88.5 46.5V32.5H296.5V46.5"
        stroke="currentColor"
      />
      <path
        d="M88.5 66.5V82.5M56.5 104.5V82.5H120.5V104.5M296.5 66.5V82.5M264.5 104.5V82.5H328.5V104.5"
        stroke="currentColor"
      />
      <path
        d="M192.5 32.5V46.5M192.5 66.5V104.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="56.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="160.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="264.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="56.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="120.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="328.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="189.5" y="5.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
