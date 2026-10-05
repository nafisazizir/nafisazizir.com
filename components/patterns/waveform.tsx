import { PatternFrame, type PatternProps } from "./frame"

export function PatternWaveform(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M64.5 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M320.5 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M64.5 53.0V67.0M72.5 50.0V70.0M80.5 51.0V69.0M88.5 49.0V71.0M96.5 46.0V74.0M104.5 41.0V79.0M112.5 40.0V80.0M120.5 40.0V80.0M128.5 41.0V79.0M136.5 36.0V84.0M144.5 23.0V97.0M152.5 33.0V87.0M160.5 23.0V97.0M168.5 32.0V88.0M176.5 21.0V99.0M184.5 24.0V96.0M192.5 13.0V107.0M200.5 22.0V98.0"
        stroke="currentColor"
      />
      <path
        d="M208.5 29.0V91.0M216.5 27.0V93.0M224.5 26.0V94.0M232.5 20.0V100.0M240.5 34.0V86.0M248.5 35.0V85.0M256.5 41.0V79.0M264.5 36.0V84.0M272.5 43.0V77.0M280.5 41.0V79.0M288.5 47.0V73.0M296.5 50.0V70.0M304.5 50.0V70.0M312.5 50.0V70.0M320.5 51.0V69.0"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M208.5 112V-2000" stroke="currentColor" />
      <rect x="205.5" y="109" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
