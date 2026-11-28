# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all TypeScript source code. Core areas include `src/model` (physics), `src/view` (rendering/UI), `src/controller` (state system/input/game flow), and `src/network` (multiplayer).
- `test/` contains Jest tests organized by domain.
- `dist/` holds built artifacts and assets used for deployment (and models, HTML, CSS, images that are not built). `dist/*.js` bundles are gitignored, so a fresh checkout has none until `yarn build`.
- `dist/index.html` is the main game page.

## Build, Test, and Development Commands
- `yarn serve` runs `webpack --watch` alongside `http-server` serving `dist/` on port 8080; open `http://localhost:8080/`. It is not the webpack dev server: no script calls `webpack serve`.
- `yarn build` runs `version-gen` (which writes `src/utils/version.ts`) then webpack, producing production-mode bundles in `dist/`.
- `yarn dev` runs webpack alone, without `version-gen`, so `src/utils/version.ts` must already exist.
- `yarn test` runs Jest with the repo’s config.
- `yarn coverage` runs Jest with coverage reporting.
- `yarn lint` runs `tsc --noEmit` and ESLint.
- `yarn lint:css` runs stylelint over `dist/**/*.{css,html}` — HTML included, not just `dist/css/`.
- `yarn lint:html` runs html-validate with `test/.htmlvalidate.json`, skipping `yandex_*.html`.
- `yarn prettify` formats `{src,test}/**/*.[jt]s`, `dist/**/*.{css,html}`, root `*.[jt]s` and `*.json`, with caching. It leaves CSS/HTML at the repo root alone, and it does rewrite tracked `dist/**/*.html`.

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
- Yarn 4.9.1, per `packageManager` in `package.json` (there is no `engines` field). Node 26 no longer bundles Corepack, so install the CLI directly: `npm i -g @yarnpkg/cli-dist@4.9.1`, then follow the README's "Local setup and build".

## Basic Quality Checks

Before submitting changes, ensure the following commands pass:

- **Build:** `yarn build` — it generates `src/utils/version.ts`; plain `yarn dev` cannot resolve that import on a fresh checkout
- **Test:** `yarn test`
- **Format:** `yarn prettify`

## Browser / Chrome DevTools

**Do not open or drive a browser unless the user asks for it.** Verify page
changes from the markup, the CSS and the project's own linters; reach for the
`chrome-devtools` MCP server only once the request comes first.

The `chrome-devtools` MCP server (`~/.agents/mcp.json`) works: it launches a
headful Chrome on native Wayland with hardware GL, so screenshots and traces
reflect the real GPU. Verify with `list_pages`. `--no-page-id-routing` is
required: without it, page-scoped tools demand a numeric `pageId` that this
client cannot send.

Profiling goes through the MCP, not raw CDP: `performance_start_trace` /
`_stop_trace` / `_analyze_insight` for traces, `take_heapsnapshot` plus the
`get_heapsnapshot_*` / `query_heapsnapshot_objects` family for memory
(dominators, retainers, duplicate strings), and `lighthouse_audit`.

Only reach for CDP-from-Node (`ws` is in `node_modules`) for things no tool
exposes, e.g. `--js-flags=--expose-gc` or scripted loop profiling. Launch with
`setsid nohup /usr/bin/google-chrome-stable --headless=new
--remote-debugging-port=9223 --no-sandbox
--user-data-dir=/tmp/prof-chrome-profile --js-flags=--expose-gc
--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader
about:blank >/tmp/chrome.log 2>&1 </dev/null &`, then speak CDP over the
WebSocket from `fetch("http://127.0.0.1:9223/json/version")` — use `127.0.0.1`,
not `localhost`. Note those runs are software-rendered, so timings are not
representative. Attribute frames with `@jridgewell/trace-mapping` against a
`dist/*.js.map` from an **unminified** build; the shipped minified bundle has no
usable map.