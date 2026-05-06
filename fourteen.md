# Plan: Remove FourteenOne from the Project

## Files to delete

- `src/controller/rules/fourteenone.ts`
- `test/rules/fourteenone.spec.ts`

## Files to modify

### `src/controller/rules/rulefactory.ts`
- Remove `import { FourteenOne } from "./fourteenone"`
- Remove the `case "fourteenone":` branch

### `dist/multi.html`
- Remove the single-player `<li>` linking to `/?ruletype=fourteenone`
- Remove the two-player `<li>` linking to `./2p.html?ruletype=fourteenone`

### `src/utils/rack.ts`
- Remove `Rack.triangle()` — only used by `FourteenOne.rack()`
- Remove `Rack.rerack()` — only used by `FourteenOne.checkRerack()`

### `botrules.md`
- Remove the three references to `FourteenOne` in the Phase 1 method descriptions

## Verification

After changes:
- `yarn lint` — no TypeScript errors
- `yarn test` — no failing tests (fourteenone.spec.ts is gone)
- Manually confirm `/?ruletype=fourteenone` falls through to the `default` (NineBall) case in `RuleFactory` — or confirm the URL is no longer reachable from any UI

## Notes

- `FourteenOne` extends `NineBall` with no shared logic used elsewhere; deleting it has no impact on other rule classes.
- `Rack.triangle` and `Rack.rerack` have no callers outside `fourteenone.ts` — safe to remove. Confirm with `yarn test` that no other spec exercises them.
- The `RuleFactory` default case already returns `NineBall`, so any stale URL with `?ruletype=fourteenone` will silently fall back to nine-ball rather than erroring.
