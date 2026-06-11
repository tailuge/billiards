const fs = require('fs')
const path = require('path')

const TABLE_WIDTH = 2.84
const TABLE_HEIGHT = 1.42

const BALL_COLOR_MAP = { '1': 1, '2': 2, '3': 3 }

function convertShot(shot) {
  const dataSets = []

  for (const [ballNum, ball] of Object.entries(shot.balls)) {
    const coords = ball.t.map((t, i) => ({
      DeltaT_500us: Math.round(t * 2000),
      X: ball.x[i] / TABLE_WIDTH,
      Y: ball.y[i] / TABLE_HEIGHT,
    }))

    dataSets.push({
      BallColor: BALL_COLOR_MAP[ballNum],
      coords,
    })
  }

  const maxTimestamp = Math.max(
    ...dataSets.flatMap((ds) => ds.coords.map((c) => c.DeltaT_500us)),
  )

  const ballPositions = {}
  for (const ds of dataSets) {
    const first = ds.coords[0]
    const name =
      ds.BallColor === 1 ? 'White' : ds.BallColor === 2 ? 'Yellow' : 'Red'
    ballPositions[name] = { relX: first.X, relY: first.Y }
  }

  return {
    Path: null,
    PathTracking: {
      DataSets: dataSets.map((ds) => ({
        BallColor: ds.BallColor,
        Coords: ds.coords,
      })),
      MaxTimestamp_500us: maxTimestamp,
      TableHeight: 1421,
      TableWidth: 2840,
    },
    PathTrackingOverview: null,
    Red: ballPositions.Red || null,
    Symbol: null,
    White: ballPositions.White || null,
    Yellow: ballPositions.Yellow || null,
  }
}

const defaultShotsPath = path.join(
  __dirname,
  '..',
  'diagrams',
  'simple_shots.json',
)
const inputPath = process.argv[2] || defaultShotsPath
const shots = JSON.parse(fs.readFileSync(inputPath, 'utf8'))

// When a custom input path is provided, write outputs adjacent to that input.
// Otherwise, preserve the legacy behaviour of writing next to this script.
const outputDir = process.argv[2] ? path.dirname(inputPath) : __dirname
const inputBase = path.basename(inputPath, path.extname(inputPath))
const basePrefix = inputBase.endsWith('s')
  ? inputBase.slice(0, -1)
  : inputBase

console.log(`Reading ${inputPath}`)

for (const shot of shots) {
  const result = convertShot(shot)
  const outPath = path.join(
    outputDir,
    `${basePrefix}_${shot.shotID}.txt`,
  )
  fs.writeFileSync(outPath, JSON.stringify(result, null, 4))
  console.log(`Wrote ${outPath}`)
}
