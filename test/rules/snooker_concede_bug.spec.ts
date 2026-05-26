import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"
import { Snooker } from "../../src/controller/rules/snooker"

describe("Snooker Concession", () => {
  let container: Container

  beforeEach(() => {
    // Setup a 2-player session: Player 1 (me) and Player 2 (opponent)
    const p1ClientId = "p1"
    const p2ClientId = "p2"
    Session.init(p1ClientId, "Player1", "table-id", false)
    const session = Session.getInstance()
    session.opponentName = "Player2"
    session.setOpponentClientId(p2ClientId)
    session.setScoreByClientId(p1ClientId, 50)
    session.setScoreByClientId(p2ClientId, 30)

    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    container.isSinglePlayer = false
  })

  it("Player 1 concedes while losing, Player 2 should be winner", () => {
    // Setup: Player 1 (me) has 20, Player 2 (opponent) has 50
    const session = Session.getInstance()
    session.setMyScore(20)
    session.setOpponentScore(50)

    const snookerRules = new Snooker(container)
    const endController = snookerRules.handleGameEnd(false, "opponent conceded")

    expect(endController.name).to.equal("End")

    const result = (endController as any).result
    expect(result.winner).to.equal("Player2")
  })

  it("Player 1 concedes while leading, Player 2 should be winner", () => {
    // Setup: Player 1 (me) has 50, Player 2 (opponent) has 30
    const session = Session.getInstance()
    session.setMyScore(50)
    session.setOpponentScore(30)

    const snookerRules = new Snooker(container)
    const endController = snookerRules.handleGameEnd(false, "opponent conceded")

    expect(endController.name).to.equal("End")

    const result = (endController as any).result
    expect(result.winner).to.equal("Player2")
  })

  afterEach(() => {
    Session.reset()
  })
})
