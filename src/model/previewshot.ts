import { Table } from "./table"
import { State } from "./ball"
import { Outcome } from "./outcome"
import { cueStrike } from "./physics/physics"

/**
 * Simulate the cue's current aim on the main thread, leaving the trajectory
 * traces visible while restoring the balls to their starting positions. Returns
 * the shot's outcomes (a snapshot, since `table.outcome` is restored afterwards)
 * on success, or null if the physics threw. Callers that only need a success
 * flag can treat the return value as truthy/falsy.
 */
export function previewShot(table: Table, dt: number): Outcome[] | null {
  const saved = table.balls.map((b) => ({
    pos: b.pos.clone(),
    vel: b.vel.clone(),
    rvel: b.rvel.clone(),
    state: b.state,
    pocket: b.pocket,
  }))
  const savedOutcome = table.outcome

  let captured: Outcome[] | null = null
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

    // dt is the live game's fixed physics step (Container.step), so the
    // previewed trajectory reproduces the actual shot exactly — a coarser step
    // resolves collisions early and diverges over multi-cushion shots.
    const maxSteps = Math.ceil(42 / dt) // cap simulated duration (~42s), step-agnostic
    for (let i = 0; i < maxSteps && !table.allStationary(); i++) {
      table.advance(dt)
      table.updateBallMesh(dt)
    }
    captured = table.outcome.slice()
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
    if (!captured) {
      table.balls.forEach((b) => {
        b.ballmesh.trace.line.visible = false
        b.ballmesh.trace.reset()
      })
    }
  }
  return captured
}
