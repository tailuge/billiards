/**
 * Pool Table SVG data
 *
 * Extracted from pooltable.svg. Provides the visual table content
 * and viewBox for non-threecushion ruletypes (nineball, eightball, etc.).
 *
 */


const POOL_TABLE_SVG_CONTENT = `
    <defs>
      <radialGradient id="pool-blue-gradient" cx="50%" cy="35%" r="65%" fx="50%" fy="25%">
        <stop offset="0%" stop-color="#3b95d8" />
        <stop offset="50%" stop-color="#2b7bb9" />
        <stop offset="100%" stop-color="#1d5886" />
      </radialGradient>
      <radialGradient id="snooker-green-gradient" cx="50%" cy="35%" r="65%" fx="50%" fy="25%">
        <stop offset="0%" stop-color="#11833d" />
        <stop offset="50%" stop-color="#0a5c2b" />
        <stop offset="100%" stop-color="#063d1c" />
      </radialGradient>
      <clipPath id="cloth-clip">
        <rect x="-1.380" y="-0.720" width="2.760" height="1.440"></rect>
      </clipPath>
      <filter id="cushion-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="0.015" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <linearGradient id="premium-wood-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3C2D26" />
        <stop offset="25%" stop-color="#50392C" />
        <stop offset="50%" stop-color="#664735" />
        <stop offset="75%" stop-color="#50392C" />
        <stop offset="100%" stop-color="#322722" />
      </linearGradient>
    </defs>
    <style>
      path, line, polyline { fill: none; stroke: #000; stroke-width: 0.003; stroke-linecap: round; stroke-linejoin: round; }
      .pool-cloth { fill: none; stroke: none; }
    </style>
    <g class="pool-surround">
      <path class="pool-surround"
        d="M1.393,0.849L1.436,0.841L1.473,0.818L1.499,0.783L1.512,0.741L1.512,0.726L1.512,0.710L1.512,-0.715L1.512,-0.734L1.510,-0.752L1.495,-0.792L1.465,-0.825L1.431,-0.843L1.393,-0.849L1.384,-0.849L1.375,-0.849L-1.380,-0.849L-1.388,-0.849L-1.397,-0.849L-1.439,-0.840L-1.476,-0.816L-1.501,-0.781L-1.512,-0.738L-1.512,-0.723L-1.512,-0.708L-1.512,0.716L-1.512,0.735L-1.510,0.754L-1.493,0.795L-1.463,0.827L-1.429,0.843L-1.392,0.849L-1.383,0.849L-1.374,0.849L1.381,0.849L1.387,0.849L1.393,0.849"
      />
    </g>
    <rect class="pool-cloth" x="-1.380" y="-0.720" width="2.760" height="1.440" />
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M1.327,0.000L1.327,0.572L1.326,0.576L1.327,0.579L1.328,0.581L1.330,0.582L1.374,0.626L1.377,0.629L1.380,0.632L1.380,-0.632L1.330,-0.582L1.327,-0.580L1.327,-0.577L1.327,-0.571L1.327,-0.565L1.327,0.000"
      />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M-1.327,0.000L-1.327,0.572L-1.326,0.576L-1.327,0.579L-1.328,0.581L-1.330,0.582L-1.377,0.629L-1.379,0.632L-1.379,-0.632L-1.330,-0.582L-1.327,-0.580L-1.327,-0.577L-1.327,-0.571L-1.327,-0.565L-1.327,0.000"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-0.055,0.717L-0.051,0.734L-0.043,0.751L-0.035,0.760L-0.024,0.767L0.003,0.773L0.029,0.764L0.039,0.756L0.046,0.746L0.049,0.741L0.050,0.736L0.054,0.723L0.054,0.709L0.034,0.683L0.001,0.675L-0.033,0.683L-0.054,0.709L-0.055,0.713L-0.055,0.717"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-1.362,0.614L-1.386,0.638L-1.393,0.645L-1.400,0.653L-1.408,0.667L-1.412,0.684L-1.406,0.716L-1.384,0.740L-1.352,0.749L-1.320,0.740L-1.314,0.735L-1.309,0.730L-1.295,0.716L-1.281,0.702L-1.278,0.698L-1.277,0.694L-1.278,0.687L-1.279,0.679L-1.280,0.667L-1.284,0.655L-1.292,0.640L-1.305,0.628L-1.326,0.618L-1.348,0.615L-1.355,0.614L-1.362,0.614"
      />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M-0.070,0.663L-0.062,0.690L-0.055,0.717L-1.242,0.717L-1.267,0.717L-1.293,0.717L-1.294,0.717L-1.295,0.717L-1.247,0.668L-1.242,0.664L-1.236,0.663L-0.070,0.663"
      />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.319,0.739L-1.319,0.849" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.512,0.656L-1.402,0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.512,0.656L1.402,0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.319,0.739L1.319,0.849" />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M0.070,0.663L0.063,0.690L0.055,0.717L1.242,0.717L1.268,0.717L1.293,0.717L1.294,0.717L1.295,0.717L1.247,0.668L1.242,0.664L1.237,0.663L0.070,0.663"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M1.362,0.614L1.386,0.638L1.393,0.645L1.400,0.653L1.408,0.667L1.412,0.684L1.406,0.716L1.384,0.740L1.352,0.749L1.320,0.740L1.314,0.735L1.309,0.730L1.295,0.716L1.281,0.702L1.278,0.698L1.277,0.694L1.278,0.687L1.279,0.679L1.280,0.667L1.284,0.655L1.292,0.640L1.305,0.628L1.326,0.618L1.348,0.615L1.355,0.614L1.362,0.614"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M1.362,-0.614L1.386,-0.638L1.393,-0.645L1.400,-0.653L1.408,-0.667L1.412,-0.684L1.406,-0.716L1.384,-0.740L1.352,-0.749L1.320,-0.740L1.314,-0.735L1.309,-0.730L1.295,-0.716L1.281,-0.702L1.278,-0.698L1.277,-0.694L1.278,-0.687L1.279,-0.679L1.280,-0.667L1.284,-0.655L1.292,-0.640L1.305,-0.628L1.326,-0.618L1.348,-0.615L1.355,-0.614L1.362,-0.614"
      />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M0.070,-0.663L0.063,-0.690L0.055,-0.717L1.242,-0.717L1.268,-0.717L1.293,-0.717L1.294,-0.717L1.295,-0.717L1.247,-0.668L1.242,-0.664L1.237,-0.663L0.070,-0.663"
      />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.319,-0.739L1.319,-0.849" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.512,-0.656L1.402,-0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.512,-0.656L-1.402,-0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.319,-0.739L-1.319,-0.849" />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M-0.070,-0.663L-0.062,-0.690L-0.055,-0.717L-1.242,-0.717L-1.267,-0.717L-1.293,-0.717L-1.294,-0.717L-1.295,-0.717L-1.247,-0.668L-1.242,-0.664L-1.236,-0.663L-0.070,-0.663"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-1.362,-0.614L-1.386,-0.638L-1.393,-0.645L-1.400,-0.653L-1.408,-0.667L-1.412,-0.684L-1.406,-0.716L-1.384,-0.740L-1.352,-0.749L-1.320,-0.740L-1.314,-0.735L-1.309,-0.730L-1.295,-0.716L-1.281,-0.702L-1.278,-0.698L-1.277,-0.694L-1.278,-0.687L-1.279,-0.679L-1.280,-0.667L-1.284,-0.655L-1.292,-0.640L-1.305,-0.628L-1.326,-0.618L-1.348,-0.615L-1.355,-0.614L-1.362,-0.614"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-0.055,-0.717L-0.051,-0.734L-0.043,-0.751L-0.035,-0.760L-0.024,-0.767L0.003,-0.773L0.029,-0.764L0.039,-0.756L0.046,-0.746L0.049,-0.741L0.050,-0.736L0.054,-0.723L0.054,-0.709L0.034,-0.683L0.001,-0.675L-0.033,-0.683L-0.054,-0.709L-0.055,-0.713L-0.055,-0.717"
      />
    </g>
`

