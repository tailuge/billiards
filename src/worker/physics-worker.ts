import { Table } from "../model/table"
import { Ball } from "../model/ball"
import { AimEvent } from "../events/aimevent"
import { mathavanAdapter, bounceHanBlend } from "../model/physics/physics"
import { Vector3 } from "three"

console.log("Worker script loaded");

self.onmessage = (e) => {
  console.log("Worker received message", e.data);
  try {
    const config = e.data
    const { balls, cushionModel, shot, stepSize = 0.001953125, maxIterations = 200000 } = config

    // Initialize balls
    const ballInstances = balls.map((b) => {
      const ball = new Ball(new Vector3(b.pos.x, b.pos.y, b.pos.z), b.color, b.id)
      ball.id = b.id
      return ball
    })

    const table = new Table(ballInstances)

    // Configure cushion model
    if (cushionModel === "mathavan") {
      table.cushionModel = mathavanAdapter
    } else {
      table.cushionModel = bounceHanBlend
    }

    // Setup shot
    const aim = new AimEvent()
    aim.angle = shot.angle
    aim.power = shot.power
    aim.offset = new Vector3(shot.offset.x, shot.offset.y, 0)
    aim.elevation = shot.elevation || 0

    table.cue.aim = aim
    table.cueball = table.balls.find(b => b.id === shot.cueBallId) || table.balls[0]

    // Execute hit
    table.hit()

    const frames: any[] = []
    let iterations = 0

    // Simulation loop
    while (!table.allStationary() && iterations < maxIterations) {
      table.advance(stepSize)

      frames.push({
        t: table.time,
        balls: table.balls.map(b => ({
          id: b.id,
          pos: [b.pos.x, b.pos.y, b.pos.z],
          vel: [b.vel.x, b.vel.y, b.vel.z],
          rvel: [b.rvel.x, b.rvel.y, b.rvel.z]
        }))
      })

      iterations++
    }

    console.log("Simulation complete", frames.length);
    self.postMessage({
      type: "SIM_COMPLETE",
      frames,
      outcomes: table.outcome.map(o => ({
        type: o.type,
        ballA: o.ballA?.id,
        ballB: o.ballB?.id,
        speed: o.incidentSpeed,
        t: o.timestamp
      }))
    })
  } catch (error: any) {
    console.error("Worker Error", error);
    self.postMessage({ type: "ERROR", error: error.message, stack: error.stack })
  }
}
