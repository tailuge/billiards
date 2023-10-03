import { Container } from "../container/container"
import { Outcome } from "../model/outcome"
import { ChatEvent } from "./chatevent"
import { EventType } from "./eventtype"
import { HitEvent } from "./hitevent"

export class Recorder {
  container: Container
  shots: string[] = []
  states: number[][] = []
  breakStart: number | undefined
  replayUrl
  constructor(container: Container) {
    this.container = container
  }

  record(event) {
    if (event.type === EventType.HIT) {
      this.states.push(this.container.table.shortSerialise())
      this.shots.push((<HitEvent>event).tablejson.aim)
    }
  }

  replayGame() {
    return this.state(this.states[0], this.shots)
  }

  replayLastShot() {
    const last = this.states.length - 1
    return this.state(this.states[last], [this.shots[last]])
  }

  replayCurrentBreak() {
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
      this.replayBreakLink(isEndOfGame)
    }

    this.replayLastShotLink(isPartOfBreak || isEndOfGame, potCount)

    if (isEndOfGame) {
      this.replayBreakLink(isEndOfGame)
    }

    if (!isPartOfBreak) {
      this.breakStart = undefined
      return
    }

    if (this.breakStart === undefined) {
      this.breakStart = this.states.length - 1
    }
  }

  replayLastShotLink(isPartOfBreak, potCount) {
    const pots = potCount > 1 ? potCount - 1 : 0
    const shotIcon = "⚈".repeat(pots) + (isPartOfBreak ? "⚈" : "⚆")
    const serialisedShot = JSON.stringify(this.replayLastShot())
    this.generateLink(shotIcon, serialisedShot)
  }

  replayBreakLink(includeLastShot) {
    const currentBreak = this.replayCurrentBreak()
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
    this.generateLink(text, serialisedShot)
  }

  generateLink(text, state) {
    const shotUri = `${this.replayUrl}${encodeURIComponent(state)}`
    const shotLink = `<a class="pill" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }
}
