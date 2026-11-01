# ads-red — R3 (shader v3), family B

- Metric 44.00 → 29.29. Fidelity 4 → 4.
- Changed: replaced seed-driven column order with deterministic placement: noise 0.21, tilt
  0.2 toward the left (orange edge → reds → blue-grey), `mass` +0.53 stretched vertically at
  x 0.62 for the red column on the right, `mass2` -0.14 top-right (crimson-rose corner),
  `mass3` -0.15 bottom-right; peach `accent` #f2a07a at (-0.18,-0.41) for the peach foot.
  Stops reshaped to grey #827786 / rose / crimson / red / orange. Seed sweep 0-40 found
  nothing better than 7 with noise-driven columns.
- Can't do yet: the accent blob stretches with `massStretch`, so the peach foot becomes a
  full-height column; the ref's columns change colour top to bottom (crimson tops, light
  feet), which needs per-column vertical gradients (a tilt that multiplies with the column
  field, or masses with independent stretch). The right column peaks through red into orange
  (a narrow red-orange-red stripe) where the ref stays red.

# R4 (shader v4)
- params unchanged (29.48). Rebuilt the composition for blotchier columns: a mauve→orange ramp, `accent2` #807a90 for the blue-grey column, the peach foot as accent 1 with its own accentStretch 2, massWarp 0.5, noise 0.5, length 0.7. It looked blotchier (a2 = 32.95).
- A tune on it (`work/ads-red/r4/t1.json`, best 26.93 at it 30) was still running at handback. Adopt it if it looks right.
- Adopted tune t1 on the blotchy rebuild: 24.23 (from 29.48); blotchier and closer by eye, reds slightly duller.

# R6 (critic grade 3)
- Vivid stops (#b65c74, #e2383a, #f8442e, #f86a34, #fca43a) and blend 0.9, which fixes the desaturation.
- accent2 #76789e, size 0.28 at (0.21,-0.38): a wider, more saturated grey-blue column that widens toward the bottom. `mass` -0.3 at (0.2,0.38) for the mauve cap.
- Peach accent at (-0.24,-0.32), size 0.13, accentStretch 2.5: the peach column at about 35% x in the lower half.
- tilt 0.22 at 220° for the yellow-orange bottom-left.
- Metric 24.23 → 29.39 (chosen by eye for the critic's fixes). The right red column still runs slightly orange.
