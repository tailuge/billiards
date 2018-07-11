import { Ball } from "./ball"
import { Table } from "./table"
import { Rack } from "./rack"
import { TableGeometry } from "./tablegeometry"

import * as THREE from "three"

export class Main {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  renderer = new THREE.WebGLRenderer()
  material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true
  })

  table: Table
  t = 0
  animate(): void {
    requestAnimationFrame(() => {
      this.animate()
    })
    if (this.t++ > 500) {
      console.log(JSON.stringify(this.table.serialise()))
      this.t = 0
    }
    this.table.advance(0.02)
    this.table.advance(0.02)
    this.table.advance(0.02)
    this.render()
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  run() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMapEnabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    document.body.appendChild(this.renderer.domElement)

    let light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(100, -10, 100)
    this.scene.add(light)
    let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
    light2.position.set(-100, 100, 100)
    this.scene.add(light2)

    this.camera.up = new THREE.Vector3(0, 0, 1)
    this.camera.position.x = 0
    this.camera.position.y = 0.1
    this.camera.position.z = 20
    this.camera.lookAt(this.scene.position)

    let balls = Rack.diamond()
    let b = new Ball(new THREE.Vector3(-10, 0.1, 0))
    b.vel.x = 3
    balls.push(b)
    this.table = new Table(balls)
    this.table.balls.forEach(b => this.scene.add(b.mesh))
    this.addTable()
  }

  addTable() {
    TableGeometry.addToScene(this.scene)
  }
}
