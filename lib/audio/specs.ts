import { registerRatio, type Voice } from "./voice"

export interface ToneLayer {
  kind: "tone"
  wave: "sine" | "triangle" | "square" | "sawtooth"

  fixed?: boolean

  from: number
  to: number

  at: number

  duration: number

  peak: number
}

export interface NoiseLayer {
  kind: "noise"

  from: number
  to: number

  q: number
  at: number
  duration: number
  peak: number
}

export interface FmLayer {
  kind: "fm"
  from: number
  to: number

  ratio: number

  index: number

  fixed?: boolean
  at: number
  duration: number
  peak: number
}

export type Layer = ToneLayer | NoiseLayer | FmLayer

export interface SoundSpec {
  name: string
  layers: Layer[]
}

export type VerticalDirection = "up" | "down"
export type ToggleState = "on" | "off"
export type SpatialDirection = "in" | "out"
export type PageDirection = "forward" | "back"

export function duration(spec: SoundSpec): number {
  return spec.layers.reduce((max, l) => Math.max(max, l.at + l.duration), 0)
}

const MATERIAL = 2.76

const GLASS = 1.27

const G4 = 392
const C5 = 523.25
const E5 = 659.25
const G5 = 783.99

function voiced(spec: SoundSpec, voice?: Voice): SoundSpec {
  if (!voice) return spec
  const ratio = registerRatio(voice)
  return {
    name: spec.name,
    layers: spec.layers.map((l) => {
      const at = l.at * voice.pace
      const dur = l.duration * voice.pace
      if (l.kind === "tone") {
        return {
          ...l,
          at,
          duration: dur,
          from: l.from * ratio,
          to: l.to * ratio,
          wave: l.fixed ? l.wave : voice.wave,
        }
      }
      if (l.kind === "fm") {
        return {
          ...l,
          at,
          duration: dur,
          from: l.from * ratio,
          to: l.to * ratio,
          index: l.fixed ? l.index : l.index * voice.brightness,
          ratio: l.fixed || voice.wave === "sine" ? l.ratio : l.ratio * GLASS,
        }
      }
      return {
        ...l,
        at,
        duration: dur,
        from: l.from * voice.brightness,
        to: l.to * voice.brightness,
      }
    }),
  }
}

export function tap(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "tap",
      layers: [
        {
          kind: "noise",
          from: 4500,
          to: 4500,
          q: 3,
          at: 0,
          duration: 0.008,
          peak: 0.75,
        },
      ],
    },
    voice
  )
}

export function nudge(direction: VerticalDirection, voice?: Voice): SoundSpec {
  const [from, to] = direction === "up" ? [500, 570] : [570, 500]
  return voiced(
    {
      name: `nudge-${direction}`,
      layers: [
        {
          kind: "fm",
          from,
          to,
          ratio: MATERIAL,
          index: 2.5,
          at: 0,
          duration: 0.045,
          peak: 0.5,
        },
      ],
    },
    voice
  )
}

export function toggle(state: ToggleState, voice?: Voice): SoundSpec {
  const [first, second] = state === "on" ? [330, 440] : [440, 330]
  return voiced(
    {
      name: `toggle-${state}`,
      layers: [
        {
          kind: "fm",
          from: first,
          to: first,
          ratio: MATERIAL,
          index: 3,
          at: 0,
          duration: 0.035,
          peak: 0.48,
        },
        {
          kind: "fm",
          from: second,
          to: second,
          ratio: MATERIAL,
          index: 3,
          at: 0.055,
          duration: 0.04,
          peak: 0.52,
        },
        {
          kind: "noise",
          from: 2600,
          to: 2600,
          q: 3,
          at: 0.055,
          duration: 0.008,
          peak: 0.3,
        },
      ],
    },
    voice
  )
}

export function slide(direction: SpatialDirection, voice?: Voice): SoundSpec {
  const [from, to] = direction === "in" ? [900, 2600] : [2600, 900]
  return voiced(
    {
      name: `slide-${direction}`,
      layers: [
        { kind: "noise", from, to, q: 2.5, at: 0, duration: 0.07, peak: 0.3 },
      ],
    },
    voice
  )
}

