# Round 6 brief: fix what an independent critic sees

Two fresh critics with no context graded every pair from the compare images. They're
stricter than our self-scores: **32 groups got 3 and 3 got 2. None got a 4.** Their located
fixes are in `notes/critic-a.json` and `notes/critic-b.json` (`{id: {grade, fixes[3]}}`).
Read the entries for your groups first. They're the target this round, and they outrank the
metric and your own earlier notes.

Rules, tools and output are the same as BRIEF-R3/R4 (re-read them if needed). Set `fidelity`
as the critic would, and don't inflate it.

## Patterns both critics saw across the set (check each of your groups)
1. **Hairlines and prism fringes are overdone.** They're too long, sharp and continuous, or
   present where the reference has none. Reference hairlines are short, soft and local. Use
   heroLen + heroPost, a strike zone, dash/break, or simply less. Use prism only where the
   reference shows a fringe, with the right sign (e.g. atom-band: red/pink above, blue/cyan
   below).
2. **Too clean and regular.** Bands are evenly spaced and parallel, and comb-like tips appear
   where the reference has broad soft masses or irregular photo texture. Levers: warp,
   massWarp, bandWobble, clump, lumNoise (mottle), swirl, fewer and larger features, lower
   fibre.
3. **Wrong curvature.** Streaks bend where the reference's are near-straight (api-grey,
   cobalt-openai, architect-square). Bend and bendC are often the culprit.
4. **Masses too clean and wrongly sized.** Watch blob size, edges and missing corner accents.

## New since R4 (v4.3, all off by default)
`mass2Angle` (a fixed axis for masses 2–3, 0 = follow streaks), `mass3Stretch` (0 = share),
`edgeBend` (a curved edge line, e.g. an S or wave boundary), `lumNoise` (brightness mottle
after the palette), `accent2Tone`/`accent2ToneWidth`, `detailColor` + `detailTint` (strikes
and dabs carry their own colour), `softenZone`/`softenX`/`softenY` (soften only inside a disc),
`dabZone`/`dabX`/`dabY` (dabs get their own zone, separate from the strike zone). The v4.2
additions (`band2`, `edgeSize`, `petals*`, `colTilt`/`colFreq`, `fibreZone`, `lumPost`) are
described at the end of BRIEF-R4.md. Note `petals*` (lobes with rounded tips) for flame and
tongue references.

## Output
Same as before. Final reply: id | critic grade → your honest grade now | metric R4 → R6 | which
critic fixes you addressed, and which you couldn't (and why).
