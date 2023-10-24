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
} from "three"
import { State } from "../model/ball"
import { norm, up, zero } from "./../utils/utils"
import { R } from "../model/physics/constants"
import { Trace } from "./trace"

export class BallMesh {
  mesh: Mesh
  shadow: Mesh
  spinAxisArrow: ArrowHelper
  trace: Trace
  color: Color
  constructor(color) {
    this.color = new Color(color)
    this.initialiseMesh(color)
  }

  updateAll(ball, t) {
    this.updatePosition(ball.pos)
    this.updateArrows(ball.pos, ball.rvel, ball.state)
    if (ball.rvel.lengthSq() !== 0) {
      this.updateRotation(ball.rvel, t)
      this.trace.addTrace(ball.pos, ball.vel)
    }
  }

  updatePosition(pos) {
    this.mesh.position.copy(pos)
    this.shadow.position.copy(pos)
  }

  readonly m = new Matrix4()

  updateRotation(rvel, t) {
    const angle = rvel.length() * t
    this.mesh.rotateOnWorldAxis(norm(rvel), angle)
  }

  updateArrows(pos, rvel, state) {
    this.spinAxisArrow.setLength(R + (R * rvel.length()) / 2, R, R)
    this.spinAxisArrow.position.copy(pos)
    this.spinAxisArrow.setDirection(norm(rvel))
    if (state == State.Rolling) {
      this.spinAxisArrow.setColor(0xcc0000)
    } else {
      this.spinAxisArrow.setColor(0x00cc00)
    }
  }

  initialiseMesh(color) {
    const geometry = new IcosahedronGeometry(R, 1)
    const material = new MeshPhongMaterial({
      emissive: 0,
      flatShading: true,
      vertexColors: true,
      forceSinglePass: true,
      shininess: 25,
      specular: 0x555533,
    })
    this.addDots(geometry, color)
    this.mesh = new Mesh(geometry, material)
    this.mesh.name = "ball"
    this.updateRotation(new Vector3().random(), 100)

    const shadowGeometry = new CircleGeometry(R * 0.9, 9)
    shadowGeometry.applyMatrix4(
      new Matrix4().identity().makeTranslation(0, 0, -R * 0.99)
    )
    const shadowMaterial = new MeshBasicMaterial({ color: 0x111122 })
    this.shadow = new Mesh(shadowGeometry, shadowMaterial)
    this.spinAxisArrow = new ArrowHelper(up, zero, 2, 0x000000, 0.01, 0.01)
    this.spinAxisArrow.visible = false
    this.trace = new Trace(500, color)
  }

  addDots(geometry, baseColor) {
    const count = geometry.attributes.position.count
    const color = new Color(baseColor)
    const red = new Color(0xaa2222)

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

  private colorVerticesForFace(face, verticies, r, g, b) {
    verticies.setXYZ(face * 3 + 0, r, g, b)
    verticies.setXYZ(face * 3 + 1, r, g, b)
    verticies.setXYZ(face * 3 + 2, r, g, b)
  }

  private scaleNoise(v) {
    return (1.0 - Math.random() * 0.25) * v
  }
}
