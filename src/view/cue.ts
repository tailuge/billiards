import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import { Ball } from "../model/ball"
import { Math as Math2, Matrix4, Mesh, CylinderGeometry, MeshPhongMaterial, Raycaster } from "three"
import { up, upCross } from "../utils/utils"
import { AimEvent } from "../events/aimevent"

export class Cue {
    mesh: Mesh
    ball: Ball
    limit = 0.4
    maxPower = 3.0

    aim: AimEvent = new AimEvent()

    length = TableGeometry.tableX * 1

    private static material = new MeshPhongMaterial({
        color: 0x885577,
        wireframe: false,
        flatShading: false
    })

    constructor() {
        this.initialise(0.05, 0.15, this.length)
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
        this.mesh.rotation.z = this.aim.angle
    }

    rotateAim(angle) {
        this.aim.angle += angle
        this.aim.dir.applyAxisAngle(up, angle)
        this.mesh.rotation.z = this.aim.angle
    }

    adjustHeight(delta) {
        this.aim.verticalOffset = Math2.clamp(this.aim.verticalOffset + delta, -this.limit, this.limit)
        this.mesh.position.z = this.aim.verticalOffset
    }

    adjustSide(delta) {
        this.aim.sideOffset = Math2.clamp(this.aim.sideOffset + delta, -this.limit, this.limit)
    }

    adjustPower(delta) {
        this.aim.power = Math.min(this.maxPower, this.aim.power + delta)
    }

    hit(speed) {
        this.ball.vel.copy(this.aim.dir.clone().multiplyScalar(speed))
        let rvel = upCross(this.aim.dir).multiplyScalar((speed * this.aim.verticalOffset * 5) / 2)
        rvel.z = (-this.aim.sideOffset * 5) / 2
        this.ball.rvel.copy(rvel)
    }

    moveTo(pos) {
        let offset = upCross(this.aim.dir)
            .multiplyScalar(this.aim.sideOffset)
            .setZ(this.aim.verticalOffset)
        this.mesh.position.copy(pos.clone().add(offset))
    }

    t = 0
    update(t) {
        this.t += t
    }

    intersectsAnything(table: Table) {
        let origin = table.balls[0].pos
            .clone()
            .addScaledVector(this.aim.dir, -this.length / 2)
        origin.z = this.aim.verticalOffset
        let direction = this.aim.dir.clone().normalize()
        let raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
        let intersections = raycaster.intersectObjects(
            table.balls.map(b => b.mesh.mesh)
        )
        return intersections.length > 0
    }
}
