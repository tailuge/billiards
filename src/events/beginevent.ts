import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { Session } from "../network/client/session"
import { ThreeCushionConfig } from "../utils/threecushionconfig"

/** The race target from the URL, when the game set one. */
function raceToFromUrl(): number | undefined {
  if (typeof globalThis.location === "undefined") {
    return undefined
  }
  const params = new URLSearchParams(globalThis.location.search)
  return params.has("raceTo") ? ThreeCushionConfig.raceTo : undefined
}

export class BeginEvent extends GameEvent {
  ruletype?: string
  tableSize?: number
  /**
   * Bookkeeping only: no handler reads this. `practice: false` records that
   * the game is scored the traditional way (one point per carom) instead of by
   * proximity, and is left off when practice scoring is enabled.
   */
  practice?: boolean
  /** Bookkeeping only: the race target, present only when one was set. */
  raceTo?: number

  constructor(init?: {
    ruletype?: string
    tableSize?: number
    practice?: boolean
    raceTo?: number
  }) {
    super()
    this.type = EventType.BEGIN
    if (init) {
      Object.assign(this, init)
    }
    if (this.practice === undefined && !Session.isPracticeMode()) {
      this.practice = false
    }
    if (this.raceTo === undefined) {
      const raceTo = raceToFromUrl()
      if (raceTo !== undefined) {
        this.raceTo = raceTo
      }
    }
  }

  static fromJson(parsed): BeginEvent {
    return new BeginEvent({
      ruletype: parsed.ruletype,
      tableSize: parsed.tableSize,
      practice: parsed.practice,
      raceTo: parsed.raceTo,
    })
  }

  applyToController(controller: Controller) {
    return controller.handleBegin(this)
  }
}
