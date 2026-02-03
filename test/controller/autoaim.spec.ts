import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { WatchShot } from "../../src/controller/watchshot"
import { Ball } from "../../src/model/ball"
import { Assets } from "../../src/view/assets"
import { StartAimEvent } from "../../src/events/startaimevent"
import { Session } from "../../src/network/client/session"
import { initDom } from "../view/dom"
import { PlaceBall } from "../../src/controller/placeball"
import { Input } from "../../src/events/input"

initDom()

describe("Auto Aim", () => {
  let container: Container

  beforeEach(function (done) {
    Session.init("testId", "testPlayer", "testTable", false)
    container = new Container(
      document.getElementById("viewP1"),
      (_) => {},
      Assets.localAssets(),
      "nineball"
    )
    Ball.id = 0
    done()
  })

  it("WatchShot to Aim via StartAimEvent should auto-aim", (done) => {
    const watchShot = new WatchShot(container)
    container.controller = watchShot
    container.table.cueball.setStationary()

    // Set cue angle to something else
    container.table.cue.aim.angle = Math.PI / 2

    container.eventQueue.push(new StartAimEvent())
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    // The 1-ball is at (tableX/2, 0) and cueball is at (-X/2, 0)
    // So nextCandidateBall (ball 1) should result in angle ~0
    expect(container.table.cue.aim.angle).to.be.closeTo(0, 0.1)
    done()
  })

  it("PlaceBall.placed should auto-aim", (done) => {
    const placeBall = new PlaceBall(container)
    container.controller = placeBall

    // Set cue angle to something else
    container.table.cue.aim.angle = Math.PI / 2

    // Simulate placing the ball (SpaceUp)
    container.inputQueue.push(new Input(0, "SpaceUp"))
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.table.cue.aim.angle).to.be.closeTo(0, 0.1)
    done()
  })
})
