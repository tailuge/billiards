import { expect as chaiExpect } from "chai"
const expect = globalThis.expect
import { HitEvent, Input } from "../../src/controller/controller"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { WatchAim } from "../../src/controller/watchaim"
import { PlayShot } from "../../src/controller/playshot"
import { End } from "../../src/controller/end"
import { AbortEvent } from "../../src/events/abortevent"
import { AimEvent } from "../../src/events/aimevent"
import { BeginEvent } from "../../src/events/beginevent"
import { WatchEvent } from "../../src/events/watchevent"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { GameEvent } from "../../src/events/gameevent"
import { WatchShot } from "../../src/controller/watchshot"
import { Outcome } from "../../src/model/outcome"
import { PlaceBall } from "../../src/controller/placeball"
import { ChatEvent } from "../../src/events/chatevent"
import { NotificationEvent } from "../../src/events/notificationevent"
import { ConcedeEvent } from "../../src/events/concedeevent"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { zero } from "../../src/utils/utils"
import { BreakEvent } from "../../src/events/breakevent"
import { RejoinEvent } from "../../src/events/rejoinevent"
import { initDom } from "../view/dom"
import { Ball, State } from "../../src/model/ball"
import { Assets } from "../../src/view/assets"
import { StartAimEvent } from "../../src/events/startaimevent"
import { Session } from "../../src/network/client/session"
import { Spectate } from "../../src/controller/spectate"
import { Init } from "../../src/controller/init"
import { ScoreEvent } from "../../src/events/scoreevent"
import { maxPower } from "../../src/model/physics/constants"

initDom()

