import { Scene, WebGLRenderer, Frustum, Matrix4, AmbientLight } from "three"
import { Camera } from "./camera"
import { OverheadCamera } from "./overheadcamera"
import { AimEvent } from "../events/aimevent"
import { importGltf } from "../utils/gltf"

export class View {
  scene = new Scene()
  private renderer
  camera: Camera
  overheadCamera: OverheadCamera
  windowWidth = 1
  windowHeight = 1
  element
  table: any

  constructor(element, ready?) {
    this.element = element

    element &&
      this.initialiseScene(element, element.offsetWidth, element.offsetHeight)
    this.camera = new Camera(
      element ? element.offsetWidth / element.offsetHeight : 1
    )
    this.overheadCamera = new OverheadCamera(
      element ? element.offsetWidth / element.offsetHeight : 1
    )
    this.addTable(ready)
  }

  update(elapsed, aim: AimEvent) {
    this.camera.update(elapsed, aim)
  }

  updateSize() {
    if (
      this.windowWidth != this.element.offsetWidth ||
      this.windowHeight != this.element.offsetHeight
    ) {
      this.windowWidth = this.element.offsetWidth
      this.windowHeight = this.element.offsetHeight
      this.renderer.setSize(this.windowWidth, this.windowHeight)
    }
  }

  views = [
    {
      left: 0,
      bottom: 0,
      width: 1,
      height: 1.0,
    },
    {
      left: 0.7,
      bottom: 0,
      width: 0.3,
      height: 0.3,
    },
  ]


  render() {
    this.updateSize()
    if (this.isInMotionNotVisible()) {
      this.camera.mode = this.camera.topView
      this.camera.standback +=0.1
    }

    this.renderCamera(this.camera, this.views[0])
    let aspect = this.overheadCamera.aspect(this.windowWidth, this.windowHeight)
    this.views[1].width = aspect.x
    this.views[1].height = aspect.y
    this.views[1].left = 1 - aspect.x * 1.01
    this.views[1].bottom = aspect.y * 0.01

    //this.renderCamera(this.overheadCamera, this.views[1])
  }

  renderCamera(cam, v) {
    this.updateSize()

    const left = Math.floor(this.windowWidth * v.left)
    const bottom = Math.floor(this.windowHeight * v.bottom)
    const width = Math.floor(this.windowWidth * v.width)
    const height = Math.floor(this.windowHeight * v.height)

    this.renderer.setViewport(left, bottom, width, height)
    this.renderer.setScissor(left, bottom, width, height)
    this.renderer.setScissorTest(true)

    cam.camera.aspect = width / height
    cam.camera!.updateProjectionMatrix()

    this.renderer.render(this.scene, cam.camera)
  }

  private initialiseScene(element, width, height) {
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = false
    element.appendChild(this.renderer.domElement)
  }

  private addTable(ready) {
    this.scene.add(new AmbientLight(0x303030, 1.0))
    importGltf("models/p8.gltf", this.scene, ready)
    //TableGeometry.addToScene(this.scene)
  }

  addMesh(mesh) {
    this.scene.add(mesh)
  }

  isInMotionNotVisible() {
    var frustrum = this.viewFrustrum()
    return this.table.balls.some(b=>b.inMotion() && !frustrum.intersectsObject(b.ballmesh.mesh))
  }

  viewFrustrum() {
    var c = this.camera.camera
    c.updateMatrix()
    c.updateMatrixWorld()
    var frustum = new Frustum()
    frustum.setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(c.projectionMatrix, c.matrixWorldInverse)
    )
    return frustum
  }
}
