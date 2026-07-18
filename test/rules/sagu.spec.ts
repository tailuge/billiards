import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { PlayShot } from "../../src/controller/playshot"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { Outcome } from "../../src/model/outcome"
import { RuleFactory } from "../../src/controller/rules/rulefactory"
import { WatchAim } from "../../src/controller/watchaim"
import { ThreeCushionConfig } from "../../src/utils/threecushionconfig"
import { End } from "../../src/controller/end"
import { initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Session } from "../../src/network/client/session"
import { Sagu } from "../../src/controller/rules/sagu"

initDom()

describe("Sagu", () => {
  let container: Container
  const rule = "sagu"

  beforeEach(function (done) {
    Session.init(
      "test-client",
      "TestPlayer",
      "test-table",
      false,
      false,
      false,
      true
    )
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: rule,
    })
    done()
  })

  afterEach(() => {
    Session.reset()
  })

  it("Sagu has 4 balls in the rack", (done) => {
    const rules = RuleFactory.create(rule, container)
    expect(rules.rack()).to.be.lengthOf(4)
    done()
  })

  it("Sagu has pocketless table geometry", (done) => {
    const rules = RuleFactory.create(rule, container)
    rules.tableGeometry()
    expect(TableGeometry.hasPockets).to.be.false
    done()
  })

  it("Sagu second player uses second cueball (Yellow, index 1)", (done) => {
    const rules = RuleFactory.create(rule, container)
    rules.secondToPlay()
    expect(rules.cueball).to.equal(container.table.balls[1])
    done()
  })

  it("Sagu standard successful shot (hitting both red balls, no foul) increments score and stays in Aim", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.balls[0].setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    // white ball P1 cueball (0) hits Red A (2) and Red B (3)
    container.table.outcome.push(
      Outcome.collision(balls[0], balls[2], 1),
      Outcome.collision(balls[0], balls[3], 1)
    )

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(Session.getInstance().myScore()).to.equal(1)
    done()
  })

  it("Sagu miss (hitting only one red ball) switches players and does not trigger foul notification", (done) => {
    const notifySpy = jest.spyOn(container, "notify")
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    container.table.outcome.push(Outcome.collision(balls[0], balls[2], 1))

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    expect(Session.getInstance().myScore()).to.equal(0)
    expect(notifySpy.mock.calls).to.have.lengthOf(0)
    done()
  })

  it("Sagu sub-cue foul (hitting opponent's cueball) triggers a foul notification and switches players", (done) => {
    const notifySpy = jest.spyOn(container, "notify")
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    // Hit Red A, Red B, AND opponent's cueball (Yellow, 1)
    container.table.outcome.push(
      Outcome.collision(balls[0], balls[2], 1),
      Outcome.collision(balls[0], balls[3], 1),
      Outcome.collision(balls[0], balls[1], 1)
    )

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    // No score increment because of the foul
    expect(Session.getInstance().myScore()).to.equal(0)
    expect(notifySpy.mock.calls).to.have.lengthOf(1)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "Foul: Contacted the opponent's cue ball!",
    })
    done()
  })

  it("Sagu no-hit foul triggers a foul notification and switches players", (done) => {
    const notifySpy = jest.spyOn(container, "notify")
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    // White cue ball hits only cushion
    container.table.outcome.push(Outcome.cushion(container.table.balls[0], 1))

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    expect(Session.getInstance().myScore()).to.equal(0)
    expect(notifySpy.mock.calls).to.have.lengthOf(1)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "Foul: No ball hit",
    })
    done()
  })

  it("Sagu final cushion shot - standard carom does NOT score when at raceTo - 1", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    // Set current player score to raceTo - 1 (e.g. 6 if raceTo is 7)
    Session.getInstance().setMyScore(ThreeCushionConfig.raceTo - 1)

    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    // Direct hit on Red A and Red B with no cushions hit first
    container.table.outcome.push(
      Outcome.collision(balls[0], balls[2], 1),
      Outcome.collision(balls[0], balls[3], 1)
    )

    container.processEvents()
    // Turn is passed because standard carom is not valid on the final shot
    expect(container.controller).to.be.an.instanceof(WatchAim)
    expect(Session.getInstance().myScore()).to.equal(
      ThreeCushionConfig.raceTo - 1
    )
    done()
  })

  it("Sagu final cushion shot - 3 cushions before second red ball scores and ends the game when at raceTo - 1", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    Session.getInstance().setMyScore(ThreeCushionConfig.raceTo - 1)

    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    // White hits Red A (2), 3 cushions, then Red B (3)
    container.table.outcome.push(
      Outcome.collision(balls[0], balls[2], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.collision(balls[0], balls[3], 1)
    )

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    expect(Session.getInstance().myScore()).to.equal(ThreeCushionConfig.raceTo)
    done()
  })

  it("Sagu foul subtracts 1 from the player's score but does not go below 0", (done) => {
    // 1. Initial score = 2
    Session.getInstance().setMyScore(2)
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    // Foul: hit opponent's cueball
    container.table.outcome.push(Outcome.collision(balls[0], balls[1], 1))

    container.processEvents()
    expect(Session.getInstance().myScore()).to.equal(1)

    // 2. Initial score = 0
    Session.getInstance().setMyScore(0)
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    container.table.outcome.push(Outcome.collision(balls[0], balls[1], 1))

    container.processEvents()
    expect(Session.getInstance().myScore()).to.equal(0)
    done()
  })

  it("Sagu HUD displays a ⭐ beside the score if a player is at raceTo - 1", (done) => {
    const session = Session.getInstance()
    session.opponentName = "Bot"

    // Set my score to 3, opponent score to raceTo - 1 (6)
    session.setMyScore(3)
    session.setOpponentScore(ThreeCushionConfig.raceTo - 1)

    const updateScoresSpy = jest.spyOn(container.hud, "updateScores")

    container.updateScoreHud(session.myScore(), session.opponentScore(), 0)

    expect(updateScoresSpy.mock.calls).to.have.lengthOf(1)
    expect(updateScoresSpy.mock.calls[0]).to.deep.equal([
      3,
      ThreeCushionConfig.raceTo - 1,
      "TestPlayer",
      "Bot",
      0,
      false,
      false,
      true, // p2Star should be true
    ])
    done()
  })

  describe("Sagu Handicap specific behaviors", () => {
    let getHandicapsSpy: jest.SpyInstance

    beforeEach(() => {
      getHandicapsSpy = jest.spyOn(Session.prototype, "getHandicaps")
    })

    afterEach(() => {
      getHandicapsSpy.mockRestore()
    })

    it("respects player specific target when evaluating final cushion shot condition", (done) => {
      getHandicapsSpy.mockReturnValue({
        "test-client": 4,
      })

      const session = Session.getInstance()
      session.opponentClientId = "opponent"

      // We are at myTarget - 1 = 3 points
      session.setMyScore(3)

      container.controller = new PlayShot(container)
      container.isSinglePlayer = false

      container.table.cueball.setStationary()
      container.eventQueue.push(new StationaryEvent())

      const balls = container.table.balls
      // Hitting both reds directly without 3 cushions should NOT qualify as successful shot at target - 1
      container.table.outcome.push(
        Outcome.collision(balls[0], balls[2], 1),
        Outcome.collision(balls[0], balls[3], 1)
      )

      container.processEvents()
      expect(container.controller).to.be.an.instanceof(WatchAim)
      expect(session.myScore()).to.equal(3)
      done()
    })

    it("evaluates dynamic star position on HUD score updates", (done) => {
      getHandicapsSpy.mockReturnValue({
        "test-client": 4,
        opponent: 15,
      })

      const session = Session.getInstance()
      session.opponentName = "Bot"
      session.opponentClientId = "opponent"

      // Player 1 at target - 1 = 3, Player 2 at target - 1 = 14
      session.setMyScore(3)
      session.setOpponentScore(14)

      const updateScoresSpy = jest.spyOn(container.hud, "updateScores")
      container.updateScoreHud(3, 14, 0)

      expect(
        updateScoresSpy.mock.calls[updateScoresSpy.mock.calls.length - 1]
      ).to.deep.equal([
        3,
        14,
        "TestPlayer(4)",
        "Bot(15)",
        0,
        false,
        true, // p1Star
        true, // p2Star
      ])
      done()
    })
  })

  describe("Sagu local single-player and Bot final-point validations", () => {
    it("Sagu single player - White cueball successful shot increments myScore", (done) => {
      container.isSinglePlayer = true
      const rules = container.rules as Sagu
      rules.cueball = container.table.balls[0] // White
      container.controller = new PlayShot(container)
      container.table.balls[0].setStationary()
      container.eventQueue.push(new StationaryEvent())

      const balls = container.table.balls
      container.table.outcome.push(
        Outcome.collision(balls[0], balls[2], 1),
        Outcome.collision(balls[0], balls[3], 1)
      )

      container.processEvents()
      expect(Session.getInstance().myScore()).to.equal(1)
      expect(Session.getInstance().opponentScore()).to.equal(0)
      expect(container.inferActivePlayer()).to.equal(1) // P1 highlighted
      done()
    })

    it("Sagu single player - Yellow cueball successful shot increments myScore (combined total)", (done) => {
      container.isSinglePlayer = true
      const rules = container.rules as Sagu
      rules.cueball = container.table.balls[1] // Yellow (P2)
      container.table.cueball = container.table.balls[1]
      container.controller = new PlayShot(container)
      container.table.balls[1].setStationary()
      container.eventQueue.push(new StationaryEvent())

      const balls = container.table.balls
      container.table.outcome.push(
        Outcome.collision(balls[1], balls[2], 1),
        Outcome.collision(balls[1], balls[3], 1)
      )

      container.processEvents()
      expect(Session.getInstance().myScore()).to.equal(1)
      expect(Session.getInstance().opponentScore()).to.equal(0)
      expect(container.inferActivePlayer()).to.equal(1) // P1 highlighted
      done()
    })

    it("Sagu bot mode - final cushion shot validation checks actual shooter score and target", (done) => {
      // Setup BOT mode
      Session.init(
        "human-client",
        "Lukey",
        "test-table",
        false,
        true, // botMode = true
        false,
        true
      )
      // Reinstate container to pick up Bot Mode from Session
      container = new Container({
        element: undefined,
        log: (_) => {},
        assets: Assets.localAssets(),
        ruletype: rule,
        isSinglePlayer: false,
      })

      const session = Session.getInstance()
      session.opponentClientId = "bot"
      session.opponentName = "Claw"

      const humanTarget = session.getRaceTargetForPlayer("human-client") // e.g. 7
      const botTarget = session.getRaceTargetForPlayer("bot") // e.g. 7

      // 1. Human at match point, bot at 3.
      // Human shoots (White cueball). Human MUST play a 3-cushion shot to score.
      session.setMyScore(humanTarget - 1)
      session.setOpponentScore(3)

      const rules = container.rules as Sagu
      rules.cueball = container.table.balls[0] // Human cueball (White)

      // Direct hit without 3-cushions should fail
      const outcome1 = [
        Outcome.collision(container.table.balls[0], container.table.balls[2], 1),
        Outcome.collision(container.table.balls[0], container.table.balls[3], 1),
      ]
      expect(rules.isSuccessfulShot(outcome1)).to.be.false

      // 3-cushions should succeed
      const outcome2 = [
        Outcome.collision(container.table.balls[0], container.table.balls[2], 1),
        Outcome.cushion(container.table.balls[0], 1),
        Outcome.cushion(container.table.balls[0], 1),
        Outcome.cushion(container.table.balls[0], 1),
        Outcome.collision(container.table.balls[0], container.table.balls[3], 1),
      ]
      expect(rules.isSuccessfulShot(outcome2)).to.be.true

      // 2. Human at 3, Bot at match point.
      // Bot shoots (Yellow cueball). Bot MUST play a 3-cushion shot to score.
      session.setMyScore(3)
      session.setOpponentScore(botTarget - 1)
      rules.cueball = container.table.balls[1] // Bot cueball (Yellow)

      // Bot direct hit should fail
      const outcome3 = [
        Outcome.collision(container.table.balls[1], container.table.balls[2], 1),
        Outcome.collision(container.table.balls[1], container.table.balls[3], 1),
      ]
      expect(rules.isSuccessfulShot(outcome3)).to.be.false

      // Bot 3-cushions should succeed
      const outcome4 = [
        Outcome.collision(container.table.balls[1], container.table.balls[2], 1),
        Outcome.cushion(container.table.balls[1], 1),
        Outcome.cushion(container.table.balls[1], 1),
        Outcome.cushion(container.table.balls[1], 1),
        Outcome.collision(container.table.balls[1], container.table.balls[3], 1),
      ]
      expect(rules.isSuccessfulShot(outcome4)).to.be.true

      done()
    })
  })
})
