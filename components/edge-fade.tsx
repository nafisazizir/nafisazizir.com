import { cn } from "@/lib/utils"

// The edge reaches as deep as the nav's band (--nav-band in globals.css). The
// strip takes that height and the negative margin gives it straight back, so
// it overlays the page without pushing it down.
const PULL_BACK = { top: "-mb-(--nav-band)", bottom: "-mt-(--nav-band)" }

// The viewport edge, as frosted glass rather than a hard cut (ported from
// ziiz). A gradient dissolves the page into the background, and under it a
// stack of masked backdrop blurs ramps the blur up toward the edge: a single
// blurred layer would switch on at a line, so each layer here blurs twice as
// much as the one below it over roughly half the distance. Blur compounds
// where the layers overlap, which is what makes the last few pixels go soft.
const LAYERS = [
  { blur: 0.5, reach: 100 },
  { blur: 1, reach: 62 },
  { blur: 2, reach: 38 },
  { blur: 4, reach: 20 },
]

// Sticky rather than fixed so the strip belongs to the page it is placed in:
// put the top one first and the bottom one last inside the page's own
// wrapper. It sits under the floating nav (z-50), which keeps its own glass.
export function EdgeFade({ side }: { side: "top" | "bottom" }) {
  const away = side === "top" ? "bottom" : "top"

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none sticky z-30 h-(--nav-band)",
        PULL_BACK[side],
        side === "top" ? "top-0" : "bottom-0"
      )}
    >
      {LAYERS.map(({ blur, reach }) => {
        const mask = `linear-gradient(to ${away}, #000 0%, transparent ${reach}%)`

        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      })}
      <div
        className={cn(
          "absolute inset-0 from-background-100 to-transparent",
          side === "top" ? "bg-linear-to-b" : "bg-linear-to-t"
        )}
      />
    </div>
  )
}
