# Patterns

Line art for covers, Open Graph images and section panels. Each pattern is
drawn once and placed in any container by `PatternStage`. The catalogue is at
`/playground/pattern-art`. Read this before drawing a new one.

## Frame

- **384×120, 16:5.** `PatternFrame` is the `<svg>`. No padding, no
  background: the container brings the margin, the position and the panel.
- **Placement is the stage's job.** The frame takes 90% of the container's
  width, capped at half its height, centred, or pinned to the top on a cover.
  Never position a pattern inside its own frame to suit one container.
- **Hairline at every size.** The stage sets `vector-effect:
non-scaling-stroke`, so a stroke is 1px whether the frame is 358 or 1100
  wide. Fills (markers, dots) scale with the frame.

## Edges

1. **Closed shapes stay inside.** Circles, rects, pills, markers, dots and
   any filled path may touch an edge, never cross it.
2. **Only straight lines cross an edge,** plus the filled bands between two
   such lines. They are drawn to ±2000 (−2000 up and left, 2400 right) and
   the container clips them.
3. **Nothing leaves through the bottom.** That is where a cover's title sits.
   A line may lie on the bottom edge (y 119.5) and run out a side.
4. **A sloped line that leaves a side must still be above the bottom 22 units
   past the frame,** the stage's side margin in frame units. Check it at
   x −22 and x 406.
5. **Lines start at their inside end** and run outward (`M192 60V-2000`, not
   `M192 -2000V60`), so a draw-in reveal grows away from the subject. The
   first 11 patterns predate this rule.

## Grid

- Strokes sit on half pixels: `x.5`. Fills and markers sit on whole pixels
  around them.
- Lay out on 4. Key coordinates are multiples of 4 (then +0.5 for strokes);
  the dash is `4 4`, so a dashed line on the grid lands its dashes on the
  same rhythm as its neighbours.
- Centre is (192, 60). Thirds of the width are 128 and 256.

## Vocabulary

| Element | Drawing                                                               | Meaning                      |
| ------- | --------------------------------------------------------------------- | ---------------------------- |
| Edge    | `stroke="currentColor"`                                               | the subject's outline        |
| Guide   | `stroke="currentColor" strokeDasharray="4 4"`                         | construction, pending, ghost |
| Cut-out | `fill="var(--ds-background-100)"`, with or without an edge            | the subject, one per pattern |
| Tone    | `fill="var(--ds-gray-300)"`                                           | a shadow face, at most one   |
| Square  | 6×6 rect centred on a vertex, `fill="currentColor"` or cut-out + edge | a fixed point, a joint       |
| Dot     | `r="3"` `fill="currentColor"`                                         | a sample, a source           |
| Ring    | `r="4"` cut-out + edge                                                | a node, a commit, a stop     |
| Node    | `r` 7–12 cut-out + edge, or filled to mark the chosen one             | a vertex of a graph, a token |
| Grain   | `r` 0.5–1.5 `fill="currentColor"`, on a 8 or 16 pitch                 | a field, a texture           |
| Curve   | arcs of true circles and ellipses, or one deliberate Bézier, inside   | a body, a path, a bend       |

Nothing else: no text, no glyphs, no icons, no gradients, no opacity, no
stroke widths other than the hairline. Colours are `currentColor` and the
`--ds-*` variables above, never literal values and never `--color-*` (it does
not exist at runtime under `@theme inline`). Never a product mock: no
windows, cards, buttons or chat bubbles. A pattern suggests a system, it
does not depict an interface.

## Composition

- **One subject.** One cut-out shape, or one tight group, carries the eye.
  Everything else is construction around it.
- **Three to eight elements** for most patterns. A field of grains counts as
  one. If removing an element changes nothing, remove it.
- **Solid is the thing, dashed is the reasoning.** A pattern that is all
  dashed has no subject; all solid has no depth.
- **Markers mark a construction point:** where two lines meet, where a
  line touches a curve, where two curves touch, a centre, a fork, the end of
  a line. Never an arbitrary spot on a curve, never decoration. If you
  cannot say what a marker marks, delete it.
- **Geometry, not gesture.** Curves come from circles and ellipses, placed
  by a relation: tangent, concentric, touching, sharing a centre. No
  freeform wiggles, no wavy lines, no hand-tuned squiggles; a
  wave reads as clip art next to hairline geometry. (Signal and Orbit were
  cut for this.)
- **Anchor to the container.** Most patterns send at least one line out of
  the frame so the art belongs to the panel rather than floating in it.
  Fully contained ones (Corridor) are the exception and sit centred, and
  still need a construction line that relates their parts.
- **Nodes are nodes, not markers.** When circles are the structure (a
  graph, a tree, a layer, a row of tokens) they are r 7–12, so they read at
  cover size. Rings (r 4) are stops on a line. Fewer, larger nodes beat a
  dense lattice: if the edges outnumber the nodes three to one, cut a layer.
  (Beam and the first Neural net were cut for this.)
- **Data stays calm.** A chart has one event: one spike, one breach, one
  open span. Everything else is flat or follows a simple shape; jitter is
  noise, not data. (Pulse was cut; Indent read as a text editor.)
- **Asymmetry over symmetry.** Bias the weight to a third; leave air.
- **Stay legible at 358 wide** (a cover) and at 1100 (a hero). Nothing
  thinner than a 4-unit gap between parallel lines; grains no smaller than
  r 0.5.

## Families

| Family | What it is built from                                              |
| ------ | ------------------------------------------------------------------ |
| Lines  | lines meeting at points: wedges, fans, rays, perspective           |
| Bands  | cut-out bands that run off an edge, and the guides around them     |
| Curves | arcs and circles placed by a relation: touching, tangent, shared   |
| Grids  | rhythm: grains, ticks, rows                                        |
| Charts | data drawn as data: distributions, latencies, traces, shares       |
| Data   | where data lives: stores, lists, queues, logs, indexes, replicas   |
| Flows  | work moving through a system: workflows, triggers, retries, events |
| Graphs | nodes and edges: graphs, trees, shared structure                   |
| Models | machine learning: layers, attention, masks, search, noise          |

A domain pattern (Charts, Data, Flows, Graphs, Models) earns its place by the
structure of the thing, not by a symbol for it: a causal mask is a
lower-triangular staircase, a retry with backoff is arcs whose diameters
double, durable execution is a run that resumes from its last checkpoint,
a persistent tree is two roots sharing a subtree. The structure must be
true; a linked list whose last pointer is null has nothing after it. The
one familiar silhouette allowed is the database cylinder.

## Adding one

1. Draw it in `components/patterns/<name>.tsx`, a server component that
   returns `<PatternFrame {...props}>` and literal shapes. Loops are fine for
   grains and ticks; compute other coordinates once and write the numbers.
2. Name it for its form, not its use: `PatternEclipse`, not `PatternHero2`.
   Never `index.tsx`, which shadows the folder's `index.ts`.
3. Add it to `patterns` in `index.ts` with its family, and to the exports.
4. Open the catalogue, switch through Frame, Cover, 16:9, Open Graph, 4:3
   and 1:1, in light and dark. Check the rules above at each, then delete
   whatever does not earn its place.
5. `pnpm exec prettier --write` the files you touched.
