# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all TypeScript source code. Core areas include `src/model` (physics), `src/view` (rendering/UI), `src/controller` (input/game flow), and `src/network` (multiplayer and scoring).
- `test/` contains Jest tests organized by domain (e.g., `test/model`, `test/rules`, `test/view`).
- `dist/` holds built artifacts and assets used for deployment (models, HTML, CSS, images).

## Build, Test, and Development Commands
- `yarn serve` starts the webpack dev server; open `http://localhost:8080/`.
- `yarn build` produces a production build via webpack.
- `yarn test` runs Jest with the repo’s config.
- `yarn coverage` runs Jest with coverage reporting.
- `yarn lint` runs `tsc --noEmit` and ESLint.
- `yarn prettify` formats JS/TS/JSON/CSS/HTML and caches results.

## Coding Style & Naming Conventions
- TypeScript is the primary language; keep types explicit at public boundaries.
- Indentation follows the existing codebase (2 spaces in TS/JS files).
- Filenames are lower-case and descriptive. Tests use `*.spec.ts` (e.g., `test/model/cushion.spec.ts`).
- Use ESLint and Prettier before opening a PR: `yarn lint` and `yarn prettify`.

## Testing Guidelines
- Jest is the test runner; configuration is in `test/jest.config.js`.
- Add tests alongside the affected domain (e.g., physics changes in `test/model`).
- Prefer deterministic tests; use `jest.useFakeTimers()` when timing is involved.
- Run `yarn test` locally before submitting; `yarn coverage` for deeper validation.
- After making changes, run `yarn lint` and `yarn test`.

## Commit & Pull Request Guidelines
- There is no enforced commit message standard in this repo. Use concise, imperative summaries (e.g., “Fix cushion bounce edge case”).
- PRs should include a clear description, testing notes, and screenshots or short clips for visual or physics changes.
- Link relevant issues when applicable, and call out any behavior changes or tuning constants.

## Configuration Notes
- Node/Yarn usage matches the README instructions (Yarn 1.x; see `package.json` engines).
- For model assets, use `yarn gltfpack` to regenerate optimized `.gltf` files in `dist/models`.
