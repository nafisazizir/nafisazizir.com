## Round 3 (family G, soft photo blur)
- Metric 39.98 → 12.97. Fidelity 3 → 3. Final: work/sfx-grey/b1.json.
- soften 0.06, angle ~18, hard 0.1, mass3 for the diagonal top-left lobe, and a light-grey accent blob for the light band. The tune gave 13.6, but its stops drifted warm and cool, so I neutralised them by hand.
- Gap: the dark bottom-right block with its L-shaped corner. massStretch is shared by every mass and the accent, and the lobes need ~4, so any block becomes a long diagonal ellipse; the tune pushed it off-canvas, and the corner is now just a diagonal fade. The diagonal lobe also has to run at the streak angle (18) where the reference's is ~30.

## Round 4 (shader v4)
- Metric 14.21 → 13.76. Fidelity 3 → 3. Final: work/sfx-grey/t5.json.
- The L-block finally exists: mass2 as a box (massShape 4, mass2Stretch 1.2), with angle 18 → 10 so the box's edges sit near horizontal and vertical. mass2Stretch also governs mass3, so the upper diagonal lobe moved to a placed `band` (bandC 0.32, extent -0.3..0.15). Then a tune.
- `edge` (a vertical half-plane) darkened the whole right strip, top included, which the reference doesn't do, so the tune kept it weak. The tune without the band (t4) lost the block again.
- Gap: the main lobe is too wide and runs to the right edge, the upper lobe can't run at its own angle (~30 deg versus the 10 deg streak), and the light band is faint on the right.

## Round 6 (critic fixes)
- Critic grade 3 → my grade 3. R4 metric → R6: see the table in the R6 report; R6 is critic-driven and the metric got worse for most groups (accepted: the critic's located fixes outrank the metric this round).
- Now: Streaks now run at 28 deg: the top-left dark streak is a soft diagonal rising to the right, the middle mass is a wedge widening to the right edge (mass3 on a fixed axis), and the L-cornered block bottom-right is axis-aligned (mass2Angle). The left half is still too flat and pale (lumNoise 0.1 barely mottles it), and the wedge starts further right (~45% x) than the reference's ~30%.
