import { SimulationRunner } from '../ww.js'
import { computeRMSE } from './rmse.js'

export async function runSim(simConfig, truth, trackAll = false) {
  const runner = new SimulationRunner('../worker.js', false)
  const result = await runner.spawn(simConfig)
  const simStep = simConfig.stepSize ?? 0.001953125
  const simTracks = {}
  for (const f of result.frames) {
    for (const b of f.balls) {
      ;(simTracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1] })
    }
  }
  const rmse = truth ? computeRMSE(truth, simTracks, simStep, trackAll) : null
  return { simTracks, simStep, frames: result.frames, rmse }
}
