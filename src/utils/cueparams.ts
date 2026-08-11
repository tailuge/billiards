import { CueParams, DEFAULT_CUE_PARAMS } from "../view/cuemesh"

/**
 * Infers a typed value from its string form, so URL params (which are always
 * strings) can feed typed config without per-key coercion. `true`/`false`
 * become booleans, numeric-looking strings become numbers, and everything
 * else (e.g. `#26282b` colours) stays a string.
 */
export function parseTypedValue(s: string): string | number | boolean {
  if (s === "true") return true
  if (s === "false") return false
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s)
  return s
}

/**
 * Maps a dotted `cue.*` params record (as produced by Session.applyUrlParams
 * from `custom.cue.*` / `opponent.custom.cue.*` URL params) to CueParams.
 * Unknown keys are ignored; missing fields fall back to DEFAULT_CUE_PARAMS.
 */
export function cueParamsFromCustom(custom: Record<string, string>): CueParams {
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(custom)) {
    if (key.startsWith("cue.")) {
      out[key.slice("cue.".length)] = parseTypedValue(value)
    }
  }
  return { ...DEFAULT_CUE_PARAMS, ...(out as CueParams) }
}
