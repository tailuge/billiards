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
import { Aim } from "./aim"

/**
 * Initial state of controller.
 *
 * Transitions into active player or watcher or replay mode.
 */
export class Init extends ControllerBase {
  override get name() {
    return "Init"
  }

  override handleBegin(_: BeginEvent): Controller {
    if (Session.isSpectator()) {
      return new Spectate(
        this.container,
        this.container.relay ?? new NchanMessageRelay(),
        Session.getInstance().tableId
      )
    }
    this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
    if (Session.isPracticeMode() && Session.hasInitParam()) {
      this.container.table.cueball.fround()
      this.container.sound.playNotify()
      this.container.sendEvent(
        new BreakEvent(this.container.table.shortSerialise())
      )
      return new Aim(this.container)
    }
    return new PlaceBall(this.container)
  }

  override handleWatch(event: WatchEvent): Controller {
    this.container.rules.secondToPlay()
    this.container.table.updateFromSerialised(event.json)
    Session.getInstance().playerIndex = 1
    return new WatchAim(this.container)
  }

  override handleBreak(event: BreakEvent): Controller {
    if (event.init) {
      this.container.table.updateFromShortSerialised(event.init)
      return new Replay(this.container, event.init, event.shots)
    }
    if (Session.isPracticeMode() && Session.hasInitParam()) {
      this.container.table.cueball.fround()
      this.container.sound.playNotify()
      this.container.sendEvent(
        new BreakEvent(this.container.table.shortSerialise())
      )
      return new Aim(this.container)
    }
    return new PlaceBall(this.container)
  }
}
