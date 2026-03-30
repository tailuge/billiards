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
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"

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
  const cueballHistory = [container.table.cueball.pos.clone()]
  let previousCueball = container.table.cueball.pos.clone()
  let previousState = container.table.shortSerialise()
  while (!container.table.allStationary() && iterations < maxIterations) {
    previousCueball.copy(container.table.cueball.pos)
    previousState = container.table.shortSerialise()
    container.advance(container.step)
    cueballHistory.push(container.table.cueball.pos.clone())
    iterations++
  }

  if (!container.table.allStationary()) {
    throw new Error(`Replay break did not settle after ${maxIterations} steps`)
  }

  const deltaToRecorded = container.table.cueball.pos.distanceTo(secondAim.pos)
  const deltaToRecordedPrevStep = previousCueball.distanceTo(secondAim.pos)
  const cueball = container.table.cueball.pos.clone()
  let previousDistinctCueball = cueballHistory[0]
  for (let i = cueballHistory.length - 2; i >= 0; i--) {
    if (cueballHistory[i].distanceTo(cueball) > 0) {
      previousDistinctCueball = cueballHistory[i]
      break
    }
  }
  const deltaToRecordedPrevDistinct = previousDistinctCueball.distanceTo(
    secondAim.pos
  )
  const onTable = container.table.balls.filter((ball) => ball.onTable()).length
  const state = container.table.shortSerialise()

  return {
    deltaToRecorded,
    deltaToRecordedPrevStep,
    deltaToRecordedPrevDistinct,
    cueball,
    previousCueball,
    previousDistinctCueball,
    onTable,
    iterations,
    state,
    previousState,
  }
}

function directPhysicsDistanceBeforeSecondShot(fixture: BugFixture) {
  Ball.id = 0
  const table = new Table(Rack.diamond())
  table.updateFromShortSerialised(fixture.init)

  const aimShots = fixture.shots.filter((shot) => shot.type === "AIM")
  const firstAim = AimEvent.fromJson(aimShots[0])
  const secondAim = AimEvent.fromJson(aimShots[1])

  table.cue.aim = firstAim
  table.cueball = table.balls[firstAim.i]
  table.hit()

  const maxIterations = 200000
  let iterations = 0
  while (!table.allStationary() && iterations < maxIterations) {
    table.advance(0.001953125)
    iterations++
  }

  if (!table.allStationary()) {
    throw new Error(`Direct physics break did not settle after ${maxIterations} steps`)
  }

  return {
    deltaToRecorded: table.cueball.pos.distanceTo(secondAim.pos),
    cueball: table.cueball.pos.clone(),
    iterations,
    state: table.shortSerialise(),
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
    expect(firstRun.previousState).to.deep.equal(secondRun.previousState)
    expect(firstRun.cueball.distanceTo(secondRun.cueball)).to.equal(0)
    expect(firstRun.previousCueball.distanceTo(secondRun.previousCueball)).to.equal(
      0
    )
    expect(
      firstRun.previousDistinctCueball.distanceTo(secondRun.previousDistinctCueball)
    ).to.equal(0)
    expect(firstRun.deltaToRecorded).to.equal(secondRun.deltaToRecorded)
    expect(firstRun.deltaToRecordedPrevStep).to.equal(
      secondRun.deltaToRecordedPrevStep
    )
    expect(firstRun.deltaToRecordedPrevDistinct).to.equal(
      secondRun.deltaToRecordedPrevDistinct
    )
    expect(firstRun.deltaToRecorded).to.be.greaterThan(0)
    expect(firstRun.deltaToRecorded).to.be.closeTo(0.03903063840011522, 1e-12)
    expect(firstRun.deltaToRecordedPrevStep).to.be.greaterThan(0)
    expect(firstRun.deltaToRecordedPrevDistinct).to.be.greaterThan(0)
    expect(firstRun.deltaToRecordedPrevDistinct).to.be.lessThan(
      firstRun.deltaToRecorded
    )
    done()
  })

  it("reproduces the direct inner-loop mismatch without replay/controller flow", (done) => {
    const firstRun = directPhysicsDistanceBeforeSecondShot(fixture)
    const secondRun = directPhysicsDistanceBeforeSecondShot(fixture)

    expect(firstRun.iterations).to.be.greaterThan(0)
    expect(firstRun.state).to.deep.equal(secondRun.state)
    expect(firstRun.cueball.distanceTo(secondRun.cueball)).to.equal(0)
    expect(firstRun.deltaToRecorded).to.equal(secondRun.deltaToRecorded)
    expect(firstRun.deltaToRecorded).to.be.closeTo(0.03903063840011522, 1e-12)
    done()
  })
})
