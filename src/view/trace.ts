import {
  LineBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Line,
  Vector3,
} from "three"

export class Trace {
  readonly line: Line
  readonly geometry
  readonly positions
  readonly lastPos = new Vector3()
  readonly lastVel = new Vector3()

  constructor(size, colour) {
    this.geometry = new BufferGeometry()
    this.positions = new Float32Array(size * 3)
    this.geometry.setAttribute(
      "position",
      new BufferAttribute(this.positions, 3)
    )
    this.reset()
    const material = new LineBasicMaterial({
      color: colour,
      opacity: 0.25,
      linewidth: 3,
      transparent: true,
    })
    this.line = new Line(this.geometry, material)
    this.line.visible = false
  }

  reset() {
    this.geometry.setDrawRange(0, 0)
  }

  addTrace(pos, vel) {
    const curvature = this.lastVel.angleTo(vel)
    const delta = curvature > Math.PI / 32 ? 0.01 : 0.5
    this.addTraceAfterDelta(pos, vel, delta)
  }

  addTraceAfterDelta(pos, vel, delta) {
    if (this.lastPos.distanceTo(pos) > delta) {
      this.addPoint(pos)
      this.lastPos.copy(pos)
      this.lastVel.copy(vel)
    }
  }

  addPoint(pos) {
    let index = this.geometry.drawRange.count * 3
    if (index > this.positions.length) {
      return
    }
    this.positions[index++] = pos.x
    this.positions[index++] = pos.y
    this.positions[index] = pos.z
    this.geometry.setDrawRange(0, this.geometry.drawRange.count + 1)
    this.line.geometry.attributes.position.needsUpdate = true
  }
}
