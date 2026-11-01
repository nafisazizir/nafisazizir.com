# scribe-green — R3 (shader v3)

Metric 32.93 → 19.04 (coarse 15.62 → 8.44). Fidelity 4 → 4 (visibly closer). Final: `work/scribe-green/b4.json`.

What changed
- Lower-contrast green ramp (#48802b … #a8c4c0) with `knee` 0.3. The old render had a dark band bottom-left and a pale top-right that the reference doesn't have.
- Tuned tilt/masses: slightly darker bottom-left, pale bottom-right, a small light mass2 at mid-left.
- Light accent (#a8b064, accentNoise 1) gives the olive tint in the centre.
- The wide blue-grey streaks are **strikes** used as soft bands: strikes 0.9, strikeWidth 0.03, strikeFreq 5, zone 1.0 centred left. They push the palette coordinate to the blue-grey top stop, which gives the transparent pale-blue streaks over green.
- soften 0.015, hard 0.12. Angle 30.
- The tuner drifted stop 2 to a muddy olive-brown (#7d8f58) that made a mauve cast. I fixed it by hand.

What the shader can't do yet
- Strike colour is tied to the ramp end. A strike colour of its own (or strikes that blend toward the accent) would let the blue-grey bands be bluer without moving the green ramp's top.

# scribe-green — R4 (shader v4)

Metric:
- R3 19.04 under v3; the same params re-score 18.84 under v4.
- R4: 18.37. Fidelity 4 → 4.

Final: `work/scribe-green/r4/s6.json`.

What changed
- **accent2** blue-grey (#9fbcc4, accent2Noise 0.8) on the left: the transparent blue-grey streak wash over the left half.
- **lum** -0.3 at bottom-left: the darker green band there, without darkening the ramp.
- Tried: clump on the strikes (worse; it bunched them unnaturally), and negative accent2Noise (put the blue on the wrong streaks).

What the shader still can't do
- The blue-grey bands are many distinct soft bands. Strikes give a few, accent2 gives a wash. A `strikeColor` (strikes tint toward their own colour, like heroTint) would give many distinct blue-grey streaks without pushing the ramp.

# scribe-green — R6 (critic fixes)

Metric 18.37 → 18.23. Critic grade 3, mine now 3. Final: `work/scribe-green/r6/a4.json`.

Fixes
- Removed the long pale diagonal streak. It came from fibre 0.4 plus whole-frame strikes; now fibre is 0.25 and the strikes are in a zone of 0.3 at (-0.4, 0.12).
- Blue-grey placed where the critic located it: strikes for the upper-left edge, accent2 for the bottom-right fan.
- Warm olive (#b8b060, accentNoise 1) at the upper-right.
- Finer streaks: soften 0.005, fibreFreq 45, fibreHard 0.3, scale 3, fan 0.6.

Not fixed
- The lime-yellow lines at lower-left. detailColor would tint the blue-grey strikes too, and both accents are used.
