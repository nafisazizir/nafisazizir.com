# support-teal — R3 (shader v3)

Metric 24.19 → 14.02 (coarse 9.24 → 4.11). Fidelity 3 → 4. Final: `work/support-teal/b6.json`.

What changed
- The non-monotonic palette problem (sage top, cream left) is solved with the **accent**: the ramp is teal → sage-grey (#509783 … #d0d7ca), and the accent is cream (#e6dfc8) in a blob on the far left. No more cream bands above the mass.
- Teal now matches the reference's lighter muted tone, and `knee` 0.6 removes the flat clamped teal.
- Stepped silhouette:
  - tilt 1.55 at ~129° (normal to the diagonal flank) with hard 0.8, so the edge is defined;
  - length 0.3 with stretch 6, so the edge breaks into horizontal steps instead of one long horizontal smear. With length 0.6 the diagonal edge smeared into a wide vertical gradient.
- mass3 at the right edge plus noise 0.9 to shrink a pale pocket inside the teal.
- Seed sweep: 37 is clearly best.
- Tried and rejected: a hero dark hairline for the reference's thin dark line at the right. Invisible: the teal sits in the knee roll-off at the bottom of the ramp, so a negative offset barely changes the colour.

What the shader can't do yet
- Hero/strikes act on the palette coordinate, so near a (kneed) ramp end they vanish. A hero/strike mode that darkens or lightens the final colour (a multiplicative or additive luminance term) would draw the dark hairline anywhere.
- The flank shape comes from tilt + gaussian masses + noise, so a straight stepped diagonal is hard. A "ridge" or half-plane mass with its own edge softness would let the silhouette be a placed line.

# support-teal — R4 (shader v4)

Metric:
- R3 14.02 under v3; the same params re-score 14.09 under v4.
- R4: 14.07. Fidelity 4 → 4.

Final: `work/support-teal/r4/h2.json`. Visibly closer.

What changed
- **edge**: a half-plane at about 159° through (-0.20, -0.18), edgeSoft 0.015, tuned alongside tilt and masses. It gives the straight diagonal flank, and a horizontal step at the bottom-left from the horizontal streak blur. orient 11.0 → 7.4.
- The edge-only tune scored 13.58 (`te3`).
- I added a **hero** wisp tinted dark teal (heroColor #2f6f5a, heroTint 0.8, heroPost 0.6, heroX 0.65, heroLen 0.6, offset -0.052) for the thin dark line at the right. In R3 that line was impossible because the hero vanished in the knee. It costs 0.5 in score but is clearly the reference's feature.

What the shader still can't do
- The teal interior's soft mottling (lighter and darker horizontal patches) is flat in ours. The mass and knee flatten the low end. A low-amplitude `lum` noise (brightness modulated by the field noise, after the palette) would bring texture back into clamped regions.
- A small pale pocket in the upper-right teal comes from the field noise. A mask for noise amplitude (less noise inside the mass) would remove it.

# support-teal — R6 (critic fixes)

Metric 14.07 → 12.99. Critic grade 3, mine now 3. Final: `work/support-teal/r6/ta3.json`.

Fixes
- Soft blurred staircase on the left boundary:
  - edgeSoft 0.015 → 0.03, hard 0.8 → 0.7;
  - stretch 8, noise 1.1, length 0.35;
  - edge re-tuned to about 196°.
- Removed the grey streaks at the top-right (strikes 0, fibre 0.03).
- Removed the pale band above the mass: the mint third stop #7ebb94 became #8fb39c.

Not fixed
- The plateau is at ~35% height, not ~28%. Raising it (mass up, tilt angle) cost layout elsewhere and looked worse.
