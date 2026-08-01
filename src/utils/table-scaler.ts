import { Mesh, Object3D } from "three"

export const modelExtentX = 16000
export const modelExtentY = 9200

export function scaleTableModel(
  scene: Object3D,
  stretchX: number,
  stretchY: number
): void {
  const group = scene.children[0]
  if (!group) return

  const gsx = group.scale.x
  const gsy = group.scale.y

  scene.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh || !mesh.geometry) return

    let geometry = mesh.geometry
    if (!geometry.attributes.position) return

    // Clone to avoid modifying shared geometry (GLTF shares geometry between meshes)
    geometry = geometry.clone()

    if (geometry.index) {
      geometry = geometry.toNonIndexed()
    }
    mesh.geometry = geometry
    const position = geometry.attributes.position

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      if (x > modelExtentX * 0.75) {
        position.setX(i, x + 2 * stretchX)
      } else if (x > modelExtentX * 0.25) {
        position.setX(i, x + stretchX)
      }
      if (y > modelExtentY * 0.75) {
        position.setY(i, y + 2 * stretchY)
      } else if (y > modelExtentY * 0.25) {
        position.setY(i, y + stretchY)
      }
    }

    position.needsUpdate = true
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()
  })

  // Re-center: vertex shifts move model center by ~stretch in local coords.
  // Compensate by shifting the Group node back.
  group.position.x -= stretchX * gsx
  group.position.y -= stretchY * gsy
}
