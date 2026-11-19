# Critic brief: grade shader recreations against their references

You're a fresh pair of eyes. Each image in your list is a side-by-side: the **left** half is
a reference image (ElevenLabs marketing art, sometimes with title text or UI chips: ignore
those), and the **right** half is our attempt to recreate the background with a procedural
streak shader. Ignore film grain/noise texture: our version is deliberately grain-free. Judge
everything else.

The owner's standard: "clone as close as possible with every detail": composition, palette,
where each colour sits, streak direction and curvature, which areas are soft vs sharp,
hairline strikes (sharp, often broken into dashes), prism/rainbow fringes on edges, blob
shapes and edges.

Compare images: `/Users/nafis/Documents/personal/nafisazizir.com/assets/references/elevenlabs/_hillclimb/out/critic/<id>.png`
(Read each one. For detail you can also read the reference at full size: the path is in
`groups.json` → `primary`, relative to `/Users/nafis/Documents/personal/nafisazizir.com/assets/references/elevenlabs/`.)

For each id, write:
- `grade`: 1–5. 5 = could pass for the reference without grain. 4 = close, small
  differences. 3 = same family and composition, clear differences. 2 = palette only. Be
  strict and calibrated: don't inflate.
- `fixes`: the 3 most important visible differences, most important first, each concrete and
  located ("the dark mass should reach the bottom-left corner; ours stops at ~30% from the
  left", "reference has 3–4 thin white dashed hairlines in the upper right; ours has none",
  "our pale band is too wide, about 2× the reference's"). Describe only what you see. Don't
  propose parameter values.

Write your results to `notes/critic-<your letter>.json` as
`{"<id>": {"grade": n, "fixes": ["...", "...", "..."]}, ...}` and reply with a short summary:
the grade distribution, and the 5 groups that are furthest off.
Do not edit any other file.
