import { Ball } from "./ball"
import { Table } from "./table"
import { Rack } from "./rack"
import { Camera } from "./camera"
import { TableGeometry } from "./tablegeometry"
import { Keyboard } from "./keyboard"

import * as THREE from "three"

export class Main {
  scene = new THREE.Scene()
  camera: Camera
  renderer = new THREE.WebGLRenderer()
  material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: false
  })
  keyboard = new Keyboard()

  table: Table
  frame = 0
  elapsed = 1
  last = performance.now()
  animate(timestamp?): void {
    if (timestamp) {
      this.elapsed = timestamp - this.last
      this.last = timestamp
    }
    if (this.frame++ > 500) {
      console.log(JSON.stringify(this.table.serialise()))
      this.frame = 0
    }
    try {
      let step = 0.01
      let steps = 10
      let i = 0
      while (i++ < steps) {
        this.table.advance(step)
      }
      this.camera.update(steps * step)
      this.keyboard.applyKeys(this.elapsed, this.table, this.camera)
      requestAnimationFrame(t => {
        this.animate(t)
      })
    } catch (error) {
      console.log(error)
    }
    this.render()
  }

  render(): void {
    this.renderer.render(this.scene, this.camera.camera)
  }

  run() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(this.renderer.domElement)
    this.addLights()
    this.addTable()
  }

  addLights() {
    let s = 1.3
    let light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(0.1, -0.01, 10)
    light.shadow.camera.near = 4
    light.shadow.camera.far = 12
    light.shadow.camera.right = TableGeometry.X * s
    light.shadow.camera.left = -TableGeometry.X * s
    light.shadow.camera.top = TableGeometry.Y * s
    light.shadow.camera.bottom = -TableGeometry.Y * s
    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024
    light.castShadow = true
    this.scene.add(light)
    this.scene.add(new THREE.AmbientLight(0x404040, 1.0))
  }

  addTable() {
    //    let balls = Rack.diamond()
    let balls = Rack.testSpin()
    balls.unshift(new Ball(new THREE.Vector3(-11, 0.0, 0)))

    /*
    let a = new Ball(new Vector3(0, 0, 0))
    let b = new Ball(new Vector3(-1, 0, 0))
    this.table = new Table([a, b])
*/
    this.table = new Table(balls)
    this.table.balls.forEach(b => this.scene.add(b.mesh.mesh))
    this.scene.add(this.table.cue.mesh)
    this.table.cue.moveToCueBall()
    TableGeometry.addToScene(this.scene)
    this.camera = new Camera(this.table)
    this.camera.mode = this.camera.topView
  }
}
