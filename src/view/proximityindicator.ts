import {
  Group,
  EllipseCurve,
  BufferGeometry,
  LineLoop,
  LineBasicMaterial,
  Vector3,
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  CanvasTexture,
  LinearFilter,
  FrontSide,
} from "three"
import { R } from "../model/physics/constants"
import { Ball } from "../model/ball"

export class ProximityIndicator {
  readonly group = new Group()
  private readonly borders: LineLoop[] = []
  private readonly fills: Mesh[] = []
  private readonly proximityTexts: Mesh[] = []
  target: Ball | null = null
  threeCushionsMet: boolean = false
  cushionCount: number = 0
  hitTarget: boolean = false
  private minDistance: number = Infinity
  private readonly reusableVec = new Vector3()

  constructor() {
    if (typeof document === "undefined") {
      return
    }
    this.group.position.z = -0.97 * R // Near table bed
    this.group.visible = false

    const radii = [4, 3, 2]
    const borderOpacities = [0.15, 0.3, 0.5]
    const fillOpacities = [0.15, 0.35, 0.6] // Cumulative effect will make inner rings stronger
    const color = 0xffffff

    for (let i = 0; i < 3; i++) {
      const radius = R * radii[i]

      // 1. Static Unfilled Borders
      const curve = new EllipseCurve(0, 0, radius, radius)
      const geometry = new BufferGeometry().setFromPoints(curve.getPoints(64))
      const border = new LineLoop(
        geometry,
        new LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: borderOpacities[i],
        })
      )
      this.borders.push(border)
      this.group.add(border)
      border.visible = false

      // 2. Dynamic Filled Centers
      const fillGeo = new CircleGeometry(radius, 24)
      const fillMat = new MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: fillOpacities[i],
        side: FrontSide,
        depthWrite: false,
      })
      const fillMesh = new Mesh(fillGeo, fillMat)
      fillMesh.visible = false
      this.fills.push(fillMesh)
      this.group.add(fillMesh)
    }

    this.initTexts()
  }

  private initTexts() {
    if (this.proximityTexts.length === 0) {
      const labels = ["+1", "+2", "+3"]
      labels.forEach((label) => {
        const textMesh = this.createPlanarText(label)
        this.proximityTexts.push(textMesh)
        this.group.add(textMesh)
      })
    }
  }

  private createTextTexture(text: string): CanvasTexture {
    const canvas = document.createElement("canvas")
    const size = 64
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Clear background to full transparency
      ctx.clearRect(0, 0, size, size)

      // Text configuration
      ctx.font = "bold 44px sans-serif"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Render directly in the center of the 64x64 container
      ctx.fillText(text, size / 2, size / 2)
    }

    const texture = new CanvasTexture(canvas)
    texture.minFilter = LinearFilter
    return texture
  }

  private createPlanarText(text: string): Mesh {
    const size = R * 4
    const geometry = new PlaneGeometry(size, size)

    const texture = this.createTextTexture(text)

    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      side: FrontSide,
      depthWrite: false, // Prevents visual artifacts/flickering with rings below it
    })

    const textMesh = new Mesh(geometry, material)

    // Position flat on the table (X/Y world plane)
    // Shifted 1.25 * size along Y as per specification
    // Z is set to 0.01 relative to parent group to sit just above rings
    textMesh.position.set(0, 1.25 * size, 0.01)
    textMesh.rotation.set(0, 0, 0)
    textMesh.visible = false

    return textMesh
  }

  showAt(pos: Vector3) {
    this.group.position.set(pos.x, pos.y, -0.991 * R)
    this.group.visible = true

    // Fixed distance 4r from ball center toward table center
    const offset = this.reusableVec
      .set(-pos.x, -pos.y, 0)
      .normalize()
      .multiplyScalar(R * 4)

    this.proximityTexts.forEach((textMesh) => {
      textMesh.position.set(offset.x, offset.y, 0.01)
    })
  }

  hide() {
    this.group.visible = false
    this.fills.forEach((fill) => (fill.visible = false))
    this.borders.forEach((border) => (border.visible = false))
    this.proximityTexts.forEach((text) => (text.visible = false))
    this.target = null
    this.threeCushionsMet = false
    this.cushionCount = 0
    this.hitTarget = false
    this.minDistance = Infinity
  }

  setCushionCount(count: number) {
    // Reveal ring borders inside-out: count=1 shows 2R ring, count=2 adds 3R, count=3 adds 4R
    this.borders.forEach((border, i) => {
      border.visible = count >= 3 - i
    })
  }

  setProximity(distance: number) {
    this.minDistance = Math.min(this.minDistance, distance)
    const radii = [4, 3, 2]
    this.fills.forEach((fill, i) => {
      fill.visible = this.minDistance < radii[i] * R
    })

    if (this.proximityTexts.length === 3) {
      this.proximityTexts[0].visible =
        this.minDistance <= 4 * R && this.minDistance > 3 * R
      this.proximityTexts[1].visible =
        this.minDistance <= 3 * R && this.minDistance > 2 * R
      this.proximityTexts[2].visible = this.minDistance <= 2 * R
    }
  }
}
