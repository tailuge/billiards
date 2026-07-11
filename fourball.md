# Korean Four-Ball (Sagu) Billiards: Design & Implementation Specification

This document outlines the rules of **Korean Four-Ball Billiards (Sagu / 사구)**, explains the required rule systems including its unique countdown scoring starting at 50, and defines a comprehensive, non-intrusive implementation plan within the existing TypeScript billiards simulator codebase.

---

## 1. Overview of Sagu (Korean Four-Ball) Rules

Korean Four-Ball is a carom billiards game played on a pocketless billiard table with four balls. It is a highly popular social and competitive game in South Korea, acting as a gateway and standard foundation before players transition to Three-Cushion Billiards.

### A. The Setup & Table
- **Table:** Played on a pocketless carom table (with heated slate, high-speed cloth, and standard carom cushions).
- **The Balls:** Four balls in total:
  - **White Ball** (Cue ball for Player 1 / Object ball for Player 2)
  - **Yellow Ball** (Cue ball for Player 2 / Object ball for Player 1)
  - **Red Ball A** (Object ball)
  - **Red Ball B** (Object ball)

### B. Cue Ball Assignment
- Player 1 is assigned the White ball as their cue ball.
- Player 2 is assigned the Yellow ball as their cue ball.
- At any time, a player's cue ball can only target the other three balls on the table.

### C. Standard Scoring (The Carom)
- A standard valid shot is scored when the player's cue ball strikes **both** red object balls in a single turn.
- Order of contact with the red balls does not matter (e.g., White -> Red A -> Red B, or White -> Red B -> Red A are both valid).
- A successful carom allows the player to continue their turn (keep shooting).

### D. The Unique Sagu Fouls & Penalties
A critical distinction in Sagu is how fouls are treated, especially regarding the opposing player's cue ball:
1. **Opponent Cue Ball Contact (Sub-Cue Foul):**
   - Striking the other player's cue ball (e.g., White cue ball hitting the Yellow ball) is a **strict foul**.
   - *Note: This is the main difference between Korean Sagu and Japanese Yotsudama, where hitting the opposing cue ball is allowed and scored.*
2. **Double/Multiple Object Ball Contact (Standard Foul):**
   - Hitting only one red ball, hitting zero balls, or making any other foul (e.g., driving a ball off the table) terminates the inning.
3. **No-Hit (Standard Foul):**
   - Failing to hit any ball.

---

## 2. The Unique Countdown Scoring System

In typical billiards games, scores start at 0 and count up. Sagu features a **countdown (subtraction) system** based on player handicaps.

### A. Handicap & Starting Scores
- Players establish their skill rating/handicap, often expressed in multiples of 10 or 50 (e.g., "I play 50", "I play 150", or "I play 200").
- For a **50-point game**:
  - The player starts with **50 points** (representing 5 successful shots remaining).
  - Score reduces by **10 points** for each successful carom shot (hitting both red balls without committing a foul).
- Successful Shot: `Score = Score - 10` (or `Score = Score - 1` if tracked in units of 1).

