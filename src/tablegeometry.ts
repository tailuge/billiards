import { Cushion } from "./cushion"
import { Vector3, Matrix4 } from "three"
import { Mesh, CylinderGeometry, MeshPhongMaterial } from "three"

export class TableGeometry {
  static tableX = 21
  static tableY = 11

  knuckleInset = 1
  knuckleRadius = 0.5
  middleKnuckleInset = 1
  middleKnuckleRadius = 0.25

  pockets = {
    pocketNW: {
      knuckleNE: {
        pos: new Vector3(
          -Cushion.tableX + this.knuckleInset,
          Cushion.tableY + this.knuckleRadius,
          0
        ),
        radius: this.knuckleRadius
      },
      knuckleSW: {
        pos: new Vector3(
          -Cushion.tableX - this.knuckleRadius,
          Cushion.tableY - this.knuckleInset,
          0
        ),
        radius: this.knuckleRadius
      }
    },
    pocketN: {
      knuckleNE: {
        pos: new Vector3(
          this.knuckleInset,
          Cushion.tableY + this.middleKnuckleRadius,
          0
        ),
        radius: this.knuckleRadius
      },
      knuckleNW: {
        pos: new Vector3(
          -this.middleKnuckleInset,
          Cushion.tableY + this.middleKnuckleRadius,
          0
        ),
        radius: this.knuckleRadius
      }
    },
    pocketS: {
      knuckleSE: {
        pos: new Vector3(
          this.knuckleInset,
          -Cushion.tableY - this.middleKnuckleRadius,
          0
        ),
        radius: this.knuckleRadius
      },
      knuckleSW: {
        pos: new Vector3(
          -this.middleKnuckleInset,
          -Cushion.tableY - this.middleKnuckleRadius,
          0
        ),
        radius: this.knuckleRadius
      }
    }
  }
  
  addToScene(scene) {
    this.cylinder(this.knuckleRadius, this.pockets.pocketNW.knuckleNE.pos, scene)
    this.cylinder(this.knuckleRadius, this.pockets.pocketNW.knuckleSW.pos, scene)
    this.cylinder(this.middleKnuckleRadius, this.pockets.pocketN.knuckleNW.pos, scene)
    this.cylinder(this.middleKnuckleRadius, this.pockets.pocketN.knuckleNE.pos, scene)
    this.cylinder(this.middleKnuckleRadius, this.pockets.pocketS.knuckleSW.pos, scene)
    this.cylinder(this.middleKnuckleRadius, this.pockets.pocketS.knuckleSE.pos, scene)
  }
  
  private cylinder(radius,position,scene) {
    var geometry = new CylinderGeometry(radius, radius, 1, 8 )
    var material = new MeshPhongMaterial({color: 0x444400})
    var mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    let m = new Matrix4()
    m.identity().makeRotationAxis(new Vector3(1,0,0), Math.PI/2)
    mesh.geometry.applyMatrix(m)
    scene.add(mesh)
  }
}
