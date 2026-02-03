import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { PlaceBall } from "../../controller/placeball"
import { WatchAim } from "../../controller/watchaim"
import { ChatEvent } from "../../events/chatevent"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { zero } from "../../utils/utils"
import { End } from "../end"
import { Rules } from "./rules"
import { R } from "../../model/physics/constants"
import { Respot } from "../../utils/respot"
import { TableGeometry } from "../../view/tablegeometry"
import { StartAimEvent } from "../../events/startaimevent"
import { MatchResult } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"

export class NineBall implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  score = 0
  rulename = "nineball"

  constructor(container) {
    this.container = container
  }

  startTurn() {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
  }

  nextCandidateBall() {
    return this.container.table.balls
      .filter((b) => b !== this.cueball && b.onTable())
      .sort((a, b) => (a.label || 0) - (b.label || 0))[0]
  }

  placeBall(target?): Vector3 {
    if (target) {
      const max = new Vector3(TableGeometry.tableX, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      return target.clamp(min, max)
    }
    return new Vector3((-R * 11) / 0.5, 0, 0)
  }

  asset(): string {
    return "models/p8.min.gltf"
  }

  tableGeometry() {
    TableGeometry.hasPockets = true
  }

  table(): Table {
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  rack() {
    return Rack.diamond()
  }

  update(outcome: Outcome[]): Controller {
    const table = this.container.table
    const foul = this.isFoul(outcome)

    if (foul) {
      console.log("nineball foul ")
      this.container.notify("Foul!")
      this.startTurn()
      const pots = Outcome.pots(outcome)
      const nineBallPotted = pots.some((b) => b.label === 9)
      console.log("is nineball potted", nineBallPotted)
      let respotData
      if (nineBallPotted) {
        console.log("respotting nineball")
        this.respotNineBall()
        const nineBall = this.container.table.balls.find((b) => b.label === 9)
        if (nineBall) {
          respotData = { id: 9, pos: nineBall.pos }
        }
      }

      if (this.container.isSinglePlayer) {
        return new PlaceBall(this.container)
      }
      console.log("sending place ball event: ", respotData)
      this.container.sendEvent(new PlaceBallEvent(zero, respotData))
      return new WatchAim(this.container)
    }
    console.log("not a foul")
    if (Outcome.potCount(outcome) > 0) {
      const pots = Outcome.potCount(outcome)
      this.currentBreak += pots
      this.score += pots
      this.container.sound.playSuccess(table.inPockets())
      if (this.isEndOfGame(outcome)) {
        this.container.eventQueue.push(new ChatEvent(null, `game over`))
        this.container.recorder.wholeGameLink()
        const session = Session.getInstance()
        const result: MatchResult = {
          winner: session.playername || "Anon",
          winnerScore: 1,
          gameType: this.rulename,
        }
        if (session.opponentName) {
          result.loser = session.opponentName
          result.loserScore = 0
        }
        return new End(this.container, result)
      }
      this.container.sendEvent(new WatchEvent(table.serialise()))
      return new Aim(this.container)
    }

    // if no pot and no foul switch to other player
    this.container.sendEvent(new StartAimEvent())
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  isPartOfBreak(outcome: Outcome[]) {
    return Outcome.isBallPottedNoFoul(this.container.table.cueball, outcome)
  }

  isEndOfGame(outcome: Outcome[]) {
    return (
      !this.isFoul(outcome) && Outcome.pots(outcome).some((b) => b.label === 9)
    )
  }

  otherPlayersCueBall(): Ball {
    // only for three cushion
    return this.cueball
  }

  secondToPlay() {
    // only for three cushion
  }

  allowsPlaceBall() {
    return true
  }

  protected isFoul(outcome: Outcome[]): boolean {
    const table = this.container.table
    const cueball = table.cueball

    // 1. Cue ball potted
    if (Outcome.isCueBallPotted(cueball, outcome)) {
      return true
    }

    // 2. Wrong ball hit first
    const lowestBall = this.getLowestBallAtStartOfShot(outcome)
    const firstCollision = Outcome.firstCollision(
      Outcome.cueBallFirst(cueball, outcome)
    )

    if (!firstCollision) {
      return true // No ball hit
    }

    if (firstCollision.ballB !== lowestBall) {
      return true // Wrong ball hit first
    }

    // 3. No cushion after contact
    if (Outcome.potCount(outcome) === 0) {
      // Find cushions after first collision
      const firstCollisionIndex = outcome.indexOf(firstCollision)
      const cushionsAfter = outcome
        .slice(firstCollisionIndex + 1)
        .some((o) => o.type === OutcomeType.Cushion)
      if (!cushionsAfter) {
        return true
      }
    }

    return false
  }

  protected getLowestBallAtStartOfShot(outcome: Outcome[]): Ball | undefined {
    const potted = Outcome.pots(outcome)
    const onTable = this.container.table.balls.filter(
      (b) => b !== this.cueball && b.onTable()
    )
    const all = [...potted, ...onTable]
    return all.sort((a, b) => (a.label || 0) - (b.label || 0))[0]
  }

  private respotNineBall() {
    Respot.nineBall(this.container.table)
  }
}
