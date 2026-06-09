import { Table } from "./model/table"
import { Ball, State } from "./model/ball"
import { mathavanAdapter, cueStrike } from "./model/physics/physics"
import { Vector3 } from "three"
import { TableGeometry } from "./view/tablegeometry"
import * as Constants from "./model/physics/constants"
import { strongeAdapter } from "./model/physics/stronge"

const isWorkerContext =
  typeof (globalThis as any).WorkerGlobalScope !== "undefined" &&
  self instanceof (globalThis as any).WorkerGlobalScope

function checkpoint(label: string, detail?: Record<string, unknown>) {
  console.log(`[worker] ${label}`, detail ?? "")
  if (isWorkerContext) {
    const msg = { type: "CHECKPOINT", label, t: performance.now(), ...detail }
    self.postMessage(msg)
  }
}

export function simulateSync(config: any): any {
  const startTime = performance.now()
  const {
    id,
    ruleType,
    balls,
    cushionModel,
    shot,
    stepSize = 0.001953125,
    maxIterations = 200000,
    params = {},
  } = config

  if (!balls || !shot) {
    throw new Error("Missing required config: balls or shot")
  }

  checkpoint("Inputs received", { configKeys: Object.keys(config), id })

  // Apply physics constant overrides
  for (const [key, value] of Object.entries(params)) {
    const setterName = `set${key}`
    if (typeof (Constants as any)[setterName] === "function") {
      ;(Constants as any)[setterName](Number(value))
    }
  }
  checkpoint("Constants set", { params, R: Constants.R })

  const R = Constants.R

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
  checkpoint("Table geometry set", {
    ruleType,
    tableX: TableGeometry.tableX,
    tableY: TableGeometry.tableY,
  })

  // Initialize balls — reset static counter so IDs are stable across repeated calls
  Ball.id = 0
  const ballInstances = balls.map((b: any) => {
    const ball = new Ball(
      new Vector3(b.pos.x, b.pos.y, b.pos.z),
      0xffffff,
      b.id
    )
    return ball
  })

  const table = new Table(ballInstances)

  // Configure cushion model
  if (cushionModel === "mathavan") {
    table.cushionModel = mathavanAdapter
  } else {
    table.cushionModel = strongeAdapter
  }

  table.cueball =
    table.balls.find((b) => b.id === shot.cueBallId) || table.balls[0]

  // Headless hit logic
  table.time = 0
  const offset = new Vector3(shot.offset.x, shot.offset.y, 0)
  const strike = cueStrike(shot.angle, shot.power, offset, shot.elevation || 0)
  table.cueball.state = State.Sliding
  table.cueball.vel.copy(strike.vel)
  table.cueball.rvel.copy(strike.rvel)
  checkpoint("Strike applied", {
    vel: [strike.vel.x, strike.vel.y, strike.vel.z],
  })

  const frames: any[] = []
  let iterations = 0
  const progressInterval = 10000

  // Simulation loop
  while (!table.allStationary() && iterations < maxIterations) {
    table.advance(stepSize)

    frames.push({
      t: table.time,
      balls: table.balls.map((b) => ({
        id: b.id,
        pos: [b.pos.x, b.pos.y, b.pos.z],
        rvel: [b.rvel.x, b.rvel.y, b.rvel.z],
        state: b.state,
      })),
    })

    iterations++

    if (iterations % progressInterval === 0) {
      checkpoint("Iteration progress", { iterations, t: table.time })
    }
  }

  checkpoint("Simulation loop complete", {
    totalIterations: iterations,
    simTime: table.time,
  })

  const endTime = performance.now()
  const result = {
    type: "COMPLETE",
    id,
    computeTime: `${Math.round(endTime - startTime)}ms`,
    tableX: TableGeometry.tableX,
    tableY: TableGeometry.tableY,
    frames,
    outcomes: table.outcome.map((o) => ({
      type: o.type,
      ballA: o.ballA?.id,
      ballB: o.ballB?.id,
      speed: o.incidentSpeed,
      t: o.timestamp,
    })),
  }
  console.log(
    `[worker] COMPLETE computeTime=${result.computeTime} frames=${frames.length}`
  )
  return result
}

if (isWorkerContext) {
  checkpoint("worker.js loaded")
  self.onmessage = (e) => {
    try {
      const result = simulateSync(e.data)
      self.postMessage(result)
    } catch (error: any) {
      console.error(`[worker] ERROR`, error)
      self.postMessage({
        type: "ERROR",
        id: e.data?.id,
        error: error.message,
        stack: error.stack,
      })
    }
  }
} else {
  ;(self as any).simulateSync = simulateSync
}
