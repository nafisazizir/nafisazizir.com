
## Round 3 (shader v3) — 31.69 → 29.17, fidelity 3 → 3
- Dropped the uniform light strikes (reference is a soft blur, no hairlines); scale 0.9→1.6, noise 0.8, stretch 5, hard 0.1, soften 0.005, angle 26→13.
- Ramp is now navy → blue → cyan → sky → blue-lilac; the pink comes from the new accent (#c4648a, amt 0.85 at (0.45,-0.28), size 0.13, noise 0.3). Mixed over the navy end it gives the reference's wine bottom edge, over blue it gives the pink band. Masses place the navy bottom-left wedge and the wine under the pink.
- Tune (layout keys, angle held) helped coarse 10.9 → 8.0. Tuner on angle drifts to ~8° (orient metric) but the streaks then go flat; held at 13.
- Can't do yet: a third hue. The mid-left lilac-pink wisps need their own colour (accent already spent on the pink band). soften even at 0.012 wipes all streak structure here, so it is barely usable for "soft but still streaky" images.

## Round 4 (shader v4) — 31.28 (R3 migrated; OKLab weakened the pink) → 21.55, fidelity 3 → 4
- Pink restored: accent 1 #cb608e at amt 1, (0.45,-0.33), size 0.16, accentStretch 4. A dark `edge` (-0.95, y -0.38, normal ~272°) makes the dark bottom strip, so the OKLab pink over it reads as wine and over blue as pink.
- accent2 #8f8fc5 (amt 0.43, broken by noise 0.8) for the lilac wisps mid-left; `band` -0.27 at c -0.18 for the rising navy band; removed the bottom masses that made a flat slab. Ramp ends in sky blue, not lilac.
- Tune (60 it, no angle) 24.2 → 20.8. Tried a softer, more rising edge (edgeSoft 0.07, angle 277): 22.9, looks about the same, so I kept the tuned one.
- Still can't: grainy soft fade of the bottom edge (edge is a smoothstep; looks a bit drawn), near-black navy corner without going violet.

## Round 6 (critic fixes): 21.55 → 25.71, honest grade 3
- Angle 13 → 21 with bend/fan 0, so the streaks rise like the reference's (critic fix 1). accent2 at (-0.28,0.08) with noise 1 gives broken lilac-pink diagonals on the left (fix 2).
- Removed the full-width bottom `edge`. Navy is now a small mass in the bottom-left corner, plus `band` as the dark ~75% band on the left. lum darkens the bottom centre, and the pink accent (#c8588a, amt 1, at (0.36,-0.42)) fills the bottom right (fix 3). Tuned 50 iterations.
- The metric got worse (21.6 → 25.7), but the result is visibly closer on all three critic points. I chose it deliberately.
- Left over: the wine-dark very bottom-right, and the lilac haze on the right at ~70%.
