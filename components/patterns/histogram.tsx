import { PatternFrame, type PatternProps } from "./frame"

export function PatternHistogram(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M48.5 112.5V104.5H64.5V92.5H80.5V72.5H96.5V48.5H112.5V28.5H128.5V20.5H144.5V24.5H160.5V36.5H176.5V50.5H192.5V64.5H208.5V74.5H224.5V82.5H240.5V88.5H256.5V94.5H272.5V98.5H288.5V102.5H304.5V104.5H320.5V106.5H336.5V112.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M-2000 112.5H2400" stroke="currentColor" />
      <path d="M160.5 112.5V-2000" stroke="currentColor" />
      <path
        d="M304.5 112.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="157.5" y="109.5" width="6" height="6" fill="currentColor" />
      <rect
        x="301.5"
        y="109.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
