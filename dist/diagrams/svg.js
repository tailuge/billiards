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

import { SimulationRunner } from "../ww.js";
import { parseShots, parseJsonShots, maxPower } from "./dsl.js";
import { generatePoolTable } from "./pooltable.js";



// ——— Table geometry (SI meters) ———

export const R = 0.03275;
const UMB_TABLE_X = 92.36;
const UMB_TABLE_Y = 46.18;
const tableX = R * (UMB_TABLE_X / 2 - 1);
const tableY = R * (UMB_TABLE_Y / 2 - 1);
export const X = tableX + R;
export const Y = tableY + R;

// Fixed calibration (matches default slider midpoints from original)
const cOffset = 0.06;
const dOffset = 0.1;
export const fOffset = 0.18;
const dSize = 0.01;

export const SVG_NS = "http://www.w3.org/2000/svg";

// ——— Table rendering ———

function generateBilliardTable() {
  const width = X * 2;
  const height = Y * 2;

  const maxOffset = Math.max(fOffset, dOffset + 0.015);
  const pad = 0.2;
  const halfPad = pad / 2;
  const viewBoxWidth = (X + maxOffset + halfPad) * 2;
  const viewBoxHeight = (Y + maxOffset + halfPad) + (Y + maxOffset + pad);
  const viewBoxX = -viewBoxWidth / 2;
  const viewBoxY = -(Y + maxOffset + halfPad);

  let svgContent = "";

  const f6 = (n) => n.toFixed(6);

  // Outer frame
  const fx = -X - fOffset;
  const fy = -Y - fOffset;
  const fw = width + fOffset * 2;
  const fh = height + fOffset * 2;
  svgContent += `  <rect id="outer-frame" x="${f6(fx)}" y="${f6(fy)}" width="${f6(fw)}" height="${f6(fh)}" class="table-stroke" />\n`;

  // Cushion border
  const cx = -X - cOffset;
  const cy = -Y - cOffset;
  const cw = width + cOffset * 2;
  const ch = height + cOffset * 2;
  svgContent += `  <rect id="cushion-border" x="${f6(cx)}" y="${f6(cy)}" width="${f6(cw)}" height="${f6(ch)}" class="table-stroke" />\n`;

  // Playing area
  svgContent += `  <rect id="playing-area" x="${f6(-X)}" y="${f6(-Y)}" width="${f6(width)}" height="${f6(height)}" class="table-stroke" />\n`;

  // Grid lines
  const gridInterval = (2 * X) / 8;
  svgContent += '  <g id="table-grid-lines">\n';
  for (let i = -3; i <= 3; i++) {
    const x = i * gridInterval;
    svgContent += `    <line x1="${f6(x)}" y1="${f6(-Y)}" x2="${f6(x)}" y2="${f6(Y)}" class="grid-line" />\n`;
  }
  for (let i = -1; i <= 1; i++) {
    const y = i * gridInterval;
    svgContent += `    <line x1="${f6(-X)}" y1="${f6(y)}" x2="${f6(X)}" y2="${f6(y)}" class="grid-line" />\n`;
  }
  svgContent += "  </g>\n";

  // Diamond def
  svgContent += `  <defs>\n    <polygon id="d" points="0,${f6(-dSize)} ${f6(dSize)},0 0,${f6(dSize)} ${f6(-dSize)},0" fill="none" stroke="#000000" stroke-width="0.002" />\n  </defs>\n`;

  // Diamonds
  svgContent += '  <g id="diamonds-group">\n';
  for (let i = -4; i <= 4; i++) {
    const x = i * gridInterval;
    svgContent += `    <use href="#d" x="${f6(x)}" y="${f6(-Y - dOffset)}"/>\n`;
    svgContent += `    <use href="#d" x="${f6(x)}" y="${f6(Y + dOffset)}"/>\n`;
  }
  for (let i = -2; i <= 2; i++) {
    const y = i * gridInterval;
    svgContent += `    <use href="#d" x="${f6(-X - dOffset)}" y="${f6(y)}"/>\n`;
    svgContent += `    <use href="#d" x="${f6(X + dOffset)}" y="${f6(y)}"/>\n`;
  }
  svgContent += "  </g>\n";

  return {
    viewBox: `${f6(viewBoxX)} ${f6(viewBoxY)} ${f6(viewBoxWidth)} ${f6(viewBoxHeight)}`,
    content: svgContent,
  };
}

