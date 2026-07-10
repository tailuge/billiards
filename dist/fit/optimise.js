import { Simplex } from "https://esm.sh/@reside-ic/dfoptim"
import pso from "https://esm.sh/pso"
import { computeSSE } from "./rmse.js"

class WorkerPool {
  constructor(workerPath, size) {
    this.workerPath = workerPath
    this.size = size
    this.workers = []
    this.idleWorkers = []
    this.queue = []
    this.terminated = false

    for (let i = 0; i < size; i++) {
      const w = new Worker(this.workerPath)
      this.workers.push(w)
      this.idleWorkers.push(w)
    }
  }

  run(config) {
    return new Promise((resolve, reject) => {
      if (this.terminated) {
        reject(new DOMException("Aborted", "AbortError"))
        return
      }
      const task = { config, resolve, reject }
      this.queue.push(task)
      this._next()
    })
  }

  _next() {
    if (this.terminated || this.queue.length === 0 || this.idleWorkers.length === 0) return
    const task = this.queue.shift()
    const worker = this.idleWorkers.pop()

    worker.onmessage = (e) => {
      if (this.terminated) return
      if (e.data.type === "COMPLETE") {
        this.idleWorkers.push(worker)
        task.resolve(e.data)
        this._next()
      } else if (e.data.type === "ERROR") {
        this.idleWorkers.push(worker)
        task.reject(new Error(e.data.error))
        this._next()
      }
    }

    worker.onerror = (err) => {
      if (this.terminated) return
      this.idleWorkers.push(worker)
      task.reject(err)
      this._next()
    }

    worker.postMessage(task.config)
  }

  terminate() {
    this.terminated = true
    for (const w of this.workers) {
      w.terminate()
    }
    for (const task of this.queue) {
      task.reject(new DOMException("Aborted", "AbortError"))
    }
    this.workers = []
    this.idleWorkers = []
    this.queue = []
  }
}

const getValue = (simConfig, name) => {
  if (name.startsWith("shot.")) {
    const path = name.split(".").slice(1)
    let curr = simConfig.shot
    for (const p of path) curr = curr[p]
    return curr
  }
  return simConfig.params[name]
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
    )
      return null

    const val = s.min + Math.max(0, Math.min(1, n)) * (s.max - s.min)
    if (!Number.isFinite(val)) return null
    entries.push([s.name, val])
  }

  return Object.fromEntries(entries)
}

function runSimSync(simConfig, truth, trackAll = false) {
  const result = window.simulateSync(simConfig)
  const simTracks = {}
  for (const f of result.frames) {
    for (const b of f.balls) {
      ;(simTracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1], t: f.t })
    }
  }
  const { sse, count } = truth
    ? computeSSE(truth, simTracks, trackAll)
    : { sse: 0, count: 0 }
  const rmse = count > 0 ? Math.sqrt(sse / count) : null
  return { simTracks, frames: result.frames, rmse, sse, count }
}

function makeTarget(simConfig, truth, specs, trackAll = false) {
  const isMulti = Array.isArray(simConfig)
  const configs = isMulti ? simConfig : [simConfig]
  const truths = isMulti ? truth : [truth]

  const target = (norm) => {
    const tuned = decode(norm, specs)
    if (!tuned) return Infinity

    let totalSSE = 0
    let totalCount = 0

    try {
      for (let i = 0; i < configs.length; i++) {
        const config = JSON.parse(JSON.stringify(configs[i]))
        for (const [name, val] of Object.entries(tuned)) {
          if (name.startsWith("shot.")) {
            const path = name.split(".").slice(1)
            let curr = config.shot
            for (let j = 0; j < path.length - 1; j++) curr = curr[path[j]]
            curr[path[path.length - 1]] = val
          } else {
            config.params[name] = val
          }
        }

        const { sse, count } = runSimSync(config, truths[i], trackAll)
        if (!Number.isFinite(sse) || !Number.isFinite(count) || count < 0) {
          return Infinity
        }
        totalSSE += sse
        totalCount += count
      }
    } catch (err) {
      console.warn(
        "[opt] rejected trial:",
        JSON.stringify(tuned),
        err?.message || err
      )
      return Infinity
    }

    const globalRMSE =
      totalCount > 0 ? Math.sqrt(totalSSE / totalCount) : Infinity
    const safe = Number.isFinite(globalRMSE) ? globalRMSE : Infinity
    console.log(
      "[opt] trial tuned:",
      JSON.stringify(tuned),
      "→ global rmse:",
      globalRMSE,
      safe !== globalRMSE ? "(clamped invalid → ∞)" : ""
    )
    return safe
  }
  return target
}

