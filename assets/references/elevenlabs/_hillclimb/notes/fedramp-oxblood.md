
## R3 (shader v3), family C
- Metric 24.93 → 17.26; fidelity 4 → 4 (honest: closer, but not a different tier).
- Changed: re-coloured the folded ramp (oxblood, navy, mid-blue, pale aqua #b5c3c8, then back down to periwinkle) so the band is aqua-grey instead of lavender, and the top-left is blue-grey. Two tune passes moved the band and oxblood mass. Prism flipped to negative (-0.02): cyan now sits on the dark side of the pale band and warm on its far side, as in the reference (positive put pink on the dark side). Fibre 0.18 gives soft striations in the dark field.
- Tried: monotonic ramp + positive elongated mass as the ridge (the right side saturates, 46+, dropped); knee (pulls the folded ramp's top back toward the pale stop, worse).
- Shader limits: with a folded ramp the hardest edge lands where the field crosses the top stop, so the band's right edge stays crisper than the reference's soft roll-off, and the field past the last stop is a flat clamp (no texture). An asymmetric edge profile (sharp on one side, soft on the other) has no param.

## R4 (shader v4), family C
- Metric 17.26 → 17.26 (unchanged; the file was only back-filled with the new v4 keys at their defaults).
- Tried: hardSkew 0.4/0.8/-0.4 plus a re-tune (best 17.71). The hard right edge comes from the folded ramp's clamp at the last stop, not from the smoothstep, so skew doesn't soften it.

## R6 (critic fixes), family C
- Critic grade 3; my grade now 3. Metric 17.26 → 18.76 (worse; chosen for the critic's located fixes).
- Fix 1 (prism too strong and long): chroma -0.02 → -0.01, hard 0.40 → ~0.25, fibre 0.18 → 0.06. Now a soft glow band with only a faint fringe.
- Fix 2 (highlight shifted left): level lowered, then re-tuned (no stops/angle/chroma). The pale glow now sits at about 25–50% x at the top.
- Fix 3 (right side should be periwinkle): last stop #8597b1 → #7a8fb8.
- Not fixed: the middle-left is still darker navy than the reference's mauve-grey; a positive mass3 there broke orientation (24+).
