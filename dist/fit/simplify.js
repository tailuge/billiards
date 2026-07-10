import { interpolateTrack } from './rmse.js'

/**
 * Node representation for the doubly-linked list of trajectory points.
 */
class ListNode {
  constructor(index, sample) {
    this.index = index // Original index in the sorted samples array
    this.t = sample.t
    this.x = sample.x
    this.y = sample.y
    this.ball = sample.ball
    this.prev = null
    this.next = null
    this.cost = Infinity // Cost of deleting this node
    this.heapIndex = -1 // Index in the binary min-heap
  }
}

/**
 * An updatable binary min-heap for managing candidate points for deletion.
 */
class MinHeap {
  constructor() {
    this.data = []
  }

  size() {
    return this.data.length
  }

  push(node) {
    node.heapIndex = this.data.length
    this.data.push(node)
    this.up(this.data.length - 1)
  }

  pop() {
    if (this.data.length === 0) return null
    const min = this.data[0]
    const last = this.data.pop()
    if (this.data.length > 0) {
      this.data[0] = last
      last.heapIndex = 0
      this.down(0)
    }
    min.heapIndex = -1
    return min
  }

  update(node) {
    const idx = node.heapIndex
    if (idx !== -1) {
      this.up(idx)
      this.down(idx)
    }
  }

  remove(node) {
    const idx = node.heapIndex
    if (idx !== -1) {
      const last = this.data.pop()
      if (idx < this.data.length) {
        this.data[idx] = last
        last.heapIndex = idx
        this.up(idx)
        this.down(idx)
      }
      node.heapIndex = -1
    }
  }

  up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.data[i].cost >= this.data[p].cost) break
      this.swap(i, p)
      i = p
    }
  }

  down(i) {
    const len = this.data.length
    while ((i << 1) + 1 < len) {
      let left = (i << 1) + 1
      let right = left + 1
      let best = i
      if (this.data[left].cost < this.data[best].cost) best = left
      if (right < len && this.data[right].cost < this.data[best].cost) best = right
      if (best === i) break
      this.swap(i, best);
      i = best
    }
  }

  swap(i, j) {
    const tmp = this.data[i]
    this.data[i] = this.data[j]
    this.data[j] = tmp
    this.data[i].heapIndex = i
    this.data[j].heapIndex = j
  }
}

/**
 * Computes the deletion cost of a node by evaluating the maximum Euclidean error
 * over the interval between its predecessor and successor if the node is removed.
 *
 * @param {ListNode} node - The candidate node.
 * @param {Array} originalSamples - The full array of original samples for this ball.
 * @returns {number} The maximum Euclidean distance error.
 */
function computeDeletionCost(node, originalSamples) {
  if (!node.prev || !node.next) {
    return Infinity
  }
  const p = node.prev
  const s = node.next

  const tempTrack = [
    { t: p.t, x: p.x, y: p.y },
    { t: s.t, x: s.x, y: s.y }
  ]

  let maxError = 0
  for (let k = p.index + 1; k < s.index; k++) {
    const orig = originalSamples[k]
    const { point: interpolated } = interpolateTrack(tempTrack, orig.t, 0)
    const dx = interpolated.x - orig.x
    const dy = interpolated.y - orig.y
    const err = Math.hypot(dx, dy)
    if (err > maxError) {
      maxError = err
    }
  }
  return maxError
}

/**
 * Simplifies a single ball's trajectory using the decimation algorithm.
 *
 * @param {Array} samples - Array of trajectory samples of form {ball, t, x, y}.
 * @param {number} tolerance - Tolerance threshold in meters.
 * @returns {Array} The simplified array of samples.
 */
function simplifyBallTrajectory(samples, tolerance) {
  if (samples.length <= 2) {
    return samples
  }

  const n = samples.length
  const nodes = new Array(n)
  for (let i = 0; i < n; i++) {
    nodes[i] = new ListNode(i, samples[i])
  }

  for (let i = 0; i < n; i++) {
    if (i > 0) nodes[i].prev = nodes[i - 1]
    if (i < n - 1) nodes[i].next = nodes[i + 1]
  }

  const heap = new MinHeap()

  for (let i = 1; i < n - 1; i++) {
    nodes[i].cost = computeDeletionCost(nodes[i], samples)
    heap.push(nodes[i])
  }

  while (heap.size() > 0) {
    const minNode = heap.pop()
    if (minNode.cost > tolerance) {
      break
    }

    // Permanently remove minNode from the linked list
    const p = minNode.prev
    const s = minNode.next
    p.next = s
    s.prev = p

    // Recompute cost for predecessor if it is an interior node
    if (p.prev !== null) {
      p.cost = computeDeletionCost(p, samples)
      heap.update(p)
    }

    // Recompute cost for successor if it is an interior node
    if (s.next !== null) {
      s.cost = computeDeletionCost(s, samples)
      heap.update(s)
    }
  }

  // Reconstruct simplified array of samples
  const result = []
  let curr = nodes[0]
  while (curr !== null) {
    result.push({
      ball: curr.ball,
      t: curr.t,
      x: curr.x,
      y: curr.y
    })
    curr = curr.next
  }

  return result
}

/**
 * Simplifies the multi-ball trajectory data, grouping by ball.
 *
 * @param {Array} truth - Original flat trajectory array of [{ball, t, x, y}, ...].
 * @param {number} toleranceInMm - Configurable tolerance threshold in millimeters.
 * @returns {Array} The simplified flat trajectory array.
 */
export function simplifyTruth(truth, toleranceInMm) {
  if (!truth || truth.length === 0) return []

  const toleranceInMeters = toleranceInMm / 1000

  // Group by ball ID
  const groups = {}
  for (const s of truth) {
    groups[s.ball] ??= []
    groups[s.ball].push(s)
  }

  const simplifiedGroups = []
  for (const [ballStr, samples] of Object.entries(groups)) {
    // Sort by timestamp to be absolutely safe
    samples.sort((a, b) => a.t - b.t)
    const simplified = simplifyBallTrajectory(samples, toleranceInMeters)
    simplifiedGroups.push(simplified)
  }

  // Concatenate simplified trajectories, maintaining ball groupings order
  return simplifiedGroups.flat()
}
