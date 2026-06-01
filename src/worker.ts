import { Table } from "./model/table"
import { Ball, State } from "./model/ball"
import { mathavanAdapter, bounceHanBlend, cueStrike } from "./model/physics/physics"
import { Vector3 } from "three"
import { TableGeometry } from "./view/tablegeometry"
import * as Constants from "./model/physics/constants"

self.onmessage = (e) => {
  const startTime = performance.now();
  try {
    const config = e.data
    const { ruleType, balls, cushionModel, shot, stepSize = 0.1, maxIterations = 200000, minIterations = 1000, params = {} } = config

    if (!balls || !shot) {
      throw new Error("Missing required config: balls or shot");
    }

    // Apply physics constant overrides
    for (const [key, value] of Object.entries(params)) {
      const setterName = `set${key}`;
      if (typeof (Constants as any)[setterName] === 'function') {
        (Constants as any)[setterName](Number(value));
      }
    }

    const R = Constants.R;

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
    const ballInstances = balls.map((b: any) => {
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
    while ((iterations < minIterations || !table.allStationary()) && iterations < maxIterations) {
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
      tableX: TableGeometry.tableX,
      tableY: TableGeometry.tableY,
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
