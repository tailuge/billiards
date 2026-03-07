import { ControllerBase } from "./controllerbase";
import { AimEvent, Controller, HitEvent, Input } from "./controller";
import { MessageRelay } from "../network/client/messagerelay";
import { EventUtil } from "../events/eventutil";
import { GameEvent } from "../events/gameevent";
import { ScoreEvent } from "../events/scoreevent";
import { PlaceBallEvent } from "../events/placeballevent";
import { RerackEvent } from "../events/rerackevent";
import { BreakEvent } from "../events/breakevent";
import { Session } from "../network/client/session";
import { EventType } from "../events/eventtype";

export class Spectate extends ControllerBase {
  override get name() {
    return "Spectate";
  }
  messageRelay: MessageRelay;
  tableId: string;
  messages: GameEvent[] = [];
  constructor(container, messageRelay, tableId) {
    super(container);
    this.messageRelay = messageRelay;
    this.tableId = tableId;
    this.messageRelay.subscribe(this.tableId, (message) => {
      console.log(message);
      const event = EventUtil.fromSerialised(message);
      this.messages.push(event);

      this.sniffNames(event);

      if (
        event instanceof HitEvent ||
        event instanceof AimEvent ||
        event instanceof ScoreEvent ||
        event instanceof PlaceBallEvent ||
        event instanceof BreakEvent ||
        event instanceof RerackEvent
      ) {
        this.container.eventQueue.push(event);
      }
    });
    console.log("Spectate");
  }

  private sniffNames(event: GameEvent) {
    console.log(
      `[Spectate] sniffNames called: type=${event.type}, event.clientId=${event.clientId}, session.clientId=${Session.getInstance().clientId}, playername=${event.playername}`,
    );
    if (!Session.hasInstance()) {
      console.log("[Spectate] No session instance, returning");
      return;
    }
    const session = Session.getInstance();
    if (event.clientId === session.clientId) {
      console.log(
        "[Spectate] Event clientId matches session clientId, ignoring own event",
      );
      return;
    }

    let changed = false;
    if (
      event.type === EventType.BEGIN &&
      !session.spectatedP1Name &&
      event.playername
    ) {
      console.log("[Spectate] Setting spectatedP1Name to:", event.playername);
      session.spectatedP1Name = event.playername;
      changed = true;
    } else if (
      event.type === EventType.WATCHAIM &&
      !session.spectatedP2Name &&
      event.playername
    ) {
      console.log("[Spectate] Setting spectatedP2Name to:", event.playername);
      session.spectatedP2Name = event.playername;
      changed = true;
    }

    console.log(
      "[Spectate] After sniff - P1:",
      session.spectatedP1Name,
      "P2:",
      session.spectatedP2Name,
    );

    if (changed) {
      const scores = this.container.getOrderedScores();
      this.container.updateScoreHud(
        scores.p1,
        scores.p2,
        this.container.currentBreak,
      );
    }
  }

  override handleAim(event: AimEvent) {
    this.container.table.cue.aim = event;
    this.container.table.cueball.pos.copy(event.pos);
    return this;
  }

  override handleHit(event: HitEvent) {
    console.log("Spectate Hit");
    this.container.table.updateFromSerialised(event.tablejson);
    this.container.table.outcome = [];
    this.container.table.hit();
    return this;
  }

  override handleBreak(event: BreakEvent) {
    this.container.table.updateFromShortSerialised(event.init);
    return this;
  }

  override handlePlaceBall(event: PlaceBallEvent) {
    const respot = event.respot;
    if (respot) {
      const ball = this.container.table.balls.find((b) => b.id === respot.id);
      if (ball) {
        console.log("Respotting ball", ball.id, "to", respot.pos);
        ball.pos.copy(respot.pos);
        ball.setStationary();
      }
    }
    return this;
  }

  override handleRerack(event: RerackEvent) {
    RerackEvent.applyBallinfoToTable(this.container.table, event.ballinfo);
    return this;
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input);
    return this;
  }
}
