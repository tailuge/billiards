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

// Chat emoji pool: every single-codepoint RGI emoji, generated via the
// Unicode RGI_Emoji property (ES2024 /v flag) instead of a hardcoded list.
// Older browsers that reject the regex fall back to a small literal set.
let chatPool: string[] | null = null
function chatEmojiPool(): string[] {
  if (!chatPool) {
    try {
      const re = new RegExp("\\p{RGI_Emoji}", "v")
      chatPool = []
      for (const [lo, hi] of [
        [0x2000, 0x2bff],
        [0x1f000, 0x1fbff],
      ]) {
        for (let cp = lo; cp <= hi; cp++) {
          const ch = String.fromCodePoint(cp)
          if (re.test(ch)) chatPool.push(ch)
        }
      }
    } catch {
      chatPool = ["🍺", "🌵", "🐕", "⚓", "🚀", "⏰", "🔑", "💡"]
    }
  }
  return chatPool
}

// Emoji that are guaranteed to appear in the random emoji slots (placed randomly)
const alwaysEmojis = ["🚬", "🥃", "🍀", "👏", "🎖️", "👀"]

// Build a list of `count` unique emojis containing the alwaysEmojis,
// shuffled so the fixed emojis land in random positions.
export function randomEmojis(count: number): string[] {
  const pool = [...chatEmojiPool()].filter((e) => !alwaysEmojis.includes(e))
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return [...alwaysEmojis, ...pool].slice(
    0,
    Math.max(count, alwaysEmojis.length)
  )
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
