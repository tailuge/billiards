import { Table } from "./table"
import { State } from "./ball"
import { cueStrike } from "./physics/physics"

export function previewShot(table: Table): boolean {
  const saved = table.balls.map((b) => ({
    pos: b.pos.clone(),
    vel: b.vel.clone(),
    rvel: b.rvel.clone(),
    state: b.state,
    pocket: b.pocket,
  }))
  const savedOutcome = table.outcome

  let success = false
  try {
    table.outcome = []
    table.balls.forEach((b) => {
      b.ballmesh.trace.reset()
      b.ballmesh.trace.line.visible = true
    })

    const cueball = table.cueball
    const { angle, power, offset, elevation } = table.cue.aim
    cueball.state = State.Sliding
    const strike = cueStrike(angle, power, offset, elevation)
    cueball.vel.copy(strike.vel)
    cueball.rvel.copy(strike.rvel)

    const dt = 1 / 240
    for (let i = 0; i < 10000 && !table.allStationary(); i++) {
      table.advance(dt)
      table.updateBallMesh(dt)
    }
    success = true
  } catch {
    // physics error (e.g. depth exceeded for close-together balls) — restore below
  } finally {
    table.balls.forEach((b, i) => {
      b.pos.copy(saved[i].pos)
      b.vel.copy(saved[i].vel)
      b.rvel.copy(saved[i].rvel)
      b.state = saved[i].state
      b.pocket = saved[i].pocket
      b.ballmesh.updatePosition(b.pos)
    })
    table.outcome = savedOutcome
    table.proximityIndicator.hide()
    if (!success) {
      table.balls.forEach((b) => {
        b.ballmesh.trace.line.visible = false
        b.ballmesh.trace.reset()
      })
    }
  }
  return success
}
