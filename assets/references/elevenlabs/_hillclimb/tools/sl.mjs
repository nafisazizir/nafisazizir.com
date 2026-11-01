// Streak lab CLI. Needs the server running (node tools/server.mjs).
//
// Every <params> argument is a JSON file holding either raw StreakParams or
// {"id", "params": {...}} (the params/<id>.json shape). --ref takes a group id
// from groups.json (which also brings its text/UI mask) or an image path
// relative to assets/references/elevenlabs; it defaults to the file's "id".
//
//   render <params> <out-prefix> [--ref id] [--width 640] [--crop x,y,w,h] [--diff]
//       Writes <out-prefix>.png and <out-prefix>-compare.png (ref | ours [| diff])
//       and prints the metric. --crop takes fractions of the frame and renders
//       at full resolution for that region (for judging fine detail).
//   score [ids...] [--dir params]     Metric table for params/<id>.json.
//   sheet [ids...] [--out out/sheet.png] [--dir params] [--cell 300] [--cols 2]
//   tune <params> [--ref id] --keys a,b,stops [--iters 120] [--sigma 0.08] [--out f]
//       (1+4)-ES on the metric score. Writes the best params (same file shape).
//
// Metric (lower is better): score = coarse + 0.5·mid + 0.5·pal + 4·bands +
// 4·sharp + orient/4 + 10·coh. coarse/mid = mean ΔE on 12- and 40-wide grids
// (layout), pal = sliced Wasserstein in Lab (palette, ignores placement),
// bands = log ratio of band-pass energies at 5 scales and sharp = log ratio
// of gradient percentiles (softness/sharpness), orient = streak-angle error in
// degrees over a 4×4 grid, coh = how streaky (anisotropic) each cell is.
import fs from "node:fs"
import path from "node:path"

const HERE = path.dirname(new URL(import.meta.url).pathname)
const ROOT = path.resolve(HERE, "..")
const PORT = +(process.env.SL_PORT || 8420)
const groups = JSON.parse(fs.readFileSync(path.join(ROOT, "groups.json"), "utf8"))
const G = Object.fromEntries(groups.map((g) => [g.id, g]))
const REPO = "/Users/nafis/Documents/personal/nafisazizir.com"
const { STREAK_PARAMS } = await import(`${process.env.SL_SRC || `${REPO}/components/labs/streaks`}/presets.ts`)

const argv = process.argv.slice(2)
const cmd = argv.shift()
const flags = {}, pos = []
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) {
    const k = argv[i].slice(2)
    if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) flags[k] = argv[++i]
    else flags[k] = true
  } else pos.push(argv[i])
}

async function job(j) {
  const r = await fetch(`http://127.0.0.1:${PORT}/api/job`, { method: "POST", body: JSON.stringify(j) })
  const o = await r.json()
  if (o.error) throw new Error(o.error)
  return o
}
const readParams = (f) => {
  const o = JSON.parse(fs.readFileSync(f, "utf8"))
  return o.params ? o : { params: o }
}
function refOf(spec, fallbackId) {
  const s = spec || fallbackId
  if (!s) return {}
  if (G[s]) return { ref: G[s].primary, mask: G[s].mask || [] }
  return { ref: s, mask: [] }
}
const save = (dataUrl, f) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.from(dataUrl.split(",")[1], "base64")); return f }
const fmt = (m) => m ? `score ${m.score.toFixed(2)} | coarse ${m.coarse} mid ${m.mid} pal ${m.pal} bands ${m.bands} sharp ${m.sharp} orient ${m.orient} coh ${m.coh}` : ""
const ids = () => (pos.length ? pos : groups.map((g) => g.id))
const dir = path.resolve(flags.dir || path.join(ROOT, "params"))

