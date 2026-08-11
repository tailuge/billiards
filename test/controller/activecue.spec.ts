import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Session } from "../../src/network/client/session"
import { Aim } from "../../src/controller/aim"
import { WatchAim } from "../../src/controller/watchaim"
import { PlaceBall } from "../../src/controller/placeball"
import { PlayShot } from "../../src/controller/playshot"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"

initDom()

describe("Active cue visibility", () => {
  let container: Container

  beforeEach(() => {
    Session.init("testId", "testPlayer", "testTable", false)
    Ball.id = 0
    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
    })
  })

  afterEach(() => {
    Session.reset()
  })

  it("starts with p1 visible and p2 hidden", () => {
    expect(container.table.cue.p1.visible).to.be.true
    expect(container.table.cue.p2.visible).to.be.false
  })

  it("shows p1 while aiming and p2 while watching the opponent aim", () => {
    container.updateController(new Aim(container))
    expect(container.table.cue.p1.visible).to.be.true
    expect(container.table.cue.p2.visible).to.be.false
    container.updateController(new WatchAim(container))
    expect(container.table.cue.p1.visible).to.be.false
    expect(container.table.cue.p2.visible).to.be.true
  })

  it("shows p1 through PlaceBall and PlayShot as well", () => {
    container.updateController(new PlaceBall(container))
    expect(container.table.cue.p1.visible).to.be.true
    container.updateController(new PlayShot(container))
    expect(container.table.cue.p1.visible).to.be.true
    expect(container.table.cue.p2.visible).to.be.false
  })

  it("playerIndex does not change which cue shows: p1 is always mine", () => {
    Session.getInstance().playerIndex = 1
    container.updateController(new Aim(container))
    expect(container.table.cue.p1.visible).to.be.true
    expect(container.table.cue.p2.visible).to.be.false
    container.updateController(new WatchAim(container))
    expect(container.table.cue.p1.visible).to.be.false
    expect(container.table.cue.p2.visible).to.be.true
  })

  it("table builds p1 from customParams and p2 from opponentParams, whatever the playerIndex", () => {
    Session.getInstance().customParams = { "cue.buttColour": "#ff0000" }
    Session.getInstance().opponentParams = { "cue.buttColour": "#00ff00" }
    Session.getInstance().playerIndex = 1
    const table = new Table([new Ball(new Vector3())])
    expect(table.cue.p1.visible).to.be.true
    expect(table.cue.p2.visible).to.be.false
    expect(table.cue.cues[0].cueBody.children.length).to.be.greaterThan(0)
    expect(table.cue.cues[1].cueBody.children.length).to.be.greaterThan(0)
  })
})
