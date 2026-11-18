// Layer (grain / noise / fractal) fitting against the references' texture.
// Needs the server (node tools/server.mjs). See PLAN.md "Layers round".
//
//   measure [ids...]               ref vs ours (no layers) texture table
//   show <id> [--layers f.json]    out/layers/<id>.png: ref crops | ours, 1:1
//   fit [ids...] [--iters 160]     search a layer stack per id → layers/<id>.json
//
// Texture = robust amplitude of 4 band-pass levels of luma at native
// resolution (σ .7/1.5/3/6 px) on the flatter half of 3 smooth, unmasked
// crops, plus the colour share of the finest band and its tone response.
import fs from "node:fs"
import path from "node:path"

const HERE = path.dirname(new URL(import.meta.url).pathname)
const ROOT = path.resolve(HERE, "..")
const PORT = +(process.env.SL_PORT || 8420)
const groups = JSON.parse(fs.readFileSync(path.join(ROOT, "groups.json"), "utf8"))
const G = Object.fromEntries(groups.map((g) => [g.id, g]))
const OUT = path.join(ROOT, "out", "layers")
const LDIR = path.join(ROOT, "layers")
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(LDIR, { recursive: true })

const argv = process.argv.slice(2), cmd = argv.shift(), flags = {}, pos = []
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) { const k = argv[i].slice(2); flags[k] = i + 1 < argv.length && !argv[i + 1].startsWith("--") ? argv[++i] : true }
  else pos.push(argv[i])
}
const ids = pos.length ? pos : groups.map((g) => g.id)

export async function job(j) {
  const r = await fetch(`http://127.0.0.1:${PORT}/api/job`, { method: "POST", body: JSON.stringify(j) })
  const o = await r.json(); if (o.error) throw new Error(o.error); return o
}
export const paramsOf = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, "params", `${id}.json`), "utf8")).params
const codecOf = (id) => {
  if (flags.codec === "off") return undefined
  const ext = path.extname(G[id].primary).toLowerCase()
  return ext === ".webp" ? { type: "image/webp", q: +(flags.q || 0.85) } : ext === ".jpg" || ext === ".jpeg" ? { type: "image/jpeg", q: +(flags.q || 0.85) } : undefined
}
export const texJob = (id, candidates, extra = {}) =>
  job({ kind: "texture", ref: G[id].primary, mask: G[id].mask || [], params: paramsOf(id), candidates, codec: codecOf(id), ...extra })
const f2 = (v) => v.toFixed(2).padStart(6)
const savePng = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64"))
const layersFile = (id) => path.join(LDIR, `${id}.json`)
const loadLayers = (id) => (fs.existsSync(layersFile(id)) ? JSON.parse(fs.readFileSync(layersFile(id), "utf8")).layers : [])

if (cmd === "measure") {
  console.log("id                   fmt     size        ref bands (.7/1.5/3/6)        ours bands                   refC  ourC  dist")
  const rows = []
  for (const id of ids) {
    const o = await texJob(id, [flags.fitted ? loadLayers(id) : []])
    const c = o.cands[0]
    rows.push({ id, ref: o.ref, ours: c.stats, dist: c.dist })
    console.log(`${id.padEnd(20)} ${path.extname(G[id].primary).slice(1).padEnd(5)} ${(o.size.join("x")).padEnd(10)} ${o.ref.bands.map(f2).join("")}   ${c.stats.bands.map(f2).join("")}  ${f2(o.ref.chroma)}${f2(c.stats.chroma)} ${f2(c.dist.score)}`)
  }
  fs.writeFileSync(path.join(ROOT, "notes", `layers-measure${flags.fitted ? "-fitted" : ""}.json`), JSON.stringify(rows, null, 1))
  console.log("mean dist", (rows.reduce((s, r) => s + r.dist.score, 0) / rows.length).toFixed(3))
} else if (cmd === "show") {
  for (const id of ids) {
    const L = flags.layers ? JSON.parse(fs.readFileSync(flags.layers, "utf8")).layers : loadLayers(id)
    const o = await texJob(id, [L], { image: true })
    savePng(path.join(OUT, `${id}${flags.suffix ? "-" + flags.suffix : ""}.png`), o.image)
    console.log(id, JSON.stringify(o.cands[0].dist))
  }
}

