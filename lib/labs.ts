// Every playground under /labs, newest first. A lab is a page at
// /labs/<slug>; its card art is looked up by slug in components/labs/lab-art.
export interface Lab {
  slug: string
  title: string
  description: string
  date: string
}

export const labs: Lab[] = [
  {
    slug: "streaks",
    title: "Streaks",
    description:
      "Colour fields smeared along curved streamlines, rendered live in a shader. Pick a palette, bend the light, export a still.",
    date: "2026-10-27",
  },
]

export const getLab = (slug: string) => labs.find((l) => l.slug === slug)
