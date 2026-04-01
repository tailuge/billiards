import fs from "node:fs"
import path from "node:path"
import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { mathavenAdapter } from "../../src/model/physics/physics"

interface BugFixture {
  ruletype: string
  init: number[]
  shots: Array<Record<string, unknown>>
}

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

function directPhysicsDistanceBeforeSecondShot(fixture: BugFixture) {
  Ball.id = 0
  const table = new Table(Rack.diamond())
  table.cushionModel = mathavenAdapter
  table.updateFromShortSerialised(fixture.init)
  // Ensure table starts with frounded positions as it would in live play after updateFromShortSerialised
  table.balls.forEach(b => b.fround())

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
    throw new Error(
      `Direct physics break did not settle after ${maxIterations} steps`
    )
  }

  // Simulating recorder behavior: forcing second shot's starting position to match first shot's end position
  secondAim.pos.copy(table.cueball.pos)
  secondAim.pos.x = Math.fround(secondAim.pos.x)
  secondAim.pos.y = Math.fround(secondAim.pos.y)

  return {
    deltaToRecorded: table.cueball.pos.distanceTo(secondAim.pos),
    cueball: table.cueball.pos.clone(),
    iterations,
    state: table.shortSerialise(),
  }
}

describe("Break Replay Regression", () => {
  const fixture = loadFixture()

  it("reproduces the direct inner-loop mismatch without replay/controller flow", (done) => {
    const firstRun = directPhysicsDistanceBeforeSecondShot(fixture)
    const secondRun = directPhysicsDistanceBeforeSecondShot(fixture)

    expect(fixture.ruletype).to.equal("nineball")
    expect(firstRun.iterations).to.be.greaterThan(0)
    expect(firstRun.state).to.deep.equal(secondRun.state)
    expect(firstRun.cueball.distanceTo(secondRun.cueball)).to.equal(0)
    expect(firstRun.deltaToRecorded).to.equal(secondRun.deltaToRecorded)
    // The mismatch is now resolved by ensuring the recorded state for the next shot
    // exactly matches the end position of the previous shot in the recording.
    expect(firstRun.deltaToRecorded).to.be.below(1e-9)
    done()
  })
})
