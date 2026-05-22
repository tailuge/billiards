import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"
import { Snooker } from "../../src/controller/rules/snooker"
import { ConcedeEvent } from "../../src/events/concedeevent"

describe("Snooker Concession", () => {
  let container: Container

  beforeEach(() => {
    // Setup a 2-player session: Player 1 (me) and Player 2 (opponent)
    Session.init("p1", "Player1", "table-id", false)
    Session.getInstance().opponentName = "Player2"
    Session.getInstance().p1Score = 50
    Session.getInstance().p2Score = 30

    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    container.isSinglePlayer = false
  })

  it.skip("Player 1 concedes while losing, Player 2 should be winner", () => {
    // Setup: Player 1 (me) has 20, Player 2 (opponent) has 50
    Session.getInstance().p1Score = 20
    Session.getInstance().p2Score = 50

    const snookerRules = new Snooker(container)
    const endController = snookerRules.handleGameEnd(false, "opponent conceded")
    
    expect(endController.name).to.equal("End")
    
    const result = (endController as any).result
    expect(result.winner).to.equal("Player2")
  })

  it.skip("Player 1 concedes while leading, Player 2 should be winner", () => {
    // Setup: Player 1 (me) has 50, Player 2 (opponent) has 30
    Session.getInstance().p1Score = 50
    Session.getInstance().p2Score = 30

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
