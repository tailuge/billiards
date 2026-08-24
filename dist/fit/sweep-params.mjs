#!/usr/bin/env node
// sweep-params.mjs — orchestrates fit-shots.mjs over a grid of physics-param
// values with process-level parallelism and convergence-gated passes.
//
// Fairness protocol:
// - The default-constants centre is fitted through the exact same pipeline as
//   every sweep point and anchors all comparisons (no stored-RMSE advantage).
// - Every point is fitted in REPEATED PASSES (output of one pass seeds the
//   next) until the aggregate median improves by less than --tolerance cm,
//   or --max-passes is exhausted. "Convergence" here is real improvement,
//   not the Simplex stagnation flag.
//
// File hygiene: shards, per-pass outputs and per-point results live in an OS
// tmp dir and are deleted at exit (--keep-tmp keeps them). Only the small
// sweep-results.json lands in --out-dir. Pass --save-points to also persist
// each point's converged fit file there (and enable --reuse resume).
//
// Usage:
//   node sweep-params.mjs --param mus=0.19|0.21 --param muw=0.19|0.21
//                         --param ee=0.8075|0.8925
//                         [--pin muw=0.18]
//                         [--input sweep.json] [--out-dir corners]
//                         [--workers 4] [--max-evals N] [--ids 1,2]
//                         [--tolerance 0.02] [--max-passes 6]
//                         [--save-points] [--keep-tmp] [--reuse]
//                         [--verbose] [--dry-run]
//
// Param values are "|" separated; the sweep runs the cartesian product
// (2 values per axis = box corners).
//
// --pin holds a constant at a non-default value for the WHOLE experiment
// (centre included), e.g. investigating rho while holding the adopted
// muw=0.18: every point, base first, is fitted under that override.

import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const FIT_SHOTS = path.join(scriptDir, "fit-shots.mjs")

function usage() {
  console.error(`Usage: node sweep-params.mjs --param key=v1|v2 [...] [options]
  --param k=a|b      axis of the sweep; repeat per constant; cartesian product
                     of all axes is evaluated (2 values = box corners)
  --pin k=v[,k=v]    constant override applied to EVERY point incl. the base
                     (hold a parameter fixed while sweeping another)
  --input FILE       shot entries to fit (default: sweep.json next to script)
  --out-dir DIR      directory for sweep-results.json (default: corners/)
  --workers N        concurrent fit-shots processes per pass (default 4)
  --max-evals N      passed through to fit-shots.mjs
  --ids 1,2          restrict to these shot ids
  --tolerance CM     stop a point's passes when median improvement < CM
                     (default 0.02)
  --max-passes N     hard cap on passes per point (default 6)
  --save-points      persist each point's converged fit file into out-dir
                     (also enables --reuse resume across runs)
  --keep-tmp         keep the tmp working dir instead of deleting it
  --reuse            skip points whose saved output already exists
  --verbose          show fit-shots per-shot output
  --dry-run          print the planned commands and exit`)
  process.exit(1)
}

const opts = {
  input: null,
  outDir: null,
  params: [],
  pins: [],
  workers: 4,
  maxEvals: null,
  ids: null,
  tolerance: 0.02,
  maxPasses: 6,
  savePoints: false,
  keepTmp: false,
  reuse: false,
  verbose: false,
  dryRun: false,
}
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === "--param") {
    opts.params.push(argv[++i])
  } else if (a === "--pin") {
    opts.pins.push(argv[++i])
  } else if (a === "--input") {
    opts.input = argv[++i]
  } else if (a === "--out-dir") {
    opts.outDir = argv[++i]
  } else if (a === "--workers") {
    opts.workers = Number.parseInt(argv[++i], 10)
  } else if (a === "--max-evals") {
    opts.maxEvals = Number.parseInt(argv[++i], 10)
  } else if (a === "--ids") {
    opts.ids = argv[++i]
  } else if (a === "--tolerance") {
    opts.tolerance = Number(argv[++i])
    if (!Number.isFinite(opts.tolerance) || opts.tolerance < 0) {
      console.error("--tolerance expects a non-negative number (cm)")
      process.exit(1)
    }
  } else if (a === "--max-passes") {
    opts.maxPasses = Number.parseInt(argv[++i], 10)
    if (!Number.isFinite(opts.maxPasses) || opts.maxPasses < 1) {
      console.error("--max-passes expects a positive integer")
      process.exit(1)
    }
  } else if (a === "--save-points") {
    opts.savePoints = true
  } else if (a === "--keep-tmp") {
    opts.keepTmp = true
  } else if (a === "--reuse") {
    opts.reuse = true
  } else if (a === "--verbose") {
    opts.verbose = true
  } else if (a === "--dry-run") {
    opts.dryRun = true
  } else if (a === "--help" || a === "-h") {
    usage()
  } else {
    console.error(`Unknown argument "${a}"`)
    usage()
  }
}
if (opts.params.length === 0) {
  console.error("At least one --param axis is required")
  usage()
}

