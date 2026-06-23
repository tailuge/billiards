/**
 * Billiards Shot DSL Parser
 *
 * Converts compact shot descriptions into SimulationConfig objects.
 *
 * DSL format — one shot per line, separated by semicolons:
 *
 *   GEOMETRY | SPIN | SPEED
 *
 * GEOMETRY:  <rail>:<diamond> -> <rail>:<diamond> @<inset>
 *   Rail: top, bottom, left, right
 *   Diamond indices: 0-8 for top/bottom, 0-4 for left/right
 *   Inset: number of ball radii (R) along the line from start toward target
 *
 * SPIN:      <clock> oclock <strength>
 *   Clock: hour (12=top, 3=right, 6=bottom, 9=left), fractional like 4:30
 *   Strength: "max" or percentage like "80%"
 *
 * SPEED:     <value>
 *   Value: percentage like "50%", or word: slow, medium, fast
 *
 * Example:
 *   bottom:0 -> top:5 @4R | 3 oclock max | 50%; bottom:2 -> top:3 @2R | 12 oclock 80% | medium
 */

// ——— Physical constants (SI meters) ———
const R = 0.03275
const UMB_TABLE_X = 92.36
const UMB_TABLE_Y = 46.18
const tableX = R * (UMB_TABLE_X / 2 - 1)
const tableY = R * (UMB_TABLE_Y / 2 - 1)
const X = tableX + R // 1.512395 — half-width of playing area
const Y = tableY + R // 0.7561975 — half-height of playing area
const gridInterval = (2 * X) / 8 // 0.37809875
const dOffset = 0.1 // diamond offset from cushion nose
const maxPower = 160 * R // 5.24 m/s

// Default physics params (matching ww.html)
const defaultParams = {
  mu: 0.007,
  muS: 0.136,
  rho: 0.035,
  m: 0.23,
  R: 0.03275,
  e: 0.86,
  ee: 0.84,
  μs: 0.2,
  μw: 0.2,
}

// ——— Diamond positions in physics coordinates ———

function diamondPos(rail, index) {
  switch (rail) {
    case "top":
      return { x: (index - 4) * gridInterval, y: Y + dOffset }
    case "bottom":
      return { x: (index - 4) * gridInterval, y: -(Y + dOffset) }
    case "left":
      return { x: -(X + dOffset), y: (index - 2) * gridInterval }
    case "right":
      return { x: X + dOffset, y: (index - 2) * gridInterval }
    default:
      throw new Error(`Unknown rail: "${rail}"`)
  }
}

// ——— Spin parsing ———

function parseClock(str) {
  if (str.includes(":")) {
    const [h, m] = str.split(":").map(Number)
    return h + m / 60
  }
  return Number(str)
}

function parseStrength(str) {
  if (str === "max") return 1.0
  return parseInt(str) / 100
}

function parseSpin(clockStr, strengthStr) {
  const hour = parseClock(clockStr)
  // Angle clockwise from 12 o'clock (0 at top, π/2 at right)
  const angle = hour * (Math.PI / 6)
  const s = parseStrength(strengthStr)
  return {
    x: Math.sin(angle) * s * 0.5,
    y: Math.cos(angle) * s * 0.5,
  }
}

// ——— Speed parsing ———

function parseSpeed(str) {
  if (str === "slow") return 0.25 * maxPower
  if (str === "medium") return 0.5 * maxPower
  if (str === "fast") return 0.75 * maxPower
  return (parseInt(str) / 100) * maxPower
}

// ——— Geometry parsing ———

function parseGeometry(rail1, d1, rail2, d2, inset) {
  const start = diamondPos(rail1, d1)
  const target = diamondPos(rail2, d2)

  // Unit vector from start toward target
  const dx = target.x - start.x
  const dy = target.y - start.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) throw new Error("Start and target diamonds are the same")

  const ux = dx / dist
  const uy = dy / dist

  // Cue ball position: start + inset * R along the direction
  const cueX = start.x + ux * inset * R
  const cueY = start.y + uy * inset * R

  // Shot angle: direction from cue ball toward target
  const angle = Math.atan2(target.y - cueY, target.x - cueX)

  return { cueX, cueY, angle }
}

// ——— Shot parsing ———

const GEOM_RE =
  /^(bottom|top|left|right):(\d+)\s*->\s*(bottom|top|left|right):(\d+)\s*@(\d+)R$/
const SPIN_RE = /^(\d+(?::\d+)?)\s*oclock\s*(max|\d+%)$/
const SPEED_RE = /^(\d+%|slow|medium|fast)$/

function parseShot(str) {
  const parts = str.split("|").map((s) => s.trim())
  if (parts.length !== 3) {
    throw new Error(
      `Invalid shot format (expected 3 sections separated by |): "${str}"`
    )
  }

  const [geomStr, spinStr, speedStr] = parts

  // Geometry
  const geomMatch = geomStr.match(GEOM_RE)
  if (!geomMatch) {
    throw new Error(
      `Invalid geometry (expected "<rail>:<diamond> -> <rail>:<diamond> @<n>R"): "${geomStr}"`
    )
  }
  const [, rail1, d1, rail2, d2, inset] = geomMatch
  const { cueX, cueY, angle } = parseGeometry(
    rail1,
    parseInt(d1),
    rail2,
    parseInt(d2),
    parseInt(inset)
  )

  // Spin
  const spinMatch = spinStr.match(SPIN_RE)
  if (!spinMatch) {
    throw new Error(
      `Invalid spin (expected "<clock> oclock <max|N%>"): "${spinStr}"`
    )
  }
  const [, clockStr, strengthStr] = spinMatch
  const offset = parseSpin(clockStr, strengthStr)

  // Speed
  const speedMatch = speedStr.match(SPEED_RE)
  if (!speedMatch) {
    throw new Error(
      `Invalid speed (expected "<N%|slow|medium|fast>"): "${speedStr}"`
    )
  }
  const power = parseSpeed(speedMatch[1])

  return { cueX, cueY, angle, offsetX: offset.x, offsetY: offset.y, power }
}

// ——— Public API ———

/**
 * Parse a DSL shot string into an array of SimulationConfig objects.
 *
 * @param {string} dslText — semicolon-separated shot descriptions
 * @returns {Array} Array of SimulationConfig objects for the physics worker
 */
export function parseShots(dslText) {
  if (!dslText || !dslText.trim()) return []

  const shotStrings = dslText
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s)

  return shotStrings.map((str, i) => {
    const shot = parseShot(str)
    return {
      id: i,
      ruleType: "threecushion",
      balls: [{ id: 0, pos: { x: shot.cueX, y: shot.cueY, z: 0 } }],
      cushionModel: "mathavan",
      shot: {
        cueBallId: 0,
        angle: shot.angle,
        power: shot.power,
        offset: { x: shot.offsetX, y: shot.offsetY },
        elevation: 0,
      },
      stepSize: 0.001953125,
      maxIterations: 20000,
      warpClearanceR: 2.5,
      params: defaultParams,
    }
  })
}
