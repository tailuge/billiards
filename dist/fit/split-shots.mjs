#!/usr/bin/env node
// split-shots.mjs — seeded random split of fitted shots into dev (pilot) and
// test (hold-out) sets for sweep-params.mjs.
//
// Random selection only — no RMSE bands. Selecting on RMSE correlates the
// split with the quantity under study, which biases both the pilot profile
// and the held-out estimate. A seeded random split is exchangeable and
// reproducible: same seed -> same split, every time.
//
// Usage:
//   node split-shots.mjs [--seed N] [--pilot N] [--keep25]
//                        [--input in.json] [--dev out.json] [--test out.json]
//
// Defaults: seed 42, pilot 24, input shots.json, outputs sweep-dev.json /
// sweep-test.json in the script dir. Shot id 25 (unmodelled double-kiss,
// model-capability exclusion decided a priori) is dropped unless --keep25.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

function usage() {
  console.error(`Usage: node split-shots.mjs [options]
  --seed N          PRNG seed (default 42)
  --pilot N         dev-set size (default 24)
  --keep25          include shot id 25 (default: excluded)
  --input FILE      fitted shots to split (default: shots.json)
  --dev FILE        dev/pilot output (default: sweep-dev.json)
  --test FILE       test/hold-out output (default: sweep-test.json)`)
  process.exit(1)
}

const opts = {
  seed: 42,
  pilot: 24,
  keep25: false,
  input: null,
  dev: null,
  test: null,
}
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === "--seed") {
    opts.seed = Number.parseInt(argv[++i], 10)
    if (!Number.isInteger(opts.seed)) {
      console.error("--seed expects an integer")
      process.exit(1)
    }
  } else if (a === "--pilot") {
    opts.pilot = Number.parseInt(argv[++i], 10)
    if (!Number.isInteger(opts.pilot) || opts.pilot < 1) {
      console.error("--pilot expects a positive integer")
      process.exit(1)
    }
  } else if (a === "--keep25") {
    opts.keep25 = true
  } else if (a === "--input") {
    opts.input = argv[++i]
  } else if (a === "--dev") {
    opts.dev = argv[++i]
  } else if (a === "--test") {
    opts.test = argv[++i]
  } else if (a === "--help" || a === "-h") {
    usage()
  } else {
    console.error(`Unknown argument "${a}"`)
    usage()
  }
}

const inputPath = path.resolve(process.cwd(), opts.input ?? path.join(scriptDir, "shots.json"))
const devPath = path.resolve(process.cwd(), opts.dev ?? path.join(scriptDir, "sweep-dev.json"))
const testPath = path.resolve(process.cwd(), opts.test ?? path.join(scriptDir, "sweep-test.json"))

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

// mulberry32 — tiny deterministic PRNG
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pool = entries.filter((e) => opts.keep25 || e.id !== 25)
const rng = mulberry32(opts.seed)
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1))
  ;[pool[i], pool[j]] = [pool[j], pool[i]]
}
const dev = pool.slice(0, Math.min(opts.pilot, pool.length))
const test = pool.slice(dev.length)

fs.writeFileSync(devPath, JSON.stringify(dev))
fs.writeFileSync(testPath, JSON.stringify(test))

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}
const rmse = (set) => set.map((e) => e.fit?.rmseAfterCm).filter(Number.isFinite)
const d = rmse(dev)
const t = rmse(test)
const fmt = (xs) => `${xs.length} shots, median ${median(xs).toFixed(2)}cm`
console.log(`Seed ${opts.seed}, pilot ${dev.length}, test ${test.length} (from ${pool.length} shots${opts.keep25 ? "" : ", id 25 excluded"})`)
console.log(`dev  (${path.basename(devPath)}):  ${fmt(d)}`)
console.log(`test (${path.basename(testPath)}):  ${fmt(t)}`)
console.log(`dev ids:  ${dev.map((e) => e.id).join(",")}`)
console.log(`test ids: ${test.map((e) => e.id).join(",")}`)
