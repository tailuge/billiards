# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all TypeScript source code. Core areas include `src/model` (physics), `src/view` (rendering/UI), `src/controller` (input/game flow), and `src/network` (multiplayer and scoring).
- `test/` contains Jest tests organized by domain (e.g., `test/model`, `test/rules`, `test/view`).
- `dist/` holds built artifacts and assets used for deployment (models, HTML, CSS, images).
- `dist/index.html` is the main game page.

## Build, Test, and Development Commands
- `yarn serve` starts the webpack dev server; open `http://localhost:8080/`.
- `yarn build` produces a production build via webpack.
- `yarn test` runs Jest with the repo’s config.
- `yarn coverage` runs Jest with coverage reporting.
- `yarn lint` runs `tsc --noEmit` and ESLint.
- `yarn prettify` formats JS/TS/JSON/CSS/HTML and caches results.

## Coding Style & Naming Conventions
- TypeScript is the primary language; keep types explicit at public boundaries.
- Indentation follows the existing codebase (2 spaces in TS/JS files) no semicolons.
- Filenames are lower-case and descriptive. Tests use `*.spec.ts` (e.g., `test/model/cushion.spec.ts`).
- Keep ball serialisation compact; do not include `state` in serialized ball data.
- Always run ESLint and Prettier after changes `yarn lint` and `yarn prettify`.

## Testing Guidelines
- Jest is the test runner; configuration is in `test/jest.config.js`.
- Add tests alongside the affected domain (e.g., physics changes in `test/model`).
- Prefer deterministic tests; use `jest.useFakeTimers()` when timing is involved.
- Run `yarn test` locally before submitting; `yarn coverage` for deeper validation.
- After making changes, run `yarn lint` and `yarn test`.

## Configuration Notes
- Node/Yarn usage matches the README instructions (Yarn 1.x; see `package.json` engines).
- For model assets, use `yarn gltfpack` to regenerate optimized `.gltf` files in `dist/models`.

## Physics Implementation Notes

The physics engine is based on:
- **Han 2005:** For ball mechanics (surface velocity, sliding/rolling motion).
- **Alciatore:** For ball-to-ball collisions incorporating throw effects.
- **Mathavan 2010:** For cushion bounces, including spin-induced effects.

Key equations and constants are documented in the `README.md`.

## Basic Quality Checks

Before submitting changes, ensure the following commands pass:
- **Build:** `yarn dev`
- **Test:** `yarn test`
- **Format:** `yarn prettify`