export const POOL_SCALE = 1.09

const POOL_MAX_X = 1.512
const POOL_MAX_Y = 0.849
const POOL_PAD_TOP = 0.05
const POOL_PAD_BOTTOM = 0.28
const POOL_PAD_SIDE = 0.05

export function transformPoolTableSvg(svg, dx, dy) {
  const parser = new (globalThis.DOMParser || window.DOMParser)();
  const isFullSvg = svg.trim().startsWith("<svg");
  const parsedString = isFullSvg ? svg : `<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
  const doc = parser.parseFromString(parsedString, "image/svg+xml");
  const root = doc.documentElement;

  const cutX = 1.327;
  const cutY = 0.663;

  function deformX(x, dxVal) {
    if (x > cutX) return x + dxVal;
    if (x < -cutX) return x - dxVal;
    return x;
  }

  function deformY(y, dyVal) {
    if (y > cutY) return y + dyVal;
    if (y < -cutY) return y - dyVal;
    return y;
  }

  const COMMAND_ARG_COUNTS = {
    M: 2, m: 2,
    L: 2, l: 2,
    H: 1, h: 1,
    V: 1, v: 1,
    C: 6, c: 6,
    S: 4, s: 4,
    Q: 4, q: 4,
    T: 2, t: 2,
    A: 7, a: 7,
    Z: 0, z: 0
  };

  function tokenizePath(d) {
    const tokens = [];
    const regex = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.\d+(?:[eE][-+]?\d+)?|-?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?)/g;
    let match;
    while ((match = regex.exec(d)) !== null) {
      if (match[1]) {
        tokens.push(match[1]);
      } else if (match[2]) {
        tokens.push(match[2]);
      }
    }
    return tokens;
  }

  function parsePathData(d) {
    const tokens = tokenizePath(d);
    const commands = [];
    let i = 0;
    let currentCommand = null;

    while (i < tokens.length) {
      const token = tokens[i];
      if (/[MmLlHhVvCcSsQqTtAaZz]/.test(token)) {
        currentCommand = token;
        i++;
      } else {
        if (!currentCommand) {
          throw new Error(`Malformed path data: expected command at index ${i}`);
        }
        if (currentCommand === "M") currentCommand = "L";
        else if (currentCommand === "m") currentCommand = "l";
      }

      const argCount = COMMAND_ARG_COUNTS[currentCommand];
      const args = [];
      for (let j = 0; j < argCount; j++) {
        if (i >= tokens.length) {
          throw new Error(`Expected ${argCount} arguments for command ${currentCommand}, got ${args.length}`);
        }
        const num = parseFloat(tokens[i]);
        if (isNaN(num)) {
          throw new Error(`Invalid number token: ${tokens[i]}`);
        }
        args.push(num);
        i++;
      }

      commands.push({ type: currentCommand, args });
      if (argCount === 0) {
        currentCommand = null;
      }
    }
    return commands;
  }

  function transformPathD(d) {
    const commands = parsePathData(d);
    let currX = 0;
    let currY = 0;
    let startX = 0;
    let startY = 0;

    for (const cmd of commands) {
      const type = cmd.type;
      if (type === "M") {
        currX = cmd.args[0];
        currY = cmd.args[1];
        startX = currX;
        startY = currY;
      } else if (type === "m") {
        cmd.type = "M";
        cmd.args[0] = currX + cmd.args[0];
        cmd.args[1] = currY + cmd.args[1];
        currX = cmd.args[0];
        currY = cmd.args[1];
        startX = currX;
        startY = currY;
      } else if (type === "L") {
        currX = cmd.args[0];
        currY = cmd.args[1];
      } else if (type === "l") {
        cmd.type = "L";
        cmd.args[0] = currX + cmd.args[0];
        cmd.args[1] = currY + cmd.args[1];
        currX = cmd.args[0];
        currY = cmd.args[1];
      } else if (type === "H") {
        currX = cmd.args[0];
      } else if (type === "h") {
        cmd.type = "H";
        cmd.args[0] = currX + cmd.args[0];
        currX = cmd.args[0];
      } else if (type === "V") {
        currY = cmd.args[0];
      } else if (type === "v") {
        cmd.type = "V";
        cmd.args[0] = currY + cmd.args[0];
        currY = cmd.args[0];
      } else if (type === "C") {
        currX = cmd.args[4];
        currY = cmd.args[5];
      } else if (type === "c") {
        cmd.type = "C";
        cmd.args[0] = currX + cmd.args[0];
        cmd.args[1] = currY + cmd.args[1];
        cmd.args[2] = currX + cmd.args[2];
        cmd.args[3] = currY + cmd.args[3];
        cmd.args[4] = currX + cmd.args[4];
        cmd.args[5] = currY + cmd.args[5];
        currX = cmd.args[4];
        currY = cmd.args[5];
      } else if (type === "S") {
        currX = cmd.args[2];
        currY = cmd.args[3];
      } else if (type === "s") {
        cmd.type = "S";
        cmd.args[0] = currX + cmd.args[0];
        cmd.args[1] = currY + cmd.args[1];
        cmd.args[2] = currX + cmd.args[2];
        cmd.args[3] = currY + cmd.args[3];
        currX = cmd.args[2];
        currY = cmd.args[3];
      } else if (type === "Q") {
        currX = cmd.args[2];
        currY = cmd.args[3];
      } else if (type === "q") {
        cmd.type = "Q";
        cmd.args[0] = currX + cmd.args[0];
        cmd.args[1] = currY + cmd.args[1];
        cmd.args[2] = currX + cmd.args[2];
        cmd.args[3] = currY + cmd.args[3];
        currX = cmd.args[2];
        currY = cmd.args[3];
      } else if (type === "T") {
        currX = cmd.args[0];
        currY = cmd.args[1];
      } else if (type === "t") {
        cmd.type = "T";
        cmd.args[0] = currX + cmd.args[0];
        cmd.args[1] = currY + cmd.args[1];
        currX = cmd.args[0];
        currY = cmd.args[1];
      } else if (type === "A") {
        currX = cmd.args[5];
        currY = cmd.args[6];
      } else if (type === "a") {
        cmd.type = "A";
        cmd.args[5] = currX + cmd.args[5];
        cmd.args[6] = currY + cmd.args[6];
        currX = cmd.args[5];
        currY = cmd.args[6];
      } else if (type === "Z" || type === "z") {
        cmd.type = "Z";
        currX = startX;
        currY = startY;
      }
    }

    for (const cmd of commands) {
      const type = cmd.type;
      if (type === "M" || type === "L" || type === "T") {
        cmd.args[0] = deformX(cmd.args[0], dx);
        cmd.args[1] = deformY(cmd.args[1], dy);
      } else if (type === "H") {
        cmd.args[0] = deformX(cmd.args[0], dx);
      } else if (type === "V") {
        cmd.args[0] = deformY(cmd.args[0], dy);
      } else if (type === "C") {
        cmd.args[0] = deformX(cmd.args[0], dx);
        cmd.args[1] = deformY(cmd.args[1], dy);
        cmd.args[2] = deformX(cmd.args[2], dx);
        cmd.args[3] = deformY(cmd.args[3], dy);
        cmd.args[4] = deformX(cmd.args[4], dx);
        cmd.args[5] = deformY(cmd.args[5], dy);
      } else if (type === "S" || type === "Q") {
        cmd.args[0] = deformX(cmd.args[0], dx);
        cmd.args[1] = deformY(cmd.args[1], dy);
        cmd.args[2] = deformX(cmd.args[2], dx);
        cmd.args[3] = deformY(cmd.args[3], dy);
      } else if (type === "A") {
        cmd.args[5] = deformX(cmd.args[5], dx);
        cmd.args[6] = deformY(cmd.args[6], dy);
      }
    }

    return commands.map(cmd => {
      const type = cmd.type;
      if (type === "Z" || type === "z") return type;
      let formattedArgs = [];
      if (type === "A" || type === "a") {
        formattedArgs = cmd.args.map((val, idx) => {
          if (idx === 3 || idx === 4) {
            return Math.round(val).toString();
          }
          return parseFloat(val.toFixed(6)).toString();
        });
      } else {
        formattedArgs = cmd.args.map(val => parseFloat(val.toFixed(6)).toString());
      }
      return type + formattedArgs.join(",");
    }).join("");
  }

  const paths = doc.getElementsByTagName("path");
  for (let idx = 0; idx < paths.length; idx++) {
    const p = paths[idx];
    if (p.hasAttribute("d")) {
      p.setAttribute("d", transformPathD(p.getAttribute("d")));
    }
  }

  const lines = doc.getElementsByTagName("line");
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.hasAttribute("x1")) {
      const val = parseFloat(l.getAttribute("x1") || "0");
      l.setAttribute("x1", parseFloat(deformX(val, dx).toFixed(6)).toString());
    }
    if (l.hasAttribute("y1")) {
      const val = parseFloat(l.getAttribute("y1") || "0");
      l.setAttribute("y1", parseFloat(deformY(val, dy).toFixed(6)).toString());
    }
    if (l.hasAttribute("x2")) {
      const val = parseFloat(l.getAttribute("x2") || "0");
      l.setAttribute("x2", parseFloat(deformX(val, dx).toFixed(6)).toString());
    }
    if (l.hasAttribute("y2")) {
      const val = parseFloat(l.getAttribute("y2") || "0");
      l.setAttribute("y2", parseFloat(deformY(val, dy).toFixed(6)).toString());
    }
  }

  const polylines = doc.getElementsByTagName("polyline");
  for (let idx = 0; idx < polylines.length; idx++) {
    const pl = polylines[idx];
    if (pl.hasAttribute("points")) {
      const pointsStr = pl.getAttribute("points") || "";
      const coords = pointsStr.trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
      const deformedCoords = [];
      for (let cIdx = 0; cIdx < coords.length; cIdx += 2) {
        deformedCoords.push(parseFloat(deformX(coords[cIdx], dx).toFixed(6)).toString());
        deformedCoords.push(parseFloat(deformY(coords[cIdx + 1], dy).toFixed(6)).toString());
      }
      const formattedPoints = [];
      for (let cIdx = 0; cIdx < deformedCoords.length; cIdx += 2) {
        formattedPoints.push(`${deformedCoords[cIdx]},${deformedCoords[cIdx + 1]}`);
      }
      pl.setAttribute("points", formattedPoints.join(" "));
    }
  }

  const rects = doc.getElementsByTagName("rect");
  for (let idx = 0; idx < rects.length; idx++) {
    const r = rects[idx];
    const rx = parseFloat(r.getAttribute("x") || "0");
    const ry = parseFloat(r.getAttribute("y") || "0");
    const rw = parseFloat(r.getAttribute("width") || "0");
    const rh = parseFloat(r.getAttribute("height") || "0");

    const x1 = rx;
    const x2 = rx + rw;
    const y1 = ry;
    const y2 = ry + rh;

    const nx1 = deformX(x1, dx);
    const nx2 = deformX(x2, dx);
    const ny1 = deformY(y1, dy);
    const ny2 = deformY(y2, dy);

    const newX = Math.min(nx1, nx2);
    const newW = Math.abs(nx2 - nx1);
    const newY = Math.min(ny1, ny2);
    const newH = Math.abs(ny2 - ny1);

    r.setAttribute("x", parseFloat(newX.toFixed(6)).toString());
    r.setAttribute("y", parseFloat(newY.toFixed(6)).toString());
    r.setAttribute("width", parseFloat(newW.toFixed(6)).toString());
    r.setAttribute("height", parseFloat(newH.toFixed(6)).toString());
  }

  if (isFullSvg) {
    const maxX = 1.512 + dx;
    const maxY = 0.849 + dy;
    const minX = -(maxX + 0.05);
    const minY = -(maxY + 0.05);
    const width = 2 * (maxX + 0.05);
    const height = (maxY + 0.05) + (maxY + 0.28);
    const newViewBox = `${minX.toFixed(6)} ${minY.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`;
    root.setAttribute("viewBox", newViewBox);
  }

  const serializer = new (globalThis.XMLSerializer || window.XMLSerializer)();
  if (isFullSvg) {
    return serializer.serializeToString(root);
  } else {
    let result = "";
    for (let child = root.firstChild; child; child = child.nextSibling) {
      result += serializer.serializeToString(child) + "\n";
    }
    return result.trim().replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, "");
  }
}

export function generatePoolTable(dx = 0, dy = 0) {
  const f6 = (n) => n.toFixed(6)
  if (dx === 0 && dy === 0) {
    const s = POOL_SCALE
    const maxX = POOL_MAX_X * s
    const maxY = POOL_MAX_Y * s
    const minX = -(maxX + POOL_PAD_SIDE)
    const minY = -(maxY + POOL_PAD_TOP)
    const width = 2 * (maxX + POOL_PAD_SIDE)
    const height = (maxY + POOL_PAD_TOP) + (maxY + POOL_PAD_BOTTOM)
    const viewBox = `${f6(minX)} ${f6(minY)} ${f6(width)} ${f6(height)}`
    const content = `<g transform="scale(${s})">\n${POOL_TABLE_SVG_CONTENT}  </g>\n`
    return {
      viewBox,
      content,
    }
  } else {
    const maxX = POOL_MAX_X + dx
    const maxY = POOL_MAX_Y + dy
    const minX = -(maxX + POOL_PAD_SIDE)
    const minY = -(maxY + POOL_PAD_TOP)
    const width = 2 * (maxX + POOL_PAD_SIDE)
    const height = (maxY + POOL_PAD_TOP) + (maxY + POOL_PAD_BOTTOM)
    const viewBox = `${f6(minX)} ${f6(minY)} ${f6(width)} ${f6(height)}`
    const content = transformPoolTableSvg(POOL_TABLE_SVG_CONTENT, dx, dy)
    return {
      viewBox,
      content,
    }
  }
}
