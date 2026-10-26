# Smaller AIM messages

## Verdict

Yes. **Decision: AIM is compacted at the JSON boundary.** `AimEvent.toJSON()`
will emit:

- `offset` omitted when `x` and `y` are both zero; otherwise `offset: [x, y]`;
- `pos` always as `[x, y]`;
- `elevation` omitted when `0`;
- `i` omitted when `0`.

`AimEvent.fromJson` supplies the class defaults for anything absent. The class
keeps its existing fields and defaults; only the JSON boundary changes. No
TypeScript property becomes optional.

Old deployed readers are explicitly out of scope. The reader still accepts the
old object forms so existing replay links, fixtures and pasted bug reports keep
working, but the writer only ever emits arrays and omitted keys. Deploy the
writer and reader together; there is no phased rollout.

One `toJSON()` on `AimEvent` covers live AIM, HIT's `tablejson.aim`, WATCHAIM's
`aim`, replay shots/links and resume snapshots, because they are all
`AimEvent` instances stringified through the same `JSON.stringify` path.

## Current path

Write (`Aim` / `PlaceBall` → network):

- `Aim.handleInput` and `PlaceBall.handleInput` call
  `container.sendEvent(table.cue.aim)`; the event is the live `AimEvent`
  instance owned by the cue (`src/controller/aim.ts:80`,
  `src/controller/placeball.ts:74`).
- `Container.sendEvent` records it, then `Throttle` (250 ms) passes it to
  `broadcast` (`src/container/container.ts:207-214`, `src/events/throttle.ts`).
- `BrowserContainer.broadcast` sets `clientId` / `playername`, then calls
  `EventUtil.serialise(event)` (`src/container/browsercontainer.ts:381-386`).
- `EventUtil.serialise` has no AIM branch today, so it falls through to
  `JSON.stringify(event)` (`src/events/eventutil.ts:21`). Since `AimEvent`
  fields are instance fields with initializers, every field is emitted.
- `MessagingMessageRelay.publish` parses that string and hands the object to
  `@tailuge/messaging`, which adds the `{type, data, senderId, meta}` envelope
  (`src/network/client/messagingmessagerelay.ts`). The client only controls the
  inner `data` object.

Read:

- `BrowserContainer.netEvent` → `EventUtil.fromSerialised` →
  `AimEvent.fromJson` (`src/container/browsercontainer.ts:340-347`,
  `src/events/eventutil.ts:87`, `src/events/aimevent.ts:24`).
- The same `AimEvent.fromJson` also decodes HIT's nested aim
  (`Table.updateFromSerialised`, `src/model/table.ts:212-218`), replay shots
  (`src/controller/replay.ts:134` and `:219`), bot strategies
  (`threecushionstrategy.ts`, `thefarjaw.ts`, `clawbreak.ts`) and
  `AimEvent.copy()` (`src/events/aimevent.ts:37`).

## Field-by-field safety

| Field       | Omit when                                                | Current reader                        | Reader change needed            |
| ----------- | -------------------------------------------------------- | ------------------------------------- | ------------------------------- |
| `offset`    | omit when `x === 0 && y === 0`; otherwise write `[x, y]` | `vec(json.offset)`                    | **Yes** — array/absent handling |
| `elevation` | `elevation === 0`                                        | `json.elevation \|\| 0`               | No (already defaults)           |
| `i`         | `i === 0`                                                | field default `0`, then `if (json.i)` | No (already defaults)           |
| `pos`       | always write `[x, y]` (never omit)                       | `vec(json.pos)`                       | **Yes** — array handling        |
| `angle`     | never                                                    | direct                                | No — `0` is a valid direction   |
| `power`     | never                                                    | direct                                | No                              |

Notes:

- `offset` and `pos` are the reader fixes: a missing `offset` must default to
  zero, and both fields need an array branch. Today `vec(json.offset)` throws
  on a missing offset, and `vec([x, y])` silently yields `undefined`/`NaN`
  components.
- `offset.z`, `pos.z` and their `z` keys are dropped deliberately. Both are
  `0` throughout the 2D model (see “`pos` and `offset` as `[x, y]`” below).
- `elevation` is already routinely absent: replay fixtures in `test/gen` carry
  AIM shots with no `elevation`, and they decode.
- `i` is already effectively optional: `JSON.stringify` drops it when it is
  `undefined`, and the reader defaults to `0`. `i` is the cue-ball index, which
  is genuinely non-zero in games with two cue balls (libre/three-cushion set
  `balls[1]` for the second player), so a non-zero value is still emitted.
