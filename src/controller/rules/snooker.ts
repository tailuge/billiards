import { Vector3 } from "three";
import { WatchEvent } from "../../events/watchevent";
import { Outcome } from "../../model/outcome";
import { Rack } from "../../utils/rack";
import { Controller } from "../controller";
import { Rules } from "./rules";
import { Respot } from "../../utils/respot";
import { Aim } from "../aim";
import { WatchAim } from "../watchaim";
import { Container } from "../../container/container";
import { Ball } from "../../model/ball";
import { Table } from "../../model/table";
import { TableGeometry } from "../../view/tablegeometry";
import { PlaceBall } from "../placeball";
import { PlaceBallEvent } from "../../events/placeballevent";
import { zero, isFirstShot } from "../../utils/utils";
import { SnookerUtils, ShotInfo } from "./snookerutils";
import { SnookerScoring } from "./snookerscoring";
import { StartAimEvent } from "../../events/startaimevent";
import { Session } from "../../network/client/session";
import { RerackEvent } from "../../events/rerackevent";

export class Snooker implements Rules {
  cueball: Ball;
  previousPotRed = false;
  targetIsRed = true;
  currentBreak = 0;
  previousBreak = 0;
  foulPoints = 0;
  rulename = "snooker";

  static readonly tablemodel = "models/d-snooker.min.gltf";

  readonly container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  snookerrule(outcome: Outcome[]): Controller {
    this.foulPoints = 0;
    const info = SnookerUtils.shotInfo(
      this.container.table,
      outcome,
      this.targetIsRed,
      this.previousPotRed,
    );

    if (info.pots === 0) {
      this.targetIsRed =
        SnookerUtils.redsOnTable(this.container.table).length > 0;
      if (!info.legalFirstCollision) {
        return this.foul(outcome, info);
      }
      return this.switchPlayer();
    }

    if (this.targetIsRed) {
      return this.targetRedRule(outcome, info);
    }

    return this.targetColourRule(outcome, info);
  }

  targetRedRule(outcome: Outcome[], info: ShotInfo): Controller {
    if (info.legalFirstCollision && Outcome.onlyRedsPotted(outcome)) {
      this.currentBreak += info.pots;
      this.container.scores[Session.playerIndex()] += info.pots;
      this.targetIsRed = false;
      this.previousPotRed = true;
      return this.continueBreak();
    }

    return this.foul(outcome, info);
  }

  targetColourRule(outcome: Outcome[], info: ShotInfo): Controller {
    if (info.whitePotted) {
      return this.foul(outcome, info);
    }

    if (info.pots > 1) {
      this.respot(outcome);
      return this.foul(outcome, info);
    }

    if (Outcome.pots(outcome)[0].id > 6) {
      return this.foul(outcome, info);
    }

    const id = Outcome.pots(outcome)[0].id;
    if (id !== info.firstCollision.ballB.id) {
      return this.foul(outcome, info);
    }

    if (this.previousPotRed) {
      this.respot(outcome);
      this.currentBreak += id + 1;
      this.container.scores[Session.playerIndex()] += id + 1;
      this.previousPotRed = false;
      this.targetIsRed =
        SnookerUtils.redsOnTable(this.container.table).length > 0;
      return this.continueBreak();
    }

    const lesserBallOnTable =
      SnookerUtils.coloursOnTable(this.container.table).filter(
        (b: Ball) => b.id < id,
      ).length > 0;

    if (lesserBallOnTable) {
      return this.foul(outcome, info);
    }

    this.currentBreak += id + 1;
    this.container.scores[Session.playerIndex()] += id + 1;
    this.previousPotRed = false;
    this.targetIsRed =
      SnookerUtils.redsOnTable(this.container.table).length > 0;
    return this.continueBreak();
  }

