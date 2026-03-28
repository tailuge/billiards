import { expect } from "chai"
import { Container } from "../../src/container/container"
import { initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"
import { MatchResultHelper } from "../../src/network/client/matchresult"
import { Rematch } from "../../src/network/client/rematch"

initDom()

describe("Rematch Logic", () => {
  let container: Container

  beforeEach(() => {
    Session.init("test-client", "TestPlayer", "test-table", false)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets("nineball"),
      ruletype: "nineball",
    })
    container.isSinglePlayer = false
  })

  afterEach(() => {
    Session.reset()
  })

  it("should initialize rematchInfo in multiplayer if it's missing", () => {
    const session = Session.getInstance()
    session.opponentName = "TestOpponent"
    session.setOpponentClientId("opponent-client")

    // Simulate winning a multiplayer game
    session.setMyScore(1)
    session.setOpponentScore(0)

    MatchResultHelper.presentGameEnd(container, "nineball", true)

    expect(session.rematchInfo).to.not.be.undefined
    expect(session.rematchInfo?.opponentId).to.equal("opponent-client")
    expect(session.rematchInfo?.opponentName).to.equal("TestOpponent")

    const scores = Rematch.getOrderedScores(session)
    expect(scores.p1).to.equal(1) // Me (p1 because playerIndex is 0)
    expect(scores.p2).to.equal(0) // Them

    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.contain("Rematch")
    expect(notification?.innerHTML).to.contain("MATCH SCORE")
    expect(notification?.innerHTML).to.contain("TestPlayer 1 — 0 TestOpponent")
  })

  it("should update rematchInfo if it already exists", () => {
    const session = Session.getInstance()
    session.opponentName = "TestOpponent"
    session.setOpponentClientId("opponent-client")
    session.rematchInfo = {
      opponentId: "opponent-client",
      opponentName: "TestOpponent",
      ruleType: "nineball",
      lastScores: [
        { userId: "test-client", score: 1 },
        { userId: "opponent-client", score: 1 },
      ],
      nextTurnId: "test-client",
    }

    // Simulate losing a multiplayer game
    session.setMyScore(0)
    session.setOpponentScore(1)

    MatchResultHelper.presentGameEnd(container, "nineball", false)

    const scores = Rematch.getOrderedScores(session)
    expect(scores.p1).to.equal(1) // Me
    expect(scores.p2).to.equal(2) // Them (was 1, now +1)

    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.contain("MATCH SCORE")
    expect(notification?.innerHTML).to.contain("TestPlayer 1 — 2 TestOpponent")
  })

  it("should NOT show rematch button in bot mode", () => {
    Session.init("test-client", "TestPlayer", "test-table", false, true) // botMode = true
    const session = Session.getInstance()

    MatchResultHelper.presentGameEnd(container, "nineball", true)

    expect(session.rematchInfo).to.be.undefined
    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.not.contain("Rematch")
    expect(notification?.innerHTML).to.contain("New Game")
  })
})