- Explicit `=== 0` comparisons are better than truthiness. Truthiness would
  also drop `NaN` (silently turning a broken value into a physics-valid `0`);
  `NaN !== 0` keeps it, and the existing JSON behaviour (NaN → `null`) is
  unchanged.
- Do not make `pos` optional. It is required to place the cue ball on receive.

## How it will be done

JSON has no schema, so “optional” is purely a writer/reader agreement. The
writer omits zero-valued keys, writes `pos`/`offset` as two-element arrays,
and the reader supplies the class defaults for anything absent.

### 1. Writer: `AimEvent.toJSON()`

Add one method to `src/events/aimevent.ts`:

```ts
toJSON() {
  const { pos, offset, elevation, i, ...rest } = this
  return {
    ...rest,
    pos: [pos.x, pos.y],
    ...(offset && (offset.x !== 0 || offset.y !== 0)
      ? { offset: [offset.x, offset.y] }
      : {}),
    ...(elevation === 0 ? {} : { elevation }),
    ...(i === 0 ? {} : { i }),
  }
}
```

- `...rest` preserves `type`, `sequence`, `clientId`, `playername`, `angle` and
  `power`. Using object rest/spread guarantees that metadata like `sequence` and
  identity fields are preserved automatically without manual synchronization,
  and any future scalar fields on `GameEvent` or `AimEvent` are carried along.
  Class methods live on the prototype and are not serialised.
- `offset` is omitted for a centre-ball strike and written as `[x, y]`
  otherwise. `z` is not written for either field; it is `0` in this model.
- This applies everywhere an `AimEvent` is stringified: live AIM, HIT's
  `tablejson.aim`, WATCHAIM's `aim`, replay shots/links and
  `ResumeStore` snapshots.
- **Do not mutate the event itself.** The AIM event is the live
  `table.cue.aim`; deleting `offset` from it would wipe the local spin and
  break `copy()`. Build a separate object as above.
- The spread implementation is adopted over manual field-by-field construction
  because manual property assignment is prone to omitting fields (such as
  `sequence`) and requires maintenance whenever `GameEvent` properties change.

Result for the sample message:

```json
{
  "type": "AIM",
  "clientId": "Luke-6w26n",
  "playername": "Lukey",
  "angle": 0.14088277518749237,
  "power": 3.406,
  "pos": [-0.7566816210746765, -0.18933309614658356]
}
```

### 2. Reader: defaults in `AimEvent.fromJson`

`toVec2` is a module-level helper (or a private static method) shared by the
reader:

```ts
function toVec2(value) {
  return Array.isArray(value)
    ? new Vector3(value[0] ?? 0, value[1] ?? 0, 0)
    : new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0)
}

static fromJson(json) {
  const event = new AimEvent()
  event.pos = toVec2(json.pos)
  event.angle = json.angle ?? 0
  if (json.offset) {
    event.offset = toVec2(json.offset)
  }
  event.power = json.power ?? 0
  event.elevation = json.elevation ?? 0
  if (json.i) {
    event.i = json.i
  }
  return event
}
```

- `if (json.offset)` leaves the constructor's fresh `new Vector3(0, 0, 0)` in
  place when the key is absent. Do **not** assign the shared `zero` constant
  from `three-utils`: `cue.aim.offset` is mutated in place by spin handling
  (`src/view/cue.ts:173-210`), so aliasing a global would corrupt it.
- `toVec2` accepts both `[x, y]` and `{x, y, z}`. The object branch keeps old
  replay links, `test/gen` fixtures and `src/diagram/real/realposition.ts`
  working even though the writer no longer emits objects.
- The per-component `?? 0` tolerates short arrays and the old `{x, y}` object
  form. `pos` remains required; a missing `pos` decodes to a zero vector and
  should be treated as a malformed message in tests.
- `elevation = json.elevation ?? 0` is equivalent to the current `|| 0` for
  every real value, but is the clearer statement of “absent means zero”.
- `i` needs no change: the field is initialised to `0` and `if (json.i)` keeps
  that default. `event.i = json.i ?? 0` would be equivalent and slightly more
  explicit.
- `copy()` is unaffected: it passes a live `AimEvent`, which always has offset,
  elevation and i.

### Why no `elevation?: number` / `offset?: Vector3`?

Do not change the class types. `AimEvent` is used directly by the cue, physics,
analysis panels, bots and replay code, all of which assume `offset` is a
`Vector3` and `elevation`/`i` are numbers. Making them optional would add
non-null handling across many consumers for a saving that only exists on the
wire. Keeping required fields with zero defaults and compressing only in
`toJSON()` confines the change to one file plus tests.

## HIT and the other `AimEvent` containers

