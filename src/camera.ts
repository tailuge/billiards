import { Table } from "./table"

import * as THREE from "three"

export class Camera {
  constructor(table: Table) {
    this.table = table
  }

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  table: Table
  up = new THREE.Vector3(0, 0, 1)
  centre = new THREE.Vector3()
  mode = this.topView

  update(t) {
    this.mode(t)
  }

  t = 0
  topView(t) {
    this.t += t
    this.camera.up = this.up
    this.camera.position.x = 0
    this.camera.position.y = 0.1
    this.camera.position.z = 20
    this.camera.lookAt(this.centre)
  }

  aimView(t) {
    this.camera.up = new THREE.Vector3(0, 0, 1)
    this.camera.position.x = 0
    this.camera.position.y = 0.1
    this.camera.position.z = 20 + t
    this.camera.lookAt(this.centre)
  }
}
