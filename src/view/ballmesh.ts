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
  InstancedMesh,
} from "three"
import { State } from "../model/ball"
import { norm, up, zero } from "./../utils/three-utils"
import { R } from "../model/physics/constants"
import { Trace } from "./trace"
import { BallMaterialFactory } from "./ballmaterialfactory"

export class BallMesh {
  private static _ballGeometry: IcosahedronGeometry
  private static _shadowGeometry: CircleGeometry
  private static _shadowMaterial: MeshBasicMaterial
  private static readonly _dottedGeometryCache = new Map<
    number,
    IcosahedronGeometry
  >()

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

  static createShadowMesh(count: number): InstancedMesh {
    return new InstancedMesh(
      this.getShadowGeometry(),
      this.getShadowMaterial(),
      count
    )
  }

  mesh: Mesh
  instanceId: number = -1
  shadowMesh: InstancedMesh | undefined
  spinAxisArrow: ArrowHelper
  trace: Trace
  color: Color
  constructor(color, label?: number) {
    this.color = new Color(color)
    this.initialiseMesh(this.color, label)
  }

  updateAll(ball, t) {
    this.updatePosition(ball.pos)
    const rvelLenSq = ball.rvel.lengthSq()

    if (this.spinAxisArrow.visible) {
      this.updateArrows(ball.pos, ball.rvel, rvelLenSq, ball.state)
    }

    if (rvelLenSq > 1e-8) {
      const rvelLen = Math.sqrt(rvelLenSq)
      this.updateRotation(ball.rvel, rvelLen, t)
      this.trace.addTrace(ball.pos, ball.vel)
    }
  }

  private static readonly _tempMatrix = new Matrix4()
  private static readonly _tempAxis = new Vector3()

  updatePosition(pos) {
    if (this.mesh.position.equals(pos)) return

    this.mesh.position.copy(pos)
    if (this.shadowMesh && this.instanceId !== -1) {
      BallMesh._tempMatrix.makeTranslation(pos.x, pos.y, pos.z)
      this.shadowMesh.setMatrixAt(this.instanceId, BallMesh._tempMatrix)
      this.shadowMesh.instanceMatrix.needsUpdate = true
    }
  }

  updateRotation(rvel, rvelLen, t) {
    const angle = rvelLen * t
    BallMesh._tempAxis.copy(rvel).divideScalar(rvelLen)
    this.mesh.rotateOnWorldAxis(BallMesh._tempAxis, angle)
  }

  updateArrows(pos, rvel, rvelLenSq, state) {
    const rvelLen = rvelLenSq > 1e-8 ? Math.sqrt(rvelLenSq) : 0
    this.spinAxisArrow.setLength(R + (R * rvelLen) / 2, R, R)
    this.spinAxisArrow.position.copy(pos)
    if (rvelLen > 0) {
      BallMesh._tempAxis.copy(rvel).divideScalar(rvelLen)
      this.spinAxisArrow.setDirection(BallMesh._tempAxis)
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
    if (label === undefined) {
      const key = color.getHex()
      let cached = BallMesh._dottedGeometryCache.get(key)
      if (!cached) {
        cached = new IcosahedronGeometry(R, 1)
        BallMesh.addDots(cached, color)
        BallMesh._dottedGeometryCache.set(key, cached)
      }
      geometry = cached
      material = BallMaterialFactory.createDottedMaterial(color)
    } else {
      geometry = BallMesh.getBallGeometry()
      material = BallMaterialFactory.createProjectedMaterial(label, color)
    }
    this.mesh = new Mesh(geometry, material)
    this.mesh.name = "ball"
    const randomRvel = new Vector3().random()
    this.updateRotation(randomRvel, randomRvel.length(), 100)

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
      BallMesh.colorVerticesForFace(
        i,
        verticies,
        BallMesh.scaleNoise(color.r),
        BallMesh.scaleNoise(color.g),
        BallMesh.scaleNoise(color.b)
      )
    }

    const red = new Color(0xaa2222)
    const dots = [0, 96, 111, 156, 186, 195]
    dots.forEach((i) => {
      BallMesh.colorVerticesForFace(i / 3, verticies, red.r, red.g, red.b)
    })
  }

  addToScene(scene) {
    scene.add(this.mesh)
    scene.add(this.spinAxisArrow)
    scene.add(this.trace.line)
  }

  private static colorVerticesForFace(face, verticies, r, g, b) {
    verticies.setXYZ(face * 3 + 0, r, g, b)
    verticies.setXYZ(face * 3 + 1, r, g, b)
    verticies.setXYZ(face * 3 + 2, r, g, b)
  }

  private static scaleNoise(v) {
    return (1 - Math.random() * 0.25) * v
  }
}
