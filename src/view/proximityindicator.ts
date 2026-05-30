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
  DoubleSide,
  MeshStandardMaterial,
} from "three"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { R } from "../model/physics/constants"
import { Assets } from "./assets"
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

  constructor() {
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
        side: DoubleSide,
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
    if (Assets.font && this.proximityTexts.length === 0) {
      const labels = ["+1", "+2", "+3"]
      labels.forEach((label) => {
        const textMesh = this.create3DText(label)
        if (textMesh) {
          this.proximityTexts.push(textMesh)
          this.group.add(textMesh)
        }
      })
    }
  }

  private create3DText(text: string): Mesh | null {
    if (!Assets.font) return null

    const textGeo = new TextGeometry(text, {
      font: Assets.font,
      size: R * 4,
      height: 0.1 * R,
      curveSegments: 1,
      bevelEnabled: false,
    })

    textGeo.center()

    const textMat = new MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
      roughness: 0.5,
      metalness: 0.1,
    })

    const textMesh = new Mesh(textGeo, textMat)

    // Offset so it sits next to the ball, flat on the table bed
    // In this project, table is in X/Y, Z is height.
    // The group is already at Z = -0.97*R.
    // We want the text to be slightly above the rings and ball.
    // Parent group is added to scene at Z=0? No, table.addToScene adds it to the scene.
    // Advance(t) calls this.proximityIndicator.showAt(pos) which sets group Z to -0.97*R.
    // So we want the text relative to the group.
    textMesh.position.set(0, 1.25 * R * 4, 0)
    textMesh.rotation.set(0, 0, 0) // Flat on the XY plane (table surface)
    textMesh.castShadow = true
    textMesh.visible = false

    return textMesh
  }

  showAt(pos: Vector3) {
    this.group.position.set(pos.x, pos.y, -0.97 * R)
    this.group.visible = true
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

    if (this.proximityTexts.length === 0 && Assets.font) {
      this.initTexts()
    }

    if (this.proximityTexts.length === 3) {
      this.proximityTexts[0].visible =
        this.minDistance <= 4 * R && this.minDistance > 3 * R
      this.proximityTexts[1].visible =
        this.minDistance <= 3 * R && this.minDistance > 2 * R
      this.proximityTexts[2].visible = this.minDistance <= 2 * R
    }
  }
}
