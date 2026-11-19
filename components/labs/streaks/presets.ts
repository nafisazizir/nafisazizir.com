/**
 * The streak param schema the studio UI and renderer share.
 *
 * Stops run low → high palette coordinate; the field decides where each one
 * lands, so order them as a tonal ramp (usually dark → light).
 */

export type Stops = [string, string, string, string, string]

export interface StreakParams {
  stops: Stops
  angle: number
  bend: number
  fan: number
  swirl: number
  length: number
  soften: number
  detailSoften: number
  zoom: number
  polar: number
  core: number
  radial: number
  focusX: number
  focusY: number
  scale: number
  noise: number
  stretch: number
  warp: number
  hard: number
  hardSkew: number
  level: number
  knee: number
  tilt: number
  tiltAngle: number
  mass: number
  massX: number
  massY: number
  massSize: number
  mass2: number
  mass2X: number
  mass2Y: number
  mass2Size: number
  mass3: number
  mass3X: number
  mass3Y: number
  mass3Size: number
  massStretch: number
  mass2Stretch: number
  massShape: number
  massWarp: number
  dabs: number
  dabDensity: number
  dabSize: number
  dabStretch: number
  dabMix: number
  /** Hex. A colour outside the ramp, in its own blob. */
  accent: string
  accentAmt: number
  accentX: number
  accentY: number
  accentSize: number
  accentNoise: number
  accentHard: number
  accentStretch: number
  accentPost: number
  /** Hex. A second colour outside the ramp. */
  accent2: string
  accent2Amt: number
  accent2X: number
  accent2Y: number
  accent2Size: number
  accent2Noise: number
  band: number
  bandC: number
  bandWidth: number
  bandX0: number
  bandX1: number
  bendC: number
  bandWobble: number
  /** Hex. What the heroes tint toward. */
  heroColor: string
  heroTint: number
  heroPost: number
  hero2X: number
  hero2Len: number
  clump: number
  clumpScale: number
  softenCone: number
  accentTone: number
  accentToneWidth: number
  lum: number
  lumX: number
  lumY: number
  lumSize: number
  edge: number
  edgeX: number
  edgeY: number
  edgeAngle: number
  edgeSoft: number
  edgeSize: number
  band2: number
  band2C: number
  petals: number
  petalFreq: number
  petalTip: number
  petalJitter: number
  petalWidth: number
  colTilt: number
  colFreq: number
  fibreZone: number
  lumPost: number
  mass2Angle: number
  mass3Stretch: number
  edgeBend: number
  lumNoise: number
  accent2Tone: number
  accent2ToneWidth: number
  /** Hex. What strikes and dabs tint toward. */
  detailColor: string
  detailTint: number
  softenZone: number
  softenX: number
  softenY: number
  dabZone: number
  dabX: number
  dabY: number
  strikes: number
  strikeFreq: number
  strikeWidth: number
  strikeBreak: number
  strikeDash: number
  strikeMix: number
  strikeZone: number
  strikeX: number
  strikeY: number
  hero: number
  heroOffset: number
  heroWidth: number
  heroX: number
  heroLen: number
  hero2: number
  hero2Offset: number
  fibre: number
  fibreFreq: number
  fibreBreak: number
  fibreHard: number
  contrast: number
  shift: number
  blend: number
  chroma: number
  /** Stipple: the homepage's grain, jittering where the ramp lands. */
  stipple: number
  stippleSize: number
  stippleSparkle: number
  seed: number
}

export type NumericParam = Exclude<
  keyof StreakParams,
  "stops" | "accent" | "accent2" | "heroColor" | "detailColor"
>

export interface ParamSpec {
  key: NumericParam
  label: string
  min: number
  max: number
  step: number
  /** Converted to radians before it reaches the shader. */
  deg?: boolean
}

