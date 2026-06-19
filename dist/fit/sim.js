import { SimulationRunner } from '../ww.js'
import { computeRMSE } from './rmse.js'

export async function runSim(simConfig, truth, trackAll = false) {
  const runner = new SimulationRunner('../worker.js', false)
  const result = await runner.spawn(simConfig)
  const simTracks = {}
  for (const f of result.frames) {
    for (const b of f.balls) {
      ;(simTracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1], t: f.t })
    }
  }
  const rmse = truth ? computeRMSE(truth, simTracks, trackAll) : null
  return { simTracks, frames: result.frames, rmse }
}
