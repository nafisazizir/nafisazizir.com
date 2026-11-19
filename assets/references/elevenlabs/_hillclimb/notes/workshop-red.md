# workshop-red — R3 (shader v3), family B

- Metric 51.62 → 29.07. Fidelity 3 → 4.
- Changed: ramp reordered to lavender #7d7082 → rose #d48182 → crimson → red #f04628 →
  orange, so the right column can pass lavender → rose while the left passes rose → crimson
  → red; `blend` 1 (colour averaging desaturated the red to salmon); soften 0.08, noise 0.54;
  tune on tilt/masses/stops: tilt 0.87 at 292°, `mass` -0.73 top-right (lavender), `mass2`
  -0.27 low-centre; `mass3` +0.2 bottom-right for the orange corner. Small peach accent.
- Can't do yet: the peach blob at mid-right. A light accent under length 1.2 horizontal blur
  turns into a salmon wash across the frame instead of a blob (accent needs its own blur
  length, or to be added after the streak average). The ref is a cloudy haze with soft blobs;
  ours is smooth banding.

# R4 (shader v4)
- 30.90 (R3 params re-rendered on v4) → 27.99. Peach blob via `accentPost` 0.85 (accentAmt 0, size 0.13, accentStretch 2.5, #f2aa8c), so it is laid on unsmeared. soften 0.08 → 0.02: under the v4 gaussian soften the old value pushed the orient error from 8.8 to 13.

# R6: drafted work/workshop-red/r6/a1.json for the critic fixes, but the render server stopped answering (requests time out, no PNG written anywhere for 10+ min), so it was never rendered or adopted.
- R6 adopted: work/workshop-red/r6/b3.json (35.27). mass -0.8 at (0.38,0.5) confines the grey-purple to the top centre and right, mass2 +0.42 at (-0.45,0.5) gives rose-red top-left, stop1 #a85868 removes the pink band, salmon accentPost moved to (0.47,0.06), shift -0.12. Chosen by eye over the metric (R4 27.99).
