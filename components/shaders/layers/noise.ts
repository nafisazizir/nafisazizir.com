import type { LayerType } from "./types"

/**
 * Noise: one octave of smooth gradient noise, for soft mottling over the
 * whole frame. Stretch and angle drag it into streaks of its own; contrast
 * hardens it into patches.
 */
export const noise: LayerType = {
  id: "noise",
  label: "Noise",
  description: "Soft single-octave mottle",
  params: [
    { key: "scale", label: "Scale", min: 0.5, max: 60, step: 0.1 },
    { key: "stretch", label: "Stretch", min: 1, max: 12, step: 0.1 },
    { key: "angle", label: "Angle", min: -90, max: 90, step: 1, deg: true },
    { key: "contrast", label: "Contrast", min: 0, max: 1, step: 0.01 },
    { key: "drift", label: "Drift", min: 0, max: 1, step: 0.01 },
    { key: "seed", label: "Seed", min: 0, max: 100, step: 1 },
  ],
  defaults: {
    amount: 0.2,
    blend: 1,
    scale: 6,
    stretch: 1,
    angle: 0,
    contrast: 0,
    drift: 0.2,
    seed: 0,
  },
  body: `
  vec2 p = l_rot(-angle) * uv;
  p.x /= stretch;
  p = p * scale + l_seed(seed) + drift * u_time * vec2(0.6, 0.25);
  float n = 2.2 * l_gnoise(p);
  n = mix(n, 2.0 * smoothstep(-0.25, 0.25, n) - 1.0, contrast);
  return vec3(n);`,
}
