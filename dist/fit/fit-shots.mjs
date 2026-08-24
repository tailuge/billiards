#!/usr/bin/env node
// fit-shots.mjs — Stage 2 of fitplan.md
//
// Physics-fit every shot in the input file using the same optimisers as
// viewer.html: Nelder-Mead (vendored @reside-ic/dfoptim) or serial PSO
// (vendored pso, no Worker pool). The simulation objective runs the real
// engine (dist/worker.js registers global.simulateSync in Node).
//
// Input/output are the same entry format ({id, balls[, shot], ...}); an
// output can be fed back in as --input, where an existing `shot` field
// becomes the seed instead of the kinematic estimate.
//
// Usage:
//   node fit-shots.mjs [--optimise shot.power,shot.offset.x,shot.offset.y]
//                      [--optimiser nm|pso] [--ids 3,17,42] [--all]
//                      [--max-evals 400] [--report] [--min-rmse CM]
//                      [--max-rmse CM] [--param k=v ...]
//                      [--input in.json] [--output out.json]
//
// Positional [input] [output] also work (like enrich-shots.mjs).

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

import { Simplex } from "./vendor/dfoptim.mjs"
import pso from "./vendor/pso.mjs"
import { computeSSE } from "./rmse.js"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

// --- Physics engine in Node (fitplan §4.2 — do NOT fake WorkerGlobalScope) ---

global.self = global
const require = createRequire(import.meta.url)
require(path.join(scriptDir, "..", "worker.js"))
const simulateSync = global.simulateSync
if (typeof simulateSync !== "function") {
  console.error("dist/worker.js did not register global.simulateSync")
  process.exit(1)
}

// --- CLI ---

const VALID_FIELDS = {
  "shot.angle": [-Math.PI * 2, Math.PI * 2],
  "shot.power": [0.1, 5.25],
  "shot.offset.x": [-0.451, 0.451],
  "shot.offset.y": [-0.451, 0.451],
}
const DEFAULT_OPTIMISE = ["shot.angle", "shot.power", "shot.offset.x", "shot.offset.y"]

function usage() {
  console.error(`Usage: node fit-shots.mjs [options] [input.json] [output.json]
  --optimise f1,f2   fields to fit: ${Object.keys(VALID_FIELDS).join(", ")}
                     (default: ${DEFAULT_OPTIMISE.join(",")})
  --optimiser nm|pso Nelder-Mead (default) or serial PSO
  --ids 3,17,42      only fit these shot ids
  --all              RMSE against all balls (default: cue ball only)
  --max-evals N      NM eval budget per shot (default 400)
  --report           no optimisation: evaluate and report seed RMSE only
  --min-rmse CM      only fit shots with seed RMSE above CM (cm); shots at or
                     below are copied through to the output unchanged
  --max-rmse CM      only process shots with seed RMSE at or below CM (cm);
                     shots above are dropped from output and summary
  --param k=v        physics-param override, repeatable / comma-separated,
                     e.g. --param rho=0.0454,mu=0.006 (keys: mu muS rho m R
                     ee mus muw stronge_omega_ratio stronge_e_n stronge_mu;
                     mus/muw are ASCII aliases for μs/μw)
  --input/--output   paths (defaults: trajectories.json / shots.json)`)
  process.exit(1)
}

const opts = {
  optimise: DEFAULT_OPTIMISE,
  optimiser: "nm",
  ids: null,
  all: false,
  maxEvals: 400,
  report: false,
  minRmse: null,
  maxRmse: null,
  params: [],
  input: null,
  output: null,
  positional: [],
}
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === "--optimise" || a === "--optimize") {
    opts.optimise = argv[++i].split(",").map((s) => s.trim())
  } else if (a === "--optimiser" || a === "--optimizer") {
    opts.optimiser = argv[++i].toLowerCase()
  } else if (a === "--ids") {
    opts.ids = argv[++i]
  } else if (a === "--all") {
    opts.all = true
  } else if (a === "--max-evals") {
    opts.maxEvals = Number.parseInt(argv[++i], 10)
  } else if (a === "--report") {
    opts.report = true
  } else if (a === "--min-rmse") {
    opts.minRmse = Number(argv[++i])
    if (!Number.isFinite(opts.minRmse) || opts.minRmse < 0) {
      console.error("--min-rmse expects a non-negative number (cm)")
      process.exit(1)
    }
  } else if (a === "--max-rmse") {
    opts.maxRmse = Number(argv[++i])
    if (!Number.isFinite(opts.maxRmse) || opts.maxRmse < 0) {
      console.error("--max-rmse expects a non-negative number (cm)")
      process.exit(1)
    }
  } else if (a === "--param") {
    opts.params.push(...argv[++i].split(",").map((s) => s.trim()))
  } else if (a === "--input") {
    opts.input = argv[++i]
  } else if (a === "--output") {
    opts.output = argv[++i]
  } else if (a === "--help" || a === "-h") {
    usage()
  } else {
    opts.positional.push(a)
  }
}

