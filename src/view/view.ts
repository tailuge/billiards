import { Scene, WebGLRenderer, Frustum, Matrix4, AmbientLight } from "three"
import { Camera } from "./camera"
import { AimEvent } from "../events/aimevent"
import { Table } from "../model/table"
import { Grid } from "./grid"
import { renderer } from "../utils/webgl"
import { Assets } from "./assets"
import { Snooker } from "../controller/rules/snooker"

export class View {
  readonly scene = new Scene()
  private readonly renderer: WebGLRenderer | undefined
  camera: Camera
  windowWidth = 1
  windowHeight = 1
  private lastFov = 0
  readonly element: HTMLElement
  table: Table
  loadAssets = true
  assets: Assets

  // Reuse objects to reduce garbage collection pressure in high-frequency rendering
  private readonly frustum = new Frustum()
  private readonly projScreenMatrix = new Matrix4()

  private resizeObserver: ResizeObserver | undefined

  constructor(element: HTMLElement, table: Table, assets: Assets) {
    this.element = element
    this.table = table
    this.assets = assets
    this.renderer = renderer(element)
    this.windowWidth = element ? element.offsetWidth : 1
    this.windowHeight = element ? element.offsetHeight : 1
    this.camera = new Camera(this.windowWidth / this.windowHeight)
    this.initialiseScene()
    this.setupResizeObserver()
  }

  private setupResizeObserver() {
    if (globalThis.ResizeObserver && this.element) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            this.windowWidth = entry.contentRect.width
            this.windowHeight = entry.contentRect.height
          }
        }
      })
      this.resizeObserver.observe(this.element)
    }
  }

  update(elapsed, aim: AimEvent) {
    this.camera.update(elapsed, aim)
  }

  private lastRenderWidth = 0
  private lastRenderHeight = 0

  updateSize() {
    const hasChanged =
      this.windowWidth !== this.lastRenderWidth ||
      this.windowHeight !== this.lastRenderHeight
    if (hasChanged) {
      this.lastRenderWidth = this.windowWidth
      this.lastRenderHeight = this.windowHeight
    }
    return hasChanged
  }

  render() {
    if (this.isInMotionNotVisible()) {
      this.camera.suggestMode(this.camera.topView)
    }
    this.renderCamera(this.camera)
  }

  renderCamera(cam) {
    const sizeChanged = this.updateSize()
    if (sizeChanged) {
      const width = this.windowWidth
      const height = this.windowHeight

      this.renderer?.setSize(width, height)
      this.renderer?.setViewport(0, 0, width, height)
      this.renderer?.setScissor(0, 0, width, height)
      this.renderer?.setScissorTest(true)

      cam.camera.aspect = width / height
    }

    if (sizeChanged || cam.camera.fov !== this.lastFov) {
      cam.camera.updateProjectionMatrix()
      this.lastFov = cam.camera.fov
    }

    this.renderer?.render(this.scene, cam.camera)
  }

  private initialiseScene() {
    this.scene.add(new AmbientLight(0x009922, 0.3))
    if (this.assets.background) {
      this.scene.add(this.assets.background)
    }
    this.scene.add(this.assets.table)
    this.table.mesh = this.assets.table
    if (this.assets.rules.asset() !== Snooker.tablemodel) {
      this.scene.add(new Grid().generateLineSegments())
    }
  }

  ballToCheck = 0

  isInMotionNotVisible() {
    const frustum = this.viewFrustum()
    const b = this.table.balls[this.ballToCheck++ % this.table.balls.length]
    return b.inMotion() && !frustum.intersectsObject(b.ballmesh.mesh)
  }

  viewFrustum() {
    const c = this.camera.camera
    this.frustum.setFromProjectionMatrix(
      this.projScreenMatrix.multiplyMatrices(
        c.projectionMatrix,
        c.matrixWorldInverse
      )
    )
    return this.frustum
  }
}