const inputPath = path.resolve(
  process.cwd(),
  opts.input ?? path.join(scriptDir, "sweep.json")
)
const outDir = path.resolve(
  process.cwd(),
  opts.outDir ?? path.join(scriptDir, "corners")
)

// --- Axes and points ---

const axes = opts.params.map((token) => {
  const eq = token.indexOf("=")
  if (eq < 1 || eq === token.length - 1) {
    console.error(`--param expects key=v1|v2, got "${token}"`)
    process.exit(1)
  }
  const values = token
    .slice(eq + 1)
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean)
  if (values.length === 0) {
    console.error(`--param "${token}" has no values`)
    process.exit(1)
  }
  return { key: token.slice(0, eq).trim(), values }
})

function cartesian(i = 0, acc = []) {
  if (i === axes.length) return [[...acc]]
  const rows = []
  for (const v of axes[i].values) {
    acc.push(v)
    rows.push(...cartesian(i + 1, acc))
    acc.pop()
  }
  return rows
}

// --- Pins and points ---

const pins = opts.pins.flatMap((token) =>
  token.split(",").map((kv) => {
    const eq = kv.indexOf("=")
    if (eq < 1 || eq === kv.length - 1) {
      console.error(`--pin expects key=v, got "${kv}"`)
      process.exit(1)
    }
    return { key: kv.slice(0, eq).trim(), value: Number(kv.slice(eq + 1)) }
  })
)
for (const p of pins) {
  if (!Number.isFinite(p.value)) {
    console.error(`--pin ${p.key} expects a finite number`)
    process.exit(1)
  }
  const clash = axes.find((a) => a.key === p.key)
  if (clash) {
    console.error(
      `--pin ${p.key} conflicts with swept axis "${p.key}"; a constant cannot also vary`
    )
    process.exit(1)
  }
}
const pinKv = pins.map((p) => `${p.key}=${p.value}`).join(",") || null

// Centre point first: same pipeline as everything else, no param overrides.
const points = [{ label: "base", kv: null, values: null }]
for (const values of cartesian()) {
  points.push({
    label: axes.map((a, i) => `${a.key}${values[i]}`).join("_"),
    kv: axes.map((a, i) => `${a.key}=${values[i]}`).join(","),
    values,
  })
}

// --- Entries and ids ---

let entries
try {
  entries = JSON.parse(fs.readFileSync(inputPath, "utf8"))
} catch (err) {
  console.error(`Failed to read ${inputPath}: ${err.message}`)
  process.exit(1)
}
if (!Array.isArray(entries)) {
  console.error(`${inputPath} does not contain a JSON array`)
  process.exit(1)
}

let idFilter = null
if (opts.ids !== null) {
  idFilter = opts.ids.split(",").map((s) => Number.parseInt(s.trim(), 10))
  if (idFilter.some(Number.isNaN)) {
    console.error("--ids expects comma-separated integers")
    process.exit(1)
  }
}
const idOf = (entry, index) => entry.id ?? index
const allIds = entries.map(idOf)
const ids = idFilter ? allIds.filter((id) => idFilter.includes(id)) : allIds
if (ids.length === 0) {
  console.error("No shots matched --ids")
  process.exit(1)
}

const workers = Math.max(1, Math.min(opts.workers, ids.length))
const shards = Array.from({ length: workers }, (_, s) =>
  ids.filter((_, i) => i % workers === s)
)

function median(xs) {
  const s = [...xs].sort((a, b) => a - b)
  return s.length % 2
    ? s[(s.length - 1) / 2]
    : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}

