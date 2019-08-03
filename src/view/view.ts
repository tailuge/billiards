import {
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer
} from "three"
import { Camera } from "./camera"
import { TableGeometry } from "./tablegeometry"
import { AimEvent } from "../events/aimevent"

export class View {
  private scene = new Scene()
  private renderer
  camera: Camera

  constructor(element) {
    element && this.initialiseScene(element, element.offsetWidth, element.offsetHeight)
    this.camera = new Camera(element ? element.offsetWidth / element.offsetHeight : 1)
    this.addLights()
    this.addTable()
  }

  update(t, aim: AimEvent) {
    this.camera.update(t, aim)
  }

  render() {
    this.renderer.render(this.scene, this.camera.camera)
  }

  private initialiseScene(element, width, height) {
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    element.appendChild(this.renderer.domElement)
  }

  private addLights() {
    let s = 1.3
    let light = new DirectionalLight(0xffffff, 1.0)
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
    this.scene.add(new AmbientLight(0x505050, 1.0))
  }

  private addTable() {
    TableGeometry.addToScene(this.scene)
  }

  addMesh(mesh) {
    this.scene.add(mesh)
  }
}
