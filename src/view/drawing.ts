import {
  Scene,
  Vector3,
  Vector2,
  Raycaster,
  Plane,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  Color,
  Camera,
} from "three"
import { LineData } from "../events/chatevent"
import { Session } from "../network/client/session"

const tempV1 = new Vector3()
const tempV2 = new Vector3()
const offsetZ = new Vector3(0, 0, 0.001)

export class Drawing {
  private readonly scene: Scene
  private readonly canvas: HTMLCanvasElement
  private readonly camera: () => Camera
  private readonly raycaster = new Raycaster()
  private readonly tablePlane = new Plane(new Vector3(0, 0, 1), 0)
  private readonly lines: Line[] = []

  private isDrawing = false
  private startPoint: Vector3 | null = null
  private previewLine: Line | null = null

  onLineDrawn?: (line: LineData) => void

  constructor(scene: Scene, canvas: HTMLCanvasElement, camera: () => Camera) {
    this.scene = scene
    this.canvas = canvas
    this.camera = camera
    this.addListeners()
  }

  private addListeners() {
    if (!this.canvas) return
    this.canvas.addEventListener("pointerdown", this.onPointerDown)
    this.canvas.addEventListener("pointermove", this.onPointerMove)
    this.canvas.addEventListener("pointerup", this.onPointerUp)
    this.canvas.addEventListener("pointercancel", this.onPointerUp)
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  private toTable(clientX: number, clientY: number): Vector3 | null {
    const rect = this.canvas.getBoundingClientRect()
    const ndc = new Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    this.raycaster.setFromCamera(ndc, this.camera())
    const hit = new Vector3()
    return this.raycaster.ray.intersectPlane(this.tablePlane, hit) ? hit : null
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 2) return
    const point = this.toTable(e.clientX, e.clientY)
    if (point) {
      this.isDrawing = true
      this.startPoint = point
      this.canvas.setPointerCapture(e.pointerId)
    }
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDrawing || !this.startPoint) return
    const endPoint = this.toTable(e.clientX, e.clientY)
    if (endPoint) {
      this.updatePreview(this.startPoint, endPoint)
    }
  }

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDrawing || !this.startPoint) return
    this.isDrawing = false
    const endPoint = this.toTable(e.clientX, e.clientY)
    if (endPoint && this.startPoint.distanceTo(endPoint) > 0.01) {
      const lineData: LineData = {
        p1: { x: this.startPoint.x, y: this.startPoint.y },
        p2: { x: endPoint.x, y: endPoint.y },
        colour: Session.playerIndex() === 1 ? "#ffaa11" : "#ffffff",
      }
      this.onLineDrawn?.(lineData)
      this.addLine(lineData)
    }
    this.removePreview()
    this.canvas.releasePointerCapture(e.pointerId)
  }

  private updatePreview(p1: Vector3, p2: Vector3) {
    if (!this.previewLine) {
      const geometry = new BufferGeometry().setFromPoints([
        tempV1.copy(p1).add(offsetZ),
        tempV2.copy(p2).add(offsetZ),
      ])
      const material = new LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      })
      this.previewLine = new Line(geometry, material)
      this.scene.add(this.previewLine)
    } else {
      this.previewLine.geometry.setFromPoints([
        tempV1.copy(p1).add(offsetZ),
        tempV2.copy(p2).add(offsetZ),
      ])
    }
  }

  private removePreview() {
    if (this.previewLine) {
      this.scene.remove(this.previewLine)
      this.previewLine.geometry.dispose()
      ;(this.previewLine.material as LineBasicMaterial).dispose()
      this.previewLine = null
    }
  }

  addLine(data: LineData) {
    const p1 = new Vector3(data.p1.x, data.p1.y, 0.001) // Slightly above table
    const p2 = new Vector3(data.p2.x, data.p2.y, 0.001)
    const geometry = new BufferGeometry().setFromPoints([p1, p2])
    const material = new LineBasicMaterial({
      color: new Color(data.colour),
      opacity: 0.25,
      linewidth: 2,
      transparent: true,
    })
    const line = new Line(geometry, material)
    this.scene.add(line)
    this.lines.push(line)
  }

  undo() {
    const line = this.lines.pop()
    if (line) {
      this.scene.remove(line)
      line.geometry.dispose()
      ;(line.material as LineBasicMaterial).dispose()
    }
  }

  clear() {
    this.lines.forEach((line) => {
      this.scene.remove(line)
      line.geometry.dispose()
      ;(line.material as LineBasicMaterial).dispose()
    })
    this.lines.length = 0
  }
}
