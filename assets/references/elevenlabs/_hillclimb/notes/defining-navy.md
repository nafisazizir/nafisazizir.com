# defining-navy — R3 (shader v3)

Metric 19.72 → 13.32 (coarse 6.42 → 3.96, orient 11.96 → 9.06). Fidelity 4 → 4 (closer within 4).

Changes:
- Strikes off, fibre 0.03, `soften` 0.02: the reference is a pure soft photo blur with no hairlines.
- Oxblood moved out of the ramp into the `accent` (#3a1018, blob off the left edge at (-1.05,-0.43), size 0.32),
  so stops[0] is navy and the oxblood stays in the lower-left only.
- `mass3` +0.25 at (0.03, 0.36), size 0.21: the brighter periwinkle patch at top-centre.
- Tuned layout/palette (tilt, masses, accent, stops, angle 22°).
- Soft `hero` (0.18, width 0.03, offset -0.43) with prism +0.015: the faint cyan glint along the pale boundary at the bottom.

Shader can't yet: give the hero its own hue (it can only lighten; the cyan comes from the prism, which also tints
everything else across edges a little). A second accent would let the periwinkle patch be a real blue rather than a lighter ramp value.

# R4 (shader v4)
Metric 13.32 (R3; 13.24 re-scored on v4) → 11.79. Fidelity 4 → 4.
- Prism off. The bottom glint is now a tinted hero: heroColor #48b6c6, heroTint 1, hero 0.6, width 0.025,
  offset -0.47, heroX -0.2, heroLen 0.5, detailSoften 0.3. No more warm fringes elsewhere.
- In OKLab the accent spread a maroon smudge across the lower centre. accentHard 0.3 and a retune keep it near the
  left/bottom-left.
- Retuned stops, masses and tilt.
Still can't: the hero's tint is capped by |hero|, so getting a saturated glint also lightens the field by the same amount.
A separate tint amplitude (heroTint independent of hero), or a glint that is pure colour with no palette shift, would fix that.

# R6 (critic fixes)
Critic 3 → self 3. Metric 11.79 → 13.74: worse, chosen for the critic's fixes.
- Upper-left: lighter, more saturated stops (#243058/#2e3262) and fibre 0.08 @ 14 for visible diagonal streaks.
- Top-centre blob → mass3Stretch 2.5, so the bright patch is streaked along the sweep instead of round.
  Removing it outright cost 7 points of coarse error.
- Oxblood accent enlarged (size 0.36, y -0.3) so it climbs the left edge. It also tints the lower centre a bit purple.
Not fixed: fine streak texture in the pale band, which reads as noise at this softness.
