import "mocha"
import { expect } from "chai"
import { HitEvent } from "../../src/controller/controller"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"
import { Init } from "../../src/controller/init"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Vector3 } from "three"
import { R } from "../../src/model/physics/constants"
import { norm, round, roundVec } from "../../src/utils/utils"
import { Assets } from "../../src/view/assets"

initDom()

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("Controller", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  let stepx: number
  let stepy: number
  const replayUrl = "?ruletype=threecushion&state="
  beforeEach(function (done) {
    container = new Container(
      document.getElementById("viewP1"),
      () => {},
      Assets.localAssets("threecushion"),
      "threecushion"
    )
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    stepx = TableGeometry.X / 4
    stepy = TableGeometry.Y / 2
    container.table.balls[1].pos.x -= 1.5 * stepx
    container.table.balls[2].pos.x = container.table.balls[1].pos.x
    container.table.balls[2].pos.y -= 3 * R
    done()
  })

  const toLowerRail = new Vector3(0, -2.25 * R)
  const toUpperRail = new Vector3(0, 2.25 * R)

  it("initialise ball for diamond system shot", (done) => {
    expect(container.controller).to.be.an.instanceof(Init)
    container.table.cue.aim.power = 2.6
    container.table.cue.aim.offset.x = -0.35
    /*
    shot(gridPosition(0, 0), gridPosition(5, 4))
    shot(gridPosition(2, 0), gridPosition(6, 4))
    shot(gridPosition(4, 0), gridPosition(7, 4))
    shot(gridPosition(6, 0), gridPosition(8, 4))
    */
    done()
  })

  function shot(fromDiamond, toDiamond) {
    const start = fromDiamond.add(toLowerRail)
    const target = toDiamond.add(toUpperRail)
    playAlong(start, target)
    console.log(diagramHTML(getURL()))
  }

  function playAlong(start, target) {
    const dir = norm(target.clone().sub(start))
    const ballStart = start.clone().addScaledVector(dir, R * 6)
    container.table.cueball.pos.copy(ballStart)
    container.table.cue.aim.angle = round(Math.atan2(dir.y, dir.x))
  }

  function gridPosition(x, y) {
    return new Vector3((-4 + x) * stepx, (-2 + y) * stepy, 0)
  }

  function getURL() {
    roundVec(container.table.cueball.pos)
    container.table.cue.moveTo(container.table.cueball.pos)
    const event: HitEvent = new HitEvent(container.table.serialise())
    container.recoder.record(event)
    container.recoder.updateBreak([])
    const state = container.recoder.lastShot()
    const shotUri = `${replayUrl}${encodeURIComponent(JSON.stringify(state))}`
    return shotUri
  }

  function diagramHTML(uri) {
    return `<div class="replaydiagram child"><div class="topview"
      data-state="${uri}"></div></div>`
  }
})
