import { runBatch } from './ww.js';

const defaultConfig = {
  id: 1,
  ruleType: "threecushion",
  balls: [
    { id: 0, pos: { x: -0.5, y: 0, z: 0 } },
    { id: 1, pos: { x: 0.5, y: 0.05, z: 0 } },
    { id: 2, pos: { x: 0, y: 0.5, z: 0 } },
  ],
  cushionModel: "mathavan",
  shot: {
    cueBallId: 0,
    angle: 0,
    power: 2.5,
    offset: { x: 0.5, y: -0.35 },
    elevation: 0,
  },
  stepSize: 0.001953125,
  maxIterations: 20000,
  params: {
    mu: 0.007,
    muS: 0.136,
    rho: 0.035,
    m: 0.23,
    R: 0.03275,
    e: 0.86,
    ee: 0.84,
    μs: 0.2,
    μw: 0.2,
  },
};

console.log('--- Billiards Batch Simulation (Node.js) ---');
console.log(`Running 3 workers with ±0.1° variance...\n`);

const t0 = Date.now();
runBatch(defaultConfig, 3, 0.001745)
  .then((results) => {
    const t1 = Date.now();
    const summary = results.map(res => ({
      id: res.id,
      computeTime: res.computeTime,
      frameCount: res.frames.length,
      outcomes: res.outcomes.length
    }));

    console.table(summary);
    
    results.forEach(res => {
      console.log(`\nSimulation ${res.id} Outcomes:`);
      if (res.outcomes.length === 0) console.log('  None');
      res.outcomes.forEach(o => {
        console.log(`  - ${o.type} (Ball ${o.ballA}${o.ballB !== undefined ? ' & ' + o.ballB : ''})`);
      });
    });

    console.log(`\nBatch complete in ${t1 - t0}ms`);
  })
  .catch((err) => {
    console.error('Batch failed:', err);
    process.exit(1);
  });
