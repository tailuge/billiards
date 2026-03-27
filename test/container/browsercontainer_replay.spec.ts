import { expect } from "chai";
import { BrowserContainer } from "../../src/container/browsercontainer";
import { Session } from "../../src/network/client/session";
import { initDom } from "../view/dom";

initDom();

describe("BrowserContainer Replay", () => {
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = document.createElement("canvas");
    Session.reset();
  });

  it("should set spectated names when starting replay and preserve original playername", () => {
    const params = new URLSearchParams("userName=RealUser&state=dummy");
    const bc = new BrowserContainer(mockCanvas, params);

    // Partially mock container to avoid full initialization
    bc.container = {
        updateScoreHud: jest.fn(),
        eventQueue: [],
        table: { cue: { aimInputs: { setDisabled: jest.fn() } } }
    } as any;

    const replayData = JSON.stringify({
        players: { player1: "ReplayP1", player2: "ReplayP2" },
        init: [],
        shots: []
    });

    bc.startReplay(replayData);

    const session = Session.getInstance();
    expect(session.playername).to.equal("RealUser");
    expect(session.spectatedP1Name).to.equal("ReplayP1");
    expect(session.spectatedP2Name).to.equal("ReplayP2");
    expect(session.replayMode).to.be.true;

    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.equal("ReplayP1");
    expect(names.p2Name).to.equal("ReplayP2");
  });

  it("should handle replay without players object", () => {
    const params = new URLSearchParams("userName=RealUser&state=dummy");
    const bc = new BrowserContainer(mockCanvas, params);
    bc.container = {
        updateScoreHud: jest.fn(),
        eventQueue: [],
        table: { cue: { aimInputs: { setDisabled: jest.fn() } } }
    } as any;

    const replayData = JSON.stringify({
        init: [],
        shots: []
    });

    bc.startReplay(replayData);
    const session = Session.getInstance();
    expect(session.spectatedP1Name).to.be.undefined;
    expect(session.playername).to.equal("RealUser");
  });
});
