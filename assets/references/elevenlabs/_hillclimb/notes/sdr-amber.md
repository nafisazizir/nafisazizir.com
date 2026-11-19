
## Round 3 (family A, radial bursts)
- Metric 44.49 → 27.95. Fidelity 3 → 3. Best iteration: work/sdr-amber/f1.json.
- Changed: the ramp is reordered as orange → amber → yellow → cream → blue, so fibre peaks inside yellow go white (the white wedges) and only the strong left mass reaches blue. The petals come from fibre keyed on the ray angle (0.5, freq 7, fibreBreak 0.1) with contrast 2 and the noise, tilt and masses scaled down by the same factor, which makes fibre effectively about 2.7× stronger. soften 0.06, length 1. Layout and palette were tuned twice. Stop 2 was warmed by hand (tune pulled it to olive).
- What didn't work: scale/stretch for chunky angular noise. In radial mode, stretch is a uniform zoom about the focus (np = focus + x/stretch·dir), so it never elongates noise radially; angular feature width = stretch/scale, the same as radial length. A low scale gives smooth blobs, a high scale gives cloudy lumps. Soften ≥0.1 at 40 samples gives jaggy, hairy aliasing (golden-ratio jitter), and it still doesn't remove the pinpoint, because samples far down the ray dominate the average. Blue as accent mixes to grey with orange (linear RGB). Strikes push t into blue at the white/blue border, which leaves blue specks.
- Still can't: a blown-out core (needs zoom blur, see the shader wishlist), or a rounded soft blue blob edge (c-keyed fibre makes every edge a ray).

## Round 4 (shader v4)
- Metric 29.44 (R3 params re-scored on v4) → 27.97. Fidelity 3 → 4. Best: work/sdr-amber/r4/t1.json.
- zoom 1, length 0.9, polar 1, scale 2.5, stretch 3, core 0.35 on top of the R3 petals, then a layout and palette tune. The core is now soft and blown out and the wedges are chunky and soft. That's a big visual step; the metric moved only a little.
- Tried without gain: mass3 orange near the core (comes out as a hard blocky shape because of hard 0.25), softenCone 0.4–0.5, massWarp 0.8, warmer stops.
- Gap: the blue is a flat sector with a straightish edge, the orange smudge left of the core is missing, and the yellow is slightly flat.

## Round 6 (critic fixes)
- Metric 27.97 → 29.73 (worse score, closer by eye). Critic grade 3; my honest grade is 3. Best: work/sdr-amber/r6/a5.json.
- Blue moved off the ramp into an accent laid on after the blur (accentPost 1, hardness 0.5, at -0.74,-0.2, size 0.42). It now hugs the left edge as a soft blob instead of a wedge running to the focus. The ramp top is now cream to white.
- Core: a weak, broad negative mass2 at the focus with core 0.2 gives amber/burnt-orange streaks at the centre instead of a cream glow. A small strong mass2 gives a round orange "sun" dot, so avoid that.
- White streaks: band at bandC -0.1 (top-centre) and band2 at -1.1 (lower-right), 0.4 each, width 0.12, x 0.4–1.2.
- Gap: the wedges are still smoother and more regular than the reference's chaos.
