const fs = require('fs')
const path = require('path')
const { createCanvas } = require('canvas')

// Table dimensions (from plot.js)
const HALF_W = 0.03275 * 92.36 / 2
const HALF_H = 0.03275 * 46.18 / 2

// Ball colours (ball 0=white, 1=yellow, 2=red)
const COLORS = ['#fff', '#ff0', '#f00']

function plot(canvas, truth) {
  const W = canvas.width
  const H = canvas.height
  const ctx = canvas.getContext('2d')

  // screen-space transform: table coords → pixel coords
  const tx = x => (x + HALF_W) / (2 * HALF_W) * W
  const ty = y => (HALF_H - y) / (2 * HALF_H) * H

  // background: felt
  ctx.fillStyle = '#3b3f88'
  ctx.fillRect(0, 0, W, H)

  // plot each truth sample
  for (const { ball, x, y } of truth) {
    ctx.fillStyle = COLORS[ball] ?? '#888'
    const px = tx(x)
    const py = ty(y)
    // draw a 2×2 pixel dot
    ctx.fillRect(px - 1, py - 1, 2, 2)
  }
}

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('Usage: node pngplot <file1.json> [file2.json ...]')
  process.exit(1)
}

for (const filePath of files) {
  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    console.error(`Skipping ${filePath}: ${err.message}`)
    continue
  }

  const truth = data.truth
  if (!Array.isArray(truth) || truth.length === 0) {
    console.error(`Skipping ${filePath}: no "truth" array`)
    continue
  }

  const canvas = createCanvas(240, 120)
  plot(canvas, truth)

  const outPath = path.format({
    dir: path.dirname(filePath),
    name: path.basename(filePath, path.extname(filePath)),
    ext: '.png',
  })

  const buf = canvas.toBuffer('image/png')
  fs.writeFileSync(outPath, buf)
  console.log(`Wrote ${outPath}  (${truth.length} samples)`)
}
