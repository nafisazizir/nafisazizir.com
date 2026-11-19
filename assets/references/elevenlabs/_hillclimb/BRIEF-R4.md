# Round 4 brief: shader v4 is live, so climb again

Same goal, rules, tools and output as BRIEF-R3.md (re-read it). Your groups are the same as
in round 3. Everything you asked for that generalised is now in the shader: re-read
`components/labs/streaks/shader.ts` and `presets.ts`. The render server already runs v4.
Your `params/<id>.json` files were migrated (`mass2Stretch` and `accentStretch` copied from
`massStretch`). The round-3 results are frozen in `snapshots/r3-v3/`.

**Note:** accents now mix in **OKLab**, and `soften` now uses near-gaussian taps on a
prefiltered field. Groups that used either look slightly different from your round-3
renders. Check them first.

## New in v4 (all off by default)
Radial / burst
- `zoom` (0–1): in radial mode the blur span grows with distance (span = length × mix(1, x, zoom)),
  as in a zoom-burst photo. The core shows the field itself, not a pinpoint.
- `polar` (0/1, radial only): noise is read in (angle, distance), giving wedges and petals of
  constant angular width that are stretched along the rays (`stretch` works here). `scale` sets
  the wedge count.
- `core` (0–1): radius near the focus inside which angle-keyed detail (fibre, strikes, heroes,
  dabs, polar noise) fades out. Gives a soft blown-out centre instead of a hairy star.
- Focus range is now ±2 / ±1.5.
Soften
- `soften` is now gaussian, and the noise octaves are prefiltered by the blur, so there's no
  hair or grain.
- `softenCone` (0–1): the across-spread grows with the along offset, so the sides go soft and
  the streak keeps its direction.
- `detailSoften` (0–1, default 1): how much soften also blurs fibre, strikes, heroes and dabs.
  Set 0 for crisp detail over a soft photo blur.
Accents
- `accentHard` (a solid core), `accentStretch` (its own stretch), `accentPost` (0–1: laid over
  after the blur, unsmeared, at the pixel).
- `accentNoise` is signed: negative breaks the accent where the field is low.
- `accentTone` + `accentToneWidth` (>0): accent 1 only where the palette coordinate is near
  accentTone. Use it for tints on one side of streak edges (e.g. khaki on green edges).
- `accent2` (hex) + `accent2Amt/X/Y/Size/Noise`: a second off-ramp colour. It shares hard and
  stretch with accent 1 and reads the noise flipped.
Masses and shapes
- `mass2Stretch` (masses 2 and 3), `massShape` (2 = gaussian … 8 = rounded box), `massWarp`
  (organic outlines).
- `lum` + `lumX/Y/Size`: a brightness blob applied *after* the palette (col *= 1 + lum·blob),
  so a dark or light spot can go past the ramp ends.
- `edge` + `edgeX/Y/Angle/Soft`: a half-plane added to the field, for a placed silhouette line
  with its own softness.
- `hardSkew` (−0.9…0.9): an edge that is sharp on one side and rolls off slowly on the other.
- `band` + `bandC` (offset across), `bandWidth`, `bandX0`/`bandX1` (extent along, soft ends),
  `bandWobble`: a light or dark band placed in the streak frame, following fan and bend.
  No more seed hunting for one particular band.
- `bendC` (−1…1): curvature varies across the lines (one side arcs more).
Detail
- `heroX` + `heroLen` (>0): the hero becomes one tapered wisp centred at heroX along the
  streak. `hero2` + `hero2Offset`: a second hero, sharing width, length and X.
- `heroColor` (hex) + `heroTint` (0–1): heroes tint toward their own colour (white or black
  for pure light or dark, cyan for a glint) instead of only moving along the ramp.
- `clump` + `clumpScale`: gathers fibre and strikes into a few bands instead of spreading
  them evenly.
- `fibre` now goes up to 1.5, and `fibreHard` (0–1) gives distinct petals with gaps.
- `dabs` (signed) + `dabDensity`, `dabSize`, `dabStretch`, `dabMix` (share dark): scattered soft
  flecks on a jittered grid in the streak frame, motion-blurred with everything else. They
  share the strike zone (`strikeZone/X/Y`).
- `chroma` (prism) goes to ±0.08.
Tuner: `--keys` now accepts `accent`, `accent2` and `heroColor` (hex jitter). Pass explicit
keys; don't let it touch `angle` unless you check by eye. It drifts angles flat and
desaturates stops.

## House rules this round
- Keep scratch scripts in `scratchpad/<your family letter>/` or `work/<id>/`. Shared files
  got overwritten last round.
- A worse score that looks closer still wins. Say so in notes when you choose that.
- Budget: about 20–35 renders/tunes per group. Spend most on your worst groups.
- Don't edit the shader, presets.ts, or anything else in the repo.

## Final reply
Same table as round 3 (metric R3 → R4, fidelity R3 → R4, remaining gap), plus anything the
v4 shader still can't do (ranked, concrete).

## Added mid-round (v4.1, default off, renders unchanged)
- `heroPost` (0–1): that share of the heroes is laid over *after* the blur, in `heroColor`, so
  a tapered wisp shorter than `length` keeps full strength (not averaged away). The hero sign
  doesn't matter there; the colour decides.
- `hero2X` + `hero2Len` (>0): hero 2 gets its own centre and taper. With 0 it shares hero 1's.
- v4.2 (default off): `band2` + `band2C` (a second band, sharing width/wobble/extent); `edgeSize` (>0 bounds the edge to a soft disc); `petals` + `petalFreq` (lanes), `petalTip` (tip position along), `petalJitter`, `petalWidth`: lobes with rounded tips (flames, tongues); `colTilt` + `colFreq`: each lane gets its own gradient along the streak (dark tops, light feet); `fibreZone` (0–1: fibre confined to the strike zone); `lumPost` (0–1: the light blob applied after the blur, round and unsmeared).
