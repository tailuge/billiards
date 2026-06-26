# Debloat Report - Billiards Project

This report assesses the project for bloat and identifies areas that can be removed or simplified to improve maintainability and reduce the codebase footprint.

## 1. Unused Code and Dead Logic

### New Rules Engine (`src/controller/newrules/`)
- **Finding:** The directory `src/controller/newrules/` contains a "New Rules Engine Architecture" (documented in `NewRules.md`).
- **Assessment:** A search of the codebase confirms that none of the files in this directory (`snooker.ts`, `types.ts`) are imported or used by the main application, although they have unit tests (`test/newrules/snooker.spec.ts`). It appears to be an incomplete or abandoned refactoring effort towards a stateless rules engine.
- **Recommendation:** Remove the `src/controller/newrules/` directory and its corresponding tests if there is no plan to complete the migration.

### Experimental Physics Plots (`src/diagram/throw_gpt4o.ts`)
- **Finding:** This file contains an implementation of throw physics generated or inspired by GPT-4o.
- **Assessment:** While it is imported by `throwplot.ts`, it seems to be redundant with the core `Collision` model and serves more as a comparison tool than a production component.
- **Recommendation:** If the comparison is no longer needed for development, this can be removed or moved to a dedicated `experimental/` folder.

## 2. Redundant or Legacy Assets in `dist/`

The `dist/` directory contains several HTML files that appear to be legacy test cases or redundant entry points.

- **`dist/2p.html`, `dist/2tab.html`, `dist/3r.html`, `dist/m2.html`**:
  - **Assessment:** These files seem to be used for local testing or are legacy versions of the multiplayer/lobby interface.
  - **Recommendation:** Consolidate these into a `test/manual/` directory if still needed, or remove them if superseded by `lobby.html` and `multi.html`.

- **`dist/blog1.html`, `dist/blog2.html`, `dist/blog3.html`**:
  - **Assessment:** Static blog content embedded directly in the distribution folder.
  - **Recommendation:** Move these to a `docs/blog/` directory or a proper CMS/static site generator if the project grows, to keep `dist/` focused on the application.

## 3. Obsolete Documentation and Design Notes

Several Markdown files in the root directory appear to be historical design notes, temporary plans, or specifications that are no longer actively maintained or referenced.

- **Files:**
  - `ball-svg-spec.md`
  - `crashcause.md`
  - `json-passthrough-dsl-spec.md`
  - `REPLAYPLAN.md`
  - `SNOOKER.md` (Note: `SNOOKER.md` seems redundant given `src/controller/rules/snooker.ts` exists and is the source of truth).
  - `shotanalysis.md`
  - `tabletexture.md`
  - `plan.md`
- **Assessment:** These files clutter the root directory and can be confusing for new contributors.
- **Recommendation:** Move these to an `archive/design/` or `docs/notes/` directory, or remove them if the information is now captured in the source code or `AGENTS.md`.

## 4. Webpack Entry Points

- **Finding:** `webpack.config.js` defines several entry points: `mathavan`, `compare`, `stronge`, `aimsensitivity`.
- **Assessment:** These generate separate bundles for developer-centric diagrams and analysis tools.
- **Recommendation:** While useful, these should be clearly separated in the UI (e.g., in a "Developer Tools" section of the help menu) to justify their weight in the build process, or they could be conditionally built.

## Summary of Actionable Items

| Item | Action | Priority |
| :--- | :--- | :--- |
| `src/controller/newrules/` | Remove | High |
| Root `.md` files (except README/AGENTS/LICENSE) | Archive or Remove | Medium |
| `dist/*.html` (legacy test files) | Remove or Relocate | Medium |
| `src/diagram/throw_gpt4o.ts` | Remove if redundant | Low |
