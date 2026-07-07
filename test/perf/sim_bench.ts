import { simulateSync } from "../../src/worker"
import { performance } from "perf_hooks"

function formatBytes(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB"
}

async function runBenchmark(iterations: number) {
  console.log(`Starting Simulation benchmark with ${iterations} iterations...`)

  const config = {
    id: 0,
    ruleType: "threecushion",
    cushionModel: "mathavan",
    balls: [
      { id: 0, pos: { x: 0, y: 0 } },
      { id: 1, pos: { x: 0.5, y: 0.2 } },
      { id: 2, pos: { x: -0.4, y: -0.3 } },
    ],
    shot: {
      cueBallId: 0,
      angle: 0.5,
      power: 0.1,
      offset: { x: 0.1, y: 0.1 },
      elevation: 0,
    },
    recordTrajectory: false,
    params: {},
  }

  const startMemory = process.memoryUsage()
  const startTime = performance.now()

  let maxHeap = 0

  for (let i = 0; i < iterations; i++) {
    simulateSync(config)

    if (i % 100 === 0) {
      maxHeap = Math.max(maxHeap, process.memoryUsage().heapUsed)
    }
  }

  const endTime = performance.now()
  const endMemory = process.memoryUsage()

  console.log("-----------------------------------------")
  console.log(`Execution Time: ${(endTime - startTime).toFixed(2)} ms`)
  console.log(`Peak Heap Used (sampled): ${formatBytes(maxHeap)}`)
  console.log(`Initial Heap Used: ${formatBytes(startMemory.heapUsed)}`)
  console.log(`Final Heap Used: ${formatBytes(endMemory.heapUsed)}`)
  console.log("-----------------------------------------")
}

runBenchmark(1000).catch(console.error)