The user-facing HIT payload is `{balls: [...], aim: AimEvent}`
(`Table.serialiseHit`, `src/model/table.ts:196-203`). With `toJSON()` that
nested aim is compacted too (arrays for `pos`/`offset`, omitted zeros). It
still decodes because every consumer of a received HIT goes through
`AimEvent.fromJson`:

- `WatchAim.handleHit` and `Spectate.handleHit` call
  `table.updateFromSerialised(event.tablejson)`, which calls
  `AimEvent.fromJson(data.aim)` (`src/controller/watchaim.ts:40`,
  `src/controller/spectate.ts:109`, `src/model/table.ts:217`).
- Bot strategies decode `hit.tablejson.aim` with `AimEvent.fromJson`.
- `Recorder.recordHitEvent` runs on the local HIT before serialisation and
  only requires `recordedAim.pos`; it is unaffected (`src/events/recorder.ts:54`).
- On the receive side HITs are not recorded; recording is local
  (`Container.sendEvent` → `Recorder.record`).

Other containers that inherit the compact form and are safe:

- WATCHAIM `table.serialise()` includes `aim: cue.aim.copy()`; the receiver's
  `Table.updateFromSerialised` uses the tolerant `fromJson`.
- Replay links: recorded HIT entries store the aim as an `AimEvent`, so
  `JSON.stringify` in `LinkFormatter`/`ReplayEncoder` compacts new links.
  Playback uses `AimEvent.fromJson` (`src/controller/replay.ts:134`,
  `:219`), so they decode.
- `ResumeStore` snapshots of `table.serialise()` compact on save and decode on
  `tryResume`. The `pendingHit` object written by `Container.savePendingHit`
  is already hand-built plain fields and does not change. Cosmetic only: the
  resume log line reads `entry.tablejson.aim?.i` and will print `undefined`
  when `i` was `0` (`src/container/resumehandler.ts:40`), which is already the
  effective value.

## Compatibility

**Old payloads still decode.** `fromJson` accepts `[x, y]`, `{x, y, z}`, a
missing `offset`, a missing `elevation` and a missing `i`, so old replay links,
fixtures and persisted resume entries keep working.

**Old readers are out of scope.** A stale tab running pre-change code will
throw on a missing `offset`, and its `vec([x, y])` will silently create `NaN`
positions from the array forms. This is accepted by the decision above; there
is no protocol version negotiation, feature flag or reader-first release. Ship
the writer and reader in the same build.

**External consumers** that parse network logs or replay JSON now see arrays
for `pos`/`offset` and no `z` key. The AIM wire format has no version field, so
accepting both shapes on read is the only compatibility mechanism.

If a lower-risk rollout is ever needed, the scoped variant below limits the
change to live AIM and leaves HIT, WATCHAIM, replays and resume snapshots in
the old shape.

## Scoped alternative (AIM message only)

Add an explicit AIM branch to `EventUtil.serialise` and leave `AimEvent`
alone. This is the only path that builds a live AIM wire message:

```ts
if (event.type === EventType.AIM) {
  const aim = event as AimEvent;
  const json = { ...aim } as Record<string, unknown>;
  json.pos = [aim.pos.x, aim.pos.y];
  if (aim.offset.x === 0 && aim.offset.y === 0) {
    delete json.offset;
  } else {
    json.offset = [aim.offset.x, aim.offset.y];
  }
  if (aim.elevation === 0) delete json.elevation;
  if (aim.i === 0) delete json.i;
  return JSON.stringify(json);
}
```

The read-side behavior is identical. In this variant the arrays apply only to
live AIM; HIT, WATCHAIM, replay links and resume snapshots keep the object
shape. Trade-off: two shapes to reason about and no savings outside live AIM.
The chosen `toJSON()` design above is simpler and applies the arrays
everywhere.

## Size impact

Measured on the sample message (ASCII, so characters ≈ bytes). “Arrays”
means `pos: [x, y]` and, when nonzero, `offset: [x, y]`, with zero
`elevation`/`i` omitted.

Zero-offset AIM (the common case):

| Form                                           | Length       |
| ---------------------------------------------- | ------------ |
| Inner AIM JSON, current                        | 213          |
| Inner AIM JSON, arrays + zero omission         | 150          |
| Saved                                          | **63 (30%)** |
| Full envelope, current                         | 304          |
| Full envelope, arrays + zero omission          | 241          |
| Saved                                          | **63 (21%)** |
| Full envelope deflated (zlib raw), current     | 202          |
| Full envelope deflated, arrays + zero omission | 173          |
| Saved                                          | **29 (14%)** |

Non-zero offset (spin shot):

