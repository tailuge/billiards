import { WorkerPool, WorkerLike, WorkerConfig } from "../src/sensitivity"

/** Fake worker mirroring src/worker.ts: emits a CHECKPOINT then COMPLETE,
 * echoing the config's power so we can check responses route to the right job. */
class FakeWorker implements WorkerLike {
  onmessage: ((e: MessageEvent) => void) | null = null
  onerror: ((e: unknown) => void) | null = null
  static active = 0
  static maxConcurrent = 0
  static live = 0

  constructor() {
    FakeWorker.live++
  }

  postMessage(data: any): void {
    FakeWorker.active++
    FakeWorker.maxConcurrent = Math.max(
      FakeWorker.maxConcurrent,
      FakeWorker.active
    )
    setTimeout(() => {
      // CHECKPOINT must be ignored by the pool.
      this.onmessage?.({
        data: { type: "CHECKPOINT", label: "x" },
      } as MessageEvent)
      FakeWorker.active-- // this job is finishing before we hand back the result
      this.onmessage?.({
        data: {
          type: "COMPLETE",
          id: data.id,
          outcomes: [{ type: "echo", speed: data.shot.power }],
        },
      } as MessageEvent)
    }, 1)
  }

  terminate(): void {
    FakeWorker.live--
  }
}

const cfg = (power: number): WorkerConfig => ({
  ruleType: "threecushion",
  balls: [],
  cushionModel: "mathavan",
  shot: { cueBallId: 0, angle: 0, power, offset: { x: 0, y: 0 }, elevation: 0 },
})

beforeEach(() => {
  FakeWorker.active = 0
  FakeWorker.maxConcurrent = 0
  FakeWorker.live = 0
})

describe("WorkerPool", () => {
  it("routes each response to its own job and ignores CHECKPOINTs", async () => {
    const pool = new WorkerPool(3, "x", () => new FakeWorker())
    const powers = Array.from({ length: 20 }, (_, i) => i + 0.5)
    const results = await Promise.all(powers.map((p) => pool.run(cfg(p))))
    results.forEach((r, i) => expect(r.outcomes[0].speed).toBe(powers[i]))
    pool.terminate()
  })

  it("never runs more jobs at once than it has workers", async () => {
    const pool = new WorkerPool(4, "x", () => new FakeWorker())
    await Promise.all(Array.from({ length: 50 }, (_, i) => pool.run(cfg(i))))
    expect(FakeWorker.maxConcurrent).toBeLessThanOrEqual(4)
    expect(FakeWorker.live).toBe(4)
    pool.terminate()
  })

  it("terminate() stops workers and rejects queued jobs", async () => {
    const pool = new WorkerPool(1, "x", () => new FakeWorker())
    const first = pool.run(cfg(1)) // dispatched to the single worker (in flight)
    const queued = pool.run(cfg(2)) // still queued behind it
    pool.terminate()
    expect(FakeWorker.live).toBe(0)
    await expect(first).rejects.toThrow("pool terminated")
    await expect(queued).rejects.toThrow("pool terminated")
  })
})
