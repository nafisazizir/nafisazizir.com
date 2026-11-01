## Round 3 (family G, soft photo blur)
- Metric 22.22 → 18.00. Fidelity 3 → 4. Final: work/green-peach-blur/t1.json.
- New ramp, dark-teal → light-green → peach, so negative masses go dark (in round 2 the light teal sat at stop 0, so "dark" was stuck mid-ramp). The blue-teal bottom-left moved to the accent (#6eaaa4). Added soften 0.075 and mass3 (-0.57) for the dark centre band, then ran a seed sweep (51) and a tune.
- Gap: the peach blob is a smooth ellipse (Gaussian) where the reference is squarish and two-lobed with a pinker lower-left. The greens lack local photographic variation. Hard edges (hard 0.2) didn't help.

## Round 4 (shader v4)
- Metric 18.46 → 18.18. Fidelity 4 → 4. Final: work/green-peach-blur/t4.json.
- The tune with massShape (3.9), massWarp (0.34) and a pink accent2 on the blob's lower-left made it squarer. massShape 6 with less soften (v5, 20.9) looked about the same, since the blur rounds the box anyway.
- Gap: the blob is still close to an ellipse, and the central dark-teal band is slightly too strong.

## Round 6 (critic fixes)
- Critic grade 3 → my grade 3. R4 metric → R6: see the table in the R6 report; R6 is critic-driven and the metric got worse for most groups (accepted: the critic's located fixes outrank the metric this round).
- Now: The main peach blob now reaches the right edge, elongated diagonally; the top-right peach is a vertical shape from the top edge down to ~35% (mass2 on a fixed vertical axis); the dark teal is split into a left-edge patch (lum) and a lower diagonal region (mass3). The top-right peach is narrower than the reference's and the greens are still smoother than the photo.
