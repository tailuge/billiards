import { Vector3 } from "three"
import { TableGeometry } from "./tablegeometry"
import { R } from "../model/physics/constants"

export class CameraTop {
  static readonly aspectLimit = 1.78
  static readonly portrait = 0.95
  static readonly fov = 20
  static zoomFactor = 1

  private static lastFov: number
  private static lastZoom: number
  private static cachedDist: number

  static viewPoint(aspectRatio, fov, target = new Vector3()) {
    if (
      fov !== CameraTop.lastFov ||
      CameraTop.zoomFactor !== CameraTop.lastZoom
    ) {
      CameraTop.cachedDist =
        CameraTop.zoomFactor / (2 * Math.tan((fov * Math.PI) / 360))
      CameraTop.lastFov = fov
      CameraTop.lastZoom = CameraTop.zoomFactor
    }
    const dist = CameraTop.cachedDist

    if (aspectRatio > this.portrait) {
      const factor =
        aspectRatio > CameraTop.aspectLimit
          ? 2.75 * TableGeometry.tableY
          : (2.4 * TableGeometry.tableX) / aspectRatio
      return target.set(0, -0.01 * R, dist * factor)
    }
    const factor =
      aspectRatio > 1 / CameraTop.aspectLimit
        ? 4.9 * TableGeometry.tableY
        : (1.35 * TableGeometry.tableX) / aspectRatio
    return target.set(-0.01 * R, 0, dist * factor)
  }
}