// --- Process runner ---

function runNode(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [FIT_SHOTS, ...args], {
      stdio: ["ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    child.stdout.on("data", (d) => (stdout += d))
    child.stderr.on("data", (d) => (stderr += d))
    child.on("close", (code) => resolve({ code, stdout, stderr }))
    child.on("error", (err) => resolve({ code: -1, stdout, stderr: String(err) }))
  })
}

function fitArgs(outputPath, kv, inputOverride) {
  const args = ["--all", "--input", inputOverride ?? inputPath, "--output", outputPath]
  const fullKv = [kv, pinKv].filter(Boolean).join(",") || null
  if (fullKv !== null) args.push("--param", fullKv)
  args.push("--ids", ids.join(","))
  if (opts.maxEvals !== null) args.push("--max-evals", String(opts.maxEvals))
  return args
}

const fmtCmd = (args) =>
  `fit-shots.mjs ${args
    .map((a) => (a.startsWith("-") ? a : JSON.stringify(a)))
    .join(" ")}`

if (opts.dryRun) {
  const tmp = path.join(outDir, ".dryrun")
  for (const p of points) {
    for (let s = 0; s < workers; s++) {
      console.log(
        `[${p.label}] pass* shard${s} (${shards[s].length} shots): ${fmtCmd(
          fitArgs(path.join(tmp, p.label, `passN.shard${s}.json`), p.kv)
        )}`
      )
    }
  }
  process.exit(0)
}

