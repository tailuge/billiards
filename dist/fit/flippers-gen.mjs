#!/usr/bin/env node
// flippers-gen.mjs — regenerate dist/fit/flippers.html from sweep evidence.
//
// Mines every corners/*/sweep-results.json for per-shot RMSE deltas and
// scores each shot on:
//   - instability: how often small constant changes move its fit RMSE a lot
//   - dominance:   the size of its worst swings (how much it dominates runs)
// Shots that swing in BOTH directions (knife-edge regime flippers) or
// produce extreme outliers are candidates for removal from the panels.
//
// Usage: node flippers-gen.mjs [--min-swing CM] (default 2)

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const dir = path.dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
const minSwing =
  argv.includes("--min-swing") ? Number(argv[argv.indexOf("--min-swing") + 1]) : 2

// --- Gather per-shot evidence -------------------------------------------

const shotsJson = JSON.parse(fs.readFileSync(path.join(dir, "shots.json"), "utf8"))
const indexOfId = new Map(shotsJson.map((e, i) => [e.id, i]))

// Champion-config RMSE where saved (adopt-heldout4 --save-points), else null.
const champFits = new Map()
for (const f of ["base", "muw0.17_ee0.865"]) {
  const p = path.join(dir, "corners", "adopt-heldout4", `${f}.json`)
  if (!fs.existsSync(p)) continue
  for (const e of JSON.parse(fs.readFileSync(p, "utf8"))) {
    if (e.fit?.rmseAfterCm != null) champFits.set(`${f}:${e.id}`, e.fit.rmseAfterCm)
  }
}

const cornersDir = path.join(dir, "corners")
const perShot = new Map() // id -> {points:[], maxAbs, min, max, ...}
const bump = (id, delta, src) => {
  const rec = perShot.get(id) ?? {
    id,
    points: [],
    maxAbs: 0,
    min: Infinity,
    max: -Infinity,
    worst: null,
  }
  const abs = Math.abs(delta)
  rec.points.push({ d: delta, src })
  if (abs > rec.maxAbs) {
    rec.maxAbs = abs
    rec.worst = src
  }
  rec.min = Math.min(rec.min, delta)
  rec.max = Math.max(rec.max, delta)
  perShot.set(id, rec)
}

const runs = fs
  .readdirSync(cornersDir)
  .filter((d) => fs.existsSync(path.join(cornersDir, d, "sweep-results.json")))
for (const run of runs) {
  const r = JSON.parse(
    fs.readFileSync(path.join(cornersDir, run, "sweep-results.json"), "utf8")
  )
  if (r.base?.perShotCm) {
    // base vs pure defaults is itself evidence only when defaults differ
    // from the run's own reference — skip; we want constant-change deltas.
  }
  for (const pt of r.points ?? []) {
    for (const [idStr, d] of Object.entries(pt.perShot ?? {})) {
      bump(Number(idStr), d, `${run}/${pt.label}`)
    }
  }
}

// --- Score ---------------------------------------------------------------

const rows = []
for (const rec of perShot.values()) {
  const ds = rec.points.map((p) => p.d)
  const n = ds.length
  const unstable = ds.filter((d) => Math.abs(d) >= minSwing).length
  const big = ds.filter((d) => Math.abs(d) >= 5).length
  const extreme = ds.filter((d) => Math.abs(d) >= 10).length
  const mean = ds.reduce((s, x) => s + x, 0) / n
  const sd = Math.sqrt(ds.reduce((s, x) => s + (x - mean) ** 2, 0) / n)
  const bidirectional = rec.max >= 5 && rec.min <= -5
  // Calibrated on the 2026-08-26 evidence pool: the pool splits cleanly into
  // a quiet majority (median worst-swing ~7 cm) and a breakout tier
  // (worst swings 16–55 cm). These rules select the breakout tier.
  const knifeEdge = bidirectional && big >= 4
  const dominant = extreme >= 3 || rec.maxAbs >= 20
  rows.push({
    id: rec.id,
    n,
    unstable,
    big,
    extreme,
    maxAbs: rec.maxAbs,
    min: rec.min,
    max: rec.max,
    sd,
    worst: rec.worst,
    knifeEdge,
    dominant,
    championCm: champFits.get(`muw0.17_ee0.865:${rec.id}`) ?? null,
    defaultCm: champFits.get(`base:${rec.id}`) ?? null,
  })
}
rows.sort((a, b) => b.extreme - a.extreme || b.big - a.big || b.maxAbs - a.maxAbs)

const removeList = rows.filter((r) => r.knifeEdge || r.dominant)
const watchList = rows.filter(
  (r) => !removeList.includes(r) && (r.extreme >= 1 || r.big >= 3 || r.bidirectional)
)
const alreadyRemoved = new Set([25, 36, 5]) // excluded from inputs 2026-08-24

