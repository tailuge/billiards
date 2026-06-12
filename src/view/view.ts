import {
  Scene,
  WebGLRenderer,
  Frustum,
  Matrix4,
  AmbientLight,
  Raycaster,
  Vector2,
  Vector3,
  Plane,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  BufferAttribute,
} from "three"
import { Camera } from "./camera"
import { LineData } from "../events/chatevent"
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
  readonly element
  table: Table
  loadAssets = true
  assets: Assets

  // Reuse objects to reduce garbage collection pressure in high-frequency rendering
  private readonly frustum = new Frustum()
  private readonly projScreenMatrix = new Matrix4()

  onLineDrawn?: (line: LineData) => void

  private readonly raycaster = new Raycaster()
  private readonly tablePlane = new Plane(new Vector3(0, 0, 1), 0)
  private isDrawingLine = false
  private lineStart = new Vector3()
  private previewLine: Line | null = null

  constructor(element, table, assets) {
    this.element = element
    this.table = table
    this.assets = assets
    this.renderer = renderer(element)
    this.camera = new Camera(
      element ? element.offsetWidth / element.offsetHeight : 1
    )
    this.initialiseScene()
    this.addInteractionListeners()
  }

  addLine(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    colour: string
  ) {
    const points = [
      new Vector3(p1.x, p1.y, 0.01),
      new Vector3(p2.x, p2.y, 0.01),
    ]
    const geometry = new BufferGeometry().setFromPoints(points)
    const material = new LineBasicMaterial({
      color: colour,
      transparent: true,
      opacity: 1,
    })
    const line = new Line(geometry, material)
    this.scene.add(line)

    let start: number | null = null
    const duration = 5000
    const fade = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = elapsed / duration
      if (progress < 1) {
        material.opacity = 1 - progress
        requestAnimationFrame(fade)
      } else {
        this.scene.remove(line)
        geometry.dispose()
        material.dispose()
      }
    }
    requestAnimationFrame(fade)
  }

  private addInteractionListeners() {
    const canvas = this.element as HTMLElement
    if (!canvas || typeof window === "undefined") return

    canvas.addEventListener("contextmenu", (e) => e.preventDefault())

    const toTable = (clientX: number, clientY: number): Vector3 | null => {
      const rect = canvas.getBoundingClientRect()
      const ndc = new Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      )
      this.raycaster.setFromCamera(ndc, this.camera.camera)
      const hit = new Vector3()
      return this.raycaster.ray.intersectPlane(this.tablePlane, hit)
        ? hit
        : null
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (e.button !== 2) return
      const hit = toTable(e.clientX, e.clientY)
      if (hit) {
        this.isDrawingLine = true
        this.lineStart.copy(hit)
        canvas.setPointerCapture(e.pointerId)
      }
    })

    canvas.addEventListener("pointermove", (e) => {
      if (!this.isDrawingLine) return
      const hit = toTable(e.clientX, e.clientY)
      if (hit) {
        if (!this.previewLine) {
          const geometry = new BufferGeometry()
          const positions = new Float32Array(6)
          geometry.setAttribute("position", new BufferAttribute(positions, 3))
          const material = new LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
          })
          this.previewLine = new Line(geometry, material)
          this.scene.add(this.previewLine)
        }
        const positions = this.previewLine.geometry.attributes.position
          .array as Float32Array
        positions[0] = this.lineStart.x
        positions[1] = this.lineStart.y
        positions[2] = 0.01
        positions[3] = hit.x
        positions[4] = hit.y
        positions[5] = 0.01
        this.previewLine.geometry.attributes.position.needsUpdate = true
      }
    })

    const endDrawing = (e: PointerEvent) => {
      if (!this.isDrawingLine) return
      this.isDrawingLine = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch (_) {}

      if (this.previewLine) {
        this.scene.remove(this.previewLine)
        this.previewLine.geometry.dispose()
        ;(this.previewLine.material as LineBasicMaterial).dispose()
        this.previewLine = null
      }
      const hit = toTable(e.clientX, e.clientY)
      if (hit && this.onLineDrawn && hit.distanceTo(this.lineStart) > 0.01) {
        this.onLineDrawn({
          p1: { x: this.lineStart.x, y: this.lineStart.y },
          p2: { x: hit.x, y: hit.y },
          colour: "#ffffff",
        })
      }
    }

    canvas.addEventListener("pointerup", endDrawing)
    canvas.addEventListener("pointercancel", endDrawing)
  }

  update(elapsed, aim: AimEvent) {
    this.camera.update(elapsed, aim)
  }

  sizeChanged() {
    return (
      this.windowWidth != this.element?.offsetWidth ||
      this.windowHeight != this.element?.offsetHeight
    )
  }

  updateSize() {
    const hasChanged = this.sizeChanged()
    if (hasChanged) {
      this.windowWidth = this.element?.offsetWidth
      this.windowHeight = this.element?.offsetHeight
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
    if (this.assets.rules.asset !== Snooker.tablemodel) {
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
