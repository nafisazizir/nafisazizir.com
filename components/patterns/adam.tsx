import { PatternFrame, type PatternProps } from "./frame"
import { during, except, Flip, swing } from "./motion"

// Adam, too big for the card, off the top and looking down at the title: the
// Mini from ../mabot in the pose its cursor follow gives him with the cursor to
// his lower left. No fill, eyes included. Drawn for Raising Adam and worn by
// nothing else, so it lives outside the catalogue and isn't in `patterns`: his
// asterisks and silhouette are what the README rules out everywhere else. He has
// no top: his sides are straight lines running up past the frame, so he
// overflows any container, and nothing leaves through the bottom.
//
// A window comes down from past the top on his left, round his bottom and back
// up the right, and his eyes drift along the line of the glance as it goes: off
// the title while it's on his far side, and back. They blink once, while it's
// away. Coordinates are frame units, worked out once from mabot's geometry.
const BODY =
  "M-320.23 -2015.9L64.54 -53.26L81.95 35.54L86.15 55.05L89.21 66.9L90.69 71.66L93.67 79.77L96.89 86.62L98.64 89.69L100.48 92.56L102.44 95.23L104.52 97.72L106.74 100.05L109.08 102.2L111.56 104.16L114.16 105.97L116.9 107.61L119.77 109.07L122.79 110.38L129.36 112.52L136.84 114.13L141.05 114.74L151.05 115.59L166 116L177.07 115.98L263.18 114.72L282.72 114.03L294.67 113.03L303.74 111.62L307.62 110.74L311.18 109.7L314.44 108.54L317.48 107.23L320.28 105.77L323.77 103.54L326.16 101.72L328.34 99.7L355.92 69.98L357.66 67.66L359.64 64.25L360.95 61.57L362.07 58.72L362.98 55.69L363.7 52.46L364.25 49L364.61 45.28L364.77 41.25L364.56 31.9L363.41 19.69L360.62 -0.34L346.08 -91.33L30.45 -2066.26"
const EYES =
  "M103.03 28.43L112.52 14.23L132.99 29.72L135.54 2.87L151.69 4.41L149.14 31.26L172.17 19.89L178.82 35.63L155.81 46.99L176.27 62.47L166.78 76.68L146.3 61.18L143.75 88.03L127.6 86.5L130.15 59.65L107.13 71.01L100.48 55.28L123.49 43.92ZM196.75 24.48L207.21 9.13L229.87 25.94L232.63 -3.11L250.47 -1.42L247.72 27.63L273.14 15.39L280.52 32.43L255.11 44.67L277.76 61.47L267.3 76.82L244.64 60.01L241.88 89.06L224.03 87.37L226.79 58.31L201.37 70.56L193.99 53.52L219.4 41.28Z"
const EYES_BLINK =
  "M105.63 55.7L171.12 61.92L172.41 48.34L106.92 42.12ZM199.69 53.99L272.07 60.87L273.47 46.17L201.09 39.3Z"

// Positions along BODY count from 200 before his left side's upper end.
const WINDOW = { w: 40, length: 994.45 }
// Whole cycles of drift per loop, in step with the window: passing the middle
// of him as it passes under the middle of him, and resting on the pose.
const DRIFT = { speed: 1, phase: 0.5387 }
const CYCLE = { speed: 1, phase: 0 }
const BLINK = [0.86, 0.035] as const

export function PatternAdam(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <Flip d={BODY} start={-1800} {...WINDOW} />
      <g {...swing(3, -2, DRIFT)}>
        <g {...except(...BLINK, CYCLE)}>
          <path d={EYES} stroke="currentColor" />
        </g>
        <g {...during(...BLINK, CYCLE)}>
          <path d={EYES_BLINK} stroke="currentColor" />
        </g>
      </g>
    </PatternFrame>
  )
}
