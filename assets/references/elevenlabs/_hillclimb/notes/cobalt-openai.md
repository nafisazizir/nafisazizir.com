# cobalt-openai — R3 (shader v3)

Metric 40.53 → 19.55 (coarse 14.12 → 4.78, pal 6.08 → 1.06). Fidelity 4 → 4 (much closer within 4).

Changes:
- Geometry: angle 12°, fan -0.55, bend -0.15. Streaks now fan from the left (steep rise at bottom-left,
  flat at top-left, falling at the right) instead of one uniform rising angle.
- Palette/layout retuned (stops #1c2ec9 → #9dc5e4, tilt 0.93 @ 194°, contrast 0.64). Cobalt corner is
  mass -0.71 at (0.45, 0.57), size 0.40: tight and deep.
- `knee` 0.7: the pale left was clamping flat at the ramp top; it now keeps its wisps.
- Texture: fibre 0.32 at freq 40 with fibreBreak 1, plus strikes 0.15 @ freq 60 with strikeMix 0.5
  (light and dark hairlines), length 0.5 so the broken wisps survive the blur. This reads as the
  reference's soft broken wisps. Fine fibre at 70–120 looked like ruled lines, not wisps.

Shader can't yet: clump the wisps into a few larger pale "cloud" bands. Fibre/strike density is uniform
across the frame; a low-frequency envelope on fibre amplitude (fibre × smoothstep(fbm at low freq)) would make the clumps.

# R4 (shader v4)
Metric 19.55 (R3) → 19.25. Fidelity 4 → 4.
- `clump` 0.7 at `clumpScale` 2 with fibre 0.9 @ freq 30: the wisps now gather into a few pale cloud bands
  with mid-blue gaps, as in the reference, instead of an even fine texture.
- A soft dark `band` (-0.13 at c -0.15) along the upper-middle, and `bendC` 0.6 (lower lines arc more).
- Retuned stops/tilt/masses.
- I chose this over a 18.23 variant (weaker clump, fibre 0.6). The metric prefers fewer, softer wisps, but
  this one is visibly closer in character. Darker or more saturated stops score much worse (22–25), so the
  "left is too light" read is probably the reference's grain, not the mean colour.
Still can't: wisps that rise more steeply only in the bottom-left without arching the whole frame
(bendC helps a little), and the mottled, high-contrast wisp texture.

# R6 (critic fixes)
Critic 3 → self 3. Metric 19.25 → 19.68.
- Too much bend → bend 0, bendC 0, fan -0.42, angle 10: near-straight, gently fanning streaks.
- Cobalt: mass -0.7 at (0.45, 0.55), size 0.5, retuned. Dark band -0.3 on the right only (bandX0 0.25) at the
  30–45% y right edge. Removed mass2, which made the dark line cluster at ~70% y.
- Busy wisps → strikes 0, fibre 0.75 @ 25 with clump 0.85 @ scale 1.2: fewer, larger soft wisp clusters.
Not fixed: the clusters land upper-left and centre-left, not upper-left and lower-left. Clump placement is noise-driven,
and a seed change reshuffles the whole field.
