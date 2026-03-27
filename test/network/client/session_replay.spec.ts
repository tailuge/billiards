import { expect } from "chai";
import { Session } from "../../../src/network/client/session";

describe("Session Replay Mode", () => {
  afterEach(() => {
    Session.reset();
  });

  it("should preserve playername in replay mode while showing replay names in HUD", () => {
    const originalPlayerName = "RealPlayer";
    const originalClientId = "real-id";
    const replayPlayer1 = "ReplayHero";
    const replayPlayer2 = "ReplayVillain";

    // Initialize session as if we are a player with a specific identity
    Session.init(originalClientId, originalPlayerName, "table1", false, false, true);
    const session = Session.getInstance();

    expect(session.playername).to.equal(originalPlayerName);
    expect(session.replayMode).to.be.true;

    // Simulate starting a replay and loading names from replay data
    session.spectatedP1Name = replayPlayer1;
    session.spectatedP2Name = replayPlayer2;

    // HUD should show replay names
    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.equal(replayPlayer1);
    expect(names.p2Name).to.equal(replayPlayer2);

    // Internal identity should still be the original one
    expect(session.playername).to.equal(originalPlayerName);
    expect(session.clientId).to.equal(originalClientId);
  });

  it("should show original names when not in replay mode", () => {
    const originalPlayerName = "RealPlayer";
    const originalClientId = "real-id";

    Session.init(originalClientId, originalPlayerName, "table1", false, false, false);
    const session = Session.getInstance();

    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.equal(originalPlayerName);
    expect(session.replayMode).to.be.false;
  });
});
