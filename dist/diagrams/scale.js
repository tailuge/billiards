/**
 * SVG Scaling and Deformation module for pool tables.
 */

export function transformPoolTableSvg(svg, dx, dy) {
  const parser = new (globalThis.DOMParser || window.DOMParser)();
  const isFullSvg = svg.trim().startsWith("<svg");
  const parsedString = isFullSvg ? svg : `<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
  const doc = parser.parseFromString(parsedString, "image/svg+xml");
  const root = doc.documentElement;

  const cutX = 0.756;
  const cutY = 0.4245;

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
