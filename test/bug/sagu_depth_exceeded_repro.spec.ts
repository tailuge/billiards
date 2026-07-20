import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { TableConfig } from "../../src/view/tableconfig"
import { mathavanAdapter } from "../../src/model/physics/physics"

const startState = [
  -0.45114612579345703, -0.2409101128578186,
  0.5599875450134277, 0.2119661569595337,
  0.5601970553398132, -0.21569983661174774,
  -0.5054517984390259, 0.07246287912130356,
]

const aimJson = {
  cueBallId: 1,
  angle: -2.9910736083984375,
  power: 3.4059998989105225,
  offset: {
    x: -0.42895379662513733,
    y: -0.13600973784923553,
    z: 0,
  },
  pos: {
    x: 0.5599875450134277,
    y: 0.2119661569595337,
    z: 0,
  },
  elevation: 0,
  i: 1,
}

describe("Sagu Depth Exceeded Repro", () => {
  it("throws exception 'Depth exceeded resolving collisions' during replay of the crashing shot", () => {
    Ball.id = 0

    // Apply rule and table size configuration (Sagu, tableSize = 5)
    TableConfig.apply("sagu", 5)

    const table = new Table(Rack.fourBall())
    table.cushionModel = mathavanAdapter
    table.updateFromShortSerialised(startState)

    table.cueball = table.balls[aimJson.i]
    table.cue.aim = AimEvent.fromJson(aimJson)
    table.hit()

    const maxIterations = 200000
    let iterations = 0

    const runReplay = () => {
      while (!table.allStationary() && iterations < maxIterations) {
        table.advance(0.001953125)
        iterations++
      }
    }

    expect(runReplay).not.to.throw()
    expect(table.allStationary()).to.be.true
  })
})
