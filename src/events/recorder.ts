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
  start = Date.now()
  breakStart: number | undefined
  breakStartTime
  replayUrl
  hiScoreUrl = "https://scoreboard-tailuge.vercel.app/hiscore.html"
  constructor(container: Container) {
    this.container = container
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
    return this.state(
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
    return this.state(this.states[last], [this.shots[last]])
  }

  currentBreak() {
    if (this.breakStart !== undefined) {
      return this.state(
        this.states[this.breakStart],
        this.shots.slice(this.breakStart),
        this.breakStartTime,
        this.container.rules.previousBreak
      )
    }
    return undefined
  }

  private state(init, events, start = 0, score = 0, wholeGame = false) {
    return {
      init: init,
      shots: events,
      start: start,
      now: Date.now(),
      score: score,
      wholeGame: wholeGame,
      v: 1,
    }
  }

  updateBreak(outcome: Outcome[]) {
    const isPartOfBreak = this.container.rules.isPartOfBreak(outcome)
    const isEndOfGame = this.container.rules.isEndOfGame(outcome)
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
    const pots = potCount > 1 ? potCount - 1 : 0

    let colourString = "#000000"
    if (balls.length > 0) {
      balls.forEach((element) => {
        colourString = "#" + element.ballmesh.color.getHexString()
      })
    }

    const shotIcon = "⚈".repeat(pots) + (isPartOfBreak ? "⚈" : "⚆")
    const serialisedShot = JSON.stringify(this.lastShot())
    this.generateLink(shotIcon, serialisedShot, colourString)
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
    const breakScore =
      this.container.rules.currentBreak === 0
        ? this.container.rules.previousBreak
        : this.container.rules.currentBreak
    currentBreak.score = breakScore
    const text = `break(${breakScore})`
    const serialisedShot = JSON.stringify(currentBreak)
    const compressed = JSONCrush.crush(serialisedShot)
    this.generateLink(text, compressed, "black")
    if (breakScore >= 2) {
      this.generateHiScoreLink(compressed)
    }
  }

  wholeGameLink() {
    const game = this.wholeGame()
    const text = `frame(${this.shotCount(game.shots)} shots)`
    const serialisedGame = JSON.stringify(game)
    const compressed = JSONCrush.crush(serialisedGame)
    this.generateLink(text, compressed, "black")
  }

  shotCount(shots) {
    return shots.filter((shot) => shot.type !== "RERACK").length
  }

  private generateLink(text, state, colour) {
    const shotUri = `${this.replayUrl}${this.fullyEncodeURI(state)}`
    const shotLink = `<a class="pill" style="color: ${colour}" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }

  private generateHiScoreLink(state) {
    const text = "hi score 🏆"
    const shotUri = `${this.hiScoreUrl}?ruletype=${
      this.container.rules.rulename
    }&state=${this.fullyEncodeURI(state)}`
    const shotLink = `<a class="pill" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }

  private fullyEncodeURI(uri) {
    return encodeURIComponent(uri)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\!/g, "%21")
      .replace(/\*/g, "%2A")
  }
}
