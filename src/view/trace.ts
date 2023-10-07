import {
  LineBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Line,
  Vector3,
} from "three"
import { R } from "../model/physics/constants"

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
    this.lastVel.setZ(1)
  }

  forceTrace(pos) {
    this.lastVel.z = 1
    this.addTraceGiven(pos, this.lastVel, 1, 0.1, 1)
  }

  addTrace(pos, vel) {
    if (vel.length() === 0) {
      return
    }
    const curvature = this.lastVel.angleTo(vel)
    const delta = curvature > Math.PI / 32 ? 0.01 * R : R
    const distance = this.lastPos.distanceTo(pos)
    this.addTraceGiven(pos, vel, distance, delta, curvature)
  }

  addTraceGiven(pos, vel, distance, delta, curvature) {
    let index = this.geometry.drawRange.count

    if (index !== 0 && distance < delta) {
      return
    }

    if (index > 1 && curvature < 0.0001) {
      index--
    }

    this.lastPos.copy(pos)
    this.lastVel.copy(vel)
    this.addPoint(pos, index)
  }

  addPoint(pos, i) {
    let index = i * 3
    if (index > this.positions.length) {
      return
    }
    this.positions[index++] = pos.x
    this.positions[index++] = pos.y
    this.positions[index] = pos.z
    this.geometry.setDrawRange(0, i + 1)
    this.line.geometry.attributes.position.needsUpdate = true
  }
}
