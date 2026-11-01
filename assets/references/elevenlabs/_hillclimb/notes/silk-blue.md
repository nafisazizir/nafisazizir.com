# silk-blue — R3 (shader v3)

Metric 20.89 → 16.97 (coarse 8.42 → 6.03, orient 6.63 → 6.39). Fidelity 4 → 4 (closer).

Changes:
- `soften` 0.04: 2D blur, like the photo. 0.08 was too mushy.
- `knee` 1: the white band was clamping flat at the ramp top. It now rolls off.
- noise 0.5 + warp 0.4 + swirl 0.1 with seed 3: slightly wavier bands.
- mass3 -0.6 at (-0.42, 0.5): the dark navy top-left corner (it was lighter and larger).
- `accent` #0e3466 (amt 1, at (0.36, -0.45), size 0.18) used as a fourth "mass" to darken the bottom-right corner.
- Retuned stops/masses/tilt.

Shader can't yet: make silk folds. The bands here are long streak-stretched gaussian masses, so they come out
straight and uniform. The reference's folds bend and pinch, and a band can hold a lighter inner streak.
Per-mass curvature, or a "band" primitive (a gaussian across c with its own offset, width and amplitude,
modulated along x by low-frequency noise), would cover it. Also needs more than three masses.

# R4 (shader v4)
Metric 16.97 (R3; 17.25 re-scored on v4) → 15.45. Fidelity 4 → 4.
- A light `band` (+0.16 at c -0.45, width 0.08, wobble 0.04) runs the full length: the lighter mid-blue streak
  between the dark navy band and the bottom-right corner.
- Retuned masses, stops and accent (still used as a dark fourth mass in the bottom-right).
Tried: `edge` to pull in the white band's lower side. As a half-plane it darkens the whole lower-right (29–31).
`massWarp` 0.4 gives softly wavy, silk-like edges (16.18). It looked organic, but the reference's edge is smooth,
so I kept the unwarped version.
Still can't: the pinch and curve of a real fold (the white band narrows toward the bottom-left). A mass with
its own bend/taper along the streak would do it.

# R6 (critic fixes)
Critic 3 → self 3. Metric 15.45 → 16.24: worse, chosen for the critic's fixes.
- Rigid bands → massWarp 0.31: soft, uneven, wavy edges.
- Removed the far-right light band (the "thin pale-blue stripe"). `lum` +0.53 at (0.51, 0.12) lightens the right
  edge to mid-blue, and mass3 -0.69 at (0.19, -0.04) is the navy swell inside it.
- Top-left corner: accent2 #0b2b62 (amt ~1, size 0.23, at (-0.42, 0.52)), larger and more saturated.
- Bottom-right dark accent: hard 0.5, size 0.2.
Not fully fixed: the swell at 65–80% x reads as a thickening, not a distinct blob, and the bottom-right is still light.
