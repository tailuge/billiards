import { Vector3 } from "three"
import { TableGeometry } from "./tablegeometry"

export class CameraTop {
  static aspectLimit = 1.78
  static portrait = 0.75
  static viewPoint(aspectRatio, fov) {
    const dist = 1 / (2 * Math.tan((fov * Math.PI) / 360))
    if (aspectRatio > this.portrait) {
      const factor =
        aspectRatio > CameraTop.aspectLimit
          ? 2.75 * TableGeometry.tableY
          : (2.4 * TableGeometry.tableX) / aspectRatio
      return new Vector3(0, -0.1, dist * factor)
    }
    const factor =
      aspectRatio > 1 / CameraTop.aspectLimit
        ? 4.9 * TableGeometry.tableY
        : (1.35 * TableGeometry.tableX) / aspectRatio
    return new Vector3(-0.1, 0, dist * factor)
  }
}
