import { Controller } from "../controller/controller"
import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"

export class ScoreEvent extends GameEvent {
  constructor(
    readonly p1: number,
    readonly p2: number,
    readonly b: number
  ) {
    super()
    this.type = EventType.SCORE
  }

  applyToController(controller: Controller): Controller {
    return controller.handleScore(this)
  }

  static fromJson(json: any): ScoreEvent {
    return new ScoreEvent(json.p1, json.p2, json.b)
  }
}
