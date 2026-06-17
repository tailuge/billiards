import { BeginEvent } from "../events/beginevent"
import { WatchEvent } from "../events/watchevent"
import { Controller } from "./controller"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { BreakEvent } from "../events/breakevent"
import { PlaceBall } from "./placeball"
import { Replay } from "../controller/replay"
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

  override onFirst() {
    const session = Session.getInstance()
    if (
      !session.spectator &&
      !this.container.isSinglePlayer &&
      !session.botMode &&
      !this.container.replayMode
    ) {
      this.container.notification.show(
        { type: "Info", title: "Waiting for opponent to join" },
        0
      )
    }
  }

  override handleBegin(_: BeginEvent): Controller {
    if (!Session.getInstance().vsNotificationShown) {
      this.container.notification.clear()
    }
    this.showTwoPlayerScores()
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
    return (
      this.container.rules.initialController?.() ??
      new PlaceBall(this.container)
    )
  }

  override handleWatch(event: WatchEvent): Controller {
    this.container.rules.secondToPlay()
    this.container.table.updateFromSerialised(event.json)
    Session.getInstance().playerIndex = 1
    this.showTwoPlayerScores()
    return new WatchAim(this.container)
  }

  private showTwoPlayerScores() {
    if (!this.container.isSinglePlayer) {
      this.container.updateScoreHud(0, 0, 0)
    }
  }

  override handleBreak(event: BreakEvent): Controller {
    if (event.shots?.length > 0) {
      this.container.table.updateFromShortSerialised(event.init)
      return new Replay(
        this.container,
        event.init,
        event.shots,
        false,
        1500,
        event.diagram
      )
    }
    if (event.init) {
      this.container.table.updateFromShortSerialised(event.init)
      return new Aim(this.container)
    }
    if (Session.isPracticeMode() && Session.hasInitParam()) {
      this.container.table.cueball.fround()
      this.container.sound.playNotify()
      this.container.sendEvent(
        new BreakEvent(this.container.table.shortSerialise())
      )
      return new Aim(this.container)
    }
    return (
      this.container.rules.initialController?.() ??
      new PlaceBall(this.container)
    )
  }
}
