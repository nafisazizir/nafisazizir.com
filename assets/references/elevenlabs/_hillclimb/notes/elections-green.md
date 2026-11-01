# elections-green — R3 (shader v3)

Metric 36.77 → 17.18 (coarse 15.35 → 7.27). Fidelity 3 → 4. Final: `work/elections-green/d5.json`.

What changed
- Palette muted toward the reference's grey-greens (#6c9c50 … #aec8bd), contrast ~1.0, `knee` 0.4. The old ramp was too saturated and its pale end sat top-right.
- Tilt now points straight down (tiltAngle ≈ 273), so green is on top and the pale blue-grey haze is on the bottom half, as in the reference.
- `soften` 0.015 and `hard` 0.15 give the hazy photo look. Fibre at 45/0.6 break gives faint strands.
- The dark blob on the left edge comes from the **accent** (#3a7a2c, size 0.07, at (-0.5, -0.22)), not from a mass. A mass can't get darker than the ramp's low stop, and a darker low stop turns the whole top band dark and streaky.
- mass3 adds a pale lift below the blob.

What the shader can't do yet
- Only one accent: it went to the dark blob, so the yellow-olive flecks (an accent with accentNoise=1 scored about the same) had to go. A second accent, or a per-accent "fleck" mode, would get both.
- Masses are bounded by the ramp ends, so a local dark spot needs a darker stop that also changes everything else.

# elections-green — R4 (shader v4)

Metric:
- R3 17.18 under v3; the same params re-score 17.31 under v4.
- R4: 16.74. Fidelity 4 → 4.

Final: `work/elections-green/r4/g1.json`.

What changed
- **accent2** yellow-green (#b6c66a, accent2Noise -1, size ≈ 0.46) gives the yellow-olive flecks back, while accent 1 stays the dark left-edge blob.
- **dabs** 0.4 (density 0.55, size 0.025, stretch 6, dark share 0.35, detailSoften 0.6) gives short wisps like the reference's.
- At dabs 0.55 with detailSoften 0.3 the wisps looked a touch crisper and closer, but scored 19.4. I took 0.4 as the middle.
- Re-tuned stops, tilt and accent2.
- The tuner's best (15.50) turned accent2 into a saturated lime (#bfd358) that reads too lime in the centre. I toned it down to #b6c66a at 0.5 (16.74). That's a slightly worse score that looks closer.

What the shader still can't do
- Dabs move the palette coordinate, so they can only be ramp colours. A dab colour of its own (`dabColor` plus a tint) would make the yellow flecks real flecks rather than a broad accent wash.

# elections-green — R6 (critic fixes)

Metric 16.74 → 16.09. Critic grade 3, mine now 3. Final: `work/elections-green/r6/ta3.json`.

Fixes
- Broad soft masses instead of many even thin streaks:
  - scale 2.2, fibre 0.12, strikes 0.05, dabs 0.25;
  - soften 0.015 with softenCone 0.4;
  - clump 0.5 and lumNoise 0.06 for mottle.
- Upper-left now mid-saturated green: darker low stop #5a9446, and mass2 as a negative diagonal mass at the upper-middle (stretch 3).
- Softer, wider transition to the pale lower half: tilt 1.5 → 0.9, then tuned.

Not fully fixed
- The dark diagonal mass across the upper-middle is weaker than the reference's.
- The bottom half is a bit flat.