fs.mkdirSync(outDir, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sweep-"))
const t0All = Date.now()

// Seed-quality reference (report only, no optimisation) — informational.
const refPath = path.join(tmpDir, "seed-report.json")
console.log(`Scoring seed quality…`)
const refArgs = ["--report", "--all", "--input", inputPath, "--output", refPath]
if (pinKv) refArgs.push("--param", pinKv)
if (idFilter) refArgs.push("--ids", ids.join(","))
const refRun = await runNode(refArgs)
if (refRun.code !== 0) {
  console.error(`Seed report failed:\n${refRun.stderr}`)
  process.exit(1)
}
const seedVals = JSON.parse(fs.readFileSync(refPath, "utf8")).map((e) => ({
  id: e.id,
  cm: e.fit?.rmseBeforeCm,
}))

// --- Point runner: repeated passes until converged ---

async function runShardPass(p, pass, passIn, shardOut) {
  const runs = await Promise.all(
    shards.map(async (shardIds, s) => {
      if (shardIds.length === 0) return { code: 0, stdout: "", stderr: "" }
      const args = fitArgs(shardOut[s], p.kv, passIn)
      if (idFilter) {
        // full id list is fine: fit-shots skips non-matching entries anyway
      }
      const res = await runNode(args)
      if (res.code !== 0) {
        throw new Error(
          `[${p.label}] pass${pass} shard${s} failed:\n${res.stderr}`
        )
      }
      if (opts.verbose) console.log(res.stdout.trim())
      return res
    })
  )
  return runs
}

function mergeShards(files) {
  const byId = new Map()
  for (const f of files) {
    if (!f || !fs.existsSync(f)) continue
    for (const e of JSON.parse(fs.readFileSync(f, "utf8"))) byId.set(e.id, e)
  }
  return entries.filter((e, idx) => byId.has(idOf(e, idx))).map((e, idx) => byId.get(idOf(e, idx)))
}

async function runPoint(p) {
  const dir = path.join(tmpDir, p.label)
  fs.mkdirSync(dir, { recursive: true })
  const history = []
  let passIn = inputPath
  let lastFiles = []
  let prevMedian = null

  for (let pass = 1; pass <= opts.maxPasses; pass++) {
    const t0 = Date.now()
    const shardOut = shards.map((_, s) => path.join(dir, `pass${pass}.shard${s}.json`))
    try {
      await runShardPass(p, pass, passIn, shardOut)
    } catch (err) {
      throw err
    }
    const merged = mergeShards(shardOut)
    lastFiles = shardOut
    const afters = merged.map((e) => e.fit?.rmseAfterCm).filter(Number.isFinite)
    if (afters.length !== ids.length) {
      throw new Error(`[${p.label}] pass${pass}: missing RMSE for some shots`)
    }
    const m = median(afters)
    const delta = prevMedian === null ? null : m - prevMedian
    history.push({ pass, medianCm: +m.toFixed(3), ...(delta !== null ? { deltaCm: +delta.toFixed(3) } : {}) })
    console.log(
      `[${p.label}] pass${pass} med ${m.toFixed(2)}cm` +
        (delta === null ? "" : ` (${delta >= 0 ? "+" : ""}${delta.toFixed(3)})`) +
        ` (${((Date.now() - t0) / 1000).toFixed(1)}s)`
    )

    // Re-seed next pass from this pass's merged output.
    const mergedFile = path.join(dir, `pass${pass}.merged.json`)
    fs.writeFileSync(mergedFile, JSON.stringify(merged))
    passIn = mergedFile

    if (prevMedian !== null && prevMedian - m < opts.tolerance) {
      return { history, converged: true, finalFile: mergedFile, medians: afters.map((v, i) => ({ id: ids[i], cm: v })) }
    }
    prevMedian = m
  }
  return {
    history,
    converged: false,
    finalFile: path.join(dir, `pass${opts.maxPasses}.merged.json`),
    medians: null,
  }
}

const failures = []
const pointResults = []

for (const p of points) {
  const savedFile = path.join(outDir, `${p.label}.json`)
  const reused = opts.reuse && opts.savePoints && fs.existsSync(savedFile)
  const ts = Date.now()
  try {
    let outcome
    if (reused) {
      const saved = JSON.parse(fs.readFileSync(savedFile, "utf8"))
      const afters = saved.map((e) => e.fit?.rmseAfterCm).filter(Number.isFinite)
      outcome = { history: [{ pass: 1, medianCm: +median(afters).toFixed(3), reused: true }], converged: null, finalFile: savedFile, medians: saved.map((e) => ({ id: e.id, cm: e.fit.rmseAfterCm })) }
      console.log(`[${p.label}] reusing ${savedFile}`)
    } else {
      outcome = await runPoint(p)
      if (opts.savePoints && !reused) {
        fs.copyFileSync(outcome.finalFile, savedFile)
      }
    }
    pointResults.push({ point: p, ...outcome, secs: ((Date.now() - ts) / 1000).toFixed(1) })
  } catch (err) {
    failures.push({ label: p.label, message: err.message })
    console.log(`[${p.label}] FAILED`)
  }
}

if (!opts.keepTmp) fs.rmSync(tmpDir, { recursive: true, force: true })

// --- Analysis vs fresh base point ---

const baseResult = pointResults.find((r) => r.point.label === "base")
if (!baseResult || !baseResult.medians) {
  console.error("Base point unavailable; cannot analyse.")
  for (const f of failures) console.error(`FAILED ${f.label}:\n${f.message}`)
  process.exit(1)
}
const baseById = new Map(baseResult.medians.map((m) => [m.id, m.cm]))
const baseMedian = median([...baseById.values()])
const baseMean = [...baseById.values()].reduce((s, x) => s + x, 0) / baseById.size

function signTestP(wins, losses) {
  const n = wins + losses
  if (n === 0) return 1
  const choose = (n, k) => {
    let r = 1
    for (let j = 0; j < k; j++) r = (r * (n - j)) / (j + 1)
    return r
  }
  const k = Math.max(wins, losses)
  let tail = 0
  for (let i = k; i <= n; i++) tail += choose(n, i)
  return Math.min(1, (2 * tail) / 2 ** n)
}

const fmtD = (x) => (x >= 0 ? "+" : "") + x.toFixed(2)

const candidates = pointResults
  .filter((r) => r.point.label !== "base" && r.medians)
  .map((r) => {
    const byId = new Map(r.medians.map((m) => [m.id, m.cm]))
    const vals = ids.map((id) => byId.get(id)).filter(Number.isFinite)
    const perShot = {}
    for (const id of ids) perShot[id] = +(byId.get(id) - baseById.get(id)).toFixed(3)
    const deltas = Object.values(perShot)
    const wins = deltas.filter((d) => d < -1e-9).length
    const losses = deltas.filter((d) => d > 1e-9).length
    return {
      label: r.point.label,
      params: Object.fromEntries(axes.map((a, i) => [a.key, Number(r.point.values[i])])),
      converged: r.converged,
      passes: r.history,
      medianCm: +median(vals).toFixed(3),
      meanCm: +(vals.reduce((s, x) => s + x, 0) / vals.length).toFixed(3),
      wins,
      ties: deltas.length - wins - losses,
      losses,
      perShot,
      secs: r.secs,
    }
  })
candidates.sort((a, b) => a.medianCm - b.medianCm)
candidates.forEach((c, i) => {
  c.tag = String.fromCharCode(65 + i)
  c.deltaMedianCm = +(c.medianCm - baseMedian).toFixed(3)
  c.signTestP = +signTestP(c.wins, c.losses).toFixed(4)
})

console.log(
  `\n== Points vs freshly-fitted base${pinKv ? ` [${pinKv}]` : ""} (${baseMedian.toFixed(2)}cm median, ${baseMean.toFixed(2)} mean) ==`
)
console.log(`tag  point                              med    dMed   mean   w/t/l   sign-p  passes`)
for (const c of candidates) {
  console.log(
    `${c.tag}    ${c.label.padEnd(33)} ${c.medianCm.toFixed(2).padStart(5)}  ${fmtD(
      c.deltaMedianCm
    ).padStart(6)}  ${c.meanCm.toFixed(2).padStart(5)}  ` +
      `${c.wins}/${c.ties}/${c.losses}`.padEnd(7) +
      ` ${c.signTestP.toFixed(3)}  ${c.passes.at(-1).pass}` +
      (c.converged ? "" : "*")
  )
}
console.log(`base (defaults${pinKv ? ` + ${pinKv}` : ""})${" ".repeat(Math.max(0, 24 - (pinKv ? pinKv.length : 0)))}${baseMedian.toFixed(2).padStart(5)}  ${"+0.00".padStart(6)}  ${baseMean.toFixed(2).padStart(5)}`)
console.log(`(* = hit --max-passes without reaching --tolerance)`)

if (candidates.length > 0) {
  console.log(`\nPer-shot deltas (cm) vs base:`)
  console.log("id    base  " + candidates.map((c) => c.tag.padStart(7)).join(""))
  for (const id of ids) {
    console.log(
      `${String(id).padEnd(5)} ${baseById.get(id).toFixed(2).padStart(5)} ` +
        candidates.map((c) => fmtD(c.perShot[id]).padStart(8)).join("")
    )
  }
  const best = candidates[0]
  console.log(
    `\nBest candidate: ${best.label}  med ${best.medianCm.toFixed(
      2
    )}cm (${fmtD(best.deltaMedianCm)}), ${best.wins}/${best.wins + best.ties + best.losses} improved, sign-p ${best.signTestP}`
  )
  console.log(`Adopt only on held-out validation.`)
}

for (const f of failures) console.error(`\nFAILED ${f.label}:\n${f.message}`)

const resultsPath = path.join(outDir, "sweep-results.json")
fs.writeFileSync(
  resultsPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      input: inputPath,
      protocol: {
        toleranceCm: opts.tolerance,
        maxPasses: opts.maxPasses,
        maxEvals: opts.maxEvals,
        workers: opts.workers,
        pin: pins.length > 0 ? Object.fromEntries(pins.map((p) => [p.key, p.value])) : null,
      },
      seedReport: {
        medianCm: +median(seedVals.map((s) => s.cm)).toFixed(3),
        note: "stored-seed quality before any sweep fitting (informational)",
        perShotCm: Object.fromEntries(seedVals.map((s) => [s.id, s.cm])),
      },
      base: {
        label: pinKv ? `base (${pinKv})` : "base",
        medianCm: +baseMedian.toFixed(3),
        meanCm: +baseMean.toFixed(3),
        perShotCm: Object.fromEntries(baseById),
        passes: baseResult.history,
        converged: baseResult.converged,
      },
      points: candidates,
      failures: failures.map((f) => f.label),
    },
    null,
    2
  )
)
console.log(`\nWrote ${resultsPath}`)
if (!opts.savePoints) {
  console.log(`(Point fit files kept in tmp only — use --save-points to persist them.)`)
}

if (failures.length > 0) process.exit(1)