if (opts.optimiser !== "nm" && opts.optimiser !== "pso") {
  console.error(`Unknown --optimiser "${opts.optimiser}" (expected nm or pso)`)
  process.exit(1)
}
const invalid = opts.optimise.filter((f) => !(f in VALID_FIELDS))
if (invalid.length > 0) {
  console.error(
    `Unknown field(s): ${invalid.join(", ")}\nValid fields: ${Object.keys(VALID_FIELDS).join(", ")}`
  )
  process.exit(1)
}
let idFilter = null
if (opts.ids !== undefined && opts.ids !== null) {
  idFilter = opts.ids.split(",").map((s) => Number.parseInt(s.trim(), 10))
  if (idFilter.some(Number.isNaN)) {
    console.error("--ids expects comma-separated integers")
    process.exit(1)
  }
}

const inputPath = opts.input
  ? path.resolve(process.cwd(), opts.input)
  : opts.positional[0]
    ? path.resolve(process.cwd(), opts.positional[0])
    : path.join(scriptDir, "trajectories.json")
const outputPath = opts.output
  ? path.resolve(process.cwd(), opts.output)
  : opts.positional[1]
    ? path.resolve(process.cwd(), opts.positional[1])
    : path.join(scriptDir, "shots.json")

// --- Conversion (mirrors viewer.html convertTrajectoryShot / enrich-shots) ---

const PARAMS = {
  mu: 0.0055,
  muS: 0.126,
  rho: 0.045,
  m: 0.23,
  R: 0.03275,
  ee: 0.85,
  μs: 0.2,
  μw: 0.2,
  stronge_omega_ratio: 1.76,
  stronge_e_n: 0.77,
  stronge_μ: 0.25,
  warpClearanceR: 2.05,
}

const PARAM_ALIASES = { mus: "μs", muw: "μw", stronge_mu: "stronge_μ" }

function parseParamOverrides(tokens) {
  const overrides = {}
  for (const token of tokens) {
    if (!token) continue
    const eq = token.indexOf("=")
    if (eq < 1 || eq === token.length - 1) {
      console.error(`--param expects key=value, got "${token}"`)
      process.exit(1)
    }
    const rawKey = token.slice(0, eq).trim()
    const key = PARAM_ALIASES[rawKey] ?? rawKey
    const value = Number(token.slice(eq + 1))
    if (!(key in PARAMS)) {
      console.error(
        `Unknown --param key "${rawKey}"\nValid keys: ${Object.keys(PARAMS).join(", ")}`
      )
      process.exit(1)
    }
    if (!Number.isFinite(value)) {
      console.error(`--param ${rawKey} expects a finite number, got "${token.slice(eq + 1)}"`)
      process.exit(1)
    }
    overrides[key] = value
  }
  return overrides
}

const paramOverrides = parseParamOverrides(opts.params)
const EFFECTIVE_PARAMS = { ...PARAMS, ...paramOverrides }

function findMover(balls) {
  let moverId = null
  let minT1 = Infinity
  for (const [id, ball] of Object.entries(balls)) {
    if (ball.t.length >= 2 && ball.t[1] < minT1) {
      minT1 = ball.t[1]
      moverId = id
    }
  }
  if (moverId === null) {
    moverId = Object.keys(balls)[0] || "1"
  }
  return moverId
}

function kinematicShot(cueBall) {
  let angle = 0
  let power = 0
  if (cueBall && cueBall.t.length >= 2) {
    const t0 = 1
    const t1 = Math.min(5, cueBall.t.length - 1)
    const dx = cueBall.x[t1] - cueBall.x[t0]
    const dy = cueBall.y[t1] - cueBall.y[t0]
    const dt = cueBall.t[t1] - cueBall.t[t0]
    angle = Math.atan2(dy, dx)
    power = dt > 0 ? Math.hypot(dx, dy) / dt : 0
  }
  return { cueBallId: 0, angle, power, offset: { x: 0, y: 0 }, elevation: 0 }
}

