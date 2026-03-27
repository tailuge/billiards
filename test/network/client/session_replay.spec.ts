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

    expect(Session.isReplayMode()).to.be.true;
    expect(Session.playerIndex()).to.equal(0);
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

  it("should handle spectator mode name resolution", () => {
    Session.init("spec-id", "SpecUser", "table1", true, false, false);
    const session = Session.getInstance();
    session.spectatedP1Name = "Player1";
    session.spectatedP2Name = "Player2";

    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.equal("Player1");
    expect(names.p2Name).to.equal("Player2");
    expect(Session.isSpectator()).to.be.true;
  });

  it("should handle names for player index 1", () => {
    Session.init("p2-id", "User2", "table1", false, false, false);
    const session = Session.getInstance();
    session.opponentName = "User1";
    session.playerIndex = 1;

    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.equal("User1");
    expect(names.p2Name).to.equal("User2");
  });

  it("should handle names for player index 0", () => {
    Session.init("p1-id", "User1", "table1", false, false, false);
    const session = Session.getInstance();
    session.opponentName = "User2";
    session.playerIndex = 0;

    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.equal("User1");
    expect(names.p2Name).to.equal("User2");
  });

  it("should cover isBotMode and initializeScores", () => {
    Session.init("bot-test", "Me", "table1", false, true, false);
    expect(Session.isBotMode()).to.be.true;
    const session = Session.getInstance();
    expect(session.opponentName).to.equal("ClawBreak");
    expect(session.opponentClientId).to.equal("bot");
  });

  it("should handle score methods", () => {
    Session.init("p1", "User1", "table1", false, false, false);
    const session = Session.getInstance();
    session.setOpponentClientId("p2");

    session.setMyScore(10);
    session.setOpponentScore(5);
    expect(session.myScore()).to.equal(10);
    expect(session.opponentScore()).to.equal(5);

    session.addMyScore(2);
    session.addOpponentScore(3);
    expect(session.myScore()).to.equal(12);
    expect(session.opponentScore()).to.equal(8);

    expect(session.orderedScoresForHud()).to.deep.equal({ p1: 12, p2: 8 });
    session.playerIndex = 1;
    expect(session.orderedScoresForHud()).to.deep.equal({ p1: 8, p2: 12 });
  });

  it("should throw error if instance not initialized", () => {
    Session.reset();
    expect(() => Session.getInstance()).to.throw("Session not initialized");
  });

  it("should handle opponentClientId change and cleanup", () => {
    Session.init("p1", "User1", "table1", false, false, false);
    const session = Session.getInstance();
    session.setOpponentScore(10);
    expect(session.opponentScore()).to.equal(10);

    session.setOpponentClientId("new-p2");
    expect(session.opponentClientId).to.equal("new-p2");
    expect(session.opponentScore()).to.equal(10); // Score preserved

    session.setOpponentClientId("new-p3");
    expect(session.opponentClientId).to.equal("new-p3");
    expect(session.opponentScore()).to.equal(10); // Score still preserved
  });

  it("should handle default opponentKey when clientId is null", () => {
    Session.init("p1", "User1", "table1", false, false, false);
    const session = Session.getInstance();
    // Initially opponentClientId is undefined
    expect(session.opponentScore()).to.equal(0);
    session.setOpponentScore(7);
    expect(session.opponentScore()).to.equal(7);
  });

  it("should handle empty names in orderedNamesForHud", () => {
    Session.init("p1", "", "table1", false, false, false);
    const session = Session.getInstance();
    session.opponentName = "";
    session.playerIndex = 0;
    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.be.undefined;
    expect(names.p2Name).to.be.undefined;

    session.playerIndex = 1;
    const names2 = session.orderedNamesForHud();
    expect(names2.p1Name).to.be.undefined;
    expect(names2.p2Name).to.be.undefined;
  });

  it("should handle empty spectated names", () => {
    Session.init("spec", "User", "table1", true, false, false);
    const session = Session.getInstance();
    session.spectatedP1Name = "";
    session.spectatedP2Name = "";
    const names = session.orderedNamesForHud();
    expect(names.p1Name).to.be.undefined;
    expect(names.p2Name).to.be.undefined;
  });
});
