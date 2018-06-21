import { Vector3 } from "three"

export class Ball {
  pos: Vector3
  vel: Vector3
  rpos: Vector3
  rvel: Vector3

  constructor(pos) {
    this.pos = pos
    this.vel = new Vector3(0, 0, 0)
    this.rpos = new Vector3(0, 0, 1)
    this.rvel = new Vector3(0, 0, 0)
  }
}