function normaliseAngle(a) {
  return Math.atan2(Math.sin(a), Math.cos(a))
}

function seedShot(entry, moverId) {
  // Prior fit present -> refine it; otherwise kinematic estimate.
  if (entry.shot) {
    const s = JSON.parse(JSON.stringify(entry.shot))
    s.cueBallId = 0
    s.angle = s.angle ?? 0
    s.power = s.power ?? 0
    s.offset = { x: s.offset?.x ?? 0, y: s.offset?.y ?? 0 }
    s.elevation = s.elevation ?? 0
    return s
  }
  return kinematicShot(entry.balls[moverId])
}

function ballMappingFor(balls, moverId) {
  const otherIds = Object.keys(balls)
    .filter((id) => id !== moverId)
    .sort()
  const mapping = { [moverId]: 0 }
  if (otherIds[0] !== undefined) mapping[otherIds[0]] = 1
  if (otherIds[1] !== undefined) mapping[otherIds[1]] = 2
  return mapping
}

function buildTruth(balls, mapping) {
  const truth = []
  for (const [origId, b] of Object.entries(balls)) {
    const ballId = mapping[origId]
    for (let i = 0; i < b.t.length; i++) {
      truth.push({ ball: ballId, t: b.t[i], x: b.x[i], y: b.y[i] })
    }
  }
  truth.sort((a, b) => (a.t !== b.t ? a.t - b.t : a.ball - b.ball))
  return truth
}

function buildSim(shot, balls, mapping) {
  const simBalls = Object.entries(balls).map(([origId, b]) => ({
    id: mapping[origId],
    pos: { x: b.x[0], y: b.y[0], z: 0 },
  }))
  simBalls.sort((a, b) => a.id - b.id)
  return {
    ruleType: "threecushion",
    cushionModel: "mathavan",
    shot,
    params: { ...EFFECTIVE_PARAMS },
    stepSize: 0.001953125,
    maxIterations: 20000,
    balls: simBalls,
  }
}

// --- Objective (mirrors optimise.js makeTarget/runSimSync) ---

function simTracksFrom(frames) {
  const tracks = {}
  for (const f of frames) {
    for (const b of f.balls) {
      ;(tracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1], t: f.t })
    }
  }
  return tracks
}

function rmseFor(config, truth) {
  const result = simulateSync(config)
  const tracks = simTracksFrom(result.frames)
  const { sse, count } = computeSSE(truth, tracks, opts.all)
  if (!Number.isFinite(sse) || !Number.isFinite(count) || count <= 0) {
    return Infinity
  }
  const rmse = Math.sqrt(sse / count)
  return Number.isFinite(rmse) ? rmse : Infinity
}

const getValue = (shot, name) => {
  const parts = name.split(".").slice(1)
  let curr = shot
  for (const p of parts) curr = curr[p]
  return curr
}

const setValue = (shot, name, val) => {
  const parts = name.split(".").slice(1)
  let curr = shot
  for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]]
  curr[parts[parts.length - 1]] = val
}

const decode = (norm, specs) => {
  if (!Array.isArray(norm) || norm.length !== specs.length) return null
  const entries = []
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i]
    const n = norm[i]
    if (
      !Number.isFinite(n) ||
      !Number.isFinite(s.min) ||
      !Number.isFinite(s.max) ||
      s.max <= s.min
    ) {
      return null
    }
    const val = s.min + Math.max(0, Math.min(1, n)) * (s.max - s.min)
    if (!Number.isFinite(val)) return null
    entries.push([s.name, val])
  }
  return Object.fromEntries(entries)
}

function makeInitial(shot, specs) {
  return specs.map((s) => {
    const val = getValue(shot, s.name)
    if (
      !Number.isFinite(val) ||
      !Number.isFinite(s.min) ||
      !Number.isFinite(s.max) ||
      s.max <= s.min
    ) {
      return 0.5
    }
    return Math.max(0, Math.min(1, (val - s.min) / (s.max - s.min)))
  })
}

function makeSerialTarget(specs, baseSim, truth) {
  return (norm) => {
    const tuned = decode(norm, specs)
    if (!tuned) return Infinity
    try {
      const config = JSON.parse(JSON.stringify(baseSim))
      for (const [name, val] of Object.entries(tuned)) {
        setValue(config.shot, name, val)
      }
      return rmseFor(config, truth)
    } catch {
      return Infinity
    }
  }
}

