# reception-green — R3 (shader v3)

Metric 47.30 → 28.80 (coarse 23.61 → 11.23). Fidelity 4 → 4 (layout much closer). Final: `work/reception-green/f3.json`.

What changed
- The big error was layout: blue sat top-right where the reference is green. Tilt is now straight down (≈272°), level 0.30, shift -0.21, contrast 1.17. Green holds the top ~55%, periwinkle the bottom and the right-middle.
- Stops: #29825d, #539556, #469c76, #5fa1ce, #7aa6d4.
- Fewer hairlines (fibre 0.25, strikes 0.1) so the streaks read as soft feathers, like the reference. The tuned version with fine strands scored 27.9; I kept the softer one (28.8) because it looks closer.
- Tried and rejected:
  - Radial from the left edge (worse orient and layout).
  - A khaki accent with accentNoise=1. Its mask is `smoothstep(f)`, which is high where the field is high, so on this ramp it lands on the **blue** side and turns it grey. I reversed the ramp so the green is high: same metric, and the khaki became a broad muddy wash rather than thin tints.
  - Prism ±0.015 (no visible khaki, metric neutral).
  - More saturated blue stops (metric worse; the reference's grain lowers its average chroma).
- coh stays ~0.5 whatever I change; it's most likely the reference's heavy grain reading as isotropic.

What the shader can't do yet
- An accent mask that follows the *low* side of the field (signed accentNoise, or an accentBand: the accent only where t sits in a chosen window) would put khaki/orange tints on the green streaks' edges, which is what the reference has.
- Fan/angle are global; the reference's streaks are steeper top-left than lower down. A radial focus far off-canvas gets close but hurts layout.

# reception-green — R4 (shader v4)

Metric 28.80 → 27.89. Fidelity 4 → 4. Final: `work/reception-green/r4/c1.json`.

What changed
- **accentTone** does what R3 couldn't. Accent #b89a50 sits over the whole frame (size 1.5) but only where the palette coordinate is ≈ 0.33 (width 0.045), which is the edge of the green streaks. The result is thin khaki/orange tints on green edges, as in the reference.
- Tone sweep: 0.35 gave tints on green, 0.5–0.7 put them on teal and blue. The tuner then pulled the amount down to 0.32, where it barely shows (27.21). I set 0.42 by hand (27.89) because the tints are visible and match the reference. That's a slightly worse score that looks closer.
- Layout re-tuned with the accent in (stops, level, shift, tilt).

What the shader still can't do
- The reference's green and blue are more saturated than any stop the metric accepts; probably the grain inflates chroma. Nothing more to do in the shader.
- Streak angle varies over the frame (steeper top-left). bendC/fan didn't help without breaking the layout.

# reception-green — R6 (critic fixes)

Metric 27.89 → 29.27. Critic grade 3, mine now 3. Final: `work/reception-green/r6/tc1.json`. I kept it despite the worse score because it addresses the critic's main complaint.

Fixes
- Green streaks now weave through most of the frame: tilt 0.75 → 0.30, noise 1.5, stretch 5, fan 0.6. Tilt was excluded from the tune so it couldn't rebuild a top band.
- Periwinkle at the bottom: accent2 #8c9ce8 at y -0.62.
- Dark blob moved lower: lum -0.4 at (-0.5, -0.22), and the mass moved down with it.

Not fixed
- Radial fan from the left-centre. Radial mode, both from the left edge and from far lower-left, either smeared into flat regions or put orient at 20+. The lower-left focus fixed the angles (orient 7.7) but I couldn't get the layout to settle within budget.
- The middle-right is still mostly blue.
