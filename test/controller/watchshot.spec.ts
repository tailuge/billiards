import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { WatchShot } from "../../src/controller/watchshot"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { WatchEvent } from "../../src/events/watchevent"
import { Vector3 } from "three"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Session } from "../../src/network/client/session"
import { Outcome } from "../../src/model/outcome"
import { ScoreEvent } from "../../src/events/scoreevent"

initDom()

describe("WatchShot Controller", () => {
  let container: Container

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })
    container.isSinglePlayer = false
  })

  it("should update ball state from PlaceBallEvent", () => {
    const ball = container.table.balls[0]
    ball.state = State.InPocket
    ball.pos.set(100, 100, 0)

    const watchShot = new WatchShot(container)

    const newPos = new Vector3(0, 0, 0)
    const event = new PlaceBallEvent(new Vector3(10, 0, 0), {
      id: ball.id,
      pos: newPos,
    })

    watchShot.handlePlaceBall(event)

    expect(ball.pos.x).to.equal(0)
    expect(ball.pos.y).to.equal(0)
    expect(ball.state).to.equal(State.Stationary)
  })

  it("should update ball state from WatchEvent (Snooker Respot)", () => {
    const ball = container.table.balls[0]
    ball.state = State.InPocket
    ball.pos.set(100, 100, 0)

    const watchShot = new WatchShot(container)

    const newPos = new Vector3(0, 0, 0)
    const event = new WatchEvent({
      balls: [{ id: ball.id, pos: newPos }],
      rerack: true,
    })

    watchShot.handleWatch(event)

    expect(ball.pos.x).to.equal(0)
    expect(ball.pos.y).to.equal(0)
    expect(ball.state).to.equal(State.Stationary)
  })

  describe("Snooker final ball potted and score tracking in WatchShot", () => {
    let snookerContainer: Container

    beforeEach(() => {
      Ball.id = 0
      Session.init("test-client-snooker", "TestPlayer", "test-table", false)
      const session = Session.getInstance()
      session.playerIndex = 1 // playerIndex 1 means opponent is Player 1 (p1), we are Player 2 (p2)
      session.opponentName = "OpponentPlayer"
      session.setOpponentClientId("test-opponent")

      snookerContainer = new Container({
        element: undefined,
        log: (_) => {},
        assets: Assets.localAssets("snooker"),
        ruletype: "snooker",
      })
      snookerContainer.isSinglePlayer = false
    })

    it("should update opponent's score when the final black is potted if ScoreEvent has not been received", () => {
      const session = Session.getInstance()
      session.initializeScores()
      session.setMyScore(50)
      session.setOpponentScore(100)

      const watchShot = new WatchShot(snookerContainer)

      // Set the outcome of the shot to be a pot of the black ball (id = 6)
      // black is worth 7 points in snooker (id + 1)
      const blackBall = snookerContainer.table.balls.find((b) => b.id === 6)!
      blackBall.state = State.InPocket
      snookerContainer.table.outcome = [Outcome.pot(blackBall, 1.0, 0)]

      // Clear all other balls so isEndOfGame returns true
      snookerContainer.table.balls.forEach((b) => {
        if (b.id !== 0) {
          b.state = State.InPocket
        }
      })

      watchShot.handleStationary(null as any)

      // The opponent's score should have been increased by 7 points (100 -> 107)
      expect(session.opponentScore()).to.equal(107)
    })

    it("should NOT double-count the final potted ball if ScoreEvent was already received", () => {
      const session = Session.getInstance()
      session.initializeScores()
      session.setMyScore(50)
      session.setOpponentScore(107) // Already updated to include the black ball's 7 points

      const watchShot = new WatchShot(snookerContainer)

      // Simulate receiving ScoreEvent first (which sets scoreEventReceived to true)
      const scoreEvent = new ScoreEvent(107, 50, 0, 1)
      watchShot.handleScore(scoreEvent)

      const blackBall = snookerContainer.table.balls.find((b) => b.id === 6)!
      blackBall.state = State.InPocket
      snookerContainer.table.outcome = [Outcome.pot(blackBall, 1.0, 0)]

      // Clear all other balls so isEndOfGame returns true
      snookerContainer.table.balls.forEach((b) => {
        if (b.id !== 0) {
          b.state = State.InPocket
        }
      })

      watchShot.handleStationary(null as any)

      // The opponent's score should remain 107, not increased to 114
      expect(session.opponentScore()).to.equal(107)
    })
  })
})
