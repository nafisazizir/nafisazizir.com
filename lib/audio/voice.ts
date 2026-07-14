export interface Voice {
  register: number

  wave: "sine" | "triangle"

  brightness: number

  pace: number
}

function hash32(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function xorshift(state: number): number {
  let x = state || 0x9e3779b9
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return x >>> 0
}

export function voiceFor(seed: string | number): Voice {
  let s = hash32(String(seed))
  const draw = () => {
    s = xorshift(s)
    return s / 0xffffffff
  }
  return {
    register: Math.round(draw() * 8) - 4,
    wave: draw() < 0.5 ? "sine" : "triangle",
    brightness: 0.85 + draw() * 0.4,
    pace: 0.85 + draw() * 0.2,
  }
}

export function registerRatio(voice: Voice): number {
  return 2 ** (voice.register / 12)
}
