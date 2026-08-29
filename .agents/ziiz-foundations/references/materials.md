# Materials

Source: the `@utility material-*` blocks in `app/globals.css`, the
`--ds-shadow-*` definitions above them, and the docs page at `/materials`.

Materials are **elevation presets combining background, border, shadow, and
radius** into one class. Eight of them, in two groups.

Every material is `background-100` plus a composed `box-shadow` plus a radius.
The "border" is part of the shadow — `0 0 0 1px` hairline ring — not a
`border` property, so a material never fights a `border-*` utility.

## Surface — elements that sit in the page

Four levels of elevation. Radius steps up with elevation.

| Material | Radius | Shadow | Usage |
| --- | --- | --- | --- |
| `material-base` | `rounded-md` | `--ds-shadow-border` | The resting surface: hairline border, no shadow. Inputs and flush containers. |
| `material-small` | `rounded-md` | `--ds-shadow-border-small` | A subtle lift for small cards and wells at rest. |
| `material-medium` | `rounded-xl` | `--ds-shadow-border-medium` | Raised surfaces: cards at rest or on hover. |
| `material-large` | `rounded-xl` | `--ds-shadow-border-large` | The most elevated on-page surface. |

> **Note (open question, tracked in `MIGRATION.md`).** No `components/ui`
> component currently uses a Surface material. In-page surfaces — card,
> sidebar — settled on a **flat plain border** (`border-gray-alpha-400`)
> instead, by decision. The usage copy above still reflects the docs page,
> which is stale on this point. Don't apply a Surface material to a new
> in-page surface without resolving it with the human first.

## Floating — elements that float above the page

Four levels, ordered from closest to furthest off the surface.

| Material | Radius | Shadow | Usage |
| --- | --- | --- | --- |
| `material-tooltip` | `rounded-md` | `--ds-shadow-tooltip` | The lightest floating material. |
| `material-menu` | `rounded-md` | `--ds-shadow-menu` | Dropdown and context menus, selects, comboboxes. |
| `material-modal` | `rounded-xl` | `--ds-shadow-modal` | Dialogs and command menus, floating above an overlay. |
| `material-fullscreen` | `rounded-xl` | `--ds-shadow-fullscreen` | The highest elevation: sheets and fullscreen takeovers. |

## Component → material

As actually assigned in `components/ui` today:

| Material | Components |
| --- | --- |
| `material-tooltip` | `chart` (the chart tooltip bubble) — and nothing else |
| `material-menu` | `dropdown-menu`, `context-menu`, `select`, `combobox`, `popover`, `hover-card`, `navigation-menu`; `menubar` inherits it by delegating its content to `DropdownMenuContent` |
| `material-modal` | `dialog`, `alert-dialog`, `sheet`, `drawer`, `toast`; the command palette gets it from the dialog it nests in |
| *(none — flat `border-gray-alpha-400`)* | `card`, `sidebar` |
| *(none — inverted solid)* | `tooltip` |

Two deliberate exceptions:

- **`tooltip` does not use `material-tooltip`.** It is an inverted solid:
  `bg-gray-1000` + `text-background-100` + `rounded-md`, with a matching
  `bg-gray-1000` arrow. Elevation comes from the inversion, not a shadow.
  `material-tooltip` was re-homed onto the chart tooltip bubble instead.
- **`command` standalone is plain** — `bg-background-100` + `rounded-xl`, no
  material. Only the palette form is elevated, and it inherits `material-modal`
  from `DialogContent`.

A material replaces the **whole** ad-hoc cluster. When you apply one, delete
every class it now supplies: the `bg-*`, the `border`, the `rounded-*`, and
the `shadow-*`.

## Best practices

### When to use

- Reach for a material instead of composing background, border, shadow, and
  radius by hand. The class encodes the **elevation role**, not just the look.
- Pick the tier from where the element sits in the layered hierarchy:
  `base`/`small` for resting surfaces, `medium`/`large` for raised content,
  `tooltip`/`menu` for popovers, `modal`/`fullscreen` for takeovers.
- **Never stack two materials on the same element.** If a child needs more
  lift, it becomes its own material one tier up.

### Behavior

