# ziiz reference

The tables behind [SKILL.md](SKILL.md). Source of truth is
`@nafisazizir/ziiz/theme.css`; the docs at https://ziiz.vercel.app/colors,
/typography, /materials and /prose render the same data with reasoning.

## Ramp

Utilities take the form `bg-<scale>-<step>`, `text-<scale>-<step>`,
`border-<scale>-<step>`, `ring-<scale>-<step>` and so on. Values are oklch,
hand-tuned per step, and flip under `.dark` without the class name changing.

Scales: `background` (100, 200), `gray`, `gray-alpha`, `blue`, `red`,
`amber`, `green`, `teal`, `purple`, `pink`. Every scale except `background`
has the ten steps below with the same roles. `white` and `black` remain
for overlays and literal content (QR codes, blend modes).

| Step | Name     | Role                                                    |
| ---- | -------- | ------------------------------------------------------- |
| 100  | Color 1  | Component background at rest                            |
| 200  | Color 2  | Component background on hover                           |
| 300  | Color 3  | Component background when pressed or selected           |
| 400  | Color 4  | Default border                                          |
| 500  | Color 5  | Hover border                                            |
| 600  | Color 6  | Active border (the focus signature uses solid gray-600) |
| 700  | Color 7  | High-contrast background                                |
| 800  | Color 8  | High-contrast background on hover                       |
| 900  | Color 9  | Secondary text and icons                                |
| 1000 | Color 10 | Primary text and icons                                  |

| Token            | Role                                |
| ---------------- | ----------------------------------- |
| `background-100` | Page and default element background |
| `background-200` | Secondary surface, used sparingly   |

Ladders in practice:

- Filled components (secondary button, badge) step 100, 200, 300 as written.
- Components resting on the page (ghost button, menu item, tab chip) shift
  down: step 100 on hover, 200 on active, on the `gray-alpha` scale when
  they rest transparent so the state reads over any surface.
- A transient open state (`aria-expanded`, `data-open`) pins to the hover
  step. Hovering an already selected control deepens one more step
  (`gray-alpha-300` on the alpha ladder, `gray-950` on inverted fills).
- Borders default to `gray-alpha-400`, step to `gray-alpha-500` on hover.
  On focus the hairline is replaced by solid `gray-600` plus the halo.
- Inverted fills (the default button) are `bg-gray-1000 text-background-100`,
  `hover:bg-gray-950`, `active:bg-gray-900`.
- Destructive is `bg-red-700 text-white hover:bg-red-800 active:bg-red-900`;
  the invalid border and ring use `red-800`.

Shadows: `shadow-2xs` to `shadow-2xl` map to the ramp's shadow tokens, but
components never use them directly; a material carries the shadow.

Radius: `rounded-sm` to `rounded-4xl` derive from `--radius` (0.875rem).

## Type roles

Each role is one `text-<role>` class that sets `font-size`, `line-height`,
`letter-spacing` and `font-weight`. Nothing else is set next to it. A
`<strong>` inside a role gives its Strong modifier.

### Headings

Introduce pages or sections. Subtle variants exist at 32, 24, 20 and 16.

`text-heading-72` `text-heading-64` `text-heading-56` `text-heading-48`
`text-heading-40` `text-heading-32` `text-heading-24` `text-heading-20`
`text-heading-16` `text-heading-14`

In prose (`typeset`), h1 binds to Heading 40, h2 to 32, h3 to 24, h4 to 20,
h5 to 16, h6 to 14.

### Buttons

Only inside components that render buttons.

| Role             | Use                                        |
| ---------------- | ------------------------------------------ |
| `text-button-16` | Largest button                             |
| `text-button-14` | Default button                             |
| `text-button-12` | A tiny button placed inside an input field |

### Labels

Single lines with generous line-height so they marry up with icons.

| Role                 | Use                                                              |
| -------------------- | ---------------------------------------------------------------- |
| `text-label-20`      | Large single-line label                                          |
| `text-label-18`      | Large single-line label                                          |
| `text-label-16`      | Titles that must differ from regular text (Strong available)     |
| `text-label-16-mono` | Mono at 16                                                       |
| `text-label-14`      | The most common style of all; menus, cells, form labels          |
| `text-label-14-mono` | Largest mono, to pair with text above 14                         |
| `text-label-13`      | Secondary line next to other labels; tabular numbers             |
| `text-label-13-mono` | Mono paired with Label 14                                        |
| `text-label-12`      | Tertiary text in busy views (comments, show more, calendar caps) |
| `text-label-12-mono` | Mono at 12                                                       |

### Copy

Multi-line text, higher line-height than Label.

| Role                | Use                                                      |
| ------------------- | -------------------------------------------------------- |
| `text-copy-24`      | Hero areas on marketing pages                            |
| `text-copy-20`      | Hero areas on marketing pages                            |
| `text-copy-18`      | Marketing, big quotes                                    |
| `text-copy-16`      | Simpler, larger views like modals where text can breathe |
| `text-copy-14`      | The most commonly used body style                        |
| `text-copy-14-mono` | Mono body                                                |
| `text-copy-13`      | Secondary text and views where space is a premium        |
| `text-copy-13-mono` | Inline code mentions                                     |

## Materials

