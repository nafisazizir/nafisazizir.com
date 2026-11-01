# agents-pale — R3 (shader v3)

Metric 26.34 → 12.38 (coarse 9.45 → 4.46, pal 3.42 → 0.98, orient 22.3 → 8.46). Fidelity 4 → 4 (closer).

Changes:
- Oxblood moved out of the ramp into the `accent` (#3c1420, amt ~1, near (0.45,-0.57), size 0.23), so stops[0]
  is indigo (#312f5f) and the oxblood stays in the bottom-right corner instead of muddying the body.
- Angle -66 → -60, fan 0.1 → 0: the tongue edges now run at the reference's ~60°.
- Prism -0.015 (flipped): a violet/pink fringe on the pale-left edge of the tongue, as in the reference.
- mass2 (-0.35 at (0.45,-0.15)) darkens the right side of the tongue; mass3 (-0.39 at (0.30,-0.39)) fills its base.
- Retuned stops/tilt/masses/level/shift.

Tried and rejected: `soften` (0.01–0.06) — any amount kills the streak direction here, the image is a long
directional blur, not an isotropic one. Removing strikes/fibre entirely makes the field look blobby.

Shader can't yet: make the two separate smooth fingers. That needs a field made of a few broad,
streak-aligned bands (low-frequency noise across c only) instead of 2D fbm squeezed by stretch.

# R4 (shader v4)
Metric 12.38 (R3; 14.31 re-scored on v4, because the OKLab accent spread maroon across the right) → 10.83. Fidelity 4 → 4.
- Accent tightened (size ~0.17, nearer the corner): the oxblood stays in the bottom-right again.
- A dark `band` (≈-0.25 at c ≈0.19, starting at x ≈-0.25) makes the second, right-hand dark finger. A light band
  in the "gap" landed where the reference is dark, so I dropped it.
- Retuned masses, stops and accent.
Still can't: a second band (one would be the right finger, another the bottom-left blue finger). The shader has one band.

# R6 (critic fixes)
Critic 3 → self 3. Metric 10.83 → 13.57: worse, chosen because it fixes what the critic located.
- Comb tips → smooth top: strikes 0, fibre 0.04, soften 0.03 with softenCone 1.
- Oxblood: accent #4e1a1e, amt 1, hard 0.6, stretch 1.5, inside the frame at (0.45, -0.45) (in R4 it sat partly
  off-canvas), plus a dark mass2 under it so it reads red-brown.
- Two lobes: a light band (+0.23 at c 0.07, ending at x 0.15) splits the mass. I removed the dark right-hand band,
  which pushed navy to the right edge.
Not fixed: the bottom-left blue finger. A dark band2 there scored 16 and looked wrong.
