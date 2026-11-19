/**
 * Layers: opt-in passes laid over a finished image (grain, noise, fractal
 * texture…), shared by the streaks lab and the homepage gradient. The shader
 * that drew the image never knows about them; see post.ts for the pass.
 *
 * A layer type is only a signal generator: a GLSL body that returns a vec3 in
 * about -1..1 for this pixel (0 = no change). Everything else, how much of it,
 * how it blends, which tones it touches, is the shared compositor's job (see
 * COMPOSITE_PARAMS), so a new layer is one file with a body and its sliders.
 *
 * The body runs inside a generated function
 *
 *   vec3 layer_<id>(vec2 px, vec2 uv, float res, float <param>…)
 *
 * with its own params as floats, in the order they're listed (degrees already
 * in radians). In scope:
 * - px:  this pixel in the full image, bottom-left origin;
 * - uv:  centred, height-normalised, so it doesn't change with resolution or
 *        aspect (the streaks' own space);
 * - res: image height / 1080, to size pixel-scale things (grain) so a 4K
 *        export looks like the preview;
 * - u_time, and the helpers in post.ts (l_hash, l_value, l_gnoise, l_fbm,
 *   l_rot, l_seed).
 */

export interface LayerParamSpec {
  key: string
  label: string
  min: number
  max: number
  step: number
  /** Converted to radians before it reaches the shader. */
  deg?: boolean
  /** Named values 0, 1, 2…: drawn as a select instead of a slider. */
  options?: readonly string[]
}

export interface LayerType {
  /** Also the GLSL function's name, so letters, digits and _ only. */
  id: string
  label: string
  description: string
  /** The generator's own params, in the order the body receives them. */
  params: LayerParamSpec[]
  /** A value for every own param, and any composite params to override. */
  defaults: Record<string, number>
  /** Extra GLSL functions the body calls, included once per type. */
  helpers?: string
  body: string
}

/** One layer in a stack: a type, on or off, and its values. */
export interface Layer {
  /** Stable across reorders, for React keys. */
  uid: string
  type: string
  enabled: boolean
  params: Record<string, number>
}

/** A layer as a look stores it (a clone's grain), before it's in a stack. */
export type LayerPreset = Omit<Layer, "uid">

export const BLEND_MODES = [
  "Soft light",
  "Overlay",
  "Add",
  "Multiply",
  "Screen",
] as const

/** What every layer gets, ahead of its own params. */
export const COMPOSITE_PARAMS: LayerParamSpec[] = [
  { key: "amount", label: "Amount", min: 0, max: 1, step: 0.01 },
  {
    key: "blend",
    label: "Blend",
    min: 0,
    max: 4,
    step: 1,
    options: BLEND_MODES,
  },
  { key: "mids", label: "Midtones", min: 0, max: 1, step: 0.01 },
]

export const COMPOSITE_DEFAULTS = { amount: 0.3, blend: 0, mids: 0 }
