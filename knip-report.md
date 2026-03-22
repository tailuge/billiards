# Knip Report - Billiards Project

## Unused Files
- `src/events/eventhistory.ts`

## Unused DevDependencies
These dependencies appear to be unused in the project:
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `globals`
- `ts-loader`
- `ts-node`
- `webpack-node-externals`

## Unlisted Dependencies
These dependencies are used in the code but not listed in `package.json`:
- `terser-webpack-plugin` (Used in `webpack.config.js`)

## Unlisted Binaries
These binaries are used in scripts but might not be explicitly listed as dependencies:
- `markdownlint-cli2`
- `yarn-check`
- `gltfpack`

## Unresolved Imports
- `./utils/version` in `src/index.ts` (This is generated at build time, so it's expected)
- `../../utils/version` in `src/network/client/matchresult.ts`
- `./version` in `src/utils/uid.ts`

## Unused Exports
- `ConcedeEvent` in `src/controller/controller.ts` (Note: `ConcedeEvent` is used, but the export here might be redundant)
- `downloadObjectAsJson` in `src/utils/gltf.ts`

## Unused Exported Types
- `FoulResult` in `src/controller/rules/snookerutils.ts`
- `BallPositions` in `src/diagram/real/realposition.ts`
- `LogEntry` in `src/network/bot/logger.ts`
- `ErrorReport` in `src/network/client/clienterrorreporter.ts`
- `NotificationActionHandlers` in `src/view/notification.ts`
- `ParticleSystemConfig` in `src/view/particle-system.ts`
- `TimeoutOptions` in `src/view/timeoutbutton.ts`

---

## Can I reduce bundle size?

Yes, there are several ways to reduce the bundle size:

1.  **Remove Unused Code and Files**:
    - Delete `src/events/eventhistory.ts` as it's not imported anywhere.
    - Remove unused exports and types identified by Knip to help with tree-shaking.

2.  **Optimize Dependency Usage**:
    - Remove unused `devDependencies` to keep the environment lean.
    - Explicitly add `terser-webpack-plugin` to `devDependencies` to ensure consistent builds.

3.  **Three.js Optimization**:
    - While the project uses named imports from `three` (e.g., `import { Vector3 } from "three"`), which Webpack can tree-shake, further optimization could involve:
        - Ensuring `sideEffects: false` in `package.json` is correctly respected (it is currently set).
        - Auditing the `splitChunks` configuration in `webpack.config.js`. Currently, it separates `three_core`, `three_module`, and `three_examples`. Over-splitting can sometimes lead to redundant code if not carefully managed.
        - Using more granular imports if tree-shaking isn't performing optimally, although named imports from the main entry point are generally recommended for modern Three.js versions.

4.  **Production Minification**:
    - The project already uses `TerserPlugin` with `swcMinify`, which is good for performance and size.
    - Ensure that all assets (like GLTF models) are minified using `gltfpack` as already defined in the `scripts` section of `package.json`.
