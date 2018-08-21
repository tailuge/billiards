import { Ball } from "./ball"
import { Table } from "./table"
import { Rack } from "./rack"
import { Camera } from "./camera"
import { TableGeometry } from "./tablegeometry"
import { Keyboard } from "./keyboard"
export * from "./plots"
import * as THREE from "three"

export class Main {
  table: Table
  camera: Camera
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  keyboard = new Keyboard()
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

  initialise(element) {
    this.renderer.setSize(element.offsetWidth, element.offsetHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    element.appendChild(this.renderer.domElement)
    this.addLights()
    this.addTable()
    this.camera = new Camera(
      this.table,
      element.offsetWidth / element.offsetHeight
    )
    this.camera.mode = this.camera.topView
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
    this.scene.add(new THREE.AmbientLight(0x505050, 1.0))
  }

  addTable() {
    //    let balls = Rack.diamond()
    let balls = Rack.testSpin()
    balls.unshift(new Ball(new THREE.Vector3(-11, 0.0, 0)))

    this.table = new Table(balls)
    this.table.balls.forEach(b => b.mesh.addToScene(this.scene))
    this.scene.add(this.table.cue.mesh)
    this.table.cue.moveToCueBall()
    TableGeometry.addToScene(this.scene)
  }

  static start() {
    let elt = document.getElementById("container")
    let main = new Main()
    main.initialise(elt)
    main.animate()
  }
}

Main.start()
