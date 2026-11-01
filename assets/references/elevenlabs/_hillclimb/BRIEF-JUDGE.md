# Judge brief: which recreation is closer to the reference?

Each image in `/Users/nafis/Documents/personal/nafisazizir.com/assets/references/elevenlabs/_hillclimb/out/ab/`
has three panels, left to right:
1. **Reference**: ElevenLabs marketing art. Ignore any title text or UI chips on it.
2. **X**: a procedural recreation.
3. **Y**: another procedural recreation.

The recreations are deliberately grain-free, so ignore film grain. For each image, decide which
of X and Y is **closer to the reference overall**, as a whole picture. That covers where each
colour sits, the shape and size of the masses, the streak direction and curvature, soft vs
sharp areas, hairlines and fringes, and palette. Weigh it the way a designer would: which
one would you call the better clone at a glance and on close inspection? Pick "tie" only if
you genuinely can't separate them.

Read every image (all files in the folder). Write `notes/judge-<your letter>.json` as
`{"<id>": {"pick": "X"|"Y"|"tie", "margin": "clear"|"slight", "why": "one short sentence"}}`.
The id is the filename without `.png`. Edit no other file. Reply with just the counts of X,
Y and tie.
