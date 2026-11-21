import type { ComponentType } from "react"

import type { TocVariantProps } from "./types"
import CurrentToc from "./variants/current"
import RailToc from "./variants/rail"
import ClerkToc from "./variants/clerk"
import NestedToc from "./variants/nested"
import XaiToc from "./variants/xai"
import NumberedToc from "./variants/numbered"
import GutterToc from "./variants/gutter"
import TicksToc from "./variants/ticks"
import ScrubberToc from "./variants/scrubber"
import DotsToc from "./variants/dots"
import PillToc from "./variants/pill"
import TopbarToc from "./variants/topbar"
import IslandToc from "./variants/island"
import InlineToc from "./variants/inline"
import FocusToc from "./variants/focus"
import ProgressToc from "./variants/progress"

export interface TocVariant {
  id: string
  name: string
  description: string
  Component: ComponentType<TocVariantProps>
}

export const TOC_VARIANTS: TocVariant[] = [
  {
    id: "current",
    name: "Current",
    description: "The live one: plain labels beside the prose.",
    Component: CurrentToc,
  },
  {
    id: "rail",
    name: "Rail",
    description:
      "Docs-style 'On this page' with a hairline track and a sliding active bar (Vercel, Baseten docs).",
    Component: RailToc,
  },
  {
    id: "clerk",
    name: "Bending line",
    description:
      "A line that bends with the h2/h3 indent, the read part highlighted (Fumadocs / Clerk).",
    Component: ClerkToc,
  },
  {
    id: "nested",
    name: "Nested",
    description:
      "h2s always, the active section's h3s unfold under it, with progress and back to top.",
    Component: NestedToc,
  },
  {
    id: "xai",
    name: "xAI",
    description: "After x.ai's guide pages.",
    Component: XaiToc,
  },
  {
    id: "numbered",
    name: "Numbered index",
    description:
      "Mono 01, 02... editorial index; the active row draws a long rule (Ramp Labs).",
    Component: NumberedToc,
  },
  {
    id: "gutter",
    name: "Gutter markers",
    description:
      "Section numbers set in the left gutter beside each heading, the current one sticky.",
    Component: GutterToc,
  },
  {
    id: "ticks",
    name: "Ticks",
    description:
      "A column of dashes at the edge that opens into labels on hover (Linear, Apple).",
    Component: TicksToc,
  },
  {
    id: "scrubber",
    name: "Scrubber",
    description:
      "A timeline whose segments are as long as their sections, filling as you read.",
    Component: ScrubberToc,
  },
  {
    id: "dots",
    name: "Dots",
    description:
      "A dot per section joined by a progress line; only the active label shows.",
    Component: DotsToc,
  },
  {
    id: "pill",
    name: "Pill",
    description:
      "A floating bottom pill: the current section, n/N and a progress ring; opens the list.",
    Component: PillToc,
  },
  {
    id: "topbar",
    name: "Top bar",
    description:
      "Once the header is gone, a slim sticky bar with the section, a progress hairline and a dropdown.",
    Component: TopbarToc,
  },
  {
    id: "island",
    name: "Island",
    description:
      "A small pill in the corner that morphs into the full list on hover.",
    Component: IslandToc,
  },
  {
    id: "inline",
    name: "Inline",
    description:
      "A contents block at the head of the article, then a quiet sticky mini version.",
    Component: InlineToc,
  },
  {
    id: "focus",
    name: "Focus wheel",
    description:
      "The active entry centred, the rest fading and blurring with distance, like a picker.",
    Component: FocusToc,
  },
  {
    id: "progress",
    name: "Section progress",
    description:
      "Each entry carries its own progress hairline and minutes left.",
    Component: ProgressToc,
  },
]
