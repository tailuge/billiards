import { TableGeometry } from "./tablegeometry"
import { Table } from "./table"
import { Ball } from "./ball"
import { Math as Math2, Vector3, Matrix4 } from "three"
import { Mesh, CylinderGeometry, MeshPhongMaterial, Raycaster } from "three"
import { up, upCross } from "./utils"

export class Cue {
  mesh: Mesh
  ball: Ball
  aim = new Vector3(1, 0, 0)
  angle = 0
  limit = 0.4
  height = this.limit
  side = 0
  length = TableGeometry.tableX * 1

  private static material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false
  })

  constructor() {
    this.initialise(0.05, 0.1, this.length)
  }

  setCueBall(ball) {
    this.ball = ball
  }

  private initialise(tip, but, length) {
    var geometry = new CylinderGeometry(tip, but, length, 16)
    this.mesh = new Mesh(geometry, Cue.material)
    this.mesh.castShadow = true
    this.mesh.geometry
      .applyMatrix(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix(
        new Matrix4().identity().makeTranslation(-length / 2 - 1, 0, 0)
      )
    this.mesh.rotation.z = this.angle
  }

  rotateAim(angle) {
    this.angle += angle
    this.aim.applyAxisAngle(up, angle)
    this.mesh.rotation.z = this.angle
  }

  adjustHeight(delta) {
    this.height = Math2.clamp(this.height + delta, -this.limit, this.limit)
    this.mesh.position.z = this.height
  }

  adjustSide(delta) {
    this.side = Math2.clamp(this.side + delta, -this.limit, this.limit)
    this.moveToCueBall()
  }

  hit(speed) {
    this.ball.vel.copy(this.aim.clone().multiplyScalar(speed))
    let rvel = upCross(this.aim).multiplyScalar((speed * this.height * 5) / 2)
    rvel.z = (-this.side * 5) / 2
    this.ball.rvel.copy(rvel)
  }

  moveToCueBall() {
    let offset = upCross(this.aim)
      .multiplyScalar(this.side)
      .setZ(this.height)
    this.mesh.position.copy(this.ball.pos.clone().add(offset))
  }

  t = 0
  update(t) {
    this.t += t
  }

  intersectsAnything(table: Table) {
    let origin = table.balls[0].pos
      .clone()
      .addScaledVector(this.aim, -this.length / 2)
    origin.z = this.height
    let direction = this.aim.clone().normalize()
    let raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    let intersections = raycaster.intersectObjects(
      table.balls.map(b => b.mesh.mesh)
    )
    return intersections.length > 0
  }
}
