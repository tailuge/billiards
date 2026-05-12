import {
  LineBasicMaterial,
  LineSegments,
  BufferGeometry,
  Vector3,
  Group,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
} from "three"
import { TableGeometry } from "./tablegeometry"
import { R } from "../model/physics/constants"

export class TableMarkings {
  private readonly darkGreen = 0x052e14
  private readonly lineMaterial = new LineBasicMaterial({
    color: this.darkGreen,
    opacity: 0.25,
    transparent: true,
  })

  private readonly spotMaterial = new MeshBasicMaterial({
    color: this.darkGreen,
    opacity: 0.3,
    transparent: true,
    depthWrite: false,
  })

  generate(): Group {
    const group = new Group()
    group.add(this.baulkLine())
    group.add(this.footSpot())
    group.add(this.headSpot())
    return group
  }

  private z(): number {
    return (-R * 0.485) / 0.5
  }

  private baulkLine(): LineSegments {
    const z = this.z()
    const x = -TableGeometry.tableX * 0.3
    const points = [
      new Vector3(x, -TableGeometry.tableY, z),
      new Vector3(x, TableGeometry.tableY, z),
    ]
    return new LineSegments(
      new BufferGeometry().setFromPoints(points),
      this.lineMaterial
    )
  }

  private footSpot(): Mesh {
    const z = this.z()
    const x = TableGeometry.tableX * 0.45
    const spot = new Mesh(new CircleGeometry(R * 0.2, 16), this.spotMaterial)
    spot.position.set(x, 0, z)
    spot.rotation.x = -Math.PI / 2
    return spot
  }

  private headSpot(): Mesh {
    const z = this.z()
    const x = -TableGeometry.tableX * 0.3
    const spot = new Mesh(new CircleGeometry(R * 0.15, 16), this.spotMaterial)
    spot.position.set(x, 0, z)
    spot.rotation.x = -Math.PI / 2
    return spot
  }
}
