import { Table } from "../model/table"
import { AimEvent } from "../events/aimevent"
import { Mesh, Raycaster, Vector3 } from "three"
import { unitAtAngle } from "./three-utils"
import { CueMesh } from "../view/cuemesh"

const tempVec = new Vector3()
const tempVec2 = new Vector3()
const raycaster = new Raycaster()

export function cueIntersectsAnything(
  table: Table,
  aim: AimEvent,
  offset: Vector3
): boolean {
  const origin = tempVec.copy(table.cueball.pos).add(offset)
  const theta = CueMesh.baseTilt + aim.elevation
  const direction = unitAtAngle(aim.angle + Math.PI, tempVec2)
  direction.multiplyScalar(Math.cos(theta))
  direction.z = Math.sin(theta)
  raycaster.set(origin, direction)
  const items: Mesh[] = []
  for (const b of table.balls) {
    items.push(b.ballmesh.mesh)
  }
  if (table.mesh) {
    items.push(table.mesh)
  }
  const intersections = raycaster.intersectObjects(items, true)
  return intersections.length > 0
}
