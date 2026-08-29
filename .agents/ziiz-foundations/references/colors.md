# Colors

Source: the `--ds-*` block in `app/globals.css` (the only place literal colors
exist) and the docs page at `/colors`.

## The scales

Ten scales: **backgrounds**, **gray**, **gray alpha**, **blue**, **red**,
**amber**, **green**, **teal**, **purple**, **pink**.

Values are defined in `oklch`, so wide-gamut color renders on supported
browsers and displays.

Every non-background scale has the same 10 steps with the same roles. The role
of a step is identical on every scale — learn the roles once, apply them to any
hue.

**The scales are hand-tuned per step, not interpolated.** Some steps
deliberately reverse: on the alpha scale in light theme, step 4 (`0.08`) is
*lighter* than step 3 (`0.1`). Treat every step as a named role, never a point
on a gradient, and never compute an intermediate value.

## Step roles

| Steps | Role |
| --- | --- |
| 1–3 | Component backgrounds — rest, hover, active |
| 4–6 | Borders — default, hover, active |
| 7–8 | High-contrast backgrounds — rest, hover |
| 9–10 | Text and icons — secondary, primary |

### Backgrounds (the two page surfaces)

Two background colors for pages and UI components. Use **Background 1** in
most instances, especially when color is placed on top of the background.
**Background 2** is for a subtle background differentiation, used sparingly.

| Token | Name | Usage |
| --- | --- | --- |
| `background-100` | Background 1 | Default element background |
| `background-200` | Background 2 | Secondary background |

### Colors 1–3 — component backgrounds

| Token | Name | Usage |
| --- | --- | --- |
| `gray-100` | Color 1 | Default background |
| `gray-200` | Color 2 | Hover background |
| `gray-300` | Color 3 | Active background |

**There are two ladders**, and picking the wrong one is the most common color
error in the system.

- **Filled components** — secondary buttons, badges — step `1 → 2 → 3` as
  written above.
- **Components whose default background is Background 1** — the page surface
  showing through: ghost buttons, menu items, tab chips — **shift the ladder
  down a rung**: Color 1 is the *hover* background and Color 2 the *active*
  background. Components that rest transparent take that shift on the **alpha**
  scale, so the state reads over any surface.

The shift governs a persistent on/selected state too, not just a momentary
press: a toggle's `aria-pressed` fill on a transparent-resting control is
`bg-gray-alpha-200`, not `-300`.

### Colors 4–6 — borders

| Token | Name | Usage |
| --- | --- | --- |
| `gray-400` | Color 4 | Default border |
| `gray-500` | Color 5 | Hover border |
| `gray-600` | Color 6 | Active border |

**In practice, borders default to the alpha scale** — `border-gray-alpha-400` —
because alpha hairlines hold up over any surface. The solid steps are for the
cases where a border must not tint what is behind it.

`gray-600` is also the focus border and the source of the focus halo
(`ring-gray-600/50`); `--ring` resolves to it.

### Colors 7–8 — high contrast backgrounds

| Token | Name | Usage |
| --- | --- | --- |
| `gray-700` | Color 7 | High contrast background |
| `gray-800` | Color 8 | Hover high contrast background |

### Colors 9–10 — text and icons

| Token | Name | Usage |
| --- | --- | --- |
| `gray-900` | Color 9 | Secondary text and icons |
| `gray-1000` | Color 10 | Primary text and icons |

These two are the accessible text tiers. Nothing else on the ramp is a text
color.

### `gray-950` — the off-scale hover step

One extra step exists on the **gray scale only**: `gray-950`, sitting between
Color 9 and Color 10.

| Token | Light | Dark |
| --- | --- | --- |
| `--ds-gray-950` | `oklch(0.3 0 0)` | `oklch(0.85 0 0)` |

It is not a text tier. It is **the hover step for a `gray-1000` fill** — the
inverted/primary surface, which the 1–3 ladder doesn't cover. Used by
`button` (default variant), `badge` (default), and `bubble`:

```
bg-gray-1000 text-background-100 hover:bg-gray-950
```

