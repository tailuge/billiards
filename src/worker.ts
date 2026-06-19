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
  if (isWorkerContext) {
    const msg = { type: "CHECKPOINT", label, t: performance.now(), ...detail }
    self.postMessage(msg)
  }
}

function getFrame(table: Table) {
  return {
    t: table.time / 1000,
    balls: table.balls.map((b) => ({
      id: b.id,
      pos: [b.pos.x, b.pos.y],
    })),
  }
}

function ballToCushionDist(b: Ball): number {
  return Math.min(
    TableGeometry.tableX - Math.abs(b.pos.x),
    TableGeometry.tableY - Math.abs(b.pos.y)
  )
}

function anyCushionTooClose(
  rollingBalls: Ball[],
  clearance: number,
  R: number
): boolean {
  return rollingBalls.some((b) => ballToCushionDist(b) <= clearance - R)
}

function anyBallTooClose(
  rollingBalls: Ball[],
  allBalls: Ball[],
  clearance: number
): boolean {
  return rollingBalls.some((bA) =>
    allBalls.some((bB) => bA !== bB && bA.pos.distanceTo(bB.pos) <= clearance)
  )
}

export function calcMinWarpTime(
  rollingBalls: Ball[],
  allBalls: Ball[],
  R: number
): number {
  let minTime = Infinity
  for (const bA of rollingBalls) {
    const vA = bA.vel.length()
    if (vA === 0) continue

    const tbc = (ballToCushionDist(bA) - R) / vA
    if (tbc < minTime) minTime = tbc

    for (const bB of allBalls) {
      if (bA === bB) continue

      const dx = bA.pos.x - bB.pos.x
      const dy = bA.pos.y - bB.pos.y
      const dvx = bA.vel.x - bB.vel.x
      const dvy = bA.vel.y - bB.vel.y
      const dot = dx * dvx + dy * dvy

      if (dot >= 0) continue

      const vB = bB.vel.length()
      const dist = Math.sqrt(dx * dx + dy * dy)
      const tbb = (dist - 2 * R) / (vA + vB)
      if (tbb < minTime) minTime = tbb
    }
  }
  return minTime === Infinity ? 0 : minTime
}

function getFastWarpTime(table: Table, R: number, clearance: number): number {
  const balls = table.balls.filter((b) => b.onTable())

  if (balls.some((b) => b.state === State.Sliding)) {
    return 0
  }

  const rollingBalls = balls.filter((b) => b.state === State.Rolling)

  if (rollingBalls.some((b) => b.vel.length() < R)) {
    return 0
  }

  if (anyCushionTooClose(rollingBalls, clearance, R)) {
    return 0
  }

  if (anyBallTooClose(rollingBalls, balls, clearance)) {
    return 0
  }

  return calcMinWarpTime(rollingBalls, balls, R)
}

function configureSimulation(
  params: Record<string, unknown>,
  ruleType: string,
  table: Table,
  cushionModel: string
): number {
  for (const [key, value] of Object.entries(params)) {
    const setterName = `set${key}`
    if (typeof (Constants as any)[setterName] === "function") {
      ;(Constants as any)[setterName](Number(value))
    }
  }

  const R = Constants.R

  TableGeometry.configureForRule(ruleType)

  if (cushionModel === "mathavan") {
    table.cushionModel = mathavanAdapter
  } else {
    table.cushionModel = strongeAdapter
  }

  return R
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

  Ball.id = 0
  const ballInstances = balls.map((b: any) => {
    const ball = new Ball(new Vector3(b.pos.x, b.pos.y, 0), 0xffffff, b.id)
    return ball
  })

  const table = new Table(ballInstances)
  const R = configureSimulation(params, ruleType, table, cushionModel)

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

  const frames: any[] = [getFrame(table)]
  const { warpClearanceR = 1.125 } = config // default off until fixed
  let iterations = 0
  const progressInterval = 10000

  // Simulation loop
  while (!table.allStationary() && iterations < maxIterations) {
    const warpTime = getFastWarpTime(table, R, warpClearanceR * R)
    const dt =
      warpTime > stepSize
        ? Math.floor(warpTime / stepSize) * stepSize
        : stepSize

    table.advance(dt)

    frames.push(getFrame(table))

    iterations++

    if (iterations % progressInterval === 0) {
      checkpoint("Iteration progress", { iterations, t: table.time })
    }
  }

  const baselineIterations = table.time / (stepSize * 1000)
  const speedupFactor = iterations > 0 ? baselineIterations / iterations : 1

  checkpoint("Simulation loop complete", {
    totalIterations: iterations,
    simTime: table.time,
    speedupFactor: speedupFactor.toFixed(2) + "x",
  })

  const endTime = performance.now()
  const result = {
    type: "COMPLETE",
    id,
    computeTime: `${Math.round(endTime - startTime)}ms`,
    simulatedTime: table.time,
    actualIterations: iterations,
    speedupFactor: speedupFactor.toFixed(2) + "x",
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