Each `material-*` class sets background, border, shadow and radius for one
elevation role. Never stack two on one element; never override a material's
shadow or radius inline. Semantics stay on the element (`role="dialog"`),
never on the class.

### Surface (in the page)

Not used by any ziiz component: in-page surfaces are flat by decision
(`border-gray-alpha-400` on `bg-background-100`, no shadow). Available for
content that must lift off the page.

| Class             | Radius       | Use                                                 |
| ----------------- | ------------ | --------------------------------------------------- |
| `material-base`   | `rounded-md` | Resting surface: hairline border, no shadow         |
| `material-small`  | `rounded-md` | Subtle lift for a small panel on a busy background  |
| `material-medium` | `rounded-xl` | Raised in-page content, feature panels, hover tiles |
| `material-large`  | `rounded-xl` | The most elevated on-page surface                   |

### Floating (above the page)

| Class                 | Radius       | Use                                                                    |
| --------------------- | ------------ | ---------------------------------------------------------------------- |
| `material-tooltip`    | `rounded-md` | Tooltips and chart tooltips, sized to a single label                   |
| `material-menu`       | `rounded-md` | Dropdown and context menus, selects, comboboxes, popovers, hover cards |
| `material-modal`      | `rounded-xl` | Dialogs, drawers, sheets, toasts, command palettes                     |
| `material-fullscreen` | `rounded-xl` | Fullscreen takeovers                                                   |

Keep the tier in step with the element's z-index band and prefer the lowest
tier that still reads as separated.

## Prose

`typeset` on a container binds bare elements to roles with a fixed rhythm.
Every rule is `:where()`-scoped, so a utility on an element still wins, and
a subtree marked `not-typeset` or `data-not-typeset` opts out.

- Body: Copy 16 on Color 9. Blocks sit `--typeset-flow` (24px) apart;
  a section heading takes `--typeset-section` (72px) above.
- h1 Heading 40, h2 Heading 32, h3 Heading 24, h4 Heading 20, h5 Heading 16,
  h6 Heading 14, all on Color 10.
- `strong` is the Copy Strong modifier, `code` a chip on Copy 13 Mono,
  `kbd` a key cap, `mark` a highlight, links underlined on the text color.
- Lists: disc then circle, 8px between items, markers on Color 6. Ordered
  lists use decimals. Definition terms sit on Color 10.
- Blockquotes are pull quotes on Heading 24 with hanging quote marks and a
  `footer` / `cite` attribution.
- Tables, `pre`, `hr`, `details` and figures are bound too; a code block
  inside `[data-slot="code-block"]` gets a title bar and copy button chrome.

## shadcn slot bridge

`@nafisazizir/ziiz/shadcn.css` is optional. It maps the stock shadcn variables
onto the ramp so components written in that vocabulary render on it
unchanged. Useful for reading old code, never for writing new ziiz code.

| Slot                                                                                                          | Ramp token                                                     |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `background`, `card`, `popover`                                                                               | `background-100`                                               |
| `foreground`, `primary`, `card-foreground`, `popover-foreground`, `secondary-foreground`, `accent-foreground` | `gray-1000`                                                    |
| `primary-foreground`                                                                                          | `background-100`                                               |
| `secondary`, `muted`, `accent`                                                                                | `gray-100`                                                     |
| `muted-foreground`                                                                                            | `gray-900`                                                     |
| `destructive`                                                                                                 | `red-800`                                                      |
| `border`, `input`                                                                                             | `gray-alpha-400`                                               |
| `ring`                                                                                                        | `gray-600`                                                     |
| `chart-1` to `chart-5`                                                                                        | `blue-700`, `amber-700`, `green-700`, `purple-700`, `pink-700` |
| `sidebar`                                                                                                     | `background-200`                                               |
| `sidebar-accent`                                                                                              | `gray-100`                                                     |
| `sidebar-border`                                                                                              | `gray-alpha-400`                                               |
| `sidebar-ring`                                                                                                | `gray-600`                                                     |

## Registry items

Add any of these with `npx shadcn@latest add @ziiz/<name>`.

Setup: `theme` (packages, imports, utils), `utils` (the `cn` re-export),
`skill` (this skill, into `.agents/skills/ziiz/`).

Components: accordion, alert, alert-dialog, aspect-ratio, attachment,
avatar, badge, breadcrumb, bubble, button, button-group, calendar, card,
carousel, chart, checkbox, collapsible, combobox, command, context-menu,
dialog, direction, drawer, dropdown-menu, empty, field, hover-card, input,
input-group, input-otp, item, kbd, label, marker, menubar, message,
message-scroller, native-select, nav, navigation-menu, pagination, popover,
progress, questionnaire, radio-group, resizable, scroll-area, select,
separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table,
tabs, textarea, toast, toggle, toggle-group, tooltip.

Docs primitives (install into `components/docs/`): callout, code-block,
code-collapsible, code-tabs, component-preview, component-source, steps.

Hooks: use-mobile.

Package exports: `@nafisazizir/ziiz` and `@nafisazizir/ziiz/theme.css` (the design
layer), `@nafisazizir/ziiz/shadcn.css` (the slot bridge), `@nafisazizir/ziiz/cn` (`cn`,
`twMerge`, `typeRoles`, `materials`), `@nafisazizir/ziiz/shiki` (a Shiki theme
that resolves to the ramp's variables).
