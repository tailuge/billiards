import { Simplex } from 'https://esm.sh/@reside-ic/dfoptim'
import { computeRMSE } from './rmse.js'

const encode = (params, specs) =>
  specs.map(s => (params[s.name] - s.min) / (s.max - s.min))

const decode = (norm, specs) =>
  Object.fromEntries(specs.map((s, i) => [s.name, s.min + Math.max(0, Math.min(1, norm[i])) * (s.max - s.min)]))

function runSimSync(simConfig, truth) {
  const result = window.simulateSync(simConfig)
  const simStep = simConfig.stepSize ?? 0.001953125
  const simTracks = {}
  for (const f of result.frames) {
    for (const b of f.balls) {
      ;(simTracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1] })
    }
  }
  const rmse = truth ? computeRMSE(truth, simTracks, simStep) : null
  return { simTracks, simStep, frames: result.frames, rmse }
}

/**
 * Run Nelder-Mead optimisation using synchronous simulateSync on the main thread.
 * Yields to the browser between iterations to keep the UI responsive.
 *
 * @param {object} simConfig
 * @param {Array} truth
 * @param {Array} specs - [{name, min, max}] params to tune
 * @param {function} onStep - ({iter, rmse, params}) called each iteration
 * @param {AbortSignal} signal
 */
export async function runOptimise(simConfig, truth, specs, onStep, signal) {
  const initial = encode(simConfig.params, specs)

  // Synchronous target function — no Worker, no cache needed
  const target = (norm) => {
    const tuned = decode(norm, specs)
    const config = { ...simConfig, params: { ...simConfig.params, ...tuned } }
    const { rmse } = runSimSync(config, truth)
    return rmse ?? Infinity
  }

  const opt = new Simplex(target, initial, {})

  let iter = 0
  while (!signal?.aborted) {
    opt.step()
    iter++

    const res = opt.result()
    onStep({ iter, rmse: res.value, params: decode(res.location, specs) })

    if (res.converged) break

    // Yield to browser so UI repaints and abort signal can be checked
    await new Promise(r => setTimeout(r, 0))
  }
}

