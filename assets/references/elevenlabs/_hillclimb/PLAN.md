# Streak references: audit + hill climb (started 2026-10-28)

Goal (user): the recreations at /labs/streaks/references "aren't up to standard / not close".
Clone each ElevenLabs reference as closely as possible, with every detail (sharp,
broken strikes, prism fringes, soft photo-blur shapes), but with **no grain or
noise texture**.

Everything here is local and git-ignored (this folder sits inside the ignored
reference library). The repo-side outputs are `components/labs/streaks/{shader,presets,renderer}.ts`,
`recreations.ts` (generated) and the board/studio UI.

## Tooling (built this session)
- `tools/server.mjs`: a pool of headless Chrome pages running the site's *real*
  renderer.ts/shader.ts/presets.ts (type-stripped and hot-reloaded on change).
  Start it with `SL_PAGES=6 node tools/server.mjs &` (port 8420).
- `tools/sl.mjs`: `render` (compare + diff heatmap + full-res crops), `score`
  (metric table), `sheet` (contact sheet of all pairs), `tune` ((1+4)-ES on the metric).
  A render+score takes ~0.3 s, versus ~5 s per Chrome launch before.
- Metric: lower is better. It combines layout ΔE (12- and 40-wide grids), a
  palette sliced-Wasserstein, band-energy and gradient log-ratios
  (soft vs sharp), the streak-orientation error, and anisotropy. Text and UI
  overlays are excluded by auto-mask plus hand rects (`groups.json` → `mask`).
  Check them with `sl sheet --mask`.
- `params/<id>.json` is the live state of each recreation. `snapshots/` holds
  frozen copies, `notes/` holds score tables and per-group logs.

## Audit (v2 baseline: mean metric 35.96, mean self-rated fidelity 3.4)
Worst by metric: mcp-coral 61.6, red-burst 59.1, social-cream 58.9, workshop-red 51.6,
coral-green 48.5, reception-green 47.3, social-ember 46.6, sdr-amber 44.5, ads-red 44.0.
Visual audit of the contact sheet (`out/masks.png`):
1. **Composition/colour placement is off in most pairs**: coarse ΔE is 10–29. The
   right family, but the wrong places. Tuning can fix this; the shader isn't the limit.
