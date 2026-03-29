import {
  Vector3,
  Mesh,
  CylinderGeometry,
  BoxGeometry,
  MeshPhongMaterial,
  PointLight,
  Group,
  BufferGeometry,
  Matrix4,
} from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { TableGeometry } from "./tablegeometry"
import { PocketGeometry } from "./pocketgeometry"
import { R } from "../model/physics/constants"

export class TableMesh {
  logger = (_) => {}

  static mesh

  generateTable(hasPockets: boolean) {
    const group = new Group()
    const light = new PointLight(0xf0f0e8, 22)
    light.position.set(0, 0, R * 50)
    group.add(light)

    const clothGeometries: BufferGeometry[] = []
    const cushionGeometries: BufferGeometry[] = []
    const pocketGeometries: BufferGeometry[] = []

    this.addCushions(clothGeometries, cushionGeometries, hasPockets)

    if (hasPockets) {
      PocketGeometry.knuckles.forEach((k) =>
        this.knuckleCylinder(k, clothGeometries)
      )
      PocketGeometry.pocketCenters.forEach((p) =>
        this.knuckleCylinder(p, pocketGeometries)
      )

      const p = PocketGeometry.pockets.pocketNW.pocket
      const k = PocketGeometry.pockets.pocketNW.knuckleNE
      this.logger(
        "knuckle-pocket gap = " +
          (p.pos.distanceTo(k.pos) - p.radius - k.radius)
      )
    }

    if (clothGeometries.length > 0) {
      const clothMesh = new Mesh(
        mergeGeometries(clothGeometries),
        this.cloth
      )
      group.add(clothMesh)
    }

    if (cushionGeometries.length > 0) {
      const cushionMesh = new Mesh(
        mergeGeometries(cushionGeometries),
        this.cushion
      )
      cushionMesh.receiveShadow = true
      group.add(cushionMesh)
    }

    if (pocketGeometries.length > 0) {
      const pocketMesh = new Mesh(
        mergeGeometries(pocketGeometries),
        this.pocket
      )
      group.add(pocketMesh)
    }

    return group
  }

  private readonly cloth = new MeshPhongMaterial({
    color: 0x4455b9,
    wireframe: false,
    flatShading: true,
    transparent: false,
  })

  private readonly cushion = new MeshPhongMaterial({
    color: 0x5465b9,
    wireframe: false,
    flatShading: true,
    transparent: false,
  })

  private readonly pocket = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.3,
  })

  private knuckleCylinder(knuckle, geometries) {
    const depth = (R * 0.75) / 0.5
    const geometry = new CylinderGeometry(
      knuckle.radius,
      knuckle.radius,
      depth,
      16
    )
    const matrix = new Matrix4()
    matrix.makeRotationX(Math.PI / 2)
    matrix.setPosition(
      knuckle.pos.x,
      knuckle.pos.y,
      knuckle.pos.z - (R * 0.25) / 0.5 / 2
    )
    geometry.applyMatrix4(matrix)
    geometries.push(geometry)
  }

  addCushions(clothGeometries, cushionGeometries, hasPockets) {
    const th = (R * 10) / 0.5
    const baseGeom = new BoxGeometry(
      2 * TableGeometry.X,
      2 * TableGeometry.Y,
      th
    )
    baseGeom.applyMatrix4(
      new Matrix4().makeTranslation(0, 0, -R - th / 2)
    )
    clothGeometries.push(baseGeom)

    const d = (R * 1) / 0.5
    const h = (R * 0.75) / 0.5
    const e = (-R * 0.25) / 0.5 / 2
    const X = TableGeometry.X
    const Y = TableGeometry.Y

    let lengthN = Math.abs(
      PocketGeometry.pockets.pocketNW.knuckleNE.pos.x -
        PocketGeometry.pockets.pocketN.knuckleNW.pos.x
    )
    let lengthE = Math.abs(
      PocketGeometry.pockets.pocketNW.knuckleSW.pos.y -
        PocketGeometry.pockets.pocketSW.knuckleNW.pos.y
    )

    if (!hasPockets) {
      lengthN = 2 * TableGeometry.Y
      lengthE = 2 * TableGeometry.Y + 4 * R
    }

    this.addBox(new Vector3(X + d / 2, 0, e), d, lengthE, h, cushionGeometries)
    this.addBox(new Vector3(-X - d / 2, 0, e), d, lengthE, h, cushionGeometries)

    this.addBox(
      new Vector3(-X / 2, Y + d / 2, e),
      lengthN,
      d,
      h,
      cushionGeometries
    )
    this.addBox(
      new Vector3(-X / 2, -Y - d / 2, e),
      lengthN,
      d,
      h,
      cushionGeometries
    )

    this.addBox(
      new Vector3(X / 2, Y + d / 2, e),
      lengthN,
      d,
      h,
      cushionGeometries
    )
    this.addBox(
      new Vector3(X / 2, -Y - d / 2, e),
      lengthN,
      d,
      h,
      cushionGeometries
    )
  }

  private addBox(pos, x, y, z, geometries) {
    const geometry = new BoxGeometry(x, y, z)
    geometry.applyMatrix4(new Matrix4().makeTranslation(pos.x, pos.y, pos.z))
    geometries.push(geometry)
  }
}
