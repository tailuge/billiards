import { Table } from "./table"
import { up, zero } from "./utils"

import * as THREE from "three"

export class Camera {
  constructor(table: Table, aspectRatio) {
    this.table = table
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
  }

  camera
  table: Table
  mode = this.topView

  private topViewPoint = new THREE.Vector3(0, -0.1, 17)

  update(t) {
    this.t += t
    this.mode()
  }

  t = 0
  topView() {
    this.camera.position.lerp(this.topViewPoint, 0.1)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView() {
    this.camera.position.lerp(
      this.table.balls[0].pos.clone().addScaledVector(this.table.cue.aimdir, -9),
      0.07
    )
    this.camera.position.z = 2.7
    this.camera.up = up
    this.camera.lookAt(this.table.balls[0].pos)
  }

  afterHitView() {
    this.camera.position.addScaledVector(up, 0.01)
    this.camera.up = up
    this.camera.lookAt(this.table.balls[0].pos)
  }
}