- Keep the elevation choice in step with the element's `z-index` band, so a
  `tooltip`-typed surface never renders visually beneath a `base` card.
- Favor the lowest tier that still reads as separated from its background;
  over-elevating is the most common source of visual noise.
- **Don't override a material's shadow or radius inline.** If a surface needs
  different chrome, it belongs to a different tier.

### Accessibility

- Materials are decorative chrome. Semantics live on the role-bearing element:
  `role="dialog"` on a modal, `role="tooltip"` on a tooltip — never on the class.
- Elevation is never the only signal: pair floating surfaces with focus
  management, and keep the focus ring on interactive children inside.
- **Check both themes.** Dark shadows use higher opacities than light, yet
  still barely register against a black page; in dark, separation comes from
  the hairline ring, so verify it reads wherever the material lands.

## Controls are flat

Controls — button, input, textarea, select trigger, native-select, checkbox,
radio, switch, toggle, toggle-group, tabs triggers, input-otp, input-group,
button-group, slider — carry **no shadow at all**. Not a material, not a
`shadow-xs`. The border and wash carry the edge. This is a deliberate
divergence from stock shadcn, which ships `shadow-xs` on most controls.

Elevation exists only on floating surfaces, and only as a `material-*`
utility — never a bare `shadow-*` class.

## Shadow primitives

The composed values the materials draw on. All are `--ds-*` variables in
`app/globals.css`, defined once per theme.

**Building blocks**

| Token | Light | Dark |
| --- | --- | --- |
| `--ds-shadow-border-base` | `0 0 0 1px rgba(0,0,0,0.08)` | `0 0 0 1px rgba(255,255,255,0.145)` |
| `--ds-shadow-border-inset` | `inset 0 0 0 1px rgba(0,0,0,0.08)` | `inset 0 0 0 1px rgba(255,255,255,0.145)` |
| `--ds-shadow-background-border` | `0 0 0 1px var(--ds-background-200)` | same |

Every material's shadow is sandwiched between those two rings:
`shadow-border-base` on the inside, `shadow-background-border` on the outside,
with the drop shadow layers in between.

**Drop layers** (light → dark, opacities rise in dark)

| Token | Light | Dark |
| --- | --- | --- |
| `--ds-shadow-2xs` | `0 1px 1px rgba(0,0,0,.02)` | `0 1px 1px rgba(0,0,0,.08)` |
| `--ds-shadow-xs` | `0 1px 2px rgba(0,0,0,.04)` | `0 1px 2px rgba(0,0,0,.16)` |
| `--ds-shadow-small` | `0 2px 2px rgba(0,0,0,.04)` | `0 1px 2px rgba(0,0,0,.16)` |
| `--ds-shadow-medium` | `0 2px 2px /.04`, `0 8px 8px -8px /.04` | same offsets at `.16` |
| `--ds-shadow-large` | `0 2px 2px /.04`, `0 8px 16px -4px /.04` | same offsets at `.16` |
| `--ds-shadow-xl` | `0 1px 1px /.02`, `0 4px 8px -4px /.04` | `.08` / `.16` |
| `--ds-shadow-2xl` | + `0 16px 24px -8px /.06` | `.24` |

**Composed material shadows** — `--ds-shadow-border`, `-border-small`,
`-border-medium`, `-border-large`, `-tooltip`, `-menu`, `-modal`,
`-fullscreen`. `modal` and `fullscreen` are currently identical.

**Tailwind aliases.** `@theme inline` maps `--shadow-2xs`, `-xs`, `-sm`,
`-md`, `-lg`, `-xl`, `-2xl` onto the `--ds-shadow-*` drop layers, so a bare
`shadow-sm` resolves to a system value. Use materials anyway — the bare
classes exist for the compatibility layer.

## Also defined, currently unused

`--ds-focus-ring` — `0 0 0 2px var(--ds-background-100), 0 0 0 4px
var(--ds-blue-700)` (light) / `--ds-blue-900` (dark). The offset blue ring was
prototyped and **rejected**; focus uses the gray halo instead
(`focus-visible:border-gray-600 focus-visible:ring-3
focus-visible:ring-gray-600/50`). Don't revive it.
