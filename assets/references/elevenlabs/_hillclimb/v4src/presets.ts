/**
 * Streak presets and the param schema the studio UI and renderer share.
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

export interface StreakPreset extends StreakParams {
  name: string
}

// What a preset doesn't set. The newer controls default to off, so older
// presets render as they did.
export const STREAK_DEFAULTS: Omit<StreakParams, "stops"> = {
  angle: -60,
  bend: 0.1,
  fan: 0.2,
  swirl: 0.08,
  length: 1.6,
  soften: 0,
  detailSoften: 1,
  zoom: 0,
  polar: 0,
  core: 0,
  radial: 0,
  focusX: 0,
  focusY: 0,
  scale: 0.9,
  noise: 1,
  stretch: 1,
  warp: 0.5,
  hard: 0.45,
  hardSkew: 0,
  level: 0,
  knee: 0,
  tilt: 0.35,
  tiltAngle: 30,
  mass: 0,
  massX: 0,
  massY: 0,
  massSize: 0.35,
  mass2: 0,
  mass2X: 0,
  mass2Y: 0,
  mass2Size: 0.35,
  mass3: 0,
  mass3X: 0,
  mass3Y: 0,
  mass3Size: 0.35,
  massStretch: 1,
  mass2Stretch: 1,
  massShape: 2,
  massWarp: 0,
  dabs: 0,
  dabDensity: 0.3,
  dabSize: 0.06,
  dabStretch: 2,
  dabMix: 0,
  accent: "#ffffff",
  accentAmt: 0,
  accentX: 0,
  accentY: 0,
  accentSize: 0.5,
  accentNoise: 0,
  accentHard: 0,
  accentStretch: 1,
  accentPost: 0,
  accent2: "#ffffff",
  accent2Amt: 0,
  accent2X: 0,
  accent2Y: 0,
  accent2Size: 0.5,
  accent2Noise: 0,
  band: 0,
  bandC: 0,
  bandWidth: 0.08,
  bandX0: -2,
  bandX1: 2,
  bendC: 0,
  bandWobble: 0,
  heroColor: "#ffffff",
  heroTint: 0,
  heroPost: 0,
  hero2X: 0,
  hero2Len: 0,
  clump: 0,
  clumpScale: 3,
  softenCone: 0,
  accentTone: 0.5,
  accentToneWidth: 0,
  lum: 0,
  lumX: 0,
  lumY: 0,
  lumSize: 0.4,
  edge: 0,
  edgeX: 0,
  edgeY: 0,
  edgeAngle: 90,
  edgeSoft: 0.1,
  edgeSize: 0,
  band2: 0,
  band2C: 0,
  petals: 0,
  petalFreq: 8,
  petalTip: 0,
  petalJitter: 0.3,
  petalWidth: 0.7,
  colTilt: 0,
  colFreq: 4,
  fibreZone: 0,
  lumPost: 0,
  mass2Angle: 0,
  mass3Stretch: 0,
  edgeBend: 0,
  lumNoise: 0,
  accent2Tone: 0.5,
  accent2ToneWidth: 0,
  detailColor: "#ffffff",
  detailTint: 0,
  softenZone: 0,
  softenX: 0,
  softenY: 0,
  dabZone: 0,
  dabX: 0,
  dabY: 0,
  strikes: 0,
  strikeFreq: 20,
  strikeWidth: 0.006,
  strikeBreak: 0.3,
  strikeDash: 0.3,
  strikeMix: 0,
  strikeZone: 0,
  strikeX: 0,
  strikeY: 0,
  hero: 0,
  heroOffset: 0,
  heroWidth: 0.004,
  heroX: 0,
  heroLen: 0,
  hero2: 0,
  hero2Offset: 0,
  fibre: 0.1,
  fibreFreq: 10,
  fibreBreak: 0,
  fibreHard: 0,
  contrast: 1.35,
  shift: 0,
  blend: 0,
  chroma: 0.004,
  seed: 7,
}

type PresetInput = Partial<Omit<StreakParams, "stops">> & {
  name: string
  stops: Stops
}

// Dash length used to follow strikeBreak, and every mass shared one stretch;
// presets from before keep that.
const define = (p: PresetInput): StreakPreset => ({
  ...STREAK_DEFAULTS,
  strikeDash: p.strikeBreak ?? STREAK_DEFAULTS.strikeDash,
  mass2Stretch: p.massStretch ?? 1,
  ...p,
})

export const STREAK_PRESETS: StreakPreset[] = [
  define({
    name: "Slate",
    stops: ["#22080d", "#2e3470", "#6170b0", "#a2b2c8", "#cbd5da"],
    angle: -66,
    fan: -0.3,
    tilt: 0.2,
    mass: -0.7,
    massX: 0.1,
    massY: -0.25,
    massSize: 0.32,
    seed: 3,
  }),
  define({
    name: "Sage",
    stops: ["#2c726c", "#4b9180", "#98b8a0", "#cbd3c3", "#e6e1cc"],
    angle: 0,
    bend: 0.06,
    fan: 0.05,
    length: 1.1,
    scale: 0.8,
    hard: 0.75,
    tilt: 0.8,
    tiltAngle: 120,
    fibre: 0.05,
    seed: 11,
  }),
  define({
    name: "Dusk",
    stops: ["#1d0f1f", "#2a2d63", "#5a6fa3", "#9fb0b8", "#d6d8cb"],
    angle: -24,
    fan: 0.4,
    bend: 0.12,
    tilt: 0.3,
    tiltAngle: 330,
    seed: 5,
    mass: -0.6,
    massX: -0.6,
    massY: 0.3,
    massSize: 0.4,
  }),
  define({
    name: "Architect",
    stops: ["#1f0d1a", "#262c5c", "#4b5f99", "#9db3c3", "#c6d4d9"],
    angle: -50,
    fan: 0.2,
    tilt: 0.55,
    tiltAngle: 220,
    hard: 0.55,
    chroma: 0.008,
    seed: 23,
    mass: -0.5,
    massX: 0.5,
    massY: 0.35,
  }),
  define({
    name: "Orchid",
    stops: ["#5a0d38", "#a5306a", "#d58db0", "#ead7df", "#cfd3cc"],
    angle: -30,
    bend: 0.2,
    fan: 0.25,
    tilt: 0.3,
    tiltAngle: 200,
    seed: 14,
    contrast: 1.5,
    mass: -0.8,
    massX: 0.3,
    massY: 0.0,
    massSize: 0.3,
  }),
  define({
    name: "Ochre",
    stops: ["#56719a", "#a3b2c2", "#e0bf78", "#cc8e3a", "#f0d9a8"],
    angle: -18,
    bend: -0.08,
    fan: 0.1,
    swirl: 0.12,
    length: 1.6,
    tilt: 0.3,
    tiltAngle: 270,
    hard: 0.3,
    contrast: 1.6,
    seed: 21,
    fibre: 0.08,
    shift: -0.15,
  }),
  define({
    name: "Amber",
    stops: ["#6a7d9c", "#a9b2b8", "#e0b47a", "#cf8a3c", "#f2dcb3"],
    angle: -12,
    bend: 0.05,
    fan: 0.15,
    length: 1.6,
    tilt: 0.35,
    tiltAngle: 200,
    mass: 0.35,
    massY: -0.25,
    massSize: 0.4,
    fibre: 0.08,
    seed: 27,
    massX: -0.4,
  }),
  define({
    name: "Coral sky",
    stops: ["#b9360f", "#e0652e", "#b9c4d8", "#a6c1df", "#dde7f0"],
    angle: -42,
    bend: 0.25,
    swirl: 0.2,
    length: 1.2,
    tilt: 0.3,
    tiltAngle: 60,
    hard: 0.55,
    seed: 18,
    shift: 0.2,
    mass: -0.8,
    massX: -0.25,
    massY: -0.15,
    massSize: 0.25,
  }),
  define({
    name: "Ember",
    stops: ["#c04c17", "#d9712f", "#e79a55", "#efbb7f", "#f5d9b0"],
    angle: 22,
    bend: 0.06,
    fan: 0.05,
    swirl: 0.18,
    length: 1.4,
    scale: 1.8,
    tilt: 0.2,
    hard: 0.2,
    fibre: 0.22,
    fibreFreq: 5,
    contrast: 1.2,
    seed: 9,
    shift: 0.05,
  }),
  define({
    name: "Glacier",
    stops: ["#2a2560", "#2f3a85", "#6a7cc4", "#b2c1d4", "#dfe5e9"],
    angle: 18,
    fan: 0.3,
    tilt: 0.9,
    tiltAngle: 70,
    mass: -0.25,
    massX: -0.4,
    massY: -0.2,
    seed: 42,
  }),
  define({
    name: "Moss",
    stops: ["#4f8a2c", "#86b04a", "#b9d27f", "#d8e4bd", "#eef0df"],
    angle: -30,
    fan: 0.3,
    bend: 0.1,
    tilt: 0.4,
    tiltAngle: 120,
    seed: 31,
    contrast: 1.5,
  }),
  define({
    name: "Steel",
    stops: ["#1f2a3f", "#43577c", "#869cbb", "#b9c7d3", "#dfe5e8"],
    angle: -58,
    fan: 0.15,
    tilt: 0.45,
    tiltAngle: 30,
    fibre: 0.18,
    seed: 2,
  }),
  define({
    name: "Cobalt",
    stops: ["#0b2a9e", "#1e54d6", "#4f8fe0", "#a6c6ec", "#eef2f7"],
    angle: -18,
    bend: 0.04,
    fan: 0.1,
    swirl: 0.05,
    length: 2,
    scale: 1.2,
    hard: 0.5,
    tilt: 0.35,
    tiltAngle: 225,
    fibre: 0.25,
    contrast: 1.4,
    shift: -0.1,
    seed: 4,
  }),
  define({
    name: "Burst",
    stops: ["#0e3468", "#245f96", "#7fa5c4", "#d3dde4", "#f1f3f2"],
    angle: 90,
    bend: 0,
    fan: 0.5,
    swirl: 0.1,
    length: 1.8,
    hard: 0.5,
    tilt: 0,
    mass: -1.5,
    massX: -0.1,
    massY: 0.15,
    massSize: 0.45,
    contrast: 1.6,
    shift: 0.1,
    seed: 16,
  }),
  define({
    name: "Turbo",
    stops: ["#c11a08", "#d9300f", "#ea5520", "#f39050", "#f7cf9c"],
    angle: -35,
    bend: 0.04,
    fan: 0.1,
    length: 2,
    scale: 1.4,
    hard: 0.4,
    tilt: 0.25,
    tiltAngle: 45,
    fibre: 0.28,
    fibreFreq: 8,
    contrast: 1.6,
    shift: -0.22,
    chroma: 0,
    seed: 12,
  }),
  define({
    name: "Graphite",
    stops: ["#151516", "#424244", "#7b7b7d", "#b0b0b1", "#d9d9d9"],
    angle: -15,
    bend: 0.15,
    fan: 0.2,
    length: 2.2,
    warp: 0.9,
    hard: 0.45,
    fibre: 0.2,
    contrast: 1.7,
    chroma: 0,
    seed: 33,
  }),
  define({
    name: "Scribe",
    stops: ["#2f6a1e", "#4f8a2e", "#7fae55", "#b9d39a", "#e6eedc"],
    angle: -30,
    fan: 0.05,
    length: 2.2,
    scale: 1.6,
    hard: 0.35,
    tilt: 0.15,
    fibre: 0.35,
    fibreFreq: 6,
    contrast: 1.5,
    shift: -0.18,
    seed: 8,
  }),
  define({
    name: "Bloom",
    stops: ["#0f4a2c", "#2f7a45", "#e46a52", "#f39a7e", "#f7c8b0"],
    angle: -40,
    fan: 0.45,
    length: 1.8,
    hard: 0.5,
    tilt: 0.5,
    tiltAngle: 45,
    seed: 19,
  }),
  define({
    name: "Lilac",
    stops: ["#8a3fa0", "#c070c6", "#e2a8de", "#f0d8ee", "#f6eef3"],
    angle: -15,
    length: 2,
    scale: 1.2,
    hard: 0.5,
    tilt: 0.3,
    tiltAngle: 270,
    fibre: 0.2,
    contrast: 1.5,
    seed: 6,
  }),
]

export const ASPECTS = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1,
  "4:5": 4 / 5,
  "9:16": 9 / 16,
} as const

export type Aspect = keyof typeof ASPECTS
