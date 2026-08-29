# `app/globals.css` — the layered source of truth

The entire foundation lives in one file. Line numbers drift; the **order** is
the contract. Read the blocks in this order and each one only depends on the
ones below it.

| # | Block | Starts | What it holds |
| --- | --- | --- | --- |
| 1 | `@import` | L1 | `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css` |
| 2 | `@custom-variant dark` | L5 | `&:is(.dark *)` — class-based dark mode, not `prefers-color-scheme` |
| 3 | `@theme inline` (shadcn) | L7 | Maps `--color-*` Tailwind utilities onto the shadcn slots, plus the `--radius-*` scale and the font variables |
| 4 | `:root` (slot block) | L51 | **The compatibility layer.** Each shadcn alias assigned the `--ds-*` ramp token it resolves to. Also `--radius: 0.875rem` |
| 5 | `@theme inline` (ziiz) | L87 | The ramp exposed as Tailwind utilities — `bg-gray-*`, `bg-background-*`, 8 hues, `text-*`, `border-*` — plus `--shadow-*` aliases |
| 6 | `:root` (ramp) | L200 | **The only place literal colors exist.** All `--ds-*` values, light theme, plus every composed shadow |
| 7 | `.dark` | L353 | The same `--ds-*` names, dark values. Nothing above this line changes between themes |
| 8 | `@layer base` | L505 | Global element defaults |
| 9 | `@utility material-*` | L531 | The 8 materials |
| 10 | `@utility text-*` | L573 | The 31 type roles |
| 11 | `@utility extend-touch-target` | L703 | Coarse-pointer hit-area expansion |

## Where a change goes

| Change | Where |
| --- | --- |
| New/changed color value | Block 6 (`:root` ramp) **and** block 7 (`.dark`) — always both |
| Expose a ramp token as a utility | Block 5 |
| New type role | Block 10, in its family's group |
| New material | Block 9, plus its composed `--ds-shadow-*` in blocks 6 and 7 |
| Rewire a shadcn alias | Block 4 — assign a `var(--ds-*)`, never a literal |
| Global element default | Block 8 |

**Never put a literal color anywhere but blocks 6 and 7.** Everything above
them references `var(--ds-*)`.

## Radius

One root value drives the whole scale:

```css
--radius: 0.875rem;   /* Large */
```

| Utility | Computed |
| --- | --- |
| `rounded-sm` | `--radius * 0.6` |
| `rounded-md` | `--radius * 0.8` |
| `rounded-lg` | `--radius` |
| `rounded-xl` | `--radius * 1.4` |
| `rounded-2xl` | `--radius * 1.8` |
| `rounded-3xl` | `--radius * 2.2` |
| `rounded-4xl` | `--radius * 2.6` |

The system keeps the **generic** `rounded-*` scale — there are no semantic
shape tokens, and components never carry a literal radius
(`rounded-[2px]`). Token-derived arbitraries are sanctioned; raw pixel values
are not.

## `@layer base`

```css
* { @apply border-border outline-ring/50; }
body { @apply bg-background text-foreground; }
::selection { background-color: var(--ds-gray-1000); color: var(--ds-background-100); }
button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; }
html {
  @apply font-sans;
  font-optical-sizing: auto;
  font-feature-settings: "cv05" 1, "ss03" 1;
}
```

Consequences worth knowing:

- **`cursor: pointer` is global** on enabled buttons — never add it per-component.
- **Selection is inverted** — `gray-1000` on `background-100`.
- **The `*` default border color is `--border`** (`gray-alpha-400`), so a bare
  `border` class already lands on the system hairline.
- The two Inter features (`cv05` tailed `l`, `ss03` round quotes/commas) apply
  document-wide.

## `extend-touch-target`

```css
@utility extend-touch-target {
  @media (pointer: coarse) {
    @apply relative touch-manipulation after:absolute after:-inset-2;
  }
}
```

Grows a small control's hit area by 8px on coarse pointers without changing
its visual size. Apply it to controls that are visually smaller than the touch
minimum.

## Known gotcha — the stock Tailwind palette leaks

Block 5 overrides only steps **100–1000** of the 8 hues. Everything else in
Tailwind's default palette still compiles and can be used by accident:
`sky-*`, `yellow-*`, `*-50`, `*-950`, and so on. These are **off-ramp** — they
are not part of the system and won't theme.

Whether to wipe the defaults with `--color-*: initial` in `@theme` (so
off-ramp colors fail loudly) is an open question in `MIGRATION.md`. Until it
is resolved, treat any color utility outside the ramp's 100–1000 steps as a
bug.
