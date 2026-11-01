## Round 3 (family G, soft photo blur)
- Metric 37.13 → 29.11. Fidelity 2 → 3. Final: work/reader-pastel/a16.json.
- Ramp: teal fleck colour, blue, lilac, mauve, pink. The flecks are dark strikes made wide (0.035) and short (strikeDash 1, break 0.6, density 20), confined to a zone (r 0.55) over the diagonal band, with soften 0.016, so they read as soft rounded dabs and not long dashes. Tilt 0.75 toward lower-right with a pink mass2 top-right, a tan accent with accentNoise 0.85 (streaky patches through stretch 5) in the bottom-right, and fibre 0.18 @ 22 for motion texture. The tuner (t1, 25.8) collapsed everything to a flat grey-lilac with grey flecks, so I rejected it.
- Gap: the flecks sit in strike bands (rows) rather than scattering, and they are one teal where the reference mixes teal, blue and olive. Fleck strength is very sensitive to level, since strikes shift the ramp coordinate. The lower-right fur (fine multi-coloured hairlines) is mostly missing: soften blurs the fibre and strikes too, and the strike system is used up by the flecks.

## Round 4 (shader v4)
- Metric 28.62 → 28.24 (about the same; chosen because it looks much closer). Fidelity 3 → 3. Final: work/reader-pastel/v9.json.
- Strikes off. The flecks are now `dabs` (+1, density 0.3, size 0.09, stretch 1.2). Note that dabMix is the share that flips sign relative to `dabs`, so with dabs negative it is the light share. 88% are dark (blue-teal stop 0) and 12% light, scattered in a zone r 0.6 over the band. Accent 1 (olive) uses accentTone -0.3 / width 0.35, so only fleck cores in the lower-left go olive.
- Fur: the top stop is now tan and knee is 0.5, so the bottom-right corner sits near the top of the ramp without clamping flat. fibre 0.3 @ 50 with detailSoften 0.15, clump 1 / clumpScale 4, then shows as tan/pink strands there. Fibre is invisible where the ramp clamps; that was why round 3's fur never showed.
- Rejected: v1, where strikes in a big zone put hairlines everywhere (strikes and dabs share one zone, so fur strikes in the corner and flecks in the band can't coexist).
- Gap: the flecks are fewer, greyer and less varied than the reference's; fine striations cover the whole frame, not mainly the fur corner; the pink top-right highlight and the pale spot are missing.

## Round 6 (critic fixes)
- Critic grade 2 → my grade 3. R4 metric → R6: see the table in the R6 report; R6 is critic-driven and the metric got worse for most groups (accepted: the critic's located fixes outrank the metric this round).
- Now: Now a soft photo blur with streaks only in the bottom-right (fibre and strikes confined to a zone there, tan/lilac strands). The teal is a few large soft irregular clumps on the left (warped masses plus a handful of large dabs) instead of polka dots, with lavender/periwinkle over the top-left two thirds. The clumps are greyer and flatter than the reference's blue-green masses, and the corner strands are straighter and more regular than its fanning fur.
