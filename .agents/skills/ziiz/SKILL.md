---
name: ziiz
description: Build or review UI in an app that uses ziiz (the @ziiz shadcn registry and the @nafisazizir/ziiz npm package). Use when adding ziiz components, choosing a color, type role or elevation, setting ziiz up in a project, or checking UI code for classes that are off the system.
---

# ziiz

ziiz is a design layer on top of Tailwind v4 and shadcn: one stylesheet
(the `@nafisazizir/ziiz` package) that defines a ten-step color ramp, 31 named type roles,
eight materials and a prose class, plus a registry of shadcn components
rewritten to speak only that vocabulary. An app takes the theme as a
package and the components as source it owns.

Full tables (every ramp step, role and material with its use) are in
[reference.md](reference.md). This file is the decision layer.

## Setup

```bash
npx shadcn@latest init --preset vega        # skip if components.json exists
```

```json title="components.json"
{
  "iconLibrary": "tabler",
  "registries": {
    "@ziiz": "https://raw.githubusercontent.com/nafisazizir/ziiz/main/apps/www/public/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @ziiz/theme --overwrite
```

The theme item installs `@nafisazizir/ziiz`, `tw-animate-css` and `shadcn`, adds
their imports to the Tailwind entry in order, and replaces `lib/utils.ts`
with `export { cn } from "@nafisazizir/ziiz/cn"`. `--overwrite` is required for
that last file. If `init` wrote a stock theme block into `globals.css`,
delete everything below the imports except `@custom-variant dark`.

Then two things the item cannot do:

