// Blind A/B sheets: for each group, [reference | X | Y] where X/Y are two param
// sets in random order. The key is written separately so judges can't see it.
//
//   node tools/ab.mjs <dirA> <dirB> [--width 420]   → out/ab/<id>.png, notes/ab-key.json
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const [dirA, dirB] = process.argv.slice(2)
const wi = process.argv.indexOf("--width")
const W = wi > 0 ? +process.argv[wi + 1] : 420
const groups = JSON.parse(fs.readFileSync(path.join(ROOT, "groups.json"), "utf8"))
fs.mkdirSync(path.join(ROOT, "out/ab"), { recursive: true })
const key = {}
for (const g of groups) {
  const a = path.join(dirA, `${g.id}.json`), b = path.join(dirB, `${g.id}.json`)
  if (!fs.existsSync(a) || !fs.existsSync(b)) continue
  if (fs.readFileSync(a, "utf8") === fs.readFileSync(b, "utf8")) { key[g.id] = { same: true }; continue }
  const flip = Math.random() < 0.5
  const [x, y] = flip ? [b, a] : [a, b]
  key[g.id] = { X: flip ? "B" : "A", Y: flip ? "A" : "B" }
  const tmp = path.join(ROOT, "out/ab/tmp")
  const run = (f, p) => execFileSync("node", [path.join(ROOT, "tools/sl.mjs"), "render", f, p, "--ref", g.id, "--width", String(W)], { cwd: ROOT })
  run(x, `${tmp}-x`); run(y, `${tmp}-y`)
  // compare = ref | render; take the ref from x's compare and both renders.
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${tmp}-x-compare.png`, "-i", `${tmp}-y.png`, "-filter_complex",
    `[1:v]format=rgb24,pad=iw+6:ih:6:0:black[b];[0:v]format=rgb24[a];[a][b]hstack=inputs=2`, "-frames:v", "1", path.join(ROOT, "out/ab", `${g.id}.png`)])
}
for (const f of fs.readdirSync(path.join(ROOT, "out/ab"))) if (f.startsWith("tmp")) fs.rmSync(path.join(ROOT, "out/ab", f))
fs.writeFileSync(path.join(ROOT, "notes/ab-key.json"), JSON.stringify({ A: dirA, B: dirB, key }, null, 1))
console.log(`wrote ${Object.values(key).filter((k) => !k.same).length} sheets; ${Object.values(key).filter((k) => k.same).length} identical`)
