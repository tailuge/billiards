import {
  Vector3,
  Matrix4,
  Mesh,
  CylinderGeometry,
  BoxGeometry,
  MeshPhongMaterial,
} from "three"
import { TableGeometry } from "./tablegeometry"
import { PocketGeometry } from "./pocketgeometry"

export class TableMesh {
  addToScene(scene) {
    PocketGeometry.knuckles.forEach((k) => this.knuckleCylinder(k, scene))
    PocketGeometry.pocketCenters.forEach((p) => this.knuckleCylinder(p, scene))
    /*
    const p = TableGeometry.pockets.pocketNW.pocket
    const k = TableGeometry.pockets.pocketNW.knuckleNE
    console.log("knuckle-pocket gap = " + (p.pos.distanceTo(k.pos) - p.radius - k.radius))
    */
  }

  private material = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.4,
  })

  private knuckleCylinder(knuckle, scene) {
    const k = this.cylinder(knuckle.pos, knuckle.radius, 0.75, scene)
    k.position.setZ(-0.25 / 2)
  }

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
      PocketGeometry.pockets.pocketNW.knuckleNE.pos.x -
        PocketGeometry.pockets.pocketN.knuckleNW.pos.x
    )
    const lengthE = Math.abs(
      PocketGeometry.pockets.pocketNW.knuckleSW.pos.y -
        PocketGeometry.pockets.pocketSW.knuckleNW.pos.y
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

  private plane(pos, x, y, z, scene) {
    const geometry = new BoxGeometry(x, y, z)
    const mesh = new Mesh(geometry, this.material)
    mesh.receiveShadow = true
    mesh.position.copy(pos)
    scene.add(mesh)
  }
}