// ——— Coordinate and Diamond utilities ———

export function toSvgCoords(svg, event) {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: svgP.x, y: svgP.y };
}

export function getDiamonds() {
  const gridInterval = (2 * X) / 8;
  const diamonds = [];

  for (let i = -4; i <= 4; i++) {
    const x = i * gridInterval;
    diamonds.push({ x, y: -Y - dOffset });
    diamonds.push({ x, y: Y + dOffset });
  }
  for (let i = -2; i <= 2; i++) {
    const y = i * gridInterval;
    diamonds.push({ x: -X - dOffset, y });
    diamonds.push({ x: X + dOffset, y });
  }

  // 1/4-interval snap points between adjacent diamonds on each edge
  const quarterInterval = gridInterval / 4;

  // Top and bottom edges
  for (let i = -4; i < 4; i++) {
    const xStart = i * gridInterval;
    for (let q = 1; q <= 3; q++) {
      const x = xStart + q * quarterInterval;
      diamonds.push({ x, y: -Y - dOffset });
      diamonds.push({ x, y: Y + dOffset });
    }
  }

  // Left and right edges
  for (let i = -2; i < 2; i++) {
    const yStart = i * gridInterval;
    for (let q = 1; q <= 3; q++) {
      const y = yStart + q * quarterInterval;
      diamonds.push({ x: -X - dOffset, y });
      diamonds.push({ x: X + dOffset, y });
    }
  }

  return diamonds;
}

// ——— Editing and Snapping logic ———

export function getNearestDiamond(diamonds, coords) {
  let nearest = null;
  let minDistance = Infinity;

  for (const d of diamonds) {
    const dx = coords.x - d.x;
    const dy = coords.y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = d;
    }
  }

  if (minDistance <= 2 * R) {
    return nearest;
  }
  return null;
}

// ——— Trajectory rendering ———

function simplifyPath(path, cosTolerance = 0.999998477, minLength = 0.01 * R) {
  if (path.length < 3) return path;

  const compressed = [path[0]];
  let spanStart = path[0];
  let last = path[1];

  for (let i = 2; i < path.length; i++) {
    const next = path[i];

    const d1x = last[0] - spanStart[0];
    const d1y = last[1] - spanStart[1];
    const d1mag = Math.sqrt(d1x * d1x + d1y * d1y);

    const d2x = next[0] - last[0];
    const d2y = next[1] - last[1];
    const d2mag = Math.sqrt(d2x * d2x + d2y * d2y);

    if (d1mag < minLength || d2mag < minLength) {
      last = next;
      continue;
    }

    const u1x = d1x / d1mag;
    const u1y = d1y / d1mag;
    const u2x = d2x / d2mag;
    const u2y = d2y / d2mag;

    const dot = u1x * u2x + u1y * u2y;

    if (dot >= cosTolerance) {
      last = next;
    } else {
      compressed.push(last);
      spanStart = last;
      last = next;
    }
  }

  compressed.push(last);
  return compressed;
}

function renderTrajectories(trajectoriesGroup, results) {
  let svgContent = "";

  results.forEach((result) => {
    // Collect all unique ball IDs from all frames
    const ballIds = new Set();
    result.frames.forEach((frame) => {
      frame.balls.forEach((b) => ballIds.add(b.id));
    });

    ballIds.forEach((ballId) => {
      const path = [];
      result.frames.forEach((frame) => {
        const ball = frame.balls.find((b) => b.id === ballId);
        if (ball) path.push(ball.pos);
      });

      if (path.length < 2) return;

      const simplifiedPath = simplifyPath(path);
      const points = simplifiedPath
        .map((p) => `${p[0].toFixed(6)},${(-p[1]).toFixed(6)}`)
        .join(" ");
      const lineOpacity = ballId === 0 ? 1 : ballId === 1 ? 0.75 : 0.5
      svgContent += `  <polyline points="${points}" class="trajectory-line traj-${ballId}" stroke-opacity="${lineOpacity}" />\n`;
    });
  });

  trajectoriesGroup.innerHTML = svgContent;
}

