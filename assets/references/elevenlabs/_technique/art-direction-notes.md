# ElevenLabs brand art: findings from non-marketing sources

## Who made it
- **basement.studio** (Buenos Aires) did the 2025 visual rebrand: "The logotype stayed, but everything else was rebuilt. Color, motion, composition."
  - Case study: https://basement.studio/showcase/elevenlabs-visual-rebrand-for-the-voice-of-ai (also available as plain markdown at `.md`)
  - Their description: "Inspired by Chladni patterns, our team created a suite of sound-wave visuals **layered with blur**, designed to feel **atmospheric and sensorial**. We even built a **custom generator** that transformed complex math into a simple tool, letting ElevenLabs remix patterns and imagery on demand."
  - The case-study images (Sanity CDN, 2880x1620 PNGs) show the two halves of the system:
    1. soft cloud gradients (pink / periwinkle / coral, red / orange / blue) with grain, and
    2. thin Chladni / wave line patterns on off-white, often laid over the gradients (billboards, Summit 25 badges and socials).
  - The palette board is black, off-whites, warm greys, plus one pink-to-lilac-to-blue gradient swatch. The neutrals carry the brand, and the gradient is the accent.
- ElevenLabs also has an in-house Brand Design team, which handles campaigns and brand guidelines (careers listing "brand design"). The current YouTube and product-launch title cards look like that team's ongoing output on top of the Basement system.
- I found nothing on Behance, Dribbble, Brand New or It's Nice That. One portfolio piece, https://carolineeiznekcm.myportfolio.com/eleven ("Making Waves"), looks like a spec project and is not the official identity, so I did not keep anything from it.

## Official brand / press pages
- https://elevenlabs.io/brand and https://elevenlabs.io/press. The only download is a logo zip (`elevenlabs-logos.zip`, 4 files: black/white PNG+SVG). It has no background art and no guidelines PDF. I did not unzip it; listing it was enough.
- `/media-kit`, `/brand-assets` and `/brand-guidelines` all return 404.
- The brand page links `em4cn4nlbxm-v4-cover.png`, a grainy red/green diagonal streak with a "V4" pill. This is the same art as the "Eleven v4" YouTube thumbnail.
- The default OG (`https://elevenlabs.io/cover.png`) is the Chladni line pattern on off-white with the logotype.

## Technique notes (useful for recreating)
- **Film grain**: the site lays a 256x256 RGBA noise tile over the art with these settings:
  `mix-blend-mode: overlay; opacity: 0.5; background-size: calc(256px * 0.225)` (`128px * 0.225` at 2x DPR); `image-rendering: pixelated`.
  - Tile: https://eleven-public-cdn.elevenlabs.io/marketing_website/_next/static/media/noise.24b8225d.png (AVIF variant `noise@20aq.289c1f1d.avif`). A copy is saved as `keep/brand-kit_grain-noise-tile.png`.
  - Because of the 0.225 scale, the grain is very fine (about 58px tile, pixelated). It is not a coarse photographic grain.
- **Motion blur / streaks**: the YouTube banner, the LinkedIn cover and video covers, Architect, Eleven v4 and Dictation all use directional motion blur over photos (sky, clouds, foliage) or colour fields. Typical palettes:
  - blue on white sky
  - sage green / teal on cream
  - red / green
  - slate / ochre
- **Hazy colour fields**: most 2025-26 launch cards are full-bleed blurred colour fields with visible grain. Recurring families:
  - red/orange/coral: Ads Engine, Avatars, Templates, Flows, Creative Platform
  - deep blue/cyan/green: ElevenAgents cards
  - grey/teal/sand: Scribe v2
  - smoky brown: LTX, Music v2
  - magenta/violet: ElevenMusic
- **Older style (2024 to early 2025)**: periwinkle-to-orange linear gradients with a cut-out canyon/rock photo. Examples: Agent Workflows (old), Eleven v3 alpha API, IVR, Music API. These are tagged `2024style` in the filenames. They are smoother and less grainy than the current look.
- **Title-card layout**:
  - Centered thin title in white, or bottom-left two-line title with the sub-brand lockup top-left ("ElevenAgents", "ElevenCreative", "ElevenLabs").
  - Version tags like "v2" / "V4" sit in an outlined pill.
  - A second template is an off-white split layout: black title on the left, gradient/pattern art panel on the right (Changelog, v3 Conversational, Deploy Agents as Code).
- **Typefaces** (from the brand page's font files):
  - **KMR Waldenburg** for display and the logotype feel. Cuts: Buch, Normal, Fett, FettHalbschmal.
  - **Inter** for body.
  - **Geist Mono** / JetBrains Mono for mono.
  - Titles on the cards are Waldenburg at a light/book weight.
- An unofficial third-party extract (https://www.shadcn.io/design/elevenlabs/raw) lists pastel orb colours: mint #a7e5d3, peach #f4c5a8, lavender #c8b8e0, sky #a8c8e8, rose #e8b8c4. These match the docs OG orbs.

## Sources tried
- **YouTube** (@elevenlabs; the handle is not @elevenlabsio, which 404s): 278 video thumbnails triaged, plus the channel banner. The banner is uncropped at 2560x1440 (`=w2560-fcrop64=1,00000000ffffffff-...`). Thumbnails come from `i.ytimg.com/vi/<id>/maxresdefault.jpg`. The older pages of the video list came through the innertube `browse` continuation.
- **LinkedIn** (`/company/elevenlabsio`, public HTML): cover image plus post video covers. The URLs are signed and may expire.
- **Docs** (elevenlabs.io/docs, help.elevenlabs.io): the Fern OG image shows pastel orbs.
- **GitHub**: the org avatar is the logo. Only `elevenlabs-mcp` has a custom social preview (black, green pixel "MCP"), and it doesn't match the target look, so I skipped it.
- Product Hunt returned 403, so I skipped it. Instagram is a login wall, so I skipped it. `elevenlabs.io/summit` is a 404. The `/events` OG image is a stage photo, which I skipped.
