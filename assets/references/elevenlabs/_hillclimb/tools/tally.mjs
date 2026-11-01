// Tally blind A/B judges (notes/judge-*.json + notes/ab-key.json) and write the
// winners into params/. Majority of X/Y votes; "clear" counts 2, "slight" 1;
// a tie goes to the lower metric score.
//
//   node tools/tally.mjs [--apply]
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const { A, B, key } = JSON.parse(fs.readFileSync(path.join(ROOT, "notes/ab-key.json"), "utf8"))
const judges = fs.readdirSync(path.join(ROOT, "notes")).filter((f) => /^judge-\w+\.json$/.test(f))
  .map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, "notes", f), "utf8")))
const scoreOf = (file) => JSON.parse(fs.readFileSync(file, "utf8"))
const sA = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, "notes/score-r4.json"), "utf8")).map((r) => [r.id, r.score]))
const sB = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, "notes/score-r6.json"), "utf8")).map((r) => [r.id, r.score]))
const rows = []
for (const [id, k] of Object.entries(key)) {
  if (k.same) continue
  let a = 0, b = 0
  const why = []
  for (const j of judges) {
    const v = j[id]
    if (!v || v.pick === "tie") continue
    const w = v.margin === "clear" ? 2 : 1
    const side = v.pick === "X" ? k.X : k.Y
    if (side === "A") a += w; else b += w
    why.push(`${side}:${v.margin}`)
  }
  const win = a > b ? "A" : b > a ? "B" : sA[id] <= sB[id] ? "A" : "B"
  rows.push({ id, a, b, win, votes: why.join(" "), mA: sA[id], mB: sB[id] })
}
console.log("id".padEnd(20), "A(r4)", "B(r6)", "win", "metric A/B", "votes")
for (const r of rows) console.log(r.id.padEnd(20), String(r.a).padStart(5), String(r.b).padStart(5), " ", r.win, "  ", r.mA, "/", r.mB, "  ", r.votes)
console.log(`A wins ${rows.filter((r) => r.win === "A").length}, B wins ${rows.filter((r) => r.win === "B").length}`)
fs.writeFileSync(path.join(ROOT, "notes/ab-result.json"), JSON.stringify(rows, null, 1))
if (process.argv.includes("--apply")) {
  for (const r of rows) {
    const src = path.join(ROOT, r.win === "A" ? A : B, `${r.id}.json`)
    fs.copyFileSync(src, path.join(ROOT, "params", `${r.id}.json`))
  }
  console.log("applied winners to params/")
}