If you build a new inverted-fill control, this is its hover. No other scale
has a 950.

## Alpha vs solid

The `gray-alpha` scale is the same 10 roles expressed as black (light) or
white (dark) at an opacity, rather than as a flat value. Reach for alpha when
the color must sit correctly on an *unknown* surface:

- **borders** — default to `gray-alpha-400`
- **hover/active fills on transparent-resting components** — `gray-alpha-100` /
  `gray-alpha-200`
- **the input wash** — `bg-gray-alpha-400/30`, in both themes

Reach for solid gray when the element owns its surface and the color is meant
to be exact.

## shadcn mapping

The shadcn semantic slots are pure `var(--ds-*)` aliases onto the ramp, never
values. This is a compatibility layer for unmigrated code — new work uses the
ramp token in the right column directly.

### Base
| shadcn token | ziiz token |
| --- | --- |
| `--background` | `--ds-background-100` |
| `--foreground` | `--ds-gray-1000` |

### Surfaces
| shadcn token | ziiz token |
| --- | --- |
| `--card` | `--ds-background-100` |
| `--card-foreground` | `--ds-gray-1000` |
| `--popover` | `--ds-background-100` |
| `--popover-foreground` | `--ds-gray-1000` |

### Actions
| shadcn token | ziiz token |
| --- | --- |
| `--primary` | `--ds-gray-1000` |
| `--primary-foreground` | `--ds-background-100` |
| `--secondary` | `--ds-gray-100` |
| `--secondary-foreground` | `--ds-gray-1000` |
| `--muted` | `--ds-gray-100` |
| `--muted-foreground` | `--ds-gray-900` |
| `--accent` | `--ds-gray-100` |
| `--accent-foreground` | `--ds-gray-1000` |
| `--destructive` | `--ds-red-800` |

### Borders and focus
| shadcn token | ziiz token |
| --- | --- |
| `--border` | `--ds-gray-alpha-400` |
| `--input` | `--ds-gray-alpha-400` |
| `--ring` | `--ds-gray-600` |

### Charts
| shadcn token | ziiz token |
| --- | --- |
| `--chart-1` | `--ds-blue-700` |
| `--chart-2` | `--ds-amber-700` |
| `--chart-3` | `--ds-green-700` |
| `--chart-4` | `--ds-purple-700` |
| `--chart-5` | `--ds-pink-700` |

### Sidebar
| shadcn token | ziiz token |
| --- | --- |
| `--sidebar` | `--ds-background-200` |
| `--sidebar-foreground` | `--ds-gray-1000` |
| `--sidebar-primary` | `--ds-gray-1000` |
| `--sidebar-primary-foreground` | `--ds-background-200` |
| `--sidebar-accent` | `--ds-gray-100` |
| `--sidebar-accent-foreground` | `--ds-gray-1000` |
| `--sidebar-border` | `--ds-gray-alpha-400` |
| `--sidebar-ring` | `--ds-gray-600` |

## Theming

