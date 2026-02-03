import { Container } from "../container/container"
import { Outcome } from "../model/outcome"
import { EventType } from "./eventtype"
import { HitEvent } from "./hitevent"
import { RerackEvent } from "./rerackevent"
import { GameEvent } from "./gameevent"
import { LinkFormatter } from "../view/link-formatter"
import { ReplayEncoder } from "../utils/replay-encoder"

export class Recorder {
  container: Container
  linkFormatter: LinkFormatter
  shots: GameEvent[] = []
  states: number[][] = []
  start = Date.now()
  breakStart: number | undefined
  breakStartTime
  constructor(container: Container, linkFormatter: LinkFormatter) {
    this.container = container
    this.linkFormatter = linkFormatter
  }

  record(event) {
    if (event.type === EventType.WATCHAIM && "rerack" in event.json) {
      this.states.push(this.container.table.shortSerialise())
      this.shots.push(
        RerackEvent.fromJson({
          balls: event.json.balls,
        })
      )
    }
    if (event.type === EventType.HIT) {
      this.states.push(this.container.table.shortSerialise())
      this.shots.push((<HitEvent>event).tablejson.aim)
    }
  }

  wholeGame() {
    return ReplayEncoder.createState(
      this.states[0],
      this.shots,
      this.start,
      this.container.rules.score,
      true
    )
  }

  last() {
    let last = this.states.length - 1
    if (last > 0 && this.shots[last].type === "RERACK") {
      last--
    }
    return last
  }

  lastShot() {
    const last = this.last()
    return ReplayEncoder.createState(this.states[last], [this.shots[last]])
  }

  currentBreak() {
    if (this.breakStart !== undefined) {
      return ReplayEncoder.createState(
        this.states[this.breakStart],
        this.shots.slice(this.breakStart),
        this.breakStartTime,
        this.container.rules.previousBreak
      )
    }
    return undefined
  }

  updateBreak(
    outcome: Outcome[],
    isPartOfBreak: boolean,
    isEndOfGame: boolean
  ) {
    const potCount = Outcome.potCount(outcome)
    if (!isPartOfBreak) {
      this.breakLink(isEndOfGame)
    }

    this.lastShotLink(
      isPartOfBreak || isEndOfGame,
      potCount,
      Outcome.pots(outcome)
    )

    if (isEndOfGame) {
      this.breakLink(isEndOfGame)
    }

    if (!isPartOfBreak) {
      this.breakStart = undefined
      return
    }

    if (this.breakStart === undefined) {
      this.breakStart = this.last()
      this.breakStartTime = Date.now()
    }
  }

  lastShotLink(isPartOfBreak, potCount, balls) {
    this.linkFormatter.lastShotLink(
      isPartOfBreak,
      potCount,
      balls,
      this.lastShot()
    )
  }

  breakLink(includeLastShot) {
    const currentBreak = this.currentBreak()
    if (!currentBreak) {
      return
    }

    const breakScore =
      this.container.rules.currentBreak === 0
        ? this.container.rules.previousBreak
        : this.container.rules.currentBreak

    this.linkFormatter.breakLink(currentBreak, breakScore, includeLastShot)
  }

  wholeGameLink() {
    this.linkFormatter.wholeGameLink(this.wholeGame())
  }
}
