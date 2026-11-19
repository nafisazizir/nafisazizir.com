## Round 3 (family G, soft photo blur)
- Metric 38.59 → 19.03. Fidelity 4 → 4 (it now has the reference's character: soft, not a crisp radial burst). Final: work/lavender-cream/c6.json.
- Switched from radial to linear streaks at -58. Ramp: lilac, mauve-grey, cream, khaki, near-black. A steep tilt (2 @ 85) gives the lilac→cream→dark progression, with a negative mass2 to keep the top centre cream and a negative mass3 to raise the lilac edge on the right. Then two tunes, plus a mauve-grey accent in the top-left corner, soften 0.01, and short light strikes (-0.3, zone r 0.15) for the khaki streaks at the edge of the dark.
- Tried a near-black accent for the dark mass: mixing in linear RGB means a Gaussian weight only reads as black where it is >0.95, so the dark shrank to a corner. The dark is better in the ramp, where clamping gives a plateau. A lilac accent to shape the boundary bled into the dark along the streaks.
- Gap: the dark stops too high on the right edge, the lilac/cream edge is straighter than the reference's S-curve, and the faint radial rays in the lilac half are missing (a second, radial streak layer would be needed).

## Round 4 (shader v4)
- Metric 18.78 → 19.48 (slightly worse; chosen because it looks closer). Fidelity 4 → 4. Final: work/lavender-cream/v2.json.
- Added `lum` -0.85 at (0.45, 0.35), size 0.16. The near-black now runs down the right edge to y ≈ 0.2 frac, as in the reference; round 3 stopped at about 0.1.
- Gap: the lilac/cream edge is straighter than the reference's S-curve (edge is a single straight half-plane), and the faint radial rays in the lilac half from a right-edge focus are missing.

## Round 6 (critic fixes)
- Critic grade 3 → my grade 3. R4 metric → R6: see the table in the R6 report; R6 is critic-driven and the metric got worse for most groups (accepted: the critic's located fixes outrank the metric this round).
- Now: The cream/lilac boundary is now curved (edgeBend parabola, bounded by edgeSize): lilac strip and top-left corner, the cream dipping on the left and the lilac humping up toward the right. The dark mass is bigger, reaching ~25-30% height at the right. It is a parabola, not the reference's S-wave; a lilac-grey wash smears down the left; the radial line burst in the lower-right lilac is still missing.