describe("Controller", () => {
  let container: Container
  let broadcastEvents: GameEvent[]

  beforeEach(function (done) {
    Session.init("testId", "testPlayer", "testTable", false)
    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
    })
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    Ball.id = 0
    done()
  })

  it("Container animation loop ok", (done) => {
    container.animate(0)
    chaiExpect(container).to.be.not.null
    done()
  })

  it("Container chat enques message", (done) => {
    container.chat.sendClicked({})
    chaiExpect(broadcastEvents).to.be.lengthOf(1)
    done()
  })

  it("Init.onFirst shows 'Waiting for opponent to join' in 2P network mode", (done) => {
    Session.init("testId", "testPlayer", "testTable", false)
    container.isSinglePlayer = false
    const showSpy = jest.spyOn(container.notification, "show")

    container.controller.onFirst()

    expect(showSpy).toHaveBeenCalledWith(
      { type: "Info", title: "Waiting for opponent to join" },
      0
    )
    done()
  })

  it("Init.handleBegin does not clear notification if vsNotificationShown is true", (done) => {
    Session.getInstance().vsNotificationShown = true
    const clearSpy = jest.spyOn(container.notification, "clear")

    container.eventQueue.push(new BeginEvent())
    container.processEvents()

    expect(clearSpy).not.toHaveBeenCalled()
    done()
  })

  it("Begin takes Init to PlaceBall", (done) => {
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(PlaceBall)
    chaiExpect(broadcastEvents.pop()).to.be.an.instanceof(WatchEvent)
    chaiExpect(
      document.getElementById("p1Score")?.classList.contains("is-active")
    ).to.be.true
    chaiExpect(
      document.getElementById("p2Score")?.classList.contains("is-active")
    ).to.be.false
    done()
  })

  it("netEvent clears notification if vsNotificationShown is false", (done) => {
    const clearSpy = jest.spyOn(container.notification, "clear")
    const bc =
      new (require("../../src/container/browsercontainer").BrowserContainer)(
        null,
        new URLSearchParams()
      )
    bc.container = container

    bc.netEvent(JSON.stringify({ type: "BEGIN", clientId: "other" }))

    expect(clearSpy).toHaveBeenCalled()
    done()
  })

  it("netEvent shows VS notification in correct format once names are known", (done) => {
    const notifySpy = jest.spyOn(container, "notifyLocal")
    const bc =
      new (require("../../src/container/browsercontainer").BrowserContainer)(
        null,
        new URLSearchParams("ruletype=nineball")
      )
    bc.container = container
    bc.ruletype = "nineball"
    Session.init("myId", "Me", "table", false)

    bc.netEvent(
      JSON.stringify({
        type: "BEGIN",
        clientId: "other",
        playername: "Opponent",
      })
    )

    expect(notifySpy).toHaveBeenCalledWith({
      type: "Info",
      title: "nineball, Me vs Opponent",
      extra: undefined,
    })
    chaiExpect(Session.getInstance().vsNotificationShown).to.be.true
    done()
  })

  it("Begin takes Init to Spectate when session set", (done) => {
    Session.init("id", "player", "tableid", true)
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Spectate)
    Session.reset()
    done()
  })

  it("BreakEvent takes Init to Aim in practice mode with init param", (done) => {
    jest.spyOn(Session, "hasInitParam").mockReturnValue(true)
    Session.init("testId", "testPlayer", "testTable", false, false, true)

    container.eventQueue.push(new BreakEvent())
    container.processEvents()

    chaiExpect(container.controller).to.be.an.instanceof(Aim)

    // Cleanup
    jest.restoreAllMocks()
    Session.reset()
    done()
  })

  it("WatchEvent takes Init to WatchAim", (done) => {
    container.eventQueue.push(new WatchEvent(container.table.serialise()))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    chaiExpect(
      document.getElementById("p1Score")?.classList.contains("is-active")
    ).to.be.true
    chaiExpect(
      document.getElementById("p2Score")?.classList.contains("is-active")
    ).to.be.false
    done()
  })

  it("ScoreEvent active slot highlights corresponding HUD player", (done) => {
    container.controller = new WatchAim(container)
    container.eventQueue.push(new ScoreEvent(4, 2, 0, 1))
    container.processEvents()
    chaiExpect(
      document.getElementById("p1Score")?.classList.contains("is-active")
    ).to.be.true
    chaiExpect(
      document.getElementById("p2Score")?.classList.contains("is-active")
    ).to.be.false
    done()
  })

  it("HitEvent takes WatchAim to PlayShot", (done) => {
    container.controller = new WatchAim(container)
    container.eventQueue.push(new HitEvent(container.table.serialise()))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    done()
  })

  it("AimEvent takes WatchAim to WatchAim", (done) => {
    container.controller = new WatchAim(container)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("AimEvent updates aim input UI in WatchAim", (done) => {
    container.controller = new WatchAim(container)
    const powerSpy = jest.spyOn(
      container.table.cue.aimInputs,
      "updatePowerSlider"
    )
    const visualSpy = jest.spyOn(
      container.table.cue.aimInputs,
      "updateVisualState"
    )
    const aimEvent = new AimEvent()
    aimEvent.offset.x = 0.1
    aimEvent.offset.y = -0.15
    aimEvent.power = maxPower * 0.4
    aimEvent.pos.copy(container.table.cueball.pos)

    container.eventQueue.push(aimEvent)
    container.processEvents()

    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    chaiExpect(powerSpy.mock.calls).to.not.be.empty
    chaiExpect(visualSpy.mock.calls).to.not.be.empty
    const powerArgs = powerSpy.mock.calls[powerSpy.mock.calls.length - 1]
    const visualArgs = visualSpy.mock.calls[visualSpy.mock.calls.length - 1]
    chaiExpect(powerArgs[0]).to.be.approximately(0.4, 0.0001)
    chaiExpect(visualArgs[0]).to.be.approximately(0.1, 0.0001)
    chaiExpect(visualArgs[1]).to.be.approximately(-0.15, 0.0001)
    done()
  })

  it("RejoinEvent takes WatchAim to WatchAim", (done) => {
    container.controller = new WatchAim(container)
    container.eventQueue.push(new RejoinEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("HitEvent updates aim input UI before WatchShot transition", (done) => {
    container.controller = new WatchAim(container)
    const powerSpy = jest.spyOn(
      container.table.cue.aimInputs,
      "updatePowerSlider"
    )
    const visualSpy = jest.spyOn(
      container.table.cue.aimInputs,
      "updateVisualState"
    )

    const tablejson = container.table.serialise()
    tablejson.aim.offset.x = 0.05
    tablejson.aim.offset.y = -0.2
    tablejson.aim.power = maxPower * 0.25
    container.eventQueue.push(new HitEvent(tablejson))
    container.processEvents()

    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    chaiExpect(powerSpy.mock.calls).to.not.be.empty
    chaiExpect(visualSpy.mock.calls).to.not.be.empty
    const powerArgs = powerSpy.mock.calls[powerSpy.mock.calls.length - 1]
    const visualArgs = visualSpy.mock.calls[visualSpy.mock.calls.length - 1]
    chaiExpect(powerArgs[0]).to.be.approximately(0.25, 0.0001)
    chaiExpect(visualArgs[0]).to.be.approximately(0.05, 0.0001)
    chaiExpect(visualArgs[1]).to.be.approximately(-0.2, 0.0001)
    done()
  })

  it("StartAimEvent takes WatchShot to Aim when all stationary", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    container.eventQueue.push(new StartAimEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("WatchEvent takes WatchShot to WatchAim when all stationary", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    container.eventQueue.push(new WatchEvent(container.table.serialise()))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("WatchEvent rerack takes WatchShot to WatchShot", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    const state = container.table.serialise()
    const rerack = new WatchEvent({ ...state, rerack: true })
    container.eventQueue.push(rerack)
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    done()
  })

  it("AimEvent does not take WatchShot to Aim when not stationary", (done) => {
    container.controller = new WatchShot(container)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    done()
  })

  it("PlaceBall takes WatchShot to PlaceBall", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    container.eventQueue.push(new PlaceBallEvent(zero))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(PlaceBall)
    done()
  })

  it("AimEvent takes WatchShot to enqueued Aim after all stationary", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    container.eventQueue.push(new StartAimEvent())
    container.processEvents()
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("WatchEvent takes WatchShot to enqueued WatchAim after all stationary", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    container.eventQueue.push(new WatchEvent(container.table.serialise()))
    container.processEvents()
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("StationaryEvent takes WatchShot to WatchShot", (done) => {
    container.controller = new WatchShot(container)
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    done()
  })

  it("StationaryEvent takes active PlayShot to WatchAim if no pot", (done) => {
    container.isSinglePlayer = false
    container.controller = new PlayShot(container)
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("StationaryEvent takes active PlayShot to Aim if no pot singleplayer", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = true
    container.table.cueball.setStationary()
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    container.table.outcome.push(
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.cushion(ball1, 1)
    )
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("StationaryEvent takes active PlayShot to Aim if pot", (done) => {
    container.controller = new PlayShot(container)
    container.table.cueball.setStationary()
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    container.table.outcome.push(
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1)
    )
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("StationaryEvent takes active PlayShot to End if end of game", (done) => {
    container.controller = new PlayShot(container)
    container.table.balls.forEach((b) => (b.state = State.InPocket))
    container.table.cueball.setStationary()
    const ball9 = container.table.balls.find((b) => b.label === 9)!
    ball9.state = State.Stationary
    container.table.outcome.push(
      Outcome.collision(container.table.cueball, ball9, 1),
      Outcome.pot(ball9, 1)
    )
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    done()
  })

  it("StationaryEvent takes active PlayShot to PlaceBall if in off", (done) => {
    container.controller = new PlayShot(container)
    container.table.cueball.setStationary()
    container.table.cueball.state = State.InPocket
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(Outcome.pot(container.table.cueball, 1))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(PlaceBall)
    done()
  })

  it("PlaceBall moves to Aim if threecushion", (done) => {
    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })
    container.broadcast = (x) => broadcastEvents.push(x)
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(PlaceBall)
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("StationaryEvent takes active PlayShot to WatchAim if in off 2p", (done) => {
    container.isSinglePlayer = false
    container.controller = new PlayShot(container)
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(Outcome.pot(container.table.cueball, 1))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("End handles all events", (done) => {
    container.controller = new End(container)
    container.eventQueue.push(new AbortEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new HitEvent(container.table.serialise()))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new WatchEvent(container.table))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new ChatEvent("", ""))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new BreakEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new PlaceBallEvent(zero))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.inputQueue.push(new Input(0.1, "ArrowLeft"))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(Init)
    done()
  })

  it("Aim handles all inputs", (done) => {
    container.controller = new Aim(container)
    container.inputQueue.push(
      new Input(0.1, "A"),
      new Input(0.1, "ArrowLeft"),
      new Input(0.1, "ArrowRight"),
      new Input(0.1, "ShiftArrowLeft"),
      new Input(0.1, "ShiftArrowRight"),
      new Input(0.1, "ArrowUp"),
      new Input(0.1, "ArrowDown"),
      new Input(0.1, "Space"),
      new Input(0.1, "SpaceUp"),
      new Input(0.1, "KeyPUp"),
      new Input(0.1, "KeyHUp"),
      new Input(0.1, "KeyOUp"),
      new Input(0.1, "KeyDUp"),
      new Input(0.1, "NumpadAdd"),
      new Input(0.1, "NumpadSubtract"),
      new Input(0.1, "movementXUp"),
      new Input(0.1, "movementYUp")
    )

    let count = container.inputQueue.length
    while (count-- > 0) {
      container.processEvents()
    }
    chaiExpect(container.inputQueue.length).to.equal(0)
    done()
  })

  it("advance generates no event", (done) => {
    container.advance(0.1)
    chaiExpect(container.eventQueue.length).to.equal(0)
    done()
  })

  it("advance generates StationaryEvent at end of shot", (done) => {
    container.controller = new PlayShot(container)
    container.table.cueball.vel.x = 0.001
    container.advance(0.01)
    // BallTray adds entry on advance end if it was moving?
    // No, BallTray logic is in updateBreak which is called elsewhere.
    // However, StationaryEvent is only pushed if not stationary before.
    chaiExpect(container.eventQueue.length).to.equal(1)
    container.table.outcome.push(Outcome.pot(container.table.balls[1], 1))
    container.processEvents()
    container.advance(0.01)
    chaiExpect(container.eventQueue.length).to.equal(0) // Should be 0 after processEvents
    done()
  })

  it("ChatEvent handled with no change of state", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()
    container.eventQueue.push(new ChatEvent("", ""))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    done()
  })

  it("NotificationEvent handled with no change of state", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.halt()
    const showSpy = jest.spyOn(container.notification, "show")
    container.eventQueue.push(new NotificationEvent("test", 100))
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    chaiExpect(showSpy.mock.calls[0]).to.deep.equal(["test", 100])
    done()
  })

  it("ConcedeEvent handled with no change of state", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.eventQueue.push(new ConcedeEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(WatchShot)
    done()
  })

  it("ConcedeEvent transitions to End as winner", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.halt()
    container.eventQueue.push(new ConcedeEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    done()
  })

  it("End handles ConcedeEvent", (done) => {
    container.controller = new End(container)
    container.eventQueue.push(new ConcedeEvent())
    container.processEvents()
    chaiExpect(container.controller).to.be.an.instanceof(End)
    done()
  })
})
