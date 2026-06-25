# JSON Passthrough DSL Extension — Specification

## Overview

Extend the billiards SVG diagram engine (`dist/diagrams/dsl.js` + `dist/diagrams/svg.js`) to support a new `data-json-shots` attribute on `<svg class="billiards-table">` elements. This attribute accepts raw JSON matching the physics worker's input format and passes it through as-is, bypassing the existing DSL parser.

## Motivation

The existing DSL (e.g. `bottom:0 -> top:5 @2R | 3 oclock max | 20%`) is expressive for common shots but cannot express arbitrary ball positions (multiple object balls, exact coordinates, etc.). The JSON passthrough format lets users specify the full worker config directly.

## Syntax

### New attribute: `data-json-shots`

```
<svg class="billiards-table"
     data-json-shots='[{"balls": [...], "shot": {...}}, ...]'
     data-figure="Figure caption">
</svg>
```

- Value is a JSON **array** of shot config objects.
- Each element in the array is a single shot config matching the worker's input schema.
- The JSON is passed through as-is — no parsing, no transformation, no validation of fields.
- Only `JSON.parse()` is applied. If it fails, an error is shown in the status text and logged to console.

### Example

```json
[
  {
    "balls": [
      { "id": 0, "pos": { "x": -0.5, "y": 0, "z": 0 } },
      { "id": 1, "pos": { "x": 0.5, "y": 0.05, "z": 0 } },
      { "id": 2, "pos": { "x": 0, "y": 0.5, "z": 0 } }
    ],
    "shot": {
      "cueBallId": 0,
      "angle": 0,
      "power": 2.5,
      "offset": { "x": 0.5, "y": -0.35 },
      "elevation": 0
    }
  }
]
```

## Coexistence with `data-shots`

- Both `data-shots` (DSL) and `data-json-shots` (JSON) can be present on the same `<svg>` element.
- Both are optional — an element with neither renders just the table.
- When both are present, the configs are **merged**: DSL shots run first, JSON shots second.
- Shot IDs are auto-assigned sequentially across the merged list (0, 1, 2, …), unless an ID is already present in the JSON config (see below).

## ID Handling

- If a JSON shot config already contains an `id` field, that ID is preserved.
- If a JSON shot config does not have an `id`, one is auto-assigned (the next available index in the merged sequence).
- This matches the existing DSL behavior where `id: i` is assigned from the loop index.

## Defaults

The physics worker (`src/worker.ts`) provides defaults for the following fields:

| Field            | Default              |
|------------------|----------------------|
| `stepSize`       | `0.001953125`        |
| `maxIterations`  | `200000`             |
| `params`         | `{}`                 |
| `warpClearanceR` | `2.5`                |

Only `balls` and `shot` are required by the worker. No defaults are applied by the DSL layer — the worker handles it.

## Error Handling

- If `JSON.parse()` throws, the status text displays `JSON parse error: <message>` and the error is logged via `console.error`.
- The SVG still renders the table; just no trajectories are drawn for the JSON configs.
- DSL parse errors (from `data-shots`) continue to be handled independently as before.

## Inset Rendering

- The spin/power inset (ball + cue tip dot + power bar) renders the same way for both DSL and JSON configs.
- It reads `config.shot.offset` (x, y) and `config.shot.power` — these fields are present in the JSON format.
- The inset uses the **first** config (`configs[0]`), same as current behavior.

## Figure Text

- `data-figure` continues to work as-is.
- No JSON field for caption — use `data-figure` for figure text in all modes.

## Code Changes Required

### `dist/diagrams/dsl.js`

Add one new exported function:

```ts
/**
 * Parse a JSON shot array into SimulationConfig objects.
 *
 * @param {string} jsonText — JSON string of shot config array
 * @returns {Array} Array of SimulationConfig objects (passthrough)
 */
export function parseJsonShots(jsonText) { ... }
```

Behavior:
- `JSON.parse(jsonText)` — throw on parse failure.
- Expects an array.
- For each element, auto-assign `id` if absent (starting from a `startId` parameter).
- No other transformation — pure pass-through.

### `dist/diagrams/svg.js`

Update `runElement()`:

1. Read both `el.dataset.shots` and `el.dataset.jsonShots` (`data-json-shots` maps to `dataset.jsonShots`).
2. Parse DSL: `configs = parseShots(dslText)` if present.
3. Parse JSON: `jsonConfigs = parseJsonShots(jsonText, configs.length)` if present (`startId` = length of DSL configs so far for sequential IDs).
4. Merge: `allConfigs = [...dslConfigs, ...jsonConfigs]`.
5. Use `allConfigs` for simulation, rendering, and inset.

## What Does NOT Change

- Existing DSL syntax and parsing are untouched.
- Worker code (`src/worker.ts`, `dist/worker.js`) is not modified.
- Trajectory rendering logic is unchanged.
- Inset rendering logic is unchanged (works from `config.shot`).
- The `data-shots` attribute behavior is completely backward-compatible.
- No new HTML files or test files are required (unless the user asks for them later).

## Design Decisions (from interview)

| Decision                    | Choice                                            |
|-----------------------------|---------------------------------------------------|
| Detection method            | Separate `data-json-shots` attribute               |
| Coexistence                | Both allowed, merged: DSL first, JSON second       |
| Defaults                   | None applied by DSL — worker handles them          |
| Multiple shots in JSON     | JSON array of objects                              |
| Figure text                | `data-figure` works as-is                          |
| Inset rendering            | Same as DSL, from `config.shot`                   |
| Error handling             | Status text + console.error                        |
| ID assignment              | Preserve JSON id if present, else auto-assign      |
| Field validation           | None — pass through as-is                          |
| Format flexibility         | Exact worker format only (no shorthand)            |
