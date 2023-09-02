import { Scene, WebGLRenderer, Frustum, Matrix4, AmbientLight } from "three"
import { Camera } from "./camera"
import { AimEvent } from "../events/aimevent"
import { importGltf } from "../utils/gltf"
import { Grid } from "./grid"
import { Table } from "../model/table"

export class View {
  scene = new Scene()
  private renderer: WebGLRenderer
  camera: Camera
  windowWidth = 1
  windowHeight = 1
  element
  table: Table

  constructor(element, ready?) {
    this.element = element

    element &&
      this.initialiseScene(element, element.offsetWidth, element.offsetHeight)
    this.camera = new Camera(
      element ? element.offsetWidth / element.offsetHeight : 1
    )
    this.addTable(ready)
  }

  update(elapsed, aim: AimEvent) {
    this.camera.update(elapsed, aim)
  }

  updateSize() {
    if (
      this.windowWidth != this.element?.offsetWidth ||
      this.windowHeight != this.element?.offsetHeight
    ) {
      this.windowWidth = this.element?.offsetWidth
      this.windowHeight = this.element?.offsetHeight
      return true
    }
    return false
  }

  readonly geom = {
    left: 0,
    bottom: 0,
    width: 1,
    height: 1.0,
  }

  render() {
    if (this.isInMotionNotVisible()) {
      this.camera.suggestMode(this.camera.topView)
    }
    this.renderCamera(this.camera, this.geom)
  }

  renderCamera(cam, v) {
    if (this.updateSize()) {
      const left = Math.floor(this.windowWidth * v.left)
      const bottom = Math.floor(this.windowHeight * v.bottom)
      const width = Math.floor(this.windowWidth * v.width)
      const height = Math.floor(this.windowHeight * v.height)

      this.renderer?.setSize(this.windowWidth, this.windowHeight)
      this.renderer?.setViewport(left, bottom, width, height)
      this.renderer?.setScissor(left, bottom, width, height)
      this.renderer?.setScissorTest(true)

      cam.camera.aspect = width / height
    }
    cam.camera.updateProjectionMatrix()
    this.renderer?.render(this.scene, cam.camera)
  }

  private initialiseScene(element: HTMLElement, width, height) {
    this.renderer = new WebGLRenderer({ antialias: false })
    this.renderer.useLegacyLights = true
    this.renderer.shadowMap.enabled = false
    this.renderer.autoClear = false
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio * 0.75)
    element.appendChild(this.renderer.domElement)
  }

  private addTable(ready) {
    this.scene.add(new AmbientLight(0x303030, 1.0))
    importGltf("models/p8.gltf", this.scene, ready)
    //TableGeometry.addToScene(this.scene)
    this.scene.add(new Grid().generateLineSegments())
  }

  addMesh(mesh) {
    this.scene.add(mesh)
  }

  ballToCheck = 0

  isInMotionNotVisible() {
    const frustrum = this.viewFrustrum()
    const b = this.table.balls[this.ballToCheck++ % this.table.balls.length]
    return b.inMotion() && !frustrum.intersectsObject(b.ballmesh.mesh)
  }

  viewFrustrum() {
    const c = this.camera.camera
    const frustum = new Frustum()
    frustum.setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(c.projectionMatrix, c.matrixWorldInverse)
    )
    return frustum
  }
}