// --- Render ---------------------------------------------------------------

const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
const link = (r) => {
  const i = indexOfId.get(r.id)
  return i === undefined ? esc(r.id) : `<a href="viewer.html?index=${i}">${esc(r.id)}</a>`
}
const cm = (v) => (v == null ? "—" : v.toFixed(1))
const signed = (v) => (v >= 0 ? "+" : "") + v.toFixed(1)
const tag = (label, colour) =>
  `<span class="tag" style="background:${colour}">${label}</span>`

const rowHtml = (r, verdict) => `
      <tr>
        <td>${link(r)}${alreadyRemoved.has(r.id) ? tag("removed", "#d4edda") : ""}</td>
        <td>${cm(r.championCm)} / ${cm(r.defaultCm)}</td>
        <td class="num">${signed(r.min)} … ${signed(r.max)}</td>
        <td class="num">${r.maxAbs.toFixed(1)}</td>
        <td class="num">${r.unstable}/${r.n}</td>
        <td class="num">${r.big} / ${r.extreme}</td>
        <td class="num">${r.sd.toFixed(1)}</td>
        <td>${esc(r.worst ?? "")}</td>
        <td>${verdict}</td>
      </tr>`

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Knife-edge &amp; dominant shots</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 78em; margin: 2em auto; padding: 0 1em; }
      a { color: #0366d6; }
      table { border-collapse: collapse; margin: 1em 0; font-size: 0.9em; }
      th, td { border: 1px solid #ccc; padding: 0.3em 0.7em; text-align: left; }
      th { background: #f4f4f4; }
      td.num { text-align: right; font-variant-numeric: tabular-nums; }
      .tag { font-size: 0.8em; padding: 0.1em 0.5em; border-radius: 0.5em; background: #eee; white-space: nowrap; }
      p, li { color: #333; }
      h2 { margin-top: 2em; }
    </style>
  </head>
  <body>
    <h1>Knife-edge &amp; dominant shots</h1>
    <p>
      Generated ${new Date().toISOString().slice(0, 10)} by <code>flippers-gen.mjs</code>
      from <b>${runs.length}</b> sweep runs in <code>corners/*/sweep-results.json</code>
      (${rows.length} distinct shots, ${rows.reduce((s, r) => s + r.n, 0)} per-shot
      measurements). A &ldquo;measurement&rdquo; is one shot&rsquo;s ΔRMSE under one
      constants change in one study.
    </p>
    <p>
      <b>Dominant</b>: &ge;3 swings &ge;10 cm or worst swing &ge;20 cm — it blows out
      the tails of parameter studies. <b>Knife-edge</b>: swings in both directions
      (&ge;&plusmn;5 cm, at least four &ge;5 cm) — its fit lands in different trajectory
      regimes depending on constants/seed. Either = removal candidate; both is worst.
      Thresholds calibrated to the breakout tier (quiet majority: median worst-swing
      ~7 cm).
    </p>

    <h2>Removal candidates (${removeList.length})</h2>
    <table>
      <tr><th>shot</th><th>RMSE cm<br>(champ / defaults)</th><th>Δrange (cm)</th><th>worst |Δ|</th><th>unstable &ge;${minSwing}cm</th><th>&ge;5 / &ge;10 cm</th><th>σ</th><th>worst case</th><th>verdict</th></tr>
${removeList
  .map((r) =>
    rowHtml(
      r,
      (r.dominant ? tag("dominant", "#ffd9d9") : "") +
        " " +
        (r.knifeEdge ? tag("knife-edge", "#ffd9d9") : "")
    )
  )
  .join("")}
    </table>

    <h2>Watch list (${watchList.length})</h2>
    <p>Knife-edge <em>or</em> dominant, not both — inspect before deciding.</p>
    <table>
      <tr><th>shot</th><th>RMSE cm<br>(champ / defaults)</th><th>Δrange (cm)</th><th>worst |Δ|</th><th>unstable &ge;${minSwing}cm</th><th>&ge;5 / &ge;10 cm</th><th>σ</th><th>worst case</th><th>verdict</th></tr>
${watchList.map((r) => rowHtml(r, tag(r.bidirectional ? "bidirectional" : "borderline", "#fff3c4"))).join("")}
    </table>

    <p>
      Links pass the array index into <code>shots.json</code>. RMSE columns come from
      the saved <code>corners/adopt-heldout4</code> fits (held-out ids only; — otherwise).
      Triage tips: unmodelled double-kiss/pocket rattle in the recorded track, cue
      params pinned on a bound, or two visually distinct sims with near-equal RMSE.
    </p>
  </body>
</html>
`

fs.writeFileSync(path.join(dir, "flippers.html"), html)
console.log(
  `Wrote flippers.html — ${rows.length} shots scored, ${removeList.length} removal candidates, ${watchList.length} watch-list`
)
