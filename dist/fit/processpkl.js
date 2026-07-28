const fs = require("fs");
const path = require("path");

const INPUT = process.argv[2];
const OUTPUT = path.join(__dirname, "trajectories.json");

// Snap to 50 Hz (0.02 s intervals)
const HZ = 50;
const STEP = 1 / HZ;

// Input coordinate bounds (10ft billiards table)
const X_MIN = 0.03075;
const X_MAX = 2.80925;
const Y_MIN = 0.03075;
const Y_MAX = 1.38925;

// Center of input coordinates
const X_MID = (X_MIN + X_MAX) / 2;  // 1.42
const Y_MID = (Y_MIN + Y_MAX) / 2;  // 0.71

// Target half-ranges from sim project (table: +/- 1.479645 x +/- 0.7234525)
const X_HALF = 1.479645;
const Y_HALF = 0.7234525;

// Scale factors: target half-range / input half-range
const X_SCALE = X_HALF / ((X_MAX - X_MIN) / 2);
const Y_SCALE = Y_HALF / ((Y_MAX - Y_MIN) / 2);

function snapT(t) {
  return +(Math.round(t / STEP) * STEP).toFixed(2);
}

// Shift to center (0,0) then scale to target table dimensions
function normX(x) {
  return +((x - X_MID) * X_SCALE).toFixed(3);
}

function normY(y) {
  return +((y - Y_MID) * Y_SCALE).toFixed(3);
}

function dedensify(tArr, xArr, yArr) {
  const keptT = [];
  const keptX = [];
  const keptY = [];

  if (tArr.length > 0) {
    keptT.push(tArr[0]);
    keptX.push(xArr[0]);
    keptY.push(yArr[0]);

    for (let idx = 1; idx < tArr.length; idx++) {
      const cx = xArr[idx];
      const cy = yArr[idx];
      const lx = keptX[keptX.length - 1];
      const ly = keptY[keptY.length - 1];

      // Distance threshold: 2mm (0.002 meters)
      const dist = Math.hypot(cx - lx, cy - ly);
      if (dist >= 0.002) {
        keptT.push(tArr[idx]);
        keptX.push(cx);
        keptY.push(cy);
      }
    }
  }

  return { t: keptT, x: keptX, y: keptY };
}

function processShot(shot, i) {
  const balls = {};
  for (const [ballId, ball] of Object.entries(shot.balls)) {
    const tMapped = ball.t.map(snapT);
    const xMapped = ball.x.map(normX);
    const yMapped = ball.y.map(normY);

    balls[ballId] = dedensify(tMapped, xMapped, yMapped);
  }
  return { id: i, balls };
}

if (require.main === module) {
  const raw = JSON.parse(fs.readFileSync(INPUT, "utf-8"));
  const processed = raw.map(processShot);

  fs.writeFileSync(OUTPUT, JSON.stringify(processed));
  console.log(`Wrote ${processed.length} shots to ${OUTPUT}`);
}

module.exports = {
  dedensify,
  processShot,
};
