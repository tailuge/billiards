import { expect } from "chai"
import { Container } from "../../src/container/container"
import { initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { NineBall } from "../../src/controller/rules/nineball"
import { Snooker } from "../../src/controller/rules/snooker"
import { Session } from "../../src/network/client/session"
import { Outcome } from "../../src/model/outcome"
import { End } from "../../src/controller/end"
import { MatchResult } from "../../src/network/client/matchresult"
import { Ball, State } from "../../src/model/ball"
import { ScoreReporter } from "../../src/network/client/scorereporter"

initDom()

function createNineBallContainer(ruletype: string = "nineball"): Container {
  return new Container({
    element: undefined,
    log: (_) => {},
    assets: Assets.localAssets(ruletype),
    ruletype,
  })
}

function setupNineBallTable(container: Container): void {
  Ball.id = 0
  container.table.balls.forEach((b) => {
    if (b !== container.table.cueball && b.label !== 9) {
      b.state = State.InPocket
    }
  })
}

function getNineBallOutcome(container: Container): Outcome[] {
  const nineBall = container.table.balls.find((b) => b.label === 9)!
  return [
    Outcome.collision(container.table.cueball, nineBall, 1),
    Outcome.pot(nineBall, 1),
  ]
}

describe("MatchResult Construction", () => {
  let container: Container

  beforeEach(() => {
    Session.init("test-client", "TestPlayer", "test-table", false)
  })

  afterEach(() => {
    Session.reset()
  })

  it("NineBall should include Anon as winner if playername is empty", () => {
    Session.init("test-client", "", "test-table", false)
    container = createNineBallContainer()
    setupNineBallTable(container)

    const nineball = container.rules as NineBall
    const outcome = getNineBallOutcome(container)
    const endController = nineball.update(outcome) as End
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("Anon")
    expect(result.loser).to.be.undefined
    expect(result.loserScore).to.be.undefined
  })

  it("NineBall should include opponent if session.opponentName is present", () => {
    container = createNineBallContainer()
    const session = Session.getInstance()
    session.opponentName = "TestOpponent"
    setupNineBallTable(container)

    const nineball = container.rules as NineBall
    const outcome = getNineBallOutcome(container)
    const endController = nineball.update(outcome) as End
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("TestPlayer")
    expect(result.loser).to.equal("TestOpponent")
    expect(result.loserScore).to.equal(0)
  })

  it("NineBall should include replayData in MatchResult", () => {
    container = createNineBallContainer()
    container.scoreReporter = new ScoreReporter()
    setupNineBallTable(container)

    const nineball = container.rules as NineBall
    const outcome = getNineBallOutcome(container)
    const endController = nineball.update(outcome) as End
    endController.onFirst()
    const result = (endController as any).result as MatchResult

    expect(result.replayData).to.be.a("string")
    expect(result.replayData!.length).to.be.greaterThan(0)
  })

  it("NineBall should declare potter winner even if behind on points", () => {
    container = createNineBallContainer()
    const session = Session.getInstance()
    session.opponentName = "TestOpponent"
    container.setMyScore(2)
    container.setOpponentScore(8)
    setupNineBallTable(container)

    const nineball = container.rules as NineBall
    const outcome = getNineBallOutcome(container)
    const endController = nineball.update(outcome) as End
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("TestPlayer")
    expect(result.loser).to.equal("TestOpponent")
  })

  it("Snooker should include Anon as winner if playername is empty", () => {
    Session.init("test-client", "", "test-table", false)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets("snooker"),
      ruletype: "snooker",
    })
    container.scoreReporter = new ScoreReporter()
    const snooker = container.rules as Snooker
    container.setScoresFromNetwork(60, 0, 0)
    snooker.currentBreak = 10

    // Mock table is clear (only cueball remains)
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball) {
        b.state = State.InPocket
      }
    })

    // Snooker's continueBreak is called when a ball is potted and table is clear
    const endController = snooker.continueBreak() as End
    endController.onFirst()
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("Anon")
    expect(result.winnerScore).to.equal(60)
    expect(result.loser).to.be.undefined
    expect(result.replayData).to.be.a("string")
    expect(result.replayData!.length).to.be.greaterThan(0)
  })

  it("ThreeCushion should include replayData in MatchResult", () => {
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets("threecushion"),
      ruletype: "threecushion",
    })
    container.scoreReporter = new ScoreReporter()
    const threecushion = container.rules as any
    container.setScoresFromNetwork(10, 5, 0)

    const endController = threecushion.handleGameEnd(true) as End
    endController.onFirst()
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("TestPlayer")
    expect(result.winnerScore).to.equal(10)
    expect(result.replayData).to.be.a("string")
    expect(result.replayData!.length).to.be.greaterThan(0)
  })

  it("ThreeCushion should report correct winnerScore when player at index 1 wins", () => {
    const session = Session.getInstance()
    session.playerIndex = 1
    session.opponentName = "OpponentPlayer"
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets("threecushion"),
      ruletype: "threecushion",
    })
    container.scoreReporter = new ScoreReporter()
    const threecushion = container.rules as any
    container.setScoresFromNetwork(3, 7, 0)

    const endController = threecushion.handleGameEnd(true) as End
    endController.onFirst()
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("TestPlayer")
    expect(result.winnerScore).to.equal(7)
  })

  it("MatchResultHelper should show Lostber subtext in bot mode loss", () => {
    Session.init("test-client", "TestPlayer", "test-table", false, true)
    container = createNineBallContainer()
    const result = (container.rules as any).handleGameEnd(false)
    expect(result.name).to.equal("End")
    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.contain("Lostber 🦞")
    expect(notification?.innerHTML).to.contain("New Game")
  })

  it("MatchResultHelper should use newline separator for Match Score in subtext", () => {
    container = createNineBallContainer()
    const session = Session.getInstance()
    session.opponentName = "TestOpponent"
    session.opponentClientId = "test-opponent"
    session.rematchInfo = {
      opponentId: "test-opponent",
      opponentName: "TestOpponent",
      ruleType: "nineball",
      lastScores: [
        { userId: "test-client", score: 1 },
        { userId: "test-opponent", score: 0 },
      ],
      nextTurnId: "test-opponent",
    }
    setupNineBallTable(container)

    const nineball = container.rules as NineBall
    const outcome = getNineBallOutcome(container)
    const endController = nineball.update(outcome) as End
    endController.onFirst()

    const notification = document.getElementById("notification")
    const subtextElement = notification?.querySelector(".notification-subtext")
    expect(subtextElement?.textContent).to.contain("\nMatch Score:")
    expect(subtextElement?.textContent).to.not.contain(" | Match Score:")
  })
})
