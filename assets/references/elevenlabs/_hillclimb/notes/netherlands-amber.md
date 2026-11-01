
## Round 3 (shader v3) — 26.80 → 21.78, fidelity 4 → 4
- Pale top stop toned down (#e8c8a2 → tuned #efbc88 with a less cream ramp), scale 3→2.5 for fewer, broader bands, stretch 4, warp 0.5, strikes 0.35→0.18, fibre 0.22 @ 45, soften 0.006. Tune on palette/tilt/mass.
- Seed sweeps (22 seeds over two configs) — seed 33 stays best; placing light bands with stretched masses (massStretch 6) made it worse.
- Can't do yet: placing a specific band (needs a "band" primitive: a mass that is a line along the streak, not a blob), and the white edge flare.

## Round 4 (shader v4) — 21.73 → 18.26, fidelity 4 → 4
- `band` +0.4 (pale) placed in the streak frame, plus mass2/mass3 darkening the top-left and bottom-right; then tuned band/masses/stops (50 it, 21.6 → 17.3). No seed hunting.
- Still can't: a second band (the pale streak at the left edge above the text) — only one band slot.

## Round 6 (critic fixes): 18.26 → 18.70, honest grade 3
- Muted the stops (pale end #dbb684, not #f5bd7c). Dense fine striation: fibre 0.28 @80 with break 0.8, plus fine dashed strikes @55. The broad pale band became narrow cream heroes: one at the right edge (~20% y) and one entering from the left (~47% y), with heroTint toward #e6cca8. Tuned 40 iterations.
- Left over: the top-left is lighter than the reference's, and the underlying bands are a little regular.
