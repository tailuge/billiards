import { Table } from "./table"

import * as THREE from "three"

export class Camera {
  constructor(table: Table) {
    this.table = table
    this.camera.up = this.up
  }

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  table: Table
  up = new THREE.Vector3(0, 0, 1)
  topViewPoint = new THREE.Vector3(0, 0.1, 20)
  centre = new THREE.Vector3()
  mode = this.aimView

  update(t) {
    this.t += t
    this.mode()
  }

  t = 0
  topView() {
    this.camera.position.lerp(this.topViewPoint, 0.05)
    this.camera.lookAt(this.centre)
  }

  aimView() {
    this.camera.position.lerp(
      this.table.balls[0].pos.clone().addScaledVector(this.table.aim, -10),
      0.05
    )
    this.camera.position.z = 2
    this.camera.lookAt(this.table.balls[0].pos)
  }
}
