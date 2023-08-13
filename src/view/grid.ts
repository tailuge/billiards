import { LineBasicMaterial, LineSegments, Vector3, BufferGeometry } from "three"
import { TableGeometry } from "./tablegeometry"

const R = 0.5

export class Grid {
  readonly z = -0.49
  readonly material = new LineBasicMaterial({
    color: 0x000084,
    opacity: 0.3,
    transparent: true,
  })

  public generateLineSegments() {
    const points = [this.point(0, -11.13), this.point(0, 11.13)]

    const stepx = (TableGeometry.tableX + 2 * R) / 4
    const xs = [1, 2, 3, -1, -2, -3]
    const yedge = TableGeometry.tableY + R
    xs.forEach((x) => {
      points.push(this.point(x * stepx, -yedge))
      points.push(this.point(x * stepx, yedge))
    })

    const stepy = (TableGeometry.tableY + 2 * R) / 2
    const ys = [-1, 0, 1]
    const xedge = TableGeometry.tableX + R
    ys.forEach((y) => {
      points.push(this.point(-xedge, y * stepy))
      points.push(this.point(xedge, y * stepy))
    })

    const geometry = new BufferGeometry().setFromPoints(points)
    return new LineSegments(geometry, this.material)
  }

  private point(x, y) {
    const z = -0.485
    return new Vector3(x, y, z)
  }
}
