import { expect } from "chai";
import { Container } from "../../src/container/container";
import { Init } from "../../src/controller/init";
import { PlaceBall } from "../../src/controller/placeball";
import { WatchEvent } from "../../src/events/watchevent";
import { GameEvent } from "../../src/events/gameevent";
import { Ball } from "../../src/model/ball";
import { Assets } from "../../src/view/assets";
import { Session } from "../../src/network/client/session";
import { BotRelay } from "../../src/network/bot/botrelay";
import { EventUtil } from "../../src/events/eventutil";
import { initDom } from "../view/dom";

initDom();

describe("Bot Mode", () => {
  let container: Container;
  let broadcastEvents: GameEvent[];

  beforeEach(function (done) {
    Session.reset();
    Ball.id = 0;
    done();
  });

  afterEach(function (done) {
    Session.reset();
    done();
  });

  it("OLD BEHAVIOR (now fixed): Bot mode stays in Init when no relay is used", (done) => {
    Session.init("testId", "testPlayer", "testTable", false, true);

    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
    });

    broadcastEvents = [];
    container.broadcast = (x) => broadcastEvents.push(x);

    container.isSinglePlayer = false;

    container.processEvents();

    expect(container.controller).to.be.an.instanceof(Init);

    const watchEvents = broadcastEvents.filter((e) => e instanceof WatchEvent);
    expect(watchEvents).to.have.lengthOf(0);

    done();
  });

  it("Bot mode should transition to PlaceBall and broadcast WatchEvent", (done) => {
    Session.init("testId", "testPlayer", "testTable", false, true);

    const relay = new BotRelay();
    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
      relay: relay,
    });

    broadcastEvents = [];
    container.broadcast = (x) => broadcastEvents.push(x);

    container.isSinglePlayer = false;

    // Subscribe to trigger the BeginEvent
    relay.subscribe("testTable", (e) => {
      const event = EventUtil.fromSerialised(e);
      container.eventQueue.push(event);
    });

    container.processEvents();

    // Wait for the BeginEvent to be sent via setTimeout in BotMessageRelay.subscribe
    setTimeout(() => {
      container.processEvents();

      // EXPECTED: container.controller should be an instance of PlaceBall
      expect(container.controller).to.be.an.instanceof(PlaceBall);

      // EXPECTED: WatchEvent should have been broadcast for the bot
      const watchEvents = broadcastEvents.filter(
        (e) => e instanceof WatchEvent,
      );
      expect(watchEvents).to.have.lengthOf(1);

      done();
    }, 10);
  });
});
