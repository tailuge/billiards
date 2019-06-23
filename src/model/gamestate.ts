import { Ball } from "./ball"
import { Scene } from "three"

export class GameState {
  balls: Ball[]

  addToScene(scene: Scene) {
    this.balls.forEach(b => {
      let ball = new Ball(b.pos)
      ball.vel = b.vel
      scene.add(ball.mesh.mesh)
    })
  }
}
