import { Container } from "../container/container"
import { Outcome } from "../model/outcome"
import { EventType } from "./eventtype"
import { HitEvent } from "./hitevent"
import { GameEvent } from "./gameevent"
import { LinkFormatter } from "../view/link-formatter"
import { ReplayEncoder } from "../utils/replay-encoder"
import { Session } from "../network/client/session"
import { RecordEntry } from "./recordentry"

export class Recorder {
  container: Container
  linkFormatter: LinkFormatter
  entries: RecordEntry[] = []
  start = Date.now()
  breakStart: number | undefined
  breakStartTime: number | undefined

  constructor(container: Container, linkFormatter: LinkFormatter) {
    this.container = container
    this.linkFormatter = linkFormatter
  }

  get shots(): GameEvent[] {
    return this.entries.map((e) => e.event)
  }

  get states(): number[][] {
    return this.entries.map((e) => e.state)
  }

  record(event: GameEvent) {
    let recordedEvent = event
    if (event.type === EventType.HIT) {
      recordedEvent = (event as HitEvent).tablejson.aim
    }

    if (
      event.type === EventType.HIT ||
      event.type === EventType.RERACK ||
      event.type === EventType.PLACEBALL
    ) {
      this.entries.push({
        state: this.container.table.shortSerialise(),
        event: recordedEvent,
        pots: 0,
        isPartOfBreak: false,
        time: Date.now(),
      })
    }
  }

  getPlayerNames(): { player1: string; player2: string } | undefined {
    if (!Session.hasInstance()) {
      return undefined
    }
    const session = Session.getInstance()
    const isP1 = session.playerIndex === 0
    return {
      player1: (isP1 ? session.playername : session.opponentName) || "Player 1",
      player2: (isP1 ? session.opponentName : session.playername) || "Player 2",
    }
  }

  wholeGame() {
    return ReplayEncoder.createState(
      this.entries[0]?.state,
      this.entries.map((e) => e.event),
      this.start,
      this.container.scores[Session.playerIndex()],
      true,
      this.getPlayerNames()
    )
  }

  last() {
    let last = this.entries.length - 1
    while (last > 0 && this.entries[last].event.type === EventType.RERACK) {
      last--
    }
    return last
  }

  lastShot() {
    const last = this.last()
    const entry = this.entries[last]
    return entry
      ? ReplayEncoder.createState(
          entry.state,
          [entry.event],
          0,
          0,
          false,
          this.getPlayerNames()
        )
      : undefined
  }

  currentBreak() {
    if (this.breakStart !== undefined) {
      const breakEntries = this.entries.slice(this.breakStart)
      return ReplayEncoder.createState(
        this.entries[this.breakStart].state,
        breakEntries.map((e) => e.event),
        this.breakStartTime,
        this.container.rules.previousBreak,
        false,
        this.getPlayerNames()
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
    const lastIndex = this.last()
    if (lastIndex >= 0) {
      this.entries[lastIndex].pots = potCount
      this.entries[lastIndex].isPartOfBreak = isPartOfBreak
    }

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
      this.breakStart = lastIndex
      this.breakStartTime = Date.now()
    }
  }

  lastShotLink(isPartOfBreak, potCount, balls) {
    const lastShot = this.lastShot()
    if (lastShot) {
      this.linkFormatter.lastShotLink(isPartOfBreak, potCount, balls, lastShot)
    }
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

  getPastShots(
    n: number,
    skipTypes: EventType[] = [EventType.RERACK, EventType.SCORE]
  ) {
    const shots: RecordEntry[] = []

    for (let i = this.entries.length - 1; i >= 0 && shots.length < n; i--) {
      if (!skipTypes.includes(this.entries[i].event.type)) {
        shots.unshift(this.entries[i])
      }
    }

    return shots
  }
}
