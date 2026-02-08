# Lower Menu CSS Notes

This describes the lower menu layout in `dist/index.html` as driven by `dist/index.css`.

## Structure (HTML)
- The lower menu is `.panel` and contains, in order:
- `button.hitButton` (`#cueHit`)
- `.ballContainer` with `.objectBall` and `.cueBall` (plus `.cueTip`)
- `input.powerSlider` (`#cuePower`)
- `.chatarea` which contains:
- `.chatoutput` (links) and `.outerMenu` (menu buttons)

## Layout (CSS)
- `.panel` is a horizontal flex row with `height: 17%` of the viewport and `align-items: center`.
- The 3 main controls are sized as percentages of the panel height:
- `.hitButton` is `height: 70%` and has `min-width: 80px` plus `aspect-ratio: 0.4`.
- `.ballContainer` is `height: 70%` with `aspect-ratio: 1` so it stays square. The balls inside are `height: 100%` (cue) and `99%` (object).
- `.powerSlider` is `height: 70%` and uses `writing-mode: vertical-lr` with `direction: rtl` to display vertically.
- `.chatarea` is `height: 70%`, `display: flex`, `flex-direction: column`, and `flex-grow: 1`.
- `.chatoutput` is `height: 30%` inside `.chatarea` and uses `min-width: 100%` so it stretches wide.
- `.outerMenu` is `height: 50%` and contains `.menuButton` elements at `height: 100%`.

## Spacing Rules
- Several elements use `margin: auto` or explicit left/right margins. This centers them vertically within the panel and adds horizontal spacing.
- Because the main elements are capped at `70%` height (and menu sub-areas at `30%`/`50%`), the panel never fully fills vertically by design.

## Practical Implications
- The lower menu height is constrained by the `70%` caps and `align-items: center` on `.panel`.
- To make elements fill more of the panel, the main knobs are:
- `.panel { align-items: stretch; }`
- `.hitButton`, `.ballContainer`, `.powerSlider`, `.chatarea` height values
- `.chatoutput` and `.outerMenu` height values inside `.chatarea`
