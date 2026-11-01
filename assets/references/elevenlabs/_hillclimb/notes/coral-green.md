# coral-green — R3 (shader v3)

Metric 48.49 → 30.14 (coarse 23.57 → 13.89). Fidelity 4 → 3 (re-rated honestly: the old render put the green band diagonally through the centre; the new one is closer but not yet "close"). Final: `work/coral-green/fin.json`.

What changed
- Parallel streaks (angle ≈ 50°, fan 0.2) instead of radial: orient 14.1 → 7.3. The reference is a soft diagonal exposure, not a burst.
- The ramp runs dark green → green → brown → coral → salmon (#01100c, #017d57, #b0603a, #e8654c, #f4a080). The brown stop gives the muddy green-to-coral transitions the reference has.
- Layout:
  - tilt ≈ 74° puts coral on top and green at the bottom;
  - a broad, shallow mass gives the lower-left green and dark core;
  - mass2 adds the bottom dark green;
  - the green **accent** (#2a9a5c) lights the left edge, where the ramp alone gave brown.
- noise ≈ 1.3, scale 2: the reference's band energy is concentrated at mid scales (2.1/3.8 against our 0.9/1.6 before). Softening (soften, low hard) made this *worse*, because the reference is soft but high-contrast at mid scale.
- `knee` 0.4 with a redder coral stop, so the top no longer clamps flat to salmon.
- **hero** = -0.35, width 0.01, at c = -0.062: the single soft dark hairline in the upper middle.
- Fewer hairlines (strikes -0.1, fibre 0.06).
- Tried and rejected:
  - accent green over a coral-only ramp (the accent replaces the dark core; can't have both);
  - mass3 lifts for the pale left band (the metric got worse each time, and it didn't read better).

What the shader can't do yet
- There's one accent. This image wants green (left edge), olive (top-left) and pale peach (left-middle) in places that don't follow the ramp. A second accent, or accents that can be negative (lighten) / blend toward the ramp's top, would fix the top-left and left-middle.
- The accent is a plain lerp, so an accent blob over the dark core turns the core green. An accent "mode" (multiply / only-where-t>x) would keep the core dark.

# coral-green — R4 (shader v4)

Metric:
- R3 30.14 under v3; the same params re-score 32.05 under v4, because OKLab accents made the left-edge green accent muddier.
- R4: 30.38. Fidelity 3 → 3.

Final: `work/coral-green/r4/tb2.json`.

What changed
- Accents re-purposed. Accent 1 is pale peach (#f4ae8c, accentStretch 3), the left-middle band. accent2 is olive (#a39a5a at (-0.5, 0.45)), the top-left. The tuner first pushed accent2 off-canvas (y 0.58); I placed it back by hand.
- The ramp's low end is now green (#0c3730 → #20934a). The dark core comes from **lum** = -1 at (-0.46, -0.40), which goes darker than the ramp end. So the core stays dark while the green around it is a real mid-green.
- accentPost 0.5 keeps the peach band from smearing into the green.
- Tried and rejected:
  - mass3 or a negative mass at the left edge for the bright green (metric worse, the edge reads brown);
  - a smaller lum (core too weak).

What the shader still can't do
- A third local colour: the reference needs green at the left edge, peach at left-middle and olive at the top-left, all off-ramp. With two accents, one of them loses.
- The green blob in the reference is a soft round photo blur with peach streaks crossing it. Ours is streaky throughout. A soften that applies only inside a mask (`softenZone`) would let the green blob be soft while the coral keeps its streaks.

# coral-green — R6 (critic fixes)

Metric 30.38 → 29.94. Critic grade 3, mine now 3. Final: `work/coral-green/r6/ta2.json`.

Fixes
- Large near-black mass at bottom-left: lum -1 at size 0.35, plus a bigger mass, both tuned.
- Fewer green streaks at bottom-right: a positive `edge` half-plane toward the bottom-right, with strikes 0 and fibre 0.03.
- Pink highlight streak in the bottom-centre: a light `band` at c -0.17 spanning x -0.6…0.
- The dark hairline is now one local wisp: heroX 0.36, heroLen 0.4, heroPost 0.6, tinted #163a28.
- Top-left corner: accent2 #a8aa5a.

Not fixed
- Some green streaks remain at the bottom-right.
- The left-edge bright green.
- The corner reads khaki rather than yellow-green.
