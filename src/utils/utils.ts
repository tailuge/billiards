import { EventType } from "../events/eventtype"
import { Recorder } from "../events/recorder"

export function isFirstShot(recorder: Recorder): boolean {
  return !recorder.entries.some((e) => e.event.type === EventType.AIM)
}

export function round(num) {
  return Math.fround(num)
}

export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function atan2(y, x) {
  return Math.fround(Math.atan2(y, x))
}

export function pow(x, y) {
  return Math.fround(Math.pow(x, y))
}

export function sin(theta) {
  return Math.fround(Math.sin(theta))
}

export function cos(theta) {
  return Math.fround(Math.cos(theta))
}

export function sqrt(theta) {
  return Math.fround(Math.sqrt(theta))
}

export function exp(theta) {
  return Math.fround(Math.exp(theta))
}

export function hypot(x, y) {
  return Math.fround(Math.hypot(x, y))
}

export function bisectionSolver(
  func: (x: number) => number,
  low: number,
  high: number,
  maxIter = 100,
  tol = 1e-8
): number {
  let a = low
  let b = high
  if (func(a) * func(b) > 0) return b
  for (let i = 0; i < maxIter; i++) {
    const mid = (a + b) / 2
    const val = func(mid)
    if (Math.abs(val) < tol) return mid
    if (func(a) * val < 0) {
      b = mid
    } else {
      a = mid
    }
  }
  return (a + b) / 2
}

// Emoji ranges covering: animals, food, plants, objects, activities,
// travel, transport — excluding smileys, flags, hearts, and abstract symbols.
const emojiIncludeRanges: [number, number][] = [
  [0x1f310, 0x1f31f], // globe, moon, star
  [0x1f321, 0x1f3ff], // thermometer to miscellaneous
  [0x1f400, 0x1f492], // rat to wedding (animals, plants, food, objects)
  [0x1f4a0, 0x1f4ff], // diamond to prayer beads (skip hearts 0x1f493-0x1f49f)
  [0x1f500, 0x1f53d], // twisted arrows to down-pointing triangle
  [0x1f550, 0x1f567], // clocks
  [0x1f680, 0x1f6ff], // rocket to transport & misc
  [0x1f900, 0x1f9ff], // supplemental symbols & objects
  [0x1fa70, 0x1faff], // extended-A (objects, animals)
]

let _emojiCount = 0
function emojiTotal(): number {
  if (_emojiCount) return _emojiCount
  _emojiCount = emojiIncludeRanges.reduce(
    (sum, [lo, hi]) => sum + (hi - lo + 1),
    0
  )
  return _emojiCount
}

export function randomEmoji(): string {
  let index = Math.floor(Math.random() * emojiTotal())
  for (const [lo, hi] of emojiIncludeRanges) {
    const size = hi - lo + 1
    if (index < size) return String.fromCodePoint(lo + index)
    index -= size
  }
  return "🎱"
}

export const ruleTypeMap: Record<string, { emoji: string; title: string }> = {
  nineball: { emoji: "⑨", title: "nineball" },
  eightball: { emoji: "🎱", title: "eightball" },
  snooker: { emoji: "🔴", title: "snooker" },
  threecushion: { emoji: "③", title: "threecushion" },
  sagu: { emoji: "④", title: "sagu" },
}

export function getRuleEmoji(ruleType: string): string {
  const base = ruleType.split("-")[0]
  return ruleTypeMap[base]?.emoji ?? ruleType
}
