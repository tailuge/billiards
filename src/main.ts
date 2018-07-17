import { Ball } from "./ball"
import { Table } from "./table"
import { Rack } from "./rack"
import { Camera } from "./camera"
import { TableGeometry } from "./tablegeometry"
//import { Vector3 } from "three"

import * as THREE from "three"

export class Main {
  scene = new THREE.Scene()
  camera: Camera
  renderer = new THREE.WebGLRenderer()
  material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: false
  })

  table: Table
  frame = 0
  animate(): void {
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
      requestAnimationFrame(() => {
        this.animate()
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
    this.keyboardSetup()
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
    this.table.balls.forEach(b => this.scene.add(b.mesh))
    this.scene.add(this.table.cue.mesh)
    this.table.cue.setPosition(this.table.balls[0].pos)
    TableGeometry.addToScene(this.scene)
    this.camera = new Camera(this.table)
    this.camera.mode = this.camera.topView
  }

  rate = 0
  rateInc = 0.0025

  keyboardSetup() {
    document.addEventListener("keydown", event => {
      console.log(this.table.cue.intersectsAnything(this.table))
      if (event.keyCode == 39) {
        this.rate += this.rateInc
        this.table.cue.setPosition(this.table.balls[0].pos)
        this.table.cue.rotateAim(this.rate)
        //      this.table.cue.showPointer(this.table, this.scene)
        this.camera.mode = this.camera.aimView
        event.preventDefault()
      } else if (event.keyCode == 37) {
        this.rate += this.rateInc
        this.table.cue.setPosition(this.table.balls[0].pos)
        this.table.cue.rotateAim(-this.rate)
        this.camera.mode = this.camera.aimView
        event.preventDefault()
      } else if (event.keyCode == 38) {
        this.table.cue.adjustHeight(0.1)
        event.preventDefault()
      } else if (event.keyCode == 40) {
        this.table.cue.adjustHeight(-0.1)
        event.preventDefault()
      } else if (event.keyCode == 32) {
        this.table.hit(3)
        this.camera.mode = this.camera.afterHitView
        event.preventDefault()
      } else if (event.keyCode == 84) {
        this.camera.mode = this.camera.topView
        event.preventDefault()
      } else if (event.keyCode == 65) {
        this.camera.mode = this.camera.aimView
        event.preventDefault()
      }
    })
    document.addEventListener("keyup", ({}) => {
      this.rate = 0
    })
  }
}
