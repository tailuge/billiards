import { expect } from "chai"
import { Vector3 } from "three"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { NineBall } from "../../src/controller/rules/nineball"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { PlaceBall } from "../../src/controller/placeball"
import { Aim } from "../../src/controller/aim"
import { WatchAim } from "../../src/controller/watchaim"
import { End } from "../../src/controller/end"
import { Session } from "../../src/network/client/session"
import { RerackEvent } from "../../src/events/rerackevent"

initDom()

function setupEndGameTable(container: Container): void {
  container.table.balls.forEach((b) => {
    if (b !== container.table.cueball && b.label !== 9) {
      b.state = State.InPocket
    }
  })
}

function getEndGameOutcome(container: Container): Outcome[] {
  const nineBall = container.table.balls.find((b) => b.label === 9)!
  return [
    Outcome.collision(container.table.cueball, nineBall, 1),
    Outcome.pot(nineBall, 1),
  ]
}

function initNineBall(practiceMode = false): {
  container: Container
  nineball: NineBall
} {
  Ball.id = 0
  Session.reset()
  Session.init(
    "test-client",
    "TestPlayer",
    "test-table",
    false,
    false,
    practiceMode
  )
  const container = new Container({
    element: undefined,
    log: (_: any) => {},
    assets: Assets.localAssets(),
    ruletype: "nineball",
  })
  const nineball = container.rules as NineBall
  return { container, nineball }
}

