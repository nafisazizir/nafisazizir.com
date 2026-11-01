# Round 3 brief: hill-climb your groups on shader v3

You are recreating ElevenLabs background images with the site's streak shader. The user has
said the current recreations are "not up to standard / not close". Your job is to make each
of your groups look as close as possible to its reference, in every detail, **except grain or
noise texture, which is deliberately left out**. Don't add grain-like speckle to fake the
references' film grain.

What the user cares about, in their words from earlier sessions: the ElevenLabs strikes are
sharper than ours, often "putus-putus" (broken into dashes), sometimes have rainbow/prism
fringes, and "don't blend in" the way ours do. Some references are soft photo blurs, and
those should be soft. Match what is there.

## Paths
- ROOT = /Users/nafis/Documents/personal/nafisazizir.com/assets/references/elevenlabs/_hillclimb
  (run every command from ROOT)
- REF  = /Users/nafis/Documents/personal/nafisazizir.com/assets/references/elevenlabs
- Groups: `groups.json` (id, primary image path relative to REF, variants, note, mask rects for
  text/UI, given as [x0,y0,x1,y1] fractions with a top-left origin).
- Live params: `params/<id>.json` = {id, fidelity, gaps, params}. You own only your groups' files.
- Shader: /Users/nafis/Documents/personal/nafisazizir.com/components/labs/streaks/shader.ts.
  Read the header and code. Param ranges are in presets.ts (same folder). **Do not edit
  either file, or anything else in the repo.**

## Shader v3: new since round 2 (all off by default)
- `soften` (0–0.4): spreads the samples across the streak too, giving a 2D blur. Use it for
  photo-blur references and soft shapes. In radial mode the spread is an arc that widens
  toward the focus, so it blows out the core instead of leaving a pinpoint.
- `accent` (hex) + `accentAmt` (0–1), `accentX/Y`, `accentSize`, `accentNoise` (0 = a smooth
  blob, 1 = broken up by the field noise into streaky patches): a second hue outside the
  5-stop ramp. Use it for two-hue images (green + coral, blue + pink, an oxblood corner in a
  navy image, a dark green blob in orange).
- `knee` (0–1): soft roll-off at the ramp ends instead of a flat clamp. Use it when areas go
  flat.
- `mass3`, `mass3X/Y/Size`: a third mass.
- Strikes: `strikeDash` (dash length along the streak, separate from `strikeBreak`, which
  sets how much is missing), `strikeMix` (share of strikes that flip to dark), `strikeZone`
  (>0 confines strikes to a soft disc of that radius at `strikeX/Y`), and `hero`,
  `heroOffset`, `heroWidth` (one deliberate hairline at offset c across the streak; in
  radial mode c is an angle in radians).
- `chroma` (prism) is signed: negative flips which side gets cyan and which gets red.
  `fibreFreq` now goes up to 120 for finer striation.
Coordinates: y points UP in the shader. Positions are in height units (y ∈ [-0.5, 0.5],
x ∈ ±aspect/2).

## Tools (a render server is already running; don't start or kill it)
    node tools/sl.mjs render <params.json> <out-prefix> [--width 640] [--diff] [--crop x,y,w,h]
        → <prefix>.png, <prefix>-compare.png (reference | ours [| diff heatmap]) + metric line
        --crop renders that region of the frame at full resolution next to the same region
        of the full-res reference. Use it to judge strikes, fringes and edge sharpness.
        --diff heatmap: red = ours too light, blue = ours too dark, green = hue/chroma off.
    node tools/sl.mjs score <id> [<id>...]
    node tools/sl.mjs tune <params.json> --keys k1,k2,...,stops [--iters 120] [--sigma 0.08] [--out f]
        (1+4)-ES on the metric. Good for layout and palette (stops, tilt, tiltAngle, mass*,
        accent*, angle, level, contrast, shift, seed). Bad for fine detail: it can drift
        toward mush. Always look at the result before accepting it.
Metric: lower is better (shown as `score`). coarse/mid = layout colour error, pal = palette
distribution, bands/sharp = softness vs sharpness mismatch, orient = streak angle error,
coh = streakiness mismatch. Use it as a guide. **Your eyes are the judge**: a version with a
worse score that is visibly closer wins.

Look at the reference itself at full size before you start (Read the image file in REF;
also crop it with --crop renders). Look at the variants listed in groups.json too.

## Workflow per group
1. Read params/<id>.json and the reference. Write down what defines the image: composition,
   palette, streak direction and curvature, the soft vs sharp areas, strikes (light or dark,
   continuous or dashed, how dense), fringes, blur character.
2. Fix the big things first: layout and palette (tune helps; seed sweeps help).
3. Then detail: strikes, dashes, prism, sharpness, soften. Use --crop renders at --width 900
   on 1–3 detail regions.
4. Iterate. Budget about 20–40 renders/tunes per group. Save iterations under `work/<id>/`.
5. When it's clearly better than the starting point, write `params/<id>.json` (same shape,
   full params with every key, all within the presets.ts min/max, plus `accent`). Set an
   honest `fidelity` (5 = could pass for the reference without grain, 4 = close with small
   differences, 3 = same family and composition, 2 = palette only) and `gaps` (one or two
   sentences on what still differs). If you can't beat the start, leave it.
6. Append to `notes/<id>.md`: the start and end metric, what changed, and what the shader
   can't do yet.

## Final reply
A table: id | metric before → after | fidelity before → after | remaining gap. Then a ranked
list of concrete shader changes you'd want next (with formulas or param semantics), each
with the groups it would help.
