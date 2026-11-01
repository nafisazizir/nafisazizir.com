# v4-turbo — R3 (shader v3), family B

- Metric 28.38 → 20.14. Fidelity 3 → 4.
- Changed: stops darkened at the top (ref's lightest is #f6bb74, not #f6c888); `knee` 0.3 so the
  top-left peach no longer clamps flat; tune on layout (tilt, mass2, level, contrast, shift, scale);
  dropped the tuned centre mass that drew a broad red diagonal band through the frame;
  `hero` -0.3, width 0.02, offset 0 for the single soft dark-red wisp; `mass3` -0.3 at (0.78,-0.05)
  for the red band down the right; strikes cut to 0.45 in a `strikeZone` 0.25 at (0.12,-0.3).
- Can't do yet: the hero can't be limited in length (the ref's wisp is ~0.6 h long and tapers at
  both ends; ours runs the whole frame in long segments). The bright cream wisp in the lower
  centre needs a second hero (or a positive one with a length/taper). The ref's broad light
  bands are mottled; ours are smooth parallel bands.

# R4 (shader v4)
- 20.14 → 22.47 (chosen by eye despite the higher score). The dark wisp is now `band` -0.5 (width 0.025, from x 0.12 to 0.6, tapered ends) in place of a full-length hero. The cream wisp is `hero` +1 with heroTint 1 and heroColor #fcca86, heroLen 0.7 at heroX -0.15, offset -0.29.
- Gotcha: a tapered hero is averaged over the streak `length`, so its visible strength is about heroLen/length. With heroLen 0.3 and length 1.1 it was nearly invisible.
- Still missing: the cream wisp is steeper than the flow (about 45° against 38°), and band/hero can't take their own angle. A `band` can't brighten past the ramp top where the field is already clamped.
- A layout tune (`work/v4-turbo/r4/t1.json`) was still running at handback.
- Adopted layout tune t1: 20.70 (back near R3's 20.14, now with the tapered wisps).

# R6: drafted work/v4-turbo/r6/a1.json for the critic fixes, but the render server stopped answering (requests time out, no PNG written anywhere for 10+ min), so it was never rendered or adopted.
- R6 adopted: work/v4-turbo/r6/a4.json (25.33). band shortened to x 0.18-0.45 and widened to 0.03, mass restored for the red bottom-left, mass3 -0.45 at (0.75,-0.38) for the bottom-right band, edge -1.1 in a 0.4 disc at the top-left corner. Chosen by eye for the critic's fixes over the metric (R4 20.70).