export const STREAK_PARAM_GROUPS: { title: string; params: ParamSpec[] }[] = [
  {
    title: "Direction",
    params: [
      { key: "angle", label: "Angle", min: -90, max: 90, step: 1, deg: true },
      { key: "bend", label: "Bend", min: -0.6, max: 0.6, step: 0.01 },
      { key: "bendC", label: "Bend skew", min: -1, max: 1, step: 0.01 },
      { key: "fan", label: "Fan", min: -0.6, max: 0.6, step: 0.01 },
      { key: "swirl", label: "Swirl", min: 0, max: 0.5, step: 0.01 },
      { key: "length", label: "Length", min: 0, max: 2.5, step: 0.01 },
      { key: "soften", label: "Soften", min: 0, max: 0.4, step: 0.005 },
      {
        key: "detailSoften",
        label: "Soften detail",
        min: 0,
        max: 1,
        step: 0.01,
      },
      { key: "softenCone", label: "Soften cone", min: 0, max: 1, step: 0.01 },
      { key: "softenZone", label: "Soften zone", min: 0, max: 1.5, step: 0.01 },
      { key: "softenX", label: "Soften x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "softenY", label: "Soften y", min: -1, max: 1, step: 0.01 },
      { key: "radial", label: "Radial", min: 0, max: 1, step: 1 },
      { key: "focusX", label: "Focus x", min: -2, max: 2, step: 0.01 },
      { key: "focusY", label: "Focus y", min: -1.5, max: 1.5, step: 0.01 },
      { key: "zoom", label: "Zoom", min: 0, max: 1, step: 0.01 },
      { key: "polar", label: "Polar", min: 0, max: 1, step: 1 },
      { key: "core", label: "Core", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Field",
    params: [
      { key: "scale", label: "Scale", min: 0.3, max: 3, step: 0.01 },
      { key: "noise", label: "Noise", min: 0, max: 2, step: 0.01 },
      { key: "stretch", label: "Stretch", min: 1, max: 12, step: 0.1 },
      { key: "warp", label: "Warp", min: 0, max: 1.5, step: 0.01 },
      { key: "hard", label: "Edges", min: 0, max: 1, step: 0.01 },
      { key: "hardSkew", label: "Edge skew", min: -0.9, max: 0.9, step: 0.01 },
      { key: "level", label: "Level", min: -1, max: 1, step: 0.01 },
      { key: "knee", label: "Knee", min: 0, max: 1, step: 0.01 },
      { key: "tilt", label: "Tilt", min: 0, max: 2, step: 0.01 },
      {
        key: "tiltAngle",
        label: "Tilt angle",
        min: 0,
        max: 360,
        step: 1,
        deg: true,
      },
    ],
  },
  {
    title: "Masses",
    params: [
      { key: "mass", label: "Mass", min: -1.5, max: 1.5, step: 0.01 },
      { key: "massX", label: "Mass x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "massY", label: "Mass y", min: -1, max: 1, step: 0.01 },
      { key: "massSize", label: "Mass size", min: 0.05, max: 1, step: 0.01 },
      { key: "mass2", label: "Mass 2", min: -1.5, max: 1.5, step: 0.01 },
      { key: "mass2X", label: "Mass 2 x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "mass2Y", label: "Mass 2 y", min: -1, max: 1, step: 0.01 },
      { key: "mass2Size", label: "Mass 2 size", min: 0.05, max: 1, step: 0.01 },
      { key: "mass3", label: "Mass 3", min: -1.5, max: 1.5, step: 0.01 },
      { key: "mass3X", label: "Mass 3 x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "mass3Y", label: "Mass 3 y", min: -1, max: 1, step: 0.01 },
      { key: "mass3Size", label: "Mass 3 size", min: 0.05, max: 1, step: 0.01 },
      { key: "massStretch", label: "Stretch", min: 1, max: 6, step: 0.1 },
      { key: "mass2Stretch", label: "Stretch 2–3", min: 1, max: 6, step: 0.1 },
      { key: "massShape", label: "Squareness", min: 2, max: 8, step: 0.1 },
      { key: "massWarp", label: "Warp", min: 0, max: 1, step: 0.01 },
      {
        key: "mass2Angle",
        label: "Axis 2–3",
        min: 0,
        max: 180,
        step: 1,
        deg: true,
      },
      { key: "mass3Stretch", label: "Stretch 3", min: 0, max: 6, step: 0.1 },
      { key: "lumNoise", label: "Mottle", min: -1, max: 1, step: 0.01 },
      { key: "lum", label: "Light", min: -1, max: 1.5, step: 0.01 },
      { key: "lumX", label: "Light x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "lumY", label: "Light y", min: -1, max: 1, step: 0.01 },
      { key: "lumSize", label: "Light size", min: 0.05, max: 1.5, step: 0.01 },
      { key: "lumPost", label: "Light over", min: 0, max: 1, step: 0.01 },
      { key: "edge", label: "Edge", min: -1.5, max: 1.5, step: 0.01 },
      { key: "edgeX", label: "Edge x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "edgeY", label: "Edge y", min: -1, max: 1, step: 0.01 },
      {
        key: "edgeAngle",
        label: "Edge angle",
        min: 0,
        max: 360,
        step: 1,
        deg: true,
      },
      {
        key: "edgeSoft",
        label: "Edge soft",
        min: 0.005,
        max: 0.6,
        step: 0.005,
      },
      { key: "edgeSize", label: "Edge size", min: 0, max: 1.5, step: 0.01 },
      { key: "edgeBend", label: "Edge bend", min: -3, max: 3, step: 0.01 },
      { key: "band", label: "Band", min: -1.5, max: 1.5, step: 0.01 },
      { key: "bandC", label: "Band at", min: -1.5, max: 1.5, step: 0.005 },
      {
        key: "bandWidth",
        label: "Band width",
        min: 0.01,
        max: 0.5,
        step: 0.005,
      },
      { key: "bandX0", label: "Band from", min: -2, max: 2, step: 0.01 },
      { key: "bandX1", label: "Band to", min: -2, max: 2, step: 0.01 },
      {
        key: "bandWobble",
        label: "Band wobble",
        min: 0,
        max: 0.3,
        step: 0.005,
      },
      { key: "band2", label: "Band 2", min: -1.5, max: 1.5, step: 0.01 },
      { key: "band2C", label: "Band 2 at", min: -1.5, max: 1.5, step: 0.005 },
      { key: "colTilt", label: "Column tilt", min: -1.5, max: 1.5, step: 0.01 },
      { key: "colFreq", label: "Column freq", min: 0.5, max: 20, step: 0.1 },
    ],
  },
  {
    title: "Accent",
    params: [
      { key: "accentAmt", label: "Amount", min: 0, max: 1, step: 0.01 },
      { key: "accentX", label: "Accent x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "accentY", label: "Accent y", min: -1, max: 1, step: 0.01 },
      { key: "accentSize", label: "Size", min: 0.05, max: 1.5, step: 0.01 },
      { key: "accentNoise", label: "Broken", min: -1, max: 1, step: 0.01 },
      { key: "accentTone", label: "At tone", min: 0, max: 1, step: 0.01 },
      {
        key: "accentToneWidth",
        label: "Tone width",
        min: 0,
        max: 0.5,
        step: 0.005,
      },
      { key: "accentHard", label: "Hard", min: 0, max: 1, step: 0.01 },
      { key: "accentStretch", label: "Stretch", min: 1, max: 6, step: 0.1 },
      { key: "accentPost", label: "Over", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Accent 2",
    params: [
      { key: "accent2Amt", label: "Amount", min: 0, max: 1, step: 0.01 },
      { key: "accent2X", label: "Accent x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "accent2Y", label: "Accent y", min: -1, max: 1, step: 0.01 },
      { key: "accent2Size", label: "Size", min: 0.05, max: 1.5, step: 0.01 },
      { key: "accent2Noise", label: "Broken", min: -1, max: 1, step: 0.01 },
      { key: "accent2Tone", label: "At tone", min: 0, max: 1, step: 0.01 },
      {
        key: "accent2ToneWidth",
        label: "Tone width",
        min: 0,
        max: 0.5,
        step: 0.005,
      },
    ],
  },
  {
    title: "Strikes",
    params: [
      { key: "strikes", label: "Strikes", min: -1, max: 1, step: 0.01 },
      { key: "strikeFreq", label: "Density", min: 2, max: 80, step: 0.5 },
      {
        key: "strikeWidth",
        label: "Width",
        min: 0.001,
        max: 0.05,
        step: 0.0005,
      },
      { key: "strikeBreak", label: "Break", min: 0, max: 1, step: 0.01 },
      { key: "strikeDash", label: "Dash", min: 0, max: 1, step: 0.01 },
      { key: "strikeMix", label: "Dark share", min: 0, max: 1, step: 0.01 },
      { key: "strikeZone", label: "Zone", min: 0, max: 1.5, step: 0.01 },
      { key: "strikeX", label: "Zone x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "strikeY", label: "Zone y", min: -1, max: 1, step: 0.01 },
      { key: "hero", label: "Hero", min: -1, max: 1, step: 0.01 },
      {
        key: "heroOffset",
        label: "Hero offset",
        min: -1.5,
        max: 1.5,
        step: 0.005,
      },
      {
        key: "heroWidth",
        label: "Hero width",
        min: 0.001,
        max: 0.05,
        step: 0.0005,
      },
      { key: "heroX", label: "Hero at", min: -1.5, max: 1.5, step: 0.01 },
      { key: "heroLen", label: "Hero length", min: 0, max: 3, step: 0.01 },
      { key: "heroTint", label: "Hero tint", min: 0, max: 1, step: 0.01 },
      { key: "heroPost", label: "Hero over", min: 0, max: 1, step: 0.01 },
      { key: "hero2", label: "Hero 2", min: -1, max: 1, step: 0.01 },
      {
        key: "hero2Offset",
        label: "Hero 2 offset",
        min: -1.5,
        max: 1.5,
        step: 0.005,
      },
      { key: "hero2X", label: "Hero 2 at", min: -1.5, max: 1.5, step: 0.01 },
      { key: "hero2Len", label: "Hero 2 length", min: 0, max: 3, step: 0.01 },
    ],
  },
  {
    title: "Petals",
    params: [
      { key: "petals", label: "Petals", min: -1.5, max: 1.5, step: 0.01 },
      { key: "petalFreq", label: "Lanes", min: 1, max: 40, step: 0.1 },
      { key: "petalTip", label: "Tip at", min: -1.5, max: 1.5, step: 0.01 },
      { key: "petalJitter", label: "Tip jitter", min: 0, max: 1, step: 0.01 },
      { key: "petalWidth", label: "Width", min: 0.1, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Dabs",
    params: [
      { key: "dabs", label: "Dabs", min: -1, max: 1, step: 0.01 },
      { key: "dabDensity", label: "Density", min: 0, max: 1, step: 0.01 },
      { key: "dabSize", label: "Size", min: 0.01, max: 0.3, step: 0.005 },
      { key: "dabStretch", label: "Stretch", min: 1, max: 8, step: 0.1 },
      { key: "dabMix", label: "Dark share", min: 0, max: 1, step: 0.01 },
      { key: "dabZone", label: "Zone", min: 0, max: 1.5, step: 0.01 },
      { key: "dabX", label: "Zone x", min: -1.5, max: 1.5, step: 0.01 },
      { key: "dabY", label: "Zone y", min: -1, max: 1, step: 0.01 },
      { key: "detailTint", label: "Tint", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Stipple",
    params: [
      { key: "stipple", label: "Stipple", min: 0, max: 0.5, step: 0.005 },
      { key: "stippleSize", label: "Size", min: 0.5, max: 4, step: 0.05 },
      { key: "stippleSparkle", label: "Sparkle", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Finish",
    params: [
      { key: "fibre", label: "Fibre", min: 0, max: 1.5, step: 0.01 },
      { key: "fibreFreq", label: "Fibre freq", min: 1, max: 120, step: 0.1 },
      { key: "fibreBreak", label: "Fibre break", min: 0, max: 1, step: 0.01 },
      { key: "fibreHard", label: "Fibre edges", min: 0, max: 1, step: 0.01 },
      { key: "clump", label: "Clump", min: 0, max: 1, step: 0.01 },
      { key: "fibreZone", label: "Fibre in zone", min: 0, max: 1, step: 0.01 },
      { key: "clumpScale", label: "Clump scale", min: 0.5, max: 12, step: 0.1 },
      { key: "contrast", label: "Contrast", min: 0.5, max: 2, step: 0.01 },
      { key: "shift", label: "Shift", min: -0.4, max: 0.4, step: 0.01 },
      { key: "blend", label: "Blend", min: 0, max: 1, step: 0.01 },
      { key: "chroma", label: "Prism", min: -0.08, max: 0.08, step: 0.0005 },
      { key: "seed", label: "Seed", min: 0, max: 100, step: 1 },
    ],
  },
]

export const STREAK_PARAMS = STREAK_PARAM_GROUPS.flatMap((g) => g.params)

export const ASPECTS = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1,
  "4:5": 4 / 5,
  "9:16": 9 / 16,
} as const

export type Aspect = keyof typeof ASPECTS
