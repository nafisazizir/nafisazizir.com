import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Three wheels in rolling contact. Touching rims move together without
// slipping, so every rim runs at the same surface speed and each wheel
// turns against its neighbour, the smallest fastest. Windows meet at each
// contact like teeth meshing. Windows per rim follow the radii: 2, 4, 7.
const speed = 8

export function PatternContact(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M192 119.5H-2000M192 119.5H2400" stroke="currentColor" />
      <circle
        cx="105.04"
        cy="103.5"
        r="16"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M119.97 97.74A16 16 0 0 1 90.11 109.26A16 16 0 0 1 119.97 97.74"
        w={18}
        p={50.27}
        speed={speed}
      />
      <circle cx="151.69" cy="85.5" r="34" fill="var(--ds-background-100)" />
      <Flip
        d="M119.97 97.74A34 34 0 0 0 183.41 73.26A34 34 0 0 0 119.97 97.74"
        w={18}
        p={53.41}
        speed={speed}
      />
      <circle cx="238.96" cy="63.5" r="56" fill="var(--ds-background-100)" />
      <Flip
        d="M184.66 77.19A56 56 0 0 1 293.26 49.81A56 56 0 0 1 184.66 77.19"
        w={18}
        p={50.27}
        speed={speed}
        phase={0.0773}
      />
      <circle
        cx="119.97"
        cy="97.74"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="184.66"
        cy="77.19"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
