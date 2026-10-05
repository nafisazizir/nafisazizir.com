import { PatternFrame, type PatternProps } from "./frame"

export function PatternNeuralNet(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M112 36H-2000M112 84H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M272 36H2400M272 84H2400" stroke="currentColor" />
      <path
        d="M112 36L192 20M112 36L192 60M112 36L192 100M112 84L192 20M112 84L192 60M112 84L192 100M192 20L272 36M192 20L272 84M192 60L272 36M192 60L272 84M192 100L272 36M192 100L272 84"
        stroke="currentColor"
      />
      <circle
        cx="112"
        cy="36"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="112"
        cy="84"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="20"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="100"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="272"
        cy="36"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="272"
        cy="84"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="10" fill="currentColor" />
    </PatternFrame>
  )
}
