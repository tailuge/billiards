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

  animate(): void {
    requestAnimationFrame(() => {
      this.animate()
    })
    this.table.advance(0.01)
    this.table.advance(0.01)
    this.table.advance(0.01)
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
    light.position.set(100, 100, 100)
    this.scene.add(light)
    let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
    light2.position.set(-100, 100, -100)
    this.scene.add(light2)

    this.camera.up = new THREE.Vector3(0, 0, 1)
    this.camera.position.x = 25
    this.camera.position.y = 25
    this.camera.position.z = 15
    this.camera.lookAt(this.scene.position)

    let balls = Rack.diamond()
    let b = new Ball(new THREE.Vector3(-10, 0.1, 0))
    b.vel.x = 2
    balls.push(b)
    this.table = new Table(balls)
    this.table.balls.forEach(b => this.scene.add(b.mesh))
    this.addTable()
  }

  addTable() {
    var geometry = new THREE.BoxGeometry(2 * 21, 2 * 11, 0.1)
    var material = new THREE.MeshLambertMaterial({
      color: 0x111133
    })
    var mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true
    mesh.position.z = -0.5
    this.scene.add(mesh)
    TableGeometry.addToScene(this.scene)
  }
}