if (cmd === "render") {
  const [pf, prefix] = pos
  const p = readParams(pf)
  const crop = flags.crop ? flags.crop.split(",").map(Number) : undefined
  const o = await job({ kind: "render", params: p.params, ...refOf(flags.ref, p.id), width: +(flags.width || 640), crop, diff: !!flags.diff, samples: flags.samples ? +flags.samples : undefined })
  console.log(save(o.render, `${prefix}.png`))
  if (o.compare) console.log(save(o.compare, `${prefix}-compare.png`))
  if (o.clamped?.length) console.log("clamped:", o.clamped.join(", "))
  if (o.metric) console.log(fmt(o.metric))
  if (o.metric && flags.verbose) console.log("bands ref", o.metric.bandsRef, "ours", o.metric.bandsOurs)
} else if (cmd === "score") {
  const rows = await Promise.all(ids().map(async (id) => {
    const f = path.join(dir, `${id}.json`)
    if (!fs.existsSync(f)) return { id, missing: true }
    const p = readParams(f)
    const o = await job({ kind: "score", params: p.params, ...refOf(id) })
    return { id, fid: p.fidelity, ...o.metric }
  }))
  const cols = ["score", "coarse", "mid", "pal", "bands", "sharp", "orient", "coh"]
  console.log(["id".padEnd(20), "fid", ...cols.map((c) => c.padStart(7))].join(" "))
  for (const r of rows) {
    if (r.missing) { console.log(r.id.padEnd(20), "missing"); continue }
    console.log([r.id.padEnd(20), String(r.fid ?? "-").padStart(3), ...cols.map((c) => String(r[c]).padStart(7))].join(" "))
  }
  const ok = rows.filter((r) => !r.missing)
  console.log("mean score", (ok.reduce((s, r) => s + r.score, 0) / ok.length).toFixed(2))
  if (flags.json) fs.writeFileSync(flags.json, JSON.stringify(rows, null, 1))
} else if (cmd === "sheet") {
  const items = ids().map((id) => {
    const p = readParams(path.join(dir, `${id}.json`))
    return { id, label: `${id}  fid ${p.fidelity ?? "-"}`, params: p.params, ref: G[id].primary, mask: G[id].mask || [] }
  })
  const o = await job({ kind: "sheet", items, cellWidth: +(flags.cell || 300), cols: +(flags.cols || 2), showMask: !!flags.mask })
  console.log(save(o.sheet, flags.out || path.join(ROOT, "out", "sheet.png")))
} else if (cmd === "tune") {
  const pf = pos[0]
  const p = readParams(pf)
  const R = refOf(flags.ref, p.id)
  const keys = String(flags.keys || "").split(",").filter(Boolean)
  const specs = Object.fromEntries(STREAK_PARAMS.map((s) => [s.key, s]))
  for (const k of keys) if (!["stops", "accent", "accent2", "heroColor", "detailColor"].includes(k) && !specs[k]) throw new Error(`unknown key ${k}`)
  const iters = +(flags.iters || 120), lambda = 4
  let sigma = +(flags.sigma || 0.08)
  const sw = +(flags.width || 240)
  const evalP = async (params) => (await job({ kind: "score", params, ...R, scoreWidth: sw, samples: 32 })).metric.score
  let best = { ...p.params }, bestS = await evalP(best)
  const start = bestS
  const gauss = () => Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random())
  const mutate = (src) => {
    const q = { ...src }
    // Perturb a random subset so moves stay local in high dimensions.
    const pickN = Math.max(1, Math.round(keys.length * 0.4))
    const chosen = [...keys].sort(() => Math.random() - 0.5).slice(0, pickN)
    for (const k of chosen) {
      if (k === "stops") { q.stops = src.stops.map((h) => jitterHex(h, sigma)); continue }
      if (["accent", "accent2", "heroColor", "detailColor"].includes(k)) { q[k] = jitterHex(src[k] || "#ffffff", sigma); continue }
      const s = specs[k]
      if (s.key === "radial") continue
      let v = +q[k] + gauss() * sigma * (s.max - s.min)
      if (s.key === "seed") v = Math.round(Math.random() * 100)
      q[k] = Math.min(s.max, Math.max(s.min, v))
    }
    return q
  }
  for (let it = 0; it < iters; it++) {
    const cands = Array.from({ length: lambda }, () => mutate(best))
    const scores = await Promise.all(cands.map(evalP))
    const i = scores.indexOf(Math.min(...scores))
    if (scores[i] < bestS) { best = cands[i]; bestS = scores[i]; sigma *= 1.15 } else sigma *= 0.93
    sigma = Math.min(0.3, Math.max(0.005, sigma))
    if (it % 10 === 0 || it === iters - 1) console.log(`it ${it} best ${bestS.toFixed(2)} sigma ${sigma.toFixed(3)}`)
  }
  const out = flags.out || pf.replace(/\.json$/, ".tuned.json")
  const round = (v) => typeof v === "number" ? Math.round(v * 10000) / 10000 : v
  fs.writeFileSync(out, JSON.stringify({ ...p, params: Object.fromEntries(Object.entries(best).map(([k, v]) => [k, round(v)])) }, null, 1))
  console.log(`start ${start.toFixed(2)} -> ${bestS.toFixed(2)}  wrote ${out}`)
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).join("\n"))
}

function jitterHex(hex, sigma) {
  const v = parseInt(hex.slice(1), 16)
  const c = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((x) => Math.min(255, Math.max(0, Math.round(x + (Math.random() * 2 - 1) * sigma * 160))))
  return "#" + c.map((x) => x.toString(16).padStart(2, "0")).join("")
}
