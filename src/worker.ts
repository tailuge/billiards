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
  const balls: { id: number; pos: number[] }[] = []
  for (let i = 0; i < table.balls.length; i++) {
    const b = table.balls[i]
    balls.push({ id: b.id, pos: [b.pos.x, b.pos.y] })
  }
  return {
    t: table.time / 1000,
    balls,
  }
}

function ballToCushionDist(b: Ball): number {
  return Math.min(
    TableGeometry.tableX - Math.abs(b.pos.x),
    TableGeometry.tableY - Math.abs(b.pos.y)
  )
}

function minTimeToBallCollision(
  bA: Ball,
  vA: number,
  bB: Ball,
  R: number
): number | undefined {
  const dx = bA.pos.x - bB.pos.x
  const dy = bA.pos.y - bB.pos.y
  const dvx = bA.vel.x - bB.vel.x
  const dvy = bA.vel.y - bB.vel.y
  const dot = dx * dvx + dy * dvy
  if (dot >= 0) return undefined
  const vB = bB.vel.length()
  const dist = Math.sqrt(dx * dx + dy * dy)
  return (dist - 2 * R) / (vA + vB)
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
      const tbb = minTimeToBallCollision(bA, vA, bB, R)
      if (tbb !== undefined && tbb < minTime) minTime = tbb
    }
  }
  return minTime === Infinity ? 0 : minTime
}

function getFastWarpTime(table: Table, R: number, clearance: number): number {
  for (let i = 0; i < table.balls.length; i++) {
    const b = table.balls[i]
    if (b.onTable() && b.state === State.Sliding) return 0
  }

  let minTime = Infinity

  for (let i = 0; i < table.balls.length; i++) {
    const bA = table.balls[i]
    if (!bA.onTable() || bA.state !== State.Rolling) continue

    const vA = bA.vel.length()
    if (vA < R / 32) return 0

    const distToCushion = ballToCushionDist(bA)
    if (distToCushion <= clearance - R) return 0

    const tbc = (distToCushion - R) / vA
    if (tbc < minTime) minTime = tbc

    for (let j = 0; j < table.balls.length; j++) {
      if (i === j) continue
      const bB = table.balls[j]
      if (!bB.onTable()) continue

      const dist = bA.pos.distanceTo(bB.pos)
      if (dist <= clearance) return 0

      const tbb = minTimeToBallCollision(bA, vA, bB, R)
      if (tbb !== undefined && tbb < minTime) minTime = tbb
    }
  }

  return minTime === Infinity ? 0 : minTime
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

  // Headless hit logics
  table.time = 0
  const offset = new Vector3(shot.offset.x, shot.offset.y, 0)
  const strike = cueStrike(shot.angle, shot.power, offset, shot.elevation || 0)
  table.cueball.state = State.Sliding
  table.cueball.vel.copy(strike.vel)
  table.cueball.rvel.copy(strike.rvel)

  const { warpClearanceR = 2.5, recordTrajectory = true } = config
  const frames: any[] = recordTrajectory ? [getFrame(table)] : []
  let iterations = 0
  const progressInterval = 10000

  // Simulation loop
  while (!table.allStationary() && iterations < maxIterations) {
    const warpTime = getFastWarpTime(table, R, warpClearanceR * R)
    const dt =
      warpTime > stepSize
        ? Math.min(Math.floor(warpTime / stepSize) * stepSize, 25 * stepSize)
        : stepSize

    table.advance(dt)

    if (recordTrajectory) {
      frames.push(getFrame(table))
    }

    iterations++

    if (iterations % progressInterval === 0) {
      checkpoint("Iteration progress", { iterations, t: table.time })
    }
  }

  const baselineIterations = table.time / (stepSize * 1000)
  const speedupFactor = iterations > 0 ? baselineIterations / iterations : 1

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
      cushion: o.cushion,
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
