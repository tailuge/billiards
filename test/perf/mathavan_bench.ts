import { Mathavan } from "../../src/model/physics/mathavan";
import { ee, μs, μw, m, R } from "../../src/model/physics/constants";
import { performance } from "perf_hooks";

function formatBytes(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

async function runBenchmark(iterations: number) {
  console.log(`Starting Mathavan benchmark with ${iterations} iterations...`);

  const startMemory = process.memoryUsage();
  const startTime = performance.now();

  let maxHeap = 0;

  for (let i = 0; i < iterations; i++) {
    const solver = new Mathavan(m, R, ee, μs, μw);
    solver.solve(1, 1, 0, 0, 0);

    if (i % 1000 === 0) {
        maxHeap = Math.max(maxHeap, process.memoryUsage().heapUsed);
    }
  }

  const endTime = performance.now();
  const endMemory = process.memoryUsage();

  console.log("-----------------------------------------");
  console.log(`Execution Time: ${(endTime - startTime).toFixed(2)} ms`);
  console.log(`Peak Heap Used (sampled): ${formatBytes(maxHeap)}`);
  console.log(`Initial Heap Used: ${formatBytes(startMemory.heapUsed)}`);
  console.log(`Final Heap Used: ${formatBytes(endMemory.heapUsed)}`);
  console.log("-----------------------------------------");
}

runBenchmark(100000).catch(console.error);
