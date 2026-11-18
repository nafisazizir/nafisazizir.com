import type { LayerType } from "./types"

/**
 * Fractal: fbm with every knob out, from paper and cloud to ridged veins
 * (ridged folds each octave at zero) and marbled swirls (warp feeds the
 * noise its own displacement).
 */
export const fractal: LayerType = {
  id: "fractal",
  label: "Fractal",
  description: "Multi-octave fbm: paper, cloud, ridges, marble",
  params: [
    { key: "scale", label: "Scale", min: 0.5, max: 40, step: 0.1 },
    { key: "octaves", label: "Octaves", min: 1, max: 8, step: 1 },
    { key: "lacunarity", label: "Lacunarity", min: 1.5, max: 3.5, step: 0.01 },
    { key: "gain", label: "Gain", min: 0.2, max: 0.9, step: 0.01 },
    { key: "ridged", label: "Ridged", min: 0, max: 1, step: 0.01 },
    { key: "warp", label: "Warp", min: 0, max: 2, step: 0.01 },
    { key: "drift", label: "Drift", min: 0, max: 1, step: 0.01 },
    { key: "seed", label: "Seed", min: 0, max: 100, step: 1 },
  ],
  defaults: {
    amount: 0.25,
    blend: 1,
    scale: 4,
    octaves: 5,
    lacunarity: 2.03,
    gain: 0.5,
    ridged: 0,
    warp: 0,
    drift: 0.1,
    seed: 0,
  },
  body: `
  vec2 p = uv * scale + l_seed(seed) + drift * u_time * vec2(0.5, -0.2);
  if (warp > 0.0)
    p += warp * vec2(l_fbm(p + vec2(1.7, 9.2), 4), l_fbm(p + vec2(8.3, 2.8), 4));
  float s = 0.0, a = 1.0, norm = 0.0;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= octaves) break;
    float n = l_gnoise(p);
    s += a * mix(1.4 * n, 0.55 - 2.0 * abs(n), ridged);
    norm += a;
    a *= gain;
    p = l_rot(0.6435) * p * lacunarity + vec2(3.1, 1.7);
  }
  return vec3(1.8 * s / norm);`,
}
