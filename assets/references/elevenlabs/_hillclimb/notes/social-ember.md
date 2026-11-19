# social-ember — R3 (shader v3), family B

- Metric 46.61 → 38.95. Fidelity 3 → 3.
- Tried the accent as the whole green blob (ramp red → yellow, accent #202c22): it can't get
  dark. The accent mixes in linear RGB, so a dark colour only reads dark where the blob
  weight is > ~0.9, and the gaussian (plus the streak average) leaves a small dark core in a
  wide brown wash that muddies the peach centre.
- Kept the ramp-top green but made it a green-grey #343a36 (the ref's blob rim and corner),
  stops red #dc2e16 / orange #f8891b / #f79b4b / #ffbf6c, and added a dark accent #1c261e core
  at (-0.6,0.23) size 0.31 for the deep centre. Tune on stops/masses/accent/tilt/hard; then
  `mass3` -0.5 at (0.38,0.45) to pull the top-right from olive back to orange.
- Tried dark `strikes` in a `strikeZone` at the base as petals: they read as straight hard
  lines, not tapered petals with rounded tips. Dropped.
- Can't do yet: discrete tapered petal shapes (needs a primitive: per-band lobes with a
  smooth rounded tip along the streak). Accent darkness needs a sharper blob (accentHard) or
  mixing in a perceptual space.

# R4 (shader v4)
- 39.30 → 42.11 (chosen by eye: the blob and the flame streaks read closer, but layout colour got worse).
- The ramp no longer carries green (stops: red, orange-red, orange, peach, yellow). The blob is `accentPost` 1 with accentAmt 0, accentHard 0.4, size 0.34 at (-0.4,0.3), #1e2a20. OKLab plus post makes it a real dark core for the first time.
- Petals: fibre 0.5, fibreFreq 5, fibreHard 0.9, clump 0.4. They give flame streaks but no rounded tips.
- A field tune on the accent version (`work/social-ember/r4/t1.json`, best about 39.5 at it 50) was still running at handback. Re-apply the fibre settings on top of it.
- Adopted tune t1 (49.39 → 38.34) plus fibre 0.5/freq 5/hard 0.9/clump 0.4: 37.67, better than R3 (39.30) and closer by eye.

# R6 (critic grade 2)
- Rebuilt in radial mode: focus below the frame at (0.6,-1.5), `petals` -1.2, petalFreq 6, petalWidth 0.64, petalTip 1.45 (tips at about 60-65% y), jitter 0.12. The red petals fan up-left with rounded tips and orange gaps between them. fibre is off, so the vertical red lines through the centre are gone.
- Green: accentPost blob at (-0.33,0.33), size 0.3, accentHard 0.5. It is round with a curved lower edge, not a column.
- Stops brightened at the top (#fbbd6c, #fdd47c) for the centre glow.
- Metric 37.67 → 38.27, but much closer by eye on all three critic points.
- Gotchas: petalWidth above about 0.7 lets lobes cross the lane edge and leaves a hard seam line. `angle` is limited to ±90, so petals (which grow toward -x from the tip) can't point up in parallel mode with a left lean; radial mode solves this.
- Couldn't: pointed asymmetric tips (lobes are round-capped), and petals that overlap one another.