// --- Nelder-Mead (mirrors optimise.js runOptimiseNM, synchronous) ---

function runNM(specs, baseSim, truth, maxEvals) {
  const target = makeSerialTarget(specs, baseSim, truth)
  const initial = makeInitial(baseSim.shot, specs)
  const opt = new Simplex(target, initial, {})
  let evals = 0
  let res = opt.result()
  while (!res.converged && evals < maxEvals) {
    opt.step()
    evals++
    res = opt.result()
  }
  return { location: res.location, value: res.value, converged: res.converged, evals }
}

// --- Serial PSO (mirrors optimise.js runOptimisePSO minus the WorkerPool) ---

async function runPSO(specs, baseSim, truth, maxIterations = 100) {
  const target = makeSerialTarget(specs, baseSim, truth)
  const initial = makeInitial(baseSim.shot, specs)

  const asyncTarget = (norm, callback) => {
    // pso minimises? No — it maximises the returned fitness, so negate RMSE.
    const rmse = target(norm)
    callback(-rmse)
  }

  const opt = new pso.Optimizer()
  const wStart = 0.9,
    wEnd = 0.4
  const c1Start = 2.0,
    c1End = 0.7
  const c2Start = 0.7,
    c2End = 2.0

  opt.setOptions({
    inertiaWeight: wStart,
    personal: c1Start,
    social: c2Start,
    pressure: 0.5,
  })
  opt.setObjectiveFunction(asyncTarget, { async: true })

  const intervals = specs.map(() => ({ start: 0, end: 1 }))
  const populationSize = Math.max(15, specs.length * 3)

  let particleIdx = 0
  opt.init(populationSize, () => {
    if (particleIdx++ === 0) {
      return new pso.Particle(
        initial.slice(),
        initial.map(() => 0),
        opt._options
      )
    }
    return pso.Particle.createRandom(intervals, opt._options, opt.rng.random)
  })

  for (let iter = 0; iter < maxIterations; iter++) {
    const progress = iter / (maxIterations - 1 || 1)
    const currentInertia = wStart - (wStart - wEnd) * progress
    const currentPersonal = c1Start - (c1Start - c1End) * progress
    const currentSocial = c2Start - (c2Start - c2End) * progress

    opt.setOptions({
      inertiaWeight: currentInertia,
      personal: currentPersonal,
      social: currentSocial,
      pressure: 0.5,
    })

    await new Promise((resolve) => opt.step(() => resolve()))
  }

  const bestFitness = opt.getBestFitness()
  const bestPosition = opt.getBestPosition() || initial
  const value = bestFitness === -Infinity ? Infinity : -bestFitness
  return {
    location: bestPosition,
    value,
    converged: Number.isFinite(value),
    evals: populationSize * maxIterations,
  }
}

// --- Main ---

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

const specs = opts.optimise.map((name) => ({
  name,
  min: VALID_FIELDS[name][0],
  max: VALID_FIELDS[name][1],
}))

const results = []
const counts = { skipped: 0, unimproved: 0, improved: 0 }
const t0All = Date.now()

