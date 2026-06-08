# Usage

## inspect.js

Converts an SS recording to a prepared JSON file for use in viewer.html.

```sh
node inspect.js <input.txt> [output.json]
```

If `output.json` is omitted, it defaults to `input.json` (same name, `.json` extension).

**Example:**

```sh
node inspect.js SS_max_spin_02.txt SS_max_spin_02.json
```

Run from the `dist/fit/` directory, or prefix paths accordingly.

### Output

Prints a summary to stdout:

```
ball 0: 300 samples  x:[-1.474, 1.470]  y:[-0.725, 0.716]  dir=-0.0123rad  speed=3.086m/s  → MOVER
ball 1:   3 samples  x:[1.060, 1.091]   y:[0.485, 0.491]
ball 2:   2 samples  x:[1.379, 1.380]   y:[0.384, 0.384]

Cue ball: dataset 0
```

Writes a JSON file containing:
- `source` — original filename
- `report` — the stdout summary
- `sim` — initial conditions for the simulator (ball positions, shot params, physics params)
- `truth` — raw ball position samples in game units, centre-relative

### Note on Node warning

Node may print a `MODULE_TYPELESS_PACKAGE_JSON` warning. This is harmless —
the script runs correctly. To suppress it, add `"type": "module"` to the root
`package.json` (or run with `node --input-type=module`).

## viewer.html

Open `dist/fit/viewer.html` in a browser (via a local server, e.g. `yarn serve`).

- Loads `SS_max_spin_02.json` automatically if present alongside the page
- Use the file picker to load any prepared JSON
- Edit the `shot` textarea and click **Run Sim** to run the simulation
- **Save JSON** writes the file back with updated shot params
