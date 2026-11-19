# detect-navy — R3 (shader v3)

Metric 23.47 → 20.62 (coarse 8.4 → 6.17, pal 2.85 → 1.63, orient 15.9 → 16.1). Fidelity 4 → 4 (closer).

Changes:
- Strikes off (the reference has no hairlines except one), fibre 0.06, soften 0.015.
- Oxblood moved from stops[0] into the `accent` (#3a1622 near (-0.35, 0.6), size 0.24); the ramp is now
  navy → pale, so the dark top-right reads navy instead of maroon.
- Retuned stops (pale end greyer, #9cb2bc-ish), tilt, masses, contrast. mass3 lightens the top-right a bit.
- The single cyan line: `hero` 0.4, width 0.015, offset -0.33 on the pale/dark boundary, with prism +0.015.
  The prism puts cyan on the dark side of the lightened line, then blue, then navy, as in the reference.
  A negative prism made a red/yellow rainbow instead.

Shader can't yet: give the hero its own colour. Its cyan comes from the global prism, which also adds a faint
warm fringe on the pale side and on other edges. The accent blob also spreads its tint further than the
reference's tight oxblood corner when it's made strong enough to read.

# R4 (shader v4)
Metric 20.62 (R3; 20.2 re-scored on v4) → 17.54. Fidelity 4 → 4.
- Prism off. The cyan line is a tinted hero: heroColor #3fb2c8, heroTint 1, hero 0.32, width 0.016,
  offset -0.325, detailSoften 0, so it stays crisp over the soft field. Clean cyan, no rainbow.
- `lum` +0.36 at (0.48, 0.50), size 0.21: the lighter periwinkle top-right corner.
- accentHard 0.2. Retuned stops, masses, tilt and accent.
Tried: a light band beside the line to get the periwinkle zone. It just widened the pale area.
Still can't: lay a colour ramp across one edge (pale | cyan | periwinkle | navy) without also shifting the
palette coordinate. An "edge gradient" accent keyed to the hero offset (accentTone helps, but it is global) would do it.

# R6 (critic fixes)
Critic 3 → self 3. Metric 17.54 → 17.42.
- The hairline is now a short soft wisp: heroX -0.38, heroLen 0.35, width 0.02, upper-left only.
- Left edge: mass2 -0.3 at (-0.5, 0.08) keeps it grey-blue down to ~30%.
- Top-right periwinkle: accent2 #5d6aa8 at (0.5, 0.5). `lum` didn't work, because multiplying navy stays navy.
- Right edge mid stays navy: mass3 -0.2 at (0.5, 0).