export function confirm(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "confirm",
      layers: [
        {
          kind: "noise",
          from: 3400,
          to: 3400,
          q: 3,
          at: 0,
          duration: 0.006,
          peak: 0.35,
        },
        {
          kind: "fm",
          from: 330,
          to: 392,
          ratio: MATERIAL,
          index: 4,
          at: 0.004,
          duration: 0.085,
          peak: 0.45,
        },
      ],
    },
    voice
  )
}

export function deny(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "deny",
      layers: [
        {
          kind: "fm",
          from: 165,
          to: 147,
          ratio: MATERIAL,
          index: 1.2,
          fixed: true,
          at: 0,
          duration: 0.1,
          peak: 0.45,
        },
        {
          kind: "noise",
          from: 700,
          to: 700,
          q: 2,
          at: 0,
          duration: 0.01,
          peak: 0.18,
        },
      ],
    },
    voice
  )
}

export function turn(direction: PageDirection, voice?: Voice): SoundSpec {
  const [from, to] = direction === "forward" ? [1200, 2400] : [2400, 1200]
  const landing = direction === "forward" ? 196 : 175
  return voiced(
    {
      name: `turn-${direction}`,
      layers: [
        { kind: "noise", from, to, q: 2.5, at: 0, duration: 0.055, peak: 0.28 },
        {
          kind: "fm",
          from: landing,
          to: landing,
          ratio: MATERIAL,
          index: 2,
          at: 0.06,
          duration: 0.05,
          peak: 0.4,
        },
      ],
    },
    voice
  )
}

export function open(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "open",
      layers: [
        {
          kind: "fm",
          from: 392,
          to: 523,
          ratio: MATERIAL,
          index: 3.5,
          at: 0,
          duration: 0.08,
          peak: 0.45,
        },
        {
          kind: "noise",
          from: 1400,
          to: 2800,
          q: 2,
          at: 0,
          duration: 0.06,
          peak: 0.14,
        },
      ],
    },
    voice
  )
}

export function close(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "close",
      layers: [
        {
          kind: "fm",
          from: 523,
          to: 392,
          ratio: MATERIAL,
          index: 3.5,
          at: 0,
          duration: 0.08,
          peak: 0.45,
        },
        {
          kind: "noise",
          from: 2800,
          to: 1400,
          q: 2,
          at: 0,
          duration: 0.06,
          peak: 0.14,
        },
      ],
    },
    voice
  )
}

export function copy(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "copy",
      layers: [
        {
          kind: "noise",
          from: 4000,
          to: 4000,
          q: 3,
          at: 0,
          duration: 0.006,
          peak: 0.3,
        },
        {
          kind: "fm",
          from: 620,
          to: 620,
          ratio: MATERIAL,
          index: 3,
          at: 0.004,
          duration: 0.04,
          peak: 0.5,
        },
        {
          kind: "fm",
          from: 620,
          to: 620,
          ratio: MATERIAL,
          index: 1.4,
          at: 0.075,
          duration: 0.045,
          peak: 0.24,
        },
      ],
    },
    voice
  )
}

export function paste(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "paste",
      layers: [
        {
          kind: "fm",
          from: 620,
          to: 620,
          ratio: MATERIAL,
          index: 1.4,
          at: 0,
          duration: 0.04,
          peak: 0.24,
        },
        {
          kind: "noise",
          from: 4000,
          to: 4000,
          q: 3,
          at: 0.07,
          duration: 0.006,
          peak: 0.3,
        },
        {
          kind: "fm",
          from: 620,
          to: 620,
          ratio: MATERIAL,
          index: 3,
          at: 0.074,
          duration: 0.05,
          peak: 0.5,
        },
      ],
    },
    voice
  )
}

export function remove(voice?: Voice): SoundSpec {
  return voiced(
    {
      name: "remove",
      layers: [
        {
          kind: "fm",
          from: 233,
          to: 208,
          ratio: MATERIAL,
          index: 1.6,
          fixed: true,
          at: 0,
          duration: 0.06,
          peak: 0.45,
        },
        {
          kind: "noise",
          from: 1100,
          to: 1100,
          q: 2,
          at: 0,
          duration: 0.008,
          peak: 0.2,
        },
      ],
    },
    voice
  )
}

export const specs = {
  tap,
  nudge,
  toggle,
  slide,
  turn,
  open,
  close,
  copy,
  paste,
  confirm,
  deny,
  remove,
}

export const REGISTER = { G4, C5, E5, G5 }
export { GLASS, MATERIAL }
