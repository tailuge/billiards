import {
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
} from "three"
import { Camera } from "./camera"
import { OverheadCamera } from "./overheadcamera"
import { TableGeometry } from "./tablegeometry"
import { AimEvent } from "../events/aimevent"

export class View {
  private scene = new Scene()
  private renderer
  camera: Camera
  overheadCamera: OverheadCamera
  windowWidth = 1
  windowHeight = 1

  constructor(element) {
    element &&
      this.initialiseScene(element, element.offsetWidth, element.offsetHeight)
    this.camera = new Camera(
      element ? element.offsetWidth / element.offsetHeight : 1
    )
    this.overheadCamera = new OverheadCamera(
      element ? element.offsetWidth / element.offsetHeight : 1
    )
    this.addLights()
    this.addTable()
  }

  update(aim: AimEvent) {
    this.camera.update(aim)
  }

  updateSize() {
    if (
      this.windowWidth != window.innerWidth ||
      this.windowHeight != window.innerHeight
    ) {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
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
    this.renderCamera(this.camera, this.views[0])
    let aspect = this.overheadCamera.aspect(this.windowWidth, this.windowHeight)
    this.views[1].width = aspect.x
    this.views[1].height = aspect.y
    this.views[1].left = 1 - aspect.x * 1.01
    this.views[1].bottom = aspect.y * 0.01

    this.renderCamera(this.overheadCamera, this.views[1])
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
