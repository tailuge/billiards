import {
  Vector3,
  Matrix4,
  Mesh,
  CylinderGeometry,
  BoxGeometry,
  MeshPhongMaterial,
} from "three"
import { TableGeometry } from "./tablegeometry"

export class TableMesh {
  addToScene(scene) {
    TableGeometry.knuckles.forEach((k) => this.knuckleCylinder(k, scene))
    TableGeometry.pocketCenters.forEach((p) => this.knuckleCylinder(p, scene))
    /*
    const p = TableGeometry.pockets.pocketNW.pocket
    const k = TableGeometry.pockets.pocketNW.knuckleNE
    console.log("knuckle-pocket gap = " + (p.pos.distanceTo(k.pos) - p.radius - k.radius))
    */
  }

  /* istanbul ignore next */
  private material = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.4,
  })

  /* istanbul ignore next */
  private knuckleCylinder(knuckle, scene) {
    const k = this.cylinder(knuckle.pos, knuckle.radius, 0.75, scene)
    k.position.setZ(-0.25 / 2)
  }

  /* istanbul ignore next */
  private cylinder(pos, radius, depth, scene) {
    const geometry = new CylinderGeometry(radius, radius, depth, 16)
    const mesh = new Mesh(geometry, this.material)
    mesh.position.copy(pos)
    mesh.geometry.applyMatrix4(
      new Matrix4()
        .identity()
        .makeRotationAxis(new Vector3(1, 0, 0), Math.PI / 2)
    )
    scene.add(mesh)
    return mesh
  }

  /* istanbul ignore next */
  addCushions(scene) {
    const th = 10
    this.plane(
      new Vector3(0, 0, -0.5 - th / 2),
      2 * TableGeometry.X,
      2 * TableGeometry.Y,
      th,
      scene
    )

    const d = 1
    const h = 0.75
    const e = -0.25 / 2
    const lengthN = Math.abs(
      TableGeometry.pockets.pocketNW.knuckleNE.pos.x -
        TableGeometry.pockets.pocketN.knuckleNW.pos.x
    )
    const lengthE = Math.abs(
      TableGeometry.pockets.pocketNW.knuckleSW.pos.y -
        TableGeometry.pockets.pocketSW.knuckleNW.pos.y
    )

    this.plane(new Vector3(TableGeometry.X + d / 2, 0, e), d, lengthE, h, scene)
    this.plane(
      new Vector3(-TableGeometry.X - d / 2, 0, e),
      d,
      lengthE,
      h,
      scene
    )

    this.plane(
      new Vector3(-TableGeometry.X / 2, TableGeometry.Y + d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
    this.plane(
      new Vector3(-TableGeometry.X / 2, -TableGeometry.Y - d / 2, e),
      lengthN,
      d,
      h,
      scene
    )

    this.plane(
      new Vector3(TableGeometry.X / 2, TableGeometry.Y + d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
    this.plane(
      new Vector3(TableGeometry.X / 2, -TableGeometry.Y - d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
  }

  /* istanbul ignore next */
  private plane(pos, x, y, z, scene) {
    const geometry = new BoxGeometry(x, y, z)
    const mesh = new Mesh(geometry, this.material)
    mesh.receiveShadow = true
    mesh.position.copy(pos)
    scene.add(mesh)
  }
}
