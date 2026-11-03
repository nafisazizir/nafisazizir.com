import type { SVGProps } from "react"

/*
 * iOS glyphs, drawn by hand in the manner of SF Symbols (filled shapes,
 * round caps, semibold strokes) for the phone figures. Not traced from
 * Apple's set: SF Symbols are licensed for Apple-platform UI, not for
 * illustrations like these.
 */

type GlyphProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number }

function Glyph({
  size = 24,
  children,
  ...props
}: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...props}>
      {children}
    </svg>
  )
}

/** phone.fill: the handset, earpiece top left, mouthpiece bottom right. */
export const PhoneFill = (p: GlyphProps) => (
  <Glyph {...p}>
    <path
      fill="currentColor"
      d="M6.9 2.4c.7-.4 1.6-.3 2.1.3l2.4 2.8c.6.7.6 1.6.1 2.3l-1.4 1.7c-.3.4-.3.9-.1 1.3 1.1 1.9 2.7 3.5 4.6 4.6.4.2.9.2 1.3-.1l1.7-1.4c.7-.5 1.6-.5 2.3.1l2.8 2.4c.6.5.7 1.4.3 2.1l-1.1 1.8c-.8 1.3-2.3 1.9-3.8 1.5C10.9 20.5 3.5 13.1 2.2 6.8c-.4-1.5.2-3 1.5-3.8L6.9 2.4Z"
    />
  </Glyph>
)

/** phone.down.fill: the handset laid flat, as on the Decline button. */
export const PhoneDownFill = (p: GlyphProps) => (
  <PhoneFill {...p} style={{ transform: "rotate(135deg)", ...p.style }} />
)

/** video.fill */
export const VideoFill = (p: GlyphProps) => (
  <Glyph {...p}>
    <rect x="1.5" y="5.5" width="14" height="13" rx="3.4" fill="currentColor" />
    <path
      fill="currentColor"
      d="M17 10.1l3.7-2.6c.6-.4 1.3 0 1.3.7v7.6c0 .7-.7 1.1-1.3.7L17 13.9Z"
    />
  </Glyph>
)

/** chevron.left, semibold. */
export const ChevronLeft = ({
  weight = 2.6,
  ...p
}: GlyphProps & { weight?: number }) => (
  <Glyph {...p}>
    <path
      d="M15 4.5 7.5 12l7.5 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Glyph>
)

/** chevron.right, for "Adam ›". */
export const ChevronRight = ({
  weight = 3,
  ...p
}: GlyphProps & { weight?: number }) => (
  <Glyph {...p}>
    <path
      d="M9 4.5 16.5 12 9 19.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Glyph>
)

/** plus, medium weight. */
export const Plus = (p: GlyphProps) => (
  <Glyph {...p}>
    <path
      d="M12 4.5v15M4.5 12h15"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Glyph>
)

/** mic, outline. */
export const Mic = (p: GlyphProps) => (
  <Glyph {...p}>
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <rect x="8.6" y="2.6" width="6.8" height="11.6" rx="3.4" />
      <path d="M5.4 11.2a6.6 6.6 0 0 0 13.2 0" />
      <path d="M12 17.8v3.4" />
    </g>
  </Glyph>
)

/** The Messages glyph: a speech bubble, tail to the bottom left. */
export const MessageFill = (p: GlyphProps) => (
  <Glyph {...p}>
    <path
      fill="currentColor"
      d="M12 3.4c-5.2 0-9.4 3.4-9.4 7.7 0 2.4 1.3 4.6 3.4 6-.2 1.1-.8 2.2-1.8 3 2.1.2 3.9-.5 5.1-1.5.9.2 1.8.3 2.7.3 5.2 0 9.4-3.5 9.4-7.8S17.2 3.4 12 3.4Z"
    />
  </Glyph>
)