### B. Foul Penalties (Adding Points)
- Committing any foul (hitting the opponent's cue ball, or hitting no balls) **adds 10 points** (+1 unit) back to the player's score, making their progress worse and moving them further away from winning.
- A player's score can never exceed their initial starting handicap (e.g., capped at 50 if they started at 50).
- Committing a foul immediately ends the player's turn.

### C. The Three-Cushion (3-Cushion) Finish ("Garak" / "Three-Cushion")
- Once a player successfully counts down their score to exactly **0**, they cannot win by making another standard carom shot.
- To win, they must successfully execute a **Three-Cushion shot** (often called the final cushion phase):
  - Their cue ball must strike at least **three cushions** before making contact with the second red ball (or make a standard 3-cushion point: hit first red, then 3 cushions, then second red).
  - During this final cushion-phase shot, hitting the opponent's cue ball is typically either permitted or ignored, depending on local agreements, but achieving the 3-cushion carom is the absolute win condition.
  - Until the leading player successfully completes this 3-cushion shot, the opponent can continue to play, catch up, and potentially win.

---

## 3. Detailed Implementation Architecture

This section details how Sagu can be implemented cleanly inside the existing TypeScript architecture without altering core physics signatures.

### A. Ball Layout & Rack Configuration (`src/utils/rack.ts`)
Add a static method to `Rack` to setup the four-ball layout on a pocketless table:
```typescript
static fourBall(): Ball[] {
  const dx = TableGeometry.X / 2
  const dy = TableGeometry.Y / 4
  const fourballs: Ball[] = [
    Rack.cueBall(Rack.jitter(new Vector3(-dx, -dy, 0))), // Ball 0: White (P1 Cue)
    new Ball(
      Rack.jitter(new Vector3(-dx, dy, 0)),
      0xffd700, // Ball 1: Yellow (P2 Cue)
      undefined,
      Rack.unlabeledAppearance()
    ),
    new Ball(
      Rack.jitter(new Vector3(dx, -dy, 0)),
      0xff0000, // Ball 2: Red A
      undefined,
      Rack.unlabeledAppearance()
    ),
    new Ball(
      Rack.jitter(new Vector3(dx, dy, 0)),
      0xff0000, // Ball 3: Red B
      undefined,
      Rack.unlabeledAppearance()
    ),
  ]
  return fourballs
}
```

### B. Core Sagu Class Implementation (`src/controller/rules/fourball.ts`)
Create a new `FourBall` class that implements the `Rules` interface:

```typescript
import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Controller } from "../../controller/controller"
import { Aim } from "../../controller/aim"
import { WatchAim } from "../../controller/watchaim"
import { WatchEvent } from "../../events/watchevent"
import { StartAimEvent } from "../../events/startaimevent"
import { ScoreEvent } from "../../events/scoreevent"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { Camera } from "../../view/camera"
import { TableGeometry } from "../../view/tablegeometry"
import { Rules } from "./rules"
import { Session } from "../../network/client/session"
import { MatchResultHelper } from "../../network/client/matchresult"

export class FourBall implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "fourball"

  // Countdown starting value (usually 50 or 5 shots)
  static readonly STARTING_SCORE = 5

  constructor(container: Container) {
    this.container = container
  }

  readonly asset = "models/threecushion.min.gltf" // Uses the carom pocketless table

  startTurn(): void {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
  }

  tableGeometry(): void {
    TableGeometry.configureForRule("threecushion") // Uses pocketless physics & geometry
  }

  table(): Table {
    this.tableGeometry()
    Camera.configureForRule("threecushion")
    const table = new Table(this.rack())
    this.cueball = table.balls[0] // Default to white
    return table
  }

  rack(): Ball[] {
    return Rack.fromInitParam(Rack.fourBall())
  }

  secondToPlay(): void {
    this.cueball = this.container.table.balls[1] // P2 uses Yellow
  }

  otherPlayersCueBall(): Ball {
    const balls = this.container.table.balls
    return this.cueball === balls[0] ? balls[1] : balls[0]
  }

  allowsPlaceBall(): boolean {
    return false
  }

  placeBall(_?: Vector3): Vector3 {
    return new Vector3(0, 0, 0)
  }

  nextCandidateBall(): Ball | undefined {
    return undefined
  }

  respot(_outcome: Outcome[]): Ball[] {
    return []
  }

  /**
   * Helper to evaluate if the cue ball hit both red balls (indices 2 and 3)
   */
  private hitsBothReds(outcome: Outcome[]): boolean {
    const redBalls = [this.container.table.balls[2], this.container.table.balls[3]]
    const hitReds = new Set<Ball>()

    for (const o of outcome) {
      if (o.type === OutcomeType.BallCollision) {
        if (o.ballA === this.cueball && redBalls.includes(o.ballB!)) {
          hitReds.add(o.ballB!)
        } else if (o.ballB === this.cueball && redBalls.includes(o.ballA)) {
          hitReds.add(o.ballA)
        }
      }
    }
    return hitReds.size === 2
  }

  /**
   * Check if a 3-Cushion shot was executed successfully (for the final winning point)
   */
  private isThreeCushionShot(outcome: Outcome[]): boolean {
    if (!this.hitsBothReds(outcome)) return false

    // Identify when each red ball was hit
    let firstRedCollisionIndex = -1
    let secondRedCollisionIndex = -1
    const redBalls = [this.container.table.balls[2], this.container.table.balls[3]]

    for (let i = 0; i < outcome.length; i++) {
      const o = outcome[i]
      if (o.type === OutcomeType.BallCollision) {
        if (o.ballA === this.cueball && redBalls.includes(o.ballB!)) {
          if (firstRedCollisionIndex === -1) firstRedCollisionIndex = i
          else {
            secondRedCollisionIndex = i
            break
          }
        }
      }
    }

    if (firstRedCollisionIndex === -1 || secondRedCollisionIndex === -1) {
      return false
    }

    // Standard carom 3-cushion rule:
    // Cue ball must hit 3 cushions before hitting the second red ball.
    let cushionCount = 0
    for (let i = 0; i < secondRedCollisionIndex; i++) {
      if (outcome[i].type === OutcomeType.Cushion) {
        cushionCount++
      }
    }

    return cushionCount >= 3
  }

  /**
   * Determine the foul state for the shot
   */
  foulReason(outcome: Outcome[]): string | null {
    // 1. Check if the opponent's cue ball was struck (Sub-cue Foul)
    const opponentCue = this.otherPlayersCueBall()
    const hitOpponent = outcome.some(o =>
      o.type === OutcomeType.BallCollision &&
      (o.ballA === this.cueball && o.ballB === opponentCue ||
       o.ballB === this.cueball && o.ballA === opponentCue)
    )

    if (hitOpponent) {
      return "Foul: Contacted the opponent's cue ball!"
    }

    // 2. Check if any ball was hit at all
    const hitAny = outcome.some(o =>
      o.type === OutcomeType.BallCollision &&
      (o.ballA === this.cueball || o.ballB === this.cueball)
    )

    if (!hitAny) {
      return "Foul: No ball hit"
    }

    // 3. For standard scoring phase, failing to hit both reds is not a foul but is a turn-ending miss.
    // (A foul increases the remaining point countdown, a miss just passes the turn.)
    return null
  }

  /**
   * Calculate point change (-1 for success, +1 for foul)
   */
  getAmountScored(outcome: Outcome[]): number {
    const session = Session.getInstance()
    const myCurrentScore = session.playerIndex === 0 ? session.scores.p1 : session.scores.p2

    // Case 1: In the final 3-cushion phase (Current score is 0)
    if (myCurrentScore === 0) {
      return this.isThreeCushionShot(outcome) ? -1 : 0
    }

    // Case 2: Standard phase
    const foul = this.foulReason(outcome)
    if (foul) {
      return 1 // Penalty: adds 1 to countdown (making it worse)
    }

    if (this.hitsBothReds(outcome)) {
      return -1 // Success: reduces countdown by 1
    }

    return 0 // Turn ends with a clean miss, no score change
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    const session = Session.getInstance()
    const myCurrentScore = session.playerIndex === 0 ? session.scores.p1 : session.scores.p2

    if (myCurrentScore === 0) {
      return this.isThreeCushionShot(outcome)
    }

    return !this.foulReason(outcome) && this.hitsBothReds(outcome)
  }

  update(outcome: Outcome[]): Controller {
    const scoreChange = this.getAmountScored(outcome)
    const session = Session.getInstance()

    if (scoreChange < 0) {
      // Success
      this.container.sound.playSuccess(outcome.length / 3)
      session.addMyScore(scoreChange) // Reduces countdown score

      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))

      if (this.isEndOfGame(outcome)) {
        return this.handleGameEnd(true)
      }
      return new Aim(this.container)
    } else if (scoreChange > 0) {
      // Foul: Notify player, apply penalty, switch turns
      const reason = this.foulReason(outcome) || "Foul"
      this.container.notify({
        type: "Foul",
        title: "PENALTY",
        subtext: `${reason} (+10 points)`,
      })
      session.addMyScore(scoreChange) // Adds point to countdown, up to starting handicap

      // Cap at starting handicap (5)
      const isP1 = session.playerIndex === 0
      if (isP1 && session.scores.p1 > FourBall.STARTING_SCORE) {
        session.scores.p1 = FourBall.STARTING_SCORE
      } else if (!isP1 && session.scores.p2 > FourBall.STARTING_SCORE) {
        session.scores.p2 = FourBall.STARTING_SCORE
      }
    }

    // Switch active player/cue ball on misses and fouls
    this.startTurn()

    if (this.container.isSinglePlayer) {
      this.cueball = this.otherPlayersCueBall()
      const cue = this.container.table.cue
      if (cue) {
        cue.aim.i = this.container.table.balls.indexOf(this.cueball)
      }
      return new Aim(this.container)
    }

    this.container.sendEvent(new StartAimEvent())
    return new WatchAim(this.container)
  }

  advanceState(outcomes: Outcome[]): void {
    if (!this.isPartOfBreak(outcomes)) {
      this.cueball = this.otherPlayersCueBall()
    }
  }

  isEndOfGame(_outcome: Outcome[]): boolean {
    const session = Session.getInstance()
    // Game ends when a player has cleared all countdown points (score reaches 0)
    // AND successfully made the final 3-cushion shot (reducing score below 0).
    return session.scores.p1 < 0 || session.scores.p2 < 0
  }

  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    return MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      isWinner,
      endSubtext
    )
  }
}
```

### C. Rule Registration (`src/controller/rules/rulefactory.ts`)
Register the new rule system inside the `RuleFactory` to enable selection:
```typescript
import { FourBall } from "./fourball"
// Inside RuleFactory.create:
if (name === "fourball") {
  return new FourBall(container)
}
```

### D. UI/HUD Presentation of Countdown Scores
The current game HUD shows player scores counting up. For Sagu, we can present the score as a subtraction (countdown to zero):
1. Represent the value in standard Korean style by multiplying the unit score by 10 (e.g. `score * 10`).
2. When the score is `0`, display `3-C` or `★` in the HUD to indicate they are on their final 3-cushion winning shot.

---

## 4. Key Implementation Benefits

1. **Leverages Carom Engine:** It utilizes the existing pocketless table layout and three-cushion physics.
2. **Highly Adaptive Turn Switcher:** Swaps cue balls between Ball 0 (White) and Ball 1 (Yellow) seamlessly using the `Rules` interface.
3. **No Overhead Memory Churn:** Relies strictly on existing outcome analysis, preventing any garbage collection pressure in hot simulation loops.
