/**
 * Billiards SVG Diagram Engine
 *
 * Imported by diagram HTML files. Finds all .billiards-table elements,
 * renders the table to SVG, parses data-shots via dsl.js, runs the
 * physics worker, and draws ball trajectories.
 *
 * SVG root usage:
 *    <svg class="billiards-table" data-shots="..."></svg>
 *    The SVG is the root — JS creates <g> children and status <text>.
 *
 * <script type="module">
 *   import { initDiagrams } from "./svg.js"
 *   initDiagrams()
 * </script>
 */

import { SimulationRunner } from "../ww.js"
import { parseShots, maxPower } from "./dsl.js"

// ——— Table geometry (SI meters) ———

const R = 0.03275
const UMB_TABLE_X = 92.36
const UMB_TABLE_Y = 46.18
const tableX = R * (UMB_TABLE_X / 2 - 1)
const tableY = R * (UMB_TABLE_Y / 2 - 1)
const X = tableX + R
const Y = tableY + R

// Fixed calibration (matches default slider midpoints from original)
const cOffset = 0.06
const dOffset = 0.1
const fOffset = 0.18
const dSize = 0.01

const SVG_NS = "http://www.w3.org/2000/svg"

// ——— Table rendering ———

function generateBilliardTable() {
  const width = X * 2
  const height = Y * 2

  const maxOffset = Math.max(fOffset, dOffset + 0.015)
  const pad = 0.18
  const viewBoxWidth = (X + maxOffset + pad) * 2
  const viewBoxHeight = (Y + maxOffset + pad) * 2
  const viewBoxX = -viewBoxWidth / 2
  const viewBoxY = -viewBoxHeight / 2

  let svgContent = ""

  // Outer frame
  const fx = -X - fOffset
  const fy = -Y - fOffset
  const fw = width + fOffset * 2
  const fh = height + fOffset * 2
  svgContent += `  <rect id="outer-frame" x="${fx}" y="${fy}" width="${fw}" height="${fh}" class="table-stroke" />\n`

  // Cushion border
  const cx = -X - cOffset
  const cy = -Y - cOffset
  const cw = width + cOffset * 2
  const ch = height + cOffset * 2
  svgContent += `  <rect id="cushion-border" x="${cx}" y="${cy}" width="${cw}" height="${ch}" class="table-stroke" />\n`

  // Playing area
  svgContent += `  <rect id="playing-area" x="${-X}" y="${-Y}" width="${width}" height="${height}" class="table-stroke" />\n`

  // Grid lines
  const gridInterval = (2 * X) / 8
  svgContent += '  <g id="table-grid-lines">\n'
  for (let i = -3; i <= 3; i++) {
    const x = i * gridInterval
    svgContent += `    <line x1="${x}" y1="${-Y}" x2="${x}" y2="${Y}" class="grid-line" />\n`
  }
  for (let i = -1; i <= 1; i++) {
    const y = i * gridInterval
    svgContent += `    <line x1="${-X}" y1="${y}" x2="${X}" y2="${y}" class="grid-line" />\n`
  }
  svgContent += "  </g>\n"

  // Diamonds
  svgContent += '  <g id="diamonds-group">\n'
  function drawDiamond(x, y) {
    return `    <polygon points="${x},${y - dSize} ${x + dSize},${y} ${x},${y + dSize} ${x - dSize},${y}" fill="none" stroke="#000000" stroke-width="0.002" />\n`
  }
  for (let i = -4; i <= 4; i++) {
    const x = i * gridInterval
    svgContent += drawDiamond(x, -Y - dOffset)
    svgContent += drawDiamond(x, Y + dOffset)
  }
  for (let i = -2; i <= 2; i++) {
    const y = i * gridInterval
    svgContent += drawDiamond(-X - dOffset, y)
    svgContent += drawDiamond(X + dOffset, y)
  }
  svgContent += "  </g>\n"

  return {
    viewBox: `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
    content: svgContent,
  }
}

// ——— Trajectory rendering ———

function renderTrajectories(trajectoriesGroup, results) {
  let svgContent = ""

  results.forEach((result) => {
    const path = []
    result.frames.forEach((frame) => {
      const ball0 = frame.balls.find((b) => b.id === 0)
      if (ball0) path.push(ball0.pos)
    })

    if (path.length < 2) return

    const points = path.map((p) => `${p[0]},${p[1]}`).join(" ")
    svgContent += `  <polyline points="${points}" class="trajectory-line" />\n`
  })

  trajectoriesGroup.innerHTML = svgContent
}

function renderInset(insetGroup, config) {
  const ballR = 0.04
  const dotR = 0.005
  const barW = 0.08
  const barH = 0.01

  const { offset, power } = config.shot

  let svgContent = ""

  // Cue ball circle
  svgContent += `  <circle cx="0" cy="0" r="${ballR}" fill="#fff" stroke="#000" stroke-width="0.002" />\n`

  // Spin dot
  // offset.x/y are -0.5 to 0.5. We map them to the ballR.
  const dx = (offset.x / 0.5) * ballR
  const dy = (-offset.y / 0.5) * ballR
  svgContent += `  <circle cx="${dx}" cy="${dy}" r="${dotR}" fill="red" />\n`

  // Power bar background
  const bx = -barW / 2
  const by = ballR + 0.015
  svgContent += `  <rect x="${bx}" y="${by}" width="${barW}" height="${barH}" fill="none" stroke="#000" stroke-width="0.002" />\n`

  // Power bar fill
  const fillW = (power / maxPower) * barW
  svgContent += `  <rect x="${bx}" y="${by}" width="${fillW}" height="${barH}" fill="#4ade80" />\n`

  insetGroup.innerHTML = svgContent
}

// ——— Element setup helpers ———

function setupSvgRoot(el) {
  if (!el.getAttribute("xmlns")) {
    el.setAttribute("xmlns", SVG_NS)
  }

  let tableGroup = el.querySelector(".table-group")
  if (!tableGroup) {
    tableGroup = document.createElementNS(SVG_NS, "g")
    tableGroup.classList.add("table-group")
    el.appendChild(tableGroup)
  }

  let trajectoriesGroup = el.querySelector(".trajectories-group")
  if (!trajectoriesGroup) {
    trajectoriesGroup = document.createElementNS(SVG_NS, "g")
    trajectoriesGroup.classList.add("trajectories-group")
    el.appendChild(trajectoriesGroup)
  }

  let insetGroup = el.querySelector(".inset-group")
  if (!insetGroup) {
    insetGroup = document.createElementNS(SVG_NS, "g")
    insetGroup.classList.add("inset-group")
    // Position top-left inside frame
    const ix = -X - fOffset + 0.06
    const iy = -Y - fOffset + 0.06
    insetGroup.setAttribute("transform", `translate(${ix}, ${iy})`)
    el.appendChild(insetGroup)
  }

  const statusEl = el.querySelector(".worker-status") || createSvgStatusText(el)

  return {
    svg: el,
    tableGroup,
    trajectoriesGroup,
    insetGroup,
    statusEl,
    isSvgRoot: true,
  }
}

function createSvgStatusText(svg) {
  const textY = Y + fOffset + 0.12
  const text = document.createElementNS(SVG_NS, "text")
  text.classList.add("worker-status")
  text.setAttribute("text-anchor", "middle")
  text.setAttribute("x", "0")
  text.setAttribute("y", String(textY))
  text.setAttribute("font-size", "0.1")
  text.setAttribute("font-family", "ui-monospace, monospace")
  text.setAttribute("fill", "#737373")
  svg.appendChild(text)
  return text
}

// ——— Per-element simulation ———

async function runElement(el) {
  const setup = setupSvgRoot(el)

  const { svg, tableGroup, trajectoriesGroup } = setup
  const { statusEl } = setup

  // Render table immediately
  const tableResult = generateBilliardTable()
  svg.setAttribute("viewBox", tableResult.viewBox)
  tableGroup.innerHTML = tableResult.content

  // Parse DSL
  const dslText = el.dataset.shots
  if (!dslText) {
    return
  }

  let configs
  try {
    configs = parseShots(dslText)
  } catch (err) {
    setStatus(statusEl, `DSL parse error: ${err.message}`)
    console.error("DSL parse error:", err)
    return
  }

  if (configs.length === 0) {
    setStatus(statusEl, "No shots to simulate")
    return
  }

  const runner = new SimulationRunner("../worker.js")

  try {
    const tasks = configs.map((config) => runner.spawn(config))
    const results = await Promise.all(tasks)

    const figure = el.dataset.figure?.trim()
    setStatus(statusEl, figure || "")
    renderTrajectories(trajectoriesGroup, results)
    renderInset(setup.insetGroup, configs[0])
  } catch (err) {
    setStatus(statusEl, `Error: ${err.message}`)
    console.error("Simulation failed:", err)
  }
}

function setStatus(el, message) {
  if (el) el.textContent = message
}

// ——— Public API ———

/**
 * Initialize all .billiards-table elements on the page.
 * Renders the table and runs any data-shots simulations.
 */
export function initDiagrams() {
  const divs = document.querySelectorAll(".billiards-table")
  if (divs.length === 0) {
    console.warn("No .billiards-table elements found on page")
    return
  }
  divs.forEach((el) => runElement(el))
}
