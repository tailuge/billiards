import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { End } from "../../src/controller/end"
import { PlayShot } from "../../src/controller/playshot"
import { WatchAim } from "../../src/controller/watchaim"
import { RuleFactory } from "../../src/controller/rules/rulefactory"
import { Libre } from "../../src/controller/rules/libre"
import { StartAimEvent } from "../../src/events/startaimevent"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { GameEvent } from "../../src/events/gameevent"
import { Outcome } from "../../src/model/outcome"
import { Session } from "../../src/network/client/session"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"

initDom()

describe("Libre", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "libre"

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
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  afterEach(() => {
    Session.reset()
  })

  const playShot = (outcomes: Outcome[]) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(...outcomes)
    container.processEvents()
  }

  it("is created by RuleFactory with the libre rulename", () => {
    const rules = RuleFactory.create(rule, container)
    expect(rules).to.be.an.instanceof(Libre)
    expect(rules.rulename).to.equal("libre")
  })

  it("has 3 balls and no pockets", () => {
    const rules = RuleFactory.create(rule, container)
    expect(rules.rack()).to.be.lengthOf(3)
    expect(rules.allowsPlaceBall()).to.be.false
    expect(rules.respot([])).to.be.empty
  })

  it("carom with no cushions keeps the break and returns Aim", () => {
    const balls = container.table.balls
    playShot([
      Outcome.collision(balls[0], balls[1], 1),
      Outcome.collision(balls[0], balls[2], 1),
    ])
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.rules.currentBreak).to.equal(1)
    expect(Session.getInstance().myScore()).to.equal(1)
    expect(broadcastEvents.some((e) => e instanceof StartAimEvent)).to.be.false
  })

  it("miss ends the inning and hands over to the opponent", () => {
    const balls = container.table.balls
    playShot([Outcome.collision(balls[0], balls[1], 1)])
    expect(container.controller).to.be.an.instanceof(WatchAim)
    expect(container.rules.currentBreak).to.equal(0)
    expect(Session.getInstance().myScore()).to.equal(0)
    expect(broadcastEvents.some((e) => e instanceof StartAimEvent)).to.be.true
  })

  it("single player miss switches to the other cue ball", () => {
    container.isSinglePlayer = true
    container.controller = new PlayShot(container)
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(Outcome.cushion(container.table.balls[1], 1))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.rules.cueball).to.equal(container.table.balls[1])
  })

  it("reaching the target ends the game immediately", () => {
    const balls = container.table.balls
    const target = Session.getInstance().getRaceTargetForPlayer("test-client")
    Session.getInstance().updateScoresFromNetwork(target - 1, 0, 0)
    playShot([
      Outcome.collision(balls[0], balls[1], 1),
      Outcome.collision(balls[0], balls[2], 1),
    ])
    expect(container.controller).to.be.an.instanceof(End)
  })

  it("isPartOfBreak is true only for a carom", () => {
    const rules = RuleFactory.create(rule, container)
    const balls = container.table.balls
    rules.cueball = balls[0]
    expect(
      rules.isPartOfBreak([
        Outcome.collision(balls[0], balls[1], 1),
        Outcome.collision(balls[0], balls[2], 1),
      ])
    ).to.be.true
    expect(rules.isPartOfBreak([Outcome.collision(balls[0], balls[1], 1)])).to
      .be.false
  })
})
