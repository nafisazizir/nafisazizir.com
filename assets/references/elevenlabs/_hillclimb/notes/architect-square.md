
## R3 (shader v3), family C
- Metric 32.18 → 20.14; fidelity 3 → 3 (clearly better, still family-level).
- Changed: ramp navy → mid-blue → warm grey #686a74 → pale → periwinkle (folded), so the edge passes through warm grey as in the reference. Accent oxblood (#2c141c, amount ~1) gives the broad oxblood patch at the top centre that a ramp with navy lowest can't. Tuned. Bend 0.42 → 0.2 (the tuner's arc was too curved). Hero hairline at c=0.06 with chroma 0.006 for the edge's prism line.
- Shader limits: one global angle plus bend/fan can't give "steep at top-left, straighter diagonal elsewhere" without curving everything. The reference's teal fringe is a soft, broad (~0.01) cyan band, not a spectrum; the hero+chroma gives a full rainbow. Lower-right blue in the dark side needs another hue (the accent is spent on oxblood).

## R4 (shader v4), family C
- Metric 20.06 → 19.51; fidelity 3 → 3.
- Changed: angle -50, bend 0.2, bendC -0.5 (orient 13.4 → 12.5 before detail); accent2 blue (#4f6595) for the lower-right of the dark side; a teal hero (heroColor #5a9aa6, tint 0.9, width 0.01) confined to the upper edge with heroX -0.15, heroLen 0.3, heroPost 0.4. One tune (stops, level, tilt, accents, hard, hardSkew, bendC).
- Chose v2 (19.51) over v1 (18.87, same without heroPost): heroPost keeps the glint local, which matches the reference.
- Limits: the edge still arcs. The reference is steep and straight in the upper half and flatter below, and moving the edge left with level wrecks the layout (21–23). A broad soft single-hue fringe still needs a "tinted band" (band + colour) primitive.

## R6 (critic fixes), family C
- Critic grade 3; my grade now 3. Metric 19.51 → 20.15.
- Fix 1 (concentric arcs): bend 0, bendC 0, angle -55, then a layout tune with the geometry frozen. The streaks are now straight diagonals.
- Fix 2 (sharp hairline arc not in the reference): hero off. Chroma 0.02 gives soft fringes along the pale band's edges.
- Fix 3 (periwinkle strip along the left edge, pale band from top-left to bottom centre): an `edge` half-plane (0.5 at x -0.44, angle 180°, soft 0.05) and periwinkle last stop #6a80aa. The pale band now runs top-left → bottom centre.
- Partial: the soft rose fringe at ~20% x, 40% y is faint, and the oxblood top patch is smaller than the reference's.
