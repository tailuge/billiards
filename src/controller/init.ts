import { BeginEvent } from "../events/beginevent"
import { WatchEvent } from "../events/watchevent"
import { Controller } from "./controller"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { BreakEvent } from "../events/breakevent"
import { PlaceBall } from "./placeball"
import { Replay } from "./replay"
import { Session } from "../network/client/session"
import { Spectate } from "./spectate"
import { NchanMessageRelay } from "../network/client/nchanmessagerelay"

/**
 * Initial state of controller.
 *
 * Transitions into active player or watcher or replay mode.
 */
export class Init extends ControllerBase {
  override handleBegin(_: BeginEvent): Controller {
    if (Session.isSpectator()) {
      return new Spectate(
        this.container,
        this.container.relay ?? new NchanMessageRelay(),
        Session.getInstance().tableId
      )
    }

    if (Session.hasInstance()) {
      Session.getInstance().breakingPlayerIndex = 0
    }
    this.container.chat.showMessage("Start")
    this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
    return new PlaceBall(this.container)
  }

  override handleWatch(event: WatchEvent): Controller {
    if (Session.hasInstance()) {
      Session.getInstance().breakingPlayerIndex = 1
    }
    this.container.chat.showMessage("Opponent to break")
    this.container.rules.secondToPlay()
    this.container.table.updateFromSerialised(event.json)
    return new WatchAim(this.container)
  }

  override handleBreak(event: BreakEvent): Controller {
    if (event.init) {
      this.container.table.updateFromShortSerialised(event.init)
      this.container.chat.showMessage("Replay")
      return new Replay(this.container, event.init, event.shots)
    }
    return new PlaceBall(this.container)
  }
}
