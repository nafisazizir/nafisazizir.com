
## R3 (shader v3), family C
- Metric 43.18 → 20.02; fidelity 3 → 3.
- Changed: stops re-picked from the reference (oxblood, slate-navy, violet-blue, blue-grey, pale). mass3 at the top-left adds the navy corner above the oxblood core. Accent periwinkle (#6e80a8) blob at the lower-left. Three tune passes. A hero hairline at c≈0.275 under the top-left wedge with chroma +0.011 gives cyan above and orange below, as in the reference; strength 0.22 so it doesn't dominate.
- Shader limits: the hero spans the whole frame (the reference's line is local). Interleaved dark/blue strands inside the wedges would need banded multi-hue fibre, since fibre only shifts the palette coordinate. The lower half's periwinkle streakiness is only partial.

## R4 (shader v4), family C
- Metric 19.95 (R3 on v4) → 17.91; fidelity 3 → 3.
- Changed: a dark `band` (-0.45, c=-0.04, width 0.06, x -0.7..0) for the soft blue-grey strand in the lower-left middle; `accent2` periwinkle (#6476a6) in the lower-left; fibre 0.33 with clump 0.5 for stranding; the hero confined with heroX -0.03 / heroLen 0.2, cyan-tinted (heroColor #a8e0e8, tint 0.4). One layout tune.
- Chose u2 (17.91) over the tuner's t4 (17.08): the tuner had narrowed the band into a crisp prism hairline across the frame, which the reference doesn't have.
- Limits: a localized hero still smears ±length/2 along the streak (heroPost wasn't tried here). The lower half's dense periwinkle streaks need a band/fibre that carries a hue, not just a palette shift.

## R6 (critic fixes), family C
- Critic grade 3; my grade now 3. Metric 17.91 → 19.83.
- Fix 3 (crisp rainbow hairline): hero off; chroma 0.01 only.
- Fix 1 (bottom mass should be saturated oxblood): oxblood stop #270500 → #3a0a14. The bottom wedge is now reddish maroon.
- Fix 2 (left mass and corner): navy stop #3e3551 → #2f3158, so the top-left corner reads navy, not near-black. Partial: the left wedge still ends around 45% height and there's no blue-violet streak beneath it; extending the mass (massY/massSize) thinned the bottom wedge and scored 21.8–22.8.
