## Round 3 (family G, soft photo blur)
- Metric 38.21 → 23.25. Fidelity 3 → 3. Final: work/rust-blur/b1.json (tune t1 → t2 → hand edit).
- length 0.5 → 0.2 plus soften ~0.08 turns the directional smear into an isotropic photo blur. Seed sweep (15 best) then two tunes placed the rust blob, the pale centre highlight (mass2) and the right-edge dark spot (mass3); the accent (#f0c894) puts cream in the bottom-left corner. By hand I lightened the darkest stop and widened the highlight: the tuner's version (t2, 21.37) has a near-black, hard-edged blob that reads less like the reference.
- Gap: the reference's dark arc over the highlight and its vivid orange-red lower centre are missing. The shader has only three Gaussian masses (all with one stretch and orientation), so arcs and multi-lobe photo shapes aren't reachable.

## Round 4 (shader v4)
- Metric (R3 params rendered on v4) 24.26 → 20.46. Fidelity 3 → 3. Final: work/rust-blur/t5.json.
- massWarp alone (tuned to 0.37) only bent the blob's outline; it didn't make an arc. The arc over the highlight is a dark `band` on bent streamlines (bend -0.6, angle -10, bandC ~0.3, extent along -0.15..0.7). Also: accent2 (#ca5938, dark orange) at the top centre, `lum` -0.48 for the dark spot at the bottom centre, then a tune over masses, band and lum.
- Gap: the lower-left dark band (the reference's blob continues as a band to the left edge) is missing, and the arc is fainter and more even than the reference's.

## Round 6 (critic fixes)
- Critic grade 3 → my grade 3. R4 metric → R6: see the table in the R6 report; R6 is critic-driven and the metric got worse for most groups (accepted: the critic's located fixes outrank the metric this round).
- Now: Dark core shrunk to ~20-45% x, 45-65% y; saturated orange below and right of it (accent2); a cream bottom-left corner (accent with a hard core); a dark notch at the right edge; a darker left edge (bounded edge). The highlight is still too large and pale, the core is a plain round blob, and the bottom dark red is faint.
