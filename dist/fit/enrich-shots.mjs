#!/usr/bin/env node
// enrich-shots.mjs — Stage 1 of fitplan.md
//
// Enrich every shot in trajectories.json with an estimated `shot` object
// (the exact shape the simulator consumes). Stage 1 is purely kinematic —
// angle + power derived from the cue ball's first samples, no simulation,
// no dependencies. Replicates viewer.html's convertTrajectoryShot (§2.1-2.4).
//
// Usage:
//   node enrich-shots.mjs [input.json] [output.json]
//
// Defaults: trajectories.json -> shots.json (same directory as this script).
// Explicit paths are resolved relative to the current working directory.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const inputPath = args[0]
  ? path.resolve(process.cwd(), args[0])
  : path.join(scriptDir, "trajectories.json")
const outputPath = args[1]
  ? path.resolve(process.cwd(), args[1])
  : path.join(scriptDir, "shots.json")

// --- Viewer logic being replicated (viewer.html -> convertTrajectoryShot) ---

// §2.1 Mover (cue ball): ball with the smallest t[1]; fallback to first key.
function findMover(balls) {
  let moverId = null
  let minT1 = Infinity
  for (const [id, ball] of Object.entries(balls)) {
    if (ball.t.length >= 2 && ball.t[1] < minT1) {
      minT1 = ball.t[1]
      moverId = id
    }
  }
  if (moverId === null) {
    moverId = Object.keys(balls)[0] || "1"
  }
  return moverId
}

// §2.2 Ball mapping (mover -> 0; remaining balls -> 1, 2 sorted by key) and
// §2.3 Truth (flat {ball, t, x, y} samples sorted by t then ball) are consumed
// by Stage 2, which persists mover / ballMapping / truth alongside the fitted
// shot (fitplan §4.4). Stage 1's strict schema only carries id/balls/shot.

// §2.4 Kinematic estimate: angle from the displacement, power from the
// average speed over cue-ball samples 1..5 (t0=1, t1=min(5, len-1)).
function kinematicShot(cueBall) {
  let angle = 0
  let power = 0
  if (cueBall && cueBall.t.length >= 2) {
    const t0 = cueBall.t.length > 1 ? 1 : 0
    const t1 = Math.min(5, cueBall.t.length - 1)
    const dx = cueBall.x[t1] - cueBall.x[t0]
    const dy = cueBall.y[t1] - cueBall.y[t0]
    const dt = cueBall.t[t1] - cueBall.t[t0]
    angle = Math.atan2(dy, dx)
    power = dt > 0 ? Math.hypot(dx, dy) / dt : 0
  }
  return {
    angle,
    power,
    offset: { x: 0, y: 0 },
  }
}

// --- Main ---

let trajectories
try {
  trajectories = JSON.parse(fs.readFileSync(inputPath, "utf8"))
} catch (err) {
  console.error(`Failed to read ${inputPath}: ${err.message}`)
  process.exit(1)
}
if (!Array.isArray(trajectories)) {
  console.error(`${inputPath} does not contain a JSON array`)
  process.exit(1)
}

const entries = []

for (const [idx, traj] of trajectories.entries()) {
  const moverId = findMover(traj.balls) // §2.1
  const shot = kinematicShot(traj.balls[moverId]) // §2.4
  entries.push({ id: traj.id ?? idx, balls: traj.balls, shot })
}

fs.writeFileSync(outputPath, JSON.stringify(entries) + "\n")

// --- Console summary ---

console.log(`Read ${trajectories.length} shots from ${inputPath}`)
console.log(`Wrote ${entries.length} entries to ${outputPath}`)
