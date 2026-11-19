# social-cream — R3 (shader v3), family B

- Metric 58.92 → 31.36. Fidelity 3 → 4.
- Changed: rebuilt the composition: angle 46, low noise 0.35, soften 0.12, knee 0.4, tilt
  toward the upper left, `mass` as a narrow ridge stretched along the streaks (massStretch 5)
  for the cream ridge, `mass2` -0.92 small in the bottom-right corner for the maroon (it no
  longer smears up the right edge), `mass3` -0.87 narrow for the orange stripe left of the
  ridge. Stops from the ref's colours (maroon #2b0514, red #d52a0d, bright orange #e0681a,
  peach #dbb278, cream #e4e7d4). Two tunes (layout, then palette + accent), then a small
  brown accent #7a4a30 at (-0.42,-0.42) size 0.12 for the dim bottom-left corner, fibre 0.08.
- Note: the tuner prefers a darker, browner orange stop than the ref (#cf6611); the brighter
  #e0681a scores ~1.5 worse but matches by eye.
- Can't do yet: the ridge's mottling (soft streaky light/dark patches) — fibre is washed out by
  soften; a dim/desaturating accent spreads its gaussian tail into the bright orange.

# R4 (shader v4)
- 31.18 → 29.48. soften 0.12 → 0.08 (v4's gaussian soften is stronger). fibre 0.15 at freq 5 with detailSoften 0.2 and clump 0.5. The OKLab brown accent now reads in the bottom-left.
- A layout tune (`work/social-cream/r4/t1.json`) was still running at handback.
- Adopted layout tune t1: 26.64.

# R6: drafted work/social-cream/r6/a1.json for the critic fixes, but the render server stopped answering (requests time out, no PNG written anywhere for 10+ min), so it was never rendered or adopted.
- R6 adopted: work/social-cream/r6/a5.json (37.67). Wider ridge (massSize 0.15), mass3 +0.45 stretched at the top for a cream wash, mass3 at the narrow stripe removed, stop1 #b43a10 (no red rim), larger brown-grey accent. Chosen by eye over the metric (R4 26.64).
