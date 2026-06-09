const fs = require('fs');
const path = require('path');

/**
 * Standalone sanity test for Fit Tooling optimization flow.
 * Uses the bundled worker.js to run simulations in Node.js.
 */

// 1. Mock browser environment for worker.js
global.self = global;
require('../dist/worker.js'); // Defines global.simulateSync

// 2. RMSE calculation (mirrors dist/fit/rmse.js)
function interpolateTrack(track, t, simStep) {
  const fi = t / simStep;
  const lo = Math.floor(fi);
  const hi = Math.min(lo + 1, track.length - 1);
  if (lo >= track.length - 1) return track[track.length - 1];
  const alpha = fi - lo;
  const a = track[lo], b = track[hi];
  return { x: a.x + alpha * (b.x - a.x), y: a.y + alpha * (b.y - a.y) };
}

function computeRMSE(truth, simTracks, simStep) {
  const track0 = simTracks[0];
  if (!track0) return null;
  const mover = truth.filter(s => s.ball === 0);
  if (mover.length === 0) return 0;
  const sse = mover.reduce((sum, { t, x, y }) => {
    const s = interpolateTrack(track0, t, simStep);
    return sum + (x - s.x) ** 2 + (y - s.y) ** 2;
  }, 0);
  return Math.sqrt(sse / mover.length);
}

function runSim(simConfig, truth) {
  const result = global.simulateSync(simConfig);
  const simStep = simConfig.stepSize ?? 0.001953125;
  const simTracks = {};
  for (const f of result.frames) {
    for (const b of f.balls) {
      (simTracks[b.id] ??= []).push({ x: b.pos[0], y: b.pos[1] });
    }
  }
  return computeRMSE(truth, simTracks, simStep);
}

async function run() {
  console.log('--- Optimise Flow Sanity Test ---');

  const dataPath = path.join(__dirname, '../dist/fit/SS_max_spin_02.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found:', dataPath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const baselineConfig = data.sim;
  const truth = data.truth;

  // Step 1: Initial RMSE
  const initialRMSE = runSim(baselineConfig, truth);
  console.log(`Initial RMSE: ${initialRMSE.toFixed(6)}`);

  // Step 2: Perturb shot.power
  const perturbedConfig = JSON.parse(JSON.stringify(baselineConfig));
  perturbedConfig.shot.power += 0.5;
  const perturbedRMSE = runSim(perturbedConfig, truth);
  console.log(`Perturbed RMSE (power +0.5): ${perturbedRMSE.toFixed(6)}`);

  if (perturbedRMSE <= initialRMSE) {
    throw new Error('FAILED: RMSE did not increase after perturbation');
  }

  // Step 3: Simple 1D Optimization (Hill Climbing) on shot.power
  console.log('Starting simple optimization on shot.power...');
  let currentPower = perturbedConfig.shot.power;
  let currentRMSE = perturbedRMSE;
  const step = 0.1;
  let improved = false;

  for (let i = 0; i < 10; i++) {
    const nextPower = currentPower - step; // We know it should go down
    perturbedConfig.shot.power = nextPower;
    const nextRMSE = runSim(perturbedConfig, truth);

    console.log(`  Iter ${i+1}: power=${nextPower.toFixed(2)} RMSE=${nextRMSE.toFixed(6)}`);

    if (nextRMSE < currentRMSE) {
      currentRMSE = nextRMSE;
      currentPower = nextPower;
      improved = true;
    } else {
      break;
    }
  }

  if (!improved) {
    throw new Error('FAILED: Optimization could not reduce RMSE');
  }

  console.log(`Final RMSE: ${currentRMSE.toFixed(6)} (Improvement: ${((perturbedRMSE - currentRMSE) / perturbedRMSE * 100).toFixed(1)}%)`);
  console.log('SUCCESS: Optimise flow sanity check passed.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