function renderInset(insetGroup, config) {
  const ballR = 0.06;
  const dotR = 0.012;
  const barW = 0.12;
  const barH = 0.015;

  const { offset, power } = config.shot;

  let svgContent = "";

  // Cue ball circle
  svgContent += `  <circle cx="0" cy="0" r="${ballR}" fill="#fff" stroke="#000" stroke-width="0.002" />\n`;

  // Spin dot (cue tip position)
  // offset.x/y are -0.5 to 0.5, scaled to half the ball radius.
  const dx = -offset.x * ballR;
  const dy = -offset.y * ballR;
  svgContent += `  <circle cx="${dx}" cy="${dy}" r="${dotR}" fill="#000" />\n`;

  // Power bar background
  const bx = -barW / 2;
  const by = ballR + 0.02;
  svgContent += `  <rect x="${bx}" y="${by}" width="${barW}" height="${barH}" fill="none" stroke="#000" stroke-width="0.002" />\n`;

  // Power bar fill
  const fillW = (power / maxPower) * barW;
  svgContent += `  <rect x="${bx}" y="${by}" width="${fillW}" height="${barH}" fill="#9ca3af" />\n`;

  insetGroup.innerHTML = svgContent;
}

function renderBallPositions(ballsGroup, config) {
  if (!config.balls || config.balls.length === 0) return;

  let svgContent = "";
  const ballR = R;

  config.balls.forEach((ball) => {
    const cx = ball.pos.x;
    const cy = -ball.pos.y;
    svgContent += `  <circle cx="${cx}" cy="${cy}" r="${ballR}" fill="none" stroke="#000" stroke-width="0.002" />\n`;
  });

  ballsGroup.innerHTML = svgContent;
}

// ——— Element setup helpers ———

function moveManualElements(el, manualLinesGroup) {
  // Move any direct-child manual-line/fine-stroke elements into manualLinesGroup
  // so they render on top of the table background.
  const existing = el.querySelectorAll(
    ":scope > .manual-line, :scope > .fine-stroke"
  );
  existing.forEach((line) => manualLinesGroup.appendChild(line));
}

function injectManualLineStyles() {
  if (document.getElementById("manual-line-styles")) return;
  const style = document.createElement("style");
  style.id = "manual-line-styles";
  style.textContent = `.manual-line { fill: none; stroke: #000; stroke-width: 0.002; }`;
  document.head.appendChild(style);
}

export function setupSvgRoot(el) {
  if (!el.getAttribute("xmlns")) {
    el.setAttribute("xmlns", SVG_NS);
  }



  let tableGroup = el.querySelector(".table-group");
  if (!tableGroup) {
    tableGroup = document.createElementNS(SVG_NS, "g");
    tableGroup.classList.add("table-group");
    el.appendChild(tableGroup);
  }

  let trajectoriesGroup = el.querySelector(".trajectories-group");
  if (!trajectoriesGroup) {
    trajectoriesGroup = document.createElementNS(SVG_NS, "g");
    trajectoriesGroup.classList.add("trajectories-group");
    el.appendChild(trajectoriesGroup);
  }

  let ballsGroup = el.querySelector(".balls-group");
  if (!ballsGroup) {
    ballsGroup = document.createElementNS(SVG_NS, "g");
    ballsGroup.classList.add("balls-group");
    el.appendChild(ballsGroup);
  }

  let insetGroup = el.querySelector(".inset-group");
  if (!insetGroup) {
    insetGroup = document.createElementNS(SVG_NS, "g");
    insetGroup.classList.add("inset-group");
    el.appendChild(insetGroup);
  }

  let manualLinesGroup = el.querySelector(".manual-lines-group");
  if (!manualLinesGroup) {
    manualLinesGroup = document.createElementNS(SVG_NS, "g");
    manualLinesGroup.classList.add("manual-lines-group");
    el.appendChild(manualLinesGroup);
  }

  moveManualElements(el, manualLinesGroup);

  let editingGroup = el.querySelector(".editing-group");
  if (!editingGroup) {
    editingGroup = document.createElementNS(SVG_NS, "g");
    editingGroup.classList.add("editing-group");
    el.appendChild(editingGroup);
  }

  const statusEl =
    el.querySelector(".worker-status") || createSvgStatusText(el);

  return {
    svg: el,
    tableGroup,
    trajectoriesGroup,
    ballsGroup,
    insetGroup,
    manualLinesGroup,
    editingGroup,
    statusEl,
    isSvgRoot: true,
  };
}

