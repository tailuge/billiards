# Repository Guidelines

## Project
3D billiards/snooker (Three.js + TypeScript + Webpack). Play at `http://localhost:8080/`.

## Setup
```shell
nvm use v24.11.0
corepack enable
yarn install
```

## Commands
| Command | What it does |
|---------|-------------|
| `yarn dev` | webpack (single build) |
| `yarn build` | `version-gen + webpack` (CI uses this) |
| `yarn serve` | `concurrently "yarn watch" "yarn start-server"` → http://localhost:8080/ |
| `yarn lint` | `tsc --noEmit && eslint .` |
| `yarn lint:css` | stylelint on `dist/**/*.{css,html}` |
| `yarn test` | `jest --config ./test/jest.config.js --verbose --silent` |
| `yarn coverage` | same as test + coverage |
| `yarn prettify` | prettier with `--trailing-comma es5 --no-semi` |
| `yarn gltfpack` | minifies glTF models in `dist/models/` |

## Quality gate (run in order)
1. `yarn lint` (tsc + eslint)
2. `yarn test`
3. `yarn prettify`

## Architecture
- **MVC-ish**: `src/model/` (physics), `src/view/` (rendering/UI), `src/controller/` (state machine: aim, playshot, replay, etc.)
- **Entry points**: `src/index.ts` (main game), `src/diagrams.ts`, `src/mathavan.ts`, `src/compare.ts`
- **Events**: 23 event types in `src/events/` drive the game loop
- **Network**: `src/network/client/` (multiplayer client), `src/network/bot/` (AI players)
- **Physics**: `src/model/physics/` — collision, cushion, pocket, knuckle, throw, mathavan
- **Test mocks**: GLTFExporter, GLTFLoader, sound in `test/mocks/`

## Conventions
- No semicolons, 2-space indent, trailing commas where ES5 allows (`prettier --no-semi --trailing-comma es5`)
- No `any` restrictions, unused vars warn with `_` prefix, `require()` allowed
- `*.spec.ts` test files mirror `src/` structure under `test/`
- `VERSION` auto-generated from date into `src/utils/version.ts` by `version-gen`

## Gotchas
- `yarn build` fails if `src/utils/version.ts` is missing (auto-generated)
- `packageManager: yarn@4.9.1` — **not Yarn v1**
- ESLint uses flat config (`eslint.config.mjs`), not `.eslintrc`
- Test config at `test/jest.config.js` (not root), uses SWC transform, jsdom env
- `dist/*.js` is gitignored except `dist/lobby.js`
- `.opencode/`, `.jules/`, `.qwen/`, etc. are gitignored
