import { readFileSync, writeFileSync } from 'fs'
import { extractSamples } from './extract.js'

const inputFile = process.argv[2]
const outputFile = process.argv[3] ?? inputFile.replace(/\.txt$/, '.json')

const json = JSON.parse(readFileSync(inputFile, 'utf8'))
const samples = extractSamples(json)

const ballIndices = [...new Set(samples.map(s => s.ball))]
let moverIdx = 0, maxSpeed = 0
const reportLines = []

const ballSummaries = ballIndices.map(ball => {
  const pts = samples.filter(s => s.ball === ball).sort((a, b) => a.t - b.t)
  const xs = pts.map(s => s.x)
  const ys = pts.map(s => s.y)
  const xRange = [Math.min(...xs), Math.max(...xs)]
  const yRange = [Math.min(...ys), Math.max(...ys)]
  const first = pts[0]

  let dir = null, speed = null
  if (pts.length >= 10) {
    const dx = pts[9].x - pts[0].x, dy = pts[9].y - pts[0].y
    const dt = pts[9].t - pts[0].t
    dir = Math.atan2(dy, dx)
    speed = Math.hypot(dx, dy) / dt
    if (speed > maxSpeed) { maxSpeed = speed; moverIdx = ball }
  }

  return { ball, first, dir, speed, pts, xRange, yRange }
})

ballSummaries.forEach(s => {
  const dirStr = s.dir !== null ? `  dir=${s.dir.toFixed(4)}rad  speed=${s.speed.toFixed(3)}m/s${s.ball === moverIdx ? '  → MOVER' : ''}` : ''
  const line = `ball ${s.ball}: ${s.pts.length} samples  x:[${s.xRange[0].toFixed(3)}, ${s.xRange[1].toFixed(3)}]  y:[${s.yRange[0].toFixed(3)}, ${s.yRange[1].toFixed(3)}]${dirStr}`
  console.log(line)
  reportLines.push(line)
})

const moverSummary = ballSummaries.find(s => s.ball === moverIdx)
const cueLine = `\nCue ball: dataset ${moverIdx}`
console.log(cueLine)
reportLines.push(cueLine)

// Remap ball ids so mover → 0, former 0 → moverIdx
const remap = id => id === moverIdx ? 0 : id === 0 ? moverIdx : id
const remappedSamples = samples.map(s => ({ ...s, ball: remap(s.ball) }))

const simBalls = ballSummaries
  .map(({ ball, first }) => ({ id: remap(ball), pos: { x: first.x, y: first.y, z: 0 } }))
  .sort((a, b) => a.id - b.id)

const output = {
  source: inputFile,
  report: reportLines.join('\n'),
  sim: {
    ruleType: "threecushion",
    cushionModel: "mathavan",
    shot: {
      cueBallId: 0,
      angle: moverSummary?.dir ?? 0,
      power: moverSummary?.speed ?? 0,
      offset: { x: 0, y: 0 },
      elevation: 0
    },
    params: {
      mu: 0.0055, muS: 0.126, rho: 0.045,
      m: 0.23,
      μs: 0.2, μw: 0.2, ee: 0.84,
      stronge_omega_ratio: 1.76,
      stronge_e_n: 0.77,
      stronge_μ: 0.25
    },
    stepSize: 0.001953125,
    maxIterations: 20000,
    balls: simBalls,
  },
  truth: remappedSamples
}

writeFileSync(outputFile, JSON.stringify(output, null, 2))
console.log(`\nWrote ${outputFile}`)
