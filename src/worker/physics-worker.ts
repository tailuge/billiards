import { Table } from "../model/table"
import { Ball } from "../model/ball"
import { AimEvent } from "../events/aimevent"
import { mathavanAdapter, bounceHanBlend } from "../model/physics/physics"
import { Vector3 } from "three"
import { RuleFactory } from "../controller/rules/rulefactory"

self.onmessage = (e) => {
  try {
    const config = e.data
    const { ruleType, balls, cushionModel, shot, stepSize = 0.001953125, maxIterations = 200000 } = config

    // Setup rules and table geometry
    const rules = RuleFactory.create(ruleType || "nineball", null);
    if (rules.tableGeometry) {
      rules.tableGeometry();
    }

    // Initialize balls
    const ballInstances = balls.map((b) => {
      const ball = new Ball(new Vector3(b.pos.x, b.pos.y, b.pos.z), 0xffffff, b.id)
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
          rvel: [b.rvel.x, b.rvel.y, b.rvel.z]
        }))
      })

      iterations++
    }

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
    self.postMessage({ type: "ERROR", error: error.message, stack: error.stack })
  }
}