2. **Two-hue images** (coral-green, reception-green, letter-sky, social-ember,
   agents-pale's oxblood corner): one 1D ramp forces the in-between colours.
3. **Radial bursts** (sdr-amber, mcp-coral, red-burst, sky-burst): ours converge
   to a crisp pinpoint with fine rays. The refs have chunky, soft, blown-out wedges.
4. **Photo-blur refs** (rust, green-peach, reader-pastel, sfx-grey, lavender-cream):
   the refs need an isotropic blur. Ours only blur along the streaks.
5. **Flat clamped areas** wherever the field overshoots the ramp.
6. **Strikes** can't be confined to a zone, mixed light and dark, or placed singly.

## Shader v3 (done, backward compatible: all 35 v2 scores are identical)
- `soften`: across-streak sample spread → 2D blur; in radial mode the spread is
  an arc, so it widens toward the focus and blows out the core. (Fixes 3, 4.)
- `accent` colour + `accentAmt/X/Y/Size/Noise`: a second hue outside the ramp,
  in its own blob, broken up by the field noise, and streaked. (Fixes 2.)
- `knee`: exponential roll-off at the ramp ends instead of a flat clamp. (Fixes 5.)
- `mass3*`: a third mass.
- Strikes: `strikeDash` (dash length, split from break), `strikeMix` (share of
  dark strikes), `strikeZone/X/Y` (a soft disc), and `hero/heroOffset/heroWidth`
  (one placeable hairline). (Fixes 6.)
- `chroma` is signed (a negative value flips the prism), and `fibreFreq` goes up to 120.

## Rounds
- [x] R0: tooling, masks, metric, baseline scores (`notes/score-v2-baseline.txt`)
- [x] R0: shader v3
- [x] R3: 7 subagents × 5 groups hill-climbed on v3. Mean metric 35.96 → 22.44; fidelity: 21 at 4, 14 at 3
- [x] Integrate: v4 moved into the repo (backward compatible), params migrated, recreations.ts rebuilt, tsc/eslint clean, R3-on-v4 mean 22.75. Sheets in out/sheet-r3-{a,b}.png
- [x] R4: the same 7 agents resumed on v4 (BRIEF-R4.md). Mean metric 22.75 → 20.67; self-fid 3.74 (26×4, 9×3). Snapshot snapshots/r4, scores notes/score-r4.txt
- [x] Studio UI: accent colour swatch (ColorTile, shared with the palette) plus the new sliders
- [x] `tools/build.mjs` regenerates recreations.ts from params/ (typecheck and lint clean)
- [x] R5: 2 fresh critics graded all 35 → notes/critic-{a,b}.json (32×3, 3×2)
- [x] R6: climbers resumed with the critic fixes + v4.3
- [x] Blind A/B R4 vs R6 (3 judges) → winners per group; final critics → notes/critic-final-{a,b}.json
- [x] Final: recreations.ts rebuilt (fidelity and gaps from the final critic), tsc/eslint clean, /labs pages 200, board screenshot OK
- [ ] Final: typecheck/lint/build, check the board in Chrome, update memory

## Agent families
A radial: sdr-amber, mcp-coral, red-burst, sky-burst, api-grey
B reds: v4-turbo, ads-red, workshop-red, social-ember, social-cream
C slate/oxblood: fedramp-oxblood, architect-wide, architect-square, sdr-oxblood, atom-band
D blues: agents-pale, detect-navy, defining-navy, silk-blue, cobalt-openai
E sky/amber/pink: letter-sky, belgium-amber, netherlands-amber, coral-pink, pink-lilac
F greens: elections-green, reception-green, scribe-green, coral-green, support-teal
G soft/photo-blur: rust-blur, green-peach-blur, reader-pastel, sfx-grey, lavender-cream

## Progress log
- R0 done. Baseline mean metric 35.96.
- R3 launched: 7 agents.
- R3 B reds done: 45.91 → 29.76 mean; fid 4,4,4,3,4. Asks: accentHard / accentStretch / OKLab accent mix / accent after the blur; hero length + taper + a 2nd hero; per-mass stretch; petal lobes; fibre that survives soften.
- R3 A radial done: 46.10 → 30.01 mean; all still fid 3, because the focus pinpoint remains. Asks: zoom blur (span ∝ distance), polar noise in radial mode (stretch is a no-op there), stratified/gaussian soften taps (40 golden-ratio taps alias → hair or grain), petal fibre (fibre up to 1.5 + fibreHard), OKLab accent mix, angular-wedge mass, focusX to ±2. Also: the tuner prefers blob-ish answers, so judge by eye.
- Shader v4 prototyped in `v4src/` (2nd server: `SL_SRC=$PWD/v4src SL_PORT=8421`). New: zoom (radial span ∝ distance), polar noise (radial wedges), core (fade angular detail near the focus → soft blown core), soften v2 (near-gaussian taps, fbm prefiltered by blur σ, arc cap 60°), fibre up to 1.5 + fibreHard (petals), accent in OKLab + accentHard/accentStretch/accentPost (over, unsmeared), heroX/heroLen (tapered wisp) + hero2, mass2Stretch (masses 2–3), focus range ±2/±1.5.
  Compat: identical scores for every group without soften/accent. Those with them move by ±0.2–1.8 (retune in R4). Migration: mass2Stretch = accentStretch = massStretch.
  Test: sdr-amber with zoom 1 + polar + core 0.35 → soft blown core and chunky wedges, like the ref.
- R3 C oxblood done: 31.81 → 18.25; fid 4,4,3,3,4. Asks: hero zone/fade (→ heroLen/heroX in v4), per-mass/accent stretch (in v4), hardSkew (added to v4), tint fringe (single-hue rim; not yet), off-ramp midpoint colour, spatially varying angle, multi-hue fibre. Chroma cap raised to 0.08 in v4.
- R3 C oxblood done: 31.81 → 18.25; fid 4,4,3,3,4. Asks: hero zone/fade (→ heroLen/heroX in v4), per-mass/accent stretch (in v4), hardSkew (added to v4), tint fringe (single-hue rim; not yet), off-ramp midpoint colour, spatially varying angle, multi-hue fibre. Chroma cap raised to 0.08 in v4.
- R3 G photo-blur done: 38.4 → 20.5; fid 3,4,3,3,4. R3 E sky/amber done: 28.58 → 20.20; fid 3,4,4,4,4.
- v4 additions from G/E/C asks (all compat, 0 score diffs on existing params): detailSoften, massShape (squareness), massWarp, dabs layer (scattered flecks, shares strike zone), hardSkew, accent2 (+Amt/X/Y/Size/Noise), band (a placeable line in the streak frame: C, width, X0..X1), bendC (per-line curvature), chroma ±0.08. Tuner can now tune accent/accent2 hex.
- Agent-reported tool gotchas: shared scratchpad files got clobbered between agents (namespace per agent next time). The tuner drifts angle toward flat and desaturates stops, so pass explicit keys and fix stops by hand.
- R3 D blues done: 26.19 → 16.57; all fid 4 (closer). v4 additions from its asks: heroColor+heroTint, clump+clumpScale (gathers fibre/strikes into bands), bandWobble, softenCone (spread ∝ along offset, keeps direction). Compat still 0 diffs.
- My R3 visual audit (worst by eye): reader-pastel (dash rows), sdr-amber/mcp-coral/red-burst (pinpoint, no petals), social-ember, letter-sky (pink band lost under OKLab), sdr-oxblood (too smooth), coral-green, ads-red (stripes), reception-green (no tints). These were given as R4 priorities.
- R4 B (partial): v4-turbo 22.47 (looks closer), workshop-red 27.99, social-ember 42.11 (accentPost core works; looks closer), social-cream 29.48. Left 4 tunes running → work/<id>/r4/t1.json (social-ember: re-add fibre 0.5/freq 5/hard 0.9/clump 0.4 before adopting). Asks: post-blur hero (undiluted), per-hero X/len, band tint, petal lobes with round tips, per-column along-gradient.
- v4.1 (mid-R4, compat): heroPost (heroes over the blur, undiluted), hero2X/hero2Len.
- R4 B final: 29.42 mean. social-ember adopted 37.67. PENDING for me: work/{ads-red,v4-turbo,social-cream}/r4/t1.json; render and adopt only if better by eye (ads-red the most promising).
- R4 D done: 16.57 → 14.97 (all fid 4). Asks queued for v4.2: band2, edgeSize (bounded edge), massBend/taper, local bend. heroTintAmt is covered by heroPost=1 (pure colour, no lift).
- R4 C done: 18.24 → 18.64 (2 looks-closer choices), fid unchanged. R4 E done: 20.40 → 16.97; letter-sky 3 → 4. R4 A done: sdr-amber, mcp-coral, sky-burst 3 → 4; mean 25.14.
- v4.2 installed (compat 0 diffs): band2, edgeSize, petals (round-tip lobes), colTilt/colFreq, fibreZone, lumPost. Live mean is 20.89 with F and G still running.
- R4 F done (21.84 → 21.49; tints, edge, dabs landed). R4 G done (mean 20.02; reader flecks via dabs, sfx L-block via box mass).
- v4.3 installed (compat 0 diffs): mass2Angle (fixed axis for masses 2–3), mass3Stretch, edgeBend, lumNoise (mottle), accent2Tone/Width, detailColor+detailTint (strikes/dabs colour), softenZone/X/Y, dabZone/X/Y. Studio: Tint colour swatch in Dabs.
- Critic A (18 ids): all 3/5 (strict). Furthest: lavender-cream, rust-blur, mcp-coral, letter-sky, architect-square. Recurring: hairlines/prism too long, sharp and continuous (should be short, soft, local); streaks too regular/comb-like where refs have broad soft masses; masses too clean; missing corner accents.
- Critic B (17 ids): 14×3, 3×2 (reader-pastel, social-ember, red-burst). Recurring: too clean/regular, fringes where the ref has none, too much curvature. Honest baseline: ~2.9/5 vs self-rated 3.74.
- R6 launched (BRIEF-R6.md): climbers resumed with the critic fixes as the target.
- R6 interruptions: (1) a network outage killed all 7 agents; resumed. (2) The render server wedged (a stuck Chrome page blocked the queue); I added a 60s per-job timeout with page reload to server.mjs and restarted it.
- R6 B: social-ember 2 → 3 (petals + accentPost blob), ads-red critic fixes in; 3 drafts pending render.
- R6 G done: all 5 graded 3 (reader-pastel 2 → 3). Metric worse on every group (+1.3 to +3.9), chasing the critic fixes; final critic decides. Asks: blur-safe mottle, S-edge (cubic), masked radial layer, per-mass shape.
- R6 B done: all critic fixes in, but the metric rose 27.42 → 33.19 (social-cream 26.6 → 37.7, workshop-red 28.0 → 35.3). The critic fixes and the metric disagree.
- DECISION: the final arbiter is a blind A/B judge per group (ref | R4 | R6 in random order) by fresh agents; keep the winner per group (tools/ab.mjs → out/ab/, notes/ab-key.json).
- R6 F done: 21.49 → 21.30, all honest fid 3; most critic fixes in.
- R6 E done: 16.97 → 17.89 (letter-sky deliberately follows the critic's composition). Asks: irregular bands (width/amp noise), heroWidth to 0.15, per-lane petal curvature, fibreJitter.
- R6 C done: 11/15 critic fixes fully landed; 18.64 → 19.44; all honest fid 3.
- R6 D done: critic fixes in; agents-pale 10.83 → 13.57, defining-navy 11.79 → 13.74, silk-blue up, detect-navy and cobalt flat. Asks: placeable clump zones, more bands with their own extent, a lightening mass.
- R6 A done: red-burst 2 → 3 (38.1 → 33.2); others follow critic fixes with worse metric. R6 overall snapshot in snapshots/r6.
- Blind A/B (3 judges, R4 vs R6): R4 won 18 groups, R6 won 17 (mostly unanimous). Winners applied to params/ (snapshots/final-ab). The critic fixes helped about half and hurt about half, so the A/B was worth it.
- Next: final critics grade the winners → board fidelity + gaps come from that independent grade.

## Final state (2026-10-28)
- Independent critic grade: 16 at 4, 17 at 3, 2 at 2 → mean 3.4/5. The first critic pass on R4 gave 32 at 3 and 3 at 2 (~2.9).
- Metric: v2 baseline 35.96 → final 22.07. R4 had the best metric (20.67), but blind judges preferred some R6 groups by eye.
- Weakest (critic): reader-pastel (2), red-burst (2), social-ember, mcp-coral, rust-blur, lavender-cream, reception-green, coral-green.
- Open shader asks (for a future round): pointed/asymmetric petal tips + petalDir; irregular bands (width/amp noise) and more bands with their own extent;
  angle that varies with position (angle + k·y); S/cubic edge; masked radial texture layer; placeable clump zones; fibreFreq > 120 / third octave;
  a lightening (additive) mass; two-colour signed rim fringe; a third accent or N colour spots.
- Restart: `SL_PAGES=6 node tools/server.mjs &`, then `node tools/sl.mjs score`.
