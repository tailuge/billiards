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

  it("Sagu miss (hitting only one red ball) switches players", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    const balls = container.table.balls
    container.table.outcome.push(Outcome.collision(balls[0], balls[2], 1))

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    expect(Session.getInstance().myScore()).to.equal(0)
    done()
  })

  it("Sagu sub-cue foul (hitting opponent's cueball) is a foul and switches players", (done) => {
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
    done()
  })

  it("Sagu no-hit foul switches players", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())

    // White cue ball hits only cushion
    container.table.outcome.push(Outcome.cushion(container.table.balls[0], 1))

    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    expect(Session.getInstance().myScore()).to.equal(0)
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
    expect(Session.getInstance().myScore()).to.equal(ThreeCushionConfig.raceTo - 1)
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
})
