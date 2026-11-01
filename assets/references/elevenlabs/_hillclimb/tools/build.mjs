// params/<id>.json + groups.json -> components/labs/streaks/recreations.ts
//
//   node tools/build.mjs
//
// Fills every key from STREAK_DEFAULTS, clamps numbers to their ranges, and
// keeps the groups.json order.
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const REPO = "/Users/nafis/Documents/personal/nafisazizir.com"
const { STREAK_PARAMS, STREAK_DEFAULTS } = await import(`${REPO}/components/labs/streaks/presets.ts`)
const KEYS = ["stops", ...Object.keys(STREAK_DEFAULTS)]
const groups = JSON.parse(fs.readFileSync(path.join(ROOT, "groups.json"), "utf8"))
// An independent critic's grade, when there is one, outranks the climber's
// own fidelity: notes/critic-final-*.json = {id: {grade, fixes[]}}.
const critic = Object.assign({}, ...fs.readdirSync(path.join(ROOT, "notes"))
  .filter((f) => /^critic-final-\w+\.json$/.test(f))
  .map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, "notes", f), "utf8"))))
const sentence = (t) => { t = t.trim().replace(/[.;]+$/, ""); return t[0].toUpperCase() + t.slice(1) + "." }
const missing = []
const items = groups.flatMap((g) => {
  const f = path.join(ROOT, "params", `${g.id}.json`)
  if (!fs.existsSync(f)) { missing.push(g.id); return [] }
  const r = JSON.parse(fs.readFileSync(f, "utf8"))
  const p = { ...STREAK_DEFAULTS, ...r.params }
  for (const s of STREAK_PARAMS) p[s.key] = Math.min(s.max, Math.max(s.min, +p[s.key]))
  const params = Object.fromEntries(KEYS.map((k) => [k, p[k]]))
  return [{ id: g.id, name: g.name, ref: g.primary, variants: g.variants, aspect: +(g.width / g.height).toFixed(4), fidelity: critic[g.id]?.grade ?? r.fidelity, gaps: critic[g.id] ? critic[g.id].fixes.map(sentence).join(" ") : r.gaps || "", params }]
})
const ts = `// Generated from the reference picks (assets/references/elevenlabs/picks.json):
// one entry per de-duplicated group, with the streak params that best recreate
// its primary image. Shown side by side at /labs/streaks/references.
import type { StreakParams } from "./presets"

export interface Recreation {
  id: string
  name: string
  /** Primary reference, relative to assets/references/elevenlabs. */
  ref: string
  /** Crops, re-exports and flips of the same art. */
  variants: string[]
  /** Width / height of the reference. */
  aspect: number
  /** 5 = could pass for the reference, 1 = only the palette matches. */
  fidelity: number
  /** What the shader can't reproduce here. */
  gaps: string
  params: StreakParams
}

export const RECREATIONS: Recreation[] = ${JSON.stringify(items, null, 2)}
`
fs.writeFileSync(`${REPO}/components/labs/streaks/recreations.ts`, ts)
console.log(`wrote ${items.length}/${groups.length}; missing: ${missing.join(", ") || "none"}`)
