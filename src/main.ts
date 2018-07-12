import { Ball } from "./ball"
import { Table } from "./table"
import { Rack } from "./rack"
import { Camera } from "./camera"
import { TableGeometry } from "./tablegeometry"

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
  t = 0
  animate(): void {
    if (this.t++ > 500) {
      console.log(JSON.stringify(this.table.serialise()))
      this.t = 0
    }
    try {
      this.table.advance(0.02)
      this.table.advance(0.02)
      this.table.advance(0.02)
      this.camera.update(0.06)
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
    this.renderer.shadowMapEnabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    document.body.appendChild(this.renderer.domElement)

    let light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(100, -10, 100)
    this.scene.add(light)
    let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
    light2.position.set(-100, 100, 100)
    this.scene.add(light2)

    let balls = Rack.diamond()
    let b = new Ball(new THREE.Vector3(-10, 0.1, 0))
    b.vel.x = 0
    balls.unshift(b)

    this.table = new Table(balls)
    this.table.balls.forEach(b => this.scene.add(b.mesh))
    this.addTable()
    this.camera = new Camera(this.table)

    this.keyboardSetup()
  }

  addTable() {
    TableGeometry.addToScene(this.scene)
  }

  keyboardSetup() {
    document.addEventListener("keydown", event => {
      if (event.keyCode == 37) {
        this.table.rotateAim(0.2)
        event.preventDefault()
      } else if (event.keyCode == 39) {
        this.table.rotateAim(-0.2)
        event.preventDefault()
      } else if (event.keyCode == 32) {
        this.table.hit(3)
        event.preventDefault()
      } else if (event.keyCode == 84) {
        this.camera.mode = this.camera.topView
        event.preventDefault()
      }
    })
  }
}
