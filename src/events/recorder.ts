import { Container } from "../container/container"
import { Outcome } from "../model/outcome"
import { ChatEvent } from "./chatevent"
import { EventType } from "./eventtype"
import { HitEvent } from "./hitevent"
import JSONCrush from "jsoncrush"
import { RerackEvent } from "./rerackevent"
import { GameEvent } from "./gameevent"

export class Recorder {
  container: Container
  shots: GameEvent[] = []
  states: number[][] = []
  breakStart: number | undefined
  replayUrl
  constructor(container: Container) {
    this.container = container
  }

  record(event) {
    if (event.type === EventType.WATCHAIM && "rerack" in event.json) {
      this.states.push(this.container.table.shortSerialise())
      const rerack = RerackEvent.fromJson({
        balls: this.container.table.serialise().balls,
      })
      this.shots.push(rerack)
    }
    if (event.type === EventType.HIT) {
      this.states.push(this.container.table.shortSerialise())
      this.shots.push((<HitEvent>event).tablejson.aim)
    }
  }

  wholeGame() {
    return this.state(this.states[0], this.shots)
  }

  lastShot() {
    const last = this.states.length - 1
    return this.state(this.states[last], [this.shots[last]])
  }

  currentBreak() {
    if (this.breakStart !== undefined) {
      return this.state(
        this.states[this.breakStart],
        this.shots.slice(this.breakStart)
      )
    }
    return undefined
  }

  private state(init, events) {
    return {
      init: init,
      shots: events,
    }
  }

  updateBreak(outcome: Outcome[]) {
    const isPartOfBreak = this.container.rules.isPartOfBreak(outcome)
    const isEndOfGame = this.container.rules.isEndOfGame(outcome)
    const potCount = Outcome.potCount(outcome)
    if (!isPartOfBreak) {
      this.breakLink(isEndOfGame)
    }

    this.lastShotLink(isPartOfBreak || isEndOfGame, potCount)

    if (isEndOfGame) {
      this.breakLink(isEndOfGame)
    }

    if (!isPartOfBreak) {
      this.breakStart = undefined
      return
    }

    if (this.breakStart === undefined) {
      this.breakStart = this.states.length - 1
    }
  }

  lastShotLink(isPartOfBreak, potCount) {
    const pots = potCount > 1 ? potCount - 1 : 0
    const shotIcon = "⚈".repeat(pots) + (isPartOfBreak ? "⚈" : "⚆")
    const serialisedShot = JSON.stringify(this.lastShot())
    this.generateLink(shotIcon, serialisedShot)
  }

  breakLink(includeLastShot) {
    const currentBreak = this.currentBreak()
    if (!currentBreak) {
      return
    }
    if (!includeLastShot) {
      currentBreak.shots.pop()
    }
    if (currentBreak.shots.length === 1) {
      return
    }
    const text = `break(${currentBreak.shots.length})`
    const serialisedShot = JSON.stringify(currentBreak)
    const compressed = JSONCrush.crush(serialisedShot)
    this.generateLink(text, compressed)
  }

  wholeGameLink() {
    const game = this.wholeGame()
    const text = `frame(${game.shots.length})`
    const serialisedGame = JSON.stringify(game)
    const compressed = JSONCrush.crush(serialisedGame)
    this.generateLink(text, compressed)
  }

  private generateLink(text, state) {
    const shotUri = `${this.replayUrl}${encodeURIComponent(state)}`
    const shotLink = `<a class="pill" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }
}
