import {
  Group,
  EllipseCurve,
  BufferGeometry,
  LineLoop,
  LineBasicMaterial,
  Vector3,
} from "three"
import { R } from "../model/physics/constants"

export class ProximityIndicator {
  readonly group = new Group()
  private readonly rings: LineLoop[] = []
  private isTriggered = false

  constructor(count = 3) {
    this.group.position.z = -0.97 * R // Near table bed
    this.group.visible = false

    for (let i = 0; i < count; i++) {
      const multiplier = i + 2
      const radius = R * multiplier
      const curve = new EllipseCurve(0, 0, radius, radius)
      const geometry = new BufferGeometry().setFromPoints(curve.getPoints(32))
      const material = new LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6 / (i + 1),
      })
      const ring = new LineLoop(geometry, material)
      this.rings.push(ring)
      this.group.add(ring)
    }
  }

  showAt(pos: Vector3) {
    this.group.position.set(pos.x, pos.y, -0.97 * R)
    this.group.visible = true
  }

  hide() {
    this.group.visible = false
  }

  setTriggered(triggered: boolean) {
    if (this.isTriggered === triggered) return
    this.isTriggered = triggered

    const color = triggered ? 0xffff00 : 0xffffff
    this.rings.forEach((ring, i) => {
      const material = ring.material as LineBasicMaterial
      material.color.set(color)
      material.opacity = triggered ? 0.8 / (i + 1) : 0.6 / (i + 1)
    })
  }
}