function makeInitial(simConfig, specs) {
  const config = Array.isArray(simConfig) ? simConfig[0] : simConfig
  return specs.map((s) => {
    const val = getValue(config, s.name)
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

export async function runOptimiseNM(
  simConfig,
  truth,
  specs,
  onStep,
  signal,
  trackAll = false
) {
  const initial = makeInitial(simConfig, specs)
  const target = makeTarget(simConfig, truth, specs, trackAll)
  const opt = new Simplex(target, initial, {})

  let iter = 0
  while (!signal?.aborted) {
    opt.step()
    iter++
    const res = opt.result()
    console.log(
      `[opt] iter ${iter}: res.value (best-so-far)=${res.value}, converged=${res.converged}`
    )
    onStep({ iter, rmse: res.value, params: decode(res.location, specs) || {} })
    if (res.converged) break
    await new Promise((r) => setTimeout(r, 0))
  }
}

export async function runOptimisePSO(
  simConfig,
  truth,
  specs,
  onStep,
  signal,
  trackAll = false
) {
  const concurrency = Math.min(navigator.hardwareConcurrency || 4, 8)
  const workerUrl = new URL("../worker.js", import.meta.url)
  const pool = new WorkerPool(workerUrl, concurrency)

  try {
    const initial = makeInitial(simConfig, specs)

    const isMulti = Array.isArray(simConfig)
    const configs = isMulti ? simConfig : [simConfig]
    const truths = isMulti ? truth : [truth]

    const asyncTarget = (norm, callback) => {
      if (signal?.aborted) {
        callback(-Infinity)
        return
      }

      const tuned = decode(norm, specs)
      if (!tuned) {
        callback(-Infinity)
        return
      }

      const simPromises = configs.map((cfg, idx) => {
        const configCopy = JSON.parse(JSON.stringify(cfg))
        for (const [name, val] of Object.entries(tuned)) {
          if (name.startsWith("shot.")) {
            const path = name.split(".").slice(1)
            let curr = configCopy.shot
            for (let j = 0; j < path.length - 1; j++) curr = curr[path[j]]
            curr[path[path.length - 1]] = val
          } else {
            configCopy.params[name] = val
          }
        }
        return pool.run(configCopy).then((result) => {
          const simTracks = {}
          for (const f of result.frames) {
            for (const b of f.balls) {
              ;(simTracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1], t: f.t })
            }
          }
          const { sse, count } = truths[idx]
            ? computeSSE(truths[idx], simTracks, trackAll)
            : { sse: 0, count: 0 }
          return { sse, count }
        })
      })

      Promise.all(simPromises)
        .then((results) => {
          let totalSSE = 0
          let totalCount = 0
          for (const r of results) {
            if (!Number.isFinite(r.sse) || !Number.isFinite(r.count) || r.count < 0) {
              callback(-Infinity)
              return
            }
            totalSSE += r.sse
            totalCount += r.count
          }
          const globalRMSE = totalCount > 0 ? Math.sqrt(totalSSE / totalCount) : Infinity
          const safe = Number.isFinite(globalRMSE) ? globalRMSE : Infinity
          console.log(
            "[opt] trial tuned:",
            JSON.stringify(tuned),
            "→ global rmse:",
            globalRMSE,
            safe !== globalRMSE ? "(clamped invalid → ∞)" : ""
          )
          callback(-safe)
        })
        .catch((err) => {
          console.warn(
            "[opt] rejected trial:",
            JSON.stringify(tuned),
            err?.message || err
          )
          callback(-Infinity)
        })
    }

    const opt = new pso.Optimizer()
    // 1. Establish your boundary thresholds
    const maxIterations = 100 // Set an explicit budget for the global exploration phase

    const wStart = 0.9,
      wEnd = 0.4
    const c1Start = 2.0,
      c1End = 0.7 // Personal
    const c2Start = 0.7,
      c2End = 2.0 // Social

    // Initial pass to register options schema
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

    let iter = 0
    while (!signal?.aborted && iter < maxIterations) {
      // 2. Compute dynamic interpolation coefficients based on current timeline
      const progress = iter / (maxIterations - 1 || 1) // Normalized [0, 1] scale

      const currentInertia = wStart - (wStart - wEnd) * progress
      const currentPersonal = c1Start - (c1Start - c1End) * progress
      const currentSocial = c2Start - (c2Start - c2End) * progress

      // 3. Update the optimizer's engine configurations safely
      opt.setOptions({
        inertiaWeight: currentInertia,
        personal: currentPersonal,
        social: currentSocial,
        pressure: 0.5,
      })

      // Fallback: directly mutate properties if the underlying library instances preserve an independent copy
      if (opt._options) {
        opt._options.inertiaWeight = currentInertia
        opt._options.personal = currentPersonal
        opt._options.social = currentSocial
      }

      await new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(new DOMException("Aborted", "AbortError"))
          return
        }
        const onAbort = () => {
          reject(new DOMException("Aborted", "AbortError"))
        }
        signal?.addEventListener("abort", onAbort)
        opt.step(() => {
          signal?.removeEventListener("abort", onAbort)
          resolve()
        })
      })

      iter++

      const bestFitness = opt.getBestFitness()
      const bestPosition = opt.getBestPosition() || initial
      const rmse = bestFitness === -Infinity ? Infinity : -bestFitness

      console.log(
        `[opt] iter ${iter}: bestRmse=${rmse} (w=${currentInertia.toFixed(3)}, c1=${currentPersonal.toFixed(3)}, c2=${currentSocial.toFixed(3)})`
      )

      onStep({ iter, rmse, params: decode(bestPosition, specs) || {} })
      await new Promise((r) => setTimeout(r, 0))
    }
  } finally {
    pool.terminate()
  }
}