| Form                                           | Length       |
| ---------------------------------------------- | ------------ |
| Inner AIM JSON, current                        | 249          |
| Inner AIM JSON, arrays + zero omission         | 201          |
| Saved                                          | **48 (19%)** |
| Full envelope, current                         | 340          |
| Full envelope, arrays + zero omission          | 292          |
| Saved                                          | **48 (14%)** |
| Full envelope deflated, current                | 213          |
| Full envelope deflated, arrays + zero omission | 194          |
| Saved                                          | **19 (9%)**  |

Each array shape saves 14 characters when present: the digits are unchanged,
and the object's `{"x":`, `,"y":`, `,"z":0}` overhead becomes `[`, `,`, `]`.
In the zero-offset case only `pos` contributes, because `offset` is omitted
entirely.

The inner message is sent at most every 250 ms while aim input changes, i.e.
≤ 4/s. The zero-offset case saves ≈ 250 B/s raw and ≈ 115 B/s deflated per
sender; a spin shot saves ≈ 190 B/s raw and ≈ 75 B/s deflated. The gain is
modest but free on the hot path.

Not part of this request, but the larger duplicate cost is `clientId` and
`playername` on every AIM (also present in the envelope as `senderId`). Those
cannot simply be dropped: the receiver uses `event.clientId` for echo
suppression (`BrowserContainer.netEvent`) and `playername` for the spectate
HUD. Removing them would need relay metadata plumbed through and is a separate
wire change.

## `pos` and `offset` as `[x, y]`

Both vectors are 2D in this model: only `x` and `y` are used, and `z` is
always `0`. The chosen encoding drops `z` and the object keys:

- `pos: [x, y]` on every AIM.
- `offset: [x, y]` when the strike is off-centre; `offset` is omitted entirely
  for a centre-ball strike.
- The class keeps `Vector3`; only the JSON boundary changes.

### Why `z` can be dropped

- `cueStrike` documents the offset as `(x, y, 0)`; spin direction uses
  `atan2(-offset.x, offset.y)` and the physics advances balls in `x`/`y`.
  Elevation is cue tilt, not a change to `pos.z`.
- Every producer sets z to `0`: `AimInputs.adjustSpin` constructs a 2D
  `Vector3`, `CueballSpin` passes `z = 0`, `ControllerBase` uses
  `new Vector3(dx, 0)` / `new Vector3(0, dy)`, and the physics worker builds
  `new Vector3(shot.offset.x, shot.offset.y, 0)`.
- `AimEvent.pos` comes from `Cue.moveTo` (cue ball position) and, for HIT,
  from `table.serialiseHit()` which copies `this.cueball.pos`. The cue ball is
  on the table, so `z = 0`.
- `Ball.updateFromSerialised` preserves `z` for potted balls and
  `Ball.serialise` carries it, but an AIM `pos` is never a potted ball. A
  future 3D/jump-cue model that moves the strike point off the surface would
  need to revisit this.
- Because `z` is not written, a hypothetical non-zero `offset.z` or `pos.z`
  would be dropped. No producer or physics path sets either. If that ever
  changes, write a three-element array (or keep the object form) for that
  field.

### Writer and reader

Writer, inside `AimEvent.toJSON()` (or the scoped AIM branch):

```ts
pos: [this.pos.x, this.pos.y];
// and, when nonzero:
offset: [this.offset.x, this.offset.y];
```

Reader, via the shared helper in `AimEvent.fromJson`:

```ts
function toVec2(value) {
  return Array.isArray(value)
    ? new Vector3(value[0] ?? 0, value[1] ?? 0, 0)
    : new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);
}
```

- Accept both shapes permanently on read. Old replay links, `test/gen`
  fixtures, `src/diagram/real/realposition.ts` and pasted bug reports use
  objects; the writer never emits them.
- Check length indirectly with `?? 0`; a short `[x]` still produces a valid
  vector rather than `NaN`. If malformed messages should fail loudly, add an
  explicit length check instead.
- Set `z` explicitly to `0`. Keep `pos` required and keep the class fields as
  `Vector3`.
- `AimEvent.copy()` passes a live `AimEvent` (a `Vector3`), so it takes the
  object branch and is unaffected.

### Containers affected

With `toJSON()` the array shape propagates everywhere an `AimEvent` is
stringified, exactly like the zero-field omission:

- HIT's `tablejson.aim`. Its `pos` is the cue ball position (z `0`) and its
  `offset` is the strike offset, so the arrays are lossless.
  `Table.updateFromSerialised` decodes them through the same `fromJson`.
- WATCHAIM's `aim` (`table.serialise()` stores `cue.aim.copy()`), decoded by
  the receiver's `Table.updateFromSerialised`.
