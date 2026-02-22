import { GameEvent } from "../../events/gameevent";
import { Logger } from "./logger";
import { Container } from "../../container/container";
import { EventType } from "../../events/eventtype";
import { HitEvent } from "../../events/hitevent";
import { AimCalculator } from "./aimcalculator";
import { PocketGeometry } from "../../view/pocketgeometry";
import { StartAimEvent } from "../../events/startaimevent";
import { Outcome } from "../../model/outcome";
import { NineBall } from "../../controller/rules/nineball";
import { PlaceBallEvent } from "../../events/placeballevent";
import { WatchEvent } from "../../events/watchevent";
import { EventUtil } from "../../events/eventutil";

export class BotEventHandler {
  private logs: Logger;
  private container: Container;
  private publishToPlayer: (event: GameEvent) => void;
  protected enqueueMessage: (message: string) => void;
  private readonly calculator: AimCalculator;

  constructor(
    logs: Logger,
    container: Container,
    publishToPlayer: (event: GameEvent) => void,
    enqueueMessage: (message: string) => void,
  ) {
    this.logs = logs;
    this.container = container;
    this.publishToPlayer = publishToPlayer;
    this.enqueueMessage = enqueueMessage;
    this.calculator = new AimCalculator();
  }

  handle(event): void {
    this.logs.info(`Bot handling event: ${event.type}`);
    if (event.type === EventType.STARTAIM) {
      this.handleStartAim();
    }
    if (event.type === EventType.PLACEBALL) {
      this.handlePlaceBall(event);
    }
    if (event.type === EventType.BEGIN) {
      this.handleStationary();
    }
  }

  private handleStationary(): void {
    // The balls have finished rolling after a shot, now apply rules to find out
    // if turn continues or switches maybe with a foul and a placeball
    // gameover is also an option
    const outcome = this.container.table.outcome;
    if (this.container.rules.isEndOfGame(outcome)) {
      // bot has won, notify player
    }

    const foulReason = NineBall.foulReason(this.container.table, outcome);
    if (foulReason) {
      // bot has fouled, notify player
      this.container.notify({
        type: "Foul",
        title: "FOUL",
        subtext: foulReason,
        extra: "Ball in hand",
      });

      // in nineball it is ball in hand
      const cueball = this.container.table.cueball;
      const startPos = cueball.onTable()
        ? cueball.pos.clone()
        : this.container.rules.placeBall();
      const placeBallEvent = new PlaceBallEvent(startPos, undefined, true);
      this.publishToPlayer(placeBallEvent);
    }

    if (Outcome.potCount(outcome) > 0) {
      // pot success, send watch event to other player
      this.publishToPlayer(new WatchEvent(this.container.table.serialise()));
      // this player has to take another shot.
      this.enqueueMessage(EventUtil.serialise(new StartAimEvent()));
      return;
    }

    // switch to players turn
    this.publishToPlayer(new StartAimEvent());
  }

  private handleStartAim(): void {
    const hitEvent = this.generateCalculatedShot();
    this.publishToPlayer(hitEvent);
  }

  private handlePlaceBall(event: PlaceBallEvent): void {
    const table = this.container.table;

    if (event.respot) {
      const ball = table.balls.find((b) => b.id === event.respot!.id);
      if (ball) {
        ball.pos.copy(event.respot!.pos);
        ball.setStationary();
      }
    }

    const cueball = table.cueball;
    cueball.pos.copy(
      event.useStartPos ? event.pos : this.container.rules.placeBall(),
    );
    cueball.setStationary();
    const hitEvent = this.generateCalculatedShot();
    this.publishToPlayer(hitEvent);
  }

  
  private generateCalculatedShot(): HitEvent {
    const table = this.container.table;
    const cueball = table.cueball;
    const targetBall = this.container.rules.nextCandidateBall();

    if (!targetBall) {
      return this.calculator.generateRandomShot(table, 0.1, targetBall?.pos);
    }

    const pockets = this.calculator.extractPocketPositions(
      PocketGeometry.pocketCenters,
    );
    const aimPoint = this.calculator.getAimPoint(
      cueball.pos,
      targetBall.pos,
      pockets,
    );
    return this.calculator.generateRandomShot(table, 0.01, aimPoint ?? undefined);
  }
}
