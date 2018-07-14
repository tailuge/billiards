import { Table } from "./table"

import * as THREE from "three"

export class Camera {
  constructor(table: Table) {
    this.table = table
  }

  table: Table
  mode = this.aimView

  private up = new THREE.Vector3(0, 0, 1)
  private topViewPoint = new THREE.Vector3(0, 0.1, 20)
  private centre = new THREE.Vector3()

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
    this.camera.lookAt(this.centre)
  }

  aimView() {
    this.camera.position.lerp(
      this.table.balls[0].pos.clone().addScaledVector(this.table.cue.aim, -10),
      0.05
    )
    this.camera.position.z = 3
    this.camera.up = this.up
    this.camera.lookAt(this.table.balls[0].pos)
  }

  afterHitView() {
    this.camera.position.addScaledVector(this.up, 0.01)
    this.camera.lookAt(this.table.balls[0].pos)
  }
}
