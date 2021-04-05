import { Vector3, Matrix4 } from "three"
import { Mesh, CylinderGeometry, BoxGeometry, MeshPhongMaterial } from "three"
import { Knuckle } from "../model/physics/knuckle"
import { Pocket } from "../model/physics/pocket"

export class TableGeometry {
  static tableX = 21.5
  static tableY = 10.5
  static X = TableGeometry.tableX + 0.5
  static Y = TableGeometry.tableY + 0.5
  static PX = TableGeometry.tableX + 1.6
  static PY = TableGeometry.tableY + 1.6
  static knuckleInset = 1.5
  static knuckleRadius = 0.5
  static middleKnuckleInset = 1.5
  static middleKnuckleRadius = 0.25
  static cornerRadius = 1.3
  static middleRadius = 0.5
  static readonly pockets = {
    pocketNW: {
      pocket: new Pocket(
        new Vector3(-TableGeometry.PX, TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          -TableGeometry.X + TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.X - TableGeometry.knuckleRadius,
          TableGeometry.Y - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketN: {
      pocket: new Pocket(
        new Vector3(0, TableGeometry.PY, 0),
        TableGeometry.middleRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          TableGeometry.Y + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
    },
    pocketS: {
      pocket: new Pocket(
        new Vector3(0, -TableGeometry.PY, 0),
        TableGeometry.middleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          -TableGeometry.Y - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
    },
    pocketNE: {
      pocket: new Pocket(
        new Vector3(TableGeometry.PX, TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          TableGeometry.X - TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.X + TableGeometry.knuckleRadius,
          TableGeometry.Y - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketSE: {
      pocket: new Pocket(
        new Vector3(TableGeometry.PX, -TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.X + TableGeometry.knuckleRadius,
          -TableGeometry.Y + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          TableGeometry.X - TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketSW: {
      pocket: new Pocket(
        new Vector3(-TableGeometry.PX, -TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          -TableGeometry.X + TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.X - TableGeometry.knuckleRadius,
          -TableGeometry.Y + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
  }

  static readonly knuckles = [
    TableGeometry.pockets.pocketNW.knuckleNE,
    TableGeometry.pockets.pocketNW.knuckleSW,
    TableGeometry.pockets.pocketN.knuckleNW,
    TableGeometry.pockets.pocketN.knuckleNE,
    TableGeometry.pockets.pocketS.knuckleSW,
    TableGeometry.pockets.pocketS.knuckleSE,
    TableGeometry.pockets.pocketNE.knuckleNW,
    TableGeometry.pockets.pocketNE.knuckleSE,
    TableGeometry.pockets.pocketSE.knuckleNE,
    TableGeometry.pockets.pocketSE.knuckleSW,
    TableGeometry.pockets.pocketSW.knuckleSE,
    TableGeometry.pockets.pocketSW.knuckleNW,
  ]

  static readonly pocketCenters = [
    TableGeometry.pockets.pocketNW.pocket,
    TableGeometry.pockets.pocketSW.pocket,
    TableGeometry.pockets.pocketN.pocket,
    TableGeometry.pockets.pocketS.pocket,
    TableGeometry.pockets.pocketNE.pocket,
    TableGeometry.pockets.pocketSE.pocket,
  ]

  static addToScene(scene) {
    TableGeometry.knuckles.forEach((k) =>
      TableGeometry.knuckleCylinder(k, scene)
    )
    TableGeometry.pocketCenters.forEach((p) =>
      TableGeometry.knuckleCylinder(p, scene)
    )
  }

  private static material = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
  })

  private static knuckleCylinder(knuckle, scene) {
    let k = TableGeometry.cylinder(knuckle.pos, knuckle.radius, 0.75, scene)
    k.position.setZ(-0.25 / 2)
  }

  private static cylinder(pos, radius, depth, scene) {
    var geometry = new CylinderGeometry(radius, radius, depth, 16)
    var mesh = new Mesh(geometry, TableGeometry.material)
    mesh.position.copy(pos)
    mesh.geometry.applyMatrix4(
      new Matrix4()
        .identity()
        .makeRotationAxis(new Vector3(1, 0, 0), Math.PI / 2)
    )
    scene.add(mesh)
    return mesh
  }

  static addCushions(scene) {
    let th = 10
    TableGeometry.plane(
      new Vector3(0, 0, -0.5 - th / 2),
      2 * TableGeometry.X,
      2 * TableGeometry.Y,
      th,
      scene
    )

    let d = 1
    let h = 0.75
    let e = -0.25 / 2
    let lengthN = Math.abs(
      TableGeometry.pockets.pocketNW.knuckleNE.pos.x -
        TableGeometry.pockets.pocketN.knuckleNW.pos.x
    )
    let lengthE = Math.abs(
      TableGeometry.pockets.pocketNW.knuckleSW.pos.y -
        TableGeometry.pockets.pocketSW.knuckleNW.pos.y
    )

    TableGeometry.plane(
      new Vector3(TableGeometry.X + d / 2, 0, e),
      d,
      lengthE,
      h,
      scene
    )
    TableGeometry.plane(
      new Vector3(-TableGeometry.X - d / 2, 0, e),
      d,
      lengthE,
      h,
      scene
    )

    TableGeometry.plane(
      new Vector3(-TableGeometry.X / 2, TableGeometry.Y + d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
    TableGeometry.plane(
      new Vector3(-TableGeometry.X / 2, -TableGeometry.Y - d / 2, e),
      lengthN,
      d,
      h,
      scene
    )

    TableGeometry.plane(
      new Vector3(TableGeometry.X / 2, TableGeometry.Y + d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
    TableGeometry.plane(
      new Vector3(TableGeometry.X / 2, -TableGeometry.Y - d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
  }

  private static plane(pos, x, y, z, scene) {
    var geometry = new BoxGeometry(x, y, z)
    var mesh = new Mesh(geometry, TableGeometry.material)
    mesh.receiveShadow = true
    mesh.position.copy(pos)
    scene.add(mesh)
  }
}
