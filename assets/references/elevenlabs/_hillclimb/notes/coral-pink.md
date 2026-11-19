
## Round 3 (shader v3) — 31.70 → 19.14, fidelity 3 → 4
- The missing pale-yellow glow at top centre is now the accent (#f6d0a0, amt 1, at (-0.02,0.46), size 0.24, noise 0). The blue corner mass shrank (size 0.12) and length 0.8→0.6 so the blue no longer bleeds down the left edge.
- Ramp: coral-red → hot coral → pink → peach → blue, tuned. soften 0.02.
- Can't do yet: petal curvature (steeper at the bottom). bend curves every line the same way; the reference petals curve individually. Seed 3 remains the only good layout.

## Round 4 (shader v4) — 18.04 → 16.75, fidelity 4 → 4
- Tried petals with fibre (fibreHard 0.4 @ 5: too many thin stripes, 24.8) and bend for curvature (wrong way / no gain). What helped: accent2 pink #ea8c94 broken by flipped noise (accent2Noise -1) for pinker petal patches, then a tune on stops/accents/mass (19.1 → 16.7).
- Still can't: individually curving, distinct petals.

## Round 6 (critic fixes): 16.75 → 17.89, honest grade 3
- Prism fringe at the blue wedge: chroma 0, and stop 3 moved from yellow-peach to pink-beige, so the ramp no longer passes through yellow at the wedge edge (fix 1).
- Pink highlights: hero (offset -0.11, X 0.07, len 0.8) and hero2 (offset 0.055, X -0.36, len 0.35), both width 0.05, heroPost 1, colour #f2b2ae, so they sit as soft pink bands without shifting the ramp (fix 2).
- Yellow: a paler accent (#f6dcae) (fix 3). The tuner widened it again (~0.2). A smaller one (0.15) lost the glow, so I kept the tuned size.
