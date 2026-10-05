import { PatternFrame, type PatternProps } from "./frame"

export function PatternWorkflow(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M28 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M36 60H64M112 60H144M280 60H304M352 60H2400"
        stroke="currentColor"
      />
      <path d="M160 44V24H208M256 24H280V60" stroke="currentColor" />
      <path
        d="M160 76V96H208M256 96H280V60"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="32"
        cy="60"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="64"
        y="46"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M160 44L176 60L160 76L144 60Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="208"
        y="10"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="208"
        y="82"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="304"
        y="46"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="277" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
