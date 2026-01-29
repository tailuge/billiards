import { Vector3 } from "three"
import { Ball } from "../../src/model/ball"
import { BallPattern } from "../../src/view/ballmesh"

describe("Ball Pattern", () => {
  it("should initialize a ball with a custom pattern", () => {
    const pattern = [
      { index: 0, color: "#ffffff" },
      { index: 1, color: "#000000" },
    ]
    const ball = new Ball(new Vector3(0, 0, 0), 0xffffff, pattern)

    expect(ball.ballmesh).toBeDefined()
    // Verifying that the mesh was initialized, which internally calls addDots with the pattern
    expect(ball.ballmesh.mesh.geometry.attributes.color).toBeDefined()
  })
})
