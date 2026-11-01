
## Round 3 (family A, radial bursts)
- Metric 31.38 → 24.32. Fidelity 3 → 3. Best: work/sky-burst/d3.json.
- Changed: the starburst at the tip is gone. A small dark mass3 sits on the tip, fibre went from 12/rad at 0.15 to 4/rad at 0.18 (chunky, few rays) and soften is 0.02, so the tip is now dark with white directly below, like the reference. A pale accent sits at the left edge for the white cloud bank. A tune found the layout, then I moved the focus back to the reference's tip (the tuner slid it right and grew mass3 into a round blob, which scored 18.3 but lost the funnel) and strengthened the blue mass.
- Soften ≥0.05 here is fatal: soften/x at x≈0.3 blurs half a radian and turns the funnel into a round blob.
- Gap: the funnel interior is smooth (the reference has streaky texture); the blue tongue running lower-right from the tip is missing; the top-left cloud is greyish.

## Round 4 (shader v4)
- Metric 25.05 → 14.37. Fidelity 3 → 4. Best: work/sky-burst/r4/t1.json.
- Kept the R3 non-polar structure and added zoom 0.6, core 0.1 and softenCone 0.5. The lower-right blue tongue is a dark `band` (bandC -0.8, width 0.35, x 0–0.6). Then a layout tune.
- Polar noise turned the funnel into a flower of petals (seed-dependent), so I didn't use it.
- In radial mode, bandC is measured from the focus→centre direction; negative turns clockwise.
- Gap: the funnel interior needs more streaky texture; white cloud intrudes at its left edge in the reference; the tip still pinches slightly.

## Round 6 (critic fixes): incomplete
- The shared render server stopped answering mid-round (every job hit a headers timeout, and other families' renders hung too), so I left params/ unchanged from R4. Unfinished candidates are in work/<id>/r6/.
- R6 resumed after the server restart. Metric 14.37 → 20.74 (worse score, chosen to meet the critic's fixes). Critic grade 3; my honest grade is 3. Best: work/sky-burst/r6/a3.json.
- core 0.1→0.25 plus massWarp 0.6 softens the vertex. The secondary streak is the band at bandC -1.0 (was -0.8), lighter at -0.3 (was -0.44), x up to 0.8, wobble 0.1.
- The white cloud is an accent laid on after the blur (0.8) at (-0.98, 0.38), size 0.16, stretch 3. A large white accent over the funnel turns it grey-lavender (OKLab mix), so keep it small and at the edge. The top-right blue spot is accent2 #7aa4bf at (0.9, 0.52), size 0.12.
- Gap: a faint tip convergence remains, and the funnel interior is smooth.