describe("NineBall Rules", () => {
  let container: Container
  let nineball: NineBall

  beforeEach(() => {
    ;({ container, nineball } = initNineBall())
  })

  afterEach(() => {
    Session.reset()
  })

  it("should be nineball", () => {
    expect(nineball.rulename).to.equal("nineball")
    expect(container.table.balls).to.have.length(10) // Cue ball + 9 balls
  })

  it("should detect cue ball potted as foul", () => {
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    const nextController = nineball.update(outcome)

    if (container.isSinglePlayer) {
      expect(nextController).to.be.an.instanceof(PlaceBall)
    } else {
      expect(nextController).to.be.an.instanceof(WatchAim)
    }
  })

  it("should continue turn if a ball is potted legally", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1),
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should end game if 9-ball is potted legally", () => {
    setupEndGameTable(container)
    const outcome = getEndGameOutcome(container)
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
  })

  it("should detect foul if no ball is hit", () => {
    const outcome: Outcome[] = [] // Empty outcome means no collisions, no pots, no cushions
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should detect foul if wrong ball is hit first", () => {
    const ball2 = container.table.balls.find((b) => b.label === 2)!
    const outcome = [Outcome.collision(container.table.cueball, ball2, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should detect foul if no cushion is hit after contact and no ball potted", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should be legal if cushion is hit after contact", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.cushion(ball1, 1),
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should respot 9-ball if potted on foul", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]

    // Before: 9-ball is on table (in this test we just care it's not InPocket)
    nineBall.state = State.Stationary

    nineball.update(outcome)

    // After: 9-ball should be Stationary (respotted)
    expect(nineBall.state).to.equal(State.Stationary)
  })

  it("should send RerackEvent and PlaceBallEvent when 9-ball is respotted in multiplayer", () => {
    container.isSinglePlayer = false
    const sentEvents: any[] = []
    container.broadcast = (event) => {
      sentEvents.push(event)
    }

    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]

    nineball.update(outcome)

    const rerackEvents = sentEvents.filter((e) => e instanceof RerackEvent)
    expect(rerackEvents).to.have.length(1)
    const rerack = rerackEvents[0]
    expect(rerack.ballinfo.balls).to.have.length(1)
    expect(rerack.ballinfo.balls[0].id).to.equal(nineBall.id)

    const placeBallEvents = sentEvents.filter(
      (e) => e instanceof PlaceBallEvent
    )
    expect(placeBallEvents).to.have.length(1)
  })

  it("should return WatchAim on foul in multi-player", () => {
    container.isSinglePlayer = false
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(WatchAim)
  })

  it("should not end game if 9-ball is potted on foul", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]
    expect(nineball.isEndOfGame(outcome)).to.be.false
  })

  it("should end game if 9-ball is potted legally (isEndOfGame check)", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(nineBall, 1),
    ]
    expect(nineball.isEndOfGame(outcome)).to.be.true
  })

  it("should trigger specific foul notification on cue ball potted", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "Cue ball potted",
      extra: "Ball in hand",
    })
  })

  it("should trigger specific foul notification on no ball hit", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const outcome: Outcome[] = []
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "No ball hit",
      extra: "Ball in hand",
    })
  })

  it("should trigger specific foul notification on wrong ball hit first", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const ball2 = container.table.balls.find((b) => b.label === 2)!
    const outcome = [Outcome.collision(container.table.cueball, ball2, 1)]
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "Wrong ball hit first",
      extra: "Ball in hand",
    })
  })

  it("should trigger specific foul notification on no cushion after contact", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "No cushion after contact",
      extra: "Ball in hand",
    })
  })

  it("should trigger game over notification", () => {
    container.isSinglePlayer = true
    const notifySpy = jest.spyOn(container, "notifyLocal")
    setupEndGameTable(container)
    const outcome = getEndGameOutcome(container)
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "GameOver",
      title: "YOU WON",
      subtext: "Score: 1",
      matchScore: undefined,
      extra: `<button data-notification-action="reload">New Game</button><button data-notification-action="lobby">Lobby</button>`,
      icon: "🏆",
      extraClass: "is-winner",
      duration: 0,
    })
  })

  it("should trigger game over notification with only lobby button in 2-player mode", () => {
    container.isSinglePlayer = false
    const notifySpy = jest.spyOn(container, "notifyLocal")
    setupEndGameTable(container)
    const outcome = getEndGameOutcome(container)
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "GameOver",
      title: "YOU WON",
      subtext: "TestPlayer 1 - 0 Opponent",
      matchScore: `<div class="match-score-container">
        <div class="match-score-label">MATCH SCORE</div>
        <div class="match-score-value">TestPlayer 1 — 0 Player 2</div>
      </div>`,
      extra: `<button data-notification-action="rematch">Rematch</button><button data-notification-action="lobby">Lobby</button>`,
      icon: "🏆",
      extraClass: "is-winner",
      duration: 0,
    })
  })

  it("should trigger game over notification (duplicate check)", () => {
    container.isSinglePlayer = true
    const notifySpy = jest.spyOn(container, "notifyLocal")
    setupEndGameTable(container)
    const outcome = getEndGameOutcome(container)
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "GameOver",
      title: "YOU WON",
      subtext: "Score: 1",
      matchScore: undefined,
      extra: `<button data-notification-action="reload">New Game</button><button data-notification-action="lobby">Lobby</button>`,
      icon: "🏆",
      extraClass: "is-winner",
      duration: 0,
    })
  })

  it("NineBall.handleFoul should record respot in single-player", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]

    nineball.update(outcome)

    const shots = container.recorder.shots
    // Shot (N-2): HIT (not in this direct update test, but usually there)
    // Shot (N-1): RERACK
    // Shot (N): PLACEBALL

    const lastShot = shots[shots.length - 1]
    expect(lastShot).to.be.an.instanceof(PlaceBallEvent)

    const rerackShot = shots[shots.length - 2]
    expect(rerackShot).to.be.an.instanceof(RerackEvent)
    const rerack = rerackShot as RerackEvent
    expect(rerack.ballinfo.balls).to.have.length(1)
    expect(rerack.ballinfo.balls[0].id).to.equal(nineBall.id)
  })

  it("should cover placeBall and other methods", () => {
    const pos = nineball.placeBall()
    expect(pos.x).to.be.below(0)

    const target = new Vector3(1000, 1000, 0)
    const clamped = nineball.placeBall(target)
    expect(clamped.x).to.be.lessThan(1000)
    expect(clamped.y).to.be.lessThan(1000)

    expect(nineball.asset()).to.equal("models/p8.min.gltf")
    expect(nineball.otherPlayersCueBall()).to.equal(container.table.cueball)
    nineball.secondToPlay() // Should not throw
    expect(nineball.allowsPlaceBall()).to.be.true
    expect(nineball.isPartOfBreak([])).to.be.false
  })

  describe("Practice Mode", () => {
    beforeEach(() => {
      ;({ container, nineball } = initNineBall(true))
    })

    it("should allow hitting any ball 1-8 first", () => {
      const ball2 = container.table.balls.find((b) => b.label === 2)!
      const outcome = [
        Outcome.collision(container.table.cueball, ball2, 1),
        Outcome.cushion(ball2, 1),
      ]
      const nextController = nineball.update(outcome)
      // Legal in practice mode (Aim), whereas standard mode would return PlaceBall
      expect(nextController).to.be.an.instanceof(Aim)
    })

    it("should still foul if 9-ball hit first while other balls remain", () => {
      const nineBall = container.table.balls.find((b) => b.label === 9)!
      const outcome = [Outcome.collision(container.table.cueball, nineBall, 1)]
      const nextController = nineball.update(outcome)
      expect(nextController).to.be.an.instanceof(PlaceBall)
      const reason = NineBall.foulReason(container.table, outcome)
      expect(reason).to.equal("Wrong ball hit first")
    })

    it("should not end game if 9-ball is potted early", () => {
      const ball1 = container.table.balls.find((b) => b.label === 1)!
      const nineBall = container.table.balls.find((b) => b.label === 9)!
      const outcome = [
        Outcome.collision(container.table.cueball, ball1, 1),
        Outcome.pot(nineBall, 1),
      ]
      expect(nineball.isEndOfGame(outcome)).to.be.false
    })

    it("should respot 9-ball if potted early on a legal shot", () => {
      const ball1 = container.table.balls.find((b) => b.label === 1)!
      const nineBall = container.table.balls.find((b) => b.label === 9)!
      const outcome = [
        Outcome.collision(container.table.cueball, ball1, 1),
        Outcome.pot(nineBall, 1),
      ]

      const sentEvents: any[] = []
      container.broadcast = (event) => {
        sentEvents.push(event)
      }

      const nextController = nineball.update(outcome)
      expect(nextController).to.be.an.instanceof(Aim)
      expect(nineBall.state).to.equal(State.Stationary)
      const rerackEvents = sentEvents.filter((e) => e instanceof RerackEvent)
      expect(rerackEvents).to.have.length(1)
    })

    it("should end game if 9-ball is potted last", () => {
      setupEndGameTable(container)
      const outcome = getEndGameOutcome(container)
      expect(nineball.isEndOfGame(outcome)).to.be.true
    })
  })
})
