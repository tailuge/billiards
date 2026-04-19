import { Controller } from "../controller/controller"
import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"

export class ScoreEvent extends GameEvent {
  constructor(
    readonly p1: number,
    readonly p2: number,
    readonly b: number,
    readonly active: 0 | 1 | 2 = 0,
    readonly p1a?: number,
    readonly p2a?: number
  ) {
    super()
    this.type = EventType.SCORE
  }

  applyToController(controller: Controller): Controller {
    return controller.handleScore(this)
  }

  static fromJson(json: any): ScoreEvent {
    return new ScoreEvent(
      json.p1,
      json.p2,
      json.b,
      json.active ?? 0,
      json.p1a,
      json.p2a
    )
  }
}
