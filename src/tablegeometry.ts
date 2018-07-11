import { Vector3, Matrix4 } from "three"
import { Mesh, CylinderGeometry, MeshPhongMaterial } from "three"
import { Knuckle } from "./knuckle"

export class TableGeometry {
  static tableX = 21
  static tableY = 11

  static knuckleInset = 1
  static knuckleRadius = 0.5
  static middleKnuckleInset = 1
  static middleKnuckleRadius = 0.5

  static readonly pockets = {
    pocketNW: {
      knuckleNE: new Knuckle(
        new Vector3(
          -TableGeometry.tableX + TableGeometry.knuckleInset,
          TableGeometry.tableY + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.tableX - TableGeometry.knuckleRadius,
          TableGeometry.tableY - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      )
    },
    pocketN: {
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.knuckleInset,
          TableGeometry.tableY + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          TableGeometry.tableY + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      )
    },
    pocketS: {
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.knuckleInset,
          -TableGeometry.tableY - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          -TableGeometry.tableY - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      )
    },
    pocketNE: {
      knuckleNW: new Knuckle(
        new Vector3(
          TableGeometry.tableX - TableGeometry.knuckleInset,
          TableGeometry.tableY + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.tableX + TableGeometry.knuckleRadius,
          TableGeometry.tableY - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      )
    },
    pocketSE: {
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.tableX + TableGeometry.knuckleRadius,
          -TableGeometry.tableY + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          TableGeometry.tableX - TableGeometry.knuckleInset,
          -TableGeometry.tableY - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      )
    },
    pocketSW: {
      knuckleSE: new Knuckle(
        new Vector3(
          -TableGeometry.tableX + TableGeometry.knuckleInset,
          -TableGeometry.tableY - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.tableX - TableGeometry.knuckleRadius,
          -TableGeometry.tableY + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      )
    }
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
    TableGeometry.pockets.pocketSW.knuckleNW
  ]

  static addToScene(scene) {
    TableGeometry.knuckles.forEach(k => this.cylinder(k, scene))
  }

  private static cylinder(knuckle, scene) {
    var geometry = new CylinderGeometry(knuckle.radius, knuckle.radius, 0.5, 8)
    var material = new MeshPhongMaterial({ color: 0x444400 })
    var mesh = new Mesh(geometry, material)
    mesh.position.copy(knuckle.pos)
    let m = new Matrix4()
    m.identity().makeRotationAxis(new Vector3(1, 0, 0), Math.PI / 2)
    mesh.geometry.applyMatrix(m)
    scene.add(mesh)
  }
}