// ---- fit -------------------------------------------------------------------
// Per id: for each blend mode, a coarse grid over amount × size, then a
// (1+8)-ES over amount (log), midtones, size (log), colour. Best mode wins.
// A layer is kept only if it beats the clean render by a clear margin.
const SPACE = {
  amount: [0.003, 1, "log"], size: [0.5, 4, "log"], mids: [0, 1], colour: [0, 1],
}
const toVal = (k, u) => { const [a, b, log] = SPACE[k]; u = Math.min(1, Math.max(0, u)); return log ? a * Math.pow(b / a, u) : a + (b - a) * u }
const grainLayer = (blend, u) => ({
  uid: "fit", type: "grain", enabled: true,
  params: { blend, animate: 1, seed: 0, ...Object.fromEntries(Object.keys(SPACE).map((k) => [k, +toVal(k, u[k]).toFixed(k === "amount" ? 4 : 3)])) },
})
let rng = 12345
const rand = () => ((rng = (rng * 1103515245 + 12345) % 2147483648) / 2147483648)
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand())

const CLEAN_BELOW = 0.3
async function fitOne(id) {
  const iters = +(flags.iters || 14)
  const t0 = Date.now()
  const first = await texJob(id, [[]])
  const clean = first.cands[0].dist
  // A reference without visible grain (finest band under ~1/3 of an 8-bit
  // step) stays clean, whatever a faint layer does to the score.
  if (first.ref.bands[0] < CLEAN_BELOW) {
    fs.writeFileSync(layersFile(id), JSON.stringify({ id, dist: clean, clean, layers: [], note: "clean reference" }, null, 1) + "\n")
    console.log(`${id.padEnd(20)} clean ${clean.score.toFixed(2).padStart(6)}  clean reference, no layer`)
    return { id, clean, fitted: clean, layers: [] }
  }
  const evalU = async (blend, us) => (await texJob(id, us.map((u) => [grainLayer(blend, u)]))).cands.map((c) => c.dist)
  let best = null
  for (const blend of [0, 1, 2]) {
    const grid = []
    for (let a = 0; a < 8; a++) for (const s of [0.1, 0.45, 0.8]) grid.push({ amount: (a + 0.5) / 8, size: s, mids: 0.4, colour: 0.1 })
    const gd = await evalU(blend, grid)
    let bi = gd.reduce((bi, d, i) => (d.score < gd[bi].score ? i : bi), 0)
    let cur = { u: grid[bi], d: gd[bi] }, sigma = 0.12
    for (let g = 0; g < iters; g++) {
      const kids = Array.from({ length: 8 }, () => Object.fromEntries(Object.entries(cur.u).map(([k, v]) => [k, Math.min(1, Math.max(0, v + sigma * gauss()))])))
      const kd = await evalU(blend, kids)
      const ki = kd.reduce((bi, d, i) => (d.score < kd[bi].score ? i : bi), 0)
      if (kd[ki].score < cur.d.score) { cur = { u: kids[ki], d: kd[ki] }; sigma = Math.min(0.25, sigma * 1.3) } else sigma *= 0.75
      if (sigma < 0.01) break
    }
    if (!best || cur.d.score < best.d.score) best = { ...cur, blend }
  }
  const keep = best.d.score < clean.score * 0.85 && clean.score - best.d.score > 0.3
  const layers = keep ? [grainLayer(best.blend, best.u)] : []
  const res = { id, clean, fitted: keep ? best.d : clean, layers, secs: Math.round((Date.now() - t0) / 1000) }
  fs.writeFileSync(layersFile(id), JSON.stringify({ id, dist: res.fitted, clean, layers }, null, 1) + "\n")
  const p = layers[0]?.params
  console.log(`${id.padEnd(20)} clean ${clean.score.toFixed(2).padStart(6)} → ${res.fitted.score.toFixed(2).padStart(6)}  ${p ? `${["soft", "overlay", "add"][p.blend].padEnd(7)} amt ${p.amount} size ${p.size} mids ${p.mids} col ${p.colour}` : "no layer"}  (${res.secs}s)`)
  return res
}

if (cmd === "fit") {
  const queue = [...ids], results = []
  await Promise.all(Array.from({ length: +(flags.par || 6) }, async () => {
    while (queue.length) { const id = queue.shift(); try { results.push(await fitOne(id)) } catch (e) { console.log(id, "ERR", e.message) } }
  }))
  const m = (k) => (results.reduce((s, r) => s + r[k].score, 0) / results.length).toFixed(3)
  console.log(`mean texture dist: clean ${m("clean")} → fitted ${m("fitted")}`)
}