  foul(outcome: Outcome[], info: ShotInfo): Controller {
    const foulResult = SnookerUtils.calculateFoul(outcome, info);
    this.foulPoints = foulResult.points;
    const index = Session.playerIndex();
    this.container.scores[1 - index] += this.foulPoints;
    const notification = info.whitePotted
      ? ({
          type: "Foul",
          title: "FOUL",
          subtext: foulResult.reason || `Foul (${this.foulPoints} points)`,
          extra: "Ball in hand",
        } as const)
      : ({
          type: "Foul",
          title: "FOUL",
          subtext: foulResult.reason || `Foul (${this.foulPoints} points)`,
        } as const);
    this.container.notify(notification);
    this.respot(outcome);
    if (info.whitePotted) {
      return this.whiteInHand();
    }
    return this.switchPlayer();
  }

  tableGeometry() {
    TableGeometry.hasPockets = true;
  }

  table(): Table {
    const table = new Table(this.rack());
    this.cueball = table.cueball;
    return table;
  }

  otherPlayersCueBall(): Ball {
    return this.cueball;
  }

  secondToPlay() {}

  isPartOfBreak(_: Outcome[]): boolean {
    return this.currentBreak > 0;
  }

  isEndOfGame(_: Outcome[]): boolean {
    return Outcome.isClearTable(this.container.table) && this.currentBreak > 0;
  }

  allowsPlaceBall(): boolean {
    return true;
  }

  asset(): string {
    return Snooker.tablemodel;
  }

  startTurn() {
    this.previousPotRed = false;
    this.targetIsRed =
      SnookerUtils.redsOnTable(this.container.table).length > 0;
    this.previousBreak = this.currentBreak;
    this.currentBreak = 0;
  }

  getScores(): [number, number] {
    return this.container.scores;
  }

  rack() {
    return Rack.snooker();
  }

  nextCandidateBall() {
    if (isFirstShot(this.container.recorder)) {
      return undefined;
    }
    const table = this.container.table;
    const redsOnTable = SnookerUtils.redsOnTable(table);
    const coloursOnTable = SnookerUtils.coloursOnTable(table);
    if (this.previousPotRed) {
      return Respot.closest(table.cueball, coloursOnTable);
    }
    if (redsOnTable.length > 0) {
      return Respot.closest(table.cueball, redsOnTable);
    }

    if (coloursOnTable.length > 0) {
      return coloursOnTable[0];
    }
    return undefined;
  }

  placeBall(target?: Vector3): Vector3 {
    if (target) {
      const centre = new Vector3(Rack.baulk, 0, 0);
      const radius = Rack.sixth;
      const distance = target.distanceTo(centre);
      if (target.x >= Rack.baulk) {
        target.x = Rack.baulk;
      }
      if (distance > radius) {
        const direction = target.clone().sub(centre).normalize();
        return centre.add(direction.multiplyScalar(radius));
      } else {
        return target;
      }
    }
    return new Vector3(Rack.baulk, -Rack.sixth / 2.6, 0);
  }

  switchPlayer(): Controller {
    const table = this.container.table;
    this.container.sendEvent(new StartAimEvent(this.foulPoints));
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()));
      this.startTurn();
      return new Aim(this.container);
    }
    this.startTurn();
    return new WatchAim(this.container);
  }

  continueBreak(): Controller {
    const table = this.container.table;
    this.container.sound.playSuccess(table.inPockets());
    if (Outcome.isClearTable(table)) {
      return this.handleGameEnd(true);
    }
    this.container.sendEvent(new WatchEvent(table.serialise()));
    return new Aim(this.container);
  }

  handleGameEnd(_: boolean): Controller {
    return SnookerScoring.presentGameEnd(this.container, this.rulename);
  }

  whiteInHand(): Controller {
    this.startTurn();
    if (this.container.isSinglePlayer) {
      return new PlaceBall(this.container);
    }
    this.container.sendEvent(new PlaceBallEvent(zero));
    return new WatchAim(this.container);
  }

  update(outcome: Outcome[]): Controller {
    return this.snookerrule(outcome);
  }

  respot(outcome: Outcome[]) {
    const respotted = SnookerUtils.respotAllPottedColours(
      this.container.table,
      outcome,
    );
    if (respotted.length > 0) {
      const respot = RerackEvent.fromJson({
        balls: respotted.map((b) => b.serialise()),
      });
      this.container.sendEvent(respot);
    }
  }
}
