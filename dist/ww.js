/**
 * Multi-platform worker runner for Billiards Physics
 */

export class SimulationRunner {
  constructor(workerPath = 'worker.js', isNode = false) {
    this.workerPath = workerPath;
    this.isNode = isNode;
  }

  async spawn(config) {
    return new Promise((resolve, reject) => {
      let worker;
      
      if (this.isNode) {
        // Node.js implementation using node:worker_threads
        const workerThreads = 'node:worker_threads';
        const pathModule = 'node:path';
        const urlModule = 'node:url';

        Promise.all([import(workerThreads), import(pathModule), import(urlModule)]).then(([{ Worker }, path, url]) => {
          const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
          const absoluteWorkerPath = path.resolve(__dirname, this.workerPath);
          
          const nodeFriendlyWrapper = `
            const { parentPort } = require('node:worker_threads');
            global.self = global;
            global.postMessage = (data) => parentPort.postMessage(data);
            parentPort.on('message', (data) => {
              if (global.onmessage) global.onmessage({ data });
            });
            require(${JSON.stringify(absoluteWorkerPath)});
          `;
          worker = new Worker(nodeFriendlyWrapper, { eval: true });
          
          worker.on('message', (data) => {
            if (data.type === 'COMPLETE') {
              worker.terminate();
              resolve(data);
            } else if (data.type === 'ERROR') {
              worker.terminate();
              reject(new Error(data.error));
            }
          });

          worker.on('error', (err) => {
            worker.terminate();
            reject(err);
          });

          worker.postMessage(config);
        }).catch(reject);
      } else {
        worker = new Worker(this.workerPath);
        worker.onmessage = (e) => {
          if (e.data.type === 'COMPLETE') {
            worker.terminate();
            resolve(e.data);
          } else if (e.data.type === 'ERROR') {
            worker.terminate();
            reject(new Error(e.data.error));
          }
        };

        worker.onerror = (e) => {
          worker.terminate();
          reject(e);
        };

        worker.postMessage(config);
      }
    });
  }
}

export async function runBatch(baseConfig, count = 3, variance = 0.001745) {
  const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
  const runner = new SimulationRunner('worker.js', !!isNode);
  
  const tasks = [];
  const startAngle = baseConfig.shot.angle;

  for (let i = 0; i < count; i++) {
    const config = JSON.parse(JSON.stringify(baseConfig));
    // Variance: [ -0.001745, 0, +0.001745 ] for count=3
    const offset = (i - Math.floor(count / 2)) * variance;
    config.shot.angle = startAngle + offset;
    config.id = i;
    tasks.push(runner.spawn(config));
  }

  return Promise.all(tasks);
}
