import type { LayerType } from "./types"

/**
 * Film grain: a near-gaussian value per grain cell, smoothly interpolated, so
 * a size above a pixel reads as clumped silver rather than square blocks.
 * Size is in pixels at 1080p, so it scales with the image. Below a pixel (a
 * small preview of fine grain) the cells are averaged away, as they would be
 * by scaling the full-size image down: one value per pixel, weaker by the
 * cell's size. So every resolution shows the grain the export has.
 * Animated, it re-rolls 24 times a second.
 */
export const grain: LayerType = {
  id: "grain",
  label: "Grain",
  description: "Fine film grain, mono or colour",
  params: [
    { key: "size", label: "Size", min: 0.5, max: 4, step: 0.05 },
    { key: "colour", label: "Colour", min: 0, max: 1, step: 0.01 },
    {
      key: "animate",
      label: "Animate",
      min: 0,
      max: 1,
      step: 1,
      options: ["Still", "Flicker"],
    },
    { key: "seed", label: "Seed", min: 0, max: 100, step: 1 },
  ],
  defaults: {
    amount: 0.35,
    mids: 0.6,
    size: 1,
    colour: 0,
    animate: 1,
    seed: 0,
  },
  body: `
  float cell = size * res;
  // On lattice points at a pixel a cell, so neighbours stay independent.
  vec2 p = (px - 0.5) / max(cell, 1.0);
  float k = seed * 7.13 + (animate > 0.5 ? mod(floor(u_time * 24.0), 997.0) * 1.618 : 0.0);
  float m = l_value(p, k);
  vec3 c = vec3(l_value(p, k + 11.0), l_value(p, k + 23.0), l_value(p, k + 37.0));
  return 1.5 * min(cell, 1.0) * mix(vec3(m), c, colour);`,
}