- Replay shots and new replay links, decoded by `AimEvent.fromJson` in
  `Replay.playNextShot` and the first-shot path.
- `ResumeStore` snapshots, decoded in `ResumeHandler.tryResume`.

With the scoped `EventUtil.serialise` variant, only the live AIM message uses
arrays; HIT, WATCHAIM, replays and resume snapshots keep objects.

### Compatibility of the arrays

- **New reader, old data:** fine. `toVec2` accepts both shapes, so old links,
  fixtures, HITs and resume entries decode unchanged.
- **Old reader, new data:** accepted as out of scope. `vec([x, y])` does not
  throw; it reads `x`/`y`/`z` off the array and produces
  `Vector3(NaN, NaN, NaN)`. A pre-change tab would therefore get `NaN`
  positions (and throw on a missing `offset`) instead of a clean error. No
  staging or version negotiation is planned.
- **External consumers:** logs and replay JSON now show arrays and no `z`.
  That is a tooling/readability cost, not a runtime one.

### Alternatives

- Omit only `z` and keep objects (`{"x": …, "y": …}`): saves 7 characters per
  vector instead of 14, and the reader still needs a `z ?? 0` default. Not
  chosen.
- A fully packed binary/base64 encoding like the WATCHAIM ball blob in
  `src/utils/wire-codec.ts`: much smaller, but it adds a versioned codec,
  base64 handling and tests for a message sent at most four times a second.
  Not justified.

### Decision

Adopt the arrays for both `pos` and `offset`. The saving is 14 characters per
present vector with no change to the in-memory model, the reader keeps old
payloads working, and old readers are accepted as out of scope. This is the
encoding the writer will emit from now on.

## Tests

Add to `test/events/eventutil.spec.ts` or a new
`test/events/aimevent.spec.ts`:

1. Zero-offset AIM serialises without an `offset` key, writes `pos` as
   `[pos.x, pos.y]`, and round-trips to `offset.equals(new Vector3(0, 0, 0))`.
2. Non-zero offset serialises as `[x, y]` with no `z`, and round-trips
   exactly.
3. `elevation = 0` and `i = 0` are absent from the JSON; non-zero values
   round-trip (`i = 1` covers libre/three-cushion cue-ball selection).
4. Old verbose payload (object `pos`/`offset` with `z`, `elevation` and `i`)
   still decodes to the same `Vector3` values.
5. HIT round-trip: `table.serialiseHit()` inside a `HitEvent` decodes and the
   aim's array `pos`/`offset` and elevation/i match the source.
6. WATCHAIM round-trip still decodes (already covered) and a replay link with
   an array aim shot replays through `AimEvent.fromJson`.
7. `AimEvent.copy()` after a lean decode returns an independent zero offset
   (guards against the shared-`zero` aliasing mistake).
8. No serialised AIM or HIT aim contains a `z` key in `pos`/`offset`, and a
   short array (`[x]`) decodes to `z = 0` without `NaN`.

The existing “Serialise and deserialise AimEvent” test (default event, `i = 1`)
keeps passing: `pos` remains present, and the offset default covers the omitted
vector.

## Files to change

- `src/events/aimevent.ts` — add `toJSON()` (array `pos`/`offset`, omitted
  zero fields); add the `toVec2` helper and use it in `fromJson`; default a
  missing offset to the constructor's fresh zero vector.
- `test/events/*` — round-trip and old-payload compatibility tests.

No change is needed in `EventUtil` for the chosen `toJSON()` design. If the
scoped variant is chosen instead, `EventUtil.serialise` gains the AIM branch and
`AimEvent` only gets the `fromJson` changes.

## Pitfalls to avoid

- Never delete fields from the live `table.cue.aim`; serialise a copy.
- Never default missing offset to the shared `zero` `Vector3`; construct a
  fresh one (or keep the constructor's existing instance).
- Never pass an array to `vec()` — it silently yields `undefined` components
  and a `NaN` position. Branch on `Array.isArray`.
- Use `!== 0` rather than truthiness so a corrupt `NaN` is not silently turned
  into a valid zero.
- Keep `pos` mandatory and keep the class fields as `Vector3`; do not switch
  to tuple types.
- Do not omit `angle`, even when `0` — `0` is a legitimate aim direction.
- Only `pos`/`offset` are known to be 2D. Do not assume every other ball
  state is `z = 0`; `Ball.updateFromSerialised` preserves z for potted balls.
- Deploy the writer and reader together. Old readers are out of scope and will
  see `NaN` positions (or throw on a missing `offset`); no staging is planned.
