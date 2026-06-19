import { calcMinWarpTime } from "../src/worker"
import { Ball, State } from "../src/model/ball"
import { Vector3 } from "three"
import { expect as chaiExpect } from "chai"
import { TableGeometry } from "../src/view/tablegeometry"

describe("calcMinWarpTime", () => {
  const R = 0.03275

  beforeAll(() => {
    TableGeometry.configureForRule("pool")
  })

  it("should skip balls that are separating (dot product >= 0)", () => {
    // bA at (0,0), bB at (0.5,0)
    // bA moves right (1,0), bB moves right (1,0)
    // dx = 0 - 0.5 = -0.5
    // dvx = 1 - 1 = 0
    // dot = -0.5 * 0 = 0
    const bA = new Ball(new Vector3(0, 0, 0))
    bA.vel.set(1, 0, 0)
    bA.state = State.Rolling

    const bB = new Ball(new Vector3(0.5, 0, 0))
    bB.vel.set(1, 0, 0)
    bB.state = State.Rolling

    const rollingBalls = [bA]
    const allBalls = [bA, bB]

    const warpTime = calcMinWarpTime(rollingBalls, allBalls, R)

    // It should skip bB, but it will still check cushions.
    // ballToCushionDist(bA) = min(tableX - 0, tableY - 0) = tableY
    // tbc = (tableY - R) / vA = (21*R - R) / 1 = 20*R = 20 * 0.03275 = 0.655
    chaiExpect(warpTime).to.be.closeTo(20 * R, 1e-10)
  })

  it("should skip balls that are moving apart", () => {
    // bA moves left, bB moves right
    // dx = -0.5, dvx = -1 - 1 = -2
    // dot = -0.5 * -2 = 1.0 > 0
    const bA = new Ball(new Vector3(0, 0, 0))
    bA.vel.set(-1, 0, 0)
    bA.state = State.Rolling

    const bB = new Ball(new Vector3(0.5, 0, 0))
    bB.vel.set(1, 0, 0)
    bB.state = State.Rolling

    const rollingBalls = [bA]
    const allBalls = [bA, bB]

    const warpTime = calcMinWarpTime(rollingBalls, allBalls, R)
    chaiExpect(warpTime).to.be.closeTo(20 * R, 1e-10)
  })

  it("should calculate warp time for approaching balls (dot product < 0)", () => {
    const bA = new Ball(new Vector3(0, 0, 0))
    bA.vel.set(1, 0, 0)
    bA.state = State.Rolling

    const bB = new Ball(new Vector3(0.5, 0, 0))
    bB.vel.set(-1, 0, 0) // Approaching -> dx = -0.5, dvx = 2 -> dot = -1.0 < 0
    bB.state = State.Rolling

    const rollingBalls = [bA]
    const allBalls = [bA, bB]

    const expectedWarpTime = (0.5 - 2 * R) / 2
    const warpTime = calcMinWarpTime(rollingBalls, allBalls, R)

    // expectedWarpTime = (0.5 - 0.0655) / 2 = 0.21725
    // tbc = 0.655
    // min is 0.21725
    chaiExpect(warpTime).to.be.closeTo(expectedWarpTime, 1e-10)
  })

  it("should consider multiple balls and return the minimum time", () => {
    const bA = new Ball(new Vector3(0, 0, 0))
    bA.vel.set(1, 0, 0)
    bA.state = State.Rolling

    const bB = new Ball(new Vector3(0.5, 0, 0)) // dist 0.5
    bB.vel.set(-1, 0, 0)

    const bC = new Ball(new Vector3(0.2, 0, 0)) // dist 0.2
    bC.vel.set(-1, 0, 0)

    const rollingBalls = [bA]
    const allBalls = [bA, bB, bC]

    const expectedWarpTime = (0.2 - 2 * R) / 2
    const warpTime = calcMinWarpTime(rollingBalls, allBalls, R)
    chaiExpect(warpTime).to.be.closeTo(expectedWarpTime, 1e-10)
  })
})
