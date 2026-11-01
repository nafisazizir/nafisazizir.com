
## Round 3 (shader v3) — 28.00 → 13.59, fidelity 4 → 4
- Palette desaturated to the reference's mustard/cream/grey-blue; tiltAngle 100→75 plus a lifting mass3 at the right edge puts blue at top-left and right-middle as in the reference.
- Strikes: the crisp light hairlines in the sky and the dense dark ones below are replaced by strikeMix (0.25 dark share), broad soft feathers (freq 10, width 0.012) — reads as the cream feathers — and one `hero` dark hairline (-0.22, offset -0.31, width 0.0025) for the single brown line in the lower right.
- fibre 0.16 @ 14 with fibreBreak 0.6 for the feathery texture; noise 0.95, scale 1.4.
- Can't do yet: hero has no along-streak placement (it runs nearly full width; the reference line starts mid-frame). The reference's upper streaks arc up more steeply than fan allows without flattening the bottom.

## Round 4 (shader v4) — 13.59 → 12.58, fidelity 4 → 4
- Arc: tried bend -0.15/-0.22 (whole-frame arch, wrong at bottom), radial focus far left (field composition collapses, 46), then bendC -0.4 with fan 0.6 at angle 4: upper lines rise steeply on the left and flatten right, lower ones fall — matches. Orient 10.4 → 7.8.
- Hero: heroX 0.3, heroLen 0.5 so it starts mid-frame; detailSoften 0, heroWidth 0.0018, heroColor #6a4826 tint 0.9, chroma 0 (prism made a cream fringe on it). Palette re-tuned (tune 50 it → 12.27).
- Chose the crisp-hero version (12.58) over the tuned one (12.27): its hairline is visibly closer.
- Still can't: hero follows the line's curvature (bendC), so it bows where the reference line is straight. A hero with its own angle/curvature, independent of the streak frame, would fix it.

## Round 6 (critic fixes): 12.58 → 11.77, honest grade 3
- Blue top-left/top edge: accent 1 #84a0ac at the top-left, and mass3 raised for the right edge down to ~45% (fixes 1, 2).
- Rust corner: accent2 #a65a28 at the bottom-left, small. One clean hairline → two short, faint wisps (hero, hero2 with their own X/len). fibre @30 for finer striation (fix 3, partly). Tuned 40 iterations.
- Left over: the rust corner is still faint, and the striation is still sparser than the reference's.
