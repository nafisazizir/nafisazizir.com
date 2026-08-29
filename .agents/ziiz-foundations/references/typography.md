# Typography

Source: the `@utility text-*` blocks at the bottom of `app/globals.css` and
the docs page at `/typography`.

## Usage

Typography is consumed as Tailwind classes. **Each class pre-sets
`font-family`, `font-size`, `line-height`, `letter-spacing`, and
`font-weight`.** You apply one role; you never assemble the cluster yourself.

There are **31 roles** in four families:

| Family | Count | For |
| --- | --- | --- |
| Heading | 10 | Introducing pages or sections |
| Button | 3 | Only inside components that render buttons |
| Label | 10 | Single lines — menu items, form labels, chips |
| Copy | 8 | Multiple lines of running text |

A finished component contains **no raw `text-sm` / `font-medium` /
`tracking-*`**. If no role fits, that is a stop-and-resolve — don't invent a
one-off cluster.

**Label vs Copy** is the choice people get wrong: Label is for single lines,
with ample line-height for highlighting and marrying up with icons; Copy is
for multi-line text and has a higher line-height. Same sizes, different
leading.

## The Subtle / Strong modifier

Some roles style a nested `<strong>` element. You get the modifier for free by
nesting the element — there is no second class:

```tsx
<p className="text-copy-16">
  Copy 16 <strong>with Strong</strong>
</p>
```

Two opposite behaviors, by family:

- **Strong** (Label and Copy roles) — `<strong>` goes `font-medium` and
  `text-gray-1000`, i.e. *up* to the primary text tier. Emphasis.
- **Subtle** (Headings 32, 24, 20, 16) — `<strong>` goes `font-medium` and
  `text-gray-900`, i.e. *down* to the secondary tier. It de-emphasizes part of
  a heading rather than emphasizing it. Don't reach for `<strong>` inside a
  heading expecting bold.

Roles without a modifier listed below ignore `<strong>` entirely.

## Fonts

| Variable | Face | Loaded as |
| --- | --- | --- |
| `--font-sans` | Inter Variable (100–900, roman + italic) | `next/font/local`, `app/fonts/InterVariable*.woff2` |
| `--font-mono` | Geist Mono | `next/font/google` |
| `--font-heading` | aliases `--font-sans` | — |

`html` sets `font-optical-sizing: auto` and two Inter features:
`"cv05" 1` (tailed `l`, disambiguating l/I/1) and `"ss03" 1` (round quotes and
commas).

The `-mono` roles are the only ones that switch family; everything else is
`font-sans`.

## Headings

Used to introduce pages or sections. All are weight **450** — a variable-font
weight between regular and medium, not a standard Tailwind step.

| Role | Size / Leading | Tracking | Modifier |
| --- | --- | --- | --- |
| `text-heading-72` | 72 / 72 | -4.32px | — |
| `text-heading-64` | 64 / 64 | -3.84px | — |
| `text-heading-56` | 56 / 56 | -3.36px | — |
| `text-heading-48` | 48 / 56 | -2.88px | — |
| `text-heading-40` | 40 / 48 | -2.4px | — |
| `text-heading-32` | 32 / 40 | -1.28px | Subtle |
| `text-heading-24` | 24 / 32 | -0.96px | Subtle |
| `text-heading-20` | 20 / 26 | -0.4px | Subtle |
| `text-heading-16` | 16 / 24 | -0.32px | Subtle |
| `text-heading-14` | 14 / 20 | -0.28px | — |

Note the tracking curve: it tightens steeply through the display sizes, then
relaxes at 20 and below.

## Buttons

Only to be used within components that render buttons. All weight **medium**.

| Role | Size / Leading | Usage |
| --- | --- | --- |
| `text-button-16` | 16 / 20 | Largest button. |
| `text-button-14` | 14 / 20 | Default button. |
| `text-button-12` | 12 / 16 | Only when a tiny button is placed inside an input field. |

## Label

Designed for single lines, and given ample line-height for highlighting and
marrying up with icons. All weight **normal**.

| Role | Size / Leading | Modifier | Usage |
| --- | --- | --- | --- |
| `text-label-20` | 20 / 32 | — | |
| `text-label-18` | 18 / 20 | — | |
| `text-label-16` | 16 / 20 | Strong | Used in titles to help differentiate from regular. |
| `text-label-16-mono` | 16 / 20 | — | |
| `text-label-14` | 14 / 20 | Strong | **Most common text style of all.** Used in many menus. |
| `text-label-14-mono` | 14 / 20 | — | Largest form of mono, to pair with larger (>14) text. |
| `text-label-13` | 13 / 16 | Strong | A secondary line next to other labels. Tabular when conveying numbers, for consistent spacing. |
| `text-label-13-mono` | 13 / 20 | — | Pairs with Label 14 — the smaller mono size looks better in that pairing. |
| `text-label-12` | 12 / 16 | Strong | Tertiary text in busy views: Comments, Show More, the capitals in Calendars. |
| `text-label-12-mono` | 12 / 16 | — | |

`text-label-14` is the default for control and menu text — it is where stock
shadcn's `text-sm font-medium` cluster lands.

## Copy

Designed for multiple lines of text, having a higher line height than Label.
All weight **normal**.

| Role | Size / Leading | Modifier | Usage |
| --- | --- | --- | --- |
| `text-copy-24` | 24 / 36 | Strong | For hero areas on marketing pages. |
| `text-copy-20` | 20 / 36 | Strong | For hero areas on marketing pages. |
| `text-copy-18` | 18 / 28 | Strong | Mainly for marketing, big quotes. |
| `text-copy-16` | 16 / 24 | Strong | Simpler, larger views like Modals where text can breathe. |
| `text-copy-14` | 14 / 20 | Strong | **Most commonly used text style.** |
| `text-copy-14-mono` | 14 / 20 | Strong | |
| `text-copy-13` | 13 / 18 | — | Secondary text, and views where space is a premium. |
| `text-copy-13-mono` | 13 / 18 | — | Inline code mentions. |

## Picking a role

- Control or menu text → `text-label-14`
- Running prose → a `text-copy-*` role
- Section or page title → a `text-heading-*` role
- Button text → a `text-button-*` role (never a label role)
- Inline code → `text-copy-13-mono`
- Anything mono → the explicit `-mono` role, never `font-mono` on top of a
  sans role
