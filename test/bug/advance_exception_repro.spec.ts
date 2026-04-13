import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { Ball } from "../../src/model/ball"
import { R } from "../../src/model/physics/constants"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { Vector3 } from "three"

const stateAtStart = [
  -1.3137716054916382, -0.374784380197525, 1.455881953239441,
  -0.7532521486282349, -1.4507464170455933, 0.7379950881004333,
  1.3828588724136353, -0.14475767314434052, -1.2839877605438232,
  -0.007493197917938232, 0.48716890811920166, -0.511671245098114,
  -0.7628549337387085, -0.018809136003255844, -0.4528382420539856,
  0.29027026891708374, 1.3893194198608398, 0.1954631805419922,
  1.0833051204681396, 0.24460379779338837,
]

const aim = {
  type: "AIM",
  offset: {
    x: 0,
    y: 0.3,
    z: 0,
  },
  angle: 0.060908686369657516,
  power: 2.9475000000000002,
  pos: {
    x: -1.3137716054916382,
    y: -0.374784380197525,
    z: 0,
  },
  i: 0,
}

describe("Advance Exception Repro", () => {
  beforeEach(() => {
    Ball.id = 0
  })

  function createTable() {
    const table = new Table(Rack.diamond())
    table.updateFromShortSerialised(stateAtStart)
    table.cue.aim = AimEvent.fromJson(aim)
    table.cueball = table.balls[aim.i]
    return table
  }

  it("does not reproduce from the logged state and aim alone", () => {
    const table = createTable()
    table.hit()

    const maxIterations = 200000
    for (let i = 0; i < maxIterations; i++) {
      table.advance(0.001953125)
      if (table.allStationary()) {
        break
      }
    }

    expect(table.allStationary()).to.equal(true)
  })

  it("recreates the advance failure when the logged state is made overlapping", () => {
    const table = createTable()
    const overlappingBall = table.balls[4]
    overlappingBall.pos.copy(
      table.cueball.pos.clone().add(new Vector3(R * 0.9, 0, 0))
    )

    table.hit()

    expect(() => {
      table.advance(0.001953125)
    }).to.throw("Depth exceeded resolving collisions")
  })
})
