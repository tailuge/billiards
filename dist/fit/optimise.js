import { Simplex } from 'https://esm.sh/@reside-ic/dfoptim'
import pso from 'https://esm.sh/pso'
import { computeRMSE } from './rmse.js'

const getValue = (simConfig, name) => {
  if (name.startsWith('shot.')) {
    const path = name.split('.').slice(1)
    let curr = simConfig.shot
    for (const p of path) curr = curr[p]
    return curr
  }
  return simConfig.params[name]
}

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
  const trackKeys = Object.keys(simTracks)
  const track0len = simTracks[0]?.length ?? 'MISSING'
  const rawRmse = truth ? computeRMSE(truth, simTracks, simStep) : 'NO_TRUTH'
  console.log(`[runSimSync] frames=${result.frames.length} trackKeys=${JSON.stringify(trackKeys)} track0len=${track0len} truth=${!!truth} rawRmse=${rawRmse}`)
  const rmse = truth ? rawRmse : null
  return { simTracks, simStep, frames: result.frames, rmse }
}

function makeTarget(simConfig, truth, specs) {
  let lastRmse = Infinity
  const target = (norm) => {
    const tuned = decode(norm, specs)
    const config = JSON.parse(JSON.stringify(simConfig))
    for (const [name, val] of Object.entries(tuned)) {
      if (name.startsWith('shot.')) {
        const path = name.split('.').slice(1)
        let curr = config.shot
        for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]]
        curr[path[path.length - 1]] = val
      } else {
        config.params[name] = val
      }
    }
    const { rmse } = runSimSync(config, truth)
    lastRmse = rmse ?? Infinity
    console.log('[opt] trial tuned:', JSON.stringify(tuned), '→ rmse:', lastRmse)
    return lastRmse
  }
  return target
}

function makeInitial(simConfig, specs) {
  return specs.map(s => {
    const val = getValue(simConfig, s.name)
    return (val - s.min) / (s.max - s.min)
  })
}

export async function runOptimiseNM(simConfig, truth, specs, onStep, signal) {
  const initial = makeInitial(simConfig, specs)
  const target = makeTarget(simConfig, truth, specs)
  const opt = new Simplex(target, initial, {})

  let iter = 0
  while (!signal?.aborted) {
    opt.step()
    iter++
    const res = opt.result()
    console.log(`[opt] iter ${iter}: res.value (best-so-far)=${res.value}, converged=${res.converged}`)
    onStep({ iter, rmse: res.value, params: decode(res.location, specs) })
    if (res.converged) break
    await new Promise(r => setTimeout(r, 0))
  }
}

export async function runOptimisePSO(simConfig, truth, specs, onStep, signal) {
  const initial = makeInitial(simConfig, specs)
  const target = makeTarget(simConfig, truth, specs)

  const opt = new pso.Optimizer()
  opt.setOptions({ inertiaWeight: 0.8, social: 0.4, personal: 0.4, pressure: 0.5 })
  opt.setObjectiveFunction((norm) => -target(norm))

  const intervals = specs.map(() => ({ start: 0, end: 1 }))
  const populationSize = Math.max(15, specs.length * 3)

  let particleIdx = 0
  opt.init(populationSize, () => {
    if (particleIdx++ === 0) {
      return new pso.Particle(initial.slice(), initial.map(() => 0), opt._options)
    }
    return pso.Particle.createRandom(intervals, opt._options, opt.rng.random)
  })

  let iter = 0
  while (!signal?.aborted && iter < 200) {
    opt.step()
    iter++
    const bestFitness = opt.getBestFitness()
    const bestPosition = opt.getBestPosition() || initial
    const rmse = bestFitness === -Infinity ? Infinity : -bestFitness
    console.log(`[opt] iter ${iter}: bestRmse=${rmse}`)
    onStep({ iter, rmse, params: decode(bestPosition, specs) })
    await new Promise(r => setTimeout(r, 0))
  }
}
