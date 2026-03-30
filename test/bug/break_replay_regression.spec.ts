import fs from "node:fs"
import path from "node:path"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Replay } from "../../src/controller/replay"
import { AimEvent } from "../../src/events/aimevent"
import { GameEvent } from "../../src/events/gameevent"
import { Assets } from "../../src/view/assets"
import { Ball } from "../../src/model/ball"
import { Session } from "../../src/network/client/session"
import { canvas3d, initDom } from "../view/dom"

interface BugFixture {
  ruletype: string
  init: number[]
  shots: Array<Record<string, unknown>>
}

initDom()

jest.useFakeTimers()

function loadFixture(): BugFixture {
  const markdown = fs.readFileSync(path.join(__dirname, "bug.md"), "utf8")
  const ruleMatch = markdown.match(/ruletype:\s*"([^"]+)"/)
  const initStart = markdown.indexOf("init:")
  const shotsStart = markdown.indexOf("shots:")
  const urlStart = markdown.indexOf("recordingUrl:")

  if (!ruleMatch || initStart === -1 || shotsStart === -1) {
    throw new Error("Failed to parse bug fixture")
  }

  const initRaw = markdown.slice(initStart + "init:".length, shotsStart).trim()
  const shotsRaw = markdown
    .slice(shotsStart + "shots:".length, urlStart === -1 ? undefined : urlStart)
    .trim()

  return {
    ruletype: ruleMatch[1],
    init: JSON.parse(initRaw),
    shots: JSON.parse(shotsRaw),
  }
}

function createContainer(ruletype: string) {
  Ball.id = 0
  Session.reset()
  Session.init("test-client", "TestPlayer", "test-table", false)

  const keyboard = { getEvents: () => [] }
  return new Container({
    element: canvas3d,
    log: (_) => {},
    assets: Assets.localAssets(ruletype),
    ruletype,
    keyboard: keyboard as any,
  })
}

function distanceBeforeSecondShot(fixture: BugFixture) {
  const container = createContainer(fixture.ruletype)
  const aimShots = fixture.shots.filter((shot) => shot.type === "AIM")
  const secondAim = AimEvent.fromJson(aimShots[1])

  container.updateController(
    new Replay(container, fixture.init, fixture.shots as GameEvent[], false, 0)
  )

  // Fire the scheduled first HIT event.
  jest.runOnlyPendingTimers()
  container.processEvents()

  const maxIterations = 200000
  let iterations = 0
  while (!container.table.allStationary() && iterations < maxIterations) {
    container.advance(container.step)
    iterations++
  }

  if (!container.table.allStationary()) {
    throw new Error(`Replay break did not settle after ${maxIterations} steps`)
  }

  const deltaToRecorded = container.table.cueball.pos.distanceTo(secondAim.pos)
  const cueball = container.table.cueball.pos.clone()
  const onTable = container.table.balls.filter((ball) => ball.onTable()).length
  const state = container.table.shortSerialise()

  return {
    deltaToRecorded,
    cueball,
    onTable,
    iterations,
    state,
  }
}

describe("Break Replay Regression", () => {
  const fixture = loadFixture()

  afterEach(() => {
    Session.reset()
  })

  it("reproduces a stable cueball mismatch before shot 2 begins", (done) => {
    const firstRun = distanceBeforeSecondShot(fixture)
    const secondRun = distanceBeforeSecondShot(fixture)

    expect(fixture.ruletype).to.equal("nineball")
    expect(firstRun.onTable).to.equal(9)
    expect(firstRun.iterations).to.be.greaterThan(0)
    expect(firstRun.state).to.deep.equal(secondRun.state)
    expect(firstRun.cueball.distanceTo(secondRun.cueball)).to.equal(0)
    expect(firstRun.deltaToRecorded).to.equal(secondRun.deltaToRecorded)
    expect(firstRun.deltaToRecorded).to.be.greaterThan(0)
    expect(firstRun.deltaToRecorded).to.be.closeTo(0.03903063840011522, 1e-12)
    done()
  })
})
