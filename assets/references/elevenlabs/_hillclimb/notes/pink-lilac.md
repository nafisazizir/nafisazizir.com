
## Round 3 (shader v3) — 24.70 → 17.34, fidelity 4 → 4
- Fine fibres removed (fibre 0.05, soften 0.008, stretch 3); the reference is a soft photo blur.
- Magenta lower-right streak is now the accent (#d660c6, amt 0.9 at (0.42,-0.26), size 0.1) instead of a ramp stop, so the ramp can be mauve → pink → pale → magenta → lilac with tilt pointing down; mass3 lifts the bottom-left into violet-lilac.
- Tuned layout (tilt 0.32 @ 270°, angle 11°).
- Can't do yet: the mauve band in the reference holds broken pink streaks inside a narrow band; one field can't be both narrow-dark and internally streaky without the strikes texture fighting the soft blur.

## Round 4 (shader v4) — 17.37 → 15.70, fidelity 4 → 4
- The thick left mass is replaced by a narrow dark `band` (-0.4, c 0.33, width 0.1) at angle 17 with fan 0.3, so the mauve band rises at the reference's angle with pink above it; tuned (50 it).
- fibre 0.16 for streaks inside the band also streaked the pale area (16.4), so I dropped it.
- Still can't: texture confined to one band (fibre/clump has no zone; strikes do, but read as lines, not soft streaks).

## Round 6 (critic fixes): 15.70 → 15.37, honest grade 3
- Mauve: band + band2 (width 0.055, wobble 0.07), limited to bandX0 -0.7 … bandX1 0.4 so they fade out on the right. fibre 0.3 @16 is confined to a strike zone over the top-left (fibreZone 1) (fix 1).
- Magenta streak: hero with heroPost 1, colour #d04cb8, width 0.045, at the lower right (fix 2).
- Periwinkle bottom-left: accent2 #a8a2e8. Purple top-right: accent 1 #b27ccc (fix 3).
- Left over: the two bands read as parallel lines rather than soft irregular smudges.
