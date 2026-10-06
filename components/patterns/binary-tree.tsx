import { PatternFrame, type PatternProps } from "./frame"
import { Flip } from "./motion"

// A binary search: down the root pointer, then left, right, left, one
// comparison per level along the path the key selects, to the leaf it
// belongs at. Every other branch stays a guide.
const search = { length: 408.88, w: 24 }

export function PatternBinaryTree(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <Flip d="M192 -2000V10" start={-1800} {...search} />
      <path
        d="M192 10L288 42M96 42L48 74M288 42L240 74M288 42L336 74M48 74L24 106M48 74L72 106M144 74L168 106M240 74L216 106M240 74L264 106M336 74L312 106M336 74L360 106"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Flip d="M192 10L96 42L144 74L120 106" start={210} {...search} />
      <circle cx="192" cy="10" r="7" fill="currentColor" />
      <circle cx="96" cy="42" r="7" fill="currentColor" />
      <circle
        cx="288"
        cy="42"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="48"
        cy="74"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="144" cy="74" r="7" fill="currentColor" />
      <circle
        cx="240"
        cy="74"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="336"
        cy="74"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="24"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="72"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="120" cy="106" r="7" fill="currentColor" />
      <circle
        cx="168"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="312"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="360"
        cy="106"
        r="7"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