try {
  for (const [idx, entry] of entries.entries()) {
    const id = entry.id ?? idx
    if (idFilter && !idFilter.includes(id)) continue

    const moverId = findMover(entry.balls)
    const mapping = ballMappingFor(entry.balls, moverId)
    const truth = buildTruth(entry.balls, mapping)
    // Ratchet: never replace an existing fit with a worse one.
    const seed = seedShot(entry, moverId)
    let shot = JSON.parse(JSON.stringify(seed))
    const baseSim = buildSim(seed, entry.balls, mapping)

    const t0 = Date.now()

    const seedRmse = rmseFor(baseSim, truth)
    if (!Number.isFinite(seedRmse)) {
      throw new Error(
        `shot id ${id}: non-finite RMSE at seed (${JSON.stringify(shot)})`
      )
    }

    if (opts.minRmse !== null && seedRmse * 100 <= opts.minRmse) {
      results.push(JSON.parse(JSON.stringify(entry)))
      counts.skipped++
      fs.writeFileSync(outputPath, JSON.stringify(results))
      console.log(
        `Shot #${results.length} (id ${id})  rmse ${(seedRmse * 100).toFixed(1)}cm  [below --min-rmse, copied through]`
      )
      continue
    }

    if (opts.maxRmse !== null && seedRmse * 100 > opts.maxRmse) {
      counts.skipped++
      console.log(
        `Shot id ${id}  rmse ${(seedRmse * 100).toFixed(1)}cm  [above --max-rmse, skipped]`
      )
      continue
    }

    let fittedRmse = seedRmse
    let improved = false
    let run = { evals: 0, converged: false }
    if (!opts.report) {
      run =
        opts.optimiser === "pso"
          ? await runPSO(specs, baseSim, truth)
          : runNM(specs, baseSim, truth, opts.maxEvals)

      const tuned = decode(run.location, specs)
      if (!tuned) {
        throw new Error(`shot id ${id}: optimiser returned invalid location`)
      }
      for (const [name, val] of Object.entries(tuned)) {
        setValue(shot, name, val)
      }
      if ("shot.angle" in tuned) {
        shot.angle = normaliseAngle(shot.angle)
      }

      fittedRmse = rmseFor(buildSim(shot, entry.balls, mapping), truth)
      improved =
        Number.isFinite(fittedRmse) && fittedRmse < seedRmse - 1e-12
      if (!improved) {
        if (!Number.isFinite(fittedRmse)) {
          console.log(
            `Shot id ${id}: non-finite RMSE at fitted parameters; keeping seed`
          )
        }
        shot = seed
        fittedRmse = seedRmse
      }
    }
    counts[improved ? "improved" : "unimproved"]++

    results.push({
      id,
      balls: entry.balls,
      shot,
      mover: moverId,
      ballMapping: mapping,
      fit: {
        rmseBeforeCm: +(seedRmse * 100).toFixed(2),
        rmseAfterCm: +(fittedRmse * 100).toFixed(2),
        improved,
        evals: run.evals,
        elapsedMs: Date.now() - t0,
        converged: !!run.converged,
        fitted: specs.map((s) => s.name),
        optimiser: opts.optimiser,
        ...(Object.keys(paramOverrides).length > 0
          ? { params: { ...paramOverrides } }
          : {}),
      },
    })

    // Incremental write — a crash may leave the file half-finished; re-run
    // the batch from the input (fitplan §4.3).
    fs.writeFileSync(outputPath, JSON.stringify(results))

    console.log(
      `Shot #${results.length} (id ${id})  rmse ${(seedRmse * 100).toFixed(1)}cm -> ${(fittedRmse * 100).toFixed(1)}cm` +
        (improved ? "" : opts.report ? "  [report]" : "  [kept seed]") +
        `  (${run.evals} evals, ${run.converged ? "converged" : "stalled"})`
    )
  }
} catch (err) {
  console.error(`\nHALT: ${err.message}`)
  console.error(`Partial output (${results.length} shots) written to ${outputPath}`)
  process.exit(1)
}

// --- Summary ---

if (results.length > 0) {
  // Copied-through entries keep their original metadata and may have no
  // `fit` (e.g. raw trajectory input) — exclude them from RMSE stats.
  const fitted = results.filter((r) => r.fit)
  const before = fitted.map((r) => r.fit.rmseBeforeCm).sort((a, b) => a - b)
  const after = fitted.map((r) => r.fit.rmseAfterCm).sort((a, b) => a - b)
  const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length
  const median = (xs) =>
    xs.length % 2
      ? xs[(xs.length - 1) / 2]
      : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2
  const convergedCount = fitted.filter((r) => r.fit.converged).length

  console.log(`\nFitted ${results.length}/${entries.length} shots in ${((Date.now() - t0All) / 1000).toFixed(1)}s`)
  if (Object.keys(paramOverrides).length > 0) {
    console.log(
      `Params ${Object.entries(paramOverrides)
        .map(([k, v]) => `${k}=${v}`)
        .join(" ")}`
    )
  }
  console.log(
    `Improved ${counts.improved}, kept seed ${counts.unimproved}, skipped ${counts.skipped}`
  )
  if (fitted.length > 0) {
    console.log(`RMSE mean   ${mean(before).toFixed(1)}cm -> ${mean(after).toFixed(1)}cm`)
    console.log(`RMSE median ${median(before).toFixed(1)}cm -> ${median(after).toFixed(1)}cm`)
    console.log(`Converged ${convergedCount}/${fitted.length}`)
  }
  console.log(`Wrote ${outputPath}`)
} else {
  console.log("No shots matched the selection")
}
