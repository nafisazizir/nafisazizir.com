---
name: ziiz-foundations
description: The ziiz design system foundations — the color ramp, the 31 type roles, the 8 materials, and how app/globals.css is layered. Use when writing or reviewing any UI in this repo, choosing a color/type/material token, adding a token, or answering what a foundation token means.
---

# ziiz Foundations

The system has three foundations — **colors**, **typography**, **materials** —
all defined in one file, `app/globals.css`, and rendered by the docs pages at
`/colors`, `/typography`, `/materials`.

This skill is the written form of those foundations. Read the reference for
the foundation you are touching before you pick a token; the tables carry the
*roles*, and the role is the thing that decides. Never pick a token from
memory of what shadcn or "a design system" usually does.

| Reference | What it settles |
| --- | --- |
| [references/colors.md](references/colors.md) | The 10 scales, what each of the 10 steps is *for*, the two background ladders, alpha vs solid, the shadcn alias mapping, and every oklch value in both themes. |
| [references/typography.md](references/typography.md) | The 31 named roles across Heading / Button / Label / Copy, their exact metrics, and which role fits which surface. |
| [references/materials.md](references/materials.md) | The 8 elevation presets, what each shadow is composed of, and the rules for picking a tier. |
| [references/css-architecture.md](references/css-architecture.md) | How `app/globals.css` is layered, in order, and where a new token or utility goes. |

## The vocabulary

Authoring is **ramp-first**. UI speaks the ramp directly:

```
bg-background-100  bg-gray-100  border-gray-alpha-400  text-gray-900
text-label-14      text-copy-13-mono   text-heading-24
material-menu      material-modal      material-tooltip
rounded-md         rounded-xl
```

Never the shadcn semantic aliases (`bg-muted`, `text-foreground`,
`bg-popover`, `border-border`, …). Those still exist in the `:root` slot block
of `globals.css`, but only as a **compatibility layer** for code that has not
been migrated yet — they are pure `var(--ds-*)` aliases onto the ramp, never
values of their own. New work never adds one.

## Rules in force

These are settled across the whole system. They apply to new components and
migrated ones alike.

1. **Ramp-first authoring.** Ramp utilities only; no shadcn aliases in new code.
2. **Controls are flat.** No `shadow-xs` / `shadow-sm` on buttons, inputs,
   selects, checkboxes, tabs, sliders, or any other control — the border and
   wash carry the edge. `components/ui` currently contains **zero** bare
   `shadow-*` classes. Elevation exists only on floating surfaces, and only as
   a `material-*` utility.
3. **One focus signature, everywhere.** Every control, click or text-entry:
   ```
   focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50
   ```
   Container-level variants spell the same thing through `focus-within:` or
   `has-[…:focus-visible]:`. There are no focus tokens. The `/50` is deliberate
   state opacity — the halo is derived from the border color; no alpha tier has
   a halo role.
4. **One invalid signature, everywhere, in both themes.**
   ```
   aria-invalid:border-red-800 aria-invalid:bg-red-100 aria-invalid:ring-3 aria-invalid:ring-red-800/20
   ```
   Note the halo is `/20`, not the focus signature's `/50`, and the resting
   background is red **Color 1** — the ramp's component-background role — so an
   invalid field rests on it. Stock shadcn's `dark:` dims for the invalid state
   are deleted, not translated.
5. **Radius uses the generic `rounded-*` scale.** No semantic shape tokens.
   The scale is derived from `--radius: 0.875rem` (Large). No literal pixel
   radii; token-derived arbitraries such as
   `rounded-[min(var(--radius-md),4px)]` are sanctioned.
6. **Hover steps the ramp; it never opacity-mixes.** No `hover:bg-x/80`, no
   `color-mix()`. Step to the adjacent hand-tuned ramp step instead. Opacity
   kept deliberately as *state* — `disabled:opacity-50`, the focus halo's
   `/50`, the invalid halo's `/20`, the input wash's `/30` — is fine.
7. **Input wash.** Inputs carry `bg-gray-alpha-400/30` in **both** themes.
8. **Light and dark share the same token names.** Theming happens underneath
   the ramp, inside `globals.css`. A component does not carry a `dark:` color
   override — if one seems necessary, **stop and resolve with the human**;
   the default answer is to flatten. Exactly one carve-out has ever survived
   (`switch`: `dark:data-unchecked:bg-gray-alpha-400/80`, holding stock's
   dimmer dark track), and it is scoped to that component, not a general
   reopening. `avatar`'s `dark:after:mix-blend-lighten` is a blend mode, not a
   color, and is unaffected.
9. **Press is a scale, not a nudge.** Button-like controls (button, toggle)
   press with `active:scale-[0.97] motion-reduce:active:scale-100`. Vega's
   `active:translate-y-px` nudge is rejected — delete it wherever it appears.
   The transition on these controls is
   `transition-[color,background-color,border-color,scale]` at `duration-200`
   with `ease-[cubic-bezier(0.16,1,0.3,1)]` (ease-out-expo), shared by the
   color hovers. **`box-shadow` is deliberately absent from that list**, so
   the focus halo appears instantly. Text-entry controls have no press and use
   `transition-[color,box-shadow]` instead. Functional motion — switch thumb
   travel, accordion collapse, overlay enter/exit — is unaffected.

## Choosing a token, in one line each

- **A background** → `background-100` by default; `background-200` only for a
  deliberate secondary surface. Component fills come from steps 1–3 of a scale.
- **A border** → the alpha scale, step 4 (`border-gray-alpha-400`). Alpha
  hairlines hold up over any surface.
- **Text** → `gray-1000` primary, `gray-900` secondary. Nothing else is a text tier.
- **A type style** → one named role. A component with a raw `text-sm` /
  `font-medium` / `tracking-*` cluster is unfinished.
- **A floating surface** → one `material-*`, replacing the whole
  background + border + radius + shadow cluster.

## Related

- `migrate-component` — the procedure for bringing a stock shadcn component
  onto these foundations. That skill owns the *process*; this one owns the
  *system*.
- `MIGRATION.md` — mutable state: open questions and the per-component
  decision log. Foundations questions that are still unresolved live there,
  not here.