- Fonts. Set `--font-sans` and `--font-mono` on `html` or `:root`
  (next/font's `variable` option). Without them Tailwind's default stacks
  apply.
- Dark mode. It is the `.dark` class on `html`: next-themes with
  `attribute="class"`, and `suppressHydrationWarning` on `html`.

Add `@import "@nafisazizir/ziiz/shadcn.css"` only if the app also runs stock
shadcn components; ziiz components do not need the slot bridge.

## Vocabulary

Every color, text style and elevation in the app comes from one of these.
The stock Tailwind palette is disabled: `bg-sky-500` does not compile.

### Ramp

Ten scales: `background` (two steps), `gray`, `gray-alpha` and seven hues
(`blue`, `red`, `amber`, `green`, `teal`, `purple`, `pink`). Every hue has
the same ten steps with the same roles, so learn the roles once:

| Steps       | Role                                                   |
| ----------- | ------------------------------------------------------ |
| 100 to 300  | Component backgrounds: rest, hover, active or selected |
| 400 to 600  | Borders: default, hover, active                        |
| 700 to 800  | High-contrast fills: rest, hover                       |
| 900 to 1000 | Text and icons: secondary, primary                     |

Pages sit on `bg-background-100`; `background-200` is a sparing secondary
surface. Borders default to the alpha scale (`border-gray-alpha-400`) so
hairlines hold over any surface. A component whose resting background is
the page (ghost buttons, menu items) shifts the ladder down: step 100 is
its hover and 200 its active, on the alpha scale when it rests transparent.
`white` and `black` survive for overlays and content that must be literal.

### Type roles

31 roles, each one class that sets size, leading, tracking and weight:

- `text-heading-72` to `text-heading-14`: page and section titles.
- `text-button-16`, `-14`, `-12`: only inside components that render buttons.
- `text-label-20` to `text-label-12`, with `-mono` variants: single lines,
  menus, table cells, form labels. `text-label-14` is the workhorse.
- `text-copy-24` to `text-copy-13`, with `-mono` variants: multi-line text.
  `text-copy-14` is the default body, `text-copy-16` where text can breathe.

A role is never overridden: no `font-medium`, `text-sm`, `leading-*` or
`tracking-*` beside it. `<strong>` inside a role gives its Strong modifier.

### Materials

Eight `material-*` classes, each a background, border, shadow and radius for
one elevation role. In-page surfaces (cards, inputs, sidebars) are flat by
decision: hairline border on the page background, no shadow, no material.
Floating surfaces take exactly one material:

| Class                 | For                                         |
| --------------------- | ------------------------------------------- |
| `material-tooltip`    | tooltips                                    |
| `material-menu`       | dropdowns, context menus, selects, popovers |
| `material-modal`      | dialogs, drawers, sheets, toasts            |
| `material-fullscreen` | fullscreen takeovers                        |

`material-base` to `material-large` exist for content that must lift off the
page (marketing panels, dashboards), never for controls.

### Prose

Long-form content gets `typeset` on the container and nothing on the
elements inside: headings, paragraphs, lists, code, tables and quotes bind
to roles with a fixed rhythm. Mark a subtree `not-typeset` to opt out.

## Rules

1. Ramp only. `bg-gray-100`, `text-gray-900`, `border-gray-alpha-400`,
   `bg-background-100`. Never a stock Tailwind color, never a hex value,
   never a shadcn alias (`bg-muted`, `text-foreground`) in ziiz code.
2. One role per text element, no raw size or weight utilities.
3. Controls are flat. No `shadow-*` on buttons, inputs, selects, toggles,
   tabs or cards. Elevation is a material on a floating surface, and only
   there.
4. Hover steps the ramp, never opacity. `hover:bg-gray-200`, not
   `hover:bg-gray-100/80`. Opacity is for state only (`disabled:opacity-50`).
5. Focus is one signature on every control:
   `focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50`.
   Invalid state is `aria-invalid:border-red-800 aria-invalid:ring-red-800/20`.
6. No `dark:` color overrides. Both themes share the token names; the ramp
   flips underneath.
7. Radius uses the generic `rounded-*` scale, which derives from `--radius`.
   No arbitrary pixel radii or border widths.
8. No press animation on buttons. Transitions are `transition-colors`, not
   `transition-all`.
9. `cn` comes from `@/lib/utils`, which re-exports `@nafisazizir/ziiz/cn`. Its
   merge knows the roles and materials, so `cn("text-label-14", className)`
   resolves an override correctly. A stock `cn` does not.
10. Compose with the registry's components before writing new markup. When
    a new component is needed, build it from the same vocabulary and the
    same focus signature.
11. One text inset per height. A control at 32 or 36px pads `px-3`,
    24px pads `px-2.5`, 40px pads `px-4`, square or pill alike, and popup
    items pad `px-2` inside a `p-1` content with a transparent 1px border,
    so menu text lines up with whatever opened it. Pick a size for a form
    and set it once: `size="lg"` on `Select`, `Combobox`, `DropdownMenu`
    or `InputGroup` sizes the field and its popup together, and a lg menu
    wants a `size="lg"` button as its trigger. Padding is logical: `ps`,
    `pe`, `start`, `end`, never `pl`, `pr`, `left`, `right`.
12. Icons are `@tabler/icons-react` (`IconCheck`, `IconChevronDown`,
    `IconX`), the library the components ship with. Keep `iconLibrary` set
    to `tabler` in components.json so `shadcn add` writes the same names
    into stock items, and leave the stroke at Tabler's default inside
    controls.

## Components

```bash
npx shadcn@latest search @ziiz            # every item with its description
npx shadcn@latest view @ziiz/button       # source and dependencies
npx shadcn@latest add @ziiz/dialog        # pulls in what it composes
```

Items are the shadcn set (button, input, dialog, dropdown-menu, sidebar,
table, tabs, ...) plus ziiz additions (attachment, bubble, marker, message,
message-scroller, nav, questionnaire) and the docs primitives (callout,
steps, code-block, code-tabs, component-preview, component-source). The
components are Base UI based: `render={<a />}` instead of `asChild`, and
`data-open` / `data-closed` state attributes.

With the shadcn MCP configured (`npx shadcn@latest mcp init --client
claude`, or `cursor`, `vscode`, `codex`), the same search, view and add
are available as tools, reading the `@ziiz` entry from components.json.

Docs as markdown: `https://ziiz.vercel.app/llms.txt` lists every page,
`/llms-full.txt` is the foundation and component docs in one file, and any
page is at `/llms.mdx/<path>`.

## Check your work

Run these over the files you touched; each should return nothing:

```bash
# stock palette or shadcn aliases
grep -nE "\b(bg|text|border|ring|fill|stroke)-(slate|zinc|neutral|stone|sky|indigo|violet|yellow|orange|lime|emerald|cyan|rose|fuchsia)-|(bg|text|border)-(muted|accent|foreground|background|card|popover|primary|secondary|destructive|input|ring)\b" <files>
# raw type utilities where a role belongs
grep -nE "\btext-(xs|sm|base|lg|xl|[2-9]xl)\b|\bfont-(medium|semibold|bold)\b|\btracking-" <files>
# shadows on controls, opacity hovers, press nudges, dark overrides
grep -nE "shadow-(xs|sm|md|lg)|hover:[a-z-]+/[0-9]+|active:.*translate-y|\bdark:(bg|text|border)-" <files>
```

Then check both themes and tab through every control: the focus halo must
appear on each one, unchanged.
