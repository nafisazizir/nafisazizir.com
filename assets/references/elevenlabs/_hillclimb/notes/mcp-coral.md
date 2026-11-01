
## Round 3 (family A, radial bursts)
- Metric 61.58 → 39.18. Fidelity 3 → 3. Best: work/mcp-coral/c3.json.
- Changed: the focus moved from bottom-centre (wrong: rays pointed straight up) to off-frame lower-left (-1.3, -0.75), measured by intersecting the streak directions in the reference. orient went from 46.7 to 19.6. Fibre is the flame-tongue source (0.5, freq 9/rad). Layout and palette were tuned with the focus pinned. The cyan stop the tuner found was replaced with pale blue. soften was dropped from 0.04 to 0.015: at 0.04 the golden-ratio jitter left visible grain-like aliasing over the whole frame.
- Gap: the tongues are not separated by pale gaps and lack rounded tips at the left edge; the frame reads as one diagonal mass. The tuner keeps preferring a bottom-centre focus with vertical petals (better coarse, worse orient), so I overrode it by eye.

## Round 4 (shader v4)
- Metric 39.23 → 30.72. Fidelity 3 → 4. Best: work/mcp-coral/r4/b1.json.
- polar 1 (scale 3, stretch 2) gives tongues with soft ends. Hard fibre (0.6, fibreHard 0.5, freq 10/rad) splits them, with pale gaps between. Tuned with seed and noise unlocked, level about -0.5. Fibre alone at fibreHard 0.7 / freq 8 gives crisp, regular rays (too graphic); polar noise is what makes them tongues.
- Gap: needs more orange/peach highlights and rounded tips at the left edge. The gaps are slightly pink.

## Round 6 (critic fixes): incomplete
- The shared render server stopped answering mid-round (every job hit a headers timeout, and other families' renders hung too), so I left params/ unchanged from R4. Unfinished candidates are in work/<id>/r6/.
- R6 resumed after the server restart. Metric 30.72 → 34.87 (worse score, chosen to meet the critic's fixes). Critic grade 3; my honest grade is 3. Best: work/mcp-coral/r6/t2.json.
- Fibre 0.6→0.4 at 10→7/rad with fibreHard 0.5→0.1 gives soft petals. The lowest stop is now lilac (#b8c6dc), plus a lilac accent (laid on at 0.5 after the blur) at the bottom-left. Level raised to -0.14 for a denser red. Masses and accent tuned.
- soften ≥0.03 here (with the v4 prefilter) melts all structure, so I kept it at 0.02.
- Gap: the middle is pale pink instead of orange tongues; no rounded tongue tips (petals* builds lobes whose tips point outward from the focus, but these tongues end toward the focus side).
