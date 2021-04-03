import {
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
  Frustum,
  Matrix4,
  AmbientLight,
} from "three"
import { Camera } from "./camera"
import { OverheadCamera } from "./overheadcamera"
import { AimEvent } from "../events/aimevent"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js"
import { downloadObjectAsJson } from "../utils/utils"

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

  loader = new GLTFLoader()

  private addTable() {
    this.loader.load(
      "models/p8.gltf",
      (gltf) => {
        gltf.scene.add(new AmbientLight(0x505050, 1.0))
        this.scene.add(gltf.scene)
      },
      (xhr) => console.log(xhr.loaded + " bytes loaded"),
      (error) => console.log(error)
    )
  }

  addMesh(mesh) {
    this.scene.add(mesh)
  }

  isVisible(o) {
    var frustum = new Frustum()
    var cameraViewProjectionMatrix = new Matrix4()
    var c = this.camera.camera
    c.updateMatrixWorld()
    c.matrixWorldInverse.getInverse(c.matrixWorld)
    cameraViewProjectionMatrix.multiplyMatrices(
      c.projectionMatrix,
      c.matrixWorldInverse
    )
    frustum.setFromMatrix(cameraViewProjectionMatrix)
    return frustum.intersectsObject(o)
  }

  exportGltf() {
    const exporter = new GLTFExporter()
    exporter.parse(this.scene, (gltf) => {
      console.log(gltf)
      downloadObjectAsJson(gltf, "scene.gltf")
    })
  }
}
