/**
 * Channels are written as `n / 255` so the numbers match what a colour picker
 * hands you, and stay in the 0–1 range the shader uniforms want.
 *
 * Stops are ordered top → bottom (`u_color1` … `u_color4` in the shader), which
 * means a palette's real character is its luminance shape, not its hue:
 *
 *   ramp     near-black → dark hue → near-white → saturated hue
 *   inverted saturated hue → near-white → dark hue → near-black
 *   high-key no dark anchor; the whole ramp sits bright
 *   duotone  neutral body with a single accent stop
 *   split    warm and cool stops in the same palette
 *
 * Hue is the axis you notice least once the noise and grain chew on it, so the
 * curated set is picked to spread across *shapes* first and hues second.
 */

export type RGB = readonly [number, number, number]

export type Palette = readonly [RGB, RGB, RGB, RGB]

export type PaletteShape =
  "ramp" | "inverted" | "high-key" | "duotone" | "split"

export interface PresetRecord {
  name: string
  colors: Palette
  shape: PaletteShape
  note?: string
}

export const PRESETS = [
  {
    name: "Ocean",
    colors: [
      [22 / 255, 37 / 255, 75 / 255],
      [35 / 255, 65 / 255, 138 / 255],
      [170 / 255, 223 / 255, 217 / 255],
      [223 / 255, 78 / 255, 16 / 255],
    ],
    shape: "split",
  },
  {
    name: "Ember",
    colors: [
      [255 / 255, 236 / 255, 210 / 255],
      [255 / 255, 60 / 255, 0 / 255],
      [13 / 255, 2 / 255, 0 / 255],
      [55 / 255, 12 / 255, 0 / 255],
    ],
    shape: "inverted",
  },
  {
    name: "Lime",
    colors: [
      [211 / 255, 218 / 255, 52 / 255],
      [203 / 255, 178 / 255, 173 / 255],
      [1 / 255, 29 / 255, 141 / 255],
      [1 / 255, 3 / 255, 18 / 255],
    ],
    shape: "inverted",
  },
  {
    name: "Frost",
    colors: [
      [0 / 255, 8 / 255, 22 / 255],
      [0 / 255, 22 / 255, 65 / 255],
      [220 / 255, 238 / 255, 255 / 255],
      [0 / 255, 100 / 255, 255 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Violet",
    colors: [
      [8 / 255, 4 / 255, 16 / 255],
      [26 / 255, 8 / 255, 54 / 255],
      [203 / 255, 182 / 255, 238 / 255],
      [109 / 255, 40 / 255, 240 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Tide",
    colors: [
      [7 / 255, 14 / 255, 18 / 255],
      [14 / 255, 53 / 255, 67 / 255],
      [168 / 255, 201 / 255, 214 / 255],
      [47 / 255, 127 / 255, 143 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Aurora",
    colors: [
      [3 / 255, 10 / 255, 10 / 255],
      [6 / 255, 39 / 255, 43 / 255],
      [228 / 255, 244 / 255, 241 / 255],
      [63 / 255, 213 / 255, 210 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Neon",
    colors: [
      [0 / 255, 6 / 255, 4 / 255],
      [4 / 255, 38 / 255, 28 / 255],
      [230 / 255, 255 / 255, 244 / 255],
      [0 / 255, 229 / 255, 153 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Filament",
    colors: [
      [2 / 255, 12 / 255, 10 / 255],
      [4 / 255, 84 / 255, 62 / 255],
      [255 / 255, 209 / 255, 102 / 255],
      [0 / 255, 229 / 255, 153 / 255],
    ],
    shape: "split",
    note: "Neon's green, but the gold stop breaks the plain ramp.",
  },
  {
    name: "Molten",
    colors: [
      [10 / 255, 4 / 255, 3 / 255],
      [166 / 255, 26 / 255, 8 / 255],
      [255 / 255, 122 / 255, 40 / 255],
      [232 / 255, 58 / 255, 12 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Solar",
    colors: [
      [74 / 255, 10 / 255, 6 / 255],
      [201 / 255, 48 / 255, 14 / 255],
      [247 / 255, 138 / 255, 45 / 255],
      [240 / 255, 214 / 255, 170 / 255],
    ],
    shape: "high-key",
    note: "No black anchor — the only palette that doesn't sink into the page.",
  },
  {
    name: "Overload",
    colors: [
      [12 / 255, 12 / 255, 13 / 255],
      [64 / 255, 62 / 255, 62 / 255],
      [244 / 255, 240 / 255, 236 / 255],
      [255 / 255, 94 / 255, 20 / 255],
    ],
    shape: "duotone",
  },
  {
    name: "Horizon",
    colors: [
      [27 / 255, 58 / 255, 122 / 255],
      [74 / 255, 128 / 255, 214 / 255],
      [252 / 255, 226 / 255, 158 / 255],
      [188 / 255, 76 / 255, 22 / 255],
    ],
    shape: "split",
  },
  {
    name: "Cobalt",
    colors: [
      [0 / 255, 2 / 255, 18 / 255],
      [0 / 255, 30 / 255, 170 / 255],
      [216 / 255, 232 / 255, 255 / 255],
      [26 / 255, 107 / 255, 255 / 255],
    ],
    shape: "ramp",
  },
  {
    name: "Azure",
    colors: [
      [8 / 255, 52 / 255, 190 / 255],
      [22 / 255, 104 / 255, 245 / 255],
      [236 / 255, 244 / 255, 255 / 255],
      [138 / 255, 180 / 255, 255 / 255],
    ],
    shape: "high-key",
  },
  {
    name: "Violet Inverted",
    colors: [
      [109 / 255, 40 / 255, 240 / 255],
      [203 / 255, 182 / 255, 238 / 255],
      [26 / 255, 8 / 255, 54 / 255],
      [8 / 255, 4 / 255, 16 / 255],
    ],
    shape: "inverted",
    note: "Violet's stops reversed, so it falls into black instead of rising out of it.",
  },
] as const satisfies readonly PresetRecord[]

export type PresetName = (typeof PRESETS)[number]["name"]

export const SIGNATURE_PRESET_NAMES = [
  "Solar",
  "Cobalt",
  "Filament",
  "Violet Inverted",
  "Horizon",
] as const satisfies readonly PresetName[]

export type SignaturePresetName = (typeof SIGNATURE_PRESET_NAMES)[number]

export function toPalettes(records: readonly PresetRecord[]): number[][][] {
  return records.map((p) => p.colors.map((c) => [...c]))
}

function byName(name: PresetName): PresetRecord {
  const found = PRESETS.find((p) => p.name === name)
  if (!found) throw new Error(`[gradient-presets] unknown preset: ${name}`)
  return found
}

export const ARCHIVE_PRESETS: readonly PresetRecord[] = PRESETS

export const SIGNATURE_PRESET_RECORDS: readonly PresetRecord[] =
  SIGNATURE_PRESET_NAMES.map(byName)

export const SIGNATURE_PALETTES: number[][][] = toPalettes(
  SIGNATURE_PRESET_RECORDS
)

export const ARCHIVE_PALETTES: number[][][] = toPalettes(ARCHIVE_PRESETS)