Light and dark share the same token names. `.dark` redefines the `--ds-*`
values underneath; nothing above the ramp changes. **A component does not carry
a `dark:` color override** — if one seems necessary, the ramp value is usually
wrong; stop and resolve with the human rather than adding one. Exactly one
carve-out has survived (`switch`'s dark unchecked track); see rule 8 in
`SKILL.md`.

Note the dark ramp is not a mechanical inversion. `gray-700` and `gray-800`
hold the same lightness in both themes, and several hue scales flip which end
is vivid.

## Token values

Every value, both themes, exactly as it appears in `app/globals.css`.

### Backgrounds

| Token | Light | Dark |
| --- | --- | --- |
| `--ds-background-100` | `oklch(1 0 0)` | `oklch(0 0 0)` |
| `--ds-background-200` | `oklch(0.984 0 0)` | `oklch(0.027 0 0)` |
| `--ds-black` | `oklch(0 0 0)` | `— (inherits light)` |
| `--ds-white` | `oklch(1 0 0)` | `— (inherits light)` |

### gray

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-gray-100` | `oklch(0.961 0 0)` | `oklch(0.218 0 0)` |
| `--ds-gray-200` | `oklch(0.94 0 0)` | `oklch(0.239 0 0)` |
| `--ds-gray-300` | `oklch(0.925 0 0)` | `oklch(0.281 0 0)` |
| `--ds-gray-400` | `oklch(0.937 0 0)` | `oklch(0.301 0 0)` |
| `--ds-gray-500` | `oklch(0.836 0 0)` | `oklch(0.39 0 0)` |
| `--ds-gray-600` | `oklch(0.732 0 0)` | `oklch(0.623 0 0)` |
| `--ds-gray-700` | `oklch(0.65 0 0)` | `oklch(0.65 0 0)` |
| `--ds-gray-800` | `oklch(0.59 0 0)` | `oklch(0.59 0 0)` |
| `--ds-gray-900` | `oklch(0.42 0 0)` | `oklch(0.706 0 0)` |
| `--ds-gray-950` | `oklch(0.3 0 0)` | `oklch(0.85 0 0)` |
| `--ds-gray-1000` | `oklch(0.205 0 0)` | `oklch(0.946 0 0)` |

### gray-alpha

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-gray-alpha-100` | `oklch(0 0 0 / 0.05)` | `oklch(1 0 0 / 0.07)` |
| `--ds-gray-alpha-200` | `oklch(0 0 0 / 0.081)` | `oklch(1 0 0 / 0.09)` |
| `--ds-gray-alpha-300` | `oklch(0 0 0 / 0.1)` | `oklch(1 0 0 / 0.13)` |
| `--ds-gray-alpha-400` | `oklch(0 0 0 / 0.08)` | `oklch(1 0 0 / 0.14)` |
| `--ds-gray-alpha-500` | `oklch(0 0 0 / 0.21)` | `oklch(1 0 0 / 0.24)` |
| `--ds-gray-alpha-600` | `oklch(0 0 0 / 0.24)` | `oklch(1 0 0 / 0.51)` |
| `--ds-gray-alpha-700` | `oklch(0 0 0 / 0.44)` | `oklch(1 0 0 / 0.54)` |
| `--ds-gray-alpha-800` | `oklch(0 0 0 / 0.51)` | `oklch(1 0 0 / 0.47)` |
| `--ds-gray-alpha-900` | `oklch(0 0 0 / 0.7)` | `oklch(1 0 0 / 0.61)` |
| `--ds-gray-alpha-1000` | `oklch(0 0 0 / 0.91)` | `oklch(1 0 0 / 0.92)` |

### blue

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-blue-100` | `oklch(97.32% 0.0141 251.56)` | `oklch(22.17% 0.069 259.89)` |
| `--ds-blue-200` | `oklch(96.29% 0.0195 250.59)` | `oklch(25.45% 0.0811 255.8)` |
| `--ds-blue-300` | `oklch(94.58% 0.0293 249.85)` | `oklch(30.86% 0.1022 255.21)` |
| `--ds-blue-400` | `oklch(91.58% 0.0473 245.12)` | `oklch(34.1% 0.121 254.74)` |
| `--ds-blue-500` | `oklch(82.75% 0.0979 248.48)` | `oklch(38.5% 0.1403 254.4)` |
| `--ds-blue-600` | `oklch(73.08% 0.1583 248.13)` | `oklch(64.94% 0.1982 251.81)` |
| `--ds-blue-700` | `oklch(57.61% 0.2508 258.23)` | `oklch(57.61% 0.2321 258.23)` |
| `--ds-blue-800` | `oklch(51.51% 0.2399 257.85)` | `oklch(51.51% 0.2307 257.85)` |
| `--ds-blue-900` | `oklch(53.18% 0.2399 256.99)` | `oklch(71.7% 0.1648 250.79)` |
| `--ds-blue-1000` | `oklch(26.67% 0.1099 254.34)` | `oklch(96.75% 0.0179 242.42)` |

### red

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-red-100` | `oklch(96.5% 0.0223 13.09)` | `oklch(22.1% 0.0657 15.11)` |
| `--ds-red-200` | `oklch(95.41% 0.0299 14.25)` | `oklch(25.93% 0.0834 19.02)` |
| `--ds-red-300` | `oklch(94.33% 0.0369 15.01)` | `oklch(31.47% 0.1105 20.96)` |
| `--ds-red-400` | `oklch(91.51% 0.0471 19.8)` | `oklch(35.27% 0.1273 21.23)` |
| `--ds-red-500` | `oklch(84.47% 0.1018 17.71)` | `oklch(40.68% 0.1479 23.16)` |
| `--ds-red-600` | `oklch(71.12% 0.1881 21.22)` | `oklch(62.56% 0.2277 23.03)` |
| `--ds-red-700` | `oklch(62.56% 0.2524 23.03)` | `oklch(62.56% 0.2234 23.03)` |
| `--ds-red-800` | `oklch(58.19% 0.2482 25.15)` | `oklch(58.01% 0.227 25.12)` |
| `--ds-red-900` | `oklch(54.99% 0.232 25.29)` | `oklch(69.96% 0.2136 22.03)` |
| `--ds-red-1000` | `oklch(24.8% 0.1041 18.86)` | `oklch(95.6% 0.0293 6.61)` |

### amber

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-amber-100` | `oklch(97.48% 0.0331 85.79)` | `oklch(22.46% 0.0538 76.04)` |
| `--ds-amber-200` | `oklch(96.81% 0.0495 90.24)` | `oklch(24.95% 0.0642 64.78)` |
| `--ds-amber-300` | `oklch(95.93% 0.0636 90.52)` | `oklch(32.34% 0.0837 63.83)` |
| `--ds-amber-400` | `oklch(91.02% 0.1322 88.25)` | `oklch(35.53% 0.0903 66.3)` |
| `--ds-amber-500` | `oklch(86.55% 0.1583 79.63)` | `oklch(41.55% 0.1044 67.98)` |
| `--ds-amber-600` | `oklch(80.25% 0.1953 73.59)` | `oklch(75.04% 0.1737 74.49)` |
| `--ds-amber-700` | `oklch(81.87% 0.1969 76.46)` | `oklch(81.87% 0.1969 76.46)` |
| `--ds-amber-800` | `oklch(77.21% 0.1991 64.28)` | `oklch(77.21% 0.1991 64.28)` |
| `--ds-amber-900` | `oklch(52.79% 0.1496 54.65)` | `oklch(77.21% 0.1991 64.28)` |
| `--ds-amber-1000` | `oklch(30.83% 0.099 45.48)` | `oklch(96.7% 0.0418 84.59)` |

### green

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-green-100` | `oklch(97.59% 0.0289 145.42)` | `oklch(23.09% 0.0716 149.68)` |
| `--ds-green-200` | `oklch(96.92% 0.037 147.15)` | `oklch(27.12% 0.0895 150.09)` |
| `--ds-green-300` | `oklch(94.6% 0.0674 144.23)` | `oklch(29.84% 0.096 149.25)` |
| `--ds-green-400` | `oklch(91.49% 0.0976 146.24)` | `oklch(34.39% 0.1039 147.78)` |
| `--ds-green-500` | `oklch(85.45% 0.1627 146.3)` | `oklch(44.19% 0.1484 147.2)` |
| `--ds-green-600` | `oklch(80.25% 0.214 145.18)` | `oklch(58.11% 0.1815 146.55)` |
| `--ds-green-700` | `oklch(64.58% 0.1746 147.27)` | `oklch(64.58% 0.199 147.27)` |
| `--ds-green-800` | `oklch(57.81% 0.1507 147.5)` | `oklch(57.81% 0.1776 147.5)` |
| `--ds-green-900` | `oklch(51.75% 0.1453 147.65)` | `oklch(73.1% 0.2158 148.29)` |
| `--ds-green-1000` | `oklch(29.15% 0.1197 147.38)` | `oklch(96.76% 0.056 154.18)` |

### teal

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-teal-100` | `oklch(97.72% 0.0359 186.7)` | `oklch(22.1% 0.0544 178.74)` |
| `--ds-teal-200` | `oklch(97.06% 0.0347 180.66)` | `oklch(25.06% 0.062 178.76)` |
| `--ds-teal-300` | `oklch(94.92% 0.0478 182.07)` | `oklch(31.5% 0.0767 180.99)` |
| `--ds-teal-400` | `oklch(92.76% 0.0718 183.78)` | `oklch(32.43% 0.0763 180.13)` |
| `--ds-teal-500` | `oklch(86.88% 0.1344 182.42)` | `oklch(43.35% 0.1055 180.97)` |
| `--ds-teal-600` | `oklch(81.5% 0.161 178.96)` | `oklch(60.71% 0.1485 180.24)` |
| `--ds-teal-700` | `oklch(64.92% 0.1572 181.95)` | `oklch(64.92% 0.1403 181.95)` |
| `--ds-teal-800` | `oklch(57.53% 0.1392 181.66)` | `oklch(57.53% 0.1392 181.66)` |
| `--ds-teal-900` | `oklch(52.08% 0.1251 182.93)` | `oklch(74.56% 0.1765 182.8)` |
| `--ds-teal-1000` | `oklch(32.11% 0.0788 179.82)` | `oklch(96.46% 0.056 180.29)` |

### purple

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-purple-100` | `oklch(96.65% 0.0244 312.19)` | `oklch(22.34% 0.0779 316.87)` |
| `--ds-purple-200` | `oklch(96.73% 0.0228 309.8)` | `oklch(25.91% 0.0921 314.41)` |
| `--ds-purple-300` | `oklch(94.85% 0.0364 310.15)` | `oklch(31.98% 0.1219 312.41)` |
| `--ds-purple-400` | `oklch(91.77% 0.0614 312.82)` | `oklch(35.93% 0.1504 309.78)` |
| `--ds-purple-500` | `oklch(81.26% 0.1409 310.8)` | `oklch(40.99% 0.1721 307.92)` |
| `--ds-purple-600` | `oklch(72.07% 0.2083 308.19)` | `oklch(55.5% 0.2191 306.12)` |
| `--ds-purple-700` | `oklch(55.5% 0.3008 306.12)` | `oklch(55.5% 0.2186 306.12)` |
| `--ds-purple-800` | `oklch(48.58% 0.2638 305.73)` | `oklch(48.58% 0.2102 305.73)` |
| `--ds-purple-900` | `oklch(47.18% 0.2579 304)` | `oklch(69.87% 0.2037 309.51)` |
| `--ds-purple-1000` | `oklch(23.96% 0.13 305.66)` | `oklch(96.1% 0.0304 316.46)` |

### pink

| Step | Light | Dark |
| --- | --- | --- |
| `--ds-pink-100` | `oklch(95.69% 0.0359 344.62)` | `oklch(22.67% 0.0628 354.73)` |
| `--ds-pink-200` | `oklch(95.71% 0.0321 353.14)` | `oklch(26.2% 0.0859 356.68)` |
| `--ds-pink-300` | `oklch(93.83% 0.0451 356.29)` | `oklch(31.15% 0.1067 355.93)` |
| `--ds-pink-400` | `oklch(91.12% 0.0573 358.82)` | `oklch(32.13% 0.1174 356.71)` |
| `--ds-pink-500` | `oklch(84.28% 0.0915 356.99)` | `oklch(37.01% 0.1453 358.39)` |
| `--ds-pink-600` | `oklch(74.33% 0.1547 0.24)` | `oklch(50.33% 0.2089 4.33)` |
| `--ds-pink-700` | `oklch(63.52% 0.238 1.01)` | `oklch(63.52% 0.2346 1.01)` |
| `--ds-pink-800` | `oklch(59.51% 0.2339 4.21)` | `oklch(59.51% 0.2429 4.21)` |
| `--ds-pink-900` | `oklch(53.5% 0.2058 2.84)` | `oklch(69.36% 0.2223 3.91)` |
| `--ds-pink-1000` | `oklch(26% 0.0977 359)` | `oklch(95.74% 0.0326 350.08)` |
