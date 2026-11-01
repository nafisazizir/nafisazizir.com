
## Round 3 (family A, radial bursts)
- Metric 33.92 → 19.58. Fidelity 3 → 3. Best: work/api-grey/g3.json.
- A full-res crop showed the reference's wisps are far softer and lower in contrast than ours were, not finer. fibre 0.3→0.15 at 60/rad, strikes -0.18→-0.1, noise 0.6→0.45. The focus moved from just above the top edge (0.53, a round-2 workaround for the seam) to (1.2, 0.15). v3's seam sits behind the focus, so it can now sit at mid-right height and the top streaks run flat while the lower ones climb. Layout was tuned twice; the tuner tinted the greys green-teal, so I neutralised them by hand. mass3 adds the lower-right dark band.
- Gap: the left half's streaks are too horizontal, and the top-left light band and the lower-right dark band are weak.

## Round 4 (shader v4)
- Metric 19.58 → 14.50. Fidelity 3 → 3. Best: work/api-grey/r4/c3.json.
- bend -0.15 and bendC -0.5 make the lower-left streaks climb steeply while the top ones run flat (orient 31 → 12). A light `band` sits at top-left. fibreFreq 35, strikeFreq 50, soften 0.012.
- Tried and rejected: moving the focus in-frame to (0.65–0.85, 0.35), which my reading of the reference suggested; it looked like a starburst and orient got worse (46–48).
- Gap: visible curvature with a kink at the left edge, where the reference's rays look straight. The wisps are more regular.

## Round 6 (critic fixes): incomplete
- The shared render server stopped answering mid-round (every job hit a headers timeout, and other families' renders hung too), so I left params/ unchanged from R4. Unfinished candidates are in work/<id>/r6/.
- R6 resumed after the server restart. Metric 14.50 → 23.97 (worse score, chosen by eye: the critic required straight rays). Critic grade 3; my honest grade is 3. Best: work/api-grey/r6/b6.json.
- bend and bendC set to 0, focus (1.8, 0.7) beyond the top-right, fibre 0.4 at 120/rad with fibreBreak 1 (short feathers), strikes at 80/rad.
- Dark top-right: mass -1.2 at (0.62, 0.55). The diagonal dark band is mass3 -1 at (0.32, -0.3) on a fixed axis (mass2Angle 140, mass3Stretch 3). The light cluster under the dark top-right is a band (0.6 at bandC -0.2, width 0.06).
- The metric's best straight version (t1, 19.7) loses the dark top-right, so I rejected it.
- Gap: the 120/rad fibre cap can't reach the reference's density.
