# Player Score Migration Plan

## Current Structure

```typescript
container.scores: [number, number]  // index 0 or 1 based on playerIndex
Session.playerIndex() → 0 or 1
Session.getInstance().playername
Session.getInstance().opponentName
```

### Pain Points

- `scores[Session.playerIndex()]++` is verbose
- `scores[1 - playerIndex]` for opponent is error-prone
- Winner logic: compare array, then check `winnerIndex === playerIndex`
- Player names stored separately in Session, not linked to scores

---

## Proposed Structure

```typescript
interface Player {
  id: string;
  name: string;
  score: number;
}

// In Container
me: Player;
opponent: Player;
```

### Usage Examples

```typescript
// Incrementing score
this.container.me.score++;

// Accessing opponent name
this.container.opponent.name;

// Checking raceTo winner
return this.container.me.score >= raceTo;

// Winner determination
const winner =
  this.container.me.score >= this.container.opponent.score
    ? this.container.me
    : this.container.opponent;
```

---

## Files to Change

| File                                 | Changes                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `container/container.ts`             | Replace `scores: [number, number]` with `me: Player` and `opponent: Player`                    |
| `network/client/session.ts`          | Remove `playername` and `opponentName` (moved to Player), keep `playerIndex` for turn tracking |
| `controller/rules/threecushion.ts`   | Use `me.score`/`opponent.score`, simplify `isEndOfGame` and `handleGameEnd`                    |
| `controller/rules/nineball.ts`       | Use `me.score` for incrementing                                                                |
| `controller/rules/snooker.ts`        | Use `me.score`/`opponent.score` for scoring                                                    |
| `controller/rules/snookerscoring.ts` | Simplify winner logic using Player objects                                                     |
| `events/recorder.ts`                 | Use `me.score`                                                                                 |
| `view/hud.ts`                        | Display `me.name`, `opponent.name` with scores                                                 |

---

## Detailed Changes

### 1. New Player Interface (add to `container/container.ts` or new file)

```typescript
export interface Player {
  id: string;
  name: string;
  score: number;
}

export function createPlayer(id: string = "", name: string = ""): Player {
  return { id, name, score: 0 };
}
```

### 2. Container Changes

```typescript
// Before
scores: [number, number] = [0, 0]

// After
me: Player = createPlayer("", "")
opponent: Player = createPlayer("", "")

// Update getScores() method
getScores(): [number, number] {
  return [this.me.score, this.opponent.score]
}
```

### 3. Session Changes

```typescript
// Keep playerIndex for turn tracking
// Remove playername and opponentName (now in Container.me/opponent)
// Session remains focused on connection/identity, not display

export class Session {
  constructor(
    readonly clientId: string,
    readonly tableId: string,
    readonly spectator: boolean,
  ) {}

  playerIndex: number = 0; // 0 = me plays first, 1 = opponent plays first

  // ... rest unchanged
}
```

### 4. BrowserContainer Changes

```typescript
constructor(canvas3d, params) {
  // ...
  const playername = params.get("name") ?? ""
  this.container.me.name = playername
  // opponent name set via network event
}

netEvent(e: string) {
  const event = EventUtil.fromSerialised(e)
  if (event.playername) {
    this.container.opponent.name = event.playername
  }
  // ...
}
```

### 5. ThreeCushion Rules

```typescript
// Before
this.container.scores[Session.playerIndex()]++

if (this.isEndOfGame(outcomes)) {
  return this.handleGameEnd(true)
}

isEndOfGame(_: Outcome[]) {
  const [s1, s2] = this.container.scores
  return s1 >= ThreeCushionConfig.raceTo || s2 >= ThreeCushionConfig.raceTo
}

// After
const player = Session.playerIndex() === 0 ? this.container.me : this.container.opponent
player.score++

if (this.isEndOfGame(outcomes)) {
  return this.handleGameEnd(player === this.container.me)
}

isEndOfGame(_: Outcome[]) {
  return this.container.me.score >= ThreeCushionConfig.raceTo
    || this.container.opponent.score >= ThreeCushionConfig.raceTo
}
```

### 6. SnookerScoring

```typescript
// Before
const winnerIndex = container.scores[0] >= container.scores[1] ? 0 : 1;
const amIWinner = winnerIndex === playerIndex;

// After
const winner =
  container.me.score >= container.opponent.score
    ? container.me
    : container.opponent;
const amIWinner = winner === container.me;
```

### 7. HUD Display

```typescript
// Before
p1Element: <div class="p1Score">Score: ${scores[0]}</div>
p2Element: <div class="p2Score">Score: ${scores[1]}</div>

// After
p1Element: <div class="p1Score">${me.name || 'Player 1'}: ${me.score}</div>
p2Element: <div class="p2Score">${opponent.name || 'Player 2'}: ${opponent.score}</div>
```

---

## Winner Logic Simplification

### Before (complex)

```typescript
const winnerIndex = container.scores[0] >= container.scores[1] ? 0 : 1;
const amIWinner = winnerIndex === playerIndex;
const winnerScore = container.scores[winnerIndex];
const loserScore = container.scores[1 - winnerIndex];
```

### After (clear)

```typescript
const winner =
  container.me.score >= container.opponent.score
    ? container.me
    : container.opponent;
const amIWinner = winner === container.me;
const { score: winnerScore } = winner;
const loserScore =
  winner === container.me ? container.opponent.score : container.me.score;
```

---

## Network Serialization

The array format is compact for network sync. Options:

1. **Keep `getScores()` for sync** - maintain backward compatibility with network protocol
2. **Serialize Player objects** - `{ me: {...}, opponent: {...} }` - more verbose but clearer
3. **Hybrid** - store as array internally, expose as Player getters

---

## Migration Steps

1. Add `Player` interface and `createPlayer` helper
2. Add `me` and `opponent` to Container (keep `scores` temporarily)
3. Update all rules files to use `me.score`/`opponent.score`
4. Update Session to remove name fields
5. Update BrowserContainer to populate Player names
6. Update HUD and display components
7. Remove `scores` array once migration complete
8. Update tests

---

## Considerations

- **Single player**: `me` is always the active player, `opponent` tracks their score
- **Spectator mode**: Both players are "opponents" from spectator view
- **Turn tracking**: `Session.playerIndex` still needed to know whose turn it is
- **Backward compat**: `getScores()` returns `[number, number]` for existing code
