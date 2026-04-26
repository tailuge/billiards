import { GameEvent } from "./gameevent";
import { EventType } from "./eventtype";
import { Controller } from "../controller/controller";

export class BreakEvent extends GameEvent {
  init;
  shots;
  diagram;
  retry;
  constructor(init?, shots?, diagram?) {
    super();
    this.init = init;
    this.shots = shots;
    this.diagram = diagram;
    this.type = EventType.BREAK;
  }

  applyToController(controller: Controller) {
    return controller.handleBreak(this);
  }

  static fromJson(json) {
    return new BreakEvent(json.init, json.shots, json.diagram);
  }
}
