# ElevenLabs background-art references

Local-only exploration library (this folder ignores itself via `.gitignore`). Collected 2026-10-27.

Open `index.html` in a browser for a filterable gallery (by category and source; click to enlarge).

## Layout

- `gradient-titled/`: haze/gradient with a title, logo or UI chip on it (launch cards, blog covers)
- `gradient-clean/`: abstract colour fields, no text
- `streak/`: directional motion-blur / light-streak abstracts
- `photo-blur/`: blurred or long-exposure photography (skies, clouds, figures)
- `pattern/`: grids, meshes, squircle frames, Chladni/wave lines over gradient
- `orb/`: spheres, discs, blob gradients
- `_technique/`: grain noise tiles + `art-direction-notes.md` (who made it, how it's built)
- `manifest.json`: per file: source, original URL / post / page, palette, note, dimensions

Filename prefix = source: `site_` (elevenlabs.io CMS), `video_` (frames from site videos),
`x_` / `x_dev_` / `x_ec_` (@ElevenLabs, @ElevenLabsDevs, ElevenCreative), `yt-` (YouTube),
`linkedin_`, `agency_` (basement.studio case study), `brand-kit_`, `docs_`.

## Key notes

- Identity: 2025 visual rebrand by basement.studio, "inspired by Chladni patterns … sound-wave
  visuals layered with blur". Two halves: soft grainy cloud gradients + thin line patterns on off-white.
- Grain on the site: absolutely positioned div over the image, tiled `noise-tile-256.png`
  (256px, 128px at 2x, scaled by `--noise-scale`), `mix-blend-mode: overlay`, `opacity: .5`,
  `image-rendering: pixelated`; optional `noise-drift` jitter animation (0.2s `step-end`, random translate3d).
- Type: KMR Waldenburg (display), Inter (body), Geist Mono.

## Picks (taste log)

`python3 -I serve.py` → http://127.0.0.1:8411. On each card: ♥ pick / ✕ avoid, then tag what you
like about it (palette, shape, motion, texture, light, composition) and add a short note. Every change saves to
`picks.json`. The lightbox has keys: ← → to browse, L to pick, X to avoid, 1–6 to toggle tags.
Opened as file://, picks stay in localStorage until you use "export picks.json".
`picks.json` is the brief for /labs/streaks iterations: ♥ = targets, ✕ = anti-references.