function createSvgStatusText(svg) {
  const textY = Y + fOffset + 0.12;
  const text = document.createElementNS(SVG_NS, "text");
  text.classList.add("worker-status");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("x", "0");
  text.setAttribute("y", String(textY));
  text.setAttribute("font-size", "0.08");
  text.setAttribute(
    "font-family",
    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  );
  text.setAttribute("fill", "#737373");
  svg.appendChild(text);
  return text;
}

// ——— Per-element simulation ———

async function runElement(el, ruletype) {
  const setup = setupSvgRoot(el);


  const { svg, tableGroup, trajectoriesGroup } = setup;
  const { statusEl } = setup;

  // Render table immediately
  const isPool = ruletype && ruletype !== "threecushion"
  const tableResult = isPool ? generatePoolTable() : generateBilliardTable();
  svg.setAttribute("viewBox", tableResult.viewBox);
  tableGroup.innerHTML = tableResult.content;

  // Parse DSL and JSON shots
  const dslText = el.dataset.shots;
  const jsonText = el.dataset.jsonShots;

  if (!dslText && !jsonText) {
    return;
  }

  let configs = [];

  if (dslText) {
    try {
      configs = parseShots(dslText);
    } catch (err) {
      setStatus(statusEl, `DSL parse error: ${err.message}`);
      console.error("DSL parse error:", err);
    }
  }

  if (jsonText) {
    try {
      const jsonConfigs = parseJsonShots(jsonText, configs.length);
      configs.push(...jsonConfigs);
    } catch (err) {
      setStatus(statusEl, `JSON parse error: ${err.message}`);
      console.error("JSON parse error:", err);
    }
  }

  if (configs.length === 0) {
    setStatus(statusEl, "No shots to simulate");
    return;
  }

  const runner = new SimulationRunner("../worker.js");

  try {
    const tasks = configs.map((config) => runner.spawn(config));
    const results = await Promise.all(tasks);

    const figure = el.dataset.figure?.trim();
    setStatus(statusEl, figure || "");
    renderTrajectories(trajectoriesGroup, results);
    if (jsonText) renderBallPositions(setup.ballsGroup, configs[0]);
    renderInset(setup.insetGroup, configs[0]);

    // Align inset to the right of the status text
    try {
      const bbox = statusEl.getBBox();
      const ix = bbox.x + bbox.width + 0.12;
      const iy = parseFloat(statusEl.getAttribute("y")) - 0.04;
      setup.insetGroup.setAttribute("transform", `translate(${ix}, ${iy})`);
    } catch (e) {
      // Fallback positioning if getBBox is unavailable
      const ix = 0.12;
      const iy = Y + fOffset + 0.04;
      setup.insetGroup.setAttribute("transform", `translate(${ix}, ${iy})`);
    }
  } catch (err) {
    setStatus(statusEl, `Error: ${err.message}`);
    console.error("Simulation failed:", err);
  }
}

function setStatus(el, message) {
  if (el) el.textContent = message;
}

// ——— Public API ———

/**
 * Initialize all .billiards-table elements on the page.
 * Renders the table and runs any data-shots simulations.
 */
export function initDiagrams(ruletype) {
  injectManualLineStyles();
  const divs = document.querySelectorAll(".billiards-table");
  if (divs.length === 0) {
    console.warn("No .billiards-table elements found on page");
    return;
  }
  divs.forEach((el) => runElement(el, ruletype));
}
