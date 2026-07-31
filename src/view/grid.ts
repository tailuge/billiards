import { LineBasicMaterial, LineSegments, Vector3, BufferGeometry } from "three"
import { TableGeometry } from "./tablegeometry"
import { R } from "../model/physics/constants"
import { Rack } from "../utils/rack"

export class Grid {
  readonly material = new LineBasicMaterial({
    color: 0x000084,
    opacity: 0.15,
    transparent: true,
  })

  readonly snookerMaterial = new LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.18,
    transparent: true,
  })

  public generateLineSegments(isSnooker = false) {
    if (isSnooker) {
      return this.generateSnookerLines()
    }
    return this.generateStandardGrid()
  }

  private generateStandardGrid() {
    const urlParams = new URLSearchParams(globalThis.location?.search ?? "")
    const tableSize = parseFloat(urlParams.get("tableSize") || "10")

    const points = [
      this.point(0, ((tableSize / 10) * (-11.13 * R)) / 0.5),
      this.point(0, ((tableSize / 10) * (11.13 * R)) / 0.5),
    ]

    const stepx = TableGeometry.X / 4
    const xs = [1, 2, 3, -1, -2, -3]
    const yedge = TableGeometry.tableY + R
    xs.forEach((x) => {
      points.push(this.point(x * stepx, -yedge), this.point(x * stepx, yedge))
    })

    const stepy = (TableGeometry.Y + R) / 2
    const ys = [-1, 0, 1]
    const xedge = TableGeometry.tableX + R
    ys.forEach((y) => {
      points.push(this.point(-xedge, y * stepy), this.point(xedge, y * stepy))
    })

    const geometry = new BufferGeometry().setFromPoints(points)
    return new LineSegments(geometry, this.material)
  }

  /** Generate snooker-specific table markings:
   * - Baulk line across the full table width
   * - D semicircle centred on the baulk line, radius Rack.sixth
   * - Small crosses at the Brown, Blue, Pink, and Black spots */
  private generateSnookerLines() {
    const points: Vector3[] = []

    // ── Baulk line ──────────────────────────────────────────────
    const baulkX = Rack.baulk
    const tableY = TableGeometry.tableY
    points.push(
      this.point(baulkX, -tableY - 2 * R),
      this.point(baulkX, tableY + 2 * R)
    )

    // ── D semicircle (π/2 → 3π/2, the negative-x / baulk-cushion side) ──
    const cx = Rack.baulk
    const cy = 0
    const radius = Rack.sixth
    const arcSegments = 32
    for (let i = 0; i < arcSegments; i++) {
      const a0 = Math.PI / 2 + (i / arcSegments) * Math.PI
      const a1 = Math.PI / 2 + ((i + 1) / arcSegments) * Math.PI
      points.push(
        this.point(cx + radius * Math.cos(a0), cy + radius * Math.sin(a0)),
        this.point(cx + radius * Math.cos(a1), cy + radius * Math.sin(a1))
      )
    }

    // ── Crosses at the 4 key colour spots ────────────────────────
    const crossSize = R * 0.4
    const dx = TableGeometry.X / 2
    const black = TableGeometry.X - (TableGeometry.X * 2) / 11
    const spots: [number, number][] = [
      [Rack.baulk, 0], // Brown
      [0, 0], // Blue
      [dx, 0], // Pink
      [black, 0], // Black
    ]
    for (const [sx, sy] of spots) {
      points.push(
        this.point(sx - crossSize, sy),
        this.point(sx + crossSize, sy),
        this.point(sx, sy - crossSize),
        this.point(sx, sy + crossSize)
      )
    }

    const geometry = new BufferGeometry().setFromPoints(points)
    return new LineSegments(geometry, this.snookerMaterial)
  }

  private point(x, y) {
    const z = (-R * 0.485) / 0.5
    return new Vector3(x, y, z)
  }
}
