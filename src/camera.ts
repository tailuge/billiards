import { Table } from "./table"
import { up, zero } from "./utils"

import * as THREE from "three"

export class Camera {
  constructor(table: Table) {
    this.table = table
  }

  table: Table
  mode = this.aimView

  private topViewPoint = new THREE.Vector3(0, 0.1, 20)

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  update(t) {
    this.t += t
    this.mode()
  }

  t = 0
  topView() {
    this.camera.position.lerp(this.topViewPoint, 0.09)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView() {
    this.camera.position.lerp(
      this.table.balls[0].pos.clone().addScaledVector(this.table.cue.aim, -10),
      0.05
    )
    this.camera.position.z = 3
    this.camera.up = up
    this.camera.lookAt(this.table.balls[0].pos)
  }

  afterHitView() {
    this.camera.position.addScaledVector(up, 0.01)
    this.camera.up = up
    this.camera.lookAt(this.table.balls[0].pos)
  }
}
