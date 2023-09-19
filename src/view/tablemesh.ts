import {
  Vector3,
  Matrix4,
  Mesh,
  CylinderGeometry,
  BoxGeometry,
  MeshPhongMaterial,
  PointLight,
} from "three"
import { TableGeometry } from "./tablegeometry"
import { PocketGeometry } from "./pocketgeometry"
import { R } from "../model/physics/constants"

export class TableMesh {
  addToScene(scene) {
    const light = new PointLight(0xf0f0f0, 9.0)
    light.position.set(0, 0, R * 30)
    scene.add(light)

    PocketGeometry.knuckles.forEach((k) => this.knuckleCylinder(k, scene))
    PocketGeometry.pocketCenters.forEach((p) =>
      this.knuckleCylinder(p, scene, this.pocket)
    )
    this.addCushions(scene)

    const p = PocketGeometry.pockets.pocketNW.pocket
    const k = PocketGeometry.pockets.pocketNW.knuckleNE
    typeof process !== "object" &&
      console.log(
        "knuckle-pocket gap = " +
          (p.pos.distanceTo(k.pos) - p.radius - k.radius)
      )
  }

  private cloth = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
    transparent: false,
  })

  private pocket = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.3,
  })

  private knuckleCylinder(knuckle, scene, material = this.cloth) {
    const k = this.cylinder(
      knuckle.pos,
      knuckle.radius,
      (R * 0.75) / 0.5,
      scene,
      material
    )
    k.position.setZ((-R * 0.25) / 0.5 / 2)
  }

  private cylinder(pos, radius, depth, scene, material) {
    const geometry = new CylinderGeometry(radius, radius, depth, 16)
    const mesh = new Mesh(geometry, material)
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
    const th = (R * 10) / 0.5
    this.plane(
      new Vector3(0, 0, -R - th / 2),
      2 * TableGeometry.X,
      2 * TableGeometry.Y,
      th,
      scene
    )

    const d = (R * 1) / 0.5
    const h = (R * 0.75) / 0.5
    const e = (-R * 0.25) / 0.5 / 2
    const lengthN = Math.abs(
      PocketGeometry.pockets.pocketNW.knuckleNE.pos.x -
        PocketGeometry.pockets.pocketN.knuckleNW.pos.x
    )
    const lengthE = Math.abs(
      PocketGeometry.pockets.pocketNW.knuckleSW.pos.y -
        PocketGeometry.pockets.pocketSW.knuckleNW.pos.y
    )

    const X = TableGeometry.X
    const Y = TableGeometry.Y
    this.plane(new Vector3(X + d / 2, 0, e), d, lengthE, h, scene)
    this.plane(new Vector3(-X - d / 2, 0, e), d, lengthE, h, scene)

    this.plane(new Vector3(-X / 2, Y + d / 2, e), lengthN, d, h, scene)
    this.plane(new Vector3(-X / 2, -Y - d / 2, e), lengthN, d, h, scene)

    this.plane(new Vector3(X / 2, Y + d / 2, e), lengthN, d, h, scene)
    this.plane(new Vector3(X / 2, -Y - d / 2, e), lengthN, d, h, scene)
  }

  private plane(pos, x, y, z, scene, material = this.cloth) {
    const geometry = new BoxGeometry(x, y, z)
    const mesh = new Mesh(geometry, material)
    mesh.receiveShadow = true
    mesh.position.copy(pos)
    scene.add(mesh)
  }
}
