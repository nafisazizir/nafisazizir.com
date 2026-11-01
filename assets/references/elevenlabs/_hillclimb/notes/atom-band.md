
## R3 (shader v3), family C
- Metric 24.31 → 18.26; fidelity 4 → 4.
- Changed: the white streak is now a long taper from the left edge (mass2 centred off-canvas at x≈-0.76, massStretch 4). Prism flipped negative (-0.03), so the order matches: red above the white streak, blue below. Accent violet-navy (#3c2e5a) at the bottom-left. A small positive mass3 at the right edge for the mauve. Two tune passes.
- Shader limits: the reference's colour rims are broad (~0.03–0.05 of height) and saturated. Chroma maxes at 0.05 and only disperses hard edges, so on these soft edges the rims come through faintly. massStretch is shared by every mass and the accent, so a long thin streak forces every blob to be long too.

## R4 (shader v4), family C
- Metric 18.38 → 22.02 (worse, but chosen by eye); fidelity 4 → 4.
- Changed: accent 1 is now a crimson rim (#8c2640) toned to the white streak's edge (accentTone 0.7, width 0.16, amount 0.6); the violet-navy bottom-left moved to accent2; chroma -0.03 → -0.05 for the blue rim under the pale top; fibre 0.18 at freq 6 for smoother strands. In crops this reads much more like the reference's broad coloured rims. The metric penalises the softer bands.
- Tried: chroma -0.07/-0.08 on its own (rims appear, but green mid-taps tint the white streak and the band goes violet: 21–24); a tune at -0.07 (21.25, rims faint); narrow tone width 0.08 (pink hairline striations).
- Limits: chroma's middle taps put green/yellow into broad rims, and the reference's rims are two-colour (crimson above, blue below). A signed two-colour tint for the edge gradient (warm where dt/dc>0, cool where <0) would do it directly. The white streak is still steeper and shorter than the reference's.

## R6 (critic fixes), family C
- Critic grade 3; my grade now 3. Metric 22.02 → 18.97 (better on both counts).
- Fix 1 (two-sided split, not a rainbow smear): chroma -0.05 → -0.012; accent 1 is crimson #a02a48 just above the streak (y 0.08, size 0.05, untoned); accent2 is blue #4f8ad0 just below (y -0.11); lum 0.45 at the streak for a brighter core.
- Fix 2 (upper left should be saturated blue-violet with fine lines and a blue rim): violet stop → #5250a0; strikes 0.08 at freq 30 zoned to the upper left (strikeZone 0.45 at -0.45, 0.3). The blue rim under the pale top now shows.
- Fix 3 (maroon centred, mauve corner): a mass/level tune moved the core in, and the oxblood stop is now #3e0c14 (the reference's hue, less brown).
- Partial: the streak is steeper and lower than the reference's; the bottom-left violet-blue band is only partial (both accent slots are spent on the rims).
