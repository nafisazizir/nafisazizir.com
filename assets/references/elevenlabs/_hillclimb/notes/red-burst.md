
## Round 3 (family A, radial bursts)
- Metric 59.11 → 39.01. Fidelity 3 → 3. Best: work/red-burst/b3.json.
- Changed: the focus moved from right-of-centre (0.75, -0.3), which made rays diverge leftward the wrong way, to off-frame left (-1.5, -0.61). orient 56.6 → 14.2. Dabs: noise scale 2, length 0.7, fibre 0.5 at 14/rad, soften 0.03, knee 0.5. Layout and palette tuned. mass3 trims the right edge pale. A seed sweep (7 seeds) confirmed the tuned seed 5 is best.
- Gap: the dabs are less saturated and less separated than the reference's; yellow patches are dimmer; the lower-left pale corner is missing (an accent there gets streaked away). Length below 0.5 turns streaks into round blobs, and above 0.9 it aliases into wiggle at 40 samples.
- Note: the real focus is around (-1.8, -0.7) frac-equivalent, outside the focusX range (min -1.5).

## Round 4 (shader v4)
- Metric 38.73 → 38.14. Fidelity 3 → 3. Best: work/red-burst/r4/c5.json.
- focusX -1.8 (now allowed), polar 1 (scale 3, stretch 2.2), fibre 0.6 at 12/rad with fibreHard 0.5, soften 0.015. Two tunes. The second tune (t2, 35.27) made the lower half salmon with no yellow. I picked c5 (yellow top stop, shift -0.2) even though it scores worse, because it looks closer: red with pink streaks and yellow hot spots.
- Changing stretch reshuffles the whole polar-noise layout (stretch 1.6 broke it), so set stretch before tuning. A seed sweep (4 seeds) didn't beat seed 28.
- Gap: the dabs are too long and soft, the yellow merges into a band instead of patches, and the lower-left pale corner is missing.

## Round 6 (critic fixes): incomplete
- The shared render server stopped answering mid-round (every job hit a headers timeout, and other families' renders hung too), so I left params/ unchanged from R4. Unfinished candidates are in work/<id>/r6/.
- R6 resumed after the server restart. Metric 38.14 → 33.20. Critic grade 2; my honest grade is 3. Best: work/red-burst/r6/c4.json.
- Switched from radial to parallel streaks (angle 24, fan 0.15, swirl 0.15, warp 1, length 0.4, polar off) to get a chaotic, lumpy burst instead of an orderly fan.
- Pale ground: mass2 -1.1 on the right edge (mass2Angle 90, so it stays vertical) and mass3 -1 at top-left. The left notch and the bottom-left corner are pale accents laid on after the blur (accent at 0.7 strength, plus accent2).
- Yellow and pink patches come from dabs (0.4, size 0.12, stretch 3, a 35% share dark, tinted yellow at 0.6). Layout was tuned with seed unlocked.
- Gap: the blobs lack the reference's inner striation and crisp sides; the yellow isn't concentrated in the lower-left lobe.
