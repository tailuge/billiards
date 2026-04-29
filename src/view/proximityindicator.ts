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
} from "three"
import { R } from "../model/physics/constants"

export class ProximityIndicator {
  readonly group = new Group()
  private readonly borders: LineLoop[] = []
  private readonly fills: Mesh[] = []
  private isTriggered = false

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
      border.position.z = 0.001
      this.borders.push(border)
      this.group.add(border)

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
      // Offset slightly to prevent z-fighting within stacks
      fillMesh.position.z = (radii.length - i) * 0.002
      fillMesh.visible = false
      this.fills.push(fillMesh)
      this.group.add(fillMesh)
    }
  }

  showAt(pos: Vector3) {
    this.group.position.set(pos.x, pos.y, -0.97 * R)
    this.group.visible = true
  }

  hide() {
    this.group.visible = false
  }

  setProximity(distance: number) {
    const radii = [4, 3, 2]
    this.fills.forEach((fill, i) => {
      fill.visible = distance < radii[i] * R
    })
  }

  setTriggered(triggered: boolean) {
    this.isTriggered = triggered
    const color = triggered ? 0xffff00 : 0xffffff
    this.borders.forEach((border) => {
      ;(border.material as LineBasicMaterial).color.set(color)
    })
    this.fills.forEach((fill) => {
      ;(fill.material as MeshBasicMaterial).color.set(color)
    })
  }
}
