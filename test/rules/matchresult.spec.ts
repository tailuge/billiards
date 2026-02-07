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
import { State } from "../../src/model/ball"
import { ScoreReporter } from "../../src/network/client/scorereporter"

initDom()

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
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets("nineball"),
      "nineball"
    )
    const nineball = container.rules as NineBall
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 9) {
        b.state = State.InPocket
      }
    })

    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome: Outcome[] = [
      Outcome.collision(container.table.cueball, nineBall, 1),
      Outcome.pot(nineBall, 1),
    ]
    // Simulate potting the last ball (which in NineBall logic leads to end of game if only cueball remains)
    const endController = nineball.update(outcome) as End
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("Anon")
    expect(result.loser).to.be.undefined
    expect(result.loserScore).to.be.undefined
  })

  it("NineBall should include opponent if session.opponentName is present", () => {
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets("nineball"),
      "nineball"
    )
    const session = Session.getInstance()
    session.opponentName = "TestOpponent"
    const nineball = container.rules as NineBall
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 9) {
        b.state = State.InPocket
      }
    })

    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome: Outcome[] = [
      Outcome.collision(container.table.cueball, nineBall, 1),
      Outcome.pot(nineBall, 1),
    ]
    const endController = nineball.update(outcome) as End
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("TestPlayer")
    expect(result.loser).to.equal("TestOpponent")
    expect(result.loserScore).to.equal(0)
  })

  it("NineBall should include replayData in MatchResult", () => {
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets("nineball"),
      "nineball"
    )
    container.scoreReporter = new ScoreReporter()
    const nineball = container.rules as NineBall
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 9) {
        b.state = State.InPocket
      }
    })

    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome: Outcome[] = [
      Outcome.collision(container.table.cueball, nineBall, 1),
      Outcome.pot(nineBall, 1),
    ]
    const endController = nineball.update(outcome) as End
    endController.onFirst()
    const result = (endController as any).result as MatchResult

    expect(result.replayData).to.be.a("string")
    expect(result.replayData!.length).to.be.greaterThan(0)
  })

  it("Snooker should include Anon as winner if playername is empty", () => {
    Session.init("test-client", "", "test-table", false)
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets("snooker"),
      "snooker"
    )
    container.scoreReporter = new ScoreReporter()
    const snooker = container.rules as Snooker
    container.scores = [60, 0]
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
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets("threecushion"),
      "threecushion"
    )
    container.scoreReporter = new ScoreReporter()
    const threecushion = container.rules as any
    container.scores = [10, 5]

    const endController = threecushion.handleGameEnd(true) as End
    endController.onFirst()
    const result = (endController as any).result as MatchResult

    expect(result.winner).to.equal("TestPlayer")
    expect(result.winnerScore).to.equal(10)
    expect(result.replayData).to.be.a("string")
    expect(result.replayData!.length).to.be.greaterThan(0)
  })
})
