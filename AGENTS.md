# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all TypeScript source code. Core areas include `src/model` (physics), `src/view` (rendering/UI), `src/controller` (state system/input/game flow), and `src/network` (multiplayer).
- `test/` contains Jest tests organized by domain.
- `dist/` holds built artifacts and assets used for deployment (and models, HTML, CSS, images that are not built).
- `dist/index.html` is the main game page.

## Build, Test, and Development Commands
- `yarn serve` starts the webpack dev server; open `http://localhost:8080/`.
- `yarn build` produces a production build via webpack.
- `yarn test` runs Jest with the repo’s config.
- `yarn coverage` runs Jest with coverage reporting.
- `yarn lint` runs `tsc --noEmit` and ESLint.
- `yarn lint:css` runs stylelint on CSS files in `dist/css/`.
- `yarn lint:html` runs html-validate on HTML files in `dist/`.
- `yarn prettify` formats JS/TS/JSON/CSS/HTML and caches results.

## Coding Style & Naming Conventions
- TypeScript is the primary language; keep types explicit at public boundaries.
- Indentation follows the existing codebase (2 spaces in TS/JS files) no semicolons.
- Filenames are lower-case and descriptive. Tests use `*.spec.ts` (e.g., `test/model/cushion.spec.ts`).
- **Always** run ESLint and Prettier after changes `yarn lint` and **`yarn prettify`**.

## Testing Guidelines
- Jest is the test runner; configuration is in `test/jest.config.js`.
- Add tests alongside the affected domain (e.g., physics changes in `test/model`).
- Run `yarn test` locally before submitting; `yarn coverage` for deeper validation.
- After making changes, run `yarn lint` and `yarn test`.

## Configuration Notes
- Node/Yarn usage matches the README instructions (Yarn 1.x; see `package.json` engines).## Basic Quality Checks

Before submitting changes, ensure the following commands pass:

- **Build:** `yarn dev`
- **Test:** `yarn test`
- **Format:** `yarn prettify`

## Browser / Chrome DevTools

The `chrome-devtools` MCP server is configured in `~/.agents/mcp.json`
(`npx -y chrome-devtools-mcp@latest`). On this machine the MCP process starts
without `DISPLAY`, so every call fails with
*"Missing X server to start the headful browser"* — the display cannot be fixed
from the shell because it is the MCP process's environment that is empty.
Two ways forward:

1. **Make the MCP usable** — add a mode flag to the server args and restart the
   MCP connection:

   ```json
   { "mcpServers": { "chrome-devtools": { "command": "npx",
     "args": ["-y", "chrome-devtools-mcp@latest", "--headless"] } } }
   ```

   or attach to a browser you started yourself with
   `"--browserUrl", "http://127.0.0.1:9222"` while Chrome runs with
   `--remote-debugging-port=9222`.

2. **Drive Chrome over CDP from Node** (needed for profiling anyway — the MCP
   exposes no `HeapProfiler` sampling or CPU profiler):

   ```bash
   setsid nohup /usr/bin/google-chrome-stable --headless=new \
     --remote-debugging-port=9223 --no-sandbox \
     --user-data-dir=/tmp/prof-chrome-profile --js-flags=--expose-gc \
     --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader \
     about:blank >/tmp/chrome.log 2>&1 </dev/null &
   ```

   Then `fetch("http://127.0.0.1:9223/json/version")` for the browser
   WebSocket and speak CDP over it (`ws` is already in `node_modules`).
   Always launch background servers with `setsid` so they survive the tool
   shell, use `127.0.0.1` (not `localhost`) in URLs, and kill what you start.

   Attribute frames with `@jridgewell/trace-mapping` against a `dist/*.js.map`
   from an **unminified** build — the shipped minified bundle has no usable
   map. See `profile-sim-loop.md` for the full profiling recipe.