export { Ball } from "./ball"
export * from "three"
export * from 'three-orbitcontrols'

import * as THREE from "three"

// set the scene size
let WIDTH = 250
let HEIGHT = 250

// set some camera attributes
let VIEW_ANGLE = 75
let ASPECT = WIDTH / HEIGHT
let NEAR = 0.1
let FAR = 1000

export class Main {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  geometry: THREE.BoxGeometry
  material: THREE.MeshNormalMaterial

  cube: THREE.Mesh

  constructor(element) {
    console.log(element)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(400, 400)
    document.body.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

    var geometry = new THREE.BoxBufferGeometry(200, 200, 200)
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })

    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)
    this.scene.add(this.camera)
    let light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(100, 100, 100)
    this.scene.add(light)
    let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
    light2.position.set(-100, 100, -100)
    this.scene.add(light2)
    this.camera.position.z = 2
    this.renderer.setSize(WIDTH, HEIGHT)
    this.animate()
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate()
    })
    this.renderer.render(this.scene, this.camera)
    console.log("t")
  }
}
