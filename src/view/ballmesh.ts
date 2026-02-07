import {
  IcosahedronGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  ArrowHelper,
  Color,
  BufferAttribute,
  Vector3,
  MeshStandardMaterial,
} from "three"
import { State } from "../model/ball"
import { norm, up, zero } from "./../utils/utils"
import { R } from "../model/physics/constants"
import { Trace } from "./trace"
import { BallMaterialFactory } from "./ballmaterialfactory"

export class BallMesh {
  private static _ballGeometry: IcosahedronGeometry
  private static _shadowGeometry: CircleGeometry
  private static _shadowMaterial: MeshBasicMaterial
  private static readonly _dottedGeometries: Map<number, IcosahedronGeometry> =
    new Map()

  private static getBallGeometry() {
    if (!this._ballGeometry) {
      this._ballGeometry = new IcosahedronGeometry(R, 1)
    }
    return this._ballGeometry
  }

  private static getShadowGeometry() {
    if (!this._shadowGeometry) {
      this._shadowGeometry = new CircleGeometry(R * 0.9, 9)
      this._shadowGeometry.applyMatrix4(
        new Matrix4().makeTranslation(0, 0, -R * 0.99)
      )
    }
    return this._shadowGeometry
  }

  private static getShadowMaterial() {
    if (!this._shadowMaterial) {
      this._shadowMaterial = new MeshBasicMaterial({ color: 0x111122 })
    }
    return this._shadowMaterial
  }

  mesh: Mesh
  shadow: Mesh
  spinAxisArrow: ArrowHelper
  trace: Trace
  color: Color

  private readonly _lastPos = new Vector3()
  private readonly _tempVec1 = new Vector3()
  private _lastState: State | undefined

  constructor(color, label?: number) {
    this.color = new Color(color)
    this.initialiseMesh(this.color, label)
  }

  updateAll(ball, t) {
    const inMotion = ball.inMotion()
    const posChanged = !this._lastPos.equals(ball.pos)

    if (!inMotion && !posChanged && this._lastState === ball.state) {
      return
    }

    this.updatePosition(ball.pos)
    this._lastPos.copy(ball.pos)
    this._lastState = ball.state

    const rvelLen = ball.rvel.length()
    const rvelNorm = rvelLen > 0 ? norm(ball.rvel, this._tempVec1) : null

    this.updateArrows(ball.pos, ball.state, rvelLen, rvelNorm)

    if (rvelLen > 0 && rvelNorm) {
      this.updateRotation(rvelLen, rvelNorm, t)
      this.trace.addTrace(ball.pos, ball.vel)
    }
  }

  updatePosition(pos) {
    this.mesh.position.copy(pos)
    this.shadow.position.copy(pos)
  }

  updateRotation(rvelLen, rvelNorm, t) {
    const angle = rvelLen * t
    this.mesh.rotateOnWorldAxis(rvelNorm, angle)
  }

  updateArrows(pos, state, rvelLen, rvelNorm) {
    this.spinAxisArrow.setLength(R + (R * rvelLen) / 2, R, R)
    this.spinAxisArrow.position.copy(pos)
    if (rvelNorm) {
      this.spinAxisArrow.setDirection(rvelNorm)
    }
    if (state == State.Rolling) {
      this.spinAxisArrow.setColor(0xcc0000)
    } else {
      this.spinAxisArrow.setColor(0x00cc00)
    }
  }

  initialiseMesh(color: Color, label?: number) {
    let geometry: IcosahedronGeometry
    let material: MeshPhongMaterial | MeshStandardMaterial
    if (label !== undefined) {
      geometry = BallMesh.getBallGeometry()
      material = BallMaterialFactory.createProjectedMaterial(label, color)
    } else {
      const hex = color.getHex()
      if (BallMesh._dottedGeometries.has(hex)) {
        geometry = BallMesh._dottedGeometries.get(hex)!
      } else {
        geometry = new IcosahedronGeometry(R, 1)
        BallMesh.addDots(geometry, color)
        BallMesh._dottedGeometries.set(hex, geometry)
      }
      material = BallMaterialFactory.createDottedMaterial(color)
    }
    this.mesh = new Mesh(geometry, material)
    this.mesh.name = "ball"
    const randomRvel = new Vector3().random()
    this.updateRotation(randomRvel.length(), norm(randomRvel, new Vector3()), 100)

    this.shadow = new Mesh(
      BallMesh.getShadowGeometry(),
      BallMesh.getShadowMaterial()
    )
    this.spinAxisArrow = new ArrowHelper(up, zero, 2, 0x000000, 0.01, 0.01)
    this.spinAxisArrow.visible = false
    this.trace = new Trace(500, color)
  }

  private static addDots(geometry, baseColor) {
    const count = geometry.attributes.position.count
    const color = new Color(baseColor)

    geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(count * 3), 3)
    )

    const verticies = geometry.attributes.color
    for (let i = 0; i < count / 3; i++) {
      this.colorVerticesForFace(
        i,
        verticies,
        this.scaleNoise(color.r),
        this.scaleNoise(color.g),
        this.scaleNoise(color.b)
      )
    }

    const red = new Color(0xaa2222)
    const dots = [0, 96, 111, 156, 186, 195]
    dots.forEach((i) => {
      this.colorVerticesForFace(i / 3, verticies, red.r, red.g, red.b)
    })
  }

  addToScene(scene) {
    scene.add(this.mesh)
    scene.add(this.shadow)
    scene.add(this.spinAxisArrow)
    scene.add(this.trace.line)
  }

  private static colorVerticesForFace(face, verticies, r, g, b) {
    verticies.setXYZ(face * 3 + 0, r, g, b)
    verticies.setXYZ(face * 3 + 1, r, g, b)
    verticies.setXYZ(face * 3 + 2, r, g, b)
  }

  private static scaleNoise(v) {
    return (1.0 - Math.random() * 0.25) * v
  }
}
