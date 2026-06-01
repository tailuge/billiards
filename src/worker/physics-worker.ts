import { Table } from "../model/table"
import { Ball, State } from "../model/ball"
import { mathavanAdapter, bounceHanBlend, cueStrike } from "../model/physics/physics"
import { Vector3 } from "three"
import { TableGeometry } from "../view/tablegeometry"
import { R } from "../model/physics/constants"

self.onmessage = (e) => {
  const startTime = performance.now();
  try {
    const config = e.data
    const { ruleType, balls, cushionModel, shot, stepSize = 0.001953125, maxIterations = 200000 } = config

    if (!balls || !shot) {
      throw new Error("Missing required config: balls or shot");
    }

    // Setup table geometry manually to avoid RuleFactory/heavy dependencies
    if (ruleType === "threecushion") {
      const UMB_TABLE_X = 92.36
      const UMB_TABLE_Y = 46.18
      TableGeometry.tableX = R * (UMB_TABLE_X / 2 - 1)
      TableGeometry.tableY = R * (UMB_TABLE_Y / 2 - 1)
      TableGeometry.X = TableGeometry.tableX + R
      TableGeometry.Y = TableGeometry.tableY + R
      TableGeometry.hasPockets = false
    } else {
      TableGeometry.tableX = R * 43
      TableGeometry.tableY = R * 21
      TableGeometry.X = TableGeometry.tableX + R
      TableGeometry.Y = TableGeometry.tableY + R
      TableGeometry.hasPockets = true
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

    table.cueball = table.balls.find(b => b.id === shot.cueBallId) || table.balls[0]

    // Headless hit logic
    table.time = 0
    const offset = new Vector3(shot.offset.x, shot.offset.y, 0)
    const strike = cueStrike(shot.angle, shot.power, offset, shot.elevation || 0)
    table.cueball.state = State.Sliding
    table.cueball.vel.copy(strike.vel)
    table.cueball.rvel.copy(strike.rvel)

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
          rvel: [b.rvel.x, b.rvel.y, b.rvel.z],
          state: b.state
        }))
      })

      iterations++
    }

    const endTime = performance.now();
    self.postMessage({
      type: "SIM_COMPLETE",
      computeTime: `${Math.round(endTime - startTime)}ms`,
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
