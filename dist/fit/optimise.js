import { Simplex } from 'https://esm.sh/@reside-ic/dfoptim'
import { runSim } from './sim.js'

const encode = (params, specs) =>
  specs.map(s => (params[s.name] - s.min) / (s.max - s.min))

const decode = (norm, specs) =>
  Object.fromEntries(specs.map((s, i) => [s.name, s.min + Math.max(0, Math.min(1, norm[i])) * (s.max - s.min)]))

async function evaluate(norm, specs, simConfig, truth) {
  const tuned = decode(norm, specs)
  const config = { ...simConfig, params: { ...simConfig.params, ...tuned } }
  const { rmse } = await runSim(config, truth)
  return rmse ?? Infinity
}

/**
 * Run Nelder-Mead optimisation asynchronously.
 * Uses a pre-evaluation cache so Simplex can call target() synchronously.
 *
 * @param {object} simConfig
 * @param {Array} truth
 * @param {Array} specs - [{name, min, max}] params to tune
 * @param {function} onStep - ({iter, rmse, params}) called each iteration
 * @param {AbortSignal} signal
 */
export async function runOptimise(simConfig, truth, specs, onStep, signal) {
  const initial = encode(simConfig.params, specs)
  const cache = new Map()
  const key = norm => norm.join(',')

  // Pre-evaluate a point and store in cache
  const preEval = async (norm) => {
    const k = key(norm)
    if (!cache.has(k)) cache.set(k, await evaluate(norm, specs, simConfig, truth))
    return cache.get(k)
  }

  // Synchronous target reads from cache (must be pre-filled)
  const target = (norm) => cache.get(key(norm)) ?? Infinity

  // Pre-fill initial simplex points (constructor evaluates N+1 points)
  const n = initial.length
  await preEval(initial)
  for (let i = 0; i < n; i++) {
    const p = initial.slice()
    p[i] = p[i] ? p[i] * 1.05 : 0.001
    await preEval(p)
    if (signal?.aborted) return
  }

  const opt = new Simplex(target, initial, {})

  let iter = 0
  while (!signal?.aborted) {
    // Pre-fill likely next evaluations: reflect/expand/contract candidates
    // We don't know exactly which points step() will request, so we run
    // step() once, collect any cache misses, pre-fill, then step() again.
    // Simpler: just run step() and accept any misses return Infinity (rare).
    // After step, find the new worst point and pre-eval it.
    const bestBefore = opt.result().location.join(',')
    opt.step()
    iter++

    const res = opt.result()
    onStep({ iter, rmse: res.value, params: decode(res.location, specs) })

    if (res.converged) break

    // Pre-eval any uncached points the next step might need
    const points = opt.simplex().map(p => p.location)
    for (const p of points) {
      if (!cache.has(key(p))) await preEval(p)
    }
    if (signal?.aborted) break
    await new Promise(r => setTimeout(r, 0))
  }
}
