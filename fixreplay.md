# Fix: recorder's name showing in watched replays

## Problem

When a replay is watched, the lobby indicator and the presence message sometimes show the
recorder's name instead of the watcher's.

- The indicator and presence read `LobbyIndicator.userName`, which is seeded from the
  page's `?userName=` param, or `"Anon"` if absent (`src/view/lobbyindicator.ts`).
- Replay links shared from some sources carry `userName` and `userId` of the recorder.
  Example: `https://scoreboard-tailuge.vercel.app/api/replay/831` expands to
  `...?ruletype=reveal&...&userId=Fire-73uux&userName=Fireman&...`.

## Where the identity enters the link

1. **Share from a replay page.** `src/controller/replay.ts` (`onFirst`) calls
   `shorten(location.href)`. If the replay was opened with `userName`, that name is copied.
2. **`src/utils/shorten.ts`.** It posts `new URL(url).search` as `{ input }` to
   `/api/shorten`. Every query param on the page is stored, including identity params.
3. **Scoreboard `Shortener` (`../scoreboard/src/services/shortener.ts`).** `shorten()`
   stores `input` unchanged. `replay()` returns `GAME_BASE_URL + input` on expansion.
4. **Hi-score flow.** `getHiScoreUri` (`src/view/link-formatter.ts`, line 29) adds
   `userName` and `userId` of the recorder. The scoreboard's `public/hiscore.html` forwards
   its whole query string into the replay iframe, so the replay opens with the recorder's
   identity. The replay's share button then stores it (step 1).
5. **Match result upload.** The end-of-game upload stores `userName` in the match record.
   The scoreboard's `/api/match-replay` redirect includes it (asserted in
   `tests/api.match-replay.test.ts`, lines 118–127). This is a separate path from
   `/api/replay/<id>`.

The lobby does not show the problem, because it does not go through steps 1, 2, or 4.

## Options

### A. Client-side: strip identity params before shortening (implemented)

Change `src/utils/shorten.ts` so the posted `input` drops `userName` and `userId`
before calling `/api/shorten`.

- Covers every new share from the game, including the replay share button.
- No server change. Matches the goal of avoiding server-side logic.
- Does **not** fix links already stored, such as `/api/replay/831`.
- Only fixes the replay share path. The hi-score link (step 4) and match result (step 5)
  still carry the name in their own URLs. The hi-score leak is fixed by option B.

### B. Client-side: stop emitting identity in the hi-score link (implemented)

Change `getHiScoreUri` to omit `userName` and `userId`.

- Removes the largest source (the leaderboard replay links) for new hi-scores.
- Verified: the server does not read `userName` or `userId` on upload (see below).
- Does not fix existing stored rows.

### C. Server-side: strip in `Shortener.shorten()` (scoreboard)

Drop `userName` and `userId` from `data.input` before storing.

- Covers new shares from any client version, including old game builds.
- Still needs the client to be correct for the replay page itself.

### D. Server-side: strip in `Shortener.replay()` (scoreboard)

Drop those params on expansion.

- The only option that fixes existing links such as `/api/replay/831`.
- Requires server logic, which you wanted to avoid.

### E. Scoreboard `/api/match-replay`

Remove `userName` and `userId` from the redirect, or from what the match record exposes.
Needs a look at the route first, since the match record may need `userName` elsewhere.

## Hi-score upload (verified in ../scoreboard)

- `public/hiscore.html` POSTs its entire `location.search` as the body to `/api/hiscore`.
- `src/pages/api/hiscore.ts` reads only `state`, `v`, and `score` from that body, plus
  `ruletype` and `id` from the URL. It never reads `userName` or `userId`.
- `ScoreTable.add()` stores the raw body as `data`. The name stored on the row is the
  initials (`id`), not `userName`.
- `ScoreTable.get()` returns `GAME_BASE_URL + data`, so `/api/rank/<id>` (the leaderboard's
  replay link) redirects to a URL that still contains the recorder's `userName` and
  `userId`.

So the hi-score leak does **not** go through `shorten()`. Fixing `shorten()` would leave
every leaderboard replay link exposing the recorder. This makes the leaderboard the largest
source of the problem.

Stopping the leak at the source works without any server change for new entries:
`getHiScoreUri` (option B) should stop adding `userName` and `userId`. The server does not
need them, so the upload still succeeds. Existing rows keep the old data, which is accepted.

## Status

- Option A: implemented in `src/utils/shorten.ts` (`shareableQuery`), tested in `test/utils/shorten.spec.ts`.
- Option B: implemented in `src/view/link-formatter.ts` (`getHiScoreUri`), tested in `test/view/link-formatter.spec.ts`.
- Options C, D, and E are not implemented. They are in the scoreboard, and the match-replay route is unchanged.

## Recommendation (historical)

1. **Option B (client-side, the source).** Remove `userName` and `userId` from
   `getHiScoreUri`. This is the largest source, and it needs no server change.
2. **Option A.** It is client-only, small, and stops new replay shares from leaking
   the name. Add a unit test for `shorten()` that asserts the posted `input` contains no
   `userName` or `userId`.
3. **Option D only if old links matter.** Existing entries such as `831` can only be
   fixed on the server. This is the one case that needs server logic.
4. **Option E separately.** It is a different route and should be its own change.

## Acceptance criteria

- A replay opened from a link containing `userName=X` and `userId=Y` shows the watcher's
  name (or `Anon` if none is given) in the lobby indicator and presence message.
- A share from a replay page produces a posted `input` with no `userName` or `userId`.
- Hi-score links no longer carry the recorder's identity (after option B).
- `yarn lint` and `yarn test` pass in this repo.

## Open questions

- Should existing stored links (e.g. `/api/replay/831`) be fixed, or is it acceptable
  to leave them as they are?
- Should `/api/match-replay` also drop identity params?
