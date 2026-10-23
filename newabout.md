# New About / Help panel: design spec

Status: design only. No code changed yet.

## Goal

Merge the 𝑖 help overlay (iframe of `help.html`) and the current About overlay into one panel inside `dist/index.html`. The panel is opened by the 𝑖 button.

- Keep the SEO text in the page DOM, not in an iframe.
- Match the visual style of `help.html` (the phone diagram and the controls card). It echoes the lobby style.
- Keep the page usable on a phone with no horizontal scroll.

## Retirements

- Remove the `help.html` iframe and the `#helpOverlay` markup (`index.html`, about line 473).
- Remove the pending `#aboutMenu` (⑨🎱③) button and its CSS in `dist/css/menu.css`, plus `setAboutMenuVisible` in `src/view/menu.ts`.
- Keep `dist/help.html` as a tiny redirect to `index.html#controls`, so `lobby.html` (line 413), old bookmarks and the `H` key keep working. The `H` key and the 𝑖 button both open the panel.
- Remove the current `<details class="about-more">` overlay styling. The new panel replaces it.

## Layout (top to bottom, inside one panel)

The panel is a single scrollable column. Sections are `<details>` elements, so their text stays in the DOM for crawlers.

1. **Header**
   - Title (`h1`): "Free Online Pool, Snooker & Billiards Game" (visually compact).
   - Close button (×), same behaviour as the current `#helpClose`.

2. **Aiming** (always open, not collapsible)
   - The phone diagram (fine aim / coarse aim) from `help.html`.
   - Scoped under `.about-panel` to avoid clashes with the game's `.top`, `.bottom`, `.label`, `.ball`, `.arrow` classes.
   - The mouse rows (scroll = power, double-click = hit, right-drag = lines) sit here too, since they are the default input.

3. **Keys** (`<details>`, closed by default)
   - Keyboard rows from `help.html`: Aim, Ctrl fine aim, ⇧⇩ spin, Shift side spin, Space hit, M masse, O camera, F fullscreen, C chat, H help, L chromeless drag.
   - Use the same `.help-row` / `kbd` styling.

4. **Game modes** (`<nav>`, visible only in non-2-player modes)
   - Visible when `isSinglePlayer || replayMode || isBotMode || isSpectator`, the same condition as the current About toggle in `menu.ts`. Hidden in live 2-player games.
   - Eight link buttons in a wrapping grid, styled like `.lobby-btn`:
     - 8-ball (`eightball.html`)
     - 9-ball (`nineball.html`)
     - 3-cushion (`index.html?ruletype=threecushion&lod=4`)
     - Snooker (`snooker.html`)
     - Sagu (`index.html?ruletype=sagu`)
     - Map (`map/index.html`)
     - Reveal (`reveal/index.html`)
     - Lobby (absolute URL `https://billiards.tailuge.workers.dev/lobby`)
   - Plain `<a href>` links. No JS is needed to navigate, which keeps them crawlable and deep-linkable.
   - Lobby is always visible, even in 2-player modes, because it is the place to find opponents. Decide during build whether to show it there (see open questions). Map and Reveal are always visible.
   - Groups: "Games" (first five) and "Explore" (Map, Reveal, Lobby). In 2-player modes, only "Explore" is shown.

5. **About** (`<details>`, closed by default)
   - All text from the current About overlay: the H1 intro, physics paragraph, the Pool/Snooker/Carom list, research, multiplayer, language and open-source sections, mentions.
   - Keep the existing `h2` headings. Google indexes closed `<details>`.

## Visual style (match help.html)

- Background: `#111` page, panel `rgb(0 0 0 / 80%)` card, 1px border `rgb(255 255 255 / 10%)`, radius 8px, shadow `0 4px 16px rgb(0 0 0 / 30%)`.
- Text: white / `#eee` for controls, `#e0e0e0` for body. Links `#8ab6f8`.
- Font: Exo, weights 200 and 700, as in `help.html`.
- `kbd`: `#333` background, white text, 6px radius, 2px bottom border `#555`.
- Section summaries: 0.95rem bold, with a chevron. Matches `.label`.
- Buttons: reuse `.lobby-btn` styling so the Lobby button and the mode buttons look the same.

## Mobile sizing

- Panel width: `min(38rem, 100vw - 1rem)`.
- Max height: `85dvh`, with `overflow-y: auto` and `touch-action: pan-y`. The `touch-action` line is needed because `index.css` sets `div { touch-action: none }`.
- Respect `env(safe-area-inset-*)` padding.
- Mode grid: `grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr))`. This gives 2–3 per row on a 360px phone.
- Phone diagram: `max-width: 360px`, aspect ratio 16/9, as in `help.html`. It sits on top of the Keys section.

## Behaviour

- 𝑖 button: opens the panel (`hidden` removed). Closes on × or Escape. Backdrop click closes it.
- `H` key: same as 𝑖.
- `#controls` URL hash: opens the panel and scrolls to Aiming. Used by the `help.html` redirect.
- Mode buttons are plain links. The page reloads on navigation.
- Hide the whole panel in `body.chromeless`, as the current About overlay does.

## Files affected (for the build)

- `dist/index.html`: new panel markup, scoped CSS, remove `#helpOverlay` and `.about-more`.
- `dist/help.html`: replace with a redirect to `index.html#controls`.
- `dist/css/menu.css`: remove `#aboutMenu`.
- `src/view/menu.ts`: remove `setAboutMenuVisible`; `toggleHelpOverlay` and `showOverlay` now toggle the in-page panel.
- `src/controller/controllerbase.ts` (line 139) and `menu.ts` line 97: keep calling `toggleHelpOverlay`, so the `H` key still works.
- `dist/lobby.html` line 413: link can stay on `help.html` (redirect) or point to `index.html#controls`.
- Tests: check `test/` for references to `helpOverlay`, `aboutMenu`, `about-more`, and `setAboutMenuVisible` and update them.

## Open questions

1. Lobby in 2-player modes: show it there too, or hide the whole mode nav?
2. Keep `dist/help.html` as a redirect, or remove it and update `lobby.html`?
3. Should the Keys section open automatically for keyboard users (detected via a keypress), or stay closed?
4. Does the panel close when a mode link is clicked? (Yes, the page navigates anyway.)